import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import TrustStrip from "@/components/products/TrustStrip";
import Craftsmanship from "@/components/home/Craftsmanship";
import ReviewsSection from "@/components/home/ReviewsSection";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import CTASection from "@/components/home/CTASection";
import MakerNote from "@/components/seo/MakerNote";
import { generateSchemaScript, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { RUSH_DELIVERY, MOCKUP_SLA, STANDARD_DELIVERY } from "@/lib/factConstants";

// Rush landing page (PANDAP_1 §5). Built for the live Rush search campaign that was
// temporarily pointed at the homepage. COMPLIANCE: rush is stated in business days
// only (~6-7); "24 hours" refers ONLY to the digital mockup; "from 5 pieces", never
// "no minimum"; no next-day/weekend/date promises; no "Made in USA".

const CANONICAL = "https://www.pandapatches.com/rush-custom-patches";

export const revalidate = 86400;

const rushFAQs = [
  {
    question: "How fast can you make custom patches?",
    answer: `Rush production completes in ${RUSH_DELIVERY} on qualifying orders, compared to our standard ${STANDARD_DELIVERY}. The clock starts after you approve your digital mockup, which we deliver in ${MOCKUP_SLA}. After you order rush, we confirm your exact delivery date by email within 2-6 hours — and if the date doesn't work, we remove the rush upgrade and refund the rush fee.`,
  },
  {
    question: "Can you rush large orders?",
    answer: "Yes. Owning our production facility means rush capacity scales: for Wise's Nasdaq Times Square activation we delivered 16,000 custom patches from first enquiry to delivery in under two weeks, every design approved before production. For event deadlines, uniform rollouts, and line-of-duty memorial patches, tell us your date and we plan production around it.",
  },
  {
    question: "What is the fastest turnaround for custom patches?",
    answer: `Rush production runs ${RUSH_DELIVERY} on qualifying orders after mockup approval. The digital mockup itself arrives in ${MOCKUP_SLA} with unlimited free revisions. We state turnaround in business days and confirm your exact date by email before production starts — we don't make next-day promises we can't keep.`,
  },
  {
    question: "Do rush orders cost more?",
    answer: "Rush adds a flat fee based on quantity — for example +$50 at 50 pieces, +$75 at 100, +$150 at 500, and +$200 at 1,000 on fixed-price packs (the calculator shows exact rush pricing for custom sizes at checkout). Everything else stays the same: free digital mockup, no setup or digitizing fees, and free worldwide shipping.",
  },
  {
    question: "Which patch types can be rushed?",
    answer: "Embroidered, PVC, chenille, and woven patches all qualify for rush production, from 5 pieces (woven from 10). Backing options — iron-on, sew-on, Velcro, sticker — don't affect the rush timeline.",
  },
  {
    question: "What do I need to start a rush order?",
    answer: `Send your artwork (AI, EPS, SVG, PDF, PNG, or JPG — or just describe your idea), your quantity, and your deadline through the quote form. We respond fast, your mockup arrives in ${MOCKUP_SLA}, and production starts the moment you approve.`,
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Rush Custom Patches in About 6-7 Business Days | Panda Patches",
  description:
    "Rush custom patches produced in about 6-7 business days on qualifying orders. From 5 pieces, free 12-24 hour mockup, no setup fees. Embroidered, PVC, chenille, and woven. 16,000 patches delivered in under two weeks for Wise.",
  url: CANONICAL,
  ogTitle: "Rush Custom Patches — About 6-7 Business Days | Panda Patches",
  ogDescription:
    "Need patches fast? Rush production in about 6-7 business days, mockup in 12-24 hours, from 5 pieces. Free worldwide shipping, no setup fees.",
  robots: { index: true, follow: true },
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Rush Custom Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(rushFAQs);

export default function RushCustomPatchesPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Custom Patches", href: "/custom-patches" },
        ]}
        currentPage="Rush Custom Patches"
      />

      {/* HERO — quote form above the fold; pageUrl tags the lead as rush-sourced */}
      <BulkHero
        simpleForm
        customHeading="Rush Custom Patches"
        customSubheading={`Produced in ${RUSH_DELIVERY} on qualifying orders`}
        customDescription={`Panda Patches makes rush custom patches in about 6-7 business days. Order from 5 pieces, free ${MOCKUP_SLA} mockup, no setup fees. Embroidered, PVC, chenille, and woven — we confirm your exact delivery date by email within 2-6 hours of ordering.`}
      />

      <TrustStrip />

      {/* ANSWER-FIRST TL;DR — liftable by AI engines */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[840px]">
            <strong>Panda Patches makes rush custom patches in about 6-7 business days</strong> on
            qualifying orders — order from 5 pieces, get a free digital mockup in {MOCKUP_SLA}, and pay
            no setup or digitizing fees. Embroidered, PVC, chenille, and woven patches all qualify.
            Because we own our production facility, rush capacity scales: we delivered{" "}
            <Link href="/case-studies/wise-nasdaq-times-square-activation" className="text-panda-green font-semibold underline">
              16,000 patches for Wise&apos;s Nasdaq Times Square activation
            </Link>{" "}
            from first enquiry to delivery in under two weeks. Your exact delivery date is confirmed by
            email within 2-6 hours of ordering — if it doesn&apos;t work, we remove the rush upgrade and
            refund the fee.
          </p>
        </div>
      </section>

      {/* HOW RUSH WORKS */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            How Rush Orders Work
          </h2>
          <ol className="space-y-3 text-[15px] md:text-[16px] text-gray-700 leading-[1.7] list-decimal pl-5">
            <li><strong>Send your design and deadline.</strong> Upload artwork (AI, EPS, SVG, PDF, PNG, JPG) or describe your idea in the form above — include the date you need patches in hand.</li>
            <li><strong>We confirm your date within 2-6 hours.</strong> You get your exact delivery date by email before anything is charged for rush. Doesn&apos;t work? We remove the rush fee, no questions asked.</li>
            <li><strong>Approve your mockup in {MOCKUP_SLA}.</strong> Unlimited free revisions — production never starts without your sign-off.</li>
            <li><strong>Rush production ships in {RUSH_DELIVERY}.</strong> Free worldwide shipping with full tracking.</li>
          </ol>
        </div>
      </section>

      {/* WHO USES RUSH */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-center text-panda-dark mb-8">
            Built for Real Deadlines
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Events & activations", body: "Trade shows, launches, and brand activations — like Wise's 16,000-patch Nasdaq event, delivered in under two weeks." },
              { title: "Memorial patches", body: "Line-of-duty memorial patches for fire and police departments are treated as our highest priority." },
              { title: "Team deadlines", body: "Tournament weekends, season openers, and jersey deadlines for sports teams and schools." },
              { title: "Uniform rollouts", body: "New-hire batches and company rebrands that can't wait for standard production." },
            ].map((u) => (
              <div key={u.title} className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
                <h3 className="text-[16px] font-black text-panda-dark mb-2">{u.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Craftsmanship />
      <ReviewsSection />
      <Promises bgColor="bg-white" />
      <ProcessSection />

      <CategoryFAQ title="Rush Custom Patches FAQ" faqs={rushFAQs} />

      <MakerNote />
      <CTASection />
      <Footer />
    </main>
  );
}
