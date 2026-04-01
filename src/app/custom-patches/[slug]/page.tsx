import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import { Metadata } from "next";
import dynamic from 'next/dynamic';
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema, generateSchemaScript } from "@/lib/schemas";
import { getSchemaPricingTiers } from "@/lib/pricingCalculator";
import { genericFaqs } from "@/lib/genericFaqs";
import { slugFaqMap } from "@/lib/slugFaqs";

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

  const description = product.description || `High-quality ${product.title.toLowerCase()} with low minimums, fast delivery, and free design services from Panda Patches.`;
  const imageUrl = product.heroImage
    ? urlFor(product.heroImage).width(1200).height(630).fit('crop').format('jpg').quality(80).url()
    : 'https://pandapatches.com/assets/og-image.png';

  return {
    title: `${product.title} | Panda Patches`,
    description: description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: description.substring(0, 160),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${product.title} | Panda Patches` }],
      type: 'website',
      url: `https://pandapatches.com/custom-patches/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: description.substring(0, 160),
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://pandapatches.com/custom-patches/${slug}`,
    },
  };
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  // Generate schema markup for SEO
  const pricingTiers = getSchemaPricingTiers(data.title);
  const productSchema = generateProductSchema({
    name: data.title,
    description: data.description || `High-quality ${data.title.toLowerCase()} with low minimums, fast delivery, and free design services.`,
    image: data.heroImage ? urlFor(data.heroImage).width(1200).height(630).fit('crop').format('jpg').quality(80).url() : 'https://pandapatches.com/assets/og-image.png',
    url: `https://pandapatches.com/custom-patches/${slug}`,
    priceRange: "$0.85-$6.00",
    includeReviews: true,
    pricingTiers: pricingTiers.length > 0 ? pricingTiers : undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://pandapatches.com" },
    { name: "Custom Patches", url: "https://pandapatches.com/custom-patches" },
    { name: data.title, url: `https://pandapatches.com/custom-patches/${slug}` },
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

      {/* 3. Craftsmanship + Reviews */}
      <Craftsmanship />
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

      {/* 9. GORILLA SKETCH PROCESS */}
      <ProcessSection />

      {/* 10. WORK SAMPLES */}
      <WorkSamples samples={data.workSamples} />

      {/* BULK ORDER CALLOUT — internal link to /bulk-custom-patches */}
      <section className="w-full py-10 md:py-14 bg-panda-dark">
        <div className="container mx-auto px-4 md:px-6 max-w-[800px] text-center">
          <p className="text-gray-400 text-[13px] md:text-[15px] font-medium mb-2 uppercase tracking-widest">
            Ordering 50+ pieces?
          </p>
          <h2 className="text-white text-[20px] md:text-[28px] font-black uppercase mb-5 leading-tight">
            Order in Bulk &amp; Save More
          </h2>
          <Link
            href="/bulk-custom-patches"
            className="inline-flex items-center gap-2 bg-panda-yellow text-panda-dark font-black px-8 py-3 rounded-full text-[13px] uppercase tracking-widest hover:bg-white transition-colors"
          >
            Get Bulk Pricing →
          </Link>
        </div>
      </section>

      {/* 11. HOW TO ORDER (Timeline Zig Zag) */}
      <TimelineSection />

      {/* 12. RELATED PATCH TYPES — internal linking */}
      <section className="w-full py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px] text-center">
          <p className="text-gray-500 text-[12px] font-semibold uppercase tracking-widest mb-2">Explore More</p>
          <h2 className="text-[20px] md:text-[26px] font-black uppercase text-panda-dark mb-8">
            Other Custom Patch Types
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {/* Embroidered always shows first — top seller */}
            <Link
              href="/custom-patches/embroidered"
              className="px-5 py-2.5 rounded-full border-2 border-panda-dark text-panda-dark text-[13px] font-bold uppercase tracking-wide hover:bg-panda-dark hover:text-white transition-colors"
            >
              Embroidered Patches
            </Link>
            {PATCH_TYPES.filter((p) => p.slug !== slug && p.slug !== "embroidered").map((patch) => (
              <Link
                key={patch.slug}
                href={`/custom-patches/${patch.slug}`}
                className="px-5 py-2.5 rounded-full border-2 border-panda-dark text-panda-dark text-[13px] font-bold uppercase tracking-wide hover:bg-panda-dark hover:text-white transition-colors"
              >
                {patch.name}
              </Link>
            ))}
            <Link
              href="/custom-patches"
              className="px-5 py-2.5 rounded-full bg-panda-yellow text-panda-dark text-[13px] font-bold uppercase tracking-wide hover:bg-panda-dark hover:text-panda-yellow transition-colors"
            >
              All Patch Types
            </Link>
          </div>
        </div>
      </section>

      {/* 13. SEO & FAQ */}
      <ContentSection />
      <FAQ />

      {/* 13. CTA */}
      <CTASection />
      
      <Footer />
    </main>
  );
}
