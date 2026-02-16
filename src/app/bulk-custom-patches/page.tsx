import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import BulkPricingTable from "@/components/bulk/BulkPricingTable";
import BulkCaseStudies from "@/components/bulk/BulkCaseStudies";
import BulkFAQ from "@/components/bulk/BulkFAQ";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript } from "@/lib/schemas";
import { client } from "@/lib/sanity";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch work samples for all patch categories
async function getWorkSamples() {
  try {
    const query = `{
      "Embroidered": *[_type == "productPage" && slug.current == "embroidered"][0].workSamples,
      "PVC": *[_type == "productPage" && slug.current == "pvc"][0].workSamples,
      "Woven": *[_type == "productPage" && slug.current == "woven"][0].workSamples,
      "Chenille": *[_type == "productPage" && slug.current == "chenille"][0].workSamples,
      "Leather": *[_type == "productPage" && slug.current == "leather"][0].workSamples
    }`;
    const data = await client.fetch(query);
    return data || {};
  } catch (error) {
    console.error("Bulk work samples fetch error:", error);
    return {};
  }
}

// SEO Metadata
export const metadata: Metadata = {
  title: "Custom Patches in Bulk | Volume Pricing from 50-50,000+ Pieces | Panda Patches",
  description:
    "Order custom patches in bulk — embroidered, PVC, woven, chenille, leather. Volume pricing from 50 to 50,000+ pieces. Free mockups, 2-week turnaround, no setup fees. Trusted by brands, fire departments, and Fortune 500 companies.",
  keywords: [
    "custom patches bulk order",
    "wholesale custom patches",
    "bulk custom patches",
    "custom patches manufacturer",
    "bulk embroidered patches",
    "custom patches for businesses",
    "wholesale embroidered patches",
    "bulk iron on patches",
    "custom patches large order",
    "promotional products patches",
    "bulk PVC patches",
    "wholesale woven patches",
    "bulk fire department patches",
    "corporate patches bulk",
  ],
  alternates: {
    canonical: "https://pandapatches.com/bulk-custom-patches",
  },
  openGraph: {
    title: "Custom Patches in Bulk | Volume Pricing | Panda Patches",
    description:
      "Order custom patches in bulk from 50 to 50,000+ pieces. Embroidered, PVC, woven, leather. Free mockups, 2-week turnaround.",
    url: "https://pandapatches.com/bulk-custom-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

// Product schema for bulk pricing
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches Bulk Order",
  description:
    "Custom patches in bulk — embroidered, PVC, woven, chenille, leather. Volume pricing from 50 to 50,000+ pieces.",
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
      name: "Bulk Custom Patches",
      item: "https://pandapatches.com/bulk-custom-patches",
    },
  ],
};

export default async function BulkCustomPatchesPage() {
  const workSamples = await getWorkSamples();

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
      <BulkHero />

      {/* 2. BULK PRICING TABLE */}
      <BulkPricingTable workSamples={workSamples} />

      {/* 4. HOW BULK ORDERING WORKS (4-Step Process) */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-10 md:mb-14">
            How Bulk Ordering Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                step: "01",
                title: "Submit Your Design",
                desc: "Send your artwork, logo, or sketch. We accept any format. 50–50,000 pieces accepted.",
              },
              {
                step: "02",
                title: "Free Digital Mockup",
                desc: "We create a professional mockup within 24 hours. Unlimited free revisions until you love it.",
              },
              {
                step: "03",
                title: "Sample Approval",
                desc: "For orders 500+, get a free physical sample. Verify quality, color, and sizing before full production.",
              },
              {
                step: "04",
                title: "Production & Delivery",
                desc: "Standard 2-week production. Rush 7-day option available. Full tracking from factory to your door.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-14 h-14 bg-panda-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-panda-yellow font-black text-[18px]">{item.step}</span>
                </div>
                <h3 className="text-[15px] md:text-[17px] font-bold text-panda-dark mb-2">{item.title}</h3>
                <p className="text-[13px] text-gray-500 leading-[1.6] max-w-[220px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CASE STUDIES */}
      <BulkCaseStudies />

      {/* 6. WHY BRANDS CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 7. OUR PROCESS */}
      <ProcessSection />

      {/* 8. BULK QUOTE FORM — Now in Hero section */}

      {/* 9. BULK FAQ */}
      <BulkFAQ />

      {/* 10. SEO CONTENT */}
      <section className="w-full py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Custom Patches in Bulk — Your Complete Guide
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Looking to order <strong>custom patches in bulk</strong>? Panda Patches is the trusted choice for brands,
              organizations, sports teams, and businesses that need high-quality patches at volume pricing. Whether
              you need <strong>50 embroidered patches</strong> for your team or <strong>50,000 PVC patches</strong> for
              a national rollout, we deliver consistent quality with every order.
            </p>
            <p>
              Our <strong>bulk custom patches</strong> come in every style: embroidered, PVC, woven, chenille, and
              leather. Each patch goes through our 5-point quality inspection process, ensuring perfect stitching,
              accurate colors, and durable backing. That&apos;s why fire departments, police departments, Fortune 500
              companies, and sports leagues trust us for their <strong>wholesale patch orders</strong>.
            </p>
            <p>
              With <strong>no setup fees</strong>, <strong>free design mockups</strong>, and a standard{" "}
              <strong>2-week turnaround</strong>, ordering patches in bulk has never been easier. We offer transparent
              volume pricing — the more you order, the more you save. Plus, returning customers enjoy priority pricing
              and a dedicated account manager.
            </p>
            <p>
              Ready to get started? <a href="#bulk-quote" className="text-panda-green font-bold underline">Get your free bulk quote</a> today.
              We respond to all inquiries within 2 business hours and include a complimentary digital mockup with
              every quote.
            </p>
          </div>
        </div>
      </section>

      {/* 11. CTA */}
      <CTASection />

      <Footer />
    </main>
  );
}
