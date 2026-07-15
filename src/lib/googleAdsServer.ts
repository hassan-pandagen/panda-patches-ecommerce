/**
 * DEPRECATED — legacy Google Ads API `UploadClickConversions` path. DO NOT
 * re-enable without re-reading claude-code-task-datamanager-migration.md first.
 *
 * Traced 2026-07-15: this endpoint returns `CUSTOMER_NOT_ALLOWLISTED_FOR_THIS_FEATURE`
 * for this account. Per Google's May 2026 developer blog, the Ads API stopped
 * accepting NEW adopters for offline conversion imports as of 2026-06-15 — only
 * accounts that had already imported between Dec 2025–May 2026 are grandfathered.
 * This account was not, so `uploadClickConversions` can never succeed here. There
 * is no allowlisting path. (An earlier pass in this file bumped the API version
 * from a sunset v19 to v22, which was necessary to even SEE this real error — the
 * sunset version was masking it behind a generic 404 — but the account block is
 * the actual, permanent blocker.)
 *
 * Replacement: the `public.google_ads_data_manager_export` Postgres view
 * (migration: google_ads_data_manager_direct_postgres_export), read by a
 * dedicated locked-down role (`google_ads_data_manager_ro`, SELECT on that one
 * view only). A human connects it directly in Google Ads UI → Tools → Data
 * Manager as a scheduled PostgreSQL source — no relay code needed, Data Manager
 * polls Supabase on its own schedule. See the task file for the full trace,
 * the security reasoning (why direct-DB over a Sheets relay), and the human
 * connection-setup steps.
 *
 * This function is kept as a no-op stub (rather than deleted) so the Square
 * webhook's call site doesn't need touching and so anyone finding it later sees
 * why it's dead instead of a silently-failing retry loop.
 */

export interface GoogleAdsPurchaseInput {
  orderId: string;
  value: number;
  currency?: string;
  conversionDateTime: Date;
  email?: string | null;
  phone?: string | null;
  gclid?: string | null;
  wbraid?: string | null;
  gbraid?: string | null;
  gclidCapturedAt?: string | null;
}

export async function sendGoogleAdsPurchase(
  input: GoogleAdsPurchaseInput
): Promise<{ success: boolean; error?: string }> {
  console.warn(
    '[GOOGLE ADS] sendGoogleAdsPurchase is deprecated (CUSTOMER_NOT_ALLOWLISTED_FOR_THIS_FEATURE — ' +
    'see claude-code-task-datamanager-migration.md). Order', input.orderId,
    'is exported instead via the google_ads_data_manager_export Postgres view.'
  );
  return { success: false, error: 'deprecated_use_data_manager_export' };
}
