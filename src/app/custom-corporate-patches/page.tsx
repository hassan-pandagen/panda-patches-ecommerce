import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import WorkGallery from "@/components/bulk/WorkGallery";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript } from "@/lib/schemas";
import { client } from "@/lib/sanity";

// Corporate-specific FAQs
const corporateFAQs = [
  {
    question: "Can you match our exact Pantone brand colors?",
    answer: "Yes! We use Pantone color-matching to replicate your brand colors precisely across all embroidery and PVC patches. Send us your brand guidelines or Pantone codes, and we'll match them exactly."
  },
  {
    question: "Do you handle large corporate bulk orders?",
    answer: "Absolutely. We handle orders from 50 to 50,000+ pieces with volume pricing for 100+ pieces. Large corporate accounts get dedicated account management, priority pricing, and free pre-production samples for orders of 500+."
  },
  {
    question: "What file formats do you accept for company logos?",
    answer: "We accept AI, EPS, PDF, PSD, PNG, and JPG files. Vector files (AI, EPS, PDF) produce the best results. We also offer free design services if you need help optimizing your logo for patches."
  },
  {
    question: "Do you offer sample patches before the full production run?",
    answer: "Yes! For orders of 500+ pieces, we provide a free physical sample for approval before full production. This ensures colors, sizing, and quality meet your brand standards before we run the entire order."
  },
  {
    question: "What is your turnaround time for corporate orders?",
    answer: "Standard production is 2 weeks (10-14 business days). Large orders (1,000+) may take 2-3 weeks. Rush production (7 business days) is available for an additional fee."
  },
  {
    question: "Can you create patches for employee uniforms?",
    answer: "Yes! We specialize in employee uniform patches with iron-on or sew-on backing options. We can create name patches, department patches, and logo patches for any size workforce."
  },
  {
    question: "Do you work with promotional products distributors?",
    answer: "Absolutely. We work with ASI members, promotional distributors, and resellers. Contact us for special distributor rates, white-label options, and Net 30/60 payment terms."
  },
  {
    question: "What backing options are best for corporate apparel?",
    answer: "For uniforms and corporate apparel, we recommend iron-on backing (heat-seal) for easy application or sew-on backing for maximum durability. Velcro backing is also popular for removable uniform patches."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
async function getCorporatePageData() {
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
}

export const metadata: Metadata = {
  title: "Custom Corporate Patches | Company Logo Patches | Panda Patches",
  description: "Custom corporate logo patches for businesses, brands, and employee uniforms. Embroidered company patches with no minimum order, free mockup, and 7-14 day turnaround.",
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
  alternates: { canonical: "https://pandapatches.com/custom-corporate-patches" },
  openGraph: {
    title: "Custom Corporate & Company Logo Patches | Panda Patches",
    description: "Custom embroidered patches for businesses and brands. No minimum, free mockup, fast delivery. Trusted by Fortune 500 companies.",
    url: "https://pandapatches.com/custom-corporate-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Corporate Logo Patches",
  description: "Custom embroidered patches for corporate uniforms, branded merchandise, and promotional products.",
  brand: {
    "@type": "Brand",
    name: "Panda Patches",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0.85",
    highPrice: "5.50",
    offerCount: "6",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1200",
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
      name: "Custom Corporate Patches",
      item: "https://pandapatches.com/custom-corporate-patches",
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

      <Navbar />

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

      {/* 3. WHY CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 4. OUR PROCESS */}
      <ProcessSection />

      {/* 5. CORPORATE FAQ */}
      <CategoryFAQ title="Corporate Patches FAQ" faqs={corporateFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-16 md:py-20 bg-white">
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
