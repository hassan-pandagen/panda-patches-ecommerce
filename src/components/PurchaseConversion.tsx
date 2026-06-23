'use client';

import { useEffect } from 'react';

// SHA-256 hash helper — input must already be normalized before calling
async function sha256(normalized: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Normalize email: lowercase + trim
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Normalize phone to E.164 (+1XXXXXXXXXX for US numbers)
// Strips all non-digits, then prepends +1 if not already present
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

// Normalize name: lowercase + trim + strip non-letter chars (per Google EC spec)
function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z\s-]/g, '');
}

export default function PurchaseConversion() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = parseFloat(params.get('value') || '0') || 0;
    // Square hosted checkout returns ?provider=square&ref=<token>. The token is the
    // order id and matches the Square webhook's CAPI event id (`${token}_purchase`)
    // so Meta dedups the browser Purchase against the server-side one.
    const orderId = params.get('ref') || undefined;

    // Build Enhanced Conversions user_data from sessionStorage set at checkout time
    // Keys written by ComplexCalculator/checkout flow: ec_email, ec_phone, ec_first, ec_last
    const rawEmail = sessionStorage.getItem('ec_email') || '';
    const rawPhone = sessionStorage.getItem('ec_phone') || '';
    const firstName = sessionStorage.getItem('ec_first') || '';
    const lastName = sessionStorage.getItem('ec_last') || '';

    async function fireGoogleAds() {
      // Build hashed user_data for Enhanced Conversions. Normalize BEFORE hashing.
      const user_data: Record<string, string> = {};
      if (rawEmail) user_data['sha256_email_address'] = await sha256(normalizeEmail(rawEmail));
      if (rawPhone) user_data['sha256_phone_number'] = await sha256(normalizePhone(rawPhone));
      if (firstName) user_data['sha256_first_name'] = await sha256(normalizeName(firstName));
      if (lastName) user_data['sha256_last_name'] = await sha256(normalizeName(lastName));

      // GTM now loads via a deferred (lazyOnload) loader, so gtag may not be ready on
      // mount. Poll every 300ms for up to 15s, the same way the Meta pixel is handled
      // below, so the purchase conversion is never lost on a fast confirmation view.
      let gaAttempts = 0;
      const sendGoogleAds = () => {
        if (!(window as any).gtag) {
          if (gaAttempts < 50) { gaAttempts++; setTimeout(sendGoogleAds, 300); }
          return;
        }
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
      };
      sendGoogleAds();
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
