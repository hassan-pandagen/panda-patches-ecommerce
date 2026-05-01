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

// Corporate-specific FAQs
const corporateFAQs = [
  {
    question: "Can you Pantone match our exact brand colors?",
    answer: "Yes. We use Pantone thread matching across all embroidery and woven patch production. Provide your Pantone codes or brand guidelines and we confirm the closest available thread match before production. For orders of 500 or more pieces, we send a physical pre-production sample for color approval before the full run."
  },
  {
    question: "Do you provide physical samples before a large production run?",
    answer: "Yes, for orders of 500 or more pieces we produce a physical pre-production sample at no charge. Production does not begin until you approve the sample. For smaller orders, a free digital mockup is provided within 24 hours with unlimited revisions before anything is made."
  },
  {
    question: "Can you handle variable patches where each has a different name or location?",
    answer: "Yes. We support variable name, location, and department patches within a single order. Submit your data as a spreadsheet with each variation and we quote based on total quantity. This is common for franchise uniforms, hotel staff name patches, and employee onboarding programs with multiple locations."
  },
  {
    question: "Do you work with ASI promotional distributors and resellers?",
    answer: "Yes. We work with ASI members, PPAI distributors, and independent promotional product resellers. We offer wholesale pricing, blind shipping with your branding, and white-label invoicing. Email lance@pandapatches.com for distributor terms and pricing."
  },
  {
    question: "What file format works best for our company logo?",
    answer: "Vector files — AI, EPS, or PDF with fonts outlined — produce the cleanest embroidery for complex logos with fine detail, gradients, or small text. If you only have a high-resolution PNG or JPG, our digitizing team will optimize it at no charge and show you a stitch preview for approval before production."
  },
  {
    question: "Can you issue a formal invoice and accept a purchase order?",
    answer: "Yes. We issue formal invoices with PO number reference and accommodate Net-15 and Net-30 payment terms for established corporate accounts. We also accept ACH bank transfer, Visa, Mastercard, Amex, and PayPal. Email lance@pandapatches.com with your procurement requirements before ordering."
  },
  {
    question: "How do you ensure color consistency when we reorder months later?",
    answer: "We archive your digitized artwork file and document your approved thread color codes after the first production run. Reorders reference the same archived file and color specs to ensure consistent output over time. This matters most for companies outfitting new employees alongside existing staff — they need to match exactly."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
const getCorporatePageData = cache(async () => {
  try {
    const query = `{
      "categoryData": *[_type == "categoryPage" && slug.current == "custom-corporate-patches"][0] {
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
    console.error("Corporate page data fetch error:", error);
    return { heroImage: null, workSamples: [], trustBadges: [], seoHeading: null, seoContent: null };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const { heroImage } = await getCorporatePageData();
  const ogImage = heroImage
    ? `${heroImage}?w=1200&h=630&fit=crop&auto=format`
    : 'https://www.pandapatches.com/assets/og-image.png';
  return {
    title: "Custom Corporate Patches | Pantone-Matched Uniform & Employee Patches",
    description: "Custom corporate uniform patches with Pantone color matching, variable name patches, ASI reseller pricing, and formal PO invoicing. Pre-production sample at 500+. Free mockup.",
    keywords: [
      "custom corporate patches",
      "company logo patches",
      "custom business patches",
      "employee uniform patches",
      "branded patches",
      "promotional patches",
      "custom logo patches",
      "corporate embroidered patches",
      "wholesale company patches",
    ],
    alternates: { canonical: "https://www.pandapatches.com/custom-corporate-patches" },
    openGraph: {
      title: "Custom Corporate & Company Logo Patches | Panda Patches",
      description: "Custom embroidered patches for businesses and brands. No minimum, free mockup, fast delivery. Trusted by Fortune 500 companies.",
      url: "https://www.pandapatches.com/custom-corporate-patches",
      siteName: "Panda Patches",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Custom Corporate & Company Logo Patches | Panda Patches" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Custom Corporate & Company Logo Patches | Panda Patches",
      description: "Custom embroidered patches for businesses and brands. No minimum, free mockup, fast delivery. Trusted by Fortune 500 companies.",
      images: [ogImage],
    },
  };
}

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Corporate Logo Patches",
  description: "Custom embroidered patches for corporate uniforms, branded merchandise, and promotional products.",
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
      name: "Corporate & Business Patches",
      item: "https://www.pandapatches.com/custom-corporate-patches",
    },
  ],
};

export default async function CorporatePatchesPage() {
  const { workSamples, heroImage, trustBadges, seoHeading, seoContent } = await getCorporatePageData();

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
        dangerouslySetInnerHTML={generateSchemaScript(generateFAQSchema(corporateFAQs))}
      />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bulk Orders", href: "/bulk-custom-patches" }
        ]}
        currentPage="Corporate & Business Patches"
      />

      {/* 1. HERO */}
      <BulkHero
        heroImage={heroImage}
        trustBadges={trustBadges}
        customHeading="Custom Corporate Patches"
        customSubheading="Trusted by Fortune 500 Companies"
        customDescription="Premium embroidered company logo patches for uniforms, branded merchandise, and promotional products. Pantone color-matching. No minimum order. Free mockup. 2-week turnaround."
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

      {/* 5. CORPORATE FAQ */}
      <CategoryFAQ title="Corporate Patches FAQ" faqs={corporateFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Custom Corporate Patches — Professional Quality for Your Brand
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Looking for <strong>custom corporate patches</strong> for your business? Panda Patches is the trusted choice for Fortune 500 companies, retail brands, and organizations that need professional logo patches for uniforms, merchandise, and promotional products.
            </p>
            <p>
              We produce <strong>custom company logo patches</strong> in every style: embroidered, PVC, woven, chenille, and leather. Our Pantone color-matching system ensures your brand colors are reproduced accurately across all patch types. Whether you need <strong>50 employee uniform patches</strong> or <strong>50,000 promotional patches</strong> for a national campaign, we deliver consistent quality with every order.
            </p>
            <p>
              Trusted by brands like Google, Coca-Cola, Microsoft, and Nissan, we understand that brand consistency is non-negotiable. That&apos;s why every <strong>custom corporate patch</strong> goes through our 5-point quality inspection process. With <strong>no setup fees</strong>, <strong>free design mockups</strong>, and a standard <strong>2-week turnaround</strong>, ordering custom patches for your business has never been easier.
            </p>
            <p>
              Ready to get started? <a href="#bulk-quote" className="text-panda-green font-bold underline">Get your free quote</a> today. We respond to all inquiries within 2 business hours and include a complimentary digital mockup with every quote.
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
