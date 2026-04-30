'use client';

import { useEffect } from 'react';

export default function PurchaseConversion() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = parseFloat(params.get('value') || '0') || undefined;
    const sessionId = params.get('session_id') || undefined;
    const paypalOrderId = params.get('paypal_order_id') || undefined;
    const orderId = sessionId || paypalOrderId;

    // Google Ads conversion
    if ((window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-11221237770/BGrrCMHi3oEcEIqA2uYp',
        currency: 'USD',
        ...(value && { value }),
        ...(orderId && { transaction_id: orderId }),
      });
    }

    // Meta browser pixel Purchase — deduplicates with CAPI via matching eventID
    if ((window as any).fbq && orderId) {
      (window as any).fbq(
        'track',
        'Purchase',
        { currency: 'USD', value: value || 0 },
        { eventID: `${orderId}_purchase` }
      );
    }
  }, []);

  return null;
}
