'use client';

import { useEffect } from 'react';

export default function PurchaseConversion() {
  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    const params = new URLSearchParams(window.location.search);
    const value = parseFloat(params.get('value') || '0') || undefined;
    const transactionId = params.get('session_id') || undefined;

    (window as any).gtag('event', 'conversion', {
      send_to: 'AW-11221237770/BGrrCMHi3oEcEIqA2uYp',
      currency: 'USD',
      ...(value && { value }),
      ...(transactionId && { transaction_id: transactionId }),
    });
  }, []);

  return null;
}
