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

// Fire Department-specific FAQs
const fireFAQs = [
  {
    question: "What types of fire department patches do you make?",
    answer: "We create all types of fire department patches: station patches, firefighter badges, Maltese cross patches, EMS patches, rescue squad patches, volunteer fire department patches, and custom fire service patches. Available in embroidered, PVC, and Nomex formats."
  },
  {
    question: "Do you offer heat-resistant patches for turnout gear?",
    answer: "Yes! We offer Nomex and heat-resistant patches specifically designed for turnout gear and firefighting equipment. These patches withstand extreme temperatures and meet fire service standards for safety equipment."
  },
  {
    question: "Can you replicate our fire department badge exactly?",
    answer: "Absolutely! We specialize in precise replication of fire department badges, Maltese crosses, and station insignia. Send us your badge artwork or photo, and we'll create an exact embroidered or PVC reproduction with meticulous detail."
  },
  {
    question: "Are your patches durable enough for firefighting gear?",
    answer: "Yes. Our patches are built for the demanding conditions of firefighting and emergency response. We use military-grade thread, professional backing, and reinforced stitching. For turnout gear, we offer Nomex patches rated for extreme heat."
  },
  {
    question: "Do you offer bulk pricing for entire fire departments?",
    answer: "Absolutely! We provide volume pricing for department orders starting at 100+ pieces. Large departments (500+ pieces) receive dedicated account management, free pre-production samples, and priority pricing."
  },
  {
    question: "Can you create patches for volunteer fire departments?",
    answer: "Yes! We work with volunteer fire departments, career departments, and combination departments. No minimum order required — perfect for small volunteer stations to large city fire departments."
  },
  {
    question: "What backing options work best for fire service uniforms?",
    answer: "For fire service uniforms and Class A dress uniforms, we recommend sew-on backing for professional appearance and durability. For turnout gear, Nomex heat-resistant backing is essential. Velcro backing works well for removable duty patches."
  },
  {
    question: "What is your turnaround time for fire department orders?",
    answer: "Standard production is 2 weeks (10-14 business days). For urgent departmental needs or memorial patches, rush production (7 business days) is available. We understand the importance of timely delivery for fire service."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
async function getFirePageData() {
  try {
    const query = `{
      "categoryData": *[_type == "categoryPage" && slug.current == "custom-fire-department-patches"][0] {
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
    console.error("Fire page data fetch error:", error);
    return { heroImage: null, workSamples: [], trustBadges: [], seoHeading: null, seoContent: null };
  }
}

export const metadata: Metadata = {
  title: "Custom Fire Department Patches | Firefighter Patches | Panda Patches",
  description: "Custom fire department patches, firefighter badges, and station patches. Embroidered, PVC, and Nomex options. Trusted by fire departments nationwide. Volume pricing available.",
  keywords: [
    "custom fire department patches",
    "firefighter patches",
    "fire station patches",
    "custom fire badges",
    "embroidered fire patches",
    "firefighter uniform patches",
    "custom EMS patches",
    "fire department badges",
    "nomex fire patches",
  ],
  alternates: { canonical: "https://pandapatches.com/custom-fire-department-patches" },
  openGraph: {
    title: "Custom Fire Department Patches | Panda Patches",
    description: "Custom fire department patches and firefighter badges. Trusted by departments nationwide. Fast turnaround, bulk pricing.",
    url: "https://pandapatches.com/custom-fire-department-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Fire Department Patches",
  description: "Custom fire department patches, firefighter badges, and station patches for departments nationwide.",
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
      name: "Custom Fire Department Patches",
      item: "https://pandapatches.com/custom-fire-department-patches",
    },
  ],
};

export default async function FireDepartmentPatchesPage() {
  const { workSamples, heroImage, trustBadges, seoHeading, seoContent } = await getFirePageData();

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
        customHeading="Custom Fire Department Patches"
        customSubheading="Trusted by Fire Departments Nationwide"
        customDescription="Professional fire department patches, firefighter badges, and station patches. Embroidered, PVC, and Nomex options. Heat-resistant materials available. Volume pricing for departments. 2-week turnaround."
      />

      {/* 2. WORK GALLERY */}
      <WorkGallery samples={workSamples} />

      {/* 3. WHY CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 4. OUR PROCESS */}
      <ProcessSection />

      {/* 5. FIRE DEPARTMENT FAQ */}
      <CategoryFAQ title="Fire Department Patches FAQ" faqs={fireFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Custom Fire Department Patches — Professional Firefighter Patches
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Looking for <strong>custom fire department patches</strong> for your station? Panda Patches is the trusted choice for fire departments nationwide that need professional, durable patches for uniforms, turnout gear, and station use.
            </p>
            <p>
              We produce <strong>custom firefighter patches</strong> for fire stations, EMS departments, volunteer fire departments, and rescue squads. From <strong>embroidered department badges</strong> and <strong>Nomex heat-resistant patches</strong> to <strong>PVC Maltese cross patches</strong>, every patch is built to withstand the demanding conditions of firefighting and emergency response.
            </p>
            <p>
              Whether you need <strong>50 patches for a volunteer station</strong> or <strong>5,000 patches for a city-wide department</strong>, we handle orders of all sizes with the same professional standards. With <strong>volume pricing</strong>, <strong>free design mockups</strong>, and a reliable <strong>2-week turnaround</strong>, equipping your department with quality patches has never been easier.
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
