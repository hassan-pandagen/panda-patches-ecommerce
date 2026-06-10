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
import { buildPageMetadata } from "@/lib/seo";

const CANONICAL = "https://www.pandapatches.com/vector-conversion";

const vectorFAQs = [
  {
    question: "What is vector conversion?",
    answer:
      "Vector conversion (also called vectorization or logo vectorization) is the process of redrawing a pixel-based image (JPG, PNG, BMP, GIF) into a resolution-independent vector file (AI, EPS, SVG, PDF). Raster images are made of pixels and lose clarity when scaled up. Vectors are made of mathematical paths and stay sharp at any size. Vector files are required for clean patch production, screen printing, embroidery digitizing, vinyl cutting, sign making, and any commercial print application above small thumbnail size.",
  },
  {
    question: "Is vector conversion included free with a patch order?",
    answer:
      "Yes. Every custom patch order at Panda Patches includes free vector conversion as part of the standard mockup process. If the buyer submits a low-resolution image, a hand-drawn sketch, a photo of an existing patch, or any raster file, the design team redraws it into a production-ready vector at no additional charge. The clean vector is shown in the 12 to 24 hour digital mockup and the customer approves it before production starts.",
  },
  {
    question: "Can I get logo vectorization as a standalone service?",
    answer:
      "Yes, with one free trial. Standalone vector conversion on the first simple logo is free (one per customer). Simple is defined as a single-layer logo or design, fewer than 10 distinct colors, no photographic detail, and no complex gradients. Complex images including photo-realistic conversions, multi-layer artwork, very intricate detail, or anything requiring substantial redrawing are quoted separately. The price scales with complexity, typically $15 to $100 per conversion.",
  },
  {
    question: "What input formats are accepted for raster to vector conversion?",
    answer:
      "Any common image format is accepted including JPG, PNG, GIF, BMP, TIFF, and even photos of existing physical artwork (a patch sample, a sketch, a business card, a logo printed on a garment). Hand-drawn sketches and reference images at any resolution are also accepted. The design team works from whatever source material the buyer can provide.",
  },
  {
    question: "What output formats are delivered?",
    answer:
      "Standard delivery formats include AI (Adobe Illustrator, the most common), EPS (universal vector format compatible with most software), SVG (web standard), and PDF (vector preserved). The buyer specifies the target format in the design notes. Multiple formats are available on the same job at no extra cost. All output files use clean, editable paths with named layers and outlined text so the buyer can edit the file later if needed.",
  },
  {
    question: "What is the turnaround for vector conversion?",
    answer:
      "Free vector conversion on a patch order is included in the 12 to 24 hour mockup turnaround. Standalone vector conversion on a simple image (the free trial) returns within 24 to 48 business hours of the chat or form submission. Complex paid jobs are scoped at the quote stage with an explicit turnaround commitment, typically 1 to 3 business days depending on detail level.",
  },
  {
    question: "How do I submit a logo for vectorization?",
    answer:
      "Use the Start Chat button or the artwork upload form on this page. Upload your image (JPG, PNG, or any common format), include the target output format (AI, EPS, SVG, or PDF), and describe the intended use (patch order, screen print, embroidery, vinyl cut, sign, web). The design team reviews and either confirms free conversion (for patch orders or the free trial) or returns a quote within US business hours.",
  },
];

export const revalidate = 86400;

const getVectorPageData = cache(async () => {
  try {
    const query = `{
      "categoryData": *[_type == "categoryPage" && slug.current == "custom-sports-patches"][0] {
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
    console.error("Vector conversion page data fetch error:", error);
    return { workSamples: [], trustBadges: [] };
  }
});

export const metadata: Metadata = buildPageMetadata({
  title: "Vector Conversion Service | Logo Vectorization | Panda Patches",
  description:
    "Vector conversion service. Raster to vector, logo vectorization. Free with every patch order. First simple vector is free. Complex images quoted. JPG, PNG to AI, EPS, SVG, PDF. Upload artwork to start.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Vector Conversion Service: Raster to Vector, Logo Vectorization, Free First Vector",
  ogDescription:
    "Convert JPG, PNG, or low-res logos to clean AI, EPS, SVG, PDF vector files. Free with any patch order. First simple vector standalone is free. Complex images quoted.",
  twitterTitle: "Vector Conversion Service: Raster to Vector, Logo Vectorization",
  twitterDescription:
    "Convert JPG, PNG to AI, EPS, SVG, PDF. Free with patch orders. First simple vector standalone is free.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Vector Conversion Service: Raster to Vector and Logo Vectorization",
  description:
    "Complete guide to vector conversion at Panda Patches. Free with every patch order. Standalone first simple vector is free. Complex images quoted. Converts JPG, PNG, and raster sources to clean AI, EPS, SVG, PDF vector files. Covers logo vectorization for patches, print, embroidery, and web.",
  datePublished: "2026-06-06",
  dateModified: "2026-06-09",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Design Services", url: "https://www.pandapatches.com/vector-conversion" },
  { name: "Vector Conversion", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(vectorFAQs);

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Vector Conversion",
  name: "Vector Conversion and Logo Vectorization Service",
  description:
    "Convert raster images (JPG, PNG, BMP, GIF) into clean, resolution-independent vector files (AI, EPS, SVG, PDF). Logo vectorization for patches, print, embroidery, vinyl, and web. Free with every Panda Patches order. Standalone first simple vector is free; complex images are quoted separately.",
  provider: { "@type": "Organization", name: "Panda Patches", url: "https://www.pandapatches.com" },
  areaServed: { "@type": "Country", name: "Worldwide" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free with any patch order. Free standalone trial for the first simple vector. Complex images quoted separately.",
  },
};

export default async function VectorConversionPage() {
  const { workSamples, trustBadges } = await getVectorPageData();

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
          { label: "Design Services", href: "/vector-conversion" },
        ]}
        currentPage="Vector Conversion"
      />

      {/* 1. HERO with design-service form */}
      <DesignServiceHero
        serviceType="vector"
        trustBadges={trustBadges}
        heading="Vector Conversion Service"
        subheading="Raster to Vector, Logo Vectorization, Free First Vector"
        description="Convert any JPG, PNG, low-res logo, or hand sketch into a clean, scalable vector file (AI, EPS, SVG, PDF). Free with every patch order. First simple vector standalone is free."
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
            When Is Vector Conversion Free?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-10 max-w-[700px] mx-auto">
            Two free paths, plus a quoted path for complex jobs. Use chat or the upload form to start any of them.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-panda-green/10 border-2 border-panda-green/30 rounded-2xl p-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-panda-green mb-2">Free Path 1</p>
              <h3 className="text-[18px] font-black text-panda-dark mb-3">With any patch order</h3>
              <p className="text-[14px] text-gray-700 leading-[1.7]">
                Vector conversion is included in the mockup workflow at no charge. The clean vector is shown in the 12 to 24 hour digital mockup regardless of source-image quality.
              </p>
            </div>
            <div className="bg-panda-green/10 border-2 border-panda-green/30 rounded-2xl p-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-panda-green mb-2">Free Path 2</p>
              <h3 className="text-[18px] font-black text-panda-dark mb-3">Standalone trial</h3>
              <p className="text-[14px] text-gray-700 leading-[1.7]">
                First simple image free (one per customer). Single-layer logo, fewer than 10 colors, no photographic detail or complex gradients.
              </p>
            </div>
            <div className="bg-white border-2 border-amber-300 rounded-2xl p-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-amber-700 mb-2">Quoted</p>
              <h3 className="text-[18px] font-black text-panda-dark mb-3">Complex vectorization</h3>
              <p className="text-[14px] text-gray-700 leading-[1.7]">
                Photo-realistic conversions, multi-layer artwork, very intricate detail, or anything requiring substantial redrawing. Typically $15 to $100 per conversion.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="#hero"
              prefetch={false}
              className="flex items-center justify-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
            >
              Upload Image &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            Accepted Inputs &amp; Delivered Outputs
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-10 max-w-[700px] mx-auto">
            Any common raster format in. Industry-standard vector formats out. Multiple output formats on the same job at no extra cost.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-gray-200 shadow-sm p-6 bg-[#F9FAF5]">
              <h3 className="text-[18px] font-black text-panda-dark mb-4 uppercase tracking-tight">Accepted Input (Raster)</h3>
              <ul className="space-y-2 text-gray-700 text-[14px] leading-[1.7] list-disc list-outside ml-5">
                <li>JPG / JPEG</li>
                <li>PNG (including transparent)</li>
                <li>GIF</li>
                <li>BMP</li>
                <li>TIFF / TIF</li>
                <li>Photos of physical artwork</li>
                <li>Hand-drawn sketches at any resolution</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-panda-green/40 shadow-sm p-6 bg-panda-green/5">
              <h3 className="text-[18px] font-black text-panda-dark mb-4 uppercase tracking-tight">Delivered Output (Vector)</h3>
              <ul className="space-y-2 text-gray-700 text-[14px] leading-[1.7] list-disc list-outside ml-5">
                <li><strong>AI</strong> (Adobe Illustrator, most common)</li>
                <li><strong>EPS</strong> (universal vector format)</li>
                <li><strong>SVG</strong> (web standard)</li>
                <li><strong>PDF</strong> (vector preserved)</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed text-center mt-6 max-w-[700px] mx-auto">
            All output files use clean, editable paths with named layers and outlined text so the buyer can edit the file later in Illustrator, Inkscape, Affinity Designer, CorelDRAW, or any vector editor.
          </p>
        </div>
      </section>

      {/* SEO content */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Professional Vector Conversion and Logo Vectorization
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Vector files are required for clean reproduction at any commercial size above a thumbnail. Custom patches, screen printing, embroidery digitizing, vinyl cutting, sign making, large-format print, vehicle wraps, and brand guideline documents all require vector source. If you only have a low-resolution image, a hand-drawn sketch, a photo of an existing patch, or a logo grabbed from a website, vector conversion is the bridge between that source material and production-ready artwork.
            </p>
            <p>
              At Panda Patches the vector conversion step is free with every patch order and is included in the standard 12 to 24 hour mockup workflow. For buyers who need vector conversion or logo vectorization without a patch order, the first simple image is free as a standalone trial. Complex images, photo-realistic conversions, multi-layer artwork, and anything requiring substantial redrawing are quoted separately with the price confirmed in writing before any work starts. Use the Start Chat button at the top of this page or upload your image through the contact form to begin.
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
            <Link href="/embroidery-digitizing" prefetch={false} className="block bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Embroidery Digitizing &rarr;</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Convert vector to machine-ready stitch files (DST, PES, EXP, JEF). Same free-with-order policy.</p>
            </Link>
            <Link href="/custom-patches/embroidered" prefetch={false} className="block bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Embroidered Patches &rarr;</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Order embroidered patches and vector conversion is included free as part of the mockup.</p>
            </Link>
            <Link href="/custom-patches" prefetch={false} className="block bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">All Custom Patches &rarr;</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Every patch type. Vector conversion bundled free with each order.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <CategoryFAQ title="Vector Conversion FAQ" faqs={vectorFAQs} />

      <CTASection />
      <Footer />
    </main>
  );
}
