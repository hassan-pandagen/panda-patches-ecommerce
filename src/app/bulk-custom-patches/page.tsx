import Link from "next/link";
import type { Metadata } from "next";
import { cache } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import BulkPricingTable from "@/components/bulk/BulkPricingTable";
import BulkCaseStudies from "@/components/bulk/BulkCaseStudies";
import BulkFAQ from "@/components/bulk/BulkFAQ";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import TrustStrip from "@/components/products/TrustStrip";
import Craftsmanship from "@/components/home/Craftsmanship";
import ReviewsSection from "@/components/home/ReviewsSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript, generateHowToSchema, generateServiceSchema } from "@/lib/schemas";
import { client } from "@/lib/sanity";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch work samples for all patch categories + hero image
const getBulkPageData = cache(async () => {
  try {
    const query = `{
      "workSamples": {
        "Embroidered": *[_type == "productPage" && slug.current == "embroidered"][0].workSamples,
        "PVC": *[_type == "productPage" && slug.current == "pvc"][0].workSamples,
        "Woven": *[_type == "productPage" && slug.current == "woven"][0].workSamples,
        "Chenille": *[_type == "productPage" && slug.current == "chenille"][0].workSamples,
        "Leather": *[_type == "productPage" && slug.current == "leather"][0].workSamples
      },
      "hero": *[_type == "hero"][0] {
        "heroImage": heroImage.asset->url,
        "trustBadges": trustBadges[].asset->url
      }
    }`;
    const data = await client.fetch(query);
    return {
      workSamples: data?.workSamples || {},
      heroImage: data?.hero?.heroImage || null,
      trustBadges: data?.hero?.trustBadges || [],
    };
  } catch (error) {
    console.error("Bulk page data fetch error:", error);
    return { workSamples: {}, heroImage: null };
  }
});

// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const { heroImage } = await getBulkPageData();
  const ogImage = heroImage
    ? `${heroImage}?w=1200&h=630&fit=crop&auto=format`
    : 'https://pandapatches.com/assets/og-image.png';
  return {
    title: "Bulk Custom Patches | Wholesale Volume Pricing | Panda Patches",
    description:
      "Order bulk custom patches at wholesale prices. Embroidered, PVC, chenille, woven, leather. Free mockup, 2-week delivery, pricing from $0.85/pc. Get your free quote today.",
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
      title: "Bulk Custom Patches | Wholesale Volume Pricing | Panda Patches",
      description:
        "Order bulk custom patches at wholesale prices. Embroidered, PVC, chenille, woven, leather. Free mockup, 2-week delivery, pricing from $0.85/pc.",
      url: "https://pandapatches.com/bulk-custom-patches",
      siteName: "Panda Patches",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Panda Patches - Bulk Custom Patches" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Bulk Custom Patches | Wholesale Volume Pricing | Panda Patches",
      description: "Order bulk custom patches at wholesale prices. Free mockup, 2-week delivery, from $0.85/pc.",
      images: [ogImage],
    },
  };
}

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
    ratingValue: "4.8",
    reviewCount: "57",
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

// FAQPage schema (server-side for guaranteed crawlability)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the minimum order for bulk pricing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We start bulk pricing at 50 pieces with no strict minimum. You get better rates at 100+, 500+, and 1,000+ pieces. Whether you need 50 patches for your team or 50,000 for a national rollout, we have you covered.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get a pre-production sample before placing a large order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For orders of 500+ pieces, we provide a free pre-production sample so you can verify quality, color accuracy, and sizing before we run the full batch. For smaller orders, samples are available for $25-$50 (credited toward your order).",
      },
    },
    {
      "@type": "Question",
      name: "What file formats do you accept for artwork?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept all formats: AI, EPS, PDF, SVG (vector preferred), as well as PNG, JPG, and TIFF. No artwork? Send us a sketch, photo, or description and our design team will create a professional mockup for free.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer distributor or wholesale pricing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we work with promotional products distributors, ASI members, and resellers. Contact us for special distributor rates, white-label options, and Net 15/30 payment terms.",
      },
    },
    {
      "@type": "Question",
      name: "What is the turnaround time for bulk patch orders?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard production is 2 weeks (10-14 business days) for most bulk orders regardless of quantity. Rush orders of 7 business days are available for an additional fee. For orders over 10,000 pieces, turnaround may be 3-4 weeks depending on complexity.",
      },
    },
    {
      "@type": "Question",
      name: "What quality standards do you follow?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every patch goes through our 5-point quality inspection: thread tension verification, color matching, backing durability test, stitch integrity check, and final visual inspection. Our patches are trusted by fire departments, police departments, and Fortune 500 companies.",
      },
    },
  ],
};

export default async function BulkCustomPatchesPage() {
  const { workSamples, heroImage, trustBadges } = await getBulkPageData();

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
        dangerouslySetInnerHTML={generateSchemaScript(faqSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(generateHowToSchema())}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(generateServiceSchema())}
      />

      <Navbar />

      {/* 1. HERO */}
      <BulkHero heroImage={heroImage} trustBadges={trustBadges} />
      <TrustStrip />
      <Craftsmanship />
      <ReviewsSection />

      {/* 2. BULK PRICING TABLE */}
      <BulkPricingTable workSamples={workSamples} />

      {/* 4. HOW BULK ORDERING WORKS (4-Step Process) */}
      <section className="w-full py-8 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-10 md:mb-14">
            How Bulk Ordering Works
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
                <h3 className="text-[16px] md:text-[19px] font-bold text-panda-dark mb-2 leading-tight">{item.title}</h3>
                <p className="text-[13px] md:text-[15px] text-gray-500 leading-[1.6] max-w-[200px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CASE STUDIES */}
      <BulkCaseStudies />

      {/* 6. WHO ORDERS BULK PATCHES */}
      <section className="w-full py-8 md:py-12 bg-panda-light">
        <div className="container mx-auto px-4 md:px-6 max-w-[960px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-center text-panda-dark uppercase tracking-tight mb-3">
            Who Orders Bulk Custom Patches?
          </h2>
          <p className="text-center text-gray-500 text-[15px] md:text-[16px] mb-10 md:mb-14 max-w-[600px] mx-auto">
            Our bulk customers span dozens of industries. If you need consistent quality across hundreds or thousands of patches, you are in the right place.
          </p>
          <div className="space-y-8">

            <div className="bg-white rounded-[14px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-[17px] md:text-[20px] font-black text-panda-dark mb-2">Promotional Products Distributors & ASI Members</h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">We are set up to work as your behind-the-scenes patch supplier. White-label fulfillment, blind shipping, Net 15/30 terms, and competitive distributor pricing for ASI members. Many of our distributor partners place recurring monthly orders with locked-in volume rates.</p>
            </div>

            <div className="bg-white rounded-[14px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-[17px] md:text-[20px] font-black text-panda-dark mb-2">Corporate Marketing & Branding Teams</h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">From employee uniforms to trade show giveaways, <Link href="/custom-patches/embroidered" className="text-panda-green font-semibold underline">custom embroidered patches</Link> are one of the most cost-effective branded merchandise items. We produce patches for Fortune 500 onboarding kits, conference swag, and department insignia. Corporate clients appreciate consistent color matching across reorders and a dedicated account manager for ongoing programs.</p>
            </div>

            <div className="bg-white rounded-[14px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-[17px] md:text-[20px] font-black text-panda-dark mb-2">Fire Departments & Law Enforcement</h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">Department patches are a point of pride. We produce custom fire department and law enforcement patches that meet the exacting standards these agencies require. Velcro-backed options for easy uniform swaps, merrowed borders for a clean professional look, and reorder consistency so every new batch matches the last.</p>
            </div>

            <div className="bg-white rounded-[14px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-[17px] md:text-[20px] font-black text-panda-dark mb-2">Sports Teams & Athletic Leagues</h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">Whether it is patches for a little league, hockey tournament, or <Link href="/custom-patches/chenille" className="text-panda-green font-semibold underline">varsity chenille letters</Link> for letterman jackets, we handle team orders of every size. Most sports team orders range from 50 to 500 pieces and repeat seasonally.</p>
            </div>

            <div className="bg-white rounded-[14px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-[17px] md:text-[20px] font-black text-panda-dark mb-2">Fashion & Streetwear Brands</h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">Independent apparel brands use our patches as premium branding elements. <Link href="/custom-patches/leather" className="text-panda-green font-semibold underline">Leather patches</Link> for hat lines, <Link href="/custom-patches/chenille" className="text-panda-green font-semibold underline">chenille patches</Link> for varsity-inspired collections, and <Link href="/custom-patches/woven" className="text-panda-green font-semibold underline">woven labels</Link> for garment tagging. We offer low minimums starting at 50 pieces so emerging brands can launch without overcommitting to inventory.</p>
            </div>

            <div className="bg-white rounded-[14px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-[17px] md:text-[20px] font-black text-panda-dark mb-2">Military, Veteran & Motorcycle Organizations</h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">From unit insignia to motorcycle club back patches, we serve communities that take their patches seriously. <Link href="/custom-patches/pvc" className="text-panda-green font-semibold underline">PVC with Velcro backing</Link> for tactical applications, large embroidered back patches for riding clubs, and small patches for caps and vests.</p>
            </div>

            <div className="bg-white rounded-[14px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-[17px] md:text-[20px] font-black text-panda-dark mb-2">Schools, Universities & Scouting Organizations</h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">Academic institutions and scouting groups order patches for achievement recognition, club identification, and event commemoration. We offer student-organization-friendly pricing with low minimums and fast turnaround for time-sensitive events like graduations, competitions, and annual ceremonies.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. MATERIALS & PATCH TYPES */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-center text-panda-dark uppercase tracking-tight mb-3">
            Materials & Patch Types
          </h2>
          <p className="text-center text-gray-500 text-[14px] md:text-[16px] mb-10 md:mb-14 max-w-[560px] mx-auto">
            Every bulk order can mix patch types. Choose what fits your project.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { type: "Embroidered", best: "Uniforms, teams, classic logos", from: "$0.85/pc", note: "Most popular for bulk" },
              { type: "PVC / Rubber", best: "Outdoor gear, tactical, waterproof use", from: "$1.10/pc", note: "Extremely durable" },
              { type: "Woven", best: "Fine detail, small text, labels", from: "$0.90/pc", note: "Thin and lightweight" },
              { type: "Chenille", best: "Varsity jackets, colleges, retro brands", from: "$2.50/pc", note: "Premium textured look" },
              { type: "Leather", best: "Motorcycle clubs, luxury branding", from: "$1.80/pc", note: "Real or faux leather" },
              { type: "Custom Die-Cut", best: "Any shape, any size, any style", from: "Custom quote", note: "Fully bespoke" },
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-[14px] p-5 hover:border-panda-green hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[15px] md:text-[17px] font-black text-panda-dark">{item.type}</h3>
                  <span className="text-[11px] font-bold text-panda-green bg-panda-light px-2.5 py-1 rounded-full">{item.from}</span>
                </div>
                <p className="text-[12px] md:text-[13px] text-gray-500 mb-2">{item.best}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. REORDER PROCESS */}
      <section className="w-full py-8 md:py-12 bg-panda-dark">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px] text-center">
          <h2 className="text-[24px] md:text-[34px] font-black text-white uppercase tracking-tight mb-3">
            Repeat Orders Are Even Easier
          </h2>
          <p className="text-gray-400 text-[14px] md:text-[16px] mb-10 md:mb-12 max-w-[520px] mx-auto">
            Once you place your first bulk order, reordering takes minutes, not days.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { step: "01", title: "Your Files Are Saved", desc: "We keep your artwork, approved mockup, and order specs on file permanently. No re-uploading." },
              { step: "02", title: "Price Is Locked In", desc: "Your per-unit price is guaranteed for all future reorders, regardless of material cost changes." },
              { step: "03", title: "One Message to Reorder", desc: "Email or message your account manager with quantity and delivery date. We handle the rest." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 rounded-[14px] p-6 border border-white/10">
                <span className="text-panda-yellow font-black text-[28px] block mb-3">{item.step}</span>
                <h3 className="text-white font-bold text-[15px] md:text-[17px] mb-2">{item.title}</h3>
                <p className="text-gray-400 text-[13px] md:text-[14px] leading-[1.7]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. WHY BRANDS CHOOSE PANDA */}
      <Promises bgColor="bg-white" items={[
        {
          icon: "/assets/icon-mail.svg",
          title: "Dedicated Account Manager",
          desc: "Every 500+ order gets a dedicated account manager — one point of contact from quote to delivery.",
        },
        {
          icon: "/assets/icon-money.svg",
          title: "Net 15/30 Payment Terms",
          desc: "Qualified distributors and repeat clients can apply for Net 15 or Net 30 payment terms. No upfront cash required.",
        },
        {
          icon: "/assets/icon-clock.svg",
          title: "Easy Reorder, Every Time",
          desc: "We save every order for 3–4 years so you can easily reorder and get the exact same design — no hassle, no starting over.",
        },
        {
          icon: "/assets/icon-check.svg",
          title: "Free Pre-Production Sample",
          desc: "For orders 500+, we ship a free physical sample before full production. Verify quality, color, and sizing — zero risk.",
        },
      ]} />

      {/* 7. OUR PROCESS */}
      <ProcessSection />

      {/* 8. BULK QUOTE FORM — Now in Hero section */}

      {/* 9. BULK FAQ */}
      <BulkFAQ />

      {/* 10. WHY BUSINESSES CHOOSE PANDA */}
      <section className="w-full py-8 md:py-12 bg-panda-light">
        <div className="container mx-auto px-4 md:px-6 max-w-[960px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-center text-panda-dark uppercase tracking-tight mb-3">
            Why Businesses Choose Panda Patches for Bulk Orders
          </h2>
          <p className="text-center text-gray-500 text-[15px] md:text-[16px] mb-10 md:mb-14 max-w-[600px] mx-auto">
            We are not a startup figuring things out. Here is why brands, agencies, and organizations keep coming back.
          </p>
          <div className="space-y-5">
            {[
              {
                title: "4,000+ Bulk Orders Completed",
                body: "From 50-piece test orders to 50,000-piece national rollouts, our production infrastructure handles volume without cutting corners. Every order ships with full tracking and a quality guarantee.",
              },
              {
                title: "ASI Verified Supplier",
                body: "We are a verified supplier in the ASI network. Promotional products distributors can confidently recommend us to their clients — we understand blind shipping, white-label packaging, and Net 15/30 terms.",
              },
              {
                title: "5-Point Quality Inspection on Every Patch",
                body: "Thread tension verification, Pantone color matching, backing durability test, stitch integrity check, and final visual inspection — every single patch in your bulk order goes through all five. This is why fire departments, police agencies, and Fortune 500 companies trust us with their branding.",
              },
              {
                title: "Free Mockups, Free Revisions, No Setup Fees",
                body: "Send your artwork in any format — or even a rough sketch — and our design team creates a professional digital mockup within 24 hours at no charge. Unlimited revisions until you are completely satisfied. The only thing you pay for is the patches themselves.",
              },
              {
                title: "US-Based Support, 2-Hour Response Time",
                body: "Every quote request is answered by a real person within 2 business hours. No chatbots, no 48-hour delays. Our team is available via phone, email, WhatsApp, and live chat from first inquiry through delivery.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-[14px] p-6 md:p-7 border border-gray-100 shadow-sm flex gap-4 items-start">
                <div className="w-8 h-8 bg-panda-dark rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-panda-yellow font-black text-[13px]">{idx + 1}</span>
                </div>
                <div>
                  <h3 className="text-[15px] md:text-[17px] font-black text-panda-dark mb-1.5">{item.title}</h3>
                  <p className="text-[13px] md:text-[14px] text-gray-600 leading-[1.8]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Custom Patches in Bulk — Your Complete Guide
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-5">
            <p>
              Looking to order <strong>custom patches in bulk</strong>? Panda Patches is the trusted partner for brands, organizations, sports teams, and businesses across the United States that need high-quality patches at wholesale volume pricing. Whether you need <strong>50 embroidered patches</strong> for your startup team or <strong>50,000 PVC patches</strong> for a national product launch, we deliver consistent quality, transparent pricing, and a production process built for scale.
            </p>
            <p>
              Our <strong>bulk custom patches</strong> come in every style your project demands. <Link href="/custom-patches/embroidered" className="text-panda-green font-semibold underline">Custom embroidered patches</Link> remain our most requested product, offering the classic raised-thread look that works for everything from corporate uniforms to team jerseys. <Link href="/custom-patches/pvc" className="text-panda-green font-semibold underline">Custom PVC patches</Link> are the top choice for military units, law enforcement agencies, and outdoor brands thanks to their waterproof durability and Velcro compatibility. <Link href="/custom-patches/chenille" className="text-panda-green font-semibold underline">Custom chenille patches</Link> bring the soft, textured vintage feel that fashion brands and universities love for varsity jackets and letterman wear. We also produce <Link href="/custom-patches/woven" className="text-panda-green font-semibold underline">custom woven patches</Link> for ultra-fine detail work and <Link href="/custom-patches/leather" className="text-panda-green font-semibold underline">custom leather patches</Link> for premium hat lines and bags.
            </p>
            <p>
              What sets our bulk patch service apart is the combination of wholesale pricing with no compromise on quality. Every patch in every order goes through our 5-point quality inspection: thread tension verification, Pantone color matching, backing durability testing, stitch integrity checks, and final visual inspection. This is why organizations with zero tolerance for defects — fire departments, police departments, and Fortune 500 corporate programs — choose Panda Patches for their <strong>wholesale patch orders</strong> year after year.
            </p>
            <p>
              Our bulk ordering process is designed to remove friction. Submit your artwork in any format — AI, EPS, PDF, PNG, JPG, or even a rough sketch — and our design team creates a professional digital mockup within 24 hours at no charge. We offer <strong>unlimited free revisions</strong> until your design is exactly right. For orders of 500 pieces or more, we produce and ship a free pre-production sample so you can hold the actual patch in your hand and verify quality, color accuracy, and sizing before we run the full batch.
            </p>
            <p>
              Turnaround time for bulk orders is a standard <strong>2 weeks (10 to 14 business days)</strong> regardless of quantity, with rush 7-day production available. We ship nationwide with full tracking from our production facility to your door. Returning clients benefit from even faster turnaround (7 to 10 days), locked-in volume pricing, and a dedicated account manager who knows their brand inside and out.
            </p>
            <p>
              Ready to get started with your bulk custom patches? <a href="#bulk-quote" className="text-panda-green font-bold underline">Request your free quote</a> using the form above. We respond to every inquiry within 2 business hours with a detailed price breakdown and a complimentary digital mockup. No obligation, no setup fees, no surprises — just premium patches at wholesale prices, delivered on time.
            </p>
          </div>
        </div>
      </section>

      {/* 12. CTA */}
      <CTASection />

      <Footer />
    </main>
  );
}
