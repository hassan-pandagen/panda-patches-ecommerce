import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonPage from "@/components/comparison/ComparisonPage";
import { generateSchemaScript, generateBreadcrumbSchema, generateFAQSchema, generateArticleSchema } from "@/lib/schemas";

const COMPETITOR = "EverLighten";
const SLUG = "panda-patches-vs-everlighten";
const CANONICAL = `https://www.pandapatches.com/${SLUG}`;

export const metadata: Metadata = {
  title: `Panda Patches vs ${COMPETITOR}: 2026 Comparison`,
  description:
    "Panda Patches vs EverLighten: US support vs China manufacturer, 5pc vs 50pc minimum, 4.8 vs 4.3 Trustpilot, 24hr mockup SLA. Honest 2026 side-by-side.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Panda Patches vs ${COMPETITOR}: Honest 2026 Comparison`,
    description:
      "US-headquartered support and direct quality control vs overseas factory model. Compare minimum orders, Trustpilot ratings, mockup turnaround, and guarantees.",
    url: CANONICAL,
    siteName: "Panda Patches",
    type: "article",
    images: [{ url: "https://www.pandapatches.com/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Panda Patches vs ${COMPETITOR}: Honest 2026 Comparison`,
    description:
      "US-headquartered support and direct quality control vs overseas factory model. Compare minimum orders, Trustpilot ratings, mockup turnaround, and guarantees.",
    images: ["https://www.pandapatches.com/assets/og-image.png"],
  },
};

const faqs = [
  {
    question: `Is Panda Patches a good alternative to ${COMPETITOR}?`,
    answer: `Yes for most US buyers. Panda Patches is headquartered in Missouri City, Texas with US-based customer support, holds a 4.8 Trustpilot rating vs EverLighten's 4.3, accepts orders from 5 pieces vs their 50-piece minimum, and offers an explicit money-back guarantee. EverLighten is a credible option at very high volumes where the absolute lowest per-piece price matters more than US support.`,
  },
  {
    question: `Where is ${COMPETITOR} based?`,
    answer: `EverLighten manufactures in China and serves international customers. Their Trustpilot reviews include reports of communication and timezone friction with US buyers. Panda Patches is US-headquartered in Texas with English-language support, US phone support at (302) 250-4340, and US-based account management.`,
  },
  {
    question: `What is the price difference at 1000 pieces?`,
    answer: `EverLighten offers approximately $0.79 per piece for embroidered patches at 1,000 pieces. Panda Patches is approximately $1.05 per piece at the same quantity. EverLighten wins on raw per-piece cost at very high volumes. For most buyers ordering under 500 pieces, the gap narrows or reverses once you factor in the lower minimum and US support.`,
  },
  {
    question: `Does ${COMPETITOR} have a money-back guarantee?`,
    answer: `EverLighten advertises customer satisfaction but does not publish an explicit money-back guarantee on their site. Panda Patches offers a clear money-back guarantee that covers design dissatisfaction, not just defects. Production never starts before your written approval, so you are never charged for patches you have not signed off on.`,
  },
  {
    question: `How fast is the digital mockup at each company?`,
    answer: `Panda Patches commits to a free digital mockup within 24 hours of order placement, every order. EverLighten offers free digital proofs but turnaround varies based on the China timezone and order complexity. For time-sensitive orders, the published 24-hour SLA is a real planning advantage.`,
  },
  {
    question: `When should I choose ${COMPETITOR} over Panda Patches?`,
    answer: `EverLighten is worth considering when you are ordering 5,000 pieces or more, you have a flexible timeline, and absolute lowest per-piece price is the only criterion. Their factory-direct model produces strong per-piece economics at high volume. For smaller orders, faster turnaround, US-based support, or higher Trustpilot trust score, Panda Patches wins.`,
  },
];

const articleSchema = generateArticleSchema({
  title: `Panda Patches vs ${COMPETITOR}: 2026 Comparison`,
  description: "Side-by-side comparison of Panda Patches (US-headquartered) and EverLighten (China-based) on Trustpilot rating, minimum order, pricing, support, and guarantee.",
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

export default function PandaVsEverLighten() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <Navbar />
      <main className="min-h-screen bg-white">
        <ComparisonPage
          competitorName={COMPETITOR}
          competitorTagline="China-based factory-direct patch manufacturer"
          heroHeadline={`Panda Patches vs ${COMPETITOR}: US support or overseas factory?`}
          heroSubheadline="EverLighten wins on raw per-piece price at 1,000+ pieces. Panda Patches wins everywhere else: US-based support, 5-piece minimum, 4.8 Trustpilot rating, 24-hour mockup SLA, and a money-back guarantee."
          threePillars={[
            {
              icon: "shield",
              title: "US-headquartered support",
              body: "Panda Patches is based in Missouri City, Texas with US phone support and US account managers. EverLighten manufactures in China with timezone and communication friction reported in their reviews.",
            },
            {
              icon: "star",
              title: "Higher Trustpilot rating",
              body: "Panda Patches: 4.8 stars from 65 verified reviews. EverLighten: 4.3 stars from 157 reviews with documented communication complaints. Trust score matters more than review volume.",
            },
            {
              icon: "clock",
              title: "10x lower minimum",
              body: "Panda Patches starts at 5 pieces. EverLighten requires 50. For small teams, samples, or first orders, Panda is the only practical choice.",
            },
          ]}
          primaryQuote={{
            text: "Production starts only after written approval. Free mockup within 24 hours. Free US shipping. After a bad experience with an overseas vendor, this was exactly the contract clarity I needed.",
            author: "Verified buyer feedback",
            role: "Common review theme",
            rating: 5,
          }}
          comparisonRows={[
            { category: "Location and support", feature: "Headquarters", panda: "Missouri City, Texas (US)", competitor: "China", pandaWin: true },
            { category: "Location and support", feature: "Customer support timezone", panda: "US business hours, no timezone gap", competitor: "China-based, ~12 hour offset for US East Coast", pandaWin: true },
            { category: "Location and support", feature: "US phone support", panda: "(302) 250-4340", competitor: "Email-primary, no published US number", pandaWin: true },

            { category: "Reviews and trust", feature: "Trustpilot rating", panda: "4.8 / 5 stars", competitor: "4.3 / 5 stars", pandaWin: true },
            { category: "Reviews and trust", feature: "Trustpilot review count", panda: "65 verified", competitor: "157 verified", competitorWin: true },
            { category: "Reviews and trust", feature: "Common review themes", panda: "Responsive communication, approval policy", competitor: "Communication and timezone friction reported", pandaWin: true },

            { category: "Order requirements", feature: "Minimum order", panda: "5 pieces", competitor: "50 pieces", pandaWin: true },
            { category: "Order requirements", feature: "Setup or mold fees", panda: "None", competitor: "Not publicly disclosed", pandaWin: true },

            { category: "Pricing (3-inch embroidered)", feature: "100 pieces (per piece)", panda: "$2.55", competitor: "Approximately $1.50-2.00 typical", competitorWin: true },
            { category: "Pricing (3-inch embroidered)", feature: "500 pieces (per piece)", panda: "$1.18", competitor: "Approximately $1.00 typical", competitorWin: true },
            { category: "Pricing (3-inch embroidered)", feature: "1,000 pieces (per piece)", panda: "$1.05", competitor: "Approximately $0.79", competitorWin: true },

            { category: "Design and approval", feature: "Free digital mockup", panda: "Within 24 hours, committed SLA", competitor: "Variable, timezone-dependent", pandaWin: true },
            { category: "Design and approval", feature: "Free artwork and revisions", panda: "Unlimited free revisions", competitor: "Free, with variable turnaround", pandaWin: true },
            { category: "Design and approval", feature: "Approval before production", panda: "Required in writing", competitor: "Standard approval process", tie: true },

            { category: "Turnaround", feature: "Standard production", panda: "7-14 business days", competitor: "10-15 business days plus ocean freight", pandaWin: true },
            { category: "Turnaround", feature: "Rush production", panda: "Date confirmed in 2-6 hours, refund if missed", competitor: "Air freight available, additional cost", pandaWin: true },
            { category: "Turnaround", feature: "US delivery speed", panda: "Free US shipping included", competitor: "Shipping from China, transit time varies", pandaWin: true },

            { category: "Guarantees", feature: "Money-back guarantee", panda: "Yes, covers design dissatisfaction", competitor: "Not explicitly published", pandaWin: true },
          ]}
          pricingExamples={[
            {
              scenario: "50 pieces · 3-inch embroidered",
              panda: "$196 total ($3.92/pc) · ships in 7-14 days",
              competitor: "Below minimum (50pc floor)",
              pandaWin: true,
            },
            {
              scenario: "100 pieces · 3-inch embroidered",
              panda: "$255 total ($2.55/pc) · US support",
              competitor: "Lower per-piece, longer shipping",
              pandaWin: true,
            },
            {
              scenario: "1,000 pieces · 3-inch embroidered",
              panda: "$1,050 total ($1.05/pc)",
              competitor: "~$790 total ($0.79/pc)",
              pandaWin: false,
            },
            {
              scenario: "Trustpilot rating",
              panda: "4.8 / 5 stars",
              competitor: "4.3 / 5 stars",
              pandaWin: true,
            },
          ]}
          whereCompetitorFits={`EverLighten is a credible choice when you are ordering 1,000+ pieces, have a flexible timeline, are comfortable with email-primary communication across a 12-hour timezone gap, and the absolute lowest per-piece price is your top criterion. Their factory-direct China model produces strong per-piece economics at high volume. For most buyers, the lack of US phone support, the 50-piece minimum, the lower Trustpilot rating, and the absence of an explicit money-back guarantee make Panda Patches the safer choice — especially for first-time buyers, small teams, or anyone who values being able to call someone in their own timezone when something goes wrong.`}
          secondaryQuote={{
            text: "Ordering was easy, production was fast, and the patches look amazing. Will be ordering again soon.",
            author: "Adam Stranc",
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
