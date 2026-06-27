import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import MakerNote from "@/components/seo/MakerNote";
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

const CANONICAL = "https://www.pandapatches.com/patch-types-compared";

export const revalidate = 86400;

// ── Group E asset 1: patch-type comparison data ──
const TYPES = [
  {
    name: "Embroidered",
    look: "Classic raised thread, textured",
    detail: "High — clean logos, not tiny text",
    durability: "Very high",
    cost: "$$",
    bestFor: "Uniforms, clubs, hats, scouts",
    href: "/custom-patches/embroidered",
  },
  {
    name: "Woven",
    look: "Flat, fine, smooth weave",
    detail: "Very high — fine detail & small text",
    durability: "High",
    cost: "$$",
    bestFor: "Detailed logos, small lettering",
    href: "/custom-patches/woven",
  },
  {
    name: "PVC",
    look: "Rubber, 3D, fully waterproof",
    detail: "Medium-high — bold raised shapes",
    durability: "Very high (weatherproof)",
    cost: "$$$",
    bestFor: "Tactical, outdoor gear, marine",
    href: "/custom-patches/pvc",
  },
  {
    name: "Chenille",
    look: "Fuzzy, raised, varsity texture",
    detail: "Low — bold letters & simple shapes",
    durability: "High",
    cost: "$$$",
    bestFor: "Letterman jackets, varsity, teams",
    href: "/custom-patches/chenille",
  },
  {
    name: "Printed",
    look: "Full-color, smooth, photo-real",
    detail: "Highest — gradients, photos, fine art",
    durability: "Medium",
    cost: "$",
    bestFor: "Gradients, photographs, complex art",
    href: "/custom-patches/printed",
  },
  {
    name: "Leather",
    look: "Premium, debossed or printed",
    detail: "Low-medium — logos & text",
    durability: "High",
    cost: "$$$",
    bestFor: "Hats, premium branding, rustic looks",
    href: "/custom-patches/leather",
  },
];

// ── Group E asset 3: size & backing chart data ──
const USE_CASES = [
  { use: "Hat / cap front", size: '2" – 2.5"', backing: "Iron-on or sew-on", type: "Embroidered, leather, woven" },
  { use: "Left chest", size: '3" – 3.5"', backing: "Iron-on", type: "Embroidered, woven" },
  { use: "Jacket back", size: '10" – 12"', backing: "Sew-on", type: "Embroidered, chenille" },
  { use: "Bag / backpack", size: '3" – 5"', backing: "Sew-on or velcro", type: "PVC, embroidered" },
  { use: "Tactical / uniform", size: '2" – 4"', backing: "Velcro (+$30)", type: "PVC, embroidered" },
  { use: "Letterman / varsity", size: '4" – 12"', backing: "Sew-on", type: "Chenille" },
];

const typeFAQs = [
  {
    question: "Which custom patch type is the most durable?",
    answer:
      "PVC and embroidered patches are the most durable. PVC is molded rubber that is fully waterproof and weatherproof, ideal for outdoor and tactical use. Embroidered patches hold up to repeated washing and heavy uniform wear. Printed (sublimation) patches are slightly less rugged because the design is dyed into the fabric rather than stitched, so they suit gradients and photo art more than rough outdoor use.",
  },
  {
    question: "Which patch type holds the smallest text and finest detail?",
    answer:
      "Woven and printed patches hold the finest detail. Woven patches use a thin flat thread that captures small lettering and intricate logos that embroidery would lose. Printed patches reproduce gradients, photographs, and unlimited colors. Embroidered patches are excellent for clean logos but cannot hold very tiny text. If your design has small type or fine lines, choose woven or printed.",
  },
  {
    question: "Embroidered vs woven patches — which should I choose?",
    answer:
      "Choose embroidered for a classic raised, textured look on logos, club crests, and uniform patches. Choose woven when your design has fine detail, small text, or a thin-line logo, because the flat weave captures detail embroidery cannot. Both are highly durable and similarly priced. For most hats, clubs, and uniforms, embroidered is the popular pick; for detailed brand logos, woven wins.",
  },
  {
    question: "Which custom patch type is the cheapest?",
    answer:
      "Printed (sublimation) patches are usually the lowest cost per piece because they skip stitching and use unlimited colors at no extra charge. Embroidered and woven sit in the mid-range, while PVC, chenille, and leather are premium due to molding, yarn, or material costs. Every type has no setup fees and a low 5-piece minimum, and smaller orders cost more per piece than bulk runs.",
  },
  {
    question: "What size and backing should I use for hats, jackets, and bags?",
    answer:
      "Hat patches are typically 2 to 2.5 inches with iron-on or sew-on backing. Left-chest patches are about 3 to 3.5 inches, usually iron-on. Jacket-back patches run 10 to 12 inches and should be sew-on for security. Bags and tactical gear often use velcro (hook-and-loop, +$30) so patches can be swapped. See the size and backing chart above for the full breakdown.",
  },
  {
    question: "Which patch type is best for full-color or photo designs?",
    answer:
      "Printed (sublimation) patches are best for full-color, gradient, and photographic designs because the dye-sublimation process reproduces unlimited colors and smooth transitions that thread cannot. Woven is the next best for detailed multi-color logos. Embroidered and chenille are limited to solid thread colors, so they suit bold, simple color palettes rather than photo-real artwork.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Patch Types Compared: Embroidered vs Woven vs PVC vs Chenille",
  description:
    "Compare custom patch types by look, detail, durability, and cost: embroidered, woven, PVC, chenille, printed, and leather. Plus a size and backing chart for hats, jackets, bags, and uniforms. 5-piece minimum, free worldwide shipping.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Patch Types Compared: Which Custom Patch Is Right for You?",
  ogDescription:
    "Embroidered, woven, PVC, chenille, printed, or leather? Compare look, detail, durability, and cost side by side, with a size and backing chart for every use case.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Patch Types Compared: Embroidered, Woven, PVC, Chenille, Printed and Leather",
  description:
    "Side-by-side comparison of custom patch types at Panda Patches by look, detail level, durability, and relative cost, plus a size and backing chart for hats, jackets, bags, and uniforms. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-06-27",
  dateModified: "2026-06-27",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Patch Types Compared", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(typeFAQs);

export default async function PatchTypesComparedPage() {
  const { workSamples, trustBadges } = await getClusterPageData("embroidered");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Patch Types Compared"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Patch Types Compared: Which One Is Right for You?"
        customSubheading="Embroidered, Woven, PVC, Chenille, Printed & Leather"
        customDescription="Not sure which patch type fits your design? Compare look, detail, durability, and cost side by side, then check the size and backing chart for your use case. Free mockup in 12 to 24 hours, free worldwide shipping, 5-piece minimum."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            Panda Patches makes six custom patch types. <strong>Embroidered</strong> gives the classic raised
            thread look; <strong>woven</strong> holds the finest detail and smallest text; <strong>PVC</strong> is
            waterproof rubber for outdoor and tactical use; <strong>chenille</strong> is the fuzzy varsity texture
            for letterman jackets; <strong>printed</strong> reproduces gradients and photos in unlimited color; and
            <strong> leather</strong> gives a premium, debossed finish. Match the type to your design and where the
            patch will live. Every type ships on a 5-piece minimum with free worldwide shipping and a mockup in 12
            to 24 hours.
          </p>
        </div>
      </section>

      <TrustStrip />

      {/* ── ASSET 1: PATCH-TYPE COMPARISON TABLE ── */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1080px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-3">
            The Six Patch Types, Side by Side
          </h2>
          <p className="text-[14px] md:text-[16px] text-gray-500 font-medium text-center max-w-[640px] mx-auto mb-8">
            Look, detail, durability, and relative cost for every patch type we make.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Look &amp; Texture</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Detail Level</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Durability</th>
                  <th className="text-center px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Cost</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Best For</th>
                </tr>
              </thead>
              <tbody>
                {TYPES.map((t) => (
                  <tr key={t.name} className="border-t border-gray-100 align-top hover:bg-[#F9FAF5] transition-colors">
                    <td className="px-5 py-4 font-black text-panda-dark whitespace-nowrap">
                      <Link href={t.href} prefetch={false} className="hover:text-panda-green transition-colors underline decoration-1 underline-offset-2">
                        {t.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{t.look}</td>
                    <td className="px-5 py-4 text-gray-600">{t.detail}</td>
                    <td className="px-5 py-4 text-gray-600">{t.durability}</td>
                    <td className="px-5 py-4 text-center font-bold text-panda-green whitespace-nowrap">{t.cost}</td>
                    <td className="px-5 py-4 text-gray-600">{t.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── ASSET 2: SOURCE NOTES / METHODOLOGY BOX ── */}
          <div className="mt-6 rounded-2xl bg-white border border-gray-200 border-l-4 border-l-panda-green shadow-sm p-5 md:p-6 max-w-[820px] mx-auto">
            <p className="text-[12px] font-black uppercase tracking-wider text-panda-green mb-2">
              How we rate these &mdash; source notes
            </p>
            <p className="text-[13.5px] md:text-[14px] text-gray-600 leading-[1.75]">
              <strong className="text-panda-dark">Durability</strong> reflects internal wash and abrasion testing
              (50+ standard home-wash cycles) plus field feedback across <strong className="text-panda-dark">1,000,000+
              patches delivered</strong>. <strong className="text-panda-dark">Cost</strong> ($&ndash;$$$) is the
              relative per-piece price at our standard 100-piece, 3-inch basis from the live configurator &mdash;
              smaller orders cost more per piece. <strong className="text-panda-dark">Detail level</strong> reflects
              the smallest legible text and finest line each method reliably holds. These are guidelines, not
              guarantees &mdash; your exact quote and a free digital mockup confirm the final spec before anything is made.
            </p>
          </div>
        </div>
      </section>

      {/* ── ASSET 3: SIZE & BACKING CHART ── */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-3">
            Size &amp; Backing by Use Case
          </h2>
          <p className="text-[14px] md:text-[16px] text-gray-500 font-medium text-center max-w-[640px] mx-auto mb-8">
            The recommended size, backing, and patch type for where your patch will live.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Use Case</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Typical Size</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Best Backing</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Recommended Type</th>
                </tr>
              </thead>
              <tbody>
                {USE_CASES.map((u) => (
                  <tr key={u.use} className="border-t border-gray-100 align-top hover:bg-[#F9FAF5] transition-colors">
                    <td className="px-5 py-4 font-black text-panda-dark whitespace-nowrap">{u.use}</td>
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">{u.size}</td>
                    <td className="px-5 py-4 text-gray-600">{u.backing}</td>
                    <td className="px-5 py-4 text-gray-600">{u.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed text-center mt-4">
            Backing is free (iron-on, sew-on, sticker); velcro adds $30 flat. See all options on the{" "}
            <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">backing guide</Link>.
          </p>
        </div>
      </section>

      {/* Work samples — visual proof, after the comparison + size charts */}
      <WorkGallery samples={workSamples} />

      <Promises bgColor="bg-[#F9FAF5]" />
      <ReviewsSection />
      <ProcessSection />

      {/* SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            How to Pick the Right Custom Patch Type
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Start with the design, then the environment. If your artwork is a clean logo or club crest, an{" "}
              <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">embroidered patch</Link>{" "}
              gives the classic raised look most people picture. If it has small text, thin lines, or fine detail, a{" "}
              <Link href="/custom-patches/woven" prefetch={false} className="text-panda-green underline font-semibold">woven patch</Link>{" "}
              captures what embroidery would lose. For gradients, photographs, or unlimited colors, a{" "}
              <Link href="/custom-patches/printed" prefetch={false} className="text-panda-green underline font-semibold">printed patch</Link>{" "}
              is the right call.
            </p>
            <p>
              Then match the material to where the patch lives. Outdoor, marine, and tactical gear suit waterproof{" "}
              <Link href="/custom-patches/pvc" prefetch={false} className="text-panda-green underline font-semibold">PVC patches</Link>;
              letterman jackets and varsity wear call for the fuzzy texture of{" "}
              <Link href="/custom-patches/chenille" prefetch={false} className="text-panda-green underline font-semibold">chenille patches</Link>;
              and premium branding on hats or bags looks sharp in{" "}
              <Link href="/custom-patches/leather" prefetch={false} className="text-panda-green underline font-semibold">leather</Link>.
              Still unsure? Send us your artwork and our designers recommend the best type free on your mockup, or
              preview a concept in the{" "}
              <Link href="/ai-patch-generator" prefetch={false} className="text-panda-green underline font-semibold">AI Patch Generator</Link>.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Patch Types FAQ" faqs={typeFAQs} />
      <CTASection />
      <MakerNote />

      <Footer />
    </main>
  );
}
