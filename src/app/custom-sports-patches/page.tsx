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

// Sports-specific FAQs
const sportsFAQs = [
  {
    question: "What sports team patches do you make?",
    answer: "We make patches for all sports: football, baseball, basketball, soccer, hockey, wrestling, swimming, tennis, volleyball, lacrosse, and more. We create team logo patches, jersey number patches, varsity letters, championship patches, and custom uniform patches."
  },
  {
    question: "Can you match our exact team colors?",
    answer: "Absolutely! We use Pantone color-matching to replicate your team colors precisely. Send us your team colors (Pantone codes, hex codes, or color swatches), and we'll match them exactly across all patch types."
  },
  {
    question: "Can you make patches for youth sports leagues?",
    answer: "Yes! We work with youth leagues, high school teams, college athletics, and professional sports organizations. No minimum order required — perfect for small recreational leagues to large conference-wide orders."
  },
  {
    question: "What's the turnaround time for team orders?",
    answer: "Standard production is 2 weeks (10-14 business days). Rush production (7 business days) is available for urgent season needs. We understand game schedules and can accommodate tight deadlines."
  },
  {
    question: "Do you offer bulk pricing for entire leagues?",
    answer: "Absolutely! Volume pricing starts at 100+ pieces with additional discounts at 500+ and 1,000+. League-wide orders get bulk pricing across all teams, even if each team has different designs."
  },
  {
    question: "Can you create jersey number patches?",
    answer: "Yes! We create custom jersey number patches in any font, color, and size. Perfect for uniforms, practice jerseys, and fan merchandise. Available in iron-on or sew-on backing."
  },
  {
    question: "What backing is best for sports uniforms?",
    answer: "For jerseys and uniforms, we recommend sew-on backing for maximum durability through repeated washing and game wear. Iron-on backing works well for practice gear and fan apparel."
  },
  {
    question: "Can you make championship or tournament patches?",
    answer: "Absolutely! We specialize in custom championship patches, tournament patches, all-star patches, and MVP awards. Rush production available for post-season orders."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
async function getSportsPageData() {
  try {
    const query = `{
      "categoryData": *[_type == "categoryPage" && slug.current == "custom-sports-patches"][0] {
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
    console.error("Sports page data fetch error:", error);
    return { heroImage: null, workSamples: [], trustBadges: [], seoHeading: null, seoContent: null };
  }
}

export const metadata: Metadata = {
  title: "Sports Team Patches - No Minimum, Fast Turnaround",
  description: "Custom sports patches for teams, leagues, and clubs. Embroidered uniform patches, jersey numbers, varsity letters, and championship patches. No minimum, free mockup.",
  keywords: [
    "custom sports patches",
    "sports team patches",
    "custom team patches",
    "embroidered sports patches",
    "custom jersey patches",
    "varsity letter patches",
    "championship patches",
    "custom uniform patches",
    "baseball patches",
    "football patches",
    "soccer patches",
  ],
  alternates: { canonical: "https://pandapatches.com/custom-sports-patches" },
  openGraph: {
    title: "Custom Sports Team Patches | Panda Patches",
    description: "Custom embroidered patches for sports teams, leagues, and clubs. No minimum order, free mockup, fast delivery.",
    url: "https://pandapatches.com/custom-sports-patches",
    siteName: "Panda Patches",
    type: "website",
  },
};

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Sports Team Patches",
  description: "Custom embroidered patches for sports teams, leagues, and athletic clubs.",
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
      name: "Custom Sports Patches",
      item: "https://pandapatches.com/custom-sports-patches",
    },
  ],
};

export default async function SportsPatchesPage() {
  const { workSamples, heroImage, trustBadges, seoHeading, seoContent } = await getSportsPageData();

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
        currentPage="Sports Team Patches"
      />

      {/* 1. HERO */}
      <BulkHero
        heroImage={heroImage}
        trustBadges={trustBadges}
        customHeading="Custom Sports Team Patches"
        customSubheading="Trusted by Youth Leagues & Pro Teams"
        customDescription="Premium embroidered sports patches for uniforms, jerseys, varsity jackets, and championship gear. Team logos, numbers, and custom designs. No minimum order. Free mockup. 2-week turnaround."
      />

      {/* 2. WORK GALLERY */}
      <WorkGallery samples={workSamples} />

      {/* 3. WHY CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 4. OUR PROCESS */}
      <ProcessSection />

      {/* 5. SPORTS FAQ */}
      <CategoryFAQ title="Sports Patches FAQ" faqs={sportsFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Custom Sports Patches — Professional Quality for Teams & Athletes
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Looking for <strong>custom sports team patches</strong> for your league or club? Panda Patches is the trusted choice for youth sports leagues, high school teams, college athletics, and professional organizations that need high-quality embroidered patches for uniforms and gear.
            </p>
            <p>
              We produce <strong>custom sports patches</strong> for all sports: football, baseball, basketball, soccer, hockey, wrestling, swimming, tennis, and more. From <strong>team logo patches</strong> and <strong>jersey numbers</strong> to <strong>varsity letters</strong> and <strong>championship patches</strong>, we deliver consistent quality that stands up to game-day wear and washing.
            </p>
            <p>
              Whether you need <strong>50 patches for a youth team</strong> or <strong>5,000 patches for an entire league</strong>, we handle orders of all sizes with the same attention to detail. With <strong>no setup fees</strong>, <strong>free design mockups</strong>, and a standard <strong>2-week turnaround</strong>, getting custom patches for your team has never been easier.
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
