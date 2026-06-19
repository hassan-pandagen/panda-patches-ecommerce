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

const CANONICAL = "https://www.pandapatches.com/custom-martial-arts-patches";

export const revalidate = 86400;

const martialArtsFAQs = [
  {
    question: "What is the best patch type for a BJJ gi?",
    answer:
      "Embroidered and woven patches are the standard for jiu-jitsu gis. Both are flat, durable, and survive the hot washing a gi gets between training sessions. Woven holds fine detail and small text best, which suits academy wordmarks; embroidered gives a bolder, textured logo. Both should use sew-on backing, since iron-on adhesive does not hold up to repeated hot-wash cycles on heavy gi cotton.",
  },
  {
    question: "Where do patches go on a BJJ gi?",
    answer:
      "Under IBJJF competition rules, gi patches are allowed in defined zones: across the back, on the jacket lapels and skirt, on the upper sleeves, and on the front of the pants near the thighs. Academy logos usually sit on the back and lapels, sponsor and team patches on the sleeves and legs. If you are ordering for competition, keep within the IBJJF placement and color regions; for training gis you have a free hand.",
  },
  {
    question: "Can you match my academy or gym logo exactly?",
    answer:
      "Yes. We Pantone (PMS) match your academy or gym colors at no extra charge and reproduce your logo, mascot, or wordmark on a free digital mockup in 12 to 24 hours. Request unlimited revisions until it is right; production starts only after you approve. There are no setup fees and no digitizing fees, so a precise logo costs the same as a simple one.",
  },
  {
    question: "What is the minimum order for martial arts patches?",
    answer:
      "5 pieces for embroidered patches and 10 for woven, so you can order for a single team, a belt-promotion group, or a full academy. Embroidered patches start at " + getFromPriceLabel("Custom Embroidered Patches") + " per piece and woven at " + getFromPriceLabel("Custom Woven Patches") + " per piece at 2 by 2 inches and 1,000 pieces. Smaller runs cost more per piece. No setup fees, free worldwide shipping on every order.",
  },
  {
    question: "Do you make patches for other martial arts, not just BJJ?",
    answer:
      "Yes. Beyond Brazilian jiu-jitsu, we make patches for karate, taekwondo, judo, MMA, Muay Thai, and kickboxing gyms, including dojo and academy logos, rank and team patches, event and seminar patches, and sponsor patches for fight kit. The recommended build, embroidered or woven with sew-on backing, applies across uniforms and gis that are washed often.",
  },
  {
    question: "Can you produce competition and sponsor patches in bulk?",
    answer:
      "Yes. Sponsor patches for fight teams, seminar and tournament patches, and grading-day team patches are all common bulk orders. With a 5-piece minimum and falling unit price at volume, you can run a small sponsor batch or kit out an entire competition team. Every design ships with a free mockup, unlimited revisions, free worldwide shipping, and a money-back guarantee.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Martial Arts & BJJ Gi Patches | Low 5-Piece Min",
  description:
    "Custom martial arts patches for BJJ gis, karate, judo, and MMA. Embroidered and woven academy, rank, team, and sponsor patches with sew-on backing. 5-piece minimum, free worldwide shipping, mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Martial Arts & BJJ Gi Patches: Academy, Rank & Sponsor Designs",
  ogDescription:
    "Embroidered and woven patches for jiu-jitsu gis and martial arts uniforms. Academy logos, rank, team, and sponsor patches with sew-on backing. From a low 5-piece minimum.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Martial Arts and BJJ Gi Patches: Academy, Rank, and Sponsor Designs",
  description:
    "Guide to custom martial arts patches at Panda Patches. Embroidered and woven gi patches for jiu-jitsu, karate, judo, and MMA, IBJJF placement zones, sew-on backing, logo matching, and pricing. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Martial Arts Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(martialArtsFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Martial Arts & BJJ Gi Patches",
  description:
    "Custom embroidered and woven patches for jiu-jitsu gis and martial arts uniforms. Academy, rank, team, and sponsor designs with sew-on backing. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.91",
    highPrice: "4.40",
    offerCount: "2",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

export default async function CustomMartialArtsPatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("custom-fraternity-sorority-patches");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Martial Arts Patches"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Martial Arts Patches"
        customSubheading="BJJ Gi, Karate, Judo & MMA Academy Patches"
        customDescription="Embroidered and woven patches built for gis and uniforms that get washed hot and often. Academy logos, rank, team, and sponsor patches with sew-on backing. From 5 pieces, free worldwide shipping, mockup in 12 to 24 hours."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            Yes, Panda Patches makes <strong>custom martial arts patches</strong> for Brazilian jiu-jitsu gis,
            karate, judo, MMA, and Muay Thai, from a low 5-piece minimum. The recommended build is an
            {" "}<strong>embroidered or woven</strong> patch with <strong>sew-on backing</strong>, because gis and
            uniforms are washed hot and often, which rules out iron-on adhesive. We Pantone-match your academy
            colors and reproduce your logo on a free mockup in 12 to 24 hours, with no setup or digitizing fees.
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
            Patches for the Mats
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Academy & gym logos", body: "Your dojo or academy wordmark and crest for the gi back and lapels." },
              { title: "Rank & team patches", body: "Belt, rank, and team identifiers for grading days and squads." },
              { title: "Sponsor patches", body: "Fight-kit sponsor logos for competitors, in clean woven detail." },
              { title: "Event & seminar", body: "Tournament, seminar, and grading-day commemorative patches." },
            ].map((u) => (
              <div key={u.title} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="text-[16px] font-black text-panda-dark mb-2">{u.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GI PLACEMENT NOTE */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-6">
            Gi Patch Placement &amp; Build
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-8 max-w-[760px] mx-auto">
            For IBJJF competition, patches are allowed in set zones: across the back, on the lapels and skirt, the
            upper sleeves, and the front thighs of the pants. Training gis are unrestricted. Here is the build we
            recommend so patches survive the wash.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Type</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]"><Link href="/custom-patches/woven" prefetch={false} className="text-panda-green underline font-semibold">Woven</Link> for fine logo detail, or <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">embroidered</Link> for a bolder, textured look.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Backing</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]"><Link href="/sew-on-patches" prefetch={false} className="text-panda-green underline font-semibold">Sew-on</Link>, the only backing that survives repeated hot washing on heavy gi cotton.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Placement</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Keep within IBJJF zones for competition gis; place freely on training gis.</p>
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
            Custom BJJ &amp; Martial Arts Patches From 5 Pieces
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              A gi patch lives a hard life: hot washes, heavy cotton, and constant grappling. That is why
              embroidered and woven patches with sew-on backing are the standard, they hold color and stay
              attached where an iron-on patch would lift. Woven is the better pick for small academy wordmarks and
              fine detail, while embroidered gives a bold, raised logo. We Pantone-match your colors free and put
              everything on a digital proof before production.
            </p>
            <p>
              From single-team sponsor runs to full-academy orders, the 5-piece minimum and no-setup-fee pricing
              keep it accessible, and the unit price drops as you scale. For competition gis, keep patches within
              the IBJJF placement zones. Browse the <Link href="/custom-patches/woven" prefetch={false} className="text-panda-green underline font-semibold">woven</Link> and <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">embroidered</Link> patch pages to start, and choose <Link href="/sew-on-patches" prefetch={false} className="text-panda-green underline font-semibold">sew-on backing</Link> at checkout. Every order includes free worldwide shipping, a mockup in 12 to 24 hours, unlimited free revisions, and a money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full pb-10 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[14px] text-gray-500 leading-relaxed">
            <span className="font-bold text-panda-dark">Related:</span>{" "}
            <Link href="/how-to-choose-the-right-custom-patch-size-type-backing-guide" prefetch={false} className="text-panda-green underline font-semibold">How to Choose the Right Patch</Link>
            {" · "}
            <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">Embroidered patches</Link>
            {" · "}
            <Link href="/custom-patches/woven" prefetch={false} className="text-panda-green underline font-semibold">Woven patches</Link>
          </p>
        </div>
      </section>

      <CategoryFAQ title="Martial Arts Patches FAQ" faqs={martialArtsFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
