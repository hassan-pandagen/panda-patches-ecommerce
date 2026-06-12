import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { generateImage } from "@/lib/aiGenerator";
import { applyWatermark } from "@/lib/watermark";
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
 *   - G2 moderation (blocklist + NSFW)        — wired in next slice
 *   - G5 gating (1 free per anon, email gate) — wired in next slice
 *   - G5 daily budget kill switch              — wired in next slice
 *   - G6 quote handoff                         — separate route
 *
 * Hardening already present:
 *   - 60s generator timeout (in aiGenerator.ts)
 *   - All errors return JSON, never 5xx HTML
 *   - generationId is generated server-side so the client cannot forge it
 *   - Storage uploads use service role, never the anon key
 */

const RequestSchema = z.object({
  sessionId: z.string().min(1).max(128),
  prompt: z.string().min(1).max(2000),
  presets: z
    .object({
      shape: z.enum(["square", "circle", "shield", "oval", "rectangle", "die-cut"]).optional(),
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

  // Step 6: watermark + upload. We compute both buffers concurrently with
  // the upload helper — the watermark CPU work overlaps the storage round-trip.
  let watermarked: Uint8Array;
  try {
    watermarked = await applyWatermark(result.imageBytes);
  } catch (err) {
    await supabase
      .from("ai_generations")
      .update({
        provider: result.provider,
        model: result.model,
        status: "failed",
        error_message: `watermark step failed: ${err instanceof Error ? err.message : "unknown"}`,
        cost_usd: result.costUsd,
      })
      .eq("id", generationId);
    return NextResponse.json(
      { ok: false, generationId, error: "Could not finalize image" },
      { status: 500 }
    );
  }

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
