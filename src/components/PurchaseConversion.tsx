'use client';

import { useEffect } from 'react';
import { trackPurchase } from '@/lib/ga4';
import { trackGoogleAdsPurchase } from '@/lib/googleAds';

/**
 * Fires browser purchase conversions on /success for a webhook-confirmed order.
 *
 * transaction_id strategy (each channel must match its own server-side send so
 * nothing double-counts):
 *  - Google Ads: `order_number` — the SAME value the Data Manager "Direct
 *    Purchase" import maps to Transaction ID, so Google dedupes this tag against
 *    the import (claude-code-task-website-conversions.md Fix 2). Fired ONLY when
 *    the order number is resolved; if a webhook-lag race leaves it unresolved, we
 *    skip the Google Ads tag and let the import count the order (no double-count).
 *  - Meta: `order_<id>_purchase`. This is the ONE key all three Meta senders
 *    share — this pixel, the Square webhook's CAPI call, and the Postgres-
 *    triggered `send-meta-purchase` edge function. It used to be
 *    `${token}_purchase`, which only matched the webhook; the edge function fires
 *    on the same order with `order_<id>_purchase`, so every web-checkout order
 *    produced TWO undedupable Purchase events (16 of them in the 90 days to
 *    2026-08-27). Keying on the order id collapses all three into one event
 *    (CL4DE6 §1.3). Do not change this without changing the other two.
 *  - GA4: the checkout token (`?ref=`). NOTE: the webhook's server-side GA4 keys
 *    on order_number, so GA4 browser/server don't currently dedupe — pre-existing,
 *    out of scope here, flagged for a separate pass.
 */
export default function PurchaseConversion({
  orderNumber,
  amount,
  orderId,
}: {
  orderNumber?: string;
  amount?: number;
  orderId?: number;
}) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Server-verified amount (from the paid order) is authoritative; ?value= is
    // user-editable, so it's only a fallback.
    const value = amount ?? (parseFloat(params.get('value') || '0') || 0);
    // Square hosted checkout returns ?provider=square&ref=<token>. The token pairs
    // GA4 + the Meta pixel/CAPI (`${token}_purchase`) for their own dedup.
    const token = params.get('ref') || undefined;

    // Payment completed — clear all saved calculator carts. Checkout intentionally
    // leaves pp_checkout_state_* in place so abandoned/failed payments can restore.
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pp_checkout_state_')) localStorage.removeItem(key);
      }
    } catch { /* noop */ }

    // GA4 purchase (dataLayer → GTM → GA4). Keyed on the token, matching the
    // browser Meta pixel. Gated on a real token (the server already redirects
    // unverified visitors away, so this is belt-and-suspenders).
    if (token) {
      trackPurchase({ transaction_id: token, value, currency: 'USD' });
    }

    // Google Ads Purchase (GTM) — transaction_id = order_number so Google dedupes
    // this against the Data Manager import. Skip when unresolved (rare webhook
    // lag); the import still counts the order.
    if (orderNumber) {
      trackGoogleAdsPurchase({ transactionId: orderNumber, value });
    }

    // Meta browser pixel Purchase — pairs with BOTH server senders via the shared
    // `order_<id>_purchase` eventID. Skipped entirely when the order id has not
    // resolved yet (webhook-lag race): firing without the canonical key would
    // produce an event Meta cannot dedupe against the server side, which is worse
    // than not firing — the CAPI senders still count the order. Same reasoning as
    // the Google Ads tag above.
    if (!orderId || !(value > 0)) return;

    // The pixel loads via a staggered/deferred loader so fbq may not exist yet on
    // mount. Poll every 300ms for up to 15 seconds.
    let attempts = 0;
    const firePixel = () => {
      if ((window as any).fbq) {
        (window as any).fbq(
          'track',
          'Purchase',
          { currency: 'USD', value },
          { eventID: `order_${orderId}_purchase` }
        );
        return;
      }
      if (attempts < 50) {
        attempts++;
        setTimeout(firePixel, 300);
      }
    };
    firePixel();
  }, [orderNumber, amount, orderId]);

  return null;
}
