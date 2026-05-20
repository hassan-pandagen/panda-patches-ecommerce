'use client';

import { useEffect } from 'react';

// SHA-256 hash helper for Enhanced Conversions (hashed PII only, never raw)
async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str.trim().toLowerCase()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function PurchaseConversion() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = parseFloat(params.get('value') || '0') || 0;
    const sessionId = params.get('session_id') || undefined;
    const paypalOrderId = params.get('paypal_order_id') || undefined;
    const orderId = sessionId || paypalOrderId;

    // Build Enhanced Conversions user_data from sessionStorage set at checkout time
    // Keys written by ComplexCalculator/checkout flow: ec_email, ec_phone, ec_first, ec_last
    const rawEmail = sessionStorage.getItem('ec_email') || '';
    const rawPhone = sessionStorage.getItem('ec_phone') || '';
    const firstName = sessionStorage.getItem('ec_first') || '';
    const lastName = sessionStorage.getItem('ec_last') || '';

    async function fireGoogleAds() {
      if (!(window as any).gtag) return;

      // Build hashed user_data for Enhanced Conversions
      const user_data: Record<string, string> = {};
      if (rawEmail) user_data['sha256_email_address'] = await sha256(rawEmail);
      if (rawPhone) user_data['sha256_phone_number'] = await sha256(rawPhone.replace(/\D/g, ''));
      if (firstName) user_data['address'] = JSON.stringify({ first_name: firstName, last_name: lastName });

      // Set user_data globally before the conversion event
      if (Object.keys(user_data).length > 0) {
        (window as any).gtag('set', 'user_data', user_data);
      }

      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-11221237770/BGrrCMHi3oEcEIqA2uYp',
        currency: 'USD',
        ...(value && { value }),
        ...(orderId && { transaction_id: orderId }),
      });

      // Clear sessionStorage PII after use
      ['ec_email', 'ec_phone', 'ec_first', 'ec_last'].forEach(k => sessionStorage.removeItem(k));
    }

    fireGoogleAds();

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
