import Link from "next/link";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/lib/sanity";
import { Metadata } from "next";
import dynamic from 'next/dynamic';
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema, generateSchemaScript } from "@/lib/schemas";
import ProductReviews from "@/components/reviews/ProductReviews";
import AeoAnswerBlock from "@/components/product/AeoAnswerBlock";
import ProductDepthBlock from "@/components/product/ProductDepthBlock";
import { getSpecsForSlug } from "@/lib/patchSpecs";
import { aeoContent } from "@/lib/aeoContent";
import { getSchemaPricingTiers } from "@/lib/pricingCalculator";
import { genericFaqs } from "@/lib/genericFaqs";
import { slugFaqMap } from "@/lib/slugFaqs";
import productPageMeta from "@/lib/productPageMeta";
import { buildPageMetadata } from "@/lib/seo";

// COMPONENTS - Above the fold
import ProductHero from "@/components/product/ProductHero";
import TrustStrip from "@/components/products/TrustStrip";
import Promises from "@/components/home/Promises";
import ProductInfoCarousel from "@/components/product/ProductInfoCarousel";

// Lazy load below-fold components to improve initial page load
const ProcessSection = dynamic(() => import("@/components/home/ProcessSection"), { ssr: true });
const WorkSamples = dynamic(() => import("@/components/product/WorkSamples"), { ssr: true });
const TimelineSection = dynamic(() => import("@/components/home/TimelineSection"), { ssr: true });
const FAQ = dynamic(() => import("@/components/home/FAQ"), { ssr: true });
const ContentSection = dynamic(() => import("@/components/home/ContentSection"), { ssr: true });
const Craftsmanship = dynamic(() => import("@/components/home/Craftsmanship"), { ssr: true });
const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection"), { ssr: true });
const CTASection = dynamic(() => import("@/components/home/CTASection"), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: true });

// ISR: Revalidate product pages every 24 hours (products rarely change)
export const revalidate = 86400;

async function getProductData(slug: string) {
  // Validate slug format to prevent injection (alphanumeric and hyphens only)
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return null;
  }

  // Use parameterized query to prevent GROQ injection
  // Explicitly exclude drafts to only get published documents
  const query = `*[_type == "productPage" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    ...,
    borderSectionLabel,
    threadSectionLabel,
    "gallery": gallery[]{
      "image": @,
      "alt": alt
    },
    "workSamples": workSamples[]{
      "image": @,
      "alt": alt
    },
    backingOptions[]{
      title,
      description,
      "image": image{
        ...,
        "alt": alt
      }
    },
    borderOptions[]{
      title,
      description,
      "image": image{
        ...,
        "alt": alt
      }
    },
    threadOptions[]{
      title,
      description,
      "image": image{
        ...,
        "alt": alt
      }
    },
    upgradeOptions[]{
      title,
      description,
      "image": image{
        ...,
        "alt": alt
      }
    },
    productVariants{
      heading,
      subheading,
      types[]{
        title,
        description,
        "image": image{
          ...,
          "alt": alt
        }
      }
    }
  }`;
  const data = await client.fetch(query, { slug });
  return data;
}

// Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductData(slug);

  if (!product) {
    return { title: '404 - Product Not Found | Panda Patches' };
  }

  const meta = productPageMeta[slug];
  const fallbackDesc = product.description || `High-quality ${product.title.toLowerCase()} with low minimums, fast delivery, and free design services from Panda Patches.`;
  const pageTitle = meta?.title || `${product.title} | Panda Patches`;
  const pageDesc = meta?.description || fallbackDesc.substring(0, 160);
  const ogTitle = meta?.ogTitle || product.title;
  const ogDesc = meta?.ogDescription || fallbackDesc.substring(0, 160);
  const imageUrl = product.heroImage
    ? urlFor(product.heroImage).width(1200).height(630).fit('crop').format('jpg').quality(80).url()
    : 'https://www.pandapatches.com/assets/og-image.png';

  return buildPageMetadata({
    title: pageTitle,
    description: pageDesc,
    url: `https://www.pandapatches.com/custom-patches/${slug}`,
    image: { url: imageUrl, alt: pageTitle },
    ogTitle,
    ogDescription: ogDesc,
  });
}

const PATCH_TYPES = [
  { name: "Embroidered Patches", slug: "embroidered" },
  { name: "PVC Patches", slug: "pvc" },
  { name: "Woven Patches", slug: "woven" },
  { name: "Chenille Patches", slug: "chenille" },
  { name: "Leather Patches", slug: "leather" },
  { name: "Printed Patches", slug: "printed" },
  { name: "Sequin Patches", slug: "sequin" },
];

export default async function DynamicProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    // Real HTTP 404 instead of 200 with a "Product Not Found" message.
    notFound();
  }

  // Generate schema markup for SEO
  // Derive priceRange directly from the live calculator tiers so the schema
  // matches the actual checkout pricing (including the 1.10 PRICE_MULTIPLIER).
  const pricingTiers = getSchemaPricingTiers(data.title);
  const computedPriceRange = pricingTiers.length > 0
    ? (() => {
        const prices = pricingTiers.map((t) => t.unitPrice);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return `$${min.toFixed(2)}-$${max.toFixed(2)}`;
      })()
    : "$0.90-$6.00";
  const productSchema = generateProductSchema({
    name: data.title,
    description: data.description || `High-quality ${data.title.toLowerCase()} with low minimums, fast delivery, and free design services.`,
    image: data.heroImage ? urlFor(data.heroImage).width(1200).height(630).fit('crop').format('jpg').quality(80).url() : 'https://www.pandapatches.com/assets/og-image.png',
    url: `https://www.pandapatches.com/custom-patches/${slug}`,
    priceRange: computedPriceRange,
    pricingTiers: pricingTiers.length > 0 ? pricingTiers : undefined,
    // These slugs are all patch types, so genuine patch-order reviews apply.
    // Merges a product aggregateRating only when enough real reviews exist;
    // the same reviews render below via <ProductReviews>.
    reviewKey: slug,
    // Same rows the visible depth block renders — both read patchSpecs.ts.
    specs: getSpecsForSlug(slug),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.pandapatches.com" },
    { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
    { name: data.title, url: `https://www.pandapatches.com/custom-patches/${slug}` },
  ]);

  return (
    <main className="min-h-screen bg-white">
      {/* Product Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(productSchema)}
      />

      {/* Breadcrumb Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
      />

      {/* FAQ Schema for SEO — unique per product slug to avoid duplicate FAQPage errors */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(generateFAQSchema(slugFaqMap[slug] ?? genericFaqs))}
      />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Custom Patches", href: "/custom-patches" }
        ]}
        currentPage={data.title}
      />

      {/* 1. HERO (Calculator with Checkout) */}
      <ProductHero productData={data} isMainPage={false} />

      {/* 2. PANDA IS 5 STAR */}
      <TrustStrip />

      {/* 2.5 AEO ANSWER BLOCK — answer-first content in the first-30% extraction
          zone (AEO-CONTENT-REWORK-SPEC-2026-07.md): direct answer + key-facts
          table + patch-type comparison + fan-out Q&A, high in the DOM so answer
          engines can cite it. Only renders for slugs with authored content. */}
      {aeoContent[slug] && <AeoAnswerBlock content={aeoContent[slug]} />}

      {/* 3. Craftsmanship + Reviews */}
      <Craftsmanship />
      {/* Product-specific reviews backing this page's Product.aggregateRating
          (must be visible for the rating markup to be valid). */}
      <ProductReviews productKey={slug} productName={data.title} />
      <ReviewsSection />

      {/* 4. PANDA PROMISE */}
      <Promises bgColor="bg-white" />

      {/* 4. BACKING OPTIONS */}
      {data.backingOptions && data.backingOptions.length > 0 && (
        <ProductInfoCarousel
          options={data.backingOptions}
          title="Backing Options"
          subtitle="Choose the perfect backing for your patches"
          layout="left"
        />
      )}

      {/* 5. BORDER / COLOR OPTIONS */}
      {data.borderOptions && data.borderOptions.length > 0 && (
        <ProductInfoCarousel
          options={data.borderOptions}
          title={data.borderSectionLabel || "Border Options"}
          subtitle="Customize your patch borders and colors"
          layout="right"
        />
      )}

      {/* 6. THREAD/COLOR OPTIONS */}
      {data.threadOptions && data.threadOptions.length > 0 && (
        <ProductInfoCarousel
          options={data.threadOptions}
          title={data.threadSectionLabel || "Thread & Color Options"}
          subtitle="Special thread and color effects"
          layout="left"
        />
      )}

      {/* 7. UPGRADES & ADD-ONS */}
      {data.upgradeOptions && data.upgradeOptions.length > 0 && (
        <ProductInfoCarousel
          options={data.upgradeOptions}
          title="Upgrades & Add-ons"
          subtitle="Enhance your patches with premium options"
          layout="right"
        />
      )}

      {/* 8. PRODUCT TYPES (Coin Types / Pin Styles / Keychain Materials) */}
      {data.productVariants && (
        <ProductInfoCarousel
          options={data.productVariants.types}
          title={data.productVariants.heading}
          subtitle={data.productVariants.subheading}
          layout="left"
        />
      )}

      {/* 8.5 DEPTH BLOCK — construction + production limits + live cost ladder
          (CLB408_1 §5). Product pages were losing their own head terms to our
          guides because the guides carried the substance. Placed after the
          option carousels (so a ready buyer still hits the calculator first)
          but above the generic process/timeline sections, which are identical
          on every page and carry no head-term weight. */}
      <ProductDepthBlock slug={slug} productName={data.title} title={data.title} />

      {/* 9. GORILLA SKETCH PROCESS */}
      <ProcessSection />

      {/* 10. WORK SAMPLES */}
      <WorkSamples samples={data.workSamples} />

      {/* BULK ORDER CALLOUT — internal link to /bulk-custom-patches */}
      <section className="w-full py-10 md:py-14 bg-panda-dark">
        <div className="container mx-auto px-4 md:px-6 max-w-[50rem] text-center">
          <p className="text-gray-400 text-[0.8125rem] md:text-[0.9375rem] font-medium mb-2 uppercase tracking-widest">
            Ordering 50+ pieces?
          </p>
          <h2 className="text-white text-[1.25rem] md:text-[1.75rem] font-black uppercase mb-5 leading-tight">
            Order in Bulk &amp; Save More
          </h2>
          <Link
            href="/bulk-custom-patches"
            className="inline-flex items-center gap-2 bg-panda-yellow text-panda-dark font-black px-8 py-3 rounded-full text-[0.8125rem] uppercase tracking-widest hover:bg-white transition-colors"
          >
            Get Bulk Pricing →
          </Link>
        </div>
      </section>

      {/* 11. HOW TO ORDER (Timeline Zig Zag) */}
      <TimelineSection />

      {/* 12. RELATED PATCH TYPES — internal linking */}
      <section className="w-full py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem] text-center">
          <p className="text-gray-500 text-[0.75rem] font-semibold uppercase tracking-widest mb-2">Explore More</p>
          <h2 className="text-[1.25rem] md:text-[1.625rem] font-black uppercase text-panda-dark mb-8">
            Other Custom Patch Types
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {/* Embroidered always shows first — top seller */}
            <Link
              href="/custom-patches/embroidered"
              className="px-5 py-2.5 rounded-full border-2 border-panda-dark text-panda-dark text-[0.8125rem] font-bold uppercase tracking-wide hover:bg-panda-dark hover:text-white transition-colors"
            >
              Embroidered Patches
            </Link>
            {PATCH_TYPES.filter((p) => p.slug !== slug && p.slug !== "embroidered").map((patch) => (
              <Link
                key={patch.slug}
                href={`/custom-patches/${patch.slug}`}
                className="px-5 py-2.5 rounded-full border-2 border-panda-dark text-panda-dark text-[0.8125rem] font-bold uppercase tracking-wide hover:bg-panda-dark hover:text-white transition-colors"
              >
                {patch.name}
              </Link>
            ))}
            <Link
              href="/custom-patches"
              className="px-5 py-2.5 rounded-full bg-panda-yellow text-panda-dark text-[0.8125rem] font-bold uppercase tracking-wide hover:bg-panda-dark hover:text-panda-yellow transition-colors"
            >
              All Patch Types
            </Link>
          </div>
        </div>
      </section>

      {/* 12b. WOVEN-ONLY GUIDE BRIDGE → AI-design blog (CL9F69). Woven is the fix
          for detailed/AI-generated art that embroidery blurs, so this is the natural cross-link. */}
      {slug === "woven" && (
        <section className="w-full py-10 md:py-14 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-[50rem] text-center">
            <p className="text-gray-500 text-[0.75rem] font-semibold uppercase tracking-widest mb-2">Design Guide</p>
            <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-3 leading-tight">
              Is your design too detailed to embroider?
            </h2>
            <p className="text-gray-600 text-[0.875rem] md:text-[0.9375rem] leading-[1.7] mb-5 max-w-[38.75rem] mx-auto">
              Woven holds fine detail — small text and thin lines — that embroidery blurs at small sizes. If you have an AI-generated or intricate design, our guide explains exactly when to choose woven over embroidered.
            </p>
            <Link
              href="/ai-patch-design-too-detailed-for-embroidery"
              prefetch={false}
              className="inline-flex items-center gap-2 text-panda-green font-black text-[0.8125rem] uppercase tracking-widest underline underline-offset-4 hover:text-panda-dark transition-colors"
            >
              AI design too detailed for embroidery? →
            </Link>
          </div>
        </section>
      )}

      {/* LEATHER-ONLY GUIDE BRIDGE → dedicated hat-patch product page (CL9EE9_1 C.6). */}
      {slug === "leather" && (
        <section className="w-full py-10 md:py-14 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-[50rem] text-center">
            <p className="text-gray-500 text-[0.75rem] font-semibold uppercase tracking-widest mb-2">Popular Application</p>
            <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-3 leading-tight">
              Ordering leather patches for hats?
            </h2>
            <p className="text-gray-600 text-[0.875rem] md:text-[0.9375rem] leading-[1.7] mb-5 max-w-[38.75rem] mx-auto">
              Hats need panel-specific sizing and a choice between laser engraving and UV printing. Our dedicated leather hat patches page covers both in detail.
            </p>
            <Link
              href="/custom-leather-hat-patches"
              prefetch={false}
              className="inline-flex items-center gap-2 text-panda-green font-black text-[0.8125rem] uppercase tracking-widest underline underline-offset-4 hover:text-panda-dark transition-colors"
            >
              Custom leather hat patches →
            </Link>
          </div>
        </section>
      )}

      {/* 13. SEO & FAQ — same source as the FAQPage schema above, so the visible
          page matches what's marked up (was rendering genericFaqs while the
          schema used the per-slug set; CL9EE9_1 follow-up). */}
      <ContentSection />
      <FAQ questions={slugFaqMap[slug] ?? genericFaqs} />

      {/* 13. CTA */}
      <CTASection />
      
      <Footer />
    </main>
  );
}
