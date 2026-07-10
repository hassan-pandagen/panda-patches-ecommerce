/**
 * Google Ads conversion tracking via GTM (GTM-KQQQ674D), client-side.
 *
 * Deliberately separate from trackLead()/trackPurchase() in ga4.ts: those relay
 * to GA4 server-side (Measurement Protocol) and never touch dataLayer, so they
 * can't drive a GTM tag. Google Ads conversions run through a GTM Conversion tag
 * that listens for the dataLayer events pushed here, so these MUST be real
 * dataLayer.push calls.
 *
 * Enhanced Conversions: user_data carries the raw email/phone; Google's tag
 * hashes them client-side before upload and uses them to recover conversions
 * when the gclid is lost (Safari ITP, cross-device). Fire on CONFIRMED
 * submit/success only — never on a raw click.
 */

function push(event: string, data: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...data });
  } catch {
    /* never let tracking throw into the UI */
  }
}

/**
 * Lead conversion — the Google Ads "Quote Form Sub" action. Fired by every
 * lead-capture form on successful submit. `formName` rides along so GTM can
 * fire one conversion for all forms or split per form later, with no code
 * change. Pass email/phone when the form has them so Enhanced Conversions can
 * match; omit them and the conversion still fires (gclid-based).
 */
export function trackGoogleAdsLead(opts: { formName: string; email?: string; phone?: string }): void {
  const user_data: Record<string, string> = {};
  if (opts.email) user_data.email = opts.email;
  if (opts.phone) user_data.phone_number = opts.phone;
  push('quote_form_submit', {
    form_name: opts.formName,
    ...(Object.keys(user_data).length ? { user_data } : {}),
  });
}

/**
 * Purchase conversion — fired on /success after a paid checkout. value +
 * transaction_id let a GTM Google Ads Purchase tag record revenue. Enhanced
 * Conversions here rely on the gclid (GTM reads the _gcl cookie); hashed
 * email/phone matching for orders is better done server-side from the CRM,
 * which holds the buyer's contact details.
 */
export function trackGoogleAdsPurchase(opts: { transactionId: string; value: number; currency?: string }): void {
  push('website_purchase', {
    transaction_id: opts.transactionId,
    value: opts.value,
    currency: opts.currency || 'USD',
  });
}
