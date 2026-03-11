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

// Fire Department-specific FAQs
const fireFAQs = [
  {
    question: "What types of custom fire department patches do you make?",
    answer: "We produce all types of fire department patches: station patches, department badges, rank insignia, memorial patches, EMS patches, ladder company patches, and custom morale patches. Available in embroidered, PVC, and woven formats to match your department's specific requirements."
  },
  {
    question: "What materials are used for firefighter patches?",
    answer: "Our fire department patches are made from military-grade embroidery thread on twill or canvas backing, durable PVC rubber, or tight-woven polyester. All materials are selected for heat resistance, colorfastness, and long-term durability through repeated washing and heavy field use."
  },
  {
    question: "Can you replicate our exact department badge or insignia?",
    answer: "Yes. We specialize in precise replication of fire department badges, shields, and insignia. Send us your badge artwork, a high-resolution photo, or vector file, and our design team will create a free digital mockup for your approval before production begins."
  },
  {
    question: "What backing options work best for fire department uniforms?",
    answer: "For Class A and Class B uniforms, sew-on backing provides the most professional, permanent finish. Velcro backing is ideal for turnout gear and tactical vests where patches need to be swapped. Iron-on backing works well for casual uniform shirts and training apparel."
  },
  {
    question: "Is there a minimum order for fire department patches?",
    answer: "No minimum order required. We accommodate small station orders of 10-25 patches and large department-wide orders of 5,000+ pieces with the same professional quality. Volume pricing applies at 100+, 500+, and 1,000+ pieces."
  },
  {
    question: "Do you offer bulk pricing for department-wide orders?",
    answer: "Yes. We provide volume pricing for orders of 100+ pieces with additional discounts at 500+ and 1,000+. County-wide rollouts covering multiple stations receive bulk pricing across the entire order even when each station has a different design."
  },
  {
    question: "What is your turnaround time for fire department patches?",
    answer: "Standard production is 10-14 business days after design approval. Rush production (7 business days) is available for urgent departmental needs. All orders include a free digital mockup reviewed and approved before production starts."
  },
  {
    question: "Can you create memorial or commemorative patches for our department?",
    answer: "Absolutely. We regularly produce Line of Duty memorial patches, anniversary patches, retirement patches, and special event commemorative patches. We treat these orders with the highest level of care and priority, understanding the significance they carry for your department."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
const getFirePageData = cache(async () => {
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
});

export async function generateMetadata(): Promise<Metadata> {
  const { heroImage } = await getFirePageData();
  const ogImage = heroImage
    ? `${heroImage}?w=1200&h=630&fit=crop&auto=format`
    : 'https://www.pandapatches.com/assets/og-image.png';
  return {
    title: "Fire Department Patches - Nomex & Heat Resistant",
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
    alternates: { canonical: "https://www.pandapatches.com/custom-fire-department-patches" },
    openGraph: {
      title: "Custom Fire Department Patches | Panda Patches",
      description: "Custom fire department patches and firefighter badges. Trusted by departments nationwide. Fast turnaround, bulk pricing.",
      url: "https://www.pandapatches.com/custom-fire-department-patches",
      siteName: "Panda Patches",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Custom Fire Department Patches | Panda Patches" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Custom Fire Department Patches | Panda Patches",
      description: "Custom fire department patches and firefighter badges. Trusted by departments nationwide. Fast turnaround, bulk pricing.",
      images: [ogImage],
    },
  };
}

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
    "@type": "Offer",
    priceCurrency: "USD",
    price: "0.85",
    availability: "https://schema.org/InStock",
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
      name: "Fire Department Patches",
      item: "https://www.pandapatches.com/custom-fire-department-patches",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(generateFAQSchema(fireFAQs))}
      />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bulk Orders", href: "/bulk-custom-patches" }
        ]}
        currentPage="Fire Department Patches"
      />

      {/* 1. HERO */}
      <BulkHero
        heroImage={heroImage}
        trustBadges={trustBadges}
        customHeading="Custom Fire Department Patches"
        customSubheading="Trusted by Fire Departments Nationwide"
        customDescription="Our custom fire department and firefighter patches are crafted with durability and precision. We ensure top quality materials and detailed designs that honor the bravery of firefighters, making our patches a lasting symbol of dedication."
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

      {/* 5. FIRE DEPARTMENT FAQ */}
      <CategoryFAQ title="Fire Department Patches FAQ" faqs={fireFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Order The Best Custom Fire Department Patches In The US
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              For top notch custom fire department patches, trust a reliable fire department patch maker like us, specializing in custom designs. Whether you need a firefighter Velcro name patch or a unique fire department patch design, our products are crafted with precision and durability in mind. We ensure your patches reflect the honor and pride of your department, providing high quality materials and craftsmanship that stand up to the toughest conditions. Perfect for uniforms, gear, and more, our patches are designed to last.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Get High-Quality Firefighter Patches
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Order the best firefighter patches in the US, where excellence meets craftsmanship. Our fire department patch designs are meticulously crafted to stand out, combining durability with detailed artistry. As a leading fire department patch creator, we offer unique fire dept patch designs that capture the spirit and pride of your team. Our patches are known for their high quality materials, vibrant colors, and long lasting wear, making them the go-to choice for fire departments nationwide. Choose us for unmatched quality and service that ensures your patches make a statement.
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
