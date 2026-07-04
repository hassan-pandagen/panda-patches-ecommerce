/**
 * Server-side GA4 Measurement Protocol sender (audit P1).
 *
 * Used by the Square webhook to record purchases in GA4 even when the buyer never
 * clicks back from Square's hosted payment page — previously those purchases were
 * invisible to GA4 (client-only firing on /success), structurally undercounting
 * channel revenue. The buyer's ga_client_id/ga_session_id are captured at checkout
 * time (clientAttribution.ts) and ride along in the order's attribution JSONB.
 *
 * GA4 dedupes purchase events on transaction_id, so the client-side fire on
 * /success (ga4.ts) and this server-side fire never double-count.
 */

const MEASUREMENT_ID = 'G-Y391W132NR';

export async function sendGa4Purchase(opts: {
  clientId: string;
  sessionId?: string | null;
  transactionId: string;
  value: number;
  currency?: string;
}): Promise<void> {
  const secret = process.env.GA4_MP_API_SECRET;
  if (!secret || !opts.clientId) return;

  const payload = {
    client_id: opts.clientId,
    events: [
      {
        name: 'purchase',
        params: {
          engagement_time_msec: 1,
          transaction_id: opts.transactionId,
          value: opts.value,
          currency: opts.currency || 'USD',
          ...(opts.sessionId ? { session_id: opts.sessionId } : {}),
        },
      },
    ],
  };

  await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${encodeURIComponent(secret)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
}
