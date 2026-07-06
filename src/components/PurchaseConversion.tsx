'use client';

import { useEffect } from 'react';
import { trackPurchase } from '@/lib/ga4';

export default function PurchaseConversion() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = parseFloat(params.get('value') || '0') || 0;
    // Square hosted checkout returns ?provider=square&ref=<token>. The token is the
    // order id and matches the Square webhook's CAPI event id (`${token}_purchase`)
    // so Meta dedups the browser Purchase against the server-side one.
    const orderId = params.get('ref') || undefined;

    // Payment completed — clear all saved calculator carts. Checkout intentionally
    // leaves pp_checkout_state_* in place so abandoned/failed payments can restore.
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pp_checkout_state_')) localStorage.removeItem(key);
      }
    } catch { /* noop */ }

    // GA4 purchase (dataLayer → GTM → GA4) so revenue attributes by channel.
    // Gated on a real order id (transaction_id) to avoid phantom purchases on
    // direct visits to the confirmation URL.
    if (orderId) {
      trackPurchase({ transaction_id: orderId, value, currency: 'USD' });
    }

    // Google Ads Enhanced Conversions fire used to live here — removed (audit P3),
    // ad spend is Meta-only so it was dead code with no active AW- account.

    if (!orderId) return;

    // Meta browser pixel Purchase — pairs with the CAPI event via shared eventID for dedup.
    // The pixel loads via a staggered/deferred loader so fbq may not exist yet on mount.
    // Poll every 300ms for up to 15 seconds — it will always be defined before 16s fires.
    let attempts = 0;
    const firePixel = () => {
      if ((window as any).fbq) {
        (window as any).fbq(
          'track',
          'Purchase',
          { currency: 'USD', value },
          { eventID: `${orderId}_purchase` }
        );
        return;
      }
      if (attempts < 50) {
        attempts++;
        setTimeout(firePixel, 300);
      }
    };
    firePixel();
  }, []);

  return null;
}
