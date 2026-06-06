import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import DesignServiceHero from "@/components/design-services/DesignServiceHero";
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

const CANONICAL = "https://www.pandapatches.com/embroidery-digitizing";

const digitizingFAQs = [
  {
    question: "What is embroidery digitizing?",
    answer:
      "Embroidery digitizing is the process of converting artwork (a logo, an image, a sketch) into a machine-readable stitch file that an embroidery machine can sew. The digitizer assigns each shape and color in the artwork a specific stitch type (running, satin, fill), stitch direction, density, underlay, and pull compensation. The output is a binary file in formats like DST (Tajima), PES (Brother), EXP (Melco), JEF (Janome), VP3, or XXX. Without digitizing, an embroidery machine has nothing to follow.",
  },
  {
    question: "Is embroidery digitizing included free with a patch order?",
    answer:
      "Yes. Every custom patch order at Panda Patches includes free digitizing as part of the standard mockup process. There is no separate digitizing fee, no setup fee, and no art charge on patch orders regardless of quantity, size, or complexity. The digitizer reviews the artwork at the quote stage, prepares the stitch file, and runs the test stitch as part of the 12 to 24 hour mockup. The customer approves the mockup before production starts.",
  },
  {
    question: "Can I get digitizing as a standalone service without a patch order?",
    answer:
      "Yes, with one free trial. Standalone digitizing on a simple first design under 4 inches is free. Larger designs, complex multi-layer artwork, photo-realistic conversions, very small text under 3mm, or anything requiring 10,000 or more stitches is quoted separately. The price scales with complexity and is confirmed in writing before any work starts. Standalone digitizing orders are intake through chat or the artwork upload form on this page rather than through the standard checkout.",
  },
  {
    question: "What file formats does Panda Patches deliver?",
    answer:
      "Standard delivery formats include DST (Tajima, the most common commercial format), PES (Brother), EXP (Melco), JEF (Janome), VP3 (Husqvarna Viking), XXX (Singer), and SEW. The buyer specifies the target machine or format in the design notes and the digitizer delivers in the matching format. Multiple formats are available on the same job for buyers who run more than one machine brand. All output files are tested on a sample machine before delivery.",
  },
  {
    question: "What is the turnaround for digitizing?",
    answer:
      "Free digitizing on a patch order is included in the 12 to 24 hour mockup turnaround. Standalone digitizing on a simple design under 4 inches (the free trial) returns within 24 to 48 business hours of the chat or form submission. Complex paid digitizing jobs are scoped at the quote stage with an explicit turnaround commitment, typically 2 to 5 business days depending on stitch count and detail level. Rush turnaround is available on quoted jobs for an additional fee.",
  },
  {
    question: "How do I submit artwork for digitizing?",
    answer:
      "Use the Start Chat button or the artwork upload form on this page. Upload your design in any common format (AI, EPS, PDF, SVG, PNG, JPG) and include the target final size, the target machine or file format, the thread color list (Pantone codes preferred), and any specific notes about stitch direction or coverage. The design team reviews and either confirms free digitizing or returns a quote within business hours.",
  },
  {
    question: "What affects digitizing quality?",
    answer:
      "Six factors matter most for a clean embroidery result: stitch density (too tight puckers fabric, too loose looks sparse), underlay (stabilizes the fabric and supports the top stitching), pull compensation (corrects for thread tension stretching the design), stitch direction (changes the way light catches the design), small-text legibility (text below 4mm rarely reads clean in machine embroidery), and color count (most patches stay under 10 to 15 thread colors). A skilled digitizer balances all six against the artwork and the target fabric.",
  },
];

export const revalidate = 86400;

const getDigitizingPageData = cache(async () => {
  try {
    const query = `{
      "categoryData": *[_type == "categoryPage" && slug.current == "custom-corporate-patches"][0] {
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
    console.error("Digitizing page data fetch error:", error);
    return { workSamples: [], trustBadges: [] };
  }
});

export const metadata: Metadata = {
  title: "Embroidery Digitizing Service | Free With Patch Orders | Panda Patches",
  description:
    "Custom embroidery digitizing service. Free with every patch order. Free standalone trial for simple designs under 4 inches. Complex jobs quoted. DST, PES, EXP, JEF formats. Chat or upload to start.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Embroidery Digitizing Service: Free With Patch Orders, Free Trial Under 4 Inches",
    description:
      "Convert logo to embroidery file (DST, PES, EXP, JEF). Free with any patch order. Standalone simple-design trial under 4 inches is free. Complex digitizing quoted. Chat or upload to start.",
    url: CANONICAL,
    siteName: "Panda Patches",
    type: "article",
    images: [{ url: "https://www.pandapatches.com/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embroidery Digitizing Service: Free With Patch Orders, Free Trial Under 4 Inches",
    description:
      "Convert logo to embroidery file. Free with any patch order. Standalone trial under 4 inches is free. Complex jobs quoted.",
    images: ["https://www.pandapatches.com/assets/og-image.png"],
  },
};

const articleSchema = generateArticleSchema({
  title: "Embroidery Digitizing Service: Free With Patch Orders, Standalone Trial Available",
  description:
    "Complete guide to embroidery digitizing at Panda Patches. Free with every patch order. Standalone first simple design under 4 inches is free. Complex jobs quoted. Delivers DST, PES, EXP, JEF, VP3 file formats. Chat or upload form intake instead of standard checkout. Includes file format reference, quality factors, and submission process.",
  datePublished: "2026-06-06",
  dateModified: "2026-06-06",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Design Services", url: "https://www.pandapatches.com/embroidery-digitizing" },
  { name: "Embroidery Digitizing", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(digitizingFAQs);

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Embroidery Digitizing",
  name: "Custom Embroidery Digitizing",
  description:
    "Convert artwork into machine-readable stitch files (DST, PES, EXP, JEF) for embroidery. Free with every Panda Patches order. Standalone first simple design under 4 inches is free; complex jobs are quoted separately.",
  provider: { "@type": "Organization", name: "Panda Patches", url: "https://www.pandapatches.com" },
  areaServed: { "@type": "Country", name: "Worldwide" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free with any patch order. Free standalone trial for the first simple design under 4 inches. Complex jobs quoted separately.",
  },
};

export default async function EmbroideryDigitizingPage() {
  const { workSamples, trustBadges } = await getDigitizingPageData();

  return (
    <main className="min-h-screen bg-white">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(serviceSchema)} />

      <Navbar />

      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: "Design Services", href: "/embroidery-digitizing" },
        ]}
        currentPage="Embroidery Digitizing"
      />

      {/* 1. HERO with design-service form */}
      <DesignServiceHero
        serviceType="digitizing"
        trustBadges={trustBadges}
        heading="Embroidery Digitizing Service"
        subheading="Free With Patch Orders, Free Trial Under 4 Inches"
        description="Convert your logo or artwork into machine-ready stitch files (DST, PES, EXP, JEF, VP3). Free with every patch order. First simple design standalone is free. Complex digitizing quoted separately."
      />

      {/* 2. WORK GALLERY */}
      <WorkGallery samples={workSamples} />

      <TrustStrip />
      <Craftsmanship />
      <ReviewsSection />

      <Promises bgColor="bg-white" />

      <ProcessSection />

      {/* Free vs Paid callout */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            When Is Digitizing Free, And When Is It Quoted?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-10 max-w-[700px] mx-auto">
            The Panda Patches digitizing service is structured around two intake paths. Upload your artwork in the form at the top of the page to start either path.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-panda-green/10 border-2 border-panda-green/30 rounded-2xl p-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-panda-green mb-2">Free Path 1</p>
              <h3 className="text-[18px] font-black text-panda-dark mb-3">With any patch order</h3>
              <p className="text-[14px] text-gray-700 leading-[1.7]">
                If you are ordering custom patches, digitizing is included in the mockup workflow at no charge. There is no setup fee, no digitizing fee, and no art charge regardless of design complexity, stitch count, or size.
              </p>
            </div>
            <div className="bg-panda-green/10 border-2 border-panda-green/30 rounded-2xl p-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-panda-green mb-2">Free Path 2</p>
              <h3 className="text-[18px] font-black text-panda-dark mb-3">Standalone trial</h3>
              <p className="text-[14px] text-gray-700 leading-[1.7]">
                Standalone digitizing on a simple first design under 4 inches is free (one per customer). Covers most one-off logos, badges, monograms, and small commercial designs.
              </p>
            </div>
            <div className="bg-white border-2 border-amber-300 rounded-2xl p-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-amber-700 mb-2">Quoted</p>
              <h3 className="text-[18px] font-black text-panda-dark mb-3">Complex digitizing</h3>
              <p className="text-[14px] text-gray-700 leading-[1.7]">
                Larger designs, multi-layer artwork, photo-realistic conversions, 10,000+ stitch jobs, or very small text under 3mm. Typically $20 to $150 per design. Quote confirmed in writing before any work starts.
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Link
              href="#hero"
              prefetch={false}
              className="flex items-center justify-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
            >
              Upload Artwork &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* File formats */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            File Formats We Deliver
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-8 max-w-[700px] mx-auto">
            Specify the target machine brand or format in the design notes and the file is exported in that format. Multiple formats are available on the same job at no extra cost.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Format</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Machine Brand</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">DST</td><td className="px-5 py-4">Tajima</td><td className="px-5 py-4 text-gray-600">Most common commercial format. Default if no format specified.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">PES</td><td className="px-5 py-4">Brother</td><td className="px-5 py-4 text-gray-600">Standard for home and small-commercial Brother machines.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">EXP</td><td className="px-5 py-4">Melco / Bernina</td><td className="px-5 py-4 text-gray-600">Common in commercial multi-head setups.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">JEF</td><td className="px-5 py-4">Janome</td><td className="px-5 py-4 text-gray-600">Standard for Janome home machines.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">VP3</td><td className="px-5 py-4">Husqvarna Viking / Pfaff</td><td className="px-5 py-4 text-gray-600">Default for Husqvarna and Pfaff.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">XXX</td><td className="px-5 py-4">Singer</td><td className="px-5 py-4 text-gray-600">Older Singer machines.</td></tr>
                <tr className="border-t border-gray-100"><td className="px-5 py-4 font-bold">SEW</td><td className="px-5 py-4">Janome / Elna</td><td className="px-5 py-4 text-gray-600">Older Janome legacy format.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Professional Embroidery Digitizing With a 12 to 24 Hour Mockup
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Embroidery digitizing is the process of converting artwork into a machine-readable stitch file that an embroidery machine can sew. The quality of the digitizing file matters more than the quality of the machine. A skilled digitizer balances stitch density, underlay, pull compensation, stitch direction, small-text legibility, and color count to deliver a clean stitch on the target fabric. At Panda Patches the digitizing step is free with every patch order and is included in the standard 12 to 24 hour mockup workflow.
            </p>
            <p>
              For buyers who need digitizing without a patch order, the first simple design under 4 inches is free as a standalone trial. Complex jobs, photo-realistic conversions, multi-layer artwork, or very large designs are quoted separately with the price confirmed in writing before any work starts. Standalone digitizing does not go through the standard ecommerce checkout because most jobs are free or require a quote conversation first. Use the Start Chat button at the top of this page or upload your artwork through the contact form to begin.
            </p>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-center text-panda-dark mb-8">
            Related Design Services
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/raster-to-vector-conversion" prefetch={false} className="block bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Raster to Vector Conversion &rarr;</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Raster to vector. Same free-with-order policy. First simple vector free.</p>
            </Link>
            <Link href="/ai-info/specs-and-care" prefetch={false} className="block bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Artwork File Specs &rarr;</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Vector vs raster guidance, DPI minimums, Pantone matching, full format reference.</p>
            </Link>
            <Link href="/custom-patches/embroidered" prefetch={false} className="block bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Embroidered Patches &rarr;</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">The primary product that uses digitizing. Live calculator with pricing at any size and quantity.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <CategoryFAQ title="Embroidery Digitizing FAQ" faqs={digitizingFAQs} />

      <CTASection />
      <Footer />
    </main>
  );
}
