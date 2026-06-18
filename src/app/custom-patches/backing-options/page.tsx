import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import WorkGallery from "@/components/bulk/WorkGallery";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import TrustStrip from "@/components/products/TrustStrip";
import ReviewsSection from "@/components/home/ReviewsSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { getClusterPageData } from "@/lib/clusterPageData";
import { getFromPriceLabel } from "@/lib/pricingCalculator";

const CANONICAL = "https://www.pandapatches.com/custom-patches/backing-options";

export const revalidate = 86400;

const backingFAQs = [
  {
    question: "What backing options are available for custom patches?",
    answer:
      "Panda Patches offers six backing options: iron-on (heat-seal adhesive), sew-on (plain fabric edge), hook-and-loop Velcro, peel-and-stick adhesive (sticker), magnetic, and traditional button-loop. Iron-on, sew-on, and peel-and-stick are free. Velcro is a flat +$30 per order. Magnetic and button-loop are specialty backings quoted per order. You choose the backing at checkout or on your quote, and the choice does not change the base patch price for the standard three.",
  },
  {
    question: "Which patch backing is the most durable?",
    answer:
      "Sew-on is the most durable and permanent backing because the patch is stitched directly to the garment and survives unlimited industrial wash cycles. Iron-on lasts roughly 50 home washes before the adhesive weakens. Velcro is the most durable removable option, rated for thousands of attach-and-detach cycles. For anything washed more than 30 times per season, choose sew-on or reinforce an iron-on patch with edge stitching.",
  },
  {
    question: "What is the best backing for hats and caps?",
    answer:
      "For embroidered, woven, printed, and leather hat patches, iron-on or sew-on backing is standard. Many hat brands sew the patch on for a clean permanent finish, or order leather patches with heat-press backing. For trucker caps and snapbacks where the patch may be swapped, hook-and-loop Velcro lets one cap carry interchangeable patches.",
  },
  {
    question: "Can I get a patch I can move between garments?",
    answer:
      "Yes. Hook-and-loop Velcro is the removable choice: we attach the hook side to the patch and supply the loop side to sew onto each garment, so a single patch moves between a jacket, plate carrier, and bag in seconds. Magnetic backing is the no-sew removable option for name badges and suit lapels where you cannot pierce the fabric. Button-loop patches hang from an existing button and lift off without tools.",
  },
  {
    question: "Does the backing change the price of the patch?",
    answer:
      "Iron-on, sew-on, and peel-and-stick adhesive are free, so the patch costs the same base price regardless of which of those you choose. Hook-and-loop Velcro adds a flat $30 per order (not per piece) because it needs both the hook and loop sides plus extra sewing. Magnetic and button-loop are specialty backings priced per order; request a quote or use live chat for the exact cost. Base patches start at " + getFromPriceLabel("Custom Embroidered Patches") + " per piece for embroidered at 2 by 2 inches and 1,000 pieces.",
  },
  {
    question: "Which backing should I choose for tactical or military patches?",
    answer:
      "Hook-and-loop Velcro is the industry standard for tactical, military, and uniform patches. It lets operators swap unit, flag, name, and morale patches between plate carriers, packs, and uniforms without sewing, and it meets the expectation for that gear. PVC patches with Velcro backing are the most rugged, weatherproof combination for field use.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patch Backing Options Compared | Panda Patches",
  description:
    "Iron-on, sew-on, Velcro, adhesive, magnetic, and button-loop patch backings compared. Which to choose by garment, durability, and use. Free on the standard three, Velcro +$30/order. 5-piece minimum, free worldwide shipping.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Patch Backing Options: Iron-On vs Sew-On vs Velcro vs Adhesive vs Magnetic",
  ogDescription:
    "The complete guide to custom patch backings. Compare cost, durability, and which patch types support each, then pick the right one for your garment.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Patch Backing Options: The Complete Comparison Guide",
  description:
    "Compare every custom patch backing at Panda Patches: iron-on, sew-on, hook-and-loop Velcro, peel-and-stick adhesive, magnetic, and button-loop. Cost, durability, garment compatibility, and how to choose. Low 5-piece minimum, free worldwide shipping, mockup in 12 to 24 hours.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Backing Options", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(backingFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches with Choice of Backing",
  description:
    "Custom patches with a choice of six backings: iron-on, sew-on, Velcro, adhesive, magnetic, and button-loop. Low 5-piece minimum, free worldwide shipping, mockup in 12 to 24 hours.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.74",
    highPrice: "4.60",
    offerCount: "6",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

const SPOKES = [
  { href: "/custom-iron-on-patches", name: "Iron-On", tag: "Free", body: "Heat-seal adhesive. The no-sew standard for hats, denim, and casual apparel." },
  { href: "/sew-on-patches", name: "Sew-On", tag: "Free", body: "Plain fabric edge stitched on for permanent, wash-proof attachment on any garment." },
  { href: "/custom-velcro-patches", name: "Velcro (Hook & Loop)", tag: "+$30/order", body: "Swap patches between gear in seconds. The tactical and uniform standard." },
  { href: "/adhesive-patches", name: "Adhesive (Peel & Stick)", tag: "Free", body: "One-time peel-and-stick backing for events, trade shows, and short-term branding." },
  { href: "/magnetic-patches", name: "Magnetic", tag: "Quote", body: "No-hole, no-sew badge backing for suits, blazers, and uniforms you cannot pierce." },
  { href: "/button-loop-patches", name: "Button-Loop", tag: "Quote", body: "Traditional loop that hangs from an existing button. Classic for sashes and vests." },
];

export default async function BackingOptionsHubPage() {
  const { workSamples, trustBadges } = await getClusterPageData("custom-school-patches");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Backing Options"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Patch Backing Options"
        customSubheading="Six Ways to Attach Your Patch, Free on the Standard Three"
        customDescription="Iron-on, sew-on, Velcro, adhesive, magnetic, and button-loop. Pick the backing that matches your garment and how you'll use it. Mockup in 12 to 24 hours, free worldwide shipping, money-back guarantee."
      />

      {/* ANSWER-FIRST INTRO + COMPARISON TABLE */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[960px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] mb-8 max-w-[820px]">
            Every custom patch needs a way to attach to its garment, and the right backing depends on the
            fabric, how often it will be washed, and whether you want it permanent or removable. Panda Patches
            offers six backings on a low 5-piece minimum. <strong>Iron-on, sew-on, and peel-and-stick adhesive
            are free</strong>, hook-and-loop <strong>Velcro is a flat +$30 per order</strong>, and magnetic and
            button-loop are specialty backings quoted per order. Here is the full comparison, then a dedicated
            guide for each.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Backing</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Cost</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Best For</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Removable?</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Patch Types</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Iron-On</td><td className="px-5 py-4 font-black bg-panda-green/10">Free</td><td className="px-5 py-4">Hats, denim, casual apparel</td><td className="px-5 py-4">No (semi-permanent)</td><td className="px-5 py-4 text-gray-600">Embroidered, woven, printed, leather</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Sew-On</td><td className="px-5 py-4 font-black bg-panda-green/10">Free</td><td className="px-5 py-4">Uniforms, frequent wash, all garments</td><td className="px-5 py-4">Yes (unpick stitches)</td><td className="px-5 py-4 text-gray-600">All patch types</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Velcro (Hook & Loop)</td><td className="px-5 py-4 font-bold">+$30/order</td><td className="px-5 py-4">Tactical, military, swappable kit</td><td className="px-5 py-4">Yes (instant)</td><td className="px-5 py-4 text-gray-600">All types, best on PVC</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Adhesive (Peel & Stick)</td><td className="px-5 py-4 font-black bg-panda-green/10">Free</td><td className="px-5 py-4">Events, trade shows, short-term</td><td className="px-5 py-4">No (one-time)</td><td className="px-5 py-4 text-gray-600">Embroidered, printed, PVC</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Magnetic</td><td className="px-5 py-4">Quote</td><td className="px-5 py-4">Name badges, suits, no-hole uniforms</td><td className="px-5 py-4">Yes (lift off)</td><td className="px-5 py-4 text-gray-600">Embroidered, PVC, leather</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Button-Loop</td><td className="px-5 py-4">Quote</td><td className="px-5 py-4">Scout sashes, biker vests, traditional</td><td className="px-5 py-4">Yes (unbutton)</td><td className="px-5 py-4 text-gray-600">Embroidered, woven</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            For a deeper walk-through, see <Link href="/patch-backings-101-iron-on-vs-sew-on-vs-velcro" prefetch={false} className="text-panda-green underline font-semibold">Patch Backings 101</Link> and the
            full <Link href="/ai-info/specs-and-care" prefetch={false} className="text-panda-green underline font-semibold">specs and care guide</Link>.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />

      {/* SPOKE CARDS */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            Backing Guides, One Per Option
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-10 max-w-[700px] mx-auto">
            Not sure which to pick? Open the guide for any backing to see its pros and cons, compatible patch
            types, application steps, and care.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPOKES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                prefetch={false}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-panda-green hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[17px] font-black text-panda-dark">{s.name}</h3>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-panda-dark text-panda-yellow px-2.5 py-1 rounded-full">{s.tag}</span>
                </div>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{s.body}</p>
                <span className="inline-block mt-3 text-[13px] font-bold text-panda-green group-hover:underline">Read the guide &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO CHOOSE */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            How To Choose a Backing in 3 Questions
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <span className="text-[12px] font-black text-panda-green uppercase tracking-wider">Question 1</span>
              <h3 className="text-[17px] font-black text-panda-dark mt-1 mb-2">How often is it washed?</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Washed weekly or industrially: choose sew-on. Light or occasional wash: iron-on is fine. Never washed (badges, signage): adhesive or magnetic.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <span className="text-[12px] font-black text-panda-green uppercase tracking-wider">Question 2</span>
              <h3 className="text-[17px] font-black text-panda-dark mt-1 mb-2">Does it need to come off?</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Swap between garments often: Velcro. Remove without a hole: magnetic. Permanent: sew-on or iron-on. One-time stick: adhesive.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <span className="text-[12px] font-black text-panda-green uppercase tracking-wider">Question 3</span>
              <h3 className="text-[17px] font-black text-panda-dark mt-1 mb-2">What patch type is it?</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">PVC and chenille cannot take iron-on heat, so they default to sew-on or Velcro. Embroidered, woven, printed, and leather accept every backing.</p>
            </div>
          </div>
        </div>
      </section>

      <Promises bgColor="bg-[#F9FAF5]" />
      <ReviewsSection />
      <ProcessSection />

      {/* SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Pick a Backing, Then Order From 5 Pieces
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              The backing is the layer on the back of a custom patch that attaches it to fabric. Panda Patches
              lets you choose from six on every order: iron-on, sew-on, hook-and-loop Velcro, peel-and-stick
              adhesive, magnetic, and button-loop. The three standard choices, iron-on, sew-on, and adhesive,
              add nothing to the price. Velcro adds a flat $30 per order, and magnetic and button-loop are
              quoted per order. Whatever you choose, the patch ships with free worldwide shipping, a digital
              mockup in 12 to 24 hours, unlimited free revisions, and a money-back guarantee.
            </p>
            <p>
              Match the backing to the job. Sew-on is the most permanent and survives industrial laundry, which
              makes it the default for work uniforms and game jerseys. Iron-on is the fastest no-sew option for
              hats, denim, and bags. Velcro is the tactical and uniform standard because it lets one piece of
              gear carry interchangeable unit, flag, and name patches. Adhesive suits events and short-term
              branding, magnetic suits name badges and suit lapels you cannot pierce, and button-loop is the
              traditional hang-from-a-button style for scout sashes and biker vests.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Patch Backing Options FAQ" faqs={backingFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
