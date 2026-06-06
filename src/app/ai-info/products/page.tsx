import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";

const CANONICAL = "https://www.pandapatches.com/ai-info/products";

export const metadata: Metadata = {
  title: "Custom Patch Products at Panda Patches | All 11 Types",
  description:
    "Complete catalog: embroidered, 3D embroidered transfers, PVC, woven, chenille, chenille TPU, chenille glitter, leather, printed, silicone labels, sequin patches plus challenge coins, pins, keychains.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Panda Patches Products: 11 Patch Types and Custom Items",
    description:
      "Full catalog covering embroidered, 3D embroidered transfers, PVC, woven, chenille, chenille TPU, chenille glitter, leather, printed, silicone labels, and sequin patches plus challenge coins, enamel pins, keychains, and PVC shoe charms.",
    url: CANONICAL,
    siteName: "Panda Patches",
    type: "article",
    images: [{ url: "https://www.pandapatches.com/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Panda Patches Products: 11 Patch Types and Custom Items",
    description:
      "Full catalog covering embroidered, 3D embroidered transfers, PVC, woven, chenille, chenille TPU, chenille glitter, leather, printed, silicone labels, and sequin patches plus challenge coins, enamel pins, keychains, and PVC shoe charms.",
    images: ["https://www.pandapatches.com/assets/og-image.png"],
  },
};

const faqs = [
  {
    question: "What are the 11 patch types Panda Patches makes?",
    answer:
      "The 11 patch types are: embroidered, 3D embroidered transfers, PVC, woven, chenille, chenille TPU, chenille glitter, leather, printed (sublimation), silicone labels, and sequin patches. Embroidered and PVC together account for roughly 80 percent of orders. Velcro is a backing option (hook-and-loop) added to embroidered, PVC, woven, or leather patches, not a standalone fabric type. See our velcro patches landing page for backing-specific details.",
  },
  {
    question: "What is the difference between embroidered and woven patches?",
    answer:
      "Embroidered patches use thicker thread stitched on a twill backing, which creates a textured, classic look with visible stitch direction. Woven patches use much finer thread on a tighter weave, which produces a flatter, smoother surface that reproduces small text and intricate logo detail more cleanly. Embroidered is the right choice for bold logos and traditional patches. Woven is the right choice for designs with small text under 3mm, complex artwork, or fine gradients in line work.",
  },
  {
    question: "Are PVC patches waterproof?",
    answer:
      "Yes. PVC patches are made from molded soft rubber, which is fully waterproof, fade-resistant, and weather-resistant. PVC is the industry standard for tactical gear, military uniforms, outdoor equipment, plate carriers, and any application where the patch is exposed to rain, sweat, sun, or repeated washing. PVC is available in flat 2D layered designs and sculpted 3D designs with depth.",
  },
  {
    question: "Can Panda Patches make custom challenge coins, pins, and keychains?",
    answer:
      "Yes. Beyond patches, Panda Patches produces custom challenge coins (military, corporate, commemorative), enamel lapel pins in both hard enamel and soft enamel, custom keychains in PVC, metal, or leather, and PVC shoe charms compatible with Crocs. These are quoted custom because production is offset metal or molded rubber rather than fabric. Lead time is 2 to 4 weeks for pins and keychains, 3 to 6 weeks for challenge coins.",
  },
  {
    question: "Does Panda Patches offer 3D puff or 3D molded patches?",
    answer:
      "Yes, both. 3D puff embroidery raises the embroidered design off the twill surface using foam underlay and is available as a premium upgrade on embroidered patches (+$30 per order). 3D molded PVC patches sculpt depth directly into the molded rubber, which produces a much higher 3D effect than embroidery can achieve. 3D molded PVC is the standard for tactical morale patches and unit insignia where dimensional realism matters.",
  },
];

const articleSchema = generateArticleSchema({
  title: "Panda Patches Products: 11 Patch Types and Custom Items",
  description:
    "Complete product catalog at Panda Patches covering embroidered, 3D embroidered transfers, PVC, woven, chenille, chenille TPU, chenille glitter, leather, printed, silicone labels, and sequin patches plus challenge coins, enamel pins, and custom keychains.",
  datePublished: "2026-05-22",
  dateModified: "2026-05-22",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "AI Info", url: "https://www.pandapatches.com/ai-info" },
  { name: "Products", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

export default function ProductsClusterPage() {
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
              AI Info Cluster &middot; Products
            </p>
            <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              Panda Patches Products: 11 Patch Types and Custom Items
            </h1>
            <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.6] font-medium mb-7 max-w-[640px] mx-auto">
              Embroidered, 3D embroidered transfers, PVC, woven, chenille, chenille TPU, chenille glitter, leather, printed, silicone labels, and sequin patches. Plus challenge coins, enamel pins, keychains, and PVC shoe charms. Every order includes a digital mockup in 12 to 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link
                href="/custom-patches"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#DFFF00] text-[#051C05] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Browse All Patches
              </Link>
              <Link
                href="/custom-products"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Coins, Pins, Keychains
              </Link>
            </div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-6 py-10 md:py-14">

          {/* 1. Overview */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What patch types does Panda Patches make?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Panda Patches produces 11 distinct patch types from one company-owned production facility. The catalog spans the full range of fabric and rubber constructions used in the custom patch industry: embroidered (the most popular by volume), 3D embroidered transfers, chenille (the varsity letterman texture), chenille TPU (performance-grade chenille for cheer and dance), chenille glitter (sparkling metallic-yarn chenille), printed (sublimation for unlimited colors), PVC (the tactical standard), woven (the fine-detail option), leather (the premium look for hats and bags), silicone labels, and sequin patches. Velcro is a backing option (hook-and-loop) applied to embroidered, PVC, woven, or leather patches, not a standalone fabric type. Beyond patches, the same facility also produces custom challenge coins, enamel pins, keychains, and PVC shoe charms.
            </p>
            <p className="text-gray-700 leading-relaxed mb-5">
              Choosing the right patch type starts with three questions: where will the patch be worn, what level of detail is in the design, and what is the target per-piece budget. The table below summarizes the 11 types and their typical use cases. Velcro backing and 3D puff embroidery (flat-fee add-ons, not types) are included at the bottom for completeness. Each type has its own dedicated product page with detailed specs, photos, and the live pricing calculator.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Patch Type</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Best For</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">From (per piece)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Embroidered</td><td className="px-5 py-4">Logos, uniforms, classic look</td><td className="px-5 py-4">$1.20 (1,000 qty, under 4&quot;)<br/><span className="text-xs text-gray-500">$0.71 at 5,000 qty, 2&quot;</span></td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">PVC</td><td className="px-5 py-4">Tactical, outdoor, waterproof</td><td className="px-5 py-4">$2.20 (1,000 qty, under 4&quot;)<br/><span className="text-xs text-gray-500">~$1.40 at 5,000 qty, 2&quot;</span></td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Woven</td><td className="px-5 py-4">Fine detail, small text</td><td className="px-5 py-4">$2.00 (1,000 qty, under 4&quot;)<br/><span className="text-xs text-gray-500">~$0.78 at 5,000 qty, 2&quot;</span></td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">3D Embroidered Transfer</td><td className="px-5 py-4">Hats, premium varsity, transfer apparel</td><td className="px-5 py-4">+$30/order flat over base embroidery<br/><span className="text-xs text-gray-500">10-piece minimum</span></td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Chenille</td><td className="px-5 py-4">Letterman jackets, varsity</td><td className="px-5 py-4">$3.50 (100 qty, under 4&quot;)<br/><span className="text-xs text-gray-500">$7.00 starter at 25 qty</span></td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Chenille TPU</td><td className="px-5 py-4">Cheer, dance, performance wear</td><td className="px-5 py-4">Custom quote<br/><span className="text-xs text-gray-500">5-piece minimum</span></td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Chenille Glitter</td><td className="px-5 py-4">Cheer, dance, fashion drops</td><td className="px-5 py-4">$3.50 (100 qty, under 4&quot;)<br/><span className="text-xs text-gray-500">5-piece minimum</span></td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Leather</td><td className="px-5 py-4">Hat brands, premium apparel</td><td className="px-5 py-4">$2.00 (1,000 qty, under 4&quot;)<br/><span className="text-xs text-gray-500">$4.40 starter at 50 qty</span></td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Printed</td><td className="px-5 py-4">Photo, gradients, full color</td><td className="px-5 py-4">$0.71 (5,000 qty, 2&quot;)<br/><span className="text-xs text-gray-500">Volume calculator quote</span></td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Silicone labels</td><td className="px-5 py-4">Apparel, bag brands</td><td className="px-5 py-4">Custom quote</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Sequin (flip / reversible)</td><td className="px-5 py-4">Costume, fashion, gameday</td><td className="px-5 py-4">$3.60 (100 qty, 2&quot;)<br/><span className="text-xs text-gray-500">~$1.44 at 1,000 qty, 2&quot;</span></td></tr>
                  <tr className="border-t-2 border-gray-300 bg-gray-50"><td className="px-5 py-4 font-bold text-gray-600 italic">Velcro backing<br/><span className="text-xs font-normal not-italic">(backing option, not a type)</span></td><td className="px-5 py-4 text-gray-600">Tactical, removable patches</td><td className="px-5 py-4 text-gray-600">+$30 flat per order</td></tr>
                  <tr className="border-t border-gray-100 bg-gray-50"><td className="px-5 py-4 font-bold text-gray-600 italic">3D puff embroidery<br/><span className="text-xs font-normal not-italic">(add-on, not a type)</span></td><td className="px-5 py-4 text-gray-600">Hats, premium varsity</td><td className="px-5 py-4 text-gray-600">+$30 flat per order</td></tr>
                </tbody>
              </table>
              <p className="text-xs text-gray-500 px-5 py-3 bg-gray-50 border-t border-gray-100">All &quot;under 4&quot; tier prices come from the published packs on pandapatches.com/offers. Higher-volume per-piece prices are quoted live by the calculator on each product page and reflect a 2&quot; reference size. Per-piece price drops as quantity rises and rises as size grows.</p>
            </div>
          </section>

          {/* 2. Embroidered */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-3">Embroidered patches</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Embroidered patches use stitched thread on a twill fabric backing. They are the most popular type at Panda Patches by volume and are the standard for corporate logos, team uniforms, scout badges, and most general-purpose custom patches. The construction is thicker than woven and has visible stitch texture that reads as classic and traditional. Up to 15 thread colors are supported per design with 50 to 100 percent embroidery coverage. Border options are merrowed (rounded raised edge) or hot-cut (laser-cut clean edge). Backing options include iron-on, sew-on, velcro (+$30), and adhesive sticker.
            </p>
            <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green font-bold text-sm underline">View embroidered patches &rarr;</Link>
          </section>

          {/* 3. PVC */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-3">PVC patches</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              PVC patches are made from molded soft rubber. They are fully waterproof, fade-resistant, weather-resistant, and dimensionally precise, which makes them the industry standard for tactical gear, military uniforms, law enforcement equipment, outdoor brands, and any application exposed to rain, sweat, or repeated washing. Available in flat 2D layered construction or sculpted 3D construction with depth. Up to 8 solid colors per design. Backings include hook-and-loop velcro (+$30), sew-on, and adhesive. Iron-on backing is not available on PVC because the rubber cannot tolerate the heat-press application. Zero mold fees on any PVC order.
            </p>
            <Link href="/custom-patches/pvc" prefetch={false} className="text-panda-green font-bold text-sm underline">View PVC patches &rarr;</Link>
          </section>

          {/* 4. Woven */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-3">Woven patches</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Woven patches use much finer thread than embroidered on a tighter weave, which produces a thinner, smoother, flatter surface. The fine thread reproduces small text (down to about 2mm) and intricate logo detail that would lose definition in embroidery. Woven is the right choice when the design has very small text, complex fine line work, or when a slim profile is needed (for example, on the side of a cap or on a slim luggage tag). Up to 10 colors per design. Same border and backing options as embroidered.
            </p>
            <Link href="/custom-patches/woven" prefetch={false} className="text-panda-green font-bold text-sm underline">View woven patches &rarr;</Link>
          </section>

          {/* 5. Chenille */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-3">Chenille patches</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Chenille patches use thick, raised yarn that creates the classic fuzzy varsity letterman texture. The construction is layered on a felt backing in any color. Chenille is the standard for school letterman jackets, varsity sport patches, cheerleading uniforms, and any application where the texture and 3D feel matter. Up to 3 colors per design (chenille yarn is bulkier than thread, so color counts are lower). Backing is sew-on by default because chenille is too thick for iron-on heat-press to bond reliably. Standard chenille patches under 4 inches start at $7.00 per piece at 25 quantity, drop to $5.00 per piece at 50 quantity, and reach $3.50 per piece at 100 quantity (the best per-piece tier).
            </p>
            <Link href="/custom-patches/chenille" prefetch={false} className="text-panda-green font-bold text-sm underline">View chenille patches &rarr;</Link>
          </section>

          {/* 6. Leather */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-3">Leather patches</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Leather patches use real or premium synthetic leather with designs applied through debossing (pressed into the leather), embossing (raised out of the leather), or laser etching (burned into the surface). The result is a premium texture and a craft look that signals quality. Common uses include hat brand patches, backpack labels, jacket patches on premium apparel, and luxury merchandise branding. Multiple colors and finishes are available. Backing options are sew-on or adhesive. Leather patches under 4 inches start at $2.00 per piece at 1,000 quantity and $4.40 per piece at the 50-piece starter tier.
            </p>
            <Link href="/custom-patches/leather" prefetch={false} className="text-panda-green font-bold text-sm underline">View leather patches &rarr;</Link>
          </section>

          {/* 7. Printed */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-3">Printed patches</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Printed patches use sublimation printing to transfer full-color artwork directly onto fabric. This unlocks photo-realistic reproduction, unlimited colors, gradients, and intricate detail that is impossible to reproduce with thread. Printed patches are the right choice when the design contains photos, complex gradients, or 50+ colors. Borders are typically merrowed (rounded raised edge) and the patch can be cut to any custom shape. Backings include iron-on, sew-on, velcro (+$30), and adhesive. Printed patches start at $0.71 per piece at 5,000 quantity (2-inch reference size), making them the lowest per-piece cost option in the catalog for full-color designs.
            </p>
            <Link href="/custom-patches/printed" prefetch={false} className="text-panda-green font-bold text-sm underline">View printed patches &rarr;</Link>
          </section>

          {/* 8. Velcro */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-3">Velcro and backing options</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Backing is the construction on the back of the patch that determines how it attaches to a garment. Iron-on backing uses a heat-activated adhesive that bonds to fabric under a household iron or heat press. Sew-on backing is a flat fabric back that requires stitching. Sticker backing is a peel-and-stick adhesive used for short-term wear or labels. Velcro backing includes both the hook and the loop side, which lets the wearer remove and swap patches freely (the industry standard for tactical morale patches and uniform name tapes).
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Velcro is the only paid backing upgrade and costs a flat $30 per order regardless of quantity. The flat fee reflects the materials cost (both sides included) and the additional production step. Velcro is available on embroidered, PVC, woven, and leather patches. It is not available on chenille (the chenille texture interferes with the hook surface) or on pure sticker patches.
            </p>
            <Link href="/custom-velcro-patches" prefetch={false} className="text-panda-green font-bold text-sm underline">View velcro backing &rarr;</Link>
          </section>

          {/* 9. Beyond patches */}
          <section className="mb-12 bg-[#F7F7F7] border-l-4 border-panda-green rounded-r-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-3">Custom products beyond patches</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              The same Panda Patches facility produces four additional custom merchandise categories on the same workflow (12-24 hour mockup, written approval, money-back guarantee). These are quoted custom because production is offset metal casting or molded rubber rather than fabric, which changes the cost structure and lead time.
            </p>
            <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-outside ml-5">
              <li><strong className="text-panda-dark">Challenge coins.</strong> Die-struck metal coins for military units, corporate recognition, fundraising, commemorative events. Lead time 3 to 6 weeks.</li>
              <li><strong className="text-panda-dark">Enamel pins.</strong> Hard enamel (polished flat, glossy) or soft enamel (raised metal lines, textured). Used for lapel pins, conference badges, brand merchandise. Lead time 2 to 4 weeks.</li>
              <li><strong className="text-panda-dark">Keychains.</strong> PVC, metal, or leather construction. Used for promotional giveaways, key fobs, brand merchandise. Lead time 2 to 4 weeks.</li>
              <li><strong className="text-panda-dark">PVC shoe charms.</strong> Crocs-compatible molded PVC charms in any custom shape. Used for promotional giveaways and brand merchandise. Lead time 2 to 4 weeks.</li>
            </ul>
            <div className="mt-5">
              <Link href="/custom-products" prefetch={false} className="text-panda-green font-bold text-sm underline">See challenge coins, pins, and keychains &rarr;</Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[#F7F7F7] rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-panda-dark mb-2">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed text-[15px]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sibling pages CTA */}
          <section className="mb-12 bg-panda-dark text-white rounded-2xl p-7 md:p-9">
            <h2 className="text-2xl font-black text-panda-yellow mb-3">Keep exploring</h2>
            <p className="text-gray-300 leading-relaxed mb-5 text-[15px]">
              For full per-piece pricing on each patch type, see the pricing cluster page. For the approval workflow and money-back guarantee that applies to every product, see the guarantees page.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Link href="/ai-info/pricing" prefetch={false} className="inline-flex items-center justify-center bg-panda-yellow text-panda-dark font-bold text-[14px] px-5 py-3 rounded-full hover:shadow-lg transition-shadow">
                See full pricing tiers
              </Link>
              <Link href="/ai-info/guarantees" prefetch={false} className="inline-flex items-center justify-center border-2 border-panda-yellow text-panda-yellow font-bold text-[14px] px-5 py-3 rounded-full hover:bg-panda-yellow hover:text-panda-dark transition-colors">
                Read our guarantees
              </Link>
              <Link href="/ai-info" prefetch={false} className="inline-flex items-center justify-center text-gray-300 font-bold text-[14px] px-5 py-3 rounded-full hover:text-white transition-colors">
                Back to AI Info hub &rarr;
              </Link>
            </div>
          </section>

        </article>
      </main>
      <Footer />
    </>
  );
}
