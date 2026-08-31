import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { generateImage } from "@/lib/aiGenerator";
import { uploadGenerationAssets } from "@/lib/aiGenStorage";
import { buildPatchPrompt, scrubPromptInjection } from "@/lib/patchPrompt";
import { checkBlocklist } from "@/lib/aiGenBlocklist";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * WEBSIT_4.MD G1 — POST /api/ai-patch/generate
 *
 * Body:
 *   sessionId           string  required - signed cookie value from the chat UI
 *   prompt              string  required - the customer's text
 *   presets             object  optional - { shape, border, style, colors }
 *   parentGenerationId  string  optional - links a Refine to its parent
 *
 * Flow:
 *   1. Validate body
 *   2. Scrub prompt for injection patterns (structural guard, not moderation)
 *   3. Build the patch-style prompt + negative
 *   4. INSERT pending row in ai_generations so we have a permanent audit
 *      even if the provider call dies mid-flight
 *   5. Call provider (mock or fal)
 *   6. On success: watermark, upload BOTH versions to storage, UPDATE row
 *   7. On failure: UPDATE row with status='failed' and the error
 *   8. Return { generationId, imageUrl, status }
 *
 * NOT in this route (per scope notes):
 *   - G5 gating (1 free per anon, email gate) — still unwired. Note that
 *     `sessionId` is documented as a signed cookie value but NOTHING signs or
 *     verifies it; it is an arbitrary client string. Per-session gating cannot
 *     be built on it until it is actually signed.
 *   - G6 quote handoff                         — separate route
 *
 * Wired since: G2 moderation (checkBlocklist, below) and the G5 daily budget
 * kill switch (assertDailyBudget, below).
 *
 * Hardening already present:
 *   - 60s generator timeout (in aiGenerator.ts)
 *   - 10 generations/hour/IP at the edge (proxy.ts). That route now FAILS
 *     CLOSED with a 503 if Redis is unavailable, rather than silently allowing
 *     uncapped paid generations.
 *   - Daily USD budget cap (below), which is what stops rotating IPs
 *   - All errors return JSON, never 5xx HTML
 *   - generationId is generated server-side so the client cannot forge it
 *   - Storage uploads use service role, never the anon key
 */

/**
 * Daily spend ceiling, in USD. The per-IP edge limit caps ONE caller; it does
 * nothing against rotating IPs, which is the shape real abuse takes. This is
 * the global backstop.
 *
 * Default is deliberately low relative to real usage: the whole feature has
 * spent $0.48 across 160 generations since June 2026, so $5/day is ~1,600
 * images at the current model — far beyond any honest day, and still a small
 * bill if someone finds the endpoint.
 *
 * It is a USD figure rather than a request count on purpose. Model choice
 * drives cost 27x (flux/schnell $0.003 -> ideogram/v3 $0.08), so a request
 * count would quietly stop protecting the budget the day AI_GEN_MODEL changes.
 */
const DAILY_BUDGET_USD = Number(process.env.AI_GEN_DAILY_BUDGET_USD ?? 5);

type BudgetVerdict = { ok: true } | { ok: false; spent: number };

/**
 * Sum today's recorded spend. `cost_usd` is written on success AND on failure
 * (fal bills for some 5xx), so this reflects money actually committed.
 *
 * Fails OPEN on a query error, by design: the very next statement is an INSERT
 * against the same database, so a DB outage already fails the request. Failing
 * closed here would only turn a clear 500 into a misleading "budget exceeded".
 */
async function assertDailyBudget(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
): Promise<BudgetVerdict> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("ai_generations")
    .select("cost_usd")
    .gte("created_at", since.toISOString());

  if (error) {
    console.error("[ai-patch/generate] budget check failed, allowing:", error);
    return { ok: true };
  }

  const spent = (data ?? []).reduce(
    (sum, row: { cost_usd: number | null }) => sum + (row.cost_usd ?? 0),
    0,
  );

  if (spent >= DAILY_BUDGET_USD) {
    console.error(
      `[ai-patch/generate] DAILY BUDGET REACHED: $${spent.toFixed(4)} spent today ` +
      `against a $${DAILY_BUDGET_USD} cap. Generation is blocked until UTC midnight. ` +
      `Raise AI_GEN_DAILY_BUDGET_USD if this is legitimate demand.`,
    );
    return { ok: false, spent };
  }

  return { ok: true };
}

const RequestSchema = z.object({
  sessionId: z.string().min(1).max(128),
  prompt: z.string().min(1).max(2000),
  presets: z
    .object({
      shape: z.enum(["square", "circle", "shield", "oval", "rectangle", "die-cut", "free-form"]).optional(),
      border: z.enum(["merrowed", "satin", "none", "raised"]).optional(),
      style: z.enum(["embroidered", "chenille", "pvc", "woven"]).optional(),
      colors: z.enum(["<=4", "<=7", "unlimited"]).optional(),
    })
    .optional(),
  parentGenerationId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }
  const { sessionId, prompt, presets, parentGenerationId } = parsed.data;

  // G2 — patch-industry content blocklist. Runs BEFORE any DB row or credit.
  const cleanedPrompt = scrubPromptInjection(prompt);
  const blockResult = checkBlocklist(cleanedPrompt);
  if (blockResult.blocked) {
    return NextResponse.json(
      { ok: false, error: blockResult.userMessage },
      { status: 422 }
    );
  }
  const { builtPrompt, negativePrompt, resolvedPresets } = buildPatchPrompt({
    userPrompt: cleanedPrompt,
    presets,
  });

  const supabase = createSupabaseAdminClient();

  // Budget gate runs BEFORE the pending row so a blocked request costs nothing
  // and leaves no misleading 'pending' audit entry.
  const budget = await assertDailyBudget(supabase);
  if (!budget.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Our AI concept generator has hit today's limit. It resets at midnight UTC — " +
          "or send us your idea and a designer will draw it for you.",
      },
      { status: 503, headers: { "Retry-After": "3600" } },
    );
  }

  const generationId = randomUUID();

  // Step 4: pending row so we never lose track of a generation attempt.
  // status flips to 'succeeded' | 'failed' once the provider returns.
  const { error: insertErr } = await supabase.from("ai_generations").insert({
    id: generationId,
    session_id: sessionId,
    prompt: cleanedPrompt,
    built_prompt: builtPrompt,
    presets: resolvedPresets,
    provider: "pending",
    model: "pending",
    parent_generation_id: parentGenerationId || null,
    status: "pending",
  });

  if (insertErr) {
    console.error("[ai-patch/generate] insert pending row failed:", insertErr);
    return NextResponse.json(
      { ok: false, error: "Could not start generation" },
      { status: 500 }
    );
  }

  // Step 5: provider call. Failures are returned as result objects; the
  // module itself never throws.
  const result = await generateImage({
    builtPrompt,
    negativePrompt,
  });

  if (!result.ok) {
    await supabase
      .from("ai_generations")
      .update({
        provider: result.provider,
        model: result.model,
        status: "failed",
        error_message: result.errorMessage,
        cost_usd: result.costUsd,
      })
      .eq("id", generationId);

    // 502 because the upstream provider failed, not us.
    return NextResponse.json(
      {
        ok: false,
        generationId,
        error: result.errorMessage,
      },
      { status: 502 }
    );
  }

  // Watermark removed (June 2026): the AI concept preview now serves the clean
  // render. The tiled text watermark could not render on Vercel's serverless
  // runtime (no system fonts, so sharp drew tofu boxes), and the page already
  // states the image is an AI concept our designers refine before production.
  // The browser preview and the team-facing clean file are now the same bytes,
  // which also removes the sharp watermark step as a point of failure.
  const watermarked = result.imageBytes;

  let upload;
  try {
    upload = await uploadGenerationAssets(generationId, result.imageBytes, watermarked);
  } catch (err) {
    await supabase
      .from("ai_generations")
      .update({
        provider: result.provider,
        model: result.model,
        status: "failed",
        error_message: err instanceof Error ? err.message : "storage upload failed",
        cost_usd: result.costUsd,
      })
      .eq("id", generationId);
    return NextResponse.json(
      { ok: false, generationId, error: "Could not save image" },
      { status: 500 }
    );
  }

  // Step 7: mark succeeded.
  await supabase
    .from("ai_generations")
    .update({
      provider: result.provider,
      model: result.model,
      status: "succeeded",
      storage_path_clean: upload.cleanPath,
      storage_path_watermarked: upload.watermarkedPath,
      width: result.width,
      height: result.height,
      cost_usd: result.costUsd,
    })
    .eq("id", generationId);

  return NextResponse.json({
    ok: true,
    generationId,
    imageUrl: upload.watermarkedPublicUrl,
    width: result.width,
    height: result.height,
    presets: resolvedPresets,
    provider: result.provider,
    model: result.model,
  });
}
