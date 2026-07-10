import crypto from 'crypto';

/**
 * Server-side Google Ads offline click conversion upload (uploadClickConversions).
 *
 * Complements the browser-side Enhanced Conversions fire in PurchaseConversion.tsx
 * (googleAds.ts): that one only lands if the buyer's browser returns to /success
 * with GTM able to fire — it misses closed tabs, ad blockers, and cases where the
 * webhook hasn't landed yet when they land on /success (paymentPending). This call
 * runs from the Square webhook itself, same as the Meta CAPI / GA4 MP server sends
 * next to it, so the conversion records even when the buyer never comes back.
 *
 * No-ops (never throws into the webhook) until a human completes CLAUDE_1.MD Task 4:
 * Google Ads API OAuth client + developer token, with the resulting env vars set.
 * Reuses the CRM's existing "Quote Converted to Order (CRM)" conversion action
 * (GADS_ACTION_ID_ORDER) — no separate conversion action needed for this path.
 */

const API_VERSION = 'v19';
const CUSTOMER_ID = (process.env.GADS_CUSTOMER_ID || '8947440123').replace(/-/g, '');
const GCLID_MAX_AGE_DAYS = 90;

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

// Google requires E.164 (leading "+") before hashing — different from Meta CAPI's
// digits-only spec, so this intentionally does not share metaCapi.ts's hashPhone.
function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  return '+1' + digits.replace(/^1/, '');
}

// Google wants "yyyy-mm-dd hh:mm:ss+00:00".
function formatConversionDateTime(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ') + '+00:00';
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.GADS_CLIENT_ID;
  const clientSecret = process.env.GADS_CLIENT_SECRET;
  const refreshToken = process.env.GADS_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.access_token) {
    console.error('[GOOGLE ADS] OAuth token refresh failed', res.status, json);
    return null;
  }
  return json.access_token as string;
}

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
  /** ISO capture time of the click id, for the 90-day staleness check. */
  gclidCapturedAt?: string | null;
}

export async function sendGoogleAdsPurchase(
  input: GoogleAdsPurchaseInput
): Promise<{ success: boolean; error?: string }> {
  const developerToken = process.env.GADS_DEVELOPER_TOKEN;
  // Same "Quote Converted to Order (CRM)" conversion action the CRM's edge function
  // uploads to (Task 3) — Square website checkouts and CRM-converted quotes are
  // disjoint order populations (the webhook deletes, never converts, a matching
  // WEBSITE_LEAD quote), so sharing one Purchase-category action is correct, not
  // double-counting.
  const actionId = process.env.GADS_ACTION_ID_ORDER;
  if (!developerToken || !actionId) {
    console.warn('[GOOGLE ADS] Not configured (missing developer token / conversion action id), skipping', input.orderId);
    return { success: false, error: 'not_configured' };
  }

  // Drop a stale click id — Google rejects conversions older than 90 days outright;
  // fall back to hashed identifiers (Enhanced Conversions) instead.
  let { gclid, wbraid, gbraid } = input;
  if (input.gclidCapturedAt) {
    const ageDays = (Date.now() - new Date(input.gclidCapturedAt).getTime()) / 86_400_000;
    if (ageDays > GCLID_MAX_AGE_DAYS) {
      gclid = null;
      wbraid = null;
      gbraid = null;
    }
  }

  const userIdentifiers: Record<string, string>[] = [];
  if (input.email) userIdentifiers.push({ hashedEmail: sha256(normalizeEmail(input.email)) });
  if (input.phone) userIdentifiers.push({ hashedPhoneNumber: sha256(normalizePhone(input.phone)) });

  if (!gclid && !wbraid && !gbraid && !userIdentifiers.length) {
    return { success: false, error: 'no_identifiers' };
  }

  const token = await getAccessToken();
  if (!token) return { success: false, error: 'no_token' };

  const conversion: Record<string, unknown> = {
    conversionAction: `customers/${CUSTOMER_ID}/conversionActions/${actionId}`,
    conversionDateTime: formatConversionDateTime(input.conversionDateTime),
    conversionValue: input.value,
    currencyCode: input.currency || 'USD',
    // Google dedupes uploadClickConversions on orderId, so a retried webhook
    // delivery (or an overlapping manual re-run) can't double-record revenue.
    orderId: input.orderId,
  };
  if (gclid) conversion.gclid = gclid;
  else if (wbraid) conversion.wbraid = wbraid;
  else if (gbraid) conversion.gbraid = gbraid;
  if (userIdentifiers.length) conversion.userIdentifiers = userIdentifiers;

  try {
    const res = await fetch(
      `https://googleads.googleapis.com/${API_VERSION}/customers/${CUSTOMER_ID}:uploadClickConversions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversions: [conversion], partialFailure: true }),
      }
    );
    const body = await res.text();
    if (!res.ok) {
      console.error('[GOOGLE ADS] uploadClickConversions failed', res.status, body.slice(0, 500));
      return { success: false, error: `status_${res.status}` };
    }
    // partialFailure:true means a bad conversion in the batch still returns 200 —
    // the actual per-conversion error lives inside the body.
    const parsed = JSON.parse(body || '{}') as { partialFailureError?: unknown };
    if (parsed.partialFailureError) {
      console.error('[GOOGLE ADS] Partial failure', input.orderId, JSON.stringify(parsed.partialFailureError).slice(0, 500));
      return { success: false, error: 'partial_failure' };
    }
    console.log('[GOOGLE ADS] Uploaded conversion for order', input.orderId);
    return { success: true };
  } catch (err) {
    console.error('[GOOGLE ADS] Network error uploading conversion', input.orderId, err);
    return { success: false, error: 'network_error' };
  }
}
