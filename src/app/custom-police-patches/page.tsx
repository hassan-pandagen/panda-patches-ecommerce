import type { Metadata } from "next";
import { cache } from 'react';
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
import { generateSchemaScript, generateFAQSchema } from "@/lib/schemas";
import { client } from "@/lib/sanity";

// Police-specific FAQs
const policeFAQs = [
  {
    question: "Can you replicate our exact department badge or insignia?",
    answer: "Yes. Send us your badge artwork, a high-resolution photo, or your department's vector file. Our design team reproduces shields, eagles, stars, and fine text with precision — including small badge numbers and department names legible at 2-3 inches. You approve a free digital mockup before a single stitch runs, with unlimited revisions until it matches your official badge exactly."
  },
  {
    question: "What backing is best for police uniforms vs. tactical vests?",
    answer: "Sew-on for Class A dress uniforms and duty shirts — permanent, clean finish, survives daily washing. Velcro hook-and-loop for tactical vests, plate carriers, and SWAT gear where patches need to swap between assignments. We use stitched Velcro (not glued), rated for thousands of cycles. Iron-on is not appropriate for law enforcement uniform applications."
  },
  {
    question: "Do you make subdued patches for SWAT or tactical units?",
    answer: "Yes. We produce subdued patches in OD green, coyote tan, and black-on-black for low-visibility tactical use. PVC is the preferred format for SWAT and K-9 handlers — waterproof, UV-resistant, and holds fine detail at small sizes better than embroidery. Specify subdued or PVC in your order and we confirm the thread palette before production."
  },
  {
    question: "Can we order small quantities for a K-9 team or special unit?",
    answer: "Yes, no minimum required. K-9 units of 4-6 handlers, SWAT teams, detective divisions, and small specialized units regularly order 10-25 patches from us. Per-piece pricing improves at 50+, 100+, and 500+, but small unit orders at any quantity are completely normal for us."
  },
  {
    question: "How fast can you produce memorial patches for a fallen officer?",
    answer: "Rush production is available for memorial patches and we treat them as our highest priority. Send us the officer's name, badge number, department, and any design references and we start the mockup immediately. Rush fulfills in 4-7 business days. We understand the timeline around a memorial service and give these orders full priority."
  },
  {
    question: "Can you match our existing patches for a reorder?",
    answer: "Yes. Provide a sample of your existing patch or your previous order reference and we match thread colors to the same production palette. Color consistency across reorders is critical when new patches sit next to existing ones on the same uniform, and we archive your color specs for 12 months after each order."
  },
  {
    question: "Do you handle county-wide orders with different designs per unit?",
    answer: "Yes. County-wide orders covering multiple departments, sheriff offices, and municipalities are common. Volume pricing applies to the total order quantity across all designs, not per design. Each unit's artwork is reviewed and approved independently before production begins."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
const getPolicePageData = cache(async () => {
  try {
    const query = `{
      "categoryData": *[_type == "categoryPage" && slug.current == "custom-police-patches"][0] {
        "heroImage": {
          "url": heroImage.asset->url,
          "alt": heroImage.alt
        },
        "workSamples": workSamples[]{
          "image": @,
          "alt": alt
        },
        seoHeading,
        seoContent
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
      heroImage: data?.categoryData?.heroImage?.url || null,
      workSamples: data?.categoryData?.workSamples || [],
      trustBadges: data?.hero?.trustBadges || [],
      seoHeading: data?.categoryData?.seoHeading || null,
      seoContent: data?.categoryData?.seoContent || null,
    };
  } catch (error) {
    console.error("Police page data fetch error:", error);
    return { heroImage: null, workSamples: [], trustBadges: [], seoHeading: null, seoContent: null };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const { heroImage } = await getPolicePageData();
  const ogImage = heroImage
    ? `${heroImage}?w=1200&h=630&fit=crop&auto=format`
    : 'https://www.pandapatches.com/assets/og-image.png';
  return {
    title: "Custom Police Patches | Department, Tactical & Memorial | Panda Patches",
    description: "Custom police department patches with badge replication, subdued tactical, PVC, K-9, SWAT, and memorial rush. No minimum. Free mockup in 24 hours. 4.8 stars on Trustpilot.",
    keywords: [
      "custom police patches",
      "law enforcement patches",
      "police department patches",
      "sheriff patches",
      "tactical patches",
      "custom police badges",
      "embroidered police patches",
      "police uniform patches",
      "custom law enforcement badges",
    ],
    alternates: { canonical: "https://www.pandapatches.com/custom-police-patches" },
    openGraph: {
      title: "Custom Police & Law Enforcement Patches | Panda Patches",
      description: "Custom police department patches and law enforcement badges. Trusted by departments nationwide. Fast turnaround, bulk pricing.",
      url: "https://www.pandapatches.com/custom-police-patches",
      siteName: "Panda Patches",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Custom Police & Law Enforcement Patches | Panda Patches" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Custom Police & Law Enforcement Patches | Panda Patches",
      description: "Custom police department patches and law enforcement badges. Trusted by departments nationwide. Fast turnaround, bulk pricing.",
      images: [ogImage],
    },
  };
}

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Police Department Patches",
  description: "Custom police and law enforcement patches for departments, sheriffs, and tactical units.",
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
    highPrice: "4.50",
    offerCount: "3",
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
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "57",
    bestRating: "5",
  },
};

// Breadcrumb schema (3-level matching visual breadcrumb)
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
      name: "Bulk Orders",
      item: "https://www.pandapatches.com/bulk-custom-patches",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Police & Law Enforcement Patches",
      item: "https://www.pandapatches.com/custom-police-patches",
    },
  ],
};

export default async function PolicePatchesPage() {
  const { workSamples, heroImage, trustBadges, seoHeading, seoContent } = await getPolicePageData();

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
        dangerouslySetInnerHTML={generateSchemaScript(generateFAQSchema(policeFAQs))}
      />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bulk Orders", href: "/bulk-custom-patches" }
        ]}
        currentPage="Police & Law Enforcement Patches"
      />

      {/* 1. HERO */}
      <BulkHero
        heroImage={heroImage}
        trustBadges={trustBadges}
        customHeading="Custom Police Patches"
        customSubheading="Trusted by Law Enforcement Nationwide"
        customDescription="Professional police department patches, sheriff badges, and tactical patches. Embroidered, PVC, and woven formats. Trusted by departments for quality and durability. Volume pricing available. 2-week turnaround."
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

      {/* 5. POLICE FAQ */}
      <CategoryFAQ title="Law Enforcement Patches FAQ" faqs={policeFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Custom Police Patches — Professional Law Enforcement Patches
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Looking for <strong>custom police patches</strong> for your department? Panda Patches is the trusted choice for law enforcement agencies nationwide that need professional, durable patches for uniforms, tactical gear, and departmental use.
            </p>
            <p>
              We produce <strong>custom law enforcement patches</strong> for police departments, sheriff&apos;s offices, tactical units, K-9 units, SWAT teams, and security departments. From <strong>embroidered department badges</strong> and <strong>PVC tactical patches</strong> to <strong>woven name patches</strong>, every patch is built to withstand the demands of daily law enforcement work.
            </p>
            <p>
              Whether you need <strong>50 patches for a small department</strong> or <strong>5,000 patches for a county-wide rollout</strong>, we handle orders of all sizes with the same professional standards. With <strong>volume pricing</strong>, <strong>free design mockups</strong>, and a reliable <strong>2-week turnaround</strong>, equipping your department with quality patches has never been easier.
            </p>
            <p>
              Ready to get started? <a href="#bulk-quote" className="text-panda-green font-bold underline">Get your free quote</a> today. We respond to all inquiries within 2 business hours and work directly with your department specifications.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <CTASection />

      <Footer />
    </main>
  );
}
