import type { Metadata } from "next";
import { getSanityOgImage } from "@/lib/sanityOgImage";
import { client } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateSchemaScript } from "@/lib/schemas";

// COMPONENTS
import ProductHero from "@/components/product/ProductHero";
import PickPatch from "@/components/about/PickPatch";
import Promises from "@/components/home/Promises";
import CategoryZigZag from "@/components/product/CategoryZigZag";
import ProductInfoCarousel from "@/components/product/ProductInfoCarousel";
import ProcessSection from "@/components/home/ProcessSection";
import IndustrySection from "@/components/home/IndustrySection";
import FAQ from "@/components/home/FAQ";
import ContentSection from "@/components/home/ContentSection";
import TrustStrip from "@/components/products/TrustStrip";
import Craftsmanship from "@/components/home/Craftsmanship";
import ReviewsSection from "@/components/home/ReviewsSection";
import CTASection from "@/components/home/CTASection";

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getSanityOgImage();
  return {
    title: "Custom Patches - Embroidered, PVC, Woven & More | Panda Patches",
    description: "Custom embroidered, PVC, woven, chenille and leather patches. Low minimums, free design, 7-14 day delivery. No setup fees. Order from $0.71/pc.",
    keywords: [
      "custom patches",
      "embroidered patches",
      "PVC patches",
      "woven patches",
      "chenille patches",
      "leather patches",
      "iron on patches",
      "velcro patches",
      "custom patch maker",
      "patch manufacturing",
      "custom iron on patches",
      "custom embroidered patches",
      "no minimum patches",
      "bulk custom patches",
      "patch maker USA",
      "patches for jackets",
      "patches for hats",
      "custom logo patches",
      "custom name patches",
      "military patches",
      "police patches",
      "sports team patches",
      "fire department patches",
      "cheap custom patches",
      "wholesale patches",
      "patch supplier USA",
      "free design patches",
    ],
    alternates: {
      canonical: "https://www.pandapatches.com/custom-patches",
    },
    openGraph: {
      title: "Custom Patches - All Types | Panda Patches",
      description: "Browse all custom patch types with low minimums and fast delivery. Embroidered, PVC, woven, chenille, and leather patches available.",
      url: "https://www.pandapatches.com/custom-patches",
      siteName: "Panda Patches",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Panda Patches - Custom Patches" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Custom Patches - All Types | Panda Patches",
      description: "Browse all custom patch types with low minimums and fast delivery. Embroidered, PVC, woven, chenille, and leather patches.",
      images: [ogImage],
    },
  };
}

// Product schema for the main patches landing page
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches",
  description: "Custom embroidered patches, PVC patches, woven patches, chenille patches, and leather patches with low minimums, free design services, and 7-14 day delivery.",
  brand: {
    "@type": "Brand",
    name: "Panda Patches",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0.85",
    highPrice: "6.00",
    offerCount: "6",
    availability: "https://schema.org/InStock",
    offers: [
      { "@type": "Offer", name: "Embroidered Patches", price: "0.85", priceCurrency: "USD", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "PVC Patches", price: "1.20", priceCurrency: "USD", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Woven Patches", price: "0.95", priceCurrency: "USD", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Chenille Patches", price: "2.50", priceCurrency: "USD", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Leather Patches", price: "3.00", priceCurrency: "USD", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Sequin Patches", price: "6.00", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "57",
    bestRating: "5",
  },
};

// Breadcrumb schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.pandapatches.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Custom Patches",
      item: "https://www.pandapatches.com/custom-patches",
    },
  ],
};

// FAQPage schema (server-side so Google can crawl it)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of custom patches do you make?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We make embroidered patches, PVC patches, woven patches, chenille patches, and leather patches. Each type is available in any size, shape, and backing option including iron-on, sew-on, and Velcro.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a minimum order for custom patches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, there is no minimum order. We accept orders as small as 1 piece and as large as 50,000+ pieces. Bulk pricing applies for orders of 50+ pieces with additional discounts at 100+, 500+, and 1,000+.",
      },
    },
    {
      "@type": "Question",
      name: "How much do custom patches cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing starts from $0.85 per patch for large bulk orders. Small orders of 5-10 patches typically range from $3-5 each. The price depends on patch type, size, and quantity. Get a free instant quote by uploading your design.",
      },
    },
    {
      "@type": "Question",
      name: "How long does production take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard production is 10-14 business days. Rush production (7 business days) is available. All timelines begin after design approval. Shipping typically adds 3-7 business days.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer free design services?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide a free professional digital mockup for every order within 24 hours. Unlimited revisions are included at no extra charge until you are 100% satisfied with the design.",
      },
    },
    {
      "@type": "Question",
      name: "What backing options are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer iron-on (heat-seal), sew-on, Velcro (hook and loop), adhesive, and magnetic backings. The best option depends on where you plan to apply the patch and how permanent you need it to be.",
      },
    },
  ],
};

// ISR: Revalidate main patches page every 24 hours
export const revalidate = 86400;

async function getMainProductData() {
  const query = `*[_type == "productPage" && slug.current == "custom-patches"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function ProductLandingPage() {
  const data = await getMainProductData();

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <h1 className="text-2xl font-bold">Main Product Page Not Found</h1>
        <p className="text-gray-500">
          Please go to Sanity Studio and create a Product Page with slug: <strong>custom-patches</strong>
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(productSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(faqSchema)}
      />

      <Navbar />
      
      {/* 1. HERO (Quote Form Mode) */}
      <ProductHero productData={data} isMainPage={true} />
      <TrustStrip />
      <Craftsmanship />
      <ReviewsSection />

      {/* 2. PICK YOUR PATCH (5 Cards) */}
      <PickPatch />
      
      {/* 3. PROMISES */}
      <Promises bgColor="bg-white" />

      {/* 4. CATEGORY ZIG-ZAG LIST */}
      <CategoryZigZag />

      {/* 5. EDUCATION (Backing & Borders) */}
      {data.backingOptions && data.backingOptions.length > 0 && (
        <ProductInfoCarousel 
          options={data.backingOptions} 
          title="Backing Options" 
          subtitle="Select the perfect backing"
          layout="left" 
        />
      )}

      {data.borderOptions && data.borderOptions.length > 0 && (
        <ProductInfoCarousel 
          options={data.borderOptions} 
          title="Border Options" 
          subtitle="Edge finishing styles"
          layout="right" 
        />
      )}
      
      {/* 6. GORILLA PROCESS */}
      <ProcessSection />

      {/* 7. INDUSTRY USE CASES */}
      <IndustrySection />

      {/* 8. FAQ & SEO */}
      <FAQ />
      <ContentSection />

      {/* 9. REELS & CTA */}
      <CTASection />
      
      <Footer />
    </main>
  );
}
