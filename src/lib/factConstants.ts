/**
 * CANONICAL BUSINESS FACTS — single source of truth (audit P1-1 / PANDAP_1 §3-4).
 *
 * Three independent audits found the site contradicting itself about money and
 * SLAs (five different response-time promises, three delivery windows, prices
 * that disagreed between titles, FAQs, schema, and llms.txt). Every new or
 * edited surface should import from here instead of hardcoding a claim.
 *
 * COMPLIANCE RULES baked into these values (MASTER brief v3, Jul 26 2026):
 *  - Rush is stated in BUSINESS DAYS only: "as soon as 5 business days", with
 *    split-ship (first batch 5 days, remainder 8-11) for qualifying large/complex
 *    orders. Never "24-hour rush", never next-day/weekend/date promises.
 *    "24 hours" is ONLY valid for the digital mockup.
 *  - Say "from 5 pieces" / "low minimums", never "no minimum".
 *  - Every advertised price states its size + quantity basis (PAE792).
 *  - No "Made in USA"/US-production claims. Company is U.S.-registered (Austin TX
 *    is a mailing/registered address only, not a visitable office); production is
 *    at a company-owned facility in Pakistan (Panda Apparel & Technology).
 */

// ── Scope-sensitive volume claims (CLBE37 §1.8 + §3, CEO-attested) ──────────
/**
 * The 1,000,000+ and 4,000+ figures are CAREER-LIFETIME, spanning the founder's
 * 13+ years including factory production for OTHER patch brands. They are NOT
 * this store's delivered-order count — that is published at
 * /custom-patch-production-data-2026 (963 orders / 68,785 patches, Aug 2026).
 *
 * RULE (both claims): fine as a short badge with no elaboration. The moment a
 * surface explains, qualifies, or itemises the figure, it MUST use the career /
 * factory scope — never this store's order base. Two surfaces previously broke
 * this by describing the 1M as spanning "clients across all 50 US states" and
 * "small starter orders from 5 pieces", which reads as store deliveries and
 * directly contradicts the 68,785 figure.
 *
 * Never pair either figure with "since 2016" — operations began June 2023; the
 * year framing is always "13+ years under founder Imran Raza".
 */
export const LIFETIME_PATCHES_SCOPE =
  "Over 1,000,000 patches delivered across 13+ years of manufacturing under founder Imran Raza, including production for other patch brands — this store's own delivered orders are published at /custom-patch-production-data-2026.";

/** Attested Aug 11 2026, career-lifetime basis. Same scoping rule as above. */
export const BULK_ORDERS_LIFETIME = '4,000+';

/** ASI member number — required to display the ASI mark (CLBE37 §1.8). */
export const ASI_MEMBER_NUMBER = '43049';

/**
 * Named-brand attribution wording. NEVER "trusted by", "our clients", or
 * anything implying endorsement — that is what triggers trademark complaints.
 * Approved family: "Patches made for teams at" / "we've made patches for".
 */
export const BRAND_ATTRIBUTION_HEADING = 'Patches Made For Teams At';

// ── Contact ownership (owner decision Jul 21 2026, reconfirmed Aug 11) ──────
/**
 * sales@  — public / pre-sale address, the only one shown on pages
 * hello@  — post-sale SENDING address in email flows (orderEmails.ts,
 *           TrackedEmailLink.tsx). Not a public contact; do not remove.
 * lance@  — accounts and order management.
 * An earlier note claiming hello@ was "removed sitewide" is superseded.
 */
export const CONTACT_OWNERSHIP =
  'Public contact: sales@ · post-sale email sending: hello@ · accounts/order management: lance@';

// ── Backing options (single source, added Aug 2026) ─────────────────────────
/**
 * The six backings we actually offer. Four are self-selectable at checkout;
 * Magnetic and Button-Loop are quote-only and must NOT appear in a selector.
 *
 * Why this exists: the adhesive backing had four different public names
 * ("Peel & Stick" in the calculator, "Sticker" in the offers flow, "Adhesive
 * (Peel & Stick)" on the backing page, "Sticker / Peel" on the pricing page),
 * and llms.txt listed "self-adhesive" and "peel-and-stick" as two separate
 * options — the same backing counted twice, while omitting Magnetic and
 * Button-Loop entirely. One list, one label each.
 *
 * `id` is the stable lowercase key used by pricing logic — NEVER match on the
 * label. `applyVelcroPricing` and calculateOfferTotal both normalise to `id`,
 * because an exact-case check on a display string means a copy edit can
 * silently stop velcro being charged.
 *
 * `label` is what the customer sees and what lands in `orders.design_backing`.
 * These labels are deliberately identical to the values the CRM already writes
 * ("Iron-On", "Sew-On", "Velcro (Hook & Loop)", "Adhesive (Peel & Stick)"), so
 * web and CRM orders produce one clean distribution instead of two spellings
 * per backing. The CRM was already consistent here; the website's two selectors
 * were the ones drifting ("Sticker" in the offers flow, "Peel & Stick" in the
 * calculator). Do not change a label without changing it in the CRM too.
 */
export const BACKINGS = [
  { id: 'iron',   label: 'Iron-On',              free: true,  quoteOnly: false, href: '/custom-iron-on-patches' },
  { id: 'sew',    label: 'Sew-On',               free: true,  quoteOnly: false, href: '/sew-on-patches' },
  { id: 'velcro', label: 'Velcro (Hook & Loop)', free: false, quoteOnly: false, href: '/custom-velcro-patches' },
  { id: 'peel',   label: 'Adhesive (Peel & Stick)', free: true, quoteOnly: false, href: '/adhesive-patches' },
  { id: 'magnet', label: 'Magnetic',             free: false, quoteOnly: true,  href: '/magnetic-patches' },
  { id: 'button', label: 'Button-Loop',          free: false, quoteOnly: true,  href: '/button-loop-patches' },
] as const;

/** The four a customer can pick without a quote. */
export const SELECTABLE_BACKINGS = BACKINGS.filter(b => !b.quoteOnly);

/**
 * True when a backing value means velcro, whatever spelling reached us —
 * "velcro", "Velcro", "Velcro (Hook & Loop)", a CRM-typed "hook and loop".
 * Both checkout paths use this so velcro cannot silently become free.
 */
export function isVelcroBacking(backing: string | undefined | null): boolean {
  if (!backing) return false;
  const b = backing.toLowerCase();
  return b.includes('velcro') || b.includes('hook');
}

// ── SLAs ────────────────────────────────────────────────────────────────────
/** Quote/inquiry response time. */
export const RESPONSE_SLA = '2 business hours';
/** Digital mockup delivery — the ONLY legitimate "24 hours" claim. */
export const MOCKUP_SLA = '12-24 hours';
/** Standard production after mockup approval. */
export const STANDARD_DELIVERY = '7-14 business days';
/** Rush production (qualifying orders). Business days only — compliance (§0.2). */
export const RUSH_DELIVERY = 'as soon as 5 business days';
/** Split-ship arrangement for qualifying large/complex rush orders (§0.2). */
export const RUSH_SPLIT_SHIP =
  'For qualifying large or complex orders, split-shipping is agreed at quote time: the first batch arrives in 5 business days and the remainder in 8–11 business days.';
/** Full canonical rush statement — use verbatim on llms.txt + rush FAQ (§0.2). */
export const RUSH_CANON_STATEMENT =
  'Rush orders can arrive in hand in as soon as five business days. For qualifying large or complex orders, split-shipping is agreed at quote time: the agreed first batch arrives in five business days and the remainder in 8–11 business days.';
/**
 * Economy delivery window. The discount is a flat 5% on EVERY path — see
 * ECONOMY_DISCOUNT_RATE in checkoutConfig, which both the calculator and the
 * offers packs now import.
 *
 * This previously read "5% calculator, 10% offers packs — say 'up to 10%' in
 * generic copy", because the packs never received the Aug 2026 correction. The
 * CEO ruled that was a propagation miss, not two intentional price lists
 * (Aug 8). There is one rate. Never write "up to 10%" again.
 */
export const ECONOMY_DELIVERY = '16-18 business days';

// ── Minimums ────────────────────────────────────────────────────────────────
/** Default minimum order (most patch types). */
export const MIN_ORDER_DEFAULT = 5;
/**
 * Exceptions enforced by the pricing calculator.
 * 3D transfers corrected 10 → 5 per SEDAA3_1 §A.4 (owner decision, 2026-07-20);
 * woven remains the only 10-piece minimum.
 */
export const MIN_ORDER_EXCEPTIONS: Record<string, number> = {
  'Custom Woven Patches': 10,
};
/** Compliance-safe phrasing for generic copy. */
export const MIN_ORDER_COPY = 'from 5 pieces on most patch types (woven: 10)';

// ── Canonical "from" prices (option A — live calculator basis, July 2026) ──
/** The basis EVERY advertised from-price must state. */
export const FROM_PRICE_BASIS = '2" x 2", 1,000 pieces';
export const FROM_PRICE_EMBROIDERED = '$0.91';
export const FROM_PRICE_PVC = '$1.40';
export const FROM_PRICE_WOVEN = '$1.54';
// Leather = base x 1.10 x 1.12 (CHENILLE_LEATHER_UPLIFT, June 2026). $1.55 was pre-uplift.
export const FROM_PRICE_LEATHER = '$1.74';
// Chenille = base x 1.10 x 1.12, same uplift as leather. Added Aug 2026: chenille
// was the only patch type without a canonical from-price, so public surfaces had
// drifted to a 3"/5,000 basis quoting $1.19 — the RAW table value, pre-uplift. Two
// errors compounding: wrong basis and no uplift. Every from-price now states the
// same 2"x2"/1,000 tuple, so a basis mismatch is visible instead of plausible.
export const FROM_PRICE_CHENILLE = '$1.47';

// ── Support ────────────────────────────────────────────────────────────────
/** Main line. Replaced (302) 773-8982 per SEDAA3_1 §A.3 — the old number must
 *  not appear on any public surface. */
export const PHONE_DISPLAY = '+1 (302) 250-4340';
export const PHONE_TEL = 'tel:+13022504340';
/** Public contact email (default). lance@ is also active and RETAINED (§0.8). */
export const SUPPORT_EMAIL = 'sales@pandapatches.com';
/**
 * Support hours (§0.5, owner canon). Phone and email windows differ; Sunday
 * closed. Do NOT use "24/7", "every day", or "seven days a week" anywhere.
 */
export const SUPPORT_HOURS_PHONE = 'Monday–Saturday, 11:00 AM–7:00 PM ET';
export const SUPPORT_HOURS_EMAIL = '24 hours a day, Monday–Saturday (Sunday closed)';
/** Short combined label for compact UI (phone hours — the usual "hours" meaning). */
export const SUPPORT_HOURS = 'Mon–Sat, 11am–7pm ET';

// ── Identity (§0.3) ──────────────────────────────────────────────────────────
export const COMPANY_LEGAL_NAME = 'MC Patches LLC';
/** DBA + formation. Use "U.S.-registered", never "US-headquartered". */
export const COMPANY_REGISTRATION =
  'MC Patches LLC (DBA Panda Patches), U.S.-registered, formed December 2023';
/** Austin is a mailing/registered address only — no office, no visits (§0.3). */
export const REGISTERED_ADDRESS = '701 Tillery St Ste 12, Austin, TX 78702';
export const REGISTERED_ADDRESS_NOTE =
  'Austin, TX is our U.S. mailing/registered address only — not a visitable office.';
export const FOUNDER_NAME = 'Imran Raza';
/**
 * Attach experience to the FOUNDER, never the company's age (§0.3).
 *
 * The maths, recorded so it is never re-litigated: ~10 years making patches
 * employed by other companies + ~3 years running Panda = the 13-year figure.
 * It is a founder TOTAL that includes the Panda years, and it belongs to Imran
 * personally. The company is not 13 years old and must never be described that
 * way — that misattribution shipped in the /about metadata and was corrected
 * Aug 2026.
 */
export const FOUNDER_EXPERIENCE = '13+ years in custom patch manufacturing';

/**
 * CEO-approved founding story (Aug 2026). An approved company fact, not
 * marketing copy — reusable verbatim on /about, the founder page, and in the
 * llms.txt company description. Do not paraphrase.
 */
export const FOUNDER_STORY =
  "Imran spent ten years making patches for other companies before founding Panda Patches in 2023 — convinced that customers deserved better service at a better price, from someone who'd actually made the product with his own hands.";

/**
 * Two dates, two different facts — both correct, so neither is "the" date:
 *  - operations began June 2023, under a predecessor LLC
 *  - MC Patches LLC was formed December 2023
 * PUBLIC COPY SAYS "founded in 2023" — true, simple, and it avoids entity
 * archaeology on customer-facing pages. Use the specific fields only where the
 * distinction genuinely matters (legal, compliance, vendor due diligence).
 */
export const OPERATIONS_STARTED = 'June 2023';
export const LEGAL_ENTITY_FORMED = 'December 2023';
export const FOUNDED_PUBLIC = '2023';

// ── Production origin (§0.4) ─────────────────────────────────────────────────
export const PRODUCTION_ORIGIN =
  'Produced at our company-owned facility in Pakistan, operated by Panda Apparel & Technology. No products are manufactured in the United States.';

// ── Guarantee / returns (§0.1) ───────────────────────────────────────────────
export const GUARANTEE_WINDOW_DAYS = 10;
/** Full canonical guarantee/returns policy — replaces 48h / 14-day / 30-day variants. */
export const GUARANTEE_STATEMENT =
  'Before mockup approval, you may cancel for a full refund. After written approval, production begins and change-of-mind cancellation is not covered. If the delivered order is less than perfect or differs from the approved mockup, contact Panda Patches within 10 calendar days of delivery and choose a remake or full refund. Panda Patches pays the remedy and related shipping costs.';

// ── Social proof ───────────────────────────────────────────────────────────
/**
 * Trustpilot figures live in reviewConstants.ts — the single source of truth,
 * kept in sync with TRUSTPILOT_REVIEWS.md. These re-exports previously held
 * their own copies and drifted stale (4.8/72 vs the real 4.7/75), which is the
 * exact class of contradiction this file exists to prevent. Do not re-add
 * literals here; import from reviewConstants instead.
 *
 * Note (SEDAA3_1 §A.2): third-party-sourced, so these may NOT feed an
 * Organization/LocalBusiness aggregateRating.
 */
export {
  TRUSTPILOT_RATING,
  TRUSTPILOT_REVIEW_COUNT as TRUSTPILOT_REVIEWS,
  TRUSTPILOT_LAST_CHECKED as TRUSTPILOT_CHECKED,
  TRUSTPILOT_PROFILE_URL as TRUSTPILOT_URL,
} from './reviewConstants';
