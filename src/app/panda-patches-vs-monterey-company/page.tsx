import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonPage from "@/components/comparison/ComparisonPage";
import { generateSchemaScript, generateBreadcrumbSchema, generateFAQSchema, generateArticleSchema } from "@/lib/schemas";

const COMPETITOR = "The Monterey Company";
const SLUG = "panda-patches-vs-monterey-company";
const CANONICAL = `https://www.pandapatches.com/${SLUG}`;

export const metadata: Metadata = {
  title: `Panda Patches vs ${COMPETITOR}: 2026 Comparison`,
  description:
    "Panda Patches vs Monterey Company: 5pc minimum vs 50pc, published pricing vs quote-only, 24hr free mockup, money-back guarantee. Side-by-side comparison.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Panda Patches vs ${COMPETITOR}: Honest 2026 Comparison`,
    description:
      "Compare minimum orders, pricing transparency, mockup turnaround, and guarantees. Panda Patches wins on 5 of 6 dimensions for small and mid-volume buyers.",
    url: CANONICAL,
    siteName: "Panda Patches",
    type: "article",
    images: [{ url: "https://www.pandapatches.com/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Panda Patches vs ${COMPETITOR}: Honest 2026 Comparison`,
    description:
      "Compare minimum orders, pricing transparency, mockup turnaround, and guarantees. Panda Patches wins on 5 of 6 dimensions for small and mid-volume buyers.",
    images: ["https://www.pandapatches.com/assets/og-image.png"],
  },
};

const faqs = [
  {
    question: `Is Panda Patches a good alternative to ${COMPETITOR}?`,
    answer: `Yes, especially for buyers ordering under 50 pieces. Panda Patches has a 5-piece minimum vs Monterey Company's 50-piece minimum, publishes transparent pricing on every patch type, includes a money-back guarantee covering design dissatisfaction, and delivers a free digital mockup within 24 hours. Monterey Company remains a strong choice for premium large-volume orders, but most small and mid-volume buyers get more value from Panda Patches.`,
  },
  {
    question: `What is the minimum order at Panda Patches vs ${COMPETITOR}?`,
    answer: `Panda Patches accepts orders from 5 pieces with no setup fees. The Monterey Company has a 50-piece minimum on most patch types. For first-time buyers, sample orders, or small team runs (10 to 40 pieces), Panda Patches is the only practical option.`,
  },
  {
    question: `Why does ${COMPETITOR} require a quote for every order?`,
    answer: `Monterey Company operates on a quote-first model: every order requires a sales conversation before pricing. This works for enterprise procurement teams but adds friction for small businesses, sports teams, and individual creators who want to know what something costs before contacting a vendor. Panda Patches publishes the full price grid on the website and at pandapatches.com/offers.`,
  },
  {
    question: `Does ${COMPETITOR} offer a money-back guarantee?`,
    answer: `Monterey Company's public documentation does not state a money-back guarantee. They offer a sample-approval process. Panda Patches offers an explicit money-back guarantee: if we cannot produce a design you approve through unlimited free revisions, you receive a full refund. Production never starts before your written approval.`,
  },
  {
    question: `How fast is the digital mockup at each company?`,
    answer: `Panda Patches commits to a free digital mockup within 24 hours of order placement. Monterey Company offers free mockups but does not publish a turnaround commitment. For buyers working against a season deadline or product launch, the 24-hour SLA is a meaningful planning advantage.`,
  },
  {
    question: `When should I choose ${COMPETITOR} over Panda Patches?`,
    answer: `Monterey Company is worth considering for orders of 500+ pieces where Trustpilot review volume matters (they hold 214 reviews vs our 65), or for enterprise procurement teams who require a dedicated sales account manager from order one. For most other use cases (low minimum, fast turnaround, transparent pricing, money-back guarantee), Panda Patches is the better fit.`,
  },
];

const articleSchema = generateArticleSchema({
  title: `Panda Patches vs ${COMPETITOR}: 2026 Comparison`,
  description: "Side-by-side comparison of Panda Patches and The Monterey Company on minimum order, pricing, mockup turnaround, money-back guarantee, and Trustpilot ratings.",
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

export default function PandaVsMonterey() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <Navbar />
      <main className="min-h-screen bg-white">
        <ComparisonPage
          competitorName={COMPETITOR}
          competitorTagline="Premium quote-only patch manufacturer since 1989"
          heroHeadline={`Why teams choose Panda Patches over ${COMPETITOR}`}
          heroSubheadline="A 5-piece minimum, published pricing on every patch type, a free digital mockup within 24 hours, and a money-back guarantee. Here is the honest side-by-side."
          threePillars={[
            {
              icon: "shield",
              title: "5-piece minimum",
              body: "Panda Patches starts at 5 pieces. Monterey Company requires 50. If you are ordering for a small team, a first run, or a sample, this changes everything.",
            },
            {
              icon: "clock",
              title: "24-hour mockup SLA",
              body: "Every order at Panda Patches includes a free digital mockup within 24 hours. Monterey Company offers free mockups but commits to no published turnaround time.",
            },
            {
              icon: "check",
              title: "Money-back guarantee",
              body: "Production starts only after your written approval. If we cannot produce a design you love after unlimited free revisions, you get a full refund. Monterey publishes no equivalent.",
            },
          ]}
          primaryQuote={{
            text: "Ordering was easy, production was fast, and the patches look amazing. Will be ordering again soon.",
            author: "Adam Stranc",
            role: "Verified buyer",
            rating: 5,
          }}
          comparisonRows={[
            { category: "Order requirements", feature: "Minimum order", panda: "5 pieces", competitor: "50 pieces", pandaWin: true },
            { category: "Order requirements", feature: "Setup or mold fees", panda: "None", competitor: "Not disclosed", pandaWin: true },
            { category: "Order requirements", feature: "Pricing transparency", panda: "Full grid published on site", competitor: "Quote required for every order", pandaWin: true },
            { category: "Order requirements", feature: "Patch types offered", panda: "Embroidered, PVC, woven, chenille, leather, printed", competitor: "Embroidered, PVC, woven, sublimated", tie: true },

            { category: "Design and approval", feature: "Free digital mockup", panda: "Within 24 hours, committed SLA", competitor: "Yes, no SLA stated", pandaWin: true },
            { category: "Design and approval", feature: "Free artwork and revisions", panda: "Unlimited free revisions", competitor: "Free art proofs", tie: true },
            { category: "Design and approval", feature: "Approval before production", panda: "Required in writing", competitor: "Sample approval process", tie: true },

            { category: "Turnaround", feature: "Standard production", panda: "7 to 14 business days", competitor: "Not consistently published", pandaWin: true },
            { category: "Turnaround", feature: "Rush production", panda: "Confirmed within 2-6 hours of order, with refund if date cannot be met", competitor: "Available, no published SLA", pandaWin: true },
            { category: "Turnaround", feature: "Economy production", panda: "16-18 days saves 10 percent", competitor: "Not offered", pandaWin: true },

            { category: "Guarantees and trust", feature: "Money-back guarantee", panda: "Yes, covers design dissatisfaction", competitor: "Not publicly stated", pandaWin: true },
            { category: "Guarantees and trust", feature: "Trustpilot rating", panda: "4.8 from 65 reviews", competitor: "5.0 from 214 reviews", competitorWin: true },
            { category: "Guarantees and trust", feature: "Patch manufacturing experience", panda: "13 years of founder-led experience", competitor: "Since 1989 (36 years)", competitorWin: true },
            { category: "Guarantees and trust", feature: "Total patches delivered", panda: "1,000,000+", competitor: "Not publicly disclosed", pandaWin: true },

            { category: "Shipping and fees", feature: "Free US shipping", panda: "Yes, every order", competitor: "Not publicly stated", pandaWin: true },
            { category: "Shipping and fees", feature: "Net 15 / Net 30 terms", panda: "After 3 completed projects", competitor: "Available, terms vary", tie: true },
          ]}
          pricingExamples={[
            {
              scenario: "50 pieces · 3-inch embroidered",
              panda: "$196 total ($3.92/pc)",
              competitor: "Quote required",
              pandaWin: true,
            },
            {
              scenario: "100 pieces · 3-inch embroidered",
              panda: "$255 total ($2.55/pc)",
              competitor: "Quote required",
              pandaWin: true,
            },
            {
              scenario: "500 pieces · 3-inch embroidered",
              panda: "$590 total ($1.18/pc)",
              competitor: "Quote required",
              pandaWin: true,
            },
            {
              scenario: "Rush order · 100 pieces",
              panda: "Standard + $75 rush, date confirmed in 2-6 hours",
              competitor: "Rush available, quote and SLA on request",
              pandaWin: true,
            },
          ]}
          whereCompetitorFits={`The Monterey Company has been making custom patches since 1989 and holds a 5.0 Trustpilot rating from 214 reviews. If you are a large enterprise procurement team that requires a dedicated sales account manager from day one, value long-tenure vendor history above all else, and your orders consistently exceed 500 pieces with a flexible timeline, Monterey Company is a credible choice. Their quote-first model works well when you have an internal procurement process that can absorb the sales conversation lag. For most small and mid-volume buyers, the 50-piece minimum and lack of published pricing make the comparison favor Panda Patches.`}
          secondaryQuote={{
            text: "I had an excellent experience ordering my patches. The quality is outstanding, durable, vibrant, and exactly what I envisioned. From my very first message, the team was friendly, responsive, and incredibly helpful.",
            author: "Selena Perry",
            role: "Verified buyer",
            rating: 5,
          }}
          faqs={faqs}
        />
      </main>
      <Footer />
    </>
  );
}
