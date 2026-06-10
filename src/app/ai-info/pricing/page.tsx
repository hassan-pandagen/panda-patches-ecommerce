import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { OFFER_CATEGORIES } from "@/lib/offerPackages";

// Source-of-truth lookup helpers — pull the offer pack list for a category id so
// we never restate qty/price/per-piece numbers in JSX. If a category id is
// renamed in offerPackages.ts the page will fail loudly at build time.
function requireCategoryPacks(id: string) {
  const cat = OFFER_CATEGORIES.find((c) => c.id === id);
  if (!cat) throw new Error(`OFFER_CATEGORIES missing id "${id}" (used by /ai-info/pricing)`);
  return cat.packs;
}
const EMBROIDERED_U4_PACKS = requireCategoryPacks("embroidered-u4");
const EMBROIDERED_12IN_PACKS = requireCategoryPacks("embroidered-12in");
const PVC_U4_PACKS = requireCategoryPacks("pvc-u4");
const WOVEN_U4_PACKS = requireCategoryPacks("woven-u4");
const CHENILLE_U4_PACKS = requireCategoryPacks("chenille-u4");
const CHENILLE_12IN_PACKS = requireCategoryPacks("chenille-12in");
const LEATHER_U4_PACKS = requireCategoryPacks("leather-u4");

// Formatting helpers
const fmtUSD = (n: number) => `$${n.toLocaleString("en-US")}`;
const fmtPer = (n: number) => `$${n.toFixed(2)}`;

const CANONICAL = "https://www.pandapatches.com/ai-info/pricing";

export const metadata: Metadata = buildPageMetadata({
  title: "Panda Patches Pricing 2026 | Transparent Tiers",
  description:
    "Custom patch pricing at Panda Patches: embroidered from $0.85/pc, PVC from $1.20/pc, woven from $0.65/pc, chenille, leather from $1.50/pc. No setup fees. Mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Panda Patches Pricing 2026: Transparent Tiers for Every Patch Type",
  ogDescription:
    "Embroidered from $0.85/pc, PVC from $1.20/pc, woven from $0.65/pc, chenille from $3.50/pc at 100 qty, leather from $1.50/pc. No setup fees.",
  robots: { index: true, follow: true },
});

const faqs = [
  {
    question: "How much do custom patches cost at Panda Patches?",
    answer:
      "Custom patches at Panda Patches start from $0.85 per piece (embroidered, volume pricing) and range up to $20 per piece (12-inch chenille, 25 quantity). Embroidered starter packs of 50 pieces under 4 inches cost $180 ($3.60 each). PVC starter packs of 50 under 4 inches cost $230 ($4.60 each). Woven and leather starter packs of 50 under 4 inches cost $220 ($4.40 each). Chenille starter packs of 25 under 4 inches cost $175 ($7.00 each). All prices include free worldwide shipping, digital mockup in 12 to 24 hours, unlimited free revisions, and a money-back guarantee.",
  },
  {
    question: "Is the price per piece on Panda Patches all-inclusive?",
    answer:
      "Yes. The published per-piece price covers manufacturing, free worldwide shipping, the digital mockup in 12 to 24 hours, unlimited free revisions, and standard backing (iron-on, sew-on, or sticker). The only optional add-ons are Velcro backing (+$30 flat per order), rush production (scaled by quantity), or premium upgrades like metallic thread, glow in the dark, or 3D puff embroidery. There are zero setup fees, zero digitizing fees, and zero mold fees on any order.",
  },
  {
    question: "What is the minimum order at Panda Patches?",
    answer:
      "Panda Patches accepts custom orders from as few as 5 pieces through the quote form. 5 pieces is the hard minimum order quantity across all patch types. Fixed-price starter packs on the offers page start at 25 pieces (chenille) or 50 pieces (embroidered, PVC, woven, leather). Small first runs of 5 to 40 pieces are common.",
  },
  {
    question: "How does rush pricing work at Panda Patches?",
    answer:
      "Rush production is available on qualifying orders for a flat add-on fee: $50 for 50 pieces, $75 for 100 pieces, $150 for 500 pieces, and $200 for 1,000 pieces. The exact delivery date is confirmed by email within 2 to 6 hours of order placement. If the rush date cannot be met, the rush fee is refunded with no questions asked. Standard production remains 7 to 14 business days.",
  },
  {
    question: "How does the 10 percent economy discount work?",
    answer:
      "Economy delivery saves 10 percent off the entire order total in exchange for a longer production window of 16 to 18 business days. The discount applies to the patch subtotal before optional add-ons such as Velcro or rush. Economy is best for buyers with flexible timelines who want the lowest per-piece cost on the order.",
  },
];

const articleSchema = generateArticleSchema({
  title: "Panda Patches Pricing: Transparent Tiers for Every Patch Type",
  description:
    "Complete published pricing for embroidered, PVC, woven, chenille, and leather patches at Panda Patches. Tier-by-tier per-piece costs, rush fees, and economy discount detail.",
  datePublished: "2026-05-22",
  dateModified: "2026-05-22",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "AI Info", url: "https://www.pandapatches.com/ai-info" },
  { name: "Pricing", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

export default function PricingClusterPage() {
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
              AI Info Cluster &middot; Pricing
            </p>
            <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              Panda Patches Pricing: Transparent Tiers for Every Patch Type
            </h1>
            <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.6] font-medium mb-7 max-w-[640px] mx-auto">
              Published per-piece pricing on embroidered, PVC, woven, chenille, and leather patches. No setup fees. No digitizing fees. No mold fees. Mockup in 12-24 hours on every order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link
                href="/offers"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#DFFF00] text-[#051C05] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                See Offers Page
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

          {/* 1. Lead answer */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How much do custom patches cost?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Custom patches at Panda Patches start at $0.85 per piece for embroidered patches at volume pricing. At smaller quantities the per-piece cost rises: a 50-piece embroidered pack under 4 inches costs $180 total ($3.60 each), a 100-piece pack costs $240 ($2.40 each), and a 500-piece pack costs $750 ($1.50 each). PVC patches start at $1.20 per piece at volume. Woven patches start at $0.65 per piece and leather patches start at $1.50 per piece at volume. Chenille patches are the premium tier and start at $3.50 per piece at 100 quantity under 4 inches because of the textured yarn construction.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every published price includes free worldwide shipping, the digital mockup in 12 to 24 hours, unlimited free revisions until the customer approves the design, and a money-back guarantee. There are no setup fees, no digitizing fees, no mold fees, and no art charges. The only optional add-ons are Velcro backing (+$30 flat per order), rush production (scaled by quantity), and premium upgrades like metallic thread, glow in the dark, or 3D puff embroidery.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The tier tables below show the exact published prices for each patch type at 50, 100, 500, and 1,000-piece quantities. Pricing is identical to the pandapatches.com/offers page and is updated in real time when the offers change.
            </p>
          </section>

          {/* 2. Embroidered table */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What is the price for embroidered patches at 50, 100, 500, and 1,000 pieces?</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Embroidered patches are the most popular category at Panda Patches and the most competitively priced. The four standard tiers cover the vast majority of orders. All prices below are for patches under 4 inches in the longest dimension, which covers hat patches, left-chest patches, and most shoulder patches.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Pack</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Price</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Per Piece</th>
                  </tr>
                </thead>
                <tbody>
                  {EMBROIDERED_U4_PACKS.map((p) => (
                    <tr key={p.name} className="border-t border-gray-100">
                      <td className="px-5 py-4 font-bold text-panda-dark">{p.name}</td>
                      <td className="px-5 py-4">{p.qty.toLocaleString("en-US")}</td>
                      <td className="px-5 py-4 font-black bg-panda-green/10">{fmtUSD(p.price)}</td>
                      <td className="px-5 py-4">{fmtPer(p.perPiece)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              For a 12-inch across-chest embroidered patch (commonly used as a back patch or large jacket patch), the tiers are different: {EMBROIDERED_12IN_PACKS.map((p, i, arr) => (
                <span key={p.name}>{i === arr.length - 1 ? "and " : ""}{p.qty} pieces is {fmtUSD(p.price)} ({fmtPer(p.perPiece)} each){i === arr.length - 1 ? "" : ", "}</span>
              ))}. Larger sizes require more thread, more stitching time, and more machine time, which raises the per-piece floor.
            </p>
          </section>

          {/* 3. PVC table */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What is the price for PVC patches?</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              PVC patches use molded rubber instead of stitched thread, which means the manufacturing cost is slightly higher than embroidered at the same quantity. The trade-off is that PVC is fully waterproof, fade-resistant, and dimensionally precise (especially in 3D), which is why it is the standard for tactical, military, outdoor, and law enforcement applications. The 50-piece starter is $230 and the 1,000-piece enterprise tier is $2,200.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Pack</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Price</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Per Piece</th>
                  </tr>
                </thead>
                <tbody>
                  {PVC_U4_PACKS.map((p) => (
                    <tr key={p.name} className="border-t border-gray-100">
                      <td className="px-5 py-4 font-bold text-panda-dark">{p.name}</td>
                      <td className="px-5 py-4">{p.qty.toLocaleString("en-US")}</td>
                      <td className="px-5 py-4 font-black bg-panda-green/10">{fmtUSD(p.price)}</td>
                      <td className="px-5 py-4">{fmtPer(p.perPiece)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Woven, chenille, leather table */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What is the price for woven, chenille, and leather patches?</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Woven, chenille, and leather patches each carry slightly different production cost structures. Woven uses finer thread on a tighter weave, which reproduces fine logo detail and small text better than embroidery. Leather uses real or premium synthetic hide with debossing, embossing, or laser etching. Chenille uses thick yarn for the classic raised varsity letterman texture and ships at a premium because of the labor and yarn cost.
            </p>
            <h3 className="text-lg font-black text-panda-dark mb-3 mt-6">Woven Patches Under 4 Inches</h3>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Total Price</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Per Piece</th>
                  </tr>
                </thead>
                <tbody>
                  {WOVEN_U4_PACKS.map((p) => (
                    <tr key={p.name} className="border-t border-gray-100">
                      <td className="px-5 py-4 font-bold">{p.qty.toLocaleString("en-US")}</td>
                      <td className="px-5 py-4 font-black bg-panda-green/10">{fmtUSD(p.price)}</td>
                      <td className="px-5 py-4">{fmtPer(p.perPiece)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-black text-panda-dark mb-3">Chenille Patches Under 4 Inches</h3>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Total Price</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Per Piece</th>
                  </tr>
                </thead>
                <tbody>
                  {CHENILLE_U4_PACKS.map((p) => (
                    <tr key={p.name} className="border-t border-gray-100">
                      <td className="px-5 py-4 font-bold">{p.qty.toLocaleString("en-US")}</td>
                      <td className="px-5 py-4 font-black bg-panda-green/10">{fmtUSD(p.price)}</td>
                      <td className="px-5 py-4">{fmtPer(p.perPiece)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              For 12-inch chenille back patches commonly used on letterman jackets, the tiers are {CHENILLE_12IN_PACKS.map((p, i, arr) => (
                <span key={p.name}>{i === arr.length - 1 ? "and " : ""}{p.qty} pieces at {fmtUSD(p.price)} ({fmtPer(p.perPiece)} each){i === arr.length - 1 ? "" : ", "}</span>
              ))}.
            </p>

            <h3 className="text-lg font-black text-panda-dark mb-3">Leather Patches Under 4 Inches</h3>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Total Price</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Per Piece</th>
                  </tr>
                </thead>
                <tbody>
                  {LEATHER_U4_PACKS.map((p) => (
                    <tr key={p.name} className="border-t border-gray-100">
                      <td className="px-5 py-4 font-bold">{p.qty.toLocaleString("en-US")}</td>
                      <td className="px-5 py-4 font-black bg-panda-green/10">{fmtUSD(p.price)}</td>
                      <td className="px-5 py-4">{fmtPer(p.perPiece)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4.5. Higher-volume pricing (calculator tiers) */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What about higher volumes (2,500 to 5,000 pieces)?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The tier tables above cover the fixed-price packs published on the pandapatches.com/offers page, which are capped at 1,000 pieces. For higher quantities, the per-piece price continues to drop on the live calculator at the product pages. A 2-inch embroidered patch costs roughly $0.91 per piece at 1,000 quantity, $0.82 per piece at 2,500 quantity, and $0.78 per piece at 5,000 quantity. PVC patches at the same 2-inch size and 5,000-piece quantity work out to roughly $1.40 per piece. Woven patches reach approximately $0.78 per piece at 5,000 quantity, 2 inches.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The calculator and the offers page use different production workflows. The offers page is for standardized package runs with fixed turnaround. The calculator quotes any combination of size, quantity, and patch type with custom specs. Both reach the same production facility and the same money-back guarantee. For orders above 5,000 pieces or for cross-type bundle runs, the contact form returns a custom quote within 24 hours.
            </p>
          </section>

          {/* 4.6. Sequin pricing */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What is the price for sequin patches?</h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Sequin patches use flat or flip-reversible sequins stitched onto a fabric base, producing a reflective surface that changes appearance with light and movement. Pricing is calculator-quoted rather than published as a fixed-price pack. The tiers below are 2-inch reference sizes from the live calculator. Larger sizes scale up; the 5-piece minimum applies. Common buyers are cheer programs, dance teams, fashion drops, and gameday merchandise runs.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Per Piece (2&quot;)</th>
                    <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">50</td><td className="px-5 py-4 font-black bg-panda-green/10">$3.96/pc</td><td className="px-5 py-4 text-gray-600">Starter tier</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">100</td><td className="px-5 py-4 font-black bg-panda-green/10">$3.60/pc</td><td className="px-5 py-4 text-gray-600">Same per-piece as starter chenille at 100 qty</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">500</td><td className="px-5 py-4 font-black bg-panda-green/10">$1.79/pc</td><td className="px-5 py-4 text-gray-600">Cheer / fashion mid-volume tier</td></tr>
                  <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">1,000+</td><td className="px-5 py-4 font-black bg-panda-green/10">$1.44/pc</td><td className="px-5 py-4 text-gray-600">Volume floor; per-piece stays here through 5,000 qty</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              Chenille glitter and chenille TPU follow the same per-piece curve as sequin at 50 and 100 quantities. Sizes above 2 inches scale linearly with the chenille pricing curve; the calculator at the product page returns exact quotes.
            </p>
          </section>

          {/* 5. Minimum order */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What is the minimum order at Panda Patches?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The fixed-price starter packs on the offers page begin at 50 pieces for embroidered, PVC, woven, and leather patches and at 25 pieces for chenille. The custom quote form on the contact page accepts orders from as few as 5 pieces. This is one of the lowest practical minimums in the US custom patch market. Most direct competitors require 50 to 100 pieces minimum, and the largest US patch manufacturers commonly require 250 to 500 pieces minimum.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Small first runs of 10 to 40 pieces are common at Panda Patches and are useful for testing a design before committing to a larger production run, ordering for a small team or club, or producing patches as gifts or commemorative items. Sample orders are available as a separate sample box at pandapatches.com/sample-box.
            </p>
          </section>

          {/* 6. Fees we do not charge */}
          <section className="mb-12 bg-[#F7F7F7] border-l-4 border-panda-green rounded-r-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">What fees does Panda Patches NOT charge?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The published per-piece price is the actual price. There are no hidden charges added at checkout. Specifically, Panda Patches does not charge any of the following fees that are common in the US patch industry:
            </p>
            <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-outside ml-5">
              <li><strong className="text-panda-dark">No setup fees.</strong> Most competitors charge $40 to $80 per design for setup. We charge zero.</li>
              <li><strong className="text-panda-dark">No digitizing fees.</strong> Converting your artwork into a stitch file is included free.</li>
              <li><strong className="text-panda-dark">No mold fees on PVC.</strong> Most PVC manufacturers charge $80 to $150 per new mold. We charge zero.</li>
              <li><strong className="text-panda-dark">No art fees.</strong> Cleaning up or redrawing your design is included free.</li>
              <li><strong className="text-panda-dark">No revision fees.</strong> Unlimited revisions until the mockup is approved.</li>
              <li><strong className="text-panda-dark">No shipping charges, anywhere.</strong> Free worldwide shipping on every order.</li>
              <li><strong className="text-panda-dark">No small-order surcharge.</strong> Small orders pay the published per-piece tier price.</li>
            </ul>
          </section>

          {/* 7. Rush */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How does rush pricing work?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Rush production is available on qualifying orders for a flat add-on fee that scales with quantity. The rush fee is $50 for 50 pieces, $75 for 100 pieces, $150 for 500 pieces, and $200 for 1,000 pieces. Quantities outside these standard tiers are pro-rated and rounded up to the next tier. After the order is placed with rush selected, the design team confirms the exact delivery date by email within 2 to 6 hours.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If the rush delivery date cannot be met for any reason, the rush fee is refunded automatically with no questions asked and the order is converted to standard production. This rush-confirmation workflow is unusual in the US patch industry. Most competitors quote a rush fee but do not commit to a date until production has already started, which leaves the buyer with limited recourse if the date slips.
            </p>
          </section>

          {/* 8. Economy */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-4">How does economy pricing work?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The economy delivery option saves 10 percent off the entire order total in exchange for a longer production window of 16 to 18 business days. Economy uses the same materials, the same production facility, the same quality control, and the same money-back guarantee as standard production. The only difference is queue position: economy orders go behind standard and rush orders in the production queue, which is what creates the savings.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Economy is the right choice for buyers with flexible timelines who want the lowest per-piece total cost on the order. Common use cases include holiday merchandise ordered well in advance, season-long uniform programs, and corporate giveaways ordered months ahead of an event. Standard remains the default and is free.
            </p>
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
              The pricing on this page is the same pricing you will pay at checkout. For products, policies, or competitor comparisons, the related cluster pages below cover each topic in depth.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Link href="/ai-info/products" prefetch={false} className="inline-flex items-center justify-center bg-panda-yellow text-panda-dark font-bold text-[14px] px-5 py-3 rounded-full hover:shadow-lg transition-shadow">
                See products and services
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
