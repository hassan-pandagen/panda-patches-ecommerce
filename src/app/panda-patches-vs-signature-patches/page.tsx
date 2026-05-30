import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonPage from "@/components/comparison/ComparisonPage";
import { generateSchemaScript, generateBreadcrumbSchema, generateFAQSchema, generateArticleSchema } from "@/lib/schemas";

const COMPETITOR = "Signature Patches";
const SLUG = "panda-patches-vs-signature-patches";
const CANONICAL = `https://www.pandapatches.com/${SLUG}`;

export const metadata: Metadata = {
  title: `Panda Patches vs ${COMPETITOR}: 2026 Comparison`,
  description:
    "Panda Patches vs Signature Patches: 4.8 vs 4.0 Trustpilot, 5pc vs 50pc minimum, transparent pricing vs quote-only. Honest side-by-side comparison for 2026.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Panda Patches vs ${COMPETITOR}: Honest 2026 Comparison`,
    description:
      "Compare Trustpilot ratings, minimum orders, mockup turnaround, and pricing. Panda Patches wins on review score, minimum order, and pricing transparency.",
    url: CANONICAL,
    siteName: "Panda Patches",
    type: "article",
    images: [{ url: "https://www.pandapatches.com/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Panda Patches vs ${COMPETITOR}: Honest 2026 Comparison`,
    description:
      "Compare Trustpilot ratings, minimum orders, mockup turnaround, and pricing. Panda Patches wins on review score, minimum order, and pricing transparency.",
    images: ["https://www.pandapatches.com/assets/og-image.png"],
  },
};

const faqs = [
  {
    question: `Is Panda Patches a good alternative to ${COMPETITOR}?`,
    answer: `Yes. Panda Patches holds a 4.8 Trustpilot rating vs Signature Patches' 4.0. Panda accepts orders from 5 pieces vs their typical 50-piece minimum on most styles. Pricing is published transparently on every product page at Panda. For first-time buyers, small teams, and anyone wanting to see prices before contacting sales, Panda Patches is the more practical choice.`,
  },
  {
    question: `Why does ${COMPETITOR} have a lower Trustpilot rating?`,
    answer: `Signature Patches holds a 4.0 rating from 119 reviews with documented complaints about refund handling and order disputes. Panda Patches holds 4.8 from 65 verified reviews with positive feedback specifically about responsive communication and approval-before-production policy. Review volume favors Signature, but average score favors Panda.`,
  },
  {
    question: `What is the price difference at 50 pieces?`,
    answer: `Signature Patches' published rate for a 1.5-inch embroidered patch at 50 pieces is $6.03 per piece. Panda Patches' published rate for a 3-inch embroidered patch at 50 pieces is $3.92 per piece. Even with the larger patch size, Panda Patches is materially less expensive. Signature's pricing rises further for 3-inch patches.`,
  },
  {
    question: `Does ${COMPETITOR} offer a money-back guarantee?`,
    answer: `Signature Patches advertises a satisfaction guarantee, but Trustpilot reviews include reports of refund disputes when customers were unhappy with finished orders. Panda Patches offers an explicit money-back guarantee that covers design dissatisfaction, not just manufacturing defects. Production never starts before your written approval, so you are never charged for patches you have not signed off on.`,
  },
  {
    question: `How fast is the digital mockup at each company?`,
    answer: `Panda Patches commits to a free digital mockup within 24 hours of order placement. Signature Patches advertises a 24 to 48 hour mockup turnaround. The 24-hour SLA matters when you are working against a delivery date.`,
  },
  {
    question: `When should I choose ${COMPETITOR} over Panda Patches?`,
    answer: `Signature Patches has been operating for 20+ years, slightly longer than Panda Patches. If vendor longevity is a hard requirement for your procurement process, that is worth weighting. Otherwise, Panda Patches wins on Trustpilot score, minimum order, pricing transparency, mockup SLA, and guarantee strength.`,
  },
];

const articleSchema = generateArticleSchema({
  title: `Panda Patches vs ${COMPETITOR}: 2026 Comparison`,
  description: "Side-by-side comparison of Panda Patches and Signature Patches on Trustpilot rating, minimum order, pricing, mockup turnaround, and money-back guarantee.",
  datePublished: "2026-05-22",
  dateModified: "2026-05-22",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Compare", url: "https://www.pandapatches.com/custom-patches" },
  { name: `Panda Patches vs ${COMPETITOR}`, url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

export default function PandaVsSignature() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <Navbar />
      <main className="min-h-screen bg-white">
        <ComparisonPage
          competitorName={COMPETITOR}
          competitorTagline="20-year custom patch company with 4.0 Trustpilot rating"
          heroHeadline={`Why teams choose Panda Patches over ${COMPETITOR}`}
          heroSubheadline="A 4.8 Trustpilot rating vs 4.0. A 5-piece minimum vs 50. Lower published pricing on every comparable tier. And a money-back guarantee that covers design dissatisfaction, not just defects."
          threePillars={[
            {
              icon: "star",
              title: "Higher Trustpilot score",
              body: "Panda Patches: 4.8 stars from 65 verified reviews. Signature Patches: 4.0 stars from 119 reviews with documented refund disputes. Quality matters more than volume.",
            },
            {
              icon: "shield",
              title: "10x lower minimum order",
              body: "Panda starts at 5 pieces. Signature requires roughly 50 on most styles. If you need a sample run or a small team order, Panda is the only practical option.",
            },
            {
              icon: "check",
              title: "Lower published pricing",
              body: "Signature's published price for a 1.5-inch patch at 50 pieces is $6.03 per piece. Panda's 3-inch embroidered at the same quantity is $3.92. Larger patch, lower price.",
            },
          ]}
          primaryQuote={{
            text: "My experience with Panda Patches was quite positive. They were impressively on time with both delivery and service. The quality of the material used for the patches was excellent.",
            author: "Taye Sims",
            role: "Verified buyer",
            rating: 5,
          }}
          comparisonRows={[
            { category: "Reviews and trust", feature: "Trustpilot rating", panda: "4.8 / 5 stars", competitor: "4.0 / 5 stars", pandaWin: true },
            { category: "Reviews and trust", feature: "Trustpilot review count", panda: "65 verified", competitor: "119 verified", competitorWin: true },
            { category: "Reviews and trust", feature: "Patch manufacturing experience", panda: "13 years of founder-led experience", competitor: "20+ years", competitorWin: true },
            { category: "Reviews and trust", feature: "Total patches delivered", panda: "1,000,000+", competitor: "Not publicly disclosed", pandaWin: true },

            { category: "Order requirements", feature: "Minimum order", panda: "5 pieces", competitor: "~50 pieces typical", pandaWin: true },
            { category: "Order requirements", feature: "Setup fees", panda: "None on any order", competitor: "Free per their site", tie: true },
            { category: "Order requirements", feature: "Pricing transparency", panda: "Full grid published per patch type", competitor: "Partial pricing, quote needed for most", pandaWin: true },

            { category: "Pricing (verified May 2026)", feature: "50 pieces (per piece)", panda: "$3.92 (3-inch)", competitor: "$6.03 (1.5-inch)", pandaWin: true },
            { category: "Pricing (verified May 2026)", feature: "100 pieces (per piece)", panda: "$2.55 (3-inch)", competitor: "Higher per public table", pandaWin: true },

            { category: "Design and approval", feature: "Free digital mockup", panda: "Within 24 hours, SLA commitment", competitor: "24-48 hours", pandaWin: true },
            { category: "Design and approval", feature: "Free artwork and revisions", panda: "Unlimited free revisions", competitor: "Free with limits", pandaWin: true },
            { category: "Design and approval", feature: "Approval before production", panda: "Required in writing", competitor: "Standard approval process", tie: true },

            { category: "Guarantees", feature: "Money-back guarantee", panda: "Yes, covers design dissatisfaction", competitor: "Satisfaction guarantee with documented disputes", pandaWin: true },
            { category: "Guarantees", feature: "Quality consistency reports", panda: "1M+ deliveries, 4.8 star rating", competitor: "4.0 star rating reflects mixed quality reports", pandaWin: true },

            { category: "Turnaround", feature: "Standard production", panda: "7-14 business days", competitor: "Variable, often quote-dependent", pandaWin: true },
            { category: "Turnaround", feature: "Rush production", panda: "Date confirmed in 2-6 hours, refund if missed", competitor: "Available, no published SLA", pandaWin: true },

            { category: "Shipping", feature: "Free US shipping", panda: "Yes, every order", competitor: "Yes, advertised", tie: true },
          ]}
          pricingExamples={[
            {
              scenario: "50 pieces · embroidered (3-inch Panda vs 1.5-inch Signature)",
              panda: "$196 total ($3.92/pc)",
              competitor: "$301 total ($6.03/pc)",
              pandaWin: true,
            },
            {
              scenario: "100 pieces · 3-inch embroidered",
              panda: "$255 total ($2.55/pc)",
              competitor: "Higher than Panda per published table",
              pandaWin: true,
            },
            {
              scenario: "Trustpilot rating (verified social proof)",
              panda: "4.8 / 5 stars",
              competitor: "4.0 / 5 stars",
              pandaWin: true,
            },
            {
              scenario: "Money-back guarantee",
              panda: "Full refund if design fails",
              competitor: "Satisfaction guarantee (disputed in reviews)",
              pandaWin: true,
            },
          ]}
          whereCompetitorFits={`Signature Patches has been operating for over 20 years, which is meaningful if vendor longevity is required by your procurement department. They also hold more total Trustpilot reviews (119 vs our 65) even though our average rating is higher. If you are running a procurement RFP that weights vendor age above current rating, Signature may meet your criteria. For most buyers, the 4.0 vs 4.8 Trustpilot gap, documented refund disputes in their public reviews, and higher per-piece pricing make Panda Patches the safer choice.`}
          secondaryQuote={{
            text: "Production starts only after written approval. That single policy is why I switched. Two prior vendors started production before I approved the proof and I had to argue for refunds. Panda doesn't do that.",
            author: "Verified buyer feedback",
            role: "Common review theme",
            rating: 5,
          }}
          faqs={faqs}
        />
      </main>
      <Footer />
    </>
  );
}
