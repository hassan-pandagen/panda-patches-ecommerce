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

// Police-specific FAQs
const policeFAQs = [
  {
    question: "What types of law enforcement patches do you make?",
    answer: "We create all types of law enforcement patches: department badges, sheriff patches, tactical patches, K-9 unit patches, SWAT patches, detective badges, security patches, and custom morale patches for police departments."
  },
  {
    question: "Can you replicate our department badge exactly?",
    answer: "Yes! We specialize in precise replication of department badges, shields, and insignia. Send us your badge artwork or photo, and we'll create an exact embroidered or PVC reproduction with meticulous attention to detail."
  },
  {
    question: "Are your patches durable enough for law enforcement use?",
    answer: "Absolutely. Our patches are built for daily law enforcement wear. We use military-grade thread, professional twill backing, and reinforced stitching to withstand constant use, washing, and the demands of police work."
  },
  {
    question: "Do you offer bulk pricing for entire departments?",
    answer: "Yes! We provide volume pricing for department orders starting at 100+ pieces. Large departments (500+ pieces) receive dedicated account management, free pre-production samples, and priority pricing."
  },
  {
    question: "What backing options work best for police uniforms?",
    answer: "For law enforcement uniforms, we recommend sew-on backing for maximum durability and professional appearance. Velcro backing is popular for tactical vests and removable duty patches."
  },
  {
    question: "Can you create tactical patches for special units?",
    answer: "Absolutely. We specialize in custom tactical patches for SWAT, K-9, narcotics, detective units, and special operations teams. PVC patches are especially popular for tactical gear due to their durability and weather resistance."
  },
  {
    question: "What is your turnaround time for department orders?",
    answer: "Standard production is 2 weeks (10-14 business days). For urgent departmental needs, rush production (7 business days) is available. We understand the importance of timely delivery for law enforcement."
  },
  {
    question: "Do you work with multiple departments or county-wide orders?",
    answer: "Yes! We frequently handle county-wide orders covering multiple departments, sheriff's offices, and municipalities. Volume pricing applies across all departments in the order, even with different designs."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
async function getPolicePageData() {
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
}

export const metadata: Metadata = {
  title: "Custom Police Patches | Law Enforcement Patches | Panda Patches",
  description: "Custom police department patches, sheriff badges, law enforcement patches, and tactical patches. Embroidered, PVC, and woven formats. Trusted by departments nationwide.",
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
  alternates: { canonical: "https://pandapatches.com/custom-police-patches" },
  openGraph: {
    title: "Custom Police & Law Enforcement Patches | Panda Patches",
    description: "Custom police department patches and law enforcement badges. Trusted by departments nationwide. Fast turnaround, bulk pricing.",
    url: "https://pandapatches.com/custom-police-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Police Department Patches",
  description: "Custom police and law enforcement patches for departments, sheriffs, and tactical units.",
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
      name: "Custom Police Patches",
      item: "https://pandapatches.com/custom-police-patches",
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

      <Navbar />

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

      {/* 3. WHY CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 4. OUR PROCESS */}
      <ProcessSection />

      {/* 5. POLICE FAQ */}
      <CategoryFAQ title="Law Enforcement Patches FAQ" faqs={policeFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-16 md:py-20 bg-white">
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
