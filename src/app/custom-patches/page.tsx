import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getSanityOgImage } from "@/lib/sanityOgImage";
import { client } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateSchemaScript } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";

// COMPONENTS
import ProductHero from "@/components/product/ProductHero";
import PickPatch from "@/components/about/PickPatch";
import Promises from "@/components/home/Promises";
import CategoryZigZag from "@/components/product/CategoryZigZag";
import ProductInfoCarousel from "@/components/product/ProductInfoCarousel";
import IndustrySection from "@/components/home/IndustrySection";
import FAQ from "@/components/home/FAQ";
import ContentSection from "@/components/home/ContentSection";
import TrustStrip from "@/components/products/TrustStrip";
import CTASection from "@/components/home/CTASection";

// ssr:false for heavy client components with Swiper/carousels to avoid hydration mismatch
const Craftsmanship = dynamic(() => import("@/components/home/Craftsmanship"), { ssr: true });
const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection"), { ssr: true });
const ProcessSection = dynamic(() => import("@/components/home/ProcessSection"), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getSanityOgImage();
  return buildPageMetadata({
    title: "Custom Patches from $0.91/pc (1k) | Free Design | Panda Patches",
    description: "Order custom patches in any style: embroidered, PVC, woven, chenille & leather. As low as 5 patches. Free artwork plus a mockup in 12-24 hours. Ships in 7-14 days. Trusted by 10,000+ brands. Get a free quote!",
    url: "https://www.pandapatches.com/custom-patches",
    image: { url: ogImage, alt: "Panda Patches - Custom Patches" },
    ogTitle: "Custom Patches - All Types | Panda Patches",
    ogDescription: "Browse all custom patch types with low minimums and fast delivery. Embroidered, PVC, woven, chenille, and leather patches available.",
    twitterDescription: "Browse all custom patch types with low minimums and fast delivery. Embroidered, PVC, woven, chenille, and leather patches.",
  });
}

// Product schema for the main patches landing page
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches",
  description: "Custom embroidered patches, PVC patches, woven patches, chenille patches, and leather patches with low minimums, free design services, and 7-14 day delivery.",
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
    lowPrice: "0.91",
    highPrice: "6.00",
    offerCount: "6",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
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
    offers: [
      { "@type": "Offer", name: "Embroidered Patches", price: "0.91", priceCurrency: "USD", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "PVC Patches", price: "1.54", priceCurrency: "USD", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "Woven Patches", price: "1.54", priceCurrency: "USD", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "Chenille Patches", price: "1.31", priceCurrency: "USD", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "Leather Patches", price: "1.55", priceCurrency: "USD", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", priceValidUntil: "2027-01-01" },
      { "@type": "Offer", name: "Sequin Patches", price: "1.44", priceCurrency: "USD", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", priceValidUntil: "2027-01-01" },
    ],
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
      item: "https://www.pandapatches.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Custom Patches",
      item: "https://www.pandapatches.com/custom-patches",
    },
  ],
};

// FAQPage schema (server-side so Google can crawl it)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of custom patches can I get made?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At Panda Patches, you can get five types of custom patches made: (1) Embroidered patches — classic raised thread look, best for logos, uniforms, and bold designs; (2) Woven patches — finer thread and flatter finish, ideal for small text and intricate detail; (3) PVC patches — soft rubber, fully waterproof, best for tactical gear and outdoor use; (4) Chenille patches — raised fuzzy texture, the classic varsity jacket look for sports teams and schools; (5) Leather patches — laser-engraved or debossed, premium finish for hats, denim jackets, and brand merchandise. All patch types are available with iron-on, sew-on, or Velcro backing. Low 5-piece minimum, digital mockup in 12 to 24 hours, and free worldwide shipping on every order.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a minimum order for custom patches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At Panda Patches, the minimum order is 5 pieces with no setup fees and no digitizing fees on any order size.",
      },
    },
    {
      "@type": "Question",
      name: "Do custom patches from Panda Patches come with a mockup?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every order at Panda Patches includes free artwork, free design, and a digital mockup delivered in 12 to 24 hours. The mockup shows exactly what your finished patch will look like, including colors, dimensions, stitching, borders, and backing. Unlimited free revisions are included. No setup fees, no digitizing fees, no design charges. The free artwork and the mockup are included regardless of order size, from 5 pieces to 5,000+. Production never starts until you approve in writing.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I get custom patches with free artwork and no setup fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Panda Patches provides free artwork, free design assistance, and a digital mockup in 12 to 24 hours on every custom patch order — embroidered, PVC, woven, chenille, and leather. No setup fees, no digitizing fees, unlimited free revisions until you approve, and free worldwide shipping included. Minimum order is 5 pieces. Production starts only after your written approval.",
      },
    },
    {
      "@type": "Question",
      name: "Does Panda Patches offer a money-back guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Panda Patches offers a full money-back guarantee. If we cannot produce a design you are happy with after unlimited free revisions, you receive a full refund — no questions asked. Production never starts until you give written approval on your digital mockup, so you are never charged for patches you have not approved. This guarantee covers design dissatisfaction, not just manufacturing defects.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I order custom patches with a money-back guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Panda Patches offers custom patches with a full money-back guarantee. After you pay, our design team sends a digital mockup within 24 hours. You review it, request unlimited free changes, and only approve when you are completely satisfied. Production starts only after your written approval. If we still cannot get it right, you receive a full refund. No questions asked. Free worldwide shipping, no setup fees, minimum order of 5 pieces.",
      },
    },
    {
      "@type": "Question",
      name: "How much do custom patches cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing starts from $0.91 per patch for a 2x2-inch design at 1,000 pieces. Smaller orders cost more per piece, so small first runs of 5 to 10 patches typically range from $13 to $24 each. The price depends on patch type, size, and quantity. Get a free instant quote by uploading your design.",
      },
    },
    {
      "@type": "Question",
      name: "Does Panda Patches offer rush order custom patches with fast turnaround?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Panda Patches offers rush production on custom patches with turnaround confirmed by email within 2-6 hours of ordering. Rush fees: +$50 for 50 pieces, +$75 for 100 pieces, +$150 for 500 pieces, +$200 for 1,000 pieces. If the rush date cannot be met, the rush fee is refunded with no questions asked. Standard production is 7-14 business days. Economy production (16-18 business days) saves 10% off the order total. All timelines start after digital mockup approval.",
      },
    },
    {
      "@type": "Question",
      name: "How long does production take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard production is 7-14 business days after design approval. Rush production is available with exact delivery date confirmed by email within 2-6 hours. Economy production (16-18 business days) saves 10% off the total. Free worldwide shipping on all orders.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer free design services?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide a professional digital mockup for every order in 12 to 24 hours. Unlimited revisions are included at no extra charge until you are 100% satisfied with the design.",
      },
    },
    {
      "@type": "Question",
      name: "What backing options are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer iron-on (heat-seal), sew-on, Velcro (hook and loop), adhesive, and magnetic backings. The best option depends on where you plan to apply the patch and how permanent you need it to be.",
      },
    },
  ],
};

// ISR: Revalidate main patches page every 24 hours
export const revalidate = 86400;

async function getMainProductData() {
  try {
    const query = `*[_type == "productPage" && slug.current == "custom-patches"][0]`;
    const data = await client.fetch(query);
    return data;
  } catch {
    return null;
  }
}

export default async function ProductLandingPage() {
  const data = await getMainProductData();

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <h1 className="text-2xl font-bold">Main Product Page Not Found</h1>
        <p className="text-gray-500">
          Please go to Sanity Studio and create a Product Page with slug: <strong>custom-patches</strong>
        </p>
      </div>
    );
  }

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

      <Navbar />
      
      {/* 1. HERO (Quote Form Mode) */}
      <ProductHero productData={data} isMainPage={true} />
      <TrustStrip />
      <Craftsmanship />
      <ReviewsSection />

      {/* 2. PICK YOUR PATCH (5 Cards) */}
      <PickPatch />
      
      {/* 3. PROMISES */}
      <Promises bgColor="bg-white" />

      {/* 4. CATEGORY ZIG-ZAG LIST */}
      <CategoryZigZag />

      {/* 5. EDUCATION (Backing & Borders) */}
      {data.backingOptions && data.backingOptions.length > 0 && (
        <ProductInfoCarousel 
          options={data.backingOptions} 
          title="Backing Options" 
          subtitle="Select the perfect backing"
          layout="left" 
        />
      )}

      {data.borderOptions && data.borderOptions.length > 0 && (
        <ProductInfoCarousel 
          options={data.borderOptions} 
          title="Border Options" 
          subtitle="Edge finishing styles"
          layout="right" 
        />
      )}
      
      {/* 6. GORILLA PROCESS */}
      <ProcessSection />

      {/* 7. INDUSTRY USE CASES */}
      <IndustrySection />

      {/* 8. FAQ & SEO */}
      <FAQ />
      <ContentSection />

      {/* 9. EXPANDED SEO CONTENT — custom patches guide */}
      <section className="w-full py-12 md:py-16 bg-[#F9FAF5] border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-[860px]">

          <div className="w-10 h-1 bg-panda-yellow mb-8 rounded-full" />

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            5 Types of Custom Patches: Which Is Right for You?
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Not every patch is made the same way. The right type depends on your design, application, and budget. Here is a quick breakdown of all five custom patch types we produce.
          </p>
          <ul className="space-y-4 mb-8 text-[17px] leading-[1.8] text-gray-600">
            <li><Link href="/custom-patches/embroidered" className="text-panda-dark font-bold underline decoration-1 underline-offset-4 hover:text-panda-green">Embroidered patches</Link> are the most popular choice. Thread is stitched directly onto a twill backing, creating a textured, premium look. Best for logos, text, and bold designs with solid colors. From $0.91/pc at 2x2 inches and 1,000 pieces; smaller orders cost more per piece.</li>
            <li><Link href="/custom-patches/woven" className="text-panda-dark font-bold underline decoration-1 underline-offset-4 hover:text-panda-green">Woven patches</Link> use thinner thread for a flatter, more detailed result. Ideal when your design has fine lines, small text, or gradient shading that embroidery cannot replicate cleanly.</li>
            <li><Link href="/custom-patches/pvc" className="text-panda-dark font-bold underline decoration-1 underline-offset-4 hover:text-panda-green">PVC patches</Link> are made from soft rubber and are fully waterproof. The best option for tactical gear, outdoor equipment, bags, and anything exposed to weather or heavy wear.</li>
            <li><Link href="/custom-patches/chenille" className="text-panda-dark font-bold underline decoration-1 underline-offset-4 hover:text-panda-green">Chenille patches</Link> deliver the classic varsity look. A raised, fuzzy pile surface with a felt backing. Standard for letterman jackets, sports teams, and award patches.</li>
            <li><Link href="/custom-patches/leather" className="text-panda-dark font-bold underline decoration-1 underline-offset-4 hover:text-panda-green">Leather patches</Link> give a premium, heritage finish. Laser-engraved or debossed. Popular for denim jackets, hats, bags, and brand merchandise that needs to stand out.</li>
          </ul>

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            Backing Options: Iron-On, Sew-On, Velcro, and More
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Every custom patch can be made with your choice of backing. The backing determines how the patch attaches to fabric or gear.
          </p>
          <ul className="space-y-3 mb-8 text-[17px] leading-[1.8] text-gray-600">
            <li><strong className="text-panda-dark">Iron-on (heat seal):</strong> A thermoplastic adhesive backing that bonds to fabric with a household iron or heat press. Quick to apply, permanent, and included free on all orders.</li>
            <li><strong className="text-panda-dark">Sew-on:</strong> No adhesive. The patch is stitched directly onto fabric for the most secure, long-lasting attachment. Required for performance wear and technical fabrics.</li>
            <li><strong className="text-panda-dark">Velcro (hook and loop):</strong> Both hook and loop sides included. Allows the patch to be removed and repositioned. Standard for military, law enforcement, and tactical vests. Velcro backing adds $30 to any order.</li>
            <li><strong className="text-panda-dark">Sticker (self-adhesive):</strong> Peel-and-stick for temporary applications, helmets, notebooks, and promotional use.</li>
          </ul>

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            Who Orders Custom Patches?
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Custom patches serve a wide range of industries and communities. Our customers include:
          </p>
          <ul className="space-y-3 mb-8 text-[17px] leading-[1.8] text-gray-600">
            <li><strong className="text-panda-dark">Sports teams and leagues</strong> ordering jersey patches, championship patches, and award patches for players, coaches, and staff.</li>
            <li><strong className="text-panda-dark">Businesses and brands</strong> using logo patches on uniforms, merchandise, corporate gifts, and promotional items.</li>
            <li><strong className="text-panda-dark">Military and law enforcement</strong> ordering morale patches, unit identification patches, and tactical Velcro patches for vests and bags.</li>
            <li><strong className="text-panda-dark">Schools and universities</strong> commissioning chenille varsity patches, club patches, and spirit wear embellishments.</li>
            <li><strong className="text-panda-dark">Motorcycle clubs and organizations</strong> creating MC back patches, center patches, and rocker patches for vests and jackets.</li>
            <li><strong className="text-panda-dark">Streetwear and fashion brands</strong> adding woven labels, leather patches, and PVC badges to caps, hoodies, and bags.</li>
            <li><strong className="text-panda-dark">Scouts and youth groups</strong> ordering merit badge-style patches and event commemoratives for uniforms and sashes.</li>
          </ul>

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            How to Order Custom Patches: 4 Simple Steps
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Ordering custom patches from Panda Patches takes minutes. Here is what the process looks like from quote to delivery:
          </p>
          <ol className="space-y-3 mb-8 text-[17px] leading-[1.8] text-gray-600 list-decimal list-inside">
            <li><strong className="text-panda-dark">Submit your quote.</strong> Upload your artwork or describe your idea using our quote form. Include patch type, size, quantity, and backing preference.</li>
            <li><strong className="text-panda-dark">Receive your digital mockup in 12 to 24 hours.</strong> Our design team creates a digital proof showing exactly what your patch will look like. Review it and request any changes, free of charge.</li>
            <li><strong className="text-panda-dark">Approve and pay.</strong> Once you are happy with the mockup, confirm your order. Production begins immediately after approval.</li>
            <li><strong className="text-panda-dark">Receive your patches in 7-14 days.</strong> Standard production ships in 7-14 business days. Rush production is available if you need them sooner.</li>
          </ol>

          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-4 leading-tight">
            Custom Patch Pricing: What to Expect
          </h2>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            Patch pricing depends on three main factors: patch type, size, and quantity. The more you order, the lower the per-piece cost. Here is a general pricing guide for embroidered patches under 4 inches:
          </p>
          <ul className="space-y-2 mb-6 text-[17px] leading-[1.8] text-gray-600">
            <li><strong className="text-panda-dark">50 pieces:</strong> $180 total ($3.60/pc)</li>
            <li><strong className="text-panda-dark">100 pieces:</strong> $240 total ($2.40/pc)</li>
            <li><strong className="text-panda-dark">500 pieces:</strong> $750 total ($1.50/pc)</li>
            <li><strong className="text-panda-dark">1,000 pieces:</strong> $1,200 total ($1.20/pc)</li>
          </ul>
          <p className="text-[17px] leading-[1.8] text-gray-600 mb-4">
            PVC, chenille, and leather patches carry slightly higher base prices due to materials and production complexity. Woven patches are comparable to embroidered. All prices include free worldwide shipping and a digital mockup in 12 to 24 hours. There are no setup fees and no hidden charges.
          </p>
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Need a precise quote? Use our free quote form above, upload your design, and receive a detailed price breakdown within 24 hours.
          </p>

          <p className="text-[15px] leading-[1.8] text-gray-500 mt-8 pt-6 border-t border-gray-200">
            Explore the details: <Link href="/custom-patches/backing-options" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">backing options</Link> (including <Link href="/sew-on-patches" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">sew-on</Link>, <Link href="/adhesive-patches" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">adhesive</Link>, and <Link href="/magnetic-patches" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">magnetic</Link>), <Link href="/patch-borders" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">patch borders</Link>, and <Link href="/patch-threads-and-twills" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">threads &amp; twills</Link>. Popular niche patches: <Link href="/custom-airsoft-patches" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">airsoft</Link>, <Link href="/custom-martial-arts-patches" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">martial arts &amp; BJJ</Link>, <Link href="/custom-ems-patches" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">EMS</Link>, and <Link href="/custom-letterman-patches" className="text-panda-dark font-semibold underline decoration-1 underline-offset-2 hover:text-panda-green">letterman</Link>.
          </p>

        </div>
      </section>

      {/* 10. REELS & CTA */}
      <CTASection />
      
      <Footer />
    </main>
  );
}
