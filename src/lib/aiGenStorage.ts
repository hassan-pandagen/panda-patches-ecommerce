import "server-only";

/**
 * WEBSIT_4.MD G1 — Supabase Storage helper for AI Patch Generator.
 *
 * Uploads BOTH the clean and watermarked PNGs into the `ai-generations`
 * bucket under predictable paths:
 *
 *   ai-generations/clean/{generationId}.png         (un-watermarked, used by G6 quote)
 *   ai-generations/preview/{generationId}.png       (watermarked, served to the browser)
 *
 * Two separate paths so we can cleanly delete one without the other and so
 * the public URL the chat UI receives never leaks the clean version.
 */

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const BUCKET = "ai-generations";

export type UploadedPaths = {
  cleanPath: string;
  watermarkedPath: string;
  watermarkedPublicUrl: string;
};

/**
 * Upload both versions of the generated image. Returns the storage paths
 * (for persistence on ai_generations row) and the public URL of the
 * watermarked preview (for immediate display in the chat UI).
 *
 * The clean PNG public URL is intentionally NOT returned — callers that
 * need it (G6 quote handoff) resolve it server-side via
 * `getCleanPublicUrl(cleanPath)` so the value never crosses the wire to
 * an unauthenticated browser session.
 */
export async function uploadGenerationAssets(
  generationId: string,
  cleanBytes: Uint8Array,
  watermarkedBytes: Uint8Array
): Promise<UploadedPaths> {
  const supabase = createSupabaseAdminClient();

  const cleanPath = `clean/${generationId}.png`;
  const watermarkedPath = `preview/${generationId}.png`;

  // upsert: true so retries with the same generationId overwrite cleanly.
  // contentType pinned to PNG so the bucket allowed_mime_types filter
  // accepts the blob (set in the sql/ai_generations.sql migration).
  const [{ error: cleanErr }, { error: wmErr }] = await Promise.all([
    supabase.storage
      .from(BUCKET)
      .upload(cleanPath, cleanBytes, {
        contentType: "image/png",
        upsert: true,
      }),
    supabase.storage
      .from(BUCKET)
      .upload(watermarkedPath, watermarkedBytes, {
        contentType: "image/png",
        upsert: true,
      }),
  ]);

  if (cleanErr) {
    throw new Error(`Clean upload failed: ${cleanErr.message}`);
  }
  if (wmErr) {
    throw new Error(`Watermark upload failed: ${wmErr.message}`);
  }

  const { data: publicData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(watermarkedPath);

  return {
    cleanPath,
    watermarkedPath,
    watermarkedPublicUrl: publicData.publicUrl,
  };
}

/**
 * Resolve the clean public URL. Server-only; do not leak the return value
 * to anonymous browser sessions. Used by G6 when attaching the design to a
 * quote.
 */
export function getCleanPublicUrl(cleanPath: string): string {
  const supabase = createSupabaseAdminClient();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(cleanPath);
  return data.publicUrl;
}

/**
 * Delete both assets for a generation. Used by the 30-day TTL cleanup cron
 * and on hard-failure rollback when the row never made it to persisted state.
 */
export async function deleteGenerationAssets(
  cleanPath: string | null,
  watermarkedPath: string | null
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const paths = [cleanPath, watermarkedPath].filter(
    (p): p is string => typeof p === "string" && p.length > 0
  );
  if (paths.length === 0) return;
  await supabase.storage.from(BUCKET).remove(paths);
}
