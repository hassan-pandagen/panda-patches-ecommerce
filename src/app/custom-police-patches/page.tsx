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
import MakerNote from "@/components/seo/MakerNote";
import { generateSchemaScript, generateFAQSchema } from "@/lib/schemas";
import { client } from "@/lib/sanity";
import { buildPageMetadata } from "@/lib/seo";
import { calculatePatchPrice } from "@/lib/pricingCalculator";

// Police-specific FAQs
const policeFAQs = [
  {
    question: "Can you replicate our exact department badge or insignia?",
    answer: "Yes. Send us your badge artwork, a high-resolution photo, or your department's vector file. Our design team reproduces shields, eagles, stars, and fine text with precision — including small badge numbers and department names legible at 2-3 inches. You approve a digital mockup in 12 to 24 hours before a single stitch runs, with unlimited revisions until it matches your official badge exactly."
  },
  {
    question: "What backing is best for police uniforms vs. tactical vests?",
    answer: "Sew-on for Class A dress uniforms and duty shirts — permanent, clean finish, survives daily washing. Velcro hook-and-loop for tactical vests, plate carriers, and SWAT gear where patches need to swap between assignments. We use stitched Velcro (not glued), rated for thousands of cycles. Iron-on is not appropriate for law enforcement uniform applications."
  },
  {
    question: "Do you make subdued patches for SWAT or tactical units?",
    answer: "Yes. We produce subdued patches in OD green, coyote tan, and black-on-black for low-visibility tactical use. PVC is the preferred format for SWAT and K-9 handlers — waterproof, UV-resistant, and holds fine detail at small sizes better than embroidery. Specify subdued or PVC in your order and we confirm the thread palette before production."
  },
  {
    question: "Can we order small quantities for a K-9 team or special unit?",
    answer: "Yes, low 5-piece minimum. K-9 units of 4-6 handlers, SWAT teams, detective divisions, and small specialized units regularly order 10-25 patches from us. Per-piece pricing improves at 50+, 100+, and 500+, but small unit orders at any quantity are completely normal for us."
  },
  {
    question: "How fast can you produce memorial patches for a fallen officer?",
    answer: "Rush production is available for memorial patches and we treat them as our highest priority. Send us the officer's name, badge number, department, and any design references and we start the mockup immediately. Rush fulfills in 4-7 business days. We understand the timeline around a memorial service and give these orders full priority."
  },
  {
    question: "Can you match our existing patches for a reorder?",
    answer: "Yes. Provide a sample of your existing patch or your previous order reference and we match thread colors to the same production palette. Color consistency across reorders is critical when new patches sit next to existing ones on the same uniform, and we archive your color specs for 12 months after each order."
  },
  {
    question: "Do you handle county-wide orders with different designs per unit?",
    answer: "Yes. County-wide orders covering multiple departments, sheriff offices, and municipalities are common. Volume pricing applies to the total order quantity across all designs, not per design. Each unit's artwork is reviewed and approved independently before production begins."
  },
  {
    question: "How much do custom police patches cost?",
    answer: "Custom embroidered police patches cost about $3.92 per piece at 50, $2.55 at 100, $1.18 at 500, and $1.05 at 1,000 for a 3-inch patch — all-in, with no setup or digitizing fees and free worldwide shipping. Small K-9 or unit runs start at a low 5-piece minimum, and Velcro backing adds a flat $30 per order.",
  },
  {
    question: "What is the minimum order for police patches?",
    answer: "The minimum is 5 pieces — low enough for a K-9 team, detective division, or SWAT unit, not the 50-piece minimums many law-enforcement suppliers require. There are no setup or digitizing fees at any size, and county-wide orders scale down to about $1 per piece at 1,000.",
  },
  {
    question: "What artwork do you need, and what file formats do you accept?",
    answer: "Send your department badge, shield, or seal as a vector file (AI, EPS, SVG, PDF) or a high-resolution image (PNG, JPG). No artwork yet? Send a photo of your badge or describe it and our design team drafts it free. You approve a digital mockup in 12 to 24 hours, with unlimited free revisions, before production starts.",
  },
];

// Live embroidered pricing (3" reference) pulled from the calculator so the police
// pricing block never drifts from the checkout price.
function policePrice(qty: number): string {
  const r = calculatePatchPrice('Custom Embroidered Patches', 3, 3, qty);
  return r.error || !r.unitPrice ? '—' : `$${r.unitPrice.toFixed(2)}`;
}
const POLICE_PRICE_ROWS = [50, 100, 250, 500, 1000].map((q) => ({ qty: q.toLocaleString('en-US'), per: policePrice(q) }));

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Fetch category-specific work samples + hero
const getPolicePageData = cache(async () => {
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
});

export async function generateMetadata(): Promise<Metadata> {
  const { heroImage } = await getPolicePageData();
  const ogImage = heroImage
    ? `${heroImage}?w=1200&h=630&fit=crop&auto=format`
    : 'https://www.pandapatches.com/assets/og-image.png';
  const ogTitle = "Custom Police & Law Enforcement Patches | Panda Patches";
  const ogDescription = "Custom police department patches and law enforcement badges. Trusted by departments nationwide. Fast turnaround, bulk pricing.";
  return buildPageMetadata({
    title: "Custom Police Patches | Department, Tactical & Memorial | Panda Patches",
    description: "Custom police department patches with badge replication, subdued tactical, PVC, K-9, SWAT, and memorial rush. Low 5-piece minimum. Mockup in 12-24 hours. Free worldwide shipping.",
    url: "https://www.pandapatches.com/custom-police-patches",
    image: { url: ogImage, alt: ogTitle },
    ogTitle,
    ogDescription,
  });
}

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Police Department Patches",
  description: "Custom police and law enforcement patches for departments, sheriffs, and tactical units.",
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
    highPrice: "4.50",
    offerCount: "3",
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
      name: "Police & Law Enforcement Patches",
      item: "https://www.pandapatches.com/custom-police-patches",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(generateFAQSchema(policeFAQs))}
      />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bulk Orders", href: "/bulk-custom-patches" }
        ]}
        currentPage="Police & Law Enforcement Patches"
      />

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
      <TrustStrip />
      <Craftsmanship />
      <ReviewsSection />

      {/* 3. WHY CHOOSE PANDA */}
      <Promises bgColor="bg-white" />

      {/* 4. OUR PROCESS */}
      <ProcessSection />

      {/* 5. POLICE FAQ */}
      <CategoryFAQ title="Law Enforcement Patches FAQ" faqs={policeFAQs} />

      {/* 6. SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Custom Police Patches — Professional Law Enforcement Patches
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Custom police patches have to stay legible and hold up on duty. We size department names and badge numbers to read clearly at 2&ndash;3 inches, and we build tactical patches in PVC &mdash; the material most SWAT and tactical units prefer for weather and abrasion resistance. Velcro backing is stitched, not glued, so it survives repeated gear swaps.
            </p>
            <p>
              We make patches for police departments, sheriff&apos;s offices, tactical and K-9 units, SWAT teams, and security departments in embroidered, PVC, and woven. Orders run from 50 patches for a small department to 5,000 for a county-wide rollout, and we archive your approved artwork so future reorders match the originals exactly.
            </p>
            <p>
              We&apos;re the maker, not a reseller &mdash; most suppliers just want the sale, but we get the mockup right first, send unlimited free revisions until you approve, and remake any patch that isn&apos;t right. Memorial and line-of-duty patches are prioritized when your department needs them quickly.
            </p>
            <p>
              Ready to start? <a href="#bulk-quote" className="text-panda-green font-bold underline">Get your free quote</a> &mdash; we respond to every inquiry within 2 business hours and work directly to your department&apos;s specifications.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full py-8 md:py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-3">
            How Much Do Police Patches Cost?
          </h2>
          <p className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] mb-6">
            Embroidered police patches run about <strong>$3.92/pc at 50</strong>, <strong>$2.55 at 100</strong>, and down to <strong>$1.05 at 1,000</strong> for a 3&quot; patch &mdash; all-in, with <strong>no setup or digitizing fees</strong> and free worldwide shipping. Unlike the 50-piece minimums common in law enforcement, K-9 and specialty-unit runs start at a low <strong>5-piece minimum</strong>; Velcro backing adds a flat $30 per order.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 max-w-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-3 font-bold">Quantity</th>
                  <th className="text-right px-5 py-3 font-bold">Price per patch</th>
                </tr>
              </thead>
              <tbody>
                {POLICE_PRICE_ROWS.map((row, i) => (
                  <tr key={row.qty} className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAF5]"}>
                    <td className="px-5 py-3 font-semibold text-panda-dark">{row.qty}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{row.per}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            3&quot; embroidered patch, free US shipping included. Subdued/PVC tactical priced separately.{" "}
            <a href="/how-much-do-custom-patches-cost-full-pricing-breakdown" className="text-panda-green underline">Full pricing breakdown &rarr;</a>
          </p>
        </div>
      </section>

      {/* How to order */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            How to Order Police Patches
          </h2>
          <ol className="space-y-3 text-[15px] md:text-[16px] text-gray-700 leading-[1.7] list-decimal pl-5">
            <li><strong>Send your badge or idea.</strong> Upload your department shield, seal, or badge as a vector (AI, EPS, SVG, PDF) or high-resolution image (PNG, JPG) &mdash; or send a photo and we draft it free.</li>
            <li><strong>Approve your mockup.</strong> You get a digital mockup in 12&ndash;24 hours with unlimited free revisions. Nothing is produced until you sign off.</li>
            <li><strong>We produce &amp; ship.</strong> Standard production is 7&ndash;14 business days; line-of-duty memorial patches rush in 4&ndash;7. Free worldwide shipping, low 5-piece minimum.</li>
          </ol>
        </div>
      </section>

      <MakerNote />

      {/* 7. CTA */}
      <CTASection />

      <Footer />
    </main>
  );
}
