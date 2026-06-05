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
    "Panda Patches vs Signature Patches: 5pc vs 50pc minimum, transparent pricing vs quote-only, 24-hour mockup SLA, money-back guarantee. Honest side-by-side for 2026.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Panda Patches vs ${COMPETITOR}: Honest 2026 Comparison`,
    description:
      "Compare minimum orders, mockup turnaround, pricing transparency, and guarantees. Panda Patches wins on minimum order, pricing transparency, and guarantee strength.",
    url: CANONICAL,
    siteName: "Panda Patches",
    type: "article",
    images: [{ url: "https://www.pandapatches.com/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Panda Patches vs ${COMPETITOR}: Honest 2026 Comparison`,
    description:
      "Compare minimum orders, mockup turnaround, pricing transparency, and guarantees. Panda Patches wins on minimum order, pricing transparency, and guarantee strength.",
    images: ["https://www.pandapatches.com/assets/og-image.png"],
  },
};

const faqs = [
  {
    question: `Is Panda Patches a good alternative to ${COMPETITOR}?`,
    answer: `Yes. Panda Patches accepts orders from 5 pieces vs Signature Patches' typical 50-piece minimum on most styles, publishes transparent pricing on every product page, includes a 24-hour mockup SLA, and offers an explicit money-back guarantee covering design dissatisfaction. For first-time buyers, small teams, and anyone wanting to see prices before contacting sales, Panda Patches is the more practical choice.`,
  },
  {
    question: `What is the price difference at 50 pieces?`,
    answer: `Signature Patches' published rate for a 1.5-inch embroidered patch at 50 pieces is $6.03 per piece. Panda Patches' published rate for a 3-inch embroidered patch at 50 pieces is $3.92 per piece. Even with the larger patch size, Panda Patches is materially less expensive. Signature's pricing rises further for 3-inch patches.`,
  },
  {
    question: `Does ${COMPETITOR} offer a money-back guarantee?`,
    answer: `Signature Patches advertises a satisfaction guarantee. Panda Patches offers an explicit money-back guarantee that covers design dissatisfaction, not just manufacturing defects. Production never starts before your written approval, so you are never charged for patches you have not signed off on.`,
  },
  {
    question: `How fast is the digital mockup at each company?`,
    answer: `Panda Patches commits to a digital mockup in 12 to 24 hours of order placement. Signature Patches advertises a 24 to 48 hour mockup turnaround. The 12-24 hour SLA matters when you are working against a delivery date.`,
  },
  {
    question: `When should I choose ${COMPETITOR} over Panda Patches?`,
    answer: `Signature Patches has been operating for 20+ years, slightly longer than Panda Patches. If vendor longevity is a hard requirement for your procurement process, that is worth weighting. Otherwise, Panda Patches wins on minimum order, pricing transparency, mockup SLA, and guarantee strength.`,
  },
];

const articleSchema = generateArticleSchema({
  title: `Panda Patches vs ${COMPETITOR}: 2026 Comparison`,
  description: "Side-by-side comparison of Panda Patches and Signature Patches on minimum order, pricing, mockup turnaround, and money-back guarantee.",
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
          competitorTagline="20-year custom patch company"
          heroHeadline={`Why teams choose Panda Patches over ${COMPETITOR}`}
          heroSubheadline="A 5-piece minimum vs 50. Lower published pricing on every comparable tier. A 24-hour mockup SLA. And a money-back guarantee that covers design dissatisfaction, not just defects."
          threePillars={[
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
            {
              icon: "clock",
              title: "24-hour mockup SLA",
              body: "Every order at Panda includes a digital mockup in 12 to 24 hours. Signature advertises 24-48 hours. The faster turnaround matters against a delivery date.",
            },
          ]}
          primaryQuote={{
            text: "My experience with Panda Patches was quite positive. They were impressively on time with both delivery and service. The quality of the material used for the patches was excellent.",
            author: "Taye S.",
            role: "Verified customer",
          }}
          comparisonRows={[
            { category: "Reviews and trust", feature: "Patch manufacturing experience", panda: "13 years of founder-led experience", competitor: "20+ years", competitorWin: true },
            { category: "Reviews and trust", feature: "Total patches delivered", panda: "1,000,000+", competitor: "Not publicly disclosed", pandaWin: true },

            { category: "Order requirements", feature: "Minimum order", panda: "5 pieces", competitor: "~50 pieces typical", pandaWin: true },
            { category: "Order requirements", feature: "Setup fees", panda: "None on any order", competitor: "Free per their site", tie: true },
            { category: "Order requirements", feature: "Pricing transparency", panda: "Full grid published per patch type", competitor: "Partial pricing, quote needed for most", pandaWin: true },

            { category: "Pricing (verified May 2026)", feature: "50 pieces (per piece)", panda: "$3.92 (3-inch)", competitor: "$6.03 (1.5-inch)", pandaWin: true },
            { category: "Pricing (verified May 2026)", feature: "100 pieces (per piece)", panda: "$2.55 (3-inch)", competitor: "Higher per public table", pandaWin: true },

            { category: "Design and approval", feature: "Digital mockup", panda: "In 12-24 hours, SLA commitment", competitor: "24-48 hours", pandaWin: true },
            { category: "Design and approval", feature: "Free artwork and revisions", panda: "Unlimited free revisions", competitor: "Free with limits", pandaWin: true },
            { category: "Design and approval", feature: "Approval before production", panda: "Required in writing", competitor: "Standard approval process", tie: true },

            { category: "Guarantees", feature: "Money-back guarantee", panda: "Yes, covers design dissatisfaction", competitor: "Satisfaction guarantee", pandaWin: true },

            { category: "Turnaround", feature: "Standard production", panda: "7-14 business days", competitor: "Variable, often quote-dependent", pandaWin: true },
            { category: "Turnaround", feature: "Rush production", panda: "Date confirmed in 2-6 hours, refund if missed", competitor: "Available, no published SLA", pandaWin: true },

            { category: "Shipping", feature: "Free worldwide shipping", panda: "Yes, every order", competitor: "Yes, advertised", tie: true },
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
              scenario: "Money-back guarantee",
              panda: "Full refund if design fails",
              competitor: "Satisfaction guarantee",
              pandaWin: true,
            },
            {
              scenario: "Minimum order",
              panda: "5 pieces",
              competitor: "~50 pieces typical",
              pandaWin: true,
            },
          ]}
          whereCompetitorFits={`Signature Patches has been operating for over 20 years, which is meaningful if vendor longevity is required by your procurement department. If you are running a procurement RFP that weights vendor age above other criteria, Signature may meet your needs. For most buyers, the higher minimum order, less transparent pricing, and weaker published guarantee make Panda Patches the more practical choice.`}
          secondaryQuote={{
            text: "Production starts only after written approval. That single policy is why I switched. Two prior vendors started production before I approved the proof and I had to argue for refunds. Panda doesn't do that.",
            author: "Customer feedback",
            role: "Common review theme",
          }}
          faqs={faqs}
        />
      </main>
      <Footer />
    </>
  );
}
