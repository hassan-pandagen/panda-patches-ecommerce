'use client';

import { useEffect } from 'react';

export default function PurchaseConversion() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = parseFloat(params.get('value') || '0') || 0;
    const sessionId = params.get('session_id') || undefined;
    const paypalOrderId = params.get('paypal_order_id') || undefined;
    const orderId = sessionId || paypalOrderId;

    // Google Ads conversion — fires immediately (gtag loads synchronously via GTM)
    if ((window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-11221237770/BGrrCMHi3oEcEIqA2uYp',
        currency: 'USD',
        ...(value && { value }),
        ...(orderId && { transaction_id: orderId }),
      });
    }

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
