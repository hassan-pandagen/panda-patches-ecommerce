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

// Sports-specific FAQs
const sportsFAQs = [
  {
    question: "What is the difference between chenille and embroidered patches?",
    answer: "Chenille patches have a soft, raised, fuzzy texture — the traditional varsity jacket letter. Standard letter height runs 6-8 inches for jacket fronts. Embroidered patches are flat, durable, and detailed, right for jerseys, bags, hats, and uniform patches. For letterman jackets, order chenille. For game jerseys and uniforms, order embroidered. Ordering the wrong one is the most common sports patch mistake."
  },
  {
    question: "Will iron-on patches survive washing on our game jerseys?",
    answer: "Not reliably. For game jerseys washed 30-40 times per season, sew-on backing is the only durable option. Iron-on adhesive degrades on polyester and spandex jersey fabric with repeated high-heat washing. The edges peel by mid-season. We recommend sew-on for any patch that goes on a game uniform, and will flag it if you try to select iron-on for jersey use."
  },
  {
    question: "Can you hit our tournament or season-start deadline?",
    answer: "Standard production is 10-14 business days after you approve your mockup. Rush production cuts that to 4-7 business days. If you have a hard date — tournament day, picture day, first game — add it in the order notes and we confirm whether we can hit it within 6 hours, before any payment processes. Post-season championship patches ship within 10 business days on standard."
  },
  {
    question: "We have a youth team of 14 players. Is there a minimum order?",
    answer: "No minimum. We regularly produce 10-25 piece runs for youth teams, small clubs, and coach gift orders at the same quality as large league orders. The 50-piece Starter tier on our Offers page gives the best per-piece price, but a 14-patch team run is completely normal and we handle it with the same care."
  },
  {
    question: "We run a whole league with 8 different team designs. Do we get bulk pricing?",
    answer: "Yes. Bulk pricing applies to your total order quantity, not per design. If your league orders 500 patches across 8 different team logos, every patch is priced at the 500-piece tier. League coordinators who consolidate ordering save significantly compared to each team ordering independently."
  },
  {
    question: "Can we get championship patches the week after our season ends?",
    answer: "Yes, this is one of our most common rush requests. Post-season championship and tournament patches land in your hands within 10 business days standard, or 4-7 days with rush. Order as soon as the season ends while the momentum is still there — most teams delay and lose the moment."
  },
  {
    question: "What backing is right for varsity jackets vs. game jerseys?",
    answer: "Varsity jackets with leather sleeves need sew-on backing — iron-on damages leather and does not bond properly. Wool body sections can take iron-on but sew-on lasts longer. For game jerseys and polyester uniforms, sew-on is required for durability through the season. For casual apparel, equipment bags, and fan jackets, iron-on is fine."
  },
];

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
const getSportsPageData = cache(async () => {
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
});

export async function generateMetadata(): Promise<Metadata> {
  const { heroImage } = await getSportsPageData();
  const ogImage = heroImage
    ? `${heroImage}?w=1200&h=630&fit=crop&auto=format`
    : 'https://www.pandapatches.com/assets/og-image.png';
  return {
    title: "Custom Sports Patches | Chenille Varsity, Championship & Jersey Patches",
    description: "Custom sports patches for varsity jackets, game jerseys, and championships. Chenille letters, embroidered team logos, league bulk pricing. Rush for season deadlines. No minimum.",
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
    alternates: { canonical: "https://www.pandapatches.com/custom-sports-patches" },
    openGraph: {
      title: "Custom Sports Team Patches | Panda Patches",
      description: "Custom embroidered patches for sports teams, leagues, and clubs. No minimum order, free mockup, fast delivery.",
      url: "https://www.pandapatches.com/custom-sports-patches",
      siteName: "Panda Patches",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Custom Sports Team Patches | Panda Patches" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Custom Sports Team Patches | Panda Patches",
      description: "Custom embroidered patches for sports teams, leagues, and clubs. No minimum order, free mockup, fast delivery.",
      images: [ogImage],
    },
  };
}

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Sports Team Patches",
  description: "Custom embroidered patches for sports teams, leagues, and athletic clubs.",
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
      name: "Sports Team Patches",
      item: "https://www.pandapatches.com/custom-sports-patches",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(generateFAQSchema(sportsFAQs))}
      />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
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
      <TrustStrip />
      <Craftsmanship />
      <ReviewsSection />

      {/* 3. WHY CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 4. OUR PROCESS */}
      <ProcessSection />

      {/* 5. SPORTS FAQ */}
      <CategoryFAQ title="Sports Patches FAQ" faqs={sportsFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-white">
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
