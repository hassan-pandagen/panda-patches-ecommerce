/**
 * Bulk-page FAQ entries that are not in the page's own FAQPage schema block.
 *
 * Lifted out of BulkFAQ.tsx on 9 Sept 2026 so /bulk-custom-patches can merge
 * them with its schema entries and feed ONE array to both the markup and the
 * accordion. Before that the page marked up eleven questions nobody could see
 * and displayed eight that nothing marked up.
 */
import {
  STANDARD_DELIVERY,
  RUSH_DELIVERY,
  RUSH_SURCHARGE_PERCENT,
  RUSH_MIN_FEE,
  SAMPLE_BOX_PRICE,
  PRE_PRODUCTION_SAMPLE_MIN,
  MIN_ORDER_DEFAULT,
} from "@/lib/factConstants";

export const bulkFaqs = [
  {
    question: "What's the minimum order for bulk pricing?",
    answer: `Our overall minimum order is ${MIN_ORDER_DEFAULT} pieces. Bulk pricing tiers kick in at 50 pieces, with better rates at 100+, 500+, and 1,000+. Whether you need 50 patches for your team or 50,000 for a national rollout, we have got you covered.`
  },
  {
    question: "Can I get a pre-production sample before placing a large order?",
    answer: `Yes. On orders of ${PRE_PRODUCTION_SAMPLE_MIN} pieces or more we make and ship a free pre-production sample of your actual design, and hold the run until you approve it. Below that there is no paid sample of your design: you get the free digital mockup with unlimited revisions instead, and your first production order arrives with a free sample pack. If you want to judge our materials in hand before ordering, the $${SAMPLE_BOX_PRICE} sample box ships free.`
  },
  {
    question: "What file formats do you accept for artwork?",
    answer: "We accept all formats: AI, EPS, PDF, SVG (vector — preferred), as well as PNG, JPG, TIFF (raster). Don't have artwork? Send us a sketch, photo, or description and our design team will create a professional mockup for free."
  },
  {
    question: "Do you offer distributor or wholesale pricing?",
    answer: "Yes! We work with promotional products distributors, ASI members, and resellers. Contact us for special distributor rates, white-label options, and Net 15/30 payment terms. We're set up to be your go-to patch supplier."
  },
  {
    question: "What's the turnaround time for 1,000+ pieces?",
    answer: `Standard production is ${STANDARD_DELIVERY} for most bulk orders, regardless of quantity. Rush brings that down to ${RUSH_DELIVERY} for ${RUSH_SURCHARGE_PERCENT}% of the order total, minimum $${RUSH_MIN_FEE}, refunded if we miss the date. For orders over 10,000 pieces, turnaround may be 3-4 weeks depending on complexity, and large or complex runs can split-ship so the first batch still lands in 5 business days.`
  },
  {
    question: "Do returning customers get better pricing?",
    answer: "Yes! Returning bulk customers receive priority pricing, faster turnaround, and a dedicated account manager. Many of our bulk clients place recurring monthly orders and enjoy consistent volume discounts that improve over time."
  },
  {
    question: "Can you handle multiple patch designs in one order?",
    answer: "Absolutely. We frequently handle orders with 5-20+ different designs in a single run. Each design gets its own mockup approval process. Volume pricing is based on total pieces across all designs, so you still get bulk rates."
  },
  {
    question: "What quality standards do you follow?",
    answer: "Every patch goes through our 5-point quality inspection: thread tension verification, color matching, backing durability test, stitch integrity check, and final visual inspection. We use military-grade thread and professional twill backing. We have made patches for fire departments, police departments, and Fortune 500 teams."
  },
];


