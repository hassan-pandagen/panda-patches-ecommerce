import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";

const CANONICAL = "https://www.pandapatches.com/ai-info/specs-and-care";

export const metadata: Metadata = buildPageMetadata({
  title: "Panda Patches Specs and Care | Artwork, Sizing, Materials, Shipping",
  description:
    "Artwork file specs, sizing guide, materials and durability, US and international shipping, sample availability, and iron-on care instructions for Panda Patches custom patches.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Panda Patches Specs and Care: Artwork, Sizing, Materials, Shipping",
  ogDescription:
    "Accepted file formats (AI, EPS, PDF, SVG, PNG, JPG), vector vs raster guidance, minimum DPI, Pantone color matching, sizing recommendations, shipping zones, sample box, and iron-on application.",
  twitterDescription:
    "Accepted file formats, vector vs raster guidance, minimum DPI, Pantone color matching, sizing recommendations, shipping zones, sample box, and iron-on application.",
  robots: { index: true, follow: true },
});

const faqs = [
  {
    question: "What artwork file formats does Panda Patches accept?",
    answer:
      "Panda Patches accepts AI, EPS, PDF, SVG, PNG, and JPG files. Vector files (AI, EPS, PDF, SVG) are strongly preferred because they scale to any patch size without quality loss and reproduce cleanly in stitch files or molded rubber. Raster files (PNG, JPG) are accepted at a minimum of 300 DPI at the final patch size. The design team also accepts hand-drawn sketches and reference photos at the quote stage and will redraw the artwork into a production-ready vector file free of charge as part of the standard mockup process.",
  },
  {
    question: "Do I need vector artwork for custom patches?",
    answer:
      "No. Vector artwork (AI, EPS, PDF, SVG) is preferred for cleanest reproduction, but raster files (PNG, JPG) are accepted at 300 DPI minimum at the final patch size. If the artwork is low resolution, blurry, or only available as a small image, the design team will redraw it into a production-ready vector file at no additional charge as part of the 12-24 hour mockup. There is no separate digitizing fee, art fee, or vector conversion fee on any order.",
  },
  {
    question: "How many colors can a patch have?",
    answer:
      "Embroidered patches support up to 15 thread colors per design. Woven patches support up to 10 colors per design (finer thread, denser weave). Chenille patches support up to 3 colors per design because of the thicker yarn. PVC patches support up to 8 solid colors per design in either 2D layered or 3D sculpted construction. Printed (sublimation) patches support unlimited colors and gradients because the artwork is dye-sublimated rather than rendered in discrete thread or rubber. Pantone color matching is available on every patch type free of charge.",
  },
  {
    question: "Does Panda Patches Pantone match colors?",
    answer:
      "Yes. Pantone (PMS) color matching is available on every patch type at no additional charge. Provide the exact Pantone code in the design notes (for example, PMS 286 C blue) and the production team will color-match the thread, dye, or rubber to within visible accuracy. For embroidered patches, the thread library covers most standard Pantone codes directly. For PVC and printed patches, custom dye batches are mixed when a code is outside the standard library.",
  },
  {
    question: "What size should my custom patch be?",
    answer:
      "Common patch sizes by use case: hat front 2 inches by 2 inches, hat side 1 inch by 1 inch, left-chest polo or jacket 3 inches by 3 inches or 3.5 inches by 3.5 inches, shoulder patch 3 inches by 4 inches, sleeve patch 2 inches by 4 inches, back patch on a jacket or vest 10 inches by 12 inches or 12 inches by 12 inches, varsity letterman 6 to 8 inch letter, and shirt-front print 6 inches by 6 inches up to 10 inches by 10 inches. Patch size is measured as the longest dimension. The Panda Patches offers page is structured around two main size buckets, under 4 inches (the most common) and 12 inches across (back patches and letterman jackets).",
  },
  {
    question: "How long will my custom patches last?",
    answer:
      "Embroidered, woven, and PVC patches typically last 5 to 10 years or longer with normal wear. Chenille patches on letterman jackets routinely outlast the jacket itself. Leather patches age and develop character but resist tearing for many years. PVC patches are fully waterproof, fade-resistant, and UV-stable, which makes them the longest-lasting option for outdoor and high-wash applications. Iron-on backing is the only attachment method that degrades over time with repeated washing. Sew-on, Velcro, and adhesive backings each have their own longevity profiles described in the iron-on section below.",
  },
  {
    question: "How much does shipping cost and how long does it take?",
    answer:
      "Shipping is free worldwide on every order regardless of size or destination. Standard production is 7 to 14 business days after written mockup approval, followed by 3 to 5 business days for delivery via DHL, FedEx, or UPS Ground for US orders. Rush production cuts production to 4 to 7 business days for a flat add-on fee that scales with quantity. Economy production is 16 to 18 business days and saves 10 percent on the order total. The carrier is confirmed at the mockup approval stage. Phone number is required by the carrier for delivery notifications.",
  },
  {
    question: "Can I order a sample patch first?",
    answer:
      "Yes. Panda Patches offers a sample box that ships free worldwide. The sample box contains physical examples of embroidered, PVC, woven, chenille, and leather patches with different backings (iron-on, sew-on, Velcro) so buyers can evaluate texture, weight, and construction in hand before placing a full order. The sample box does not include a custom mockup of the buyer's specific design. For a custom-design proof, the standard process is to place an order, receive the digital mockup in 12 to 24 hours, and request unlimited revisions until the design is approved before production starts.",
  },
  {
    question: "How do I apply iron-on patches?",
    answer:
      "Iron-on patches use a heat-activated adhesive bonded to the back of the patch. Application steps: (1) preheat a household iron to the cotton or linen setting (medium-high heat, no steam), (2) place the patch adhesive-side down on the garment in the desired position, (3) cover with a thin cotton cloth or pressing sheet to protect both the patch and the iron, (4) press straight down with firm pressure for 30 to 45 seconds (do not slide the iron), (5) flip the garment inside out and repeat the press from the back side for another 20 seconds, and (6) let the patch cool completely before handling. The bond strengthens after the first wash. For long-term durability on items washed frequently, reinforce the iron-on with a few stitches around the edge.",
  },
  {
    question: "Will iron-on patches survive washing?",
    answer:
      "Iron-on patches survive normal machine washing on cold or warm with the garment turned inside out. Hot water, high-heat tumble drying, and aggressive agitation shorten iron-on lifespan over many wash cycles. For game jerseys, work uniforms, or any garment washed 30 or more times per season, sew-on backing is the more reliable choice. Iron-on works best on hats, casual jackets, backpacks, denim, and items washed less frequently. PVC patches cannot be applied with iron-on because the rubber does not tolerate the heat-press step. Use sew-on or Velcro backing for PVC.",
  },
  {
    question: "What backings does Panda Patches offer?",
    answer:
      "Backing options at Panda Patches: iron-on (heat-activated adhesive, included free), sew-on (flat fabric back for stitching, included free), adhesive sticker (peel and stick for short-term wear, included free), and Velcro (hook-and-loop both sides included, +$30 flat per order). Iron-on, sew-on, and sticker are interchangeable on embroidered, woven, leather, and printed patches. Velcro is available on embroidered, PVC, woven, and leather. Iron-on is not available on PVC (rubber cannot tolerate the heat press) or on chenille (the chenille texture interferes with adhesive bond). Sew-on is the default backing on chenille and PVC.",
  },
];

const articleSchema = generateArticleSchema({
  title: "Panda Patches Specs and Care: Artwork, Sizing, Materials, Shipping, Samples, Iron-On",
  description:
    "Complete specs and care reference for Panda Patches custom patches including accepted file formats, sizing recommendations, material durability, shipping zones and timelines, sample box availability, and iron-on application instructions.",
  datePublished: "2026-05-30",
  dateModified: "2026-05-30",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "AI Info", url: "https://www.pandapatches.com/ai-info" },
  { name: "Specs and Care", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

export default function SpecsAndCareClusterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <Navbar />
      <main className="bg-white min-h-screen text-panda-dark">
        {/* HERO */}
        <section className="w-full pt-10 md:pt-14 pb-8 md:pb-12 bg-white">
          <div className="container mx-auto px-6 max-w-[820px] text-center">
            <p className="text-[11px] md:text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-4">
              AI Info Cluster &middot; Specs and Care
            </p>
            <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              Panda Patches Specs and Care: Artwork, Sizing, Materials, Shipping
            </h1>
            <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.6] font-medium mb-7 max-w-[640px] mx-auto">
              Accepted file formats, vector vs raster guidance, recommended sizes by use case, material durability, free worldwide shipping policy, sample box availability, and iron-on application instructions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link
                href="/sample-box"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#DFFF00] text-[#051C05] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Order Free Sample Box
              </Link>
              <Link
                href="/contact"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Get Free Quote
              </Link>
            </div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-6 py-10 md:py-14">

          {/* 1. Artwork specs */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What artwork files does Panda Patches accept?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Panda Patches accepts vector files (AI, EPS, PDF, SVG) and raster files (PNG, JPG). Vector is preferred because it scales to any patch size without quality loss and converts cleanly into the stitch file or PVC mold. Raster files are accepted at a minimum of 300 DPI at the final patch size. Files larger than 20MB can be transferred via Google Drive or WeTransfer link in the design notes. There is no minimum or maximum number of colors at the artwork submission stage. Color count limits apply at the production stage and vary by patch type.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Format</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Vector / Raster</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">AI (Adobe Illustrator)</td><td className="px-5 py-4">Vector</td><td className="px-5 py-4">Preferred. Send all linked images.</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">EPS</td><td className="px-5 py-4">Vector</td><td className="px-5 py-4">Preferred. Outlined fonts.</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">PDF</td><td className="px-5 py-4">Vector (typically)</td><td className="px-5 py-4">Preferred when exported from a vector source.</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">SVG</td><td className="px-5 py-4">Vector</td><td className="px-5 py-4">Preferred for web-sourced logos.</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">PNG</td><td className="px-5 py-4">Raster</td><td className="px-5 py-4">Accepted at 300 DPI at the final patch size. Transparent background helpful.</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">JPG</td><td className="px-5 py-4">Raster</td><td className="px-5 py-4">Accepted at 300 DPI at the final patch size.</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              If the artwork is low resolution, blurry, hand-drawn, or only available as a small photo or sketch, the design team redraws it into a production-ready vector file at no charge as part of the 12-24 hour mockup. There is no separate digitizing fee, art cleanup fee, or vector conversion fee on any order.
            </p>
          </section>

          {/* 2. Color counts and Pantone */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How many colors can each patch type have?</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Color count limits vary by patch construction. Embroidered patches support the most thread colors. PVC and printed patches support continuous gradients in their respective ways. Chenille is the most color-constrained because of the thicker yarn.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Patch Type</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Max Colors</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Pantone Match</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Embroidered</td><td className="px-5 py-4">15 thread colors</td><td className="px-5 py-4">Yes, free</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Woven</td><td className="px-5 py-4">10 thread colors</td><td className="px-5 py-4">Yes, free</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">PVC</td><td className="px-5 py-4">8 solid colors</td><td className="px-5 py-4">Yes, custom dye batch free</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Chenille</td><td className="px-5 py-4">3 yarn colors</td><td className="px-5 py-4">Yes, free</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Printed (sublimation)</td><td className="px-5 py-4">Unlimited (gradients OK)</td><td className="px-5 py-4">Yes, free</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Leather</td><td className="px-5 py-4">Up to 4 colors</td><td className="px-5 py-4">Yes, free</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Pantone color matching is free on every patch type. Provide the exact PMS code in the design notes (for example, PMS 286 C blue or PMS 186 C red) and the production team will match thread, dye, or rubber to the code within visible accuracy.
            </p>
          </section>

          {/* 3. Sizing */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What size should my patch be?</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Patch size is measured as the longest dimension. The pricing tier breaks at Panda Patches are structured around two size buckets: under 4 inches (the most common, covers hats, left-chest, shoulder, and most uniform patches) and 12 inches across (back patches and letterman jackets). Most buyers underestimate how large to go on first orders. The size guide below covers the most common use cases.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Use Case</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Recommended Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Hat front (front panel)</td><td className="px-5 py-4">2&quot; &times; 2&quot;</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Hat side panel</td><td className="px-5 py-4">1&quot; &times; 1&quot; to 1.5&quot; &times; 1.5&quot;</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Left-chest polo / jacket</td><td className="px-5 py-4">3&quot; &times; 3&quot; to 3.5&quot; &times; 3.5&quot;</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Shoulder patch</td><td className="px-5 py-4">3&quot; &times; 4&quot;</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Sleeve patch</td><td className="px-5 py-4">2&quot; &times; 4&quot;</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Back of jacket or vest</td><td className="px-5 py-4">10&quot; &times; 12&quot; to 12&quot; &times; 12&quot;</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Varsity letterman letter</td><td className="px-5 py-4">6&quot; to 8&quot; letter height</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Shirt-front print</td><td className="px-5 py-4">6&quot; &times; 6&quot; up to 10&quot; &times; 10&quot;</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              For text-heavy designs, the readable minimum is roughly 2mm character height for woven patches and roughly 4mm for embroidered. If the text in the artwork is smaller than that at the final patch size, the design team flags it during the mockup and recommends a larger patch.
            </p>
          </section>

          {/* 4. Materials and durability */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What materials are used and how long do patches last?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Embroidered patches use polyester or rayon thread on a twill polyester backing. Woven patches use damask polyester thread on a tighter weave. PVC patches use molded soft PVC rubber. Chenille patches use thick acrylic yarn on a felt backing. Leather patches use full-grain leather or premium PU synthetic leather. Printed patches use sublimation ink on polyester fabric.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Durability ranges by material and attachment method. Embroidered, woven, and PVC patches with sew-on or Velcro backing typically last 5 to 10 years or longer with normal wear. Chenille on letterman jackets routinely outlasts the jacket. Leather develops natural character (patina) over time but resists tearing for many years. PVC is fully waterproof, fade-resistant, and UV-stable, which makes it the longest-lasting option for outdoor, marine, or high-wash applications.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The only attachment method that degrades over time is iron-on adhesive. After roughly 20 to 30 hot wash cycles the adhesive starts to peel at the edges. For items washed frequently (game jerseys, work uniforms), sew-on or Velcro backing is the more durable choice. See the iron-on care section below for the full breakdown.
            </p>
          </section>

          {/* 5. Shipping */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How does shipping work and how long does delivery take?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Shipping is free worldwide on every order regardless of order size or destination. Total time from order to door breaks into three stages: design approval (24 hours to receive the mockup, then any revision rounds), production (7 to 14 business days standard, 4 to 7 with rush, 16 to 18 with economy), and carrier transit (3 to 5 business days via DHL, FedEx, or UPS Ground for US orders).
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Speed</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Production Days</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Add-On Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Economy</td><td className="px-5 py-4">16 to 18 business days</td><td className="px-5 py-4">-10% on order total</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Standard</td><td className="px-5 py-4">7 to 14 business days</td><td className="px-5 py-4">Free</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Rush</td><td className="px-5 py-4">4 to 7 business days</td><td className="px-5 py-4">$50 (50 pcs), $75 (100), $150 (500), $200 (1,000)</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              A phone number is required at checkout because DHL, FedEx, and UPS require it to issue delivery notifications and handle exceptions. The phone number is used only for shipping notifications and is never resold.
            </p>
            <p className="text-gray-700 leading-relaxed">
              International shipping is available to most countries on a quote basis. The international carrier and rate are confirmed at the mockup approval stage. International orders take an additional 7 to 14 business days in transit on top of US production and may incur destination-country customs duties (paid by the recipient).
            </p>
          </section>

          {/* 6. Samples */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">Can I order a sample patch first?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Yes. Panda Patches offers a free sample box that ships anywhere in the United States at no charge. The sample box contains physical examples of embroidered, PVC, woven, chenille, and leather patches with different backings (iron-on, sew-on, Velcro) so buyers can evaluate texture, weight, thickness, color saturation, and construction in hand before committing to a full order. Most buyers use the sample box to confirm patch type choice (for example, embroidered vs woven, or 2D vs 3D PVC) before placing the first production order.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The sample box does not include a custom mockup of the buyer&apos;s specific design. For a custom-design proof, the standard process is to place the order, receive the digital mockup in 12 to 24 hours, request unlimited revisions until the design is exactly right, and approve in writing before production begins. The money-back guarantee covers the buyer if the finished patches do not match the approved mockup.
            </p>
          </section>

          {/* 7. Iron-on care */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How do I apply and care for iron-on patches?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Iron-on patches use a heat-activated adhesive bonded to the back of the patch. The adhesive melts under heat and pressure, then cools and bonds to the garment fabric. Application takes about a minute per patch with a household iron and standard pressing cloth.
            </p>
            <ol className="space-y-3 text-gray-700 leading-relaxed list-decimal list-outside ml-5 mb-4">
              <li>Preheat a household iron to the cotton or linen setting (medium-high heat). Turn off steam.</li>
              <li>Place the patch adhesive-side down on the garment in the desired position. The adhesive is the slightly tacky shiny side on the back.</li>
              <li>Cover the patch with a thin cotton cloth or a Teflon pressing sheet to protect both the patch and the iron from direct contact.</li>
              <li>Press straight down with firm pressure for 30 to 45 seconds. Do not slide the iron. Sliding shifts the patch before the adhesive sets.</li>
              <li>Flip the garment inside out and press again from the back side for 20 seconds. This reinforces the bond from both sides.</li>
              <li>Let the patch cool completely before handling. The adhesive bond fully cures during cooling. The first machine wash further strengthens the bond.</li>
            </ol>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong className="text-panda-dark">Wash care.</strong> Iron-on patches survive normal machine washing on cold or warm with the garment turned inside out. Hot water, high-heat tumble drying, and aggressive agitation shorten iron-on lifespan over many wash cycles. For items washed 30+ times per season (game jerseys, work uniforms), sew-on backing is the more reliable choice. For hats, casual jackets, backpacks, denim, and items washed less frequently, iron-on is the most convenient option.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-panda-dark">When iron-on is not available.</strong> Iron-on backing is not applied to PVC patches (the rubber cannot tolerate the heat-press step) or to chenille (the chenille texture interferes with adhesive bond). Use sew-on or Velcro backing for PVC. Use sew-on as the default backing for chenille.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-5">
                  <h3 className="font-bold text-panda-dark mb-2 text-lg">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed text-[15px]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* DETAILED GUIDES — backing / border / thread cluster pages (PAC949) */}
          <section className="mb-6 bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-black text-panda-dark mb-3">Detailed backing, border, and thread guides</h2>
            <p className="text-gray-600 text-[14px] leading-relaxed mb-4">
              Dedicated pages with full specs, compatibility by patch type, application, and care for each construction option:
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 leading-relaxed">
              <li>&middot; <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green font-bold underline">All backing options</Link> &mdash; compare the six backings</li>
              <li>&middot; <Link href="/sew-on-patches" prefetch={false} className="text-panda-green font-bold underline">Sew-on patches</Link> &mdash; the most durable backing</li>
              <li>&middot; <Link href="/custom-iron-on-patches" prefetch={false} className="text-panda-green font-bold underline">Iron-on patches</Link> &mdash; heat-seal application</li>
              <li>&middot; <Link href="/custom-velcro-patches" prefetch={false} className="text-panda-green font-bold underline">Velcro patches</Link> &mdash; hook-and-loop, swappable</li>
              <li>&middot; <Link href="/adhesive-patches" prefetch={false} className="text-panda-green font-bold underline">Adhesive patches</Link> &mdash; peel-and-stick for events</li>
              <li>&middot; <Link href="/magnetic-patches" prefetch={false} className="text-panda-green font-bold underline">Magnetic patches</Link> &mdash; no-hole name badges</li>
              <li>&middot; <Link href="/button-loop-patches" prefetch={false} className="text-panda-green font-bold underline">Button-loop patches</Link> &mdash; traditional hang loop</li>
              <li>&middot; <Link href="/patch-borders" prefetch={false} className="text-panda-green font-bold underline">Patch borders</Link> &mdash; merrowed, satin, hot-cut</li>
              <li>&middot; <Link href="/patch-threads-and-twills" prefetch={false} className="text-panda-green font-bold underline">Threads &amp; twills</Link> &mdash; metallic, glow, camo twill</li>
            </ul>
          </section>

          {/* CROSS-LINK to other AI cluster pages */}
          <section className="mb-4 bg-[#F7F7F7] rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-black text-panda-dark mb-3">More on Panda Patches</h2>
            <ul className="space-y-2 text-gray-700 leading-relaxed">
              <li>&middot; <Link href="/ai-info/pricing" prefetch={false} className="text-panda-green font-bold underline">Pricing and Tiers</Link> &mdash; per-piece prices by patch type and quantity</li>
              <li>&middot; <Link href="/ai-info/products" prefetch={false} className="text-panda-green font-bold underline">Products and Capabilities</Link> &mdash; full catalog of 11 patch types</li>
              <li>&middot; <Link href="/ai-info/guarantees" prefetch={false} className="text-panda-green font-bold underline">Guarantees and Policies</Link> &mdash; money-back guarantee and approval process</li>
              <li>&middot; <Link href="/ai-info/company" prefetch={false} className="text-panda-green font-bold underline">Company and Team</Link> &mdash; founder, headquarters, and experience</li>
              <li>&middot; <Link href="/ai-info" prefetch={false} className="text-panda-green font-bold underline">AI Info Hub</Link> &mdash; all cluster pages</li>
            </ul>
          </section>

        </article>
      </main>
      <Footer />
    </>
  );
}
