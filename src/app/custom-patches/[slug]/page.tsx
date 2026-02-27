import { client, urlFor } from "@/lib/sanity";
import { Metadata } from "next";
import dynamic from 'next/dynamic';
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { generateProductSchema, generateBreadcrumbSchema, generateSchemaScript } from "@/lib/schemas";

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
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductData(params.slug);

  if (!product) {
    return { title: '404 - Product Not Found | Panda Patches' };
  }

  const description = product.description || `High-quality ${product.title.toLowerCase()} with low minimums, fast delivery, and free design services from Panda Patches.`;
  const imageUrl = product.heroImage ? urlFor(product.heroImage).url() : 'https://pandapatches.com/assets/logo-panda.svg';

  return {
    title: `${product.title} | Panda Patches`,
    description: description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: description.substring(0, 160),
      images: [{ url: imageUrl }],
      type: 'website',
      url: `https://pandapatches.com/custom-patches/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: description.substring(0, 160),
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://pandapatches.com/custom-patches/${params.slug}`,
    },
  };
}

export default async function DynamicProductPage({ params }: { params: { slug: string } }) {
  const data = await getProductData(params.slug);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  // Generate schema markup for SEO
  const productSchema = generateProductSchema({
    name: data.title,
    description: data.description || `High-quality ${data.title.toLowerCase()} with low minimums, fast delivery, and free design services.`,
    image: data.heroImage ? urlFor(data.heroImage).url() : 'https://pandapatches.com/assets/logo-panda.svg',
    url: `https://pandapatches.com/custom-patches/${params.slug}`,
    priceRange: "$50-$500", // Typical price range for custom patches
    includeReviews: true, // Include Trustpilot 4.9 rating
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://pandapatches.com" },
    { name: "Custom Patches", url: "https://pandapatches.com/custom-patches" },
    { name: data.title, url: `https://pandapatches.com/custom-patches/${params.slug}` },
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

      {/* 3. PANDA PROMISE */}
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

      {/* 11. HOW TO ORDER (Timeline Zig Zag) */}
      <TimelineSection />

      {/* 12. SEO & FAQ */}
      <ContentSection />
      <FAQ />

      {/* 13. CTA */}
      <CTASection />
      
      <Footer />
    </main>
  );
}
