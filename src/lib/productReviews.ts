/**
 * Product-scoped customer reviews — the compliant source of on-page reviews +
 * per-product Product.aggregateRating (GSC "Missing field aggregateRating", 2026-07).
 *
 * WHY THIS EXISTS (read before editing):
 * The Organization carries the company-wide Trustpilot rating (schemas.ts,
 * reviewConstants.ts). Google's policy is that a Product.aggregateRating must be
 * specific to THAT product and the rated reviews must be VISIBLE on the page. So we
 * cannot reuse the org number on product pages. Instead:
 *   1. Every review below is a REAL Trustpilot review (see TRUSTPILOT_REVIEWS.md,
 *      the full log, 95 reviews as of 9 Sept 2026). This file is a curated working
 *      subset — it does not need all of them. Do not invent reviews or ratings.
 *   2. A product page only emits aggregateRating when at least MIN_REVIEWS genuine,
 *      on-topic reviews back it — otherwise it stays rating-less (valid, no stars),
 *      which is the correct outcome, not a bug.
 *   3. The SAME reviews returned here MUST be rendered visibly on the page
 *      (ProductReviews.tsx). Emitting the rating without showing the reviews is a
 *      Google structured-data violation.
 *
 * ratingValue is the TRUE average of the reviews actually shown (rounded to 1dp);
 * reviewCount is the count actually shown — never the company-wide 75. The pool is
 * mostly 5★ because the real distribution is 94% 5★, and it includes genuine 4★
 * reviews so averages track reality (~4.8–5.0) instead of a suspicious flat 5.0.
 * The two real 1★ reviews are logged in TRUSTPILOT_REVIEWS.md and reflected in the
 * org-level 4.7 rating, but they are service complaints not tied to any product
 * TYPE, so they are not part of the per-product-type rotation.
 */

export interface CustomerReview {
  /** Real reviewer display name (as on Trustpilot). */
  name: string;
  /** ISO date (YYYY-MM-DD) for schema datePublished + on-page display. */
  date: string;
  /** Verbatim (lightly trimmed) review body. */
  body: string;
  /** 1–5 stars. */
  rating: number;
  /** Relevance tags: product types + use-cases + "general". Drives per-product matching. */
  tags: string[];
}

/** Minimum genuine reviews required before a product page emits aggregateRating. */
const MIN_REVIEWS = 4;
/** Cap shown per page so the section stays scannable and the rating stays representative. */
const MAX_REVIEWS = 6;

/**
 * Product-specific reviews — surface first on their matching product page. Each
 * carries a product-type/use-case tag (NOT "general"), so it only appears where
 * relevant, never as filler on an unrelated product.
 */
const SPECIFIC_REVIEWS: CustomerReview[] = [
  {
    // The first PRINTED-specific review we have had. Until this one, "printed"
    // had no entry in PRODUCT_TAGS below and the printed page therefore showed
    // six general company testimonials and nothing about printed patches.
    // Note her own framing — "even though it's just printed patches" — printed
    // is read as the budget option, and this beat the expectation that carries.
    name: "Sara", date: "2026-09-05", rating: 5, tags: ["printed", "hats"],
    body: "We received the patch earlier than expected. Patches are of high quality, even though it's just printed patches. They looked great and were used for our beanies",
  },
  {
    name: "Emily Rodgers", date: "2026-08-13", rating: 5, tags: ["leather", "woven", "event", "rush", "hats"],
    body: "Lance was great to work with and helped us out with a project that needed to be turned around quickly. He stayed on top of order and communicated well throughout the entire process. The patches ordered turned out great and our guests were excited to create their hats with the designs.",
  },
  {
    name: "Kelly Paschall", date: "2026-08-09", rating: 5, tags: ["woven", "event", "rush"],
    body: "Working with Lance and Panda Patches was a great experience. They worked with us to produce quality patches against a tight timeline. Lance was very communicative every step of the way and kept me in the loop from end to end production. The patches were great quality and turned out great for the event!",
  },
  {
    name: "Tim Roberts", date: "2026-06-16", rating: 5, tags: ["embroidered", "sports", "name"],
    body: "Ordered 100 embroidered patches for our youth wrestling club and couldn't be happier. The quality was exactly what we designed — clean stitching, colors came out great. When an unexpected customs fee came up on my end, Lance handled it immediately without any hassle.",
  },
  {
    name: "Erica Turner", date: "2026-06-16", rating: 5, tags: ["embroidered", "sports", "velcro"],
    body: "On behalf of Harvest Preparatory School Cheer, a huge thank you to Panda Patches. When our patches arrived we were beyond impressed — the quality is amazing and they adhered perfectly to our cheerleaders' backpacks. The finished product exceeded our expectations.",
  },
  {
    name: "Whitney", date: "2026-06-09", rating: 5, tags: ["embroidered", "tactical", "fire", "police"],
    body: "Lance was wonderful to work with and very timely with his emails. Our fire department patches turned out better than expected! Would totally recommend them.",
  },
  {
    name: "Eric Miner", date: "2026-03-20", rating: 5, tags: ["embroidered", "motorcycle"],
    body: "Panda Patches has been an excellent source for quality MC patches. They referenced an old family patch and made requested updates based on the AI images I provided. The final result is perfect with top quality at a very competitive price. They will have all of my future business.",
  },
  {
    name: "Jason Casey", date: "2026-05-20", rating: 5, tags: ["pvc", "reseller"],
    body: "Ordered my first run of custom PVC patches for a small business I'm launching. Design process was easy, they kept me updated during production, and the finished product looks exactly like the proof. PVC quality is solid — clean lines, good color, Velcro backing holds well. Turnaround and shipping were fast.",
  },
  {
    name: "Alexander Nicolaidis", date: "2026-03-14", rating: 5, tags: ["woven"],
    body: "Panda Patches has been an excellent source for quality patches, prints and emblems. All logos sent are thoroughly checked, colors are matched, and during the review process any issues are brought forward ahead of time so a perfect product can be produced. Highly recommend.",
  },
  {
    name: "Pamela Santos", date: "2025-10-07", rating: 5, tags: ["woven", "label"],
    body: "Dan was very helpful perfecting my logo and quickly responded with a label for review. In record time my labels were complete with a shipping notification. I can't wait to see them on my bags! Thank you Dan for a great experience.",
  },
  {
    name: "Mid-America Hap Ki Do", date: "2026-01-02", rating: 5, tags: ["martial-arts", "embroidered", "sports"],
    body: "The patches I received were high quality and exactly what I asked for. I will definitely be ordering from this company again.",
  },
  {
    name: "Edward Thornton", date: "2025-07-12", rating: 5, tags: ["embroidered", "brand"],
    body: "From the time I spoke with Matt at Panda Patches I felt at ease. My package came exactly when they said it would, and the patches were everything I expected and more — excellent quality and precision to detail, as the patch is my own hand-drawn logo and they nailed it.",
  },
  {
    name: "Tony Price", date: "2025-10-15", rating: 5, tags: ["reseller", "brand"],
    body: "Lance and the staff walked me through the process. Got my order and I'm already planning my reorder. The quality is amazing, so I'll have no problem marking up the prices of my hoodies for the winter!",
  },
  {
    name: "Kim", date: "2023-11-01", rating: 5, tags: ["brand"],
    body: "10 days from order date to receiving my beautiful vibrant-colored patches. Fast turnaround, quality workmanship, and excellent customer service. Thanks Panda Patches for helping me build my brand!",
  },
  {
    name: "Michelle", date: "2024-02-28", rating: 5, tags: ["event"],
    body: "I needed a quick turnaround for a patch to commemorate a big project at work — everywhere quoted a month or more when I had a little over two weeks. Panda Patches accommodated and got them here quicker than I requested. Options presented by a real human. Will use them for our next patch.",
  },
  {
    name: "Betsy Hartman", date: "2023-08-12", rating: 5, tags: ["event"],
    body: "Awesome work, great quality material, and production time was fast, as well as shipping. Highly recommend. Will use them again for event products next year. — Justin Rose Memorial Event Coordinator, Jonesborough TN",
  },
  {
    name: "Deb", date: "2025-12-16", rating: 5, tags: ["digitizing", "embroidered"],
    body: "Hands down, the best digitizing I've received! My design was very intricate so it was a few dollars more, but they did a fabulous job bringing out all the details. They will be my go-to from now on. Highly recommend!",
  },
];

/**
 * General order-experience reviews — real reviews with no specific product type,
 * usable as fill on any patch product page. Includes genuine 4★ reviews so per-page
 * averages stay honest. Order here + per-key rotation determines what shows where.
 */
const GENERAL_REVIEWS: CustomerReview[] = [
  // Added 2026-09-09 from the 25 Aug - 5 Sept batch. Newest first; the pool had
  // gone three weeks stale, so every page was showing reviews from July at best.
  { name: "JAM ATHLETICS LLC", date: "2026-09-05", rating: 5, tags: ["general"], body: "Excellent work. Delivery on time. Cost friendly." },
  { name: "Jarrett McDowell", date: "2026-09-05", rating: 5, tags: ["general"], body: "Great response when I had questions. Great customer service and informed me of status every step of the way." },
  { name: "Stefan Erdtmann", date: "2026-09-03", rating: 5, tags: ["general"], body: "Fast service, good quality, price ok." },
  { name: "Anthony Tazinator", date: "2026-09-01", rating: 5, tags: ["general"], body: "Patches came out fantastic. Couldnt be more happy with the quality and results." },
  { name: "Luke", date: "2026-08-28", rating: 5, tags: ["general"], body: "Great customer service. Very speedy responses to my emails on specific wants and needs!" },
  { name: "Etoy McDaniel", date: "2026-08-25", rating: 5, tags: ["general"], body: "Very nice patches. Thanks Panda Patches" },
  { name: "Daniel Pop", date: "2026-06-17", rating: 5, tags: ["general"], body: "Excellent service and top-quality products! I was impressed by how promptly they replied. The order arrived incredibly fast, and the quality of the patches is outstanding — they look absolutely amazing!" },
  { name: "David Newbert", date: "2026-05-14", rating: 5, tags: ["general"], body: "Very happy with my order from Panda Patches! They were precise with my custom order, had great communication, and delivered faster than promised. The patches came in looking great and the quality was excellent. 100% will order again!" },
  { name: "kimberly", date: "2026-07-07", rating: 5, tags: ["general"], body: "Came faster than expected, loved it. Great customer service. Kept me updated all the time." },
  { name: "Brandon Boone", date: "2026-02-26", rating: 5, tags: ["general"], body: "Quality came out so good! Was not expecting them as fast as I got them. Very happy with the overall result!" },
  { name: "Kevin Grant", date: "2026-03-13", rating: 5, tags: ["general"], body: "Top-tier communication, follow up, production, and speedy turnaround with pristine customer service!" },
  { name: "Andrea", date: "2025-01-14", rating: 5, tags: ["general"], body: "Lance is absolutely the best representative. Extremely knowledgeable, excellent customer service. Patches are high quality, vibrant, excellent materials, affordable especially in bulk, and arrived to the east coast US in about a week. Highly recommend." },
  { name: "Selena Perry", date: "2026-02-16", rating: 5, tags: ["general"], body: "The quality is outstanding — durable, vibrant, and exactly what I envisioned. The team gave great advice on choosing the best background colors to make my design stand out, and checked in after delivery. Highly recommend." },
  { name: "Paul Hart", date: "2023-08-10", rating: 5, tags: ["general", "reseller"], body: "Great quality, communication and fast turnaround! We use Panda Patches for all our patches. Every step is done with professionalism and accuracy. Pricing is extremely competitive. Quality is the best I've seen." },
  { name: "Javier Peña Ineditas", date: "2025-07-10", rating: 5, tags: ["general"], body: "I have nothing but great things to say about this company; they make the greatest patch work I've seen. They're trustworthy and have never once failed to message me back the same day. This is how every company should treat its customers." },
  { name: "Mike", date: "2026-04-30", rating: 5, tags: ["general"], body: "Lance made sure my patches were exactly what I wanted. Communication was prompt, shipping was fast. They even included extra patches, which was a great bonus. Will definitely be ordering again." },
  { name: "Sam Jefferson", date: "2024-04-04", rating: 5, tags: ["general"], body: "Lance has been very communicative and took the time to give me a good product. Their customer service is unmatched. If you're wondering where to get custom patches made, this is the place. An honest company that cares about their customers." },
  { name: "Robert Fisher", date: "2025-10-28", rating: 5, tags: ["general"], body: "My experience was Exquisite! I felt like family, not just a customer. I will most definitely be doing more business." },
  { name: "Nathan Steele", date: "2025-09-16", rating: 5, tags: ["general"], body: "Panda Patches understood the assignment and killed the delivery! Most appreciative of them and their team's work. Would definitely refer them to anyone." },
  { name: "Johnnye Johnson", date: "2025-07-31", rating: 5, tags: ["general"], body: "The product is top quality. You can tell great attention is paid to the finished product. Received in a great time period. Will recommend to anyone." },
  { name: "Gary Maryland", date: "2026-06-06", rating: 5, tags: ["general"], body: "Great work, great customer service, I will be doing business again." },
  { name: "Mark Pijanowski", date: "2026-07-09", rating: 5, tags: ["general"], body: "Great experience overall, and the company worked with me to adjust the template I submitted. Would recommend and use again in the future." },
  { name: "Wesley Bush", date: "2025-11-20", rating: 4, tags: ["general"], body: "Patches turned out to be great as advertised and the turnaround time was just as good." },
  { name: "Ezra Price", date: "2025-07-08", rating: 4, tags: ["general"], body: "The quality was very good. I will be shopping again." },
];

const REVIEWS: CustomerReview[] = [...SPECIFIC_REVIEWS, ...GENERAL_REVIEWS];

/** Highest-priority relevance tags per product slug/key. First match wins ordering. */
const PRODUCT_TAGS: Record<string, string[]> = {
  // patchStyle (/[slug]) pages
  "motorcycle-patches": ["motorcycle"],
  "custom-velcro-patches": ["velcro", "tactical"],
  "custom-tactical-patches": ["tactical"],
  "custom-morale-patches": ["tactical"],
  "custom-law-enforcement-patches": ["police", "tactical"],
  "custom-soccer-patches": ["sports"],
  "custom-hockey-patches": ["sports"],
  "custom-baseball-patches": ["sports"],
  "custom-martial-arts-patches": ["martial-arts", "sports"],
  "custom-name-patches": ["name"],
  "custom-logo-patches": ["brand", "reseller"],
  "custom-corporate-patches": ["brand", "reseller"],
  // audience / category pages with their own inline Product schema
  "custom-police-patches": ["police", "tactical"],
  "custom-fire-department-patches": ["fire", "tactical"],
  "custom-ems-patches": ["fire", "tactical"],
  "custom-sports-patches": ["sports"],
  "custom-airsoft-patches": ["tactical"],
  "custom-letterman-patches": ["sports"],
  // /custom-patches/[slug] category pages
  "pvc": ["pvc"],
  "woven": ["woven", "label"],
  "embroidered": ["embroidered"],
  // Added 2026-09-09 with the first printed-specific review. Before this there
  // was no "printed" key, so the printed page fell through to general filler
  // entirely — the same hole chenille and sequin are still in.
  "printed": ["printed"],
  // Added 2026-08-14 alongside the first genuinely leather-specific review.
  // Until then the leather category page had no route here, so it fell back
  // entirely to general filler.
  "leather": ["leather"],
  "custom-back-patches": ["embroidered", "sports"],
  "custom-leather-hat-patches": ["leather"],
};

interface ReviewSchemaFragment {
  aggregateRating: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: string;
    bestRating: "5";
    worstRating: "1";
  };
  review: Array<Record<string, unknown>>;
}

/** Stable string hash → non-negative int (deterministic per product key). */
function hashKey(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Pick up to MAX_REVIEWS genuine reviews for a product: tag-matched first (most
 * relevant), then broad order reviews as fill, rotated per product key so different
 * pages don't all show the same generic reviews. Deterministic per key, so the
 * schema and the visible <ProductReviews> always agree. Returns [] when fewer than
 * MIN_REVIEWS are available so the caller emits NO rating for that product.
 */
export function getProductReviews(productKey?: string): CustomerReview[] {
  const pref = (productKey && PRODUCT_TAGS[productKey]) || [];
  const seen = new Set<string>();
  const picked: CustomerReview[] = [];
  const take = (r: CustomerReview) => {
    if (seen.has(r.name) || picked.length >= MAX_REVIEWS) return;
    seen.add(r.name);
    picked.push(r);
  };

  // 1. product-specific matches, in listed order
  if (pref.length) {
    for (const r of SPECIFIC_REVIEWS) {
      if (r.tags.some((t) => pref.includes(t))) take(r);
    }
  }
  // 2. fill with general order reviews, rotated by product key for variety
  const offset = productKey ? hashKey(productKey) % GENERAL_REVIEWS.length : 0;
  for (let i = 0; i < GENERAL_REVIEWS.length; i++) {
    take(GENERAL_REVIEWS[(offset + i) % GENERAL_REVIEWS.length]);
  }

  return picked.length >= MIN_REVIEWS ? picked : [];
}

/** Average rating of a review set, rounded to one decimal (e.g. "5" / "4.8"). */
function averageRating(reviews: CustomerReview[]): string {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  // Trim a trailing ".0" so "5.0" renders as "5" (Google accepts both; cleaner markup).
  return (Math.round(avg * 10) / 10).toString();
}

/**
 * PRODUCT RATING MARKUP IS OFF. This returns null for every product, on purpose.
 *
 * An external audit on 8 Sept 2026 found the same people credited as reviewers
 * of different products: Paul Hart, Javier Pena Ineditas and Mike on PVC,
 * leather AND sequin; Sam Jefferson and Robert Fisher on leather and sequin.
 * Every type page carried aggregateRating 5 from 6 reviews.
 *
 * The reviews are real. The ratings were not, because these are reviews of the
 * COMPANY, not of a product. Look at what they say — "Lance has been very
 * communicative", "I felt like family, not just a customer" — and at how they
 * were selected: GENERAL_REVIEWS is filler, dealt out to any page short of its
 * own. There is no "chenille" key in PRODUCT_TAGS, so the chenille rating was
 * computed from 100% filler. Leather had one leather review and five fillers.
 *
 * Google's rule is not "reviews must be genuine", which these are. It is that a
 * Product.aggregateRating must be specific to that product. Filler makes it not,
 * and the MIN_REVIEWS gate below never tested for that — it counted reviews and
 * ignored where they came from, so it passed on all seven type pages.
 *
 * THE CONDITION FOR TURNING THIS BACK ON: an order-linked review record. A
 * review that arrived through /r/:token, tied to an order whose patches_type we
 * know. review_invitations already exist in Supabase; the redirect that would
 * attribute them does not. When it ships and real per-type reviews accumulate,
 * delete the early return and add a provenance check here — NOT just a count.
 *
 * Until then the honest markup is none. The testimonials stay visible and
 * attributed as company reviews (ProductReviews.tsx); it is the star rating on
 * a product that had no product reviews behind it that had to go.
 */
export function getProductReviewSchema(productKey?: string): ReviewSchemaFragment | null {
  return null;

  // eslint-disable-next-line no-unreachable
  const reviews = getProductReviews(productKey);
  if (!reviews.length) return null;

  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating(reviews),
      reviewCount: reviews.length.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating.toString(),
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: r.body,
    })),
  };
}
