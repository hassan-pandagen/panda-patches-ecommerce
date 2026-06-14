import type { Metadata } from "next";
import { cache } from "react";
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
import { client } from "@/lib/sanity";
import { buildPageMetadata } from "@/lib/seo";

const CANONICAL = "https://www.pandapatches.com/custom-iron-on-patches";

const ironOnFAQs = [
  {
    question: "Do iron-on patches stay on?",
    answer:
      "Yes. A properly applied iron-on patch survives normal machine washing (cold or warm, garment inside out) for approximately 50 wash cycles before the adhesive begins to weaken. For garments washed more than 30 times per season such as game jerseys, work uniforms, or industrial wash items, sew-on backing is the more reliable long-term choice. Reinforcing an iron-on patch with a few stitches around the edge extends bond life significantly.",
  },
  {
    question: "Which patch types support iron-on backing?",
    answer:
      "Iron-on backing is available on embroidered, woven, printed (sublimation), and leather patches. It is not available on PVC (the molded rubber cannot tolerate the heat-press temperature) or on chenille (the textured yarn surface prevents reliable adhesive bond). For PVC and chenille, the default backing is sew-on, and Velcro (hook-and-loop, +$30 flat per order) is available as an alternative.",
  },
  {
    question: "Can I also sew my iron-on patch onto the garment?",
    answer:
      "Yes. Iron-on patches can be sewn directly through the adhesive backing. Many buyers iron the patch on first to hold it in position, then sew around the edge for permanent attachment. This hybrid application is the standard approach for garments that will be washed frequently or used in high-wear conditions.",
  },
  {
    question: "What is the minimum order for custom iron-on patches?",
    answer:
      "5 pieces. The 5-piece minimum applies across embroidered, printed, and leather iron-on patches. Woven iron-on patches have a 10-piece minimum because of the schiffli loom setup. There are no setup fees, no digitizing fees, and no small-order surcharges. The 5-piece tier uses the same materials, the same Pantone color matching, and the same money-back guarantee as a 1,000-piece order.",
  },
  {
    question: "How do I apply an iron-on patch?",
    answer:
      "Step 1: preheat a household iron to the cotton or linen setting (medium-high heat, no steam). Step 2: place the patch adhesive-side down on the garment in the desired position. Step 3: cover with a thin cotton cloth or pressing sheet. Step 4: press straight down with firm pressure for 30 to 45 seconds. Do not slide the iron. Step 5: flip the garment inside out and repeat the press from the back side for another 20 seconds. Step 6: let the patch cool completely before handling. The bond strengthens after the first wash.",
  },
  {
    question: "What garments work best for iron-on patches?",
    answer:
      "Iron-on patches work well on hats, casual jackets, denim, canvas backpacks, cotton t-shirts, polos, hoodies, scout uniforms, sashes, and tote bags. They work less reliably on heat-sensitive fabrics (nylon, polyester athletic wear, vinyl), waterproof or coated fabrics, ribbed knits, and structural turnout coats or active firefighting gear. For heat-sensitive or specialty fabrics, sew-on or Velcro backing is the safer choice.",
  },
  {
    question: "How much do custom iron-on patches cost?",
    answer:
      "Iron-on is standard backing on all eligible patch types, so iron-on patches are priced the same as the base patch with no backing upcharge. Embroidered iron-on starts at $0.91 per piece at 2x2 inches and 1,000 pieces; smaller orders cost more per piece (about $2.55 each at 100 pieces and $3.92 each at 50, for a 3-inch patch). Woven iron-on starts at $1.54 per piece and printed iron-on at $0.74 per piece, both at 2x2 inches and 1,000 pieces. The published per-piece price includes free worldwide shipping, the digital mockup in 12 to 24 hours, and unlimited free revisions.",
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch shared hero trust badges + reuse the embroidered category gallery if available
const getIronOnPageData = cache(async () => {
  try {
    const query = `{
      "categoryData": *[_type == "categoryPage" && slug.current == "custom-fire-department-patches"][0] {
        "workSamples": workSamples[]{
          "image": @,
          "alt": alt
        }
      },
      "hero": *[_type == "hero"][0] {
        "trustBadges": trustBadges[] {
          "url": image.asset->url,
          "alt": alt
        }
      }
    }`;
    const data = await client.fetch(query);
    return {
      workSamples: data?.categoryData?.workSamples || [],
      trustBadges: data?.hero?.trustBadges || [],
    };
  } catch (error) {
    console.error("Iron-on page data fetch error:", error);
    return { workSamples: [], trustBadges: [] };
  }
});

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Iron-On Patches | Low 5-Piece Min, Mockup in 12-24h",
  description:
    "Custom iron-on patches with heat-activated adhesive backing. Embroidered, woven, printed, and leather supported. 5-piece minimum, free worldwide shipping, mockup in 12-24 hours, money-back guarantee.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Iron-On Patches: Heat-Seal Backing, 5-Piece Min, Free Worldwide Shipping",
  ogDescription:
    "Iron-on patches in embroidered, woven, printed, and leather. Application steps, wash-care, backing compatibility, and pricing on the standard quantity and size basis. From $0.91/pc at 2x2 inches and 1,000 pieces; smaller orders cost more per piece.",
  twitterDescription:
    "Iron-on patches in embroidered, woven, printed, and leather. From $0.91/pc at 2x2 inches and 1,000 pieces. Mockup in 12-24 hours, money-back guarantee.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Iron-On Patches: Heat-Seal Backing, Application Guide, and Pricing",
  description:
    "Complete guide to custom iron-on patches at Panda Patches. Heat-seal adhesive bond strength, supported patch types (embroidered, woven, printed, leather), wash durability, application instructions, use cases, and pricing on the standard quantity-plus-size basis. Low 5-piece minimum, free worldwide shipping, mockup in 12 to 24 hours.",
  datePublished: "2026-06-06",
  dateModified: "2026-06-06",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Iron-On Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(ironOnFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Iron-On Patches",
  description:
    "Custom iron-on patches with heat-activated adhesive backing. Available on embroidered, woven, printed, and leather patches. Low 5-piece minimum, free worldwide shipping, mockup in 12 to 24 hours.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.91",
    highPrice: "3.60",
    offerCount: "4",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

export default async function CustomIronOnPatchesPage() {
  const { workSamples, trustBadges } = await getIronOnPageData();

  return (
    <main className="min-h-screen bg-white">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Custom Patches", href: "/custom-patches" },
        ]}
        currentPage="Iron-On Patches"
      />

      {/* 1. HERO with quote form */}
      <BulkHero
        trustBadges={trustBadges}
        customHeading="Custom Iron-On Patches"
        customSubheading="Heat-Seal Backing, From 5 Pieces, Free Worldwide Shipping"
        customDescription="Iron-on adhesive backing on embroidered, woven, printed, and leather patches. Stays on for roughly 50 washes. Mockup in 12 to 24 hours. Money-back guarantee on every order."
      />

      {/* 2. WORK GALLERY */}
      <WorkGallery samples={workSamples} />

      <TrustStrip />
      <Craftsmanship />
      <ReviewsSection />

      {/* 3. WHY CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 4. OUR PROCESS */}
      <ProcessSection />

      {/* 5. COMPATIBILITY MATRIX */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            Which Patch Types Support Iron-On?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-8 max-w-[700px] mx-auto">
            Not every patch type accepts iron-on backing. PVC rubber cannot tolerate the heat-press, and chenille yarn has too much texture for the adhesive to bond. Here is the full compatibility matrix.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Patch Type</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Iron-On?</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Default Backing</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Embroidered</td><td className="px-5 py-4 font-black bg-panda-green/10">Yes</td><td className="px-5 py-4">Iron-on or sew-on</td><td className="px-5 py-4 text-gray-600">Most common combo. Free.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Woven</td><td className="px-5 py-4 font-black bg-panda-green/10">Yes</td><td className="px-5 py-4">Iron-on or sew-on</td><td className="px-5 py-4 text-gray-600">Fine detail option. Free.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Printed (Sublimation)</td><td className="px-5 py-4 font-black bg-panda-green/10">Yes</td><td className="px-5 py-4">Iron-on or sew-on</td><td className="px-5 py-4 text-gray-600">Unlimited colors. Free.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Leather</td><td className="px-5 py-4 font-black bg-panda-green/10">Yes</td><td className="px-5 py-4">Iron-on or sew-on</td><td className="px-5 py-4 text-gray-600">Premium hat brands. Free.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">PVC</td><td className="px-5 py-4 text-red-600 font-bold">No</td><td className="px-5 py-4">Sew-on (default)</td><td className="px-5 py-4 text-gray-600">Heat damages rubber. Use sew-on or Velcro (+$30).</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Chenille</td><td className="px-5 py-4 text-red-600 font-bold">No</td><td className="px-5 py-4">Sew-on (default)</td><td className="px-5 py-4 text-gray-600">Texture prevents adhesive bond. Use sew-on.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed text-center">
            For the full backing compatibility breakdown including Velcro and adhesive sticker options, see the <Link href="/ai-info/specs-and-care" prefetch={false} className="text-panda-green underline font-semibold">specs and care guide</Link>.
          </p>
        </div>
      </section>

      {/* 6. PRICING TIERS */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            How Much Do Custom Iron-On Patches Cost?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-8 max-w-[700px] mx-auto">
            Iron-on backing is standard at no upcharge on embroidered, woven, printed, and leather patches. Pricing is the base patch price for the chosen type, size, and quantity.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white mb-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Patch Type</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">At 50 pcs</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">At 100 pcs</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">At 500 pcs</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">At 1,000 pcs</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Embroidered iron-on</td><td className="px-5 py-4">$3.60/pc</td><td className="px-5 py-4">$2.40/pc</td><td className="px-5 py-4">$1.50/pc</td><td className="px-5 py-4 font-black bg-panda-green/10">$1.20/pc</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Woven iron-on</td><td className="px-5 py-4">$4.40/pc</td><td className="px-5 py-4">$3.50/pc</td><td className="px-5 py-4">$2.40/pc</td><td className="px-5 py-4 font-black bg-panda-green/10">$2.00/pc</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Printed iron-on</td><td className="px-5 py-4">Calculator quote</td><td className="px-5 py-4">Calculator quote</td><td className="px-5 py-4">Calculator quote</td><td className="px-5 py-4 font-black bg-panda-green/10">From $0.71/pc at 5,000</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">Leather iron-on</td><td className="px-5 py-4">$4.40/pc</td><td className="px-5 py-4">$3.50/pc</td><td className="px-5 py-4">$2.40/pc</td><td className="px-5 py-4 font-black bg-panda-green/10">$2.00/pc</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed text-center">
            Prices are for patches under 4 inches in the longest dimension. For exact quotes at any size or quantity from 5 upward, the calculator on each product page returns a per-piece price instantly. See the full <Link href="/ai-info/pricing" prefetch={false} className="text-panda-green underline font-semibold">pricing breakdown</Link>.
          </p>
        </div>
      </section>

      {/* 7. APPLICATION STEPS */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            How To Apply An Iron-On Patch
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-10 max-w-[700px] mx-auto">
            This six-step process works on embroidered, woven, printed, and leather iron-on patches on cotton, denim, canvas, and most natural-fiber fabrics. Total time is roughly 90 seconds per patch including cool-down.
          </p>
          <div className="grid md:grid-cols-2 gap-5 max-w-[800px] mx-auto">
            {[
              { n: 1, title: "Preheat the iron", desc: "Cotton or linen setting (medium-high heat, no steam)." },
              { n: 2, title: "Position the patch", desc: "Adhesive-side down on the garment in the desired location." },
              { n: 3, title: "Cover with a pressing cloth", desc: "Thin cotton cloth or pressing sheet protects both the patch and the iron." },
              { n: 4, title: "Press for 30-45 seconds", desc: "Firm pressure straight down. Do not slide the iron." },
              { n: 5, title: "Press from the back", desc: "Flip the garment inside out and repeat for 20 seconds from the back side." },
              { n: 6, title: "Cool completely", desc: "Let the patch cool fully before handling. The bond strengthens after the first wash." },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 bg-[#F9FAF5] border border-gray-100 rounded-2xl p-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-panda-dark text-panda-yellow font-black flex items-center justify-center text-lg">
                  {step.n}
                </div>
                <div>
                  <h3 className="text-[16px] font-black text-panda-dark mb-1">{step.title}</h3>
                  <p className="text-[14px] text-gray-600 leading-[1.6]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-[15px] leading-relaxed text-center mt-8 max-w-[700px] mx-auto">
            For long-term durability on garments washed frequently (work uniforms, game jerseys, items washed 30+ times per season), reinforce the iron-on with a few stitches around the edge. This hybrid iron-on plus sew-on attachment is the most permanent option.
          </p>
        </div>
      </section>

      {/* 8. SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Order Custom Iron-On Patches With a 12 to 24 Hour Mockup
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Custom iron-on patches are the easiest way to brand a hat, jacket, backpack, or t-shirt without sewing. Panda Patches produces iron-on backing as standard on embroidered, woven, printed, and leather patches with no upcharge. The 5-piece minimum applies (10 pieces on woven). Every order ships with free worldwide shipping, a digital mockup delivered in 12 to 24 hours, unlimited free revisions, and our money-back guarantee.
            </p>
            <p>
              Iron-on patches work best on cotton, denim, canvas, and most natural-fiber garments. They are not the right choice for nylon athletic wear, polyester performance fabrics, waterproof shells, or industrially-washed uniforms. For heat-sensitive or specialty fabrics, choose sew-on or Velcro backing instead. For garments washed frequently, reinforce the iron-on edge with a few stitches for permanent attachment.
            </p>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <CategoryFAQ title="Iron-On Patches FAQ" faqs={ironOnFAQs} />

      {/* 10. CTA */}
      <CTASection />

      <Footer />
    </main>
  );
}
