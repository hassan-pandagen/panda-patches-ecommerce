import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteGenerationAssets } from "@/lib/aiGenStorage";

/**
 * WEBSIT_4.MD — 30-day TTL cleanup for the disposable ai-generations bucket.
 *
 * Strategy (agreed June 2026): the ai-generations bucket is fully disposable.
 * The moment a visitor converts (order/quote intent in the handoff modal),
 * /api/ai-patch/prepare-handoff copies the clean PNG into the permanent
 * customer-artwork bucket. So nothing in ai-generations ever needs to
 * survive long-term.
 *
 * For every generation older than 30 days:
 *   - Storage assets (clean + watermarked) are ALWAYS deleted.
 *   - The DB row is deleted too when it never converted
 *     (email IS NULL AND quote_id IS NULL).
 *   - Converted rows are KEPT with their storage paths nulled, so the
 *     funnel analytics (prompt, presets, cost, email, lineage) survive
 *     while the storage bill does not.
 *
 * Auth: CRON_SECRET bearer token, same convention as the abandoned-cart
 * cron. Scheduled daily at 04:00 UTC via vercel.json.
 */

const BATCH_SIZE = 100;

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Anything old that still has assets on disk, converted or not.
  const { data: stale, error } = await supabase
    .from("ai_generations")
    .select("id, email, quote_id, storage_path_clean, storage_path_watermarked")
    .lt("created_at", cutoff)
    .or("storage_path_clean.not.is.null,storage_path_watermarked.not.is.null")
    .limit(BATCH_SIZE);

  if (error) {
    console.error("[cleanup-ai-generations] select failed:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (!stale || stale.length === 0) {
    return NextResponse.json({ ok: true, assetsPurged: 0, rowsDeleted: 0, cutoff });
  }

  let assetsPurged = 0;
  let rowsDeleted = 0;
  let rowsKept = 0;
  const failures: string[] = [];

  for (const row of stale) {
    try {
      await deleteGenerationAssets(row.storage_path_clean, row.storage_path_watermarked);
      assetsPurged += 1;

      const converted = row.email !== null || row.quote_id !== null;
      if (converted) {
        // Keep the row for funnel analytics; just drop the dead paths.
        const { error: updErr } = await supabase
          .from("ai_generations")
          .update({ storage_path_clean: null, storage_path_watermarked: null })
          .eq("id", row.id);
        if (updErr) failures.push(`${row.id}: ${updErr.message}`);
        else rowsKept += 1;
      } else {
        const { error: delErr } = await supabase
          .from("ai_generations")
          .delete()
          .eq("id", row.id);
        if (delErr) failures.push(`${row.id}: ${delErr.message}`);
        else rowsDeleted += 1;
      }
    } catch (err) {
      failures.push(`${row.id}: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  return NextResponse.json({
    ok: true,
    cutoff,
    assetsPurged,
    rowsDeleted,
    rowsKept,
    failures: failures.length > 0 ? failures.slice(0, 5) : undefined,
    moreRemaining: stale.length === BATCH_SIZE,
  });
}

// Vercel cron sends GET. Mirror POST so both work.
export const GET = POST;
