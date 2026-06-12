import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * WEBSIT_4.MD G6 — Step 1 of the conversion funnel.
 *
 * When a visitor decides a generated design "looks good" and opens the
 * order/quote modal, the browser calls this FIRST. We:
 *
 *   1. Copy the clean (un-watermarked) PNG out of the disposable
 *      `ai-generations` bucket into the permanent `customer-artwork`
 *      bucket (the same bucket every other quote-form upload lives in).
 *      This is what makes the ai-generations bucket safe to wipe on the
 *      30-day cron: anything that converted already lives elsewhere.
 *   2. Stamp the customer's email on the generation row (+ its parents)
 *      for conversion analytics and future gating (G5).
 *   3. Return the permanent clean URL + the product page that matches the
 *      design's style, so the modal can submit the quote with the artwork
 *      attached and offer a "continue to live calculator" path.
 *
 * The browser then POSTs /api/quote directly (step 2) with
 * artworkUrl = cleanUrl — reusing the existing battle-tested quote
 * pipeline: internal email to lance@, Supabase quotes insert, Meta CAPI
 * Lead event, attribution capture. Nothing is duplicated here.
 */

const BodySchema = z.object({
  generationId: z.string().uuid(),
  email: z.string().email().max(255),
});

const SOURCE_BUCKET = "ai-generations";
const DEST_BUCKET = "customer-artwork";

// style preset -> live product page with the calculator above the fold.
const STYLE_TO_PRODUCT: Record<string, { patchType: string; productPath: string }> = {
  embroidered: {
    patchType: "Custom Embroidered Patches",
    productPath: "/custom-patches/embroidered",
  },
  chenille: {
    patchType: "Custom Chenille Patches",
    productPath: "/custom-patches/chenille",
  },
  pvc: {
    patchType: "Custom PVC Patches",
    productPath: "/custom-patches/pvc",
  },
  woven: {
    patchType: "Custom Woven Patches",
    productPath: "/custom-patches/woven",
  },
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }
  const { generationId, email } = parsed.data;

  const supabase = createSupabaseAdminClient();

  const { data: gen, error: genErr } = await supabase
    .from("ai_generations")
    .select("id, status, storage_path_clean, prompt, presets, parent_generation_id")
    .eq("id", generationId)
    .maybeSingle();

  if (genErr || !gen) {
    return NextResponse.json({ ok: false, error: "Design not found" }, { status: 404 });
  }
  if (gen.status !== "succeeded" || !gen.storage_path_clean) {
    return NextResponse.json(
      { ok: false, error: "This design is not ready yet" },
      { status: 409 }
    );
  }

  // Copy clean PNG into the permanent bucket. Download + re-upload rather
  // than storage.copy() because copy() cannot cross buckets.
  const { data: blob, error: dlErr } = await supabase.storage
    .from(SOURCE_BUCKET)
    .download(gen.storage_path_clean);

  if (dlErr || !blob) {
    console.error("[prepare-handoff] clean download failed:", dlErr);
    return NextResponse.json(
      { ok: false, error: "Could not prepare the design file" },
      { status: 500 }
    );
  }

  const destPath = `ai-designs/${generationId}.png`;
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const { error: upErr } = await supabase.storage
    .from(DEST_BUCKET)
    .upload(destPath, bytes, { contentType: "image/png", upsert: true });

  if (upErr) {
    console.error("[prepare-handoff] artwork copy failed:", upErr);
    return NextResponse.json(
      { ok: false, error: "Could not save the design file" },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(DEST_BUCKET).getPublicUrl(destPath);
  const cleanUrl = pub.publicUrl;

  // Conversion analytics: stamp the email on this row and its refine parent
  // so the funnel report can join generations -> quotes by email later.
  // Failure here should never block the customer's quote.
  try {
    await supabase.from("ai_generations").update({ email }).eq("id", generationId);
    if (gen.parent_generation_id) {
      await supabase
        .from("ai_generations")
        .update({ email })
        .eq("id", gen.parent_generation_id);
    }
  } catch (err) {
    console.error("[prepare-handoff] email stamp failed:", err);
  }

  const style = String((gen.presets as { style?: string })?.style || "embroidered");
  const mapping = STYLE_TO_PRODUCT[style] || STYLE_TO_PRODUCT.embroidered;

  return NextResponse.json({
    ok: true,
    cleanUrl,
    patchType: mapping.patchType,
    productPath: mapping.productPath,
    prompt: gen.prompt,
  });
}
