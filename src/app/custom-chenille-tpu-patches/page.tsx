import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import WorkGallery from "@/components/bulk/WorkGallery";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript } from "@/lib/schemas";
import { client } from "@/lib/sanity";

// Chenille TPU-specific FAQs
const chenilleTpuFAQs = [
  {
    question: "What are chenille TPU patches?",
    answer: "Chenille TPU patches combine the classic soft, raised texture of chenille thread with a thermoplastic polyurethane (TPU) base. The TPU backing makes them water-resistant, flexible, and more durable than standard woven or iron-on patches, while the chenille face gives them that iconic varsity look."
  },
  {
    question: "How is TPU backing different from standard iron-on backing?",
    answer: "Standard iron-on backing uses a heat-activated glue layer that can peel over time. TPU (thermoplastic polyurethane) is a flexible rubber-like polymer fused directly to the patch. It bonds more securely, resists moisture, and stays in place through repeated washing and heavy wear."
  },
  {
    question: "Are chenille TPU patches waterproof?",
    answer: "Yes. The TPU base is water-resistant and prevents moisture from seeping through the patch backing. This makes chenille TPU patches ideal for outdoor gear, athletic uniforms, and any application where exposure to rain or sweat is expected."
  },
  {
    question: "What garments are chenille TPU patches best suited for?",
    answer: "Chenille TPU patches work great on varsity jackets, hoodies, bomber jackets, denim jackets, athletic uniforms, backpacks, and hats. The flexible TPU base conforms to curved surfaces and stretchy fabrics without cracking or delaminating."
  },
  {
    question: "Can you replicate chenille letter patches for varsity jackets?",
    answer: "Absolutely. We specialize in custom chenille letter patches in any size, color, and font. Whether you need a single letter, a full word, or a large logo patch, we can recreate it with the raised, tufted texture that varsity jackets are known for."
  },
  {
    question: "What is the minimum order for chenille TPU patches?",
    answer: "There is no strict minimum order. We work with small orders for individual use and large bulk runs for schools, teams, and brands. Volume pricing begins at 50+ pieces with additional discounts at 100+, 500+, and 1,000+ pieces."
  },
  {
    question: "How do I attach a chenille TPU patch?",
    answer: "Chenille TPU patches can be applied with heat (using a heat press or home iron), sewn on for extra security, or supplied with Velcro backing for removable attachment. Heat-press application is recommended for the strongest initial bond on flat surfaces."
  },
  {
    question: "What is your turnaround time for chenille TPU patches?",
    answer: "Standard production is 10-14 business days. Rush orders (7 business days) are available for an additional fee. We include a free digital mockup with every order before we begin production."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
async function getChenilleTpuPageData() {
  try {
    const query = `{
      "categoryData": *[_type == "categoryPage" && slug.current == "custom-chenille-tpu-patches"][0] {
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
    console.error("Chenille TPU page data fetch error:", error);
    return { heroImage: null, workSamples: [], trustBadges: [], seoHeading: null, seoContent: null };
  }
}

export const metadata: Metadata = {
  title: "Custom Chenille TPU Patches - Waterproof & Flexible",
  description: "Custom chenille TPU patches with a flexible, water-resistant thermoplastic polyurethane base. Perfect for varsity jackets, hoodies, and athletic gear. No minimum, free mockup, fast delivery.",
  keywords: [
    "custom chenille TPU patches",
    "chenille TPU patches",
    "chenille patches with TPU backing",
    "waterproof chenille patches",
    "custom chenille patches",
    "chenille letter patches",
    "varsity chenille patches",
    "chenille patches for jackets",
    "flexible chenille patches",
    "letterman jacket patches",
    "chenille iron on patches",
    "custom varsity patches",
    "chenille patches for hoodies",
    "custom letterman patches",
  ],
  alternates: { canonical: "https://pandapatches.com/custom-chenille-tpu-patches" },
  openGraph: {
    title: "Custom Chenille TPU Patches | Panda Patches",
    description: "Flexible, water-resistant chenille TPU patches for varsity jackets, hoodies, and athletic gear. No minimum, free mockup.",
    url: "https://pandapatches.com/custom-chenille-tpu-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Chenille TPU Patches",
  description: "Custom chenille patches with a flexible thermoplastic polyurethane (TPU) base. Water-resistant, durable, and perfect for varsity jackets and athletic gear.",
  brand: {
    "@type": "Brand",
    name: "Panda Patches",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "1.50",
    highPrice: "8.00",
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
      name: "Custom Chenille TPU Patches",
      item: "https://pandapatches.com/custom-chenille-tpu-patches",
    },
  ],
};

export default async function ChenilleTpuPatchesPage() {
  const { workSamples, heroImage, trustBadges, seoHeading, seoContent } = await getChenilleTpuPageData();

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

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Bulk Orders", href: "/bulk-custom-patches" }
        ]}
        currentPage="Chenille TPU Patches"
      />

      {/* 1. HERO */}
      <BulkHero
        heroImage={heroImage}
        trustBadges={trustBadges}
        customHeading="Custom Chenille TPU Patches"
        customSubheading="Waterproof, Flexible and Built to Last"
        customDescription="Classic chenille texture meets next-level durability. Our chenille TPU patches feature a flexible thermoplastic polyurethane base that bonds tightly to fabric, resists moisture, and withstands heavy daily use. Perfect for varsity jackets, hoodies, and athletic gear. No minimum order. Free mockup. 2-week turnaround."
      />

      {/* 2. WORK GALLERY */}
      <WorkGallery samples={workSamples} />

      {/* 3. WHY CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 4. OUR PROCESS */}
      <ProcessSection />

      {/* 5. CHENILLE TPU FAQ */}
      <CategoryFAQ title="Chenille TPU Patches FAQ" faqs={chenilleTpuFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Custom Chenille TPU Patches: Durable, Flexible and Water-Resistant
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Looking for <strong>custom chenille TPU patches</strong> that hold up through real-world wear? Panda Patches produces premium <strong>chenille patches with TPU backing</strong> for brands, sports teams, schools, and anyone who needs the classic varsity look combined with lasting durability.
            </p>
            <p>
              Unlike standard woven or heat-seal patches, our <strong>chenille TPU patches</strong> use a thermoplastic polyurethane base that bonds tightly to fabric and stays in place through repeated washing, stretching, and outdoor exposure. The TPU layer is <strong>water-resistant</strong>, flexible, and far more durable than traditional iron-on backings that peel and bubble over time.
            </p>
            <p>
              We create <strong>chenille letter patches</strong>, <strong>varsity patches</strong>, <strong>custom logo patches</strong>, and any shape you need. Whether you are equipping a school sports team, launching a streetwear brand, or adding custom patches to athletic uniforms, our chenille TPU patches deliver the raised, soft texture people love with a backing that lasts.
            </p>
            <p>
              Orders come with <strong>no setup fees</strong>, a <strong>free digital mockup</strong>, and a standard <strong>2-week production time</strong>. We handle orders of all sizes from single pieces to 10,000+ bulk runs.
            </p>
            <p>
              Ready to get started? <a href="#bulk-quote" className="text-panda-green font-bold underline">Get your free quote</a> today. We respond within 2 business hours and include a complimentary digital mockup with every inquiry.
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
