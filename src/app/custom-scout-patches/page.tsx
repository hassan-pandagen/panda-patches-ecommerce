import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import TrustStrip from "@/components/products/TrustStrip";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import CTASection from "@/components/home/CTASection";
import MakerNote from "@/components/seo/MakerNote";
import { generateSchemaScript, generateFAQSchema } from "@/lib/schemas";
import { client } from "@/lib/sanity";
import { buildPageMetadata } from "@/lib/seo";

// Scout-specific FAQs. Deliberately accurate about what we can and cannot make:
// custom unit/patrol/event patches YES; official rank and merit badges NO (those
// are produced only through BSA-licensed suppliers). Claiming otherwise would be
// the same over-claim family as "OCP-compliant" — avoided on purpose.
const scoutFAQs = [
  {
    question: "Can you make custom patrol patches for our troop?",
    answer:
      "Yes. Custom patrol patches are one of our most common scout orders. Patrols design their own emblem — an animal, a symbol, a name — and we produce it as an embroidered or woven patch, typically around 2 to 3 inches. The minimum order is 5 pieces, so even a single patrol of six to eight scouts can order exactly what they need with no bulk requirement.",
  },
  {
    question: "Do you make official rank badges or merit badges?",
    answer:
      "No. Official rank badges, merit badges, and other official Scouts BSA insignia are produced only through official, BSA-licensed suppliers and should be purchased from your council's Scout Shop or ScoutShop.org. What we make is custom unit patches — patrol patches, troop and pack numerals, camporee and event patches, summer-camp patches, and fun patches — the designs your unit creates itself. If you are not sure whether a patch needs to be official, ask your unit leader before ordering.",
  },
  {
    question: "What size should a custom scout patch be?",
    answer:
      "Patrol emblems are usually about 2 inches so they fit the right sleeve position. Temporary and fun patches (camporees, events, pinewood derby, blue-and-gold) are commonly 3 inches and worn on the right pocket. Jacket-back and campfire-blanket patches run larger, from 4 inches up. These are general guidelines — always check your unit's or council's placement rules, since official positions are set by Scouts BSA, not by us.",
  },
  {
    question: "Can you produce custom camporee, camp, and event patches?",
    answer:
      "Yes. Camporee patches, summer-camp patches, pinewood derby patches, blue-and-gold banquet patches, Eagle Court of Honor patches, and one-off event patches are all standard for us. Send your artwork or a rough sketch and we return a digital mockup in 12 to 24 hours. Production only starts once your unit approves it, and revisions before approval are free and unlimited.",
  },
  {
    question: "What patch backing works best for scout uniforms and sashes?",
    answer:
      "Sew-on is the traditional and most durable choice for uniform shirts, sashes, and campfire blankets, and it survives repeated washing. Iron-on backing is convenient for temporary or fun patches on jackets and bags. Velcro is handy for patches you want to swap between uniforms. For a merit-badge sash or a rank position, follow the official Scouts BSA guidance on placement and attachment.",
  },
  {
    question: "What is the minimum order for custom troop patches?",
    answer:
      "Five pieces. There are no setup fees, no digitizing fees, and no small-order surcharge, so a small patrol pays the same per-piece quality as a large pack order. Pricing improves with quantity — a full troop or district camporee run of 100 or more pieces drops the per-piece cost significantly.",
  },
  {
    question: "How long do custom scout patches take to make?",
    answer:
      "Standard production is 7 to 14 business days after you approve the mockup, plus shipping. If you have a camporee or court-of-honor date, tell us in the order notes and we will confirm whether a rush timeline can meet it before you pay. A free digital mockup comes back within 12 to 24 hours of your request.",
  },
  {
    question: "Where do scout patches go on the uniform?",
    answer:
      "Patrol patches go on the right sleeve, troop numerals on the left sleeve under the council strip, and temporary or fun patches on the right pocket. For the full official placement chart — rank badges, council strips, Order of the Arrow flap, merit-badge sash, and more — see our Boy Scout uniform badge and patch placement guide.",
  },
];

export const revalidate = 86400;

// Only the shared hero trust badges are pulled from Sanity; the page needs no
// scout-specific CMS document, so it renders even with an empty result.
const getScoutPageData = cache(async () => {
  try {
    const data = await client.fetch(`{
      "hero": *[_type == "hero"][0] {
        "trustBadges": trustBadges[] { "url": image.asset->url, "alt": alt }
      }
    }`);
    return { trustBadges: data?.hero?.trustBadges || [] };
  } catch (error) {
    console.error("Scout page data fetch error:", error);
    return { trustBadges: [] };
  }
});

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Scout Patches | Patrol, Troop & Camp Patches from 5 Pieces",
  description:
    "Custom patrol patches, troop numerals, and camporee & event patches for Scout units — from a 5-piece minimum, mockup in 12-24 hours, no setup fees. Custom unit designs, not official rank or merit badges.",
  url: "https://www.pandapatches.com/custom-scout-patches",
  ogType: "website",
  ogTitle: "Custom Scout Patches: Patrol, Troop & Event Patches",
  ogDescription:
    "Custom patrol, troop, camp, and event patches for Scout units from 5 pieces. Free mockup in 12-24 hours, no setup fees.",
});

const BASE = "https://www.pandapatches.com";

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Scout Patches",
  description:
    "Custom patrol patches, troop and pack numerals, camporee and event patches for Scout units. Custom unit designs from a 5-piece minimum — not official rank or merit badges.",
  image: `${BASE}/assets/og-image.png`,
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0.91",
    highPrice: "4.60",
    offerCount: "3",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Custom Patches", item: `${BASE}/custom-patches` },
    { "@type": "ListItem", position: 3, name: "Scout Patches", item: `${BASE}/custom-scout-patches` },
  ],
};

export default async function ScoutPatchesPage() {
  const { trustBadges } = await getScoutPageData();

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(generateFAQSchema(scoutFAQs))} />

      <Navbar />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Custom Patches", href: "/custom-patches" },
        ]}
        currentPage="Scout Patches"
      />

      <BulkHero
        heroImage={null}
        trustBadges={trustBadges}
        customHeading="Custom Scout Patches"
        customSubheading="Patrol, Troop, Camp & Event Patches"
        customDescription="Custom patrol patches, troop numerals, and camporee & event patches your unit designs — from a 5-piece minimum, a free mockup in 12-24 hours, and no setup fees."
      />

      <TrustStrip />

      {/* WHAT WE MAKE — sets the honest scope up front */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[60rem]">
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-6 text-center">
            Custom Patches for Scout Units
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[1.0625rem] md:text-[1.1875rem] font-black text-panda-green mb-3">What we make</h3>
              <ul className="space-y-2 text-[0.9375rem] text-gray-700 leading-relaxed list-disc pl-5">
                <li>Custom <strong>patrol patches</strong> — your patrol&apos;s own emblem</li>
                <li>Troop and pack <strong>numerals</strong> and custom unit patches</li>
                <li><strong>Camporee</strong>, summer-camp, and district event patches</li>
                <li>Pinewood derby, blue-and-gold, and Eagle Court of Honor patches</li>
                <li>Fun patches and campfire-blanket / jacket-back patches</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-[1.0625rem] md:text-[1.1875rem] font-black text-panda-dark mb-3">What to buy from a Scout Shop</h3>
              <p className="text-[0.9375rem] text-gray-700 leading-relaxed">
                Official <strong>rank badges</strong>, <strong>merit badges</strong>, and other official Scouts BSA insignia are produced only through BSA-licensed suppliers — get those from your council Scout Shop or ScoutShop.org. We make the <em>custom</em> patches your unit designs itself, not official insignia. If you are unsure which a patch is, ask your unit leader first.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Promises bgColor="bg-[#F7F7F7]" />
      <ProcessSection />

      <CategoryFAQ title="Custom Scout Patches FAQ" faqs={scoutFAQs} />

      {/* SEO CONTENT + reciprocal links into the scout guides (the citation engine) */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-6">
            Custom Patrol & Troop Patches, Made to Your Design
          </h2>
          <div className="text-[0.9375rem] md:text-[1rem] text-gray-600 leading-[1.8] space-y-4">
            <p>
              A patrol&apos;s patch is its identity — the Flaming Arrows, the Screaming Eagles, the Radioactive Raccoons. We turn that idea into a real embroidered or woven patch your scouts wear with pride, from a <Link href="/custom-patches-no-minimum-order" className="text-panda-green font-bold underline">low 5-piece minimum</Link> with no setup fees. Send finished artwork or a rough sketch; our design team returns a free digital mockup in 12 to 24 hours, with unlimited revisions until your unit approves it.
            </p>
            <p>
              Beyond patrol patches, we produce troop and pack numerals, camporee and summer-camp patches, pinewood derby and blue-and-gold patches, Eagle Court of Honor patches, and campfire-blanket patches. Sew-on backing is the durable, traditional choice for uniforms and sashes; iron-on and velcro are available for fun patches and gear. For a deeper look at backings, see our <Link href="/custom-patches/backing-options" className="text-panda-green font-bold underline">backing options guide</Link>.
            </p>
            <p>
              Not sure where a patch belongs on the uniform? Our <Link href="/boy-scout-patch-placements-a-complete-guide" className="text-panda-green font-bold underline">Boy Scout uniform badge and patch placement guide</Link> maps out the official positions — patrol patch, council strip, Order of the Arrow flap, merit-badge sash, and more — and our guide on <Link href="/how-to-attach-scout-patches-without-sewing" className="text-panda-green font-bold underline">attaching scout patches without sewing</Link> covers the no-sew options for temporary patches.
            </p>
            <p>
              One honest note: we make <strong>custom</strong> unit patches, not official rank or merit badges. Official Scouts BSA insignia come only from BSA-licensed suppliers and your council Scout Shop. For everything your unit designs itself, we are here — <Link href="/contact" className="text-panda-green font-bold underline">get a free quote</Link> and we respond within 2 business hours.
            </p>
          </div>
        </div>
      </section>

      <MakerNote />
      <CTASection />
      <Footer />
    </main>
  );
}
