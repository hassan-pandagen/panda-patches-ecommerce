/**
 * CANONICAL BUSINESS FACTS — single source of truth (audit P1-1 / PANDAP_1 §3-4).
 *
 * Three independent audits found the site contradicting itself about money and
 * SLAs (five different response-time promises, three delivery windows, prices
 * that disagreed between titles, FAQs, schema, and llms.txt). Every new or
 * edited surface should import from here instead of hardcoding a claim.
 *
 * COMPLIANCE RULES baked into these values (ad policy, July 2026):
 *  - Rush is stated in BUSINESS DAYS only (~6-7). Never "24-hour rush",
 *    never next-day/weekend/date promises. "24 hours" is ONLY valid for the
 *    digital mockup.
 *  - Say "from 5 pieces" / "low minimums", never "no minimum".
 *  - Every advertised price states its size + quantity basis (PAE792).
 *  - No "Made in USA" claims (US-headquartered; company-owned facility overseas).
 */

// ── SLAs ────────────────────────────────────────────────────────────────────
/** Quote/inquiry response time. */
export const RESPONSE_SLA = '2 business hours';
/** Digital mockup delivery — the ONLY legitimate "24 hours" claim. */
export const MOCKUP_SLA = '12-24 hours';
/** Standard production after mockup approval. */
export const STANDARD_DELIVERY = '7-14 business days';
/** Rush production (qualifying orders). Business days only — compliance. */
export const RUSH_DELIVERY = 'about 6-7 business days';
/** Economy delivery window. Discount differs by product (5% calculator, 10% offers packs) — say "up to 10%" in generic copy. */
export const ECONOMY_DELIVERY = '16-18 business days';

// ── Minimums ────────────────────────────────────────────────────────────────
/** Default minimum order (most patch types). */
export const MIN_ORDER_DEFAULT = 5;
/** Exceptions enforced by the pricing calculator. */
export const MIN_ORDER_EXCEPTIONS: Record<string, number> = {
  'Custom Woven Patches': 10,
  'Custom 3D Embroidered Transfers': 10,
};
/** Compliance-safe phrasing for generic copy. */
export const MIN_ORDER_COPY = 'from 5 pieces on most patch types (woven and 3D transfers: 10)';

// ── Canonical "from" prices (option A — live calculator basis, July 2026) ──
/** The basis EVERY advertised from-price must state. */
export const FROM_PRICE_BASIS = '2" x 2", 1,000 pieces';
export const FROM_PRICE_EMBROIDERED = '$0.91';
export const FROM_PRICE_PVC = '$1.54';
export const FROM_PRICE_WOVEN = '$1.54';

// ── Support ────────────────────────────────────────────────────────────────
export const PHONE_DISPLAY = '+1 (302) 773-8982';
export const PHONE_TEL = 'tel:+13027738982';
export const SUPPORT_HOURS = 'Every day, 11am-7pm ET';

// ── Social proof (update together with reviewConstants.ts) ─────────────────
export const TRUSTPILOT_RATING = '4.8';
export const TRUSTPILOT_REVIEWS = 72;
