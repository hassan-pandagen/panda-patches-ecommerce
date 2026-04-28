# SEO Implementation Plan — Panda Patches

Scope: Two high-ROI SEO tasks from the 27 Apr 2026 audit.
Out of scope: HowTo schema (Google deprecated), FAQ schema (limited rich results), programmatic matrix pages (helpful-content risk), comparison pages (legal + listicle penalty risk).

---

## Task A — Rebuild `/how-much-do-custom-patches-cost-full-pricing-breakdown`

**Goal:** Highest-intent commercial-info URL becomes a proper pricing hub with table + calculator + Product schema.

### Pre-flight checks (do before editing)

1. Confirm exact slug: search the repo for "how-much-do-custom-patches-cost". The audit suggests this exact path; verify it matches the live page.
2. Read the current page top-to-bottom. Identify the prose sections worth keeping (history, materials explainers, etc.) vs. replacing.
3. Confirm `ComplexCalculator` works as a stand-alone embed — currently it's used on product pages with a productType prop. We'll mount it with a default productType + size selector exposed to user.

### Page structure (top to bottom)

1. **H1:** `Custom Patch Pricing 2026: Full Cost Breakdown + Calculator`
2. **Hero pricing table** (above the fold)
   - Rows: 25, 50, 100, 250, 500, 1000, 2500, 5000
   - Columns: Embroidered, Woven, PVC, Chenille, Leather, Printed
   - Cells: per-unit price at size 3" (the most common buyer size)
   - Source: build at server-render time from `getSchemaPricingTiers` in `src/lib/pricingCalculator.ts` — reuses existing pricing logic with the 10% uplift baked in.
   - Caption: "Per-unit prices at 3" size. All include free design mockup, free standard backing, free US shipping."
3. **Interactive calculator embed**
   - Reuse `ComplexCalculator` from `src/components/product/ComplexCalculator.tsx` with a productType selector dropdown above it.
   - Default productType: "Custom Embroidered Patches"
   - User can switch product type; calculator re-renders with that pricing.
4. **Three "Get Exact Quote" CTAs** at top, mid-page (~800 words in), and bottom. All scroll to the calculator.
5. **Existing prose sections** — keep the high-quality material explainers, history, FAQs about pricing factors. Compress redundant sections.
6. **Pricing factor breakdown** (4 short blocks of ~150 words each):
   - Why size matters
   - Why quantity drops the per-unit
   - Why backing affects price (mention velcro +$0.25/pc)
   - Why rush adds cost
7. **FAQ section** — 8 questions visible on page. Cover: setup fees, MOQ, rush, samples, shipping, design changes, color matching, returns. Render `FAQPage` schema even though the rich result is unreliable — zero penalty, free to add.

### Schema additions

Build these in `src/lib/schemas.ts` if not already there. Generate them in the page:

- **Product** with `AggregateOffer` covering the price range from the table (lowPrice = cheapest cell, highPrice = $5+ for largest sizes), `aggregateRating` from `TRUSTPILOT_RATING` + `TRUSTPILOT_REVIEW_COUNT` constants in `src/lib/reviewConstants.ts`.
- **FAQPage** with the 8 questions verbatim from page.
- **BreadcrumbList**: Home → Pricing.

### Acceptance

- Page contains a real `<table>` with at least 8 quantity rows × 6 type columns.
- Calculator embeds and updates live.
- Rich Results Test detects: Product (with AggregateOffer + AggregateRating), FAQPage, BreadcrumbList. Zero errors.
- Lighthouse mobile score doesn't regress (currently fine — we just need to not break LCP).

### Files to touch

- The existing pricing page (verify exact path).
- Optionally a new component `src/components/pricing/PriceMatrixTable.tsx` for the hero table (server component, builds rows from pricing helpers).
- Optionally a wrapper `src/components/pricing/CalculatorWithTypeSwitcher.tsx` if `ComplexCalculator` doesn't already support productType switching.

---

## Task B — Build `/reviews` page

**Goal:** Recover brand-defense traffic ("panda patches review", "is panda patches legit"). Currently those queries send users to Trustpilot directly.

### Pre-flight checks

1. Audit `TRUSTPILOT_REVIEWS.md` — pick 12-20 reviews to feature. Mix of patch types (embroidered, PVC, chenille) and use cases (military, fire dept, scout, biker, sports, corporate). Avoid all-5-star: include a couple of 4-star reviews with "minor issue resolved" stories — looks more credible.
2. Confirm Trustpilot widget script source (whichever embed is already on `/`).
3. Confirm we can pull customer photos (with permission). If we can't get photos, omit them — fake/stock photos here would be a trust killer.

### Page structure

URL: `/reviews`
File: `src/app/reviews/page.tsx`

1. **H1:** `Panda Patches Customer Reviews — 4.8★ Verified on Trustpilot`
2. **Trustpilot widget** at top (live count, live rating)
3. **Stats block** (4 tiles)
   - 1M+ patches delivered
   - 65+ verified Trustpilot reviews
   - 4.8★ average rating
   - 7-14 day standard delivery
4. **Featured reviews grid** (12-20 cards)
   - Each card: reviewer first name + last initial, star rating, date, full review text, optional customer photo of patches
   - Pull text directly from `TRUSTPILOT_REVIEWS.md` — keep verbatim
5. **Category breakdown** (optional — if `TRUSTPILOT_REVIEWS.md` has categorization)
   - "Reviews by patch type" — link to relevant product pages
6. **CTA block** at bottom: "Order with confidence" + link to calculator + secondary "Leave us a review" → Trustpilot

### Schema requirements

Critical rule: **only mark up reviews actually displayed on the page**. Do not include hidden reviews in schema — that's a structured-data violation per Google policy.

Build a single `Product` JSON-LD with:
- `name: "Custom Patches"`
- `brand: { name: "Panda Patches" }`
- `aggregateRating` from `TRUSTPILOT_RATING` / `TRUSTPILOT_REVIEW_COUNT` constants
- `review[]` array with one entry per visible review card
  - Each: `author.name`, `datePublished`, `reviewBody`, `reviewRating.ratingValue`

### Internal linking

- Add `/reviews` to nav (or footer at minimum)
- Link from `/contact`, `/about`, footer, and the homepage hero trust strip
- Add to sitemap with priority 0.7 (lower than product pages, higher than blog posts)

### Acceptance

- Page indexes within 48h of submission to GSC.
- Rich Results Test → Product with aggregateRating + valid Review array. Zero errors.
- Visible reviews on page match schema 1:1.
- Footer + nav link to it.

### Files to touch

- New: `src/app/reviews/page.tsx`
- New: `src/components/reviews/ReviewCard.tsx`
- Update: `src/app/sitemap.ts` to include `/reviews`
- Update: `src/components/layout/Footer.tsx` (and Navbar if appropriate) to link `/reviews`

---

## Sequence

**Day 1 (tomorrow):**
- Pre-flight checks for both tasks
- Decide: do we have customer photos for reviews? If not, design without them
- Build `/reviews` page first — simpler, fewer dependencies, immediate brand-defense win

**Day 2-3:**
- Build pricing page with table + calculator embed
- Test Rich Results on both new pages
- Submit updated sitemap to GSC + Bing Webmaster

**Day 4:**
- Monitor Vercel logs for any 500s on the new pages
- Watch GSC for indexing status

---

## What success looks like (30 days)

- Both pages indexed and ranking on the homepage of Panda Patches' brand searches
- `/reviews` ranking top-3 for "panda patches review" / "panda patches legit"
- Pricing page Rich Results showing AggregateOffer in SERP (price range "$0.50 - $5+" type display)
- 100-200 additional clicks/month from these two pages combined
