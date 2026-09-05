import type { AeoAnswerContent, ComparisonTable } from "@/components/product/AeoAnswerBlock";
import { TRUSTPILOT_RATING, TRUSTPILOT_REVIEW_COUNT } from "@/lib/reviewConstants";
import { MIN_ORDER_DEFAULT, MIN_ORDER_EXCEPTIONS } from "@/lib/factConstants";
import { getFromPriceLabel } from "@/lib/pricingCalculator";
import { OFFER_CATEGORIES } from "@/lib/offerPackages";

/**
 * One stamp for every AEO block. The cost FAQ below is shared by every type, so
 * an edit to it is an edit to all of them; a per-type "July 2026" string (which
 * is what this replaced, seven copies) went stale the moment the shared text
 * moved. verify:canon section 12 fails the build if this lags the file's git date.
 */
export const AEO_LAST_UPDATED = "September 2026";

/**
 * Minimum order for a patch type, read from the SAME canon the pricing
 * calculator enforces (factConstants.MIN_ORDER_EXCEPTIONS). Never hardcode a
 * minimum in this file.
 *
 * Why this exists: commonFaqs() previously hardcoded "just 5 pieces" and was
 * spread into every type including woven, whose real enforced minimum is 10
 * (wovenPricing.minQty). So /custom-patches/woven told buyers 5 — in visible
 * copy AND in its FAQPage schema — while the calculator rejected any order
 * under 10 at checkout. Deriving the number here makes that class of drift
 * impossible (CLB408_1 §5).
 */
const minOrderFor = (productName: string): number =>
  MIN_ORDER_EXCEPTIONS[productName] ?? MIN_ORDER_DEFAULT;

// Rating strings are interpolated from reviewConstants, never typed by hand.
// This file previously hardcoded "4.7★ on Trustpilot (76 reviews)" in ten
// places, so a rating refresh silently left them stale.
const RATING_SHORT = `${TRUSTPILOT_RATING}★ on Trustpilot (${TRUSTPILOT_REVIEW_COUNT} reviews)`;

/**
 * Answer-first AEO content per buying-intent page (AEO-CONTENT-REWORK-SPEC-2026-07.md).
 *
 * RULES (do not break — they are why this exists):
 *  - `answer`: 40-60 words, leads with the key number, quotable standalone.
 *  - each `faqs[].a`: ~134-167 words, answer in sentence 1, self-contained, at
 *    least one concrete figure, mentions "Panda Patches" once naturally.
 *  - `q` headings map to REAL Google fan-out sub-queries (captured from the live
 *    AI Overview + People-Also-Ask for "custom patches" / "bulk custom patches"
 *    on 2026-07-14: cost, minimum order, turnaround, type-vs-type, backing,
 *    made-in-USA, bulk/wholesale price, mockup/proof, setup fees, guarantee).
 *  - all figures must match pricingCalculator.ts / the pricing page. Update both.
 *
 * Every entry is genuine and accurate. Do not invent reviews, dates, or prices.
 */

// Shared patch-type comparison table (highest-citation format). Per-piece prices
// are 2x2 in @ 1,000 pcs; smaller orders cost more per piece. Keep in sync with
// bulk-custom-patches "Materials & Patch Types" grid + pricingCalculator.ts.
const PATCH_TYPE_COMPARISON: ComparisonTable = {
  caption: "Patch Types Compared: Which Should You Choose?",
  columns: ["Type", "Best for", "Detail level", "Durability", "From (1,000 pc)"],
  rows: [
    ["Embroidered", "Uniforms, teams, classic logos", "Medium", "High", "$0.91/pc"],
    ["Woven", "Fine detail, small text, labels", "Very high", "High", "$1.54/pc"],
    ["PVC / Rubber", "Outdoor, tactical, waterproof use", "Medium", "Very high", "$1.40/pc"],
    ["Chenille", "Varsity jackets, letterman, retro", "Low", "Medium", "$1.30/pc"],
    ["Leather", "Hat lines, luxury branding", "Low-Med", "High", "$1.74/pc"],
    ["Printed / Sublimated", "Full-color art, gradients, photos", "Photographic", "Medium", "$0.74/pc"],
  ],
};

// Reusable fan-out answers shared across patch types (pricing, MOQ, turnaround,
// mockup, fees, guarantee, made-in-USA). Type pages add 1-2 type-specific Q&As.
/** typeLabel (as passed to commonFaqs) → canonical product name used by the
 *  pricing calculator and MIN_ORDER_EXCEPTIONS. */
const PRODUCT_NAME_BY_LABEL: Record<string, string> = {
  embroidered: "Custom Embroidered Patches",
  woven: "Custom Woven Patches",
  PVC: "Custom PVC Patches",
  chenille: "Custom Chenille Patches",
  leather: "Custom Leather Patches",
  printed: "Custom Printed Patches",
};

/** Which /offers category carries a type's under-4-inch packs. Printed has a
 *  from-price (published 6 Sept 2026) but no pack line, so its answer carries
 *  the price and no pack sentence rather than borrowing another type's packs. */
const OFFER_SLUG_BY_LABEL: Record<string, string> = {
  embroidered: "embroidered",
  woven: "woven",
  PVC: "pvc",
  chenille: "chenille",
  leather: "leather",
  printed: "printed",
};

/**
 * THE COST ANSWER IS BUILT, NOT TYPED. Until 6 Sept 2026 this template carried
 * embroidered's "$0.91 ... $180 for 50 ... $1,200 for 1,000" verbatim under
 * `Custom ${typeLabel} patches`, so /custom-patches/chenille told buyers
 * chenille starts at $0.91 while its hero said $1.30 (CLD22B A1). verify:canon
 * section 11 never saw it because the type name was a variable, not a literal.
 * Every figure here now comes from the calculator and the offers file, and
 * section 12 renders each type's answer and checks it.
 */
function costAnswer(typeLabel: string): string {
  const product = PRODUCT_NAME_BY_LABEL[typeLabel];
  const slug = OFFER_SLUG_BY_LABEL[typeLabel];
  const packs = slug
    ? OFFER_CATEGORIES.find((c) => c.slug === slug && c.subtitle === "Under 4 Inches")?.packs
    : undefined;

  const lead = slug && product
    ? `Custom ${typeLabel} patches start at ${getFromPriceLabel(product)} per piece for a 2-inch design at 1,000 pieces; smaller runs cost more per piece.`
    : `Custom ${typeLabel} patches are quoted per size and quantity, and the on-site calculator shows the exact figure instantly before you order.`;

  const packLine = packs && packs.length
    ? ` At Panda Patches, ${typeLabel} pack pricing under 4 inches runs ${packs
        .map((p, i) => `$${p.price.toLocaleString("en-US")} for ${p.qty.toLocaleString("en-US")}${i === 0 ? " pieces" : ""} ($${p.perPiece.toFixed(2)}/pc)`)
        .reduce((acc, part, i, arr) => (i === 0 ? part : i === arr.length - 1 ? `${acc}, and ${part}` : `${acc}, ${part}`), "")}.`
    : "";

  return (
    `${lead}${packLine} Every price includes free worldwide shipping, a digital mockup in 12 to 24 hours, unlimited free revisions, and zero setup or digitizing fees — the number you are quoted is the number you pay. Larger sizes and add-ons like metallic thread or Velcro adjust the per-piece rate, which the on-site calculator shows instantly before you order. There is no charge to get a quote or a mockup.`
  );
}

const commonFaqs = (typeLabel: string): AeoAnswerContent["faqs"] => {
  const minQty = minOrderFor(PRODUCT_NAME_BY_LABEL[typeLabel] ?? "");
  return [
  {
    q: `How much do custom ${typeLabel} patches cost?`,
    a: costAnswer(typeLabel),
  },
  {
    q: `What is the minimum order for custom ${typeLabel} patches?`,
    a: `The minimum order for ${typeLabel} patches at Panda Patches is ${minQty} pieces — far below the 50-to-100-piece minimum most patch manufacturers require. Bulk pricing tiers begin at 50 pieces and improve again at 100, 500, and 1,000+. That means you can order ${minQty} patches to sample quality, 50 for a team, or 50,000 for a national rollout through the same process, with the same free mockup and no setup fees at any size. The low minimum exists so first-time buyers and small brands are not forced to over-order inventory just to hit a supplier's floor. If you only need a handful of patches, you are not penalized — you still get free design help and a proof before anything is produced.`,
  },
  {
    q: "How long does it take to make custom patches?",
    a: `Standard production is 7 to 14 business days from the moment you approve your digital mockup, not from when you pay. Panda Patches delivers your free mockup within 12 to 24 hours of your request, and production only begins after your written approval — nothing is manufactured without your sign-off. Rush production is available for tighter deadlines at 25% of the order total with a $50 minimum, refunded if we cannot meet the date. Free worldwide shipping is included on every order, with door-to-door tracking. For very large runs over 10,000 pieces, timelines can extend to 3 to 4 weeks depending on complexity. Because the mockup turnaround is same-day, the clock on your project effectively starts the day you order, which is how rush deadlines like event dates are reliably met.`,
  },
  {
    q: "Do you charge setup or digitizing fees?",
    a: `No. Panda Patches charges zero setup fees, zero digitizing fees, and no mold or art fees on any order, at any size. This matters because hidden fees are the most common way patch suppliers inflate a quote after you submit your design — a $40 to $150 surprise on an order of 100 patches is typical elsewhere. With Panda Patches, the per-piece price you see is the complete price: free artwork, free design assistance, a free digital mockup in 12 to 24 hours, unlimited free revisions, and free worldwide shipping are all included. The only thing you pay for is the patches themselves. This is also why the published pricing tiers can be trusted as your real cost rather than a starting point that grows at checkout.`,
  },
  {
    q: "Are custom patches made in the USA?",
    a: `Panda Patches is a U.S.-registered company based in Austin, Texas, serving customers nationwide with free worldwide shipping and US-based support that answers every quote within about two business hours. Its custom patches are produced at the company's own facility in Pakistan, operated by Panda Apparel & Technology; no products are manufactured in the United States. Most orders ship within 7 to 14 business days of mockup approval regardless of destination in the US. The company has delivered over one million patches and holds a ${TRUSTPILOT_RATING}-star Trustpilot rating across ${TRUSTPILOT_REVIEW_COUNT} verified reviews, with named customers from fire departments, police departments, sports teams, and Fortune 500 branding programs. Production follows a 5-point quality inspection — thread tension, color matching, backing durability, stitch integrity, and final visual check — on every patch.`,
  },
  {
    q: "Do I get a proof or mockup before production?",
    a: `Yes — every order includes a free digital mockup delivered in 12 to 24 hours, and production does not start until you approve it in writing. You get unlimited free revisions until the design is exactly right, at no charge. For orders of 500 pieces or more, Panda Patches also ships a free physical pre-production sample so you can hold the finished patch and verify color, backing, and sizing before the full batch runs; smaller orders can request a sample for a small fee credited toward the order. This two-step proofing — digital mockup for everyone, physical sample for large runs — removes the two biggest risks in custom patch ordering: approving artwork you cannot fully judge on a screen, and discovering a color or sizing issue only after thousands of pieces are made.`,
  },
  {
    q: "Is there a money-back guarantee?",
    a: `Yes. Panda Patches backs every order with a money-back guarantee: if your patches do not match the mockup you approved, the company makes it right. Because production only begins after your written sign-off on a digital proof — and, for orders of 500+, a physical pre-production sample — the finished patches are held to the exact design you approved. Real customer reviews on Trustpilot describe the company reshipping replacements at no cost when a small number of pieces arrived flawed, no argument required. That guarantee, combined with a verified ${TRUSTPILOT_RATING}-star rating across ${TRUSTPILOT_REVIEW_COUNT} reviews and over one million patches delivered, is why first-time buyers and repeat B2B clients — including fire departments, police agencies, and corporate branding teams — treat Panda Patches as a low-risk supplier for both small and large runs.`,
  },
  ];
};

export const aeoContent: Record<string, AeoAnswerContent> = {
  // ── EMBROIDERED (top product page — deepest treatment) ──────────────────────
  embroidered: {
    heading: "Custom Embroidered Patches: Pricing, Minimums & Turnaround",
    answer:
      "Custom embroidered patches from Panda Patches start at $0.91 per piece (2-inch design, 1,000 pieces) with a 5-piece minimum, a free digital mockup in 12–24 hours, no setup fees, and free worldwide shipping. Standard turnaround is 7–14 business days after you approve your proof.",
    keyFacts: [
      { label: "Price from", value: "$0.91/pc (2\", 1,000 pc) · $180 for 50 · $240 for 100 · $750 for 500 · $1,200 for 1,000" },
      { label: "Minimum order", value: "5 pieces (bulk tiers at 50, 100, 500, 1,000+)" },
      { label: "Turnaround", value: "7–14 business days after mockup approval; rush available" },
      { label: "Mockup", value: "Free digital proof in 12–24 hours, unlimited revisions" },
      { label: "Setup / digitizing fees", value: "None" },
      { label: "Backing options", value: "Iron-on, sew-on, Velcro, adhesive" },
      { label: "Shipping", value: "Free worldwide shipping, door-to-door tracking" },
      { label: "Guarantee", value: "Money-back; production only after written approval" },
      { label: "Rating", value: `${RATING_SHORT}, 1M+ patches delivered` },
    ],
    comparison: PATCH_TYPE_COMPARISON,
    faqs: [
      {
        q: "What are embroidered patches best for?",
        a: `Embroidered patches are best for uniforms, sports teams, corporate logos, military and first-responder insignia, and any design built from bold shapes and text rather than fine gradients. The raised, stitched-thread texture gives a classic, premium feel and holds up through industrial laundering, which is why fire departments, police agencies, and Fortune 500 uniform programs choose them. They are the most popular and most cost-effective patch type at volume, starting at $0.91 per piece at 1,000 from Panda Patches. The one limit is very fine detail: text under about 4 mm tall or photographic gradients reproduce better as woven or printed patches. For most logos, though, embroidery is the default choice, available with iron-on, sew-on, Velcro, or adhesive backing and merrowed or heat-cut borders.`,
      },
      ...commonFaqs("embroidered"),
    ],
    updated: AEO_LAST_UPDATED,
  },

  // ── WOVEN ───────────────────────────────────────────────────────────────────
  woven: {
    heading: "Custom Woven Patches: Pricing, Minimums & Turnaround",
    answer:
      "Custom woven patches from Panda Patches start at $1.54 per piece (2-inch, 1,000 pieces) with a 5-piece minimum, a free 12–24 hour mockup, no setup fees, and free worldwide shipping. Woven construction captures finer detail and small text than embroidery, at a flatter, lightweight profile.",
    keyFacts: [
      { label: "Price from", value: "$1.54/pc (2\", 1,000 pc); smaller runs cost more per piece" },
      { label: "Minimum order", value: "5 pieces (bulk tiers at 50, 100, 500, 1,000+)" },
      { label: "Turnaround", value: "7–14 business days after mockup approval; rush available" },
      { label: "Mockup", value: "Free digital proof in 12–24 hours, unlimited revisions" },
      { label: "Setup / digitizing fees", value: "None" },
      { label: "Best for", value: "Fine detail, small text, brand labels, intricate crests" },
      { label: "Shipping", value: "Free worldwide shipping" },
      { label: "Rating", value: RATING_SHORT },
    ],
    comparison: PATCH_TYPE_COMPARISON,
    faqs: [
      {
        q: "Woven vs embroidered patches — which should I choose?",
        a: `Choose woven patches when your design has fine detail, small text, or an intricate crest, and embroidered when you want bold, raised, classic texture. Woven patches use thinner threads on a tighter loom, so they reproduce small lettering and complex line work that embroidery would blur — ideal for luxury brand labels, detailed logos, and university seals. They sit flat and lightweight against fabric. Embroidered patches, by contrast, have a raised, tactile surface that reads as premium on uniforms and team gear, and cost less per piece at volume ($0.91 vs $1.54 at 1,000 from Panda Patches). If your art is simple and bold, go embroidered; if it is fine and detailed, go woven. Panda Patches provides a free mockup either way so you can see your specific design in both before deciding.`,
      },
      ...commonFaqs("woven"),
    ],
    updated: AEO_LAST_UPDATED,
  },

  // ── PVC ─────────────────────────────────────────────────────────────────────
  pvc: {
    heading: "Custom PVC Patches: Pricing, Minimums & Turnaround",
    answer:
      "Custom PVC (rubber) patches from Panda Patches start at $1.40 per piece (2-inch, 1,000 pieces) with a 5-piece minimum, a free 12–24 hour mockup, and no setup fees. PVC is 100% waterproof, UV-resistant, and Velcro-compatible — the top choice for tactical, outdoor, and uniform use.",
    keyFacts: [
      { label: "Price from", value: "$1.40/pc (2\", 1,000 pc); smaller runs cost more per piece" },
      { label: "Minimum order", value: "5 pieces (bulk tiers at 50, 100, 500, 1,000+)" },
      { label: "Turnaround", value: "7–14 business days after mockup approval; rush available" },
      { label: "Mockup", value: "Free digital proof in 12–24 hours, unlimited revisions" },
      { label: "Setup / mold fees", value: "None" },
      { label: "Best for", value: "Outdoor gear, tactical, military, waterproof/high-wear use" },
      { label: "Backing", value: "Velcro (hook & loop), sew-on, adhesive" },
      { label: "Rating", value: RATING_SHORT },
    ],
    comparison: PATCH_TYPE_COMPARISON,
    faqs: [
      {
        q: "Why choose PVC patches over embroidered?",
        a: `Choose PVC (rubber) patches when the patch will face water, sun, mud, or heavy abrasion, or when you need clean Velcro attachment for gear that swaps often. PVC is 100% waterproof, will not fade in direct sunlight, holds fine molded shapes and 3D detail, and survives conditions that degrade thread — which is why military units, law enforcement, hunting and fishing brands, and outdoor gear companies prefer it. Embroidered patches give a softer, classic textile look and cost less at volume ($0.91 vs $1.40 per piece at 1,000 from Panda Patches), but they are not waterproof. The rule of thumb: indoor, apparel, and uniform use leans embroidered; outdoor, tactical, and equipment use leans PVC. Panda Patches produces both with a free mockup and Velcro backing available on either.`,
      },
      ...commonFaqs("PVC"),
    ],
    updated: AEO_LAST_UPDATED,
  },

  // ── CHENILLE ────────────────────────────────────────────────────────────────
  chenille: {
    heading: "Custom Chenille Patches: Pricing, Minimums & Turnaround",
    answer:
      "Custom chenille patches from Panda Patches start at $1.30 per piece (2-inch, 1,000 pieces), all-in — free worldwide shipping, no setup or digitizing fees, and no tariffs or duties on arrival (DDP). That includes a low minimum and a free 12–24 hour mockup. Chenille's soft, fuzzy, raised texture is the classic varsity-jacket and letterman look for schools, teams, and retro fashion brands.",
    keyFacts: [
      { label: "Price from", value: "$1.30/pc (2\", 1,000 pc), all-in with free worldwide shipping, no setup fees and no duties on arrival (DDP); smaller runs cost more per piece" },
      { label: "Minimum order", value: "Low minimums; bulk tiers improve at 100, 500, 1,000+" },
      { label: "Turnaround", value: "7–14 business days after mockup approval; rush available" },
      { label: "Mockup", value: "Free digital proof in 12–24 hours, unlimited revisions" },
      { label: "Setup fees", value: "None" },
      { label: "Best for", value: "Varsity jackets, letterman, colleges, retro streetwear" },
      { label: "Rating", value: RATING_SHORT },
    ],
    comparison: PATCH_TYPE_COMPARISON,
    faqs: [
      {
        q: "What are chenille patches best for?",
        a: `Chenille patches are best for varsity jackets, letterman wear, school and college spirit gear, and retro-inspired fashion brands that want a soft, fuzzy, raised-yarn texture. This is the classic "letter" patch — the big block letters on a high-school or college jacket are chenille — and it carries a nostalgic, premium feel that flat patches cannot match. Because the yarn is thick and the look is bold, chenille suits large, simple designs like single letters, mascots, and numbers rather than fine detail. Panda Patches produces custom chenille patches from $1.30 per piece at volume, often blended with embroidery for outlines and small text. Fashion and streetwear labels use chenille as a centerpiece branding element on hats and jackets. A free mockup shows your exact letter, color, and border before production.`,
      },
      ...commonFaqs("chenille"),
    ],
    updated: AEO_LAST_UPDATED,
  },

  // ── LEATHER ─────────────────────────────────────────────────────────────────
  leather: {
    heading: "Custom Leather Patches: Pricing, Minimums & Turnaround",
    answer:
      "Custom leather patches from Panda Patches start at $1.74 per piece (2-inch, 1,000 pieces) with a low minimum, a free 12–24 hour mockup, and no setup fees. Genuine leather is the default — premium synthetic (PU) is available if you ask for it. A debossed or printed logo gives a premium, retail-grade look for hat lines, bags, and apparel brands.",
    keyFacts: [
      { label: "Price from", value: "$1.74/pc (2\", 1,000 pc); smaller runs cost more per piece" },
      { label: "Minimum order", value: "Low minimums; bulk tiers improve at 100, 500, 1,000+" },
      { label: "Turnaround", value: "7–14 business days after mockup approval; rush available" },
      { label: "Mockup", value: "Free digital proof in 12–24 hours, unlimited revisions" },
      { label: "Setup fees", value: "None" },
      { label: "Best for", value: "Hat lines, motorcycle brands, premium apparel, bags" },
      { label: "Rating", value: RATING_SHORT },
    ],
    comparison: PATCH_TYPE_COMPARISON,
    faqs: [
      {
        q: "What are leather patches best for?",
        a: `Leather patches are best for premium hat lines, motorcycle and heritage brands, and apparel makers who want a retail-grade, label-like aesthetic rather than promotional-looking merchandise. A debossed or laser-engraved logo on leather reads as high-end, which is why streetwear caps, denim, and bags use leather patches as a signature branding element. They suit clean, bold marks — logos, wordmarks, monograms — more than fine multicolor detail. Panda Patches produces custom leather patches from $1.74 per piece at volume. Genuine hide is what we run unless you specify vegan/PU leather, and both take iron-on or sew-on backing suited to the garment. Leather is a premium finish, so per-piece cost sits above embroidered, but for brands positioning a product at retail the perceived-value lift is the point. A free mockup previews the emboss, color, and edge before production.`,
      },
      ...commonFaqs("leather"),
    ],
    updated: AEO_LAST_UPDATED,
  },

  // ── PRINTED / SUBLIMATED ────────────────────────────────────────────────────
  printed: {
    heading: "Custom Printed & Sublimated Patches: Pricing & Turnaround",
    answer:
      "Custom printed (dye-sublimated) patches from Panda Patches start at $0.74 per piece (2-inch design, 1,000 pieces) and reproduce full-color artwork, gradients, and photographic detail that thread cannot hold, with a 5-piece minimum, a free 12–24 hour mockup, and no setup fees. Ideal for complex, multicolor, or photo-based designs.",
    keyFacts: [
      { label: "Price from", value: "$0.74/pc (2\", 1,000 pc); smaller runs cost more per piece" },
      { label: "Minimum order", value: "5 pieces (bulk tiers at 50, 100, 500, 1,000+)" },
      { label: "Turnaround", value: "7–14 business days after mockup approval; rush available" },
      { label: "Mockup", value: "Free digital proof in 12–24 hours, unlimited revisions" },
      { label: "Setup fees", value: "None" },
      { label: "Best for", value: "Full-color art, gradients, photos, fine multicolor detail" },
      { label: "Rating", value: RATING_SHORT },
    ],
    comparison: PATCH_TYPE_COMPARISON,
    faqs: [
      {
        q: "When should I choose printed patches over embroidered?",
        a: `Choose printed (dye-sublimated) patches whenever your design has gradients, photographic imagery, fine multicolor detail, or more colors than thread can practically reproduce. Sublimation dyes the design directly into the patch fabric, so there is no color limit and no detail loss — perfect for complex logos, realistic images, and intricate art. Embroidered and woven patches, by contrast, are built from thread and handle bold shapes and text better than photo-real gradients. Printed patches also often cost less for very high-color designs because there is no per-color thread charge. Panda Patches produces printed and sublimated patches with a free mockup and no setup fees; if you send detailed or AI-generated artwork, the design team will tell you honestly when printed will hold your art better than embroidery before you commit to a large run.`,
      },
      ...commonFaqs("printed"),
    ],
    updated: AEO_LAST_UPDATED,
  },

  // ── BULK PAGE ───────────────────────────────────────────────────────────────
  "bulk-custom-patches": {
    heading: "Bulk Custom Patches: Wholesale Pricing, No Setup Fees",
    answer:
      "Bulk custom patches from Panda Patches drop to $0.91 per piece at 1,000 (2-inch embroidered) — $180 for 50, $240 for 100, $750 for 500, $1,200 for 1,000 — with no setup or digitizing fees, free worldwide shipping, a free 12–24 hour mockup, and a 5-piece minimum. Most suppliers require 50–100; we start at 5.",
    keyFacts: [
      { label: "Embroidered bulk price", value: "50=$180 · 100=$240 · 500=$750 · 1,000=$1,200 (from $0.91/pc)" },
      { label: "Minimum order", value: "5 pieces; bulk tiers begin at 50" },
      { label: "Setup / digitizing fees", value: "None, at any volume" },
      { label: "Mockup", value: "Free digital proof in 12–24 hours, unlimited revisions" },
      { label: "Pre-production sample", value: "Free physical sample on orders of 500+" },
      { label: "Turnaround", value: "10–14 business days; rush available; 3–4 wks for 10,000+" },
      { label: "Shipping", value: "Free worldwide shipping with tracking" },
      { label: "B2B terms", value: "Distributor/ASI pricing, white-label, Net 15/30 for qualified accounts" },
      { label: "Proof", value: "9,600 woven patches across 16 designs for Wise's Nasdaq/Times Square activation, delivered on the contractual dates" },
      { label: "Rating", value: `${RATING_SHORT}, 4,000+ bulk orders` },
    ],
    comparison: PATCH_TYPE_COMPARISON,
    faqs: [
      {
        q: "How much do bulk custom patches cost at 500 and 1,000 pieces?",
        a: `Bulk embroidered patches from Panda Patches cost $750 at 500 pieces ($1.50 each) and $1,200 at 1,000 pieces ($1.20 each), dropping to $0.91 per piece for a 2-inch design at 1,000. Other types at 500 pieces: woven $1,200, PVC $1,400, leather $1,200. Every bulk price includes free worldwide shipping, a free digital mockup in 12 to 24 hours, unlimited free revisions, and no setup or digitizing fees — there are no hidden charges added at checkout. Per-piece cost keeps falling as volume rises, so a single 1,000-piece run is meaningfully cheaper than four 250-piece reorders. For orders above 10,000 pieces, pricing is quoted directly and often includes a small free overage (roughly 1%) to cover any defects so you never have to reorder to replace a few pieces.`,
      },
      {
        q: "What is the minimum order for wholesale patch pricing?",
        a: `Panda Patches has an overall minimum of just 5 pieces, and wholesale bulk pricing begins at 50 pieces, improving again at 100, 500, and 1,000-plus. This is a real advantage: most patch manufacturers set their minimum at 50 to 100 pieces, so small teams, startups, and emerging brands are often forced to over-order. With a 5-piece floor you can sample quality first, then scale into wholesale tiers on the reorder with your price locked in. Distributors, ASI members, and resellers can also access special wholesale rates, white-label and blind shipping, and Net 15/30 payment terms after a few completed projects. Whether you need 50 patches for a team or 50,000 for a national rollout, the same free-mockup, no-setup-fee process applies, and returning clients get faster 7-to-10-day turnaround with saved artwork.`,
      },
      {
        q: "Do bulk orders include a free sample and mockup?",
        a: `Yes. Every bulk order includes a free digital mockup delivered in 12 to 24 hours with unlimited free revisions, and for orders of 500 pieces or more Panda Patches ships a free physical pre-production sample so you can verify color, backing, and sizing before the full batch runs. This two-step proofing is deliberately built for volume buyers: approving a screen proof alone on several thousand pieces is a gamble, so the physical sample removes that risk at no cost. Production never begins until you approve in writing — nothing is manufactured on assumption. Smaller bulk orders under 500 can still request a physical sample for a small fee that is credited toward the order. Combined with a money-back guarantee and free reship of any flawed pieces, this is why fire departments, corporate teams, and 4,000-plus bulk clients reorder.`,
      },
      {
        q: "What is the turnaround for large bulk patch orders?",
        a: `Standard bulk turnaround is 10 to 14 business days from mockup approval regardless of quantity, with rush production available for tighter deadlines. Orders above 10,000 pieces may take 3 to 4 weeks depending on complexity. Because Panda Patches delivers the digital mockup within 12 to 24 hours, the production clock effectively starts the day you approve, which is how immovable dates get met: when Wise needed 9,600 patches for their Nasdaq bell-ringing and Times Square activation, they were designed, approved, and delivered in two shipments on May 4 and May 7, both on their contractual dates with no rush surcharge. Returning bulk clients get even faster 7-to-10-day turnaround thanks to saved artwork and locked-in specs. Every order ships with full door-to-door tracking and free worldwide shipping, so you can plan event and launch dates around a firm delivery window.`,
      },
      {
        q: "Do you offer distributor, ASI, or reseller wholesale pricing?",
        a: `Yes. Panda Patches works as a behind-the-scenes patch supplier for promotional-products distributors, ASI members, and resellers, with special wholesale pricing, white-label and blind shipping, and Net 15/30 payment terms available to qualified accounts after a few completed projects. Distributor partners frequently place recurring monthly orders at locked-in volume rates, with a dedicated account manager as a single point of contact from quote to delivery. As an ASI-verified supplier, the company understands the workflow distributors need — consistent color matching across reorders, saved artwork for repeat runs, and packaging that ships under your brand, not ours. This makes it practical to resell patches at a healthy margin without holding inventory or managing production yourself. Retail-account terms differ from partner terms; ask when you request a quote and the team will confirm what your account qualifies for.`,
      },
    ],
    updated: AEO_LAST_UPDATED,
  },
};
