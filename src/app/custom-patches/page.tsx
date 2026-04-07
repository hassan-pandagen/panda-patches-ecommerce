import type { Metadata } from "next";
import dynamic from "next/dynamic";
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
import IndustrySection from "@/components/home/IndustrySection";
import FAQ from "@/components/home/FAQ";
import ContentSection from "@/components/home/ContentSection";
import TrustStrip from "@/components/products/TrustStrip";
import CTASection from "@/components/home/CTASection";

// ssr:false for heavy client components with Swiper/carousels to avoid hydration mismatch
const Craftsmanship = dynamic(() => import("@/components/home/Craftsmanship"), { ssr: true });
const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection"), { ssr: true });
const ProcessSection = dynamic(() => import("@/components/home/ProcessSection"), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getSanityOgImage();
  return {
    title: "Custom Patches | All Types from $0.71/pc | Free Design | Panda Patches",
    description: "Order custom patches in any style: embroidered, PVC, woven, chenille & leather. As low as 5 patches. Free artwork & mockup in 24hrs. Ships in 7-14 days. Trusted by 10,000+ brands. Get a free quote!",
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
      canonical: "https://pandapatches.com/custom-patches",
    },
    openGraph: {
      title: "Custom Patches - All Types | Panda Patches",
      description: "Browse all custom patch types with low minimums and fast delivery. Embroidered, PVC, woven, chenille, and leather patches available.",
      url: "https://pandapatches.com/custom-patches",
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
  image: "https://www.pandapatches.com/assets/og-image.png",
  brand: {
    "@type": "Brand",
    name: "Panda Patches",
  },
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0.85",
    highPrice: "6.00",
    offerCount: "6",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2027-01-01",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 10, maxValue: 14, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "DAY" },
      },
    },
    offers: [
      { "@type": "Offer", name: "Embroidered Patches", price: "0.85", priceCurrency: "USD", availability: "https://schema.org/InStock", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "PVC Patches", price: "1.20", priceCurrency: "USD", availability: "https://schema.org/InStock", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "Woven Patches", price: "0.95", priceCurrency: "USD", availability: "https://schema.org/InStock", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "Chenille Patches", price: "2.50", priceCurrency: "USD", availability: "https://schema.org/InStock", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "Leather Patches", price: "3.00", priceCurrency: "USD", availability: "https://schema.org/InStock", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "Sequin Patches", price: "6.00", priceCurrency: "USD", availability: "https://schema.org/InStock", priceValidUntil: "2027-01-01" },
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
      item: "https://pandapatches.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Custom Patches",
      item: "https://pandapatches.com/custom-patches",
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
  try {
    const query = `*[_type == "productPage" && slug.current == "custom-patches"][0]`;
    const data = await client.fetch(query);
    return data;
  } catch {
    return null;
  }
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

      {/* 9. EXPANDED SEO CONTENT — custom patches guide */}
      <section className="w-full py-12 md:py-16 bg-[#F9FAF5] border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-[860px]">

          <div className="w-10 h-1 bg-panda-yellow mb-8 rounded-full" />

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            5 Types of Custom Patches: Which Is Right for You?
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Not every patch is made the same way. The right type depends on your design, application, and budget. Here is a quick breakdown of all five custom patch types we produce.
          </p>
          <ul className="space-y-4 mb-8 text-[17px] leading-[1.8] text-gray-600">
            <li><strong className="text-panda-dark">Embroidered patches</strong> are the most popular choice. Thread is stitched directly onto a twill backing, creating a textured, premium look. Best for logos, text, and bold designs with solid colors. Starting from $0.71/pc at volume.</li>
            <li><strong className="text-panda-dark">Woven patches</strong> use thinner thread for a flatter, more detailed result. Ideal when your design has fine lines, small text, or gradient shading that embroidery cannot replicate cleanly.</li>
            <li><strong className="text-panda-dark">PVC patches</strong> are made from soft rubber and are fully waterproof. The best option for tactical gear, outdoor equipment, bags, and anything exposed to weather or heavy wear.</li>
            <li><strong className="text-panda-dark">Chenille patches</strong> deliver the classic varsity look. A raised, fuzzy pile surface with a felt backing. Standard for letterman jackets, sports teams, and award patches.</li>
            <li><strong className="text-panda-dark">Leather patches</strong> give a premium, heritage finish. Laser-engraved or debossed. Popular for denim jackets, hats, bags, and brand merchandise that needs to stand out.</li>
          </ul>

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            Backing Options: Iron-On, Sew-On, Velcro, and More
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Every custom patch can be made with your choice of backing. The backing determines how the patch attaches to fabric or gear.
          </p>
          <ul className="space-y-3 mb-8 text-[17px] leading-[1.8] text-gray-600">
            <li><strong className="text-panda-dark">Iron-on (heat seal):</strong> A thermoplastic adhesive backing that bonds to fabric with a household iron or heat press. Quick to apply, permanent, and included free on all orders.</li>
            <li><strong className="text-panda-dark">Sew-on:</strong> No adhesive. The patch is stitched directly onto fabric for the most secure, long-lasting attachment. Required for performance wear and technical fabrics.</li>
            <li><strong className="text-panda-dark">Velcro (hook and loop):</strong> Both hook and loop sides included. Allows the patch to be removed and repositioned. Standard for military, law enforcement, and tactical vests. Velcro backing adds $30 to any order.</li>
            <li><strong className="text-panda-dark">Sticker (self-adhesive):</strong> Peel-and-stick for temporary applications, helmets, notebooks, and promotional use.</li>
          </ul>

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            Who Orders Custom Patches?
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Custom patches serve a wide range of industries and communities. Our customers include:
          </p>
          <ul className="space-y-3 mb-8 text-[17px] leading-[1.8] text-gray-600">
            <li><strong className="text-panda-dark">Sports teams and leagues</strong> ordering jersey patches, championship patches, and award patches for players, coaches, and staff.</li>
            <li><strong className="text-panda-dark">Businesses and brands</strong> using logo patches on uniforms, merchandise, corporate gifts, and promotional items.</li>
            <li><strong className="text-panda-dark">Military and law enforcement</strong> ordering morale patches, unit identification patches, and tactical Velcro patches for vests and bags.</li>
            <li><strong className="text-panda-dark">Schools and universities</strong> commissioning chenille varsity patches, club patches, and spirit wear embellishments.</li>
            <li><strong className="text-panda-dark">Motorcycle clubs and organizations</strong> creating MC back patches, center patches, and rocker patches for vests and jackets.</li>
            <li><strong className="text-panda-dark">Streetwear and fashion brands</strong> adding woven labels, leather patches, and PVC badges to caps, hoodies, and bags.</li>
            <li><strong className="text-panda-dark">Scouts and youth groups</strong> ordering merit badge-style patches and event commemoratives for uniforms and sashes.</li>
          </ul>

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            How to Order Custom Patches: 4 Simple Steps
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Ordering custom patches from Panda Patches takes minutes. Here is what the process looks like from quote to delivery:
          </p>
          <ol className="space-y-3 mb-8 text-[17px] leading-[1.8] text-gray-600 list-decimal list-inside">
            <li><strong className="text-panda-dark">Submit your quote.</strong> Upload your artwork or describe your idea using our quote form. Include patch type, size, quantity, and backing preference.</li>
            <li><strong className="text-panda-dark">Receive your free mockup within 24 hours.</strong> Our design team creates a digital proof showing exactly what your patch will look like. Review it and request any changes, free of charge.</li>
            <li><strong className="text-panda-dark">Approve and pay.</strong> Once you are happy with the mockup, confirm your order. Production begins immediately after approval.</li>
            <li><strong className="text-panda-dark">Receive your patches in 7-14 days.</strong> Standard production ships in 7-14 business days. Rush production is available if you need them sooner.</li>
          </ol>

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            Custom Patch Pricing: What to Expect
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Patch pricing depends on three main factors: patch type, size, and quantity. The more you order, the lower the per-piece cost. Here is a general pricing guide for embroidered patches under 4 inches:
          </p>
          <ul className="space-y-2 mb-6 text-[17px] leading-[1.8] text-gray-600">
            <li><strong className="text-panda-dark">50 pieces:</strong> $180 total ($3.60/pc)</li>
            <li><strong className="text-panda-dark">100 pieces:</strong> $240 total ($2.40/pc)</li>
            <li><strong className="text-panda-dark">500 pieces:</strong> $750 total ($1.50/pc)</li>
            <li><strong className="text-panda-dark">1,000 pieces:</strong> $1,200 total ($1.20/pc)</li>
          </ul>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            PVC, chenille, and leather patches carry slightly higher base prices due to materials and production complexity. Woven patches are comparable to embroidered. All prices include free shipping within the US and a free digital mockup. There are no setup fees and no hidden charges.
          </p>
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Need a precise quote? Use our free quote form above, upload your design, and receive a detailed price breakdown within 24 hours.
          </p>

        </div>
      </section>

      {/* 10. REELS & CTA */}
      <CTASection />
      
      <Footer />
    </main>
  );
}
