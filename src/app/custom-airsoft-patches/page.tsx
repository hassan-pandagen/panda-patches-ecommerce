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
import Craftsmanship from "@/components/home/Craftsmanship";
import ReviewsSection from "@/components/home/ReviewsSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { getClusterPageData } from "@/lib/clusterPageData";
import { getFromPriceLabel } from "@/lib/pricingCalculator";

const CANONICAL = "https://www.pandapatches.com/custom-airsoft-patches";

export const revalidate = 86400;

const airsoftFAQs = [
  {
    question: "What are airsoft patches?",
    answer:
      "Airsoft patches are morale, team, and identification patches worn on plate carriers, chest rigs, caps, and field kit. They cover squad and unit IDs, callsigns and name tapes, flag and IFF (friend-or-foe) markers, and morale designs. Most airsoft players run them on hook-and-loop Velcro so patches can be added, swapped, or removed between games and loadouts.",
  },
  {
    question: "What is the best patch type for airsoft kit?",
    answer:
      "PVC is the top pick for field use: it is fully waterproof, mud- and abrasion-resistant, and shrugs off the knocks of skirmish play. Embroidered patches are the classic textile option for morale and team designs. Both pair with hook-and-loop Velcro backing, the airsoft standard, and both can be built on camo twill so the background matches your loadout. PVC starts at " + getFromPriceLabel("Custom PVC Patches") + " per piece and embroidered at " + getFromPriceLabel("Custom Embroidered Patches") + " per piece at 2 by 2 inches and 1,000 pieces.",
  },
  {
    question: "Do airsoft patches come with Velcro backing?",
    answer:
      "Yes. Hook-and-loop Velcro is the standard backing for airsoft because plate carriers and rigs have loop panels built in. We attach the hook side to the patch so it presses straight onto your gear and pulls off in seconds. Velcro is a flat +$30 per order. Sew-on is also available if you want a patch fixed permanently to a uniform.",
  },
  {
    question: "Can you make team or squad patches in bulk?",
    answer:
      "Yes. The minimum is just 5 pieces, so you can order for a small squad or a whole field roster. There are no setup fees and no digitizing fees, and unit price drops at higher quantities. We Pantone-match your team colors and put every design on a free digital mockup in 12 to 24 hours before production.",
  },
  {
    question: "Can I get glow-in-the-dark or hi-vis details on an airsoft patch?",
    answer:
      "Yes. Glow-in-the-dark thread (for night-game visibility and novelty) and bright neon/hi-vis thread are both available on embroidered airsoft patches. Glow is a special-finish upgrade. See the threads and twills guide for the full range, including camo twill backgrounds that match woodland, multicam-style, or desert loadouts.",
  },
  {
    question: "How much do custom airsoft patches cost?",
    answer:
      "Pricing depends on type, size, and quantity. PVC airsoft patches start at " + getFromPriceLabel("Custom PVC Patches") + " per piece and embroidered at " + getFromPriceLabel("Custom Embroidered Patches") + " per piece at 2 by 2 inches and 1,000 pieces; smaller squad runs cost more per piece. Velcro backing adds a flat $30 per order. Every order includes free worldwide shipping, a mockup in 12 to 24 hours, and a money-back guarantee.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Airsoft Patches | Morale & Team Patches, Velcro",
  description:
    "Custom airsoft morale and team patches in durable PVC and embroidered, with hook-and-loop Velcro backing and camo twill. Squad IDs, callsigns, IFF, morale designs. 5-piece minimum, free worldwide shipping.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Airsoft Patches: Morale, Team & IFF Patches with Velcro Backing",
  ogDescription:
    "Waterproof PVC and embroidered airsoft patches built for field kit. Squad IDs, callsigns, morale designs, camo twill, and Velcro backing. From a low 5-piece minimum.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Airsoft Patches: Morale, Team, and IFF Designs for Field Kit",
  description:
    "Guide to custom airsoft patches at Panda Patches. Morale, team, callsign, and IFF designs in durable PVC and embroidered, with hook-and-loop Velcro backing and camo twill backgrounds. Low 5-piece minimum, free worldwide shipping, mockup in 12 to 24 hours.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Airsoft Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(airsoftFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Airsoft Patches",
  description:
    "Custom airsoft morale, team, and IFF patches in durable PVC and embroidered, with hook-and-loop Velcro backing and camo twill. Low 5-piece minimum, free worldwide shipping, mockup in 12 to 24 hours.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.91",
    highPrice: "4.60",
    offerCount: "4",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

export default async function CustomAirsoftPatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("pvc");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Airsoft Patches"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Airsoft Patches"
        customSubheading="Morale, Team & IFF Patches Built for the Field"
        customDescription="Waterproof PVC and classic embroidered patches with hook-and-loop Velcro backing and camo twill. Squad IDs, callsigns, and morale designs that survive skirmish play. From 5 pieces, free worldwide shipping, mockup in 12 to 24 hours."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            Yes, Panda Patches makes <strong>custom airsoft patches</strong>, morale, team, callsign, and IFF
            designs, from a low 5-piece minimum. For field kit we recommend waterproof PVC or classic embroidered
            patches on hook-and-loop Velcro, the airsoft standard, so you can swap them between plate carriers,
            rigs, and caps between games. Add a camo twill background to match a woodland, multicam-style, or
            desert loadout. Every patch ships with free worldwide shipping and a digital mockup in 12 to 24 hours.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />
      <Craftsmanship />

      {/* WHAT TO ORDER */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Patches Airsoft Players Order
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Morale patches", body: "Humor, unit identity, and field-flair designs for the loop panel on your rig." },
              { title: "Team & squad IDs", body: "Matching team logos, squad numbers, and event patches for the whole roster." },
              { title: "Callsigns & name tapes", body: "Personal callsigns and name strips that read clearly across the field." },
              { title: "Flag & IFF markers", body: "Flag patches and friend-or-foe markers, often with hi-vis or glow detail." },
            ].map((u) => (
              <div key={u.title} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="text-[16px] font-black text-panda-dark mb-2">{u.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPEC RECOMMENDATIONS */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Recommended Build for Airsoft
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Type</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]"><Link href="/custom-patches/pvc" prefetch={false} className="text-panda-green underline font-semibold">PVC</Link> for waterproof durability, or <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">embroidered</Link> for the classic textile morale look.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Backing</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]"><Link href="/custom-velcro-patches" prefetch={false} className="text-panda-green underline font-semibold">Hook-and-loop Velcro</Link> so patches swap between rigs and caps in seconds. Flat +$30 per order.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Background</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]"><Link href="/patch-threads-and-twills" prefetch={false} className="text-panda-green underline font-semibold">Camo twill</Link> to match your loadout, plus glow or hi-vis thread for night games.</p>
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
            Custom Airsoft Patches From 5 Pieces
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Airsoft patches take a beating, so the build matters. PVC patches are fully waterproof and
              abrasion-resistant, which makes them the most durable choice for skirmish kit, while embroidered
              patches give the traditional morale-patch look. Both run on hook-and-loop Velcro, the field
              standard, so a single rig can carry interchangeable squad, callsign, and morale patches that you
              reconfigure between games.
            </p>
            <p>
              With a 5-piece minimum and no setup fees, you can kit out a small squad or an entire field roster,
              and unit price falls as quantity rises. Add camo twill to match your loadout and glow or hi-vis
              thread for night play. For related designs, see our <Link href="/custom-tactical-patches" prefetch={false} className="text-panda-green underline font-semibold">tactical patches</Link> and <Link href="/custom-morale-patches" prefetch={false} className="text-panda-green underline font-semibold">morale patches</Link> pages. Every order ships with free worldwide shipping, a digital mockup in 12 to 24 hours, unlimited free revisions, and a money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Airsoft Patches FAQ" faqs={airsoftFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
