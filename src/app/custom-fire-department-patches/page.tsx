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
    question: "Can you rush memorial patches for a line-of-duty death?",
    answer: "Yes, and we treat LODD memorial patches as our absolute highest priority. Send us the firefighter's name, badge number, station, and any design references and we start your mockup within hours. Rush production fulfills in 4-7 business days. We understand what these patches mean to a department and treat every detail accordingly."
  },
  {
    question: "Do your patches survive fire station industrial washers?",
    answer: "Yes. We use 100% polyester embroidery thread, which is rated for industrial wash temperatures (160-180 degrees Fahrenheit) and repeated high-heat cycles. Rayon thread, used by cheaper suppliers, degrades and fades under those conditions. We do not use rayon. Stitched Velcro (not glued) also survives repeated gear swaps without adhesive failure."
  },
  {
    question: "What backing works for station uniforms vs. turnout gear bags?",
    answer: "Sew-on for Class A and Class B station uniforms — permanent, professional finish for dress wear. Velcro for gear bags, tactical vests, and turnout gear where patches need to be swapped or removed. Iron-on is appropriate for station t-shirts and casual training apparel, but not for active firefighting gear or structural turnout coats."
  },
  {
    question: "Can you replicate our department seal and Maltese cross exactly?",
    answer: "Yes. Fire department seals, Maltese crosses, and bugle rank insignia require precise reproduction that most general patch suppliers get wrong. Send us your official artwork, a vector file, or a high-resolution photo of your badge and our design team matches every detail. You review a free digital mockup before production starts, with unlimited revisions."
  },
  {
    question: "Do you work with IAFF local union chapter orders?",
    answer: "Yes. We work with IAFF locals for union jacket patches, event patches, chapter identification, and charity fundraiser runs. Union orders typically run 50-200 pieces and we price them competitively. We can also provide formal invoicing for union treasurers."
  },
  {
    question: "How do I order rank patches with the right number of bugles?",
    answer: "Just specify your rank in the design notes: one bugle for lieutenant, two for captain, three for battalion chief, four for deputy chief, five for fire chief. Gold vs. silver bugle color also differs by department, so include your department standard and we match it exactly in the mockup. We have produced rank patches for every rank in the fire service."
  },
  {
    question: "Can you match our existing patches for a reorder?",
    answer: "Yes. Bring a sample of your current patch or your previous order number and we reproduce thread colors from the same palette. Consistency matters when new patches sit next to existing ones on a uniform, and we archive your color specs for 12 months. Reorders typically ship within 10-14 business days."
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
    title: "Custom Fire Department Patches | Memorial, Station & Rank | Panda Patches",
    description: "Custom fire department patches that survive industrial washing. Maltese cross, rank insignia, LODD memorial rush in 72 hrs, IAFF union orders. No minimum. Free mockup.",
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
