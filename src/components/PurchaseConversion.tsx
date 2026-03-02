'use client';

import { useEffect } from 'react';

export default function PurchaseConversion() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-11221237770/BGrrCMHi3oEcEIqA2uYp',
        currency: 'USD',
      });
    }
  }, []);

  return null;
}
