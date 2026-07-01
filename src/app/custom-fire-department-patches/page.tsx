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
    answer: "Yes. Fire department seals, Maltese crosses, and bugle rank insignia require precise reproduction that most general patch suppliers get wrong. Send us your official artwork, a vector file, or a high-resolution photo of your badge and our design team matches every detail. You review a digital mockup in 12 to 24 hours before production starts, with unlimited revisions."
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
  {
    question: "How much do custom fire department patches cost?",
    answer: "Custom embroidered fire department patches cost about $3.92 per piece at 50, $2.55 at 100, $1.18 at 500, and $1.05 at 1,000 for a 3-inch patch — all-in, with no setup or digitizing fees and free worldwide shipping. Memorial or single-station runs start at a low 5-piece minimum. Velcro backing adds a flat $30 per order.",
  },
  {
    question: "What is the minimum order for fire department patches?",
    answer: "The minimum is 5 pieces on embroidered fire department patches — low enough for a single station, a memorial run, or a rank set. There are no setup or digitizing fees at any size, and department-wide or IAFF orders scale down to about $1 per piece at 1,000.",
  },
  {
    question: "What artwork do you need, and what file formats do you accept?",
    answer: "Send your department seal, Maltese cross, or badge as a vector file (AI, EPS, SVG, PDF) or a high-resolution image (PNG, JPG). No artwork yet? Describe it and our design team drafts it free. You approve a digital mockup in 12 to 24 hours, with unlimited free revisions, before production starts.",
  },
];

// Live embroidered pricing (3" reference) pulled from the calculator so the fire
// pricing block never drifts from the checkout price.
function firePrice(qty: number): string {
  const r = calculatePatchPrice('Custom Embroidered Patches', 3, 3, qty);
  return r.error || !r.unitPrice ? '—' : `$${r.unitPrice.toFixed(2)}`;
}
const FIRE_PRICE_ROWS = [50, 100, 250, 500, 1000].map((q) => ({ qty: q.toLocaleString('en-US'), per: firePrice(q) }));

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
  const ogTitle = "Custom Fire Department Patches | Panda Patches";
  const ogDescription = "Custom fire department patches and firefighter badges. Trusted by departments nationwide. Fast turnaround, bulk pricing.";
  return buildPageMetadata({
    title: "Custom Fire Department Patches | Memorial, Station & Rank | Panda Patches",
    description: "Custom fire department patches that survive industrial washing. Maltese cross, rank insignia, LODD memorial rush in 72 hrs, IAFF union orders. Low 5-piece minimum. Mockup in 12-24 hours.",
    url: "https://www.pandapatches.com/custom-fire-department-patches",
    image: { url: ogImage, alt: ogTitle },
    ogTitle,
    ogDescription,
  });
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
            What Makes a Fire Department Patch Last
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Fire department patches take a beating, so the materials matter. We stitch ours in 100% polyester thread, rated for industrial wash temperatures of 160&ndash;180&deg;F and repeated high-heat cycles &mdash; the rayon thread cheaper suppliers use degrades and fades under the same conditions.
            </p>
            <p>
              Backing is matched to the job: sew-on for Class A and B uniforms, hook-and-loop Velcro for turnout gear and bags, and iron-on for department t-shirts. Every piece is mocked up for your approval before we cut a single thread.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Memorials, Ranks, and Union Orders
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              We&apos;re the maker, not a reseller &mdash; most suppliers just want the sale, but we get the mockup right first, send unlimited free revisions until you approve, and remake any patch that isn&apos;t right. That matters most on memorial and line-of-duty patches, which we can rush in 4&ndash;7 business days when your department needs them quickly.
            </p>
            <p>
              We also handle rank insignia by bugle count and recurring orders for IAFF locals. For July 4, 2026, many departments add commemorative <a href="/custom-250th-anniversary-patches" className="text-panda-green font-semibold underline">250th anniversary patches</a> for America&apos;s semiquincentennial.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full py-8 md:py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-3">
            How Much Do Fire Department Patches Cost?
          </h2>
          <p className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] mb-6">
            Embroidered fire department patches run about <strong>$3.92/pc at 50</strong>, <strong>$2.55 at 100</strong>, and down to <strong>$1.05 at 1,000</strong> for a 3&quot; patch &mdash; all-in, with <strong>no setup or digitizing fees</strong> and free worldwide shipping. Memorial and single-station runs start at a low <strong>5-piece minimum</strong>; Velcro backing adds a flat $30 per order.
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
                {FIRE_PRICE_ROWS.map((row, i) => (
                  <tr key={row.qty} className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAF5]"}>
                    <td className="px-5 py-3 font-semibold text-panda-dark">{row.qty}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{row.per}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            3&quot; embroidered patch, free US shipping included.{" "}
            <a href="/how-much-do-custom-patches-cost-full-pricing-breakdown" className="text-panda-green underline">Full pricing breakdown &rarr;</a>
          </p>
        </div>
      </section>

      {/* How to order */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            How to Order Fire Department Patches
          </h2>
          <ol className="space-y-3 text-[15px] md:text-[16px] text-gray-700 leading-[1.7] list-decimal pl-5">
            <li><strong>Send your artwork or idea.</strong> Upload your department seal, Maltese cross, or badge as a vector (AI, EPS, SVG, PDF) or high-resolution image (PNG, JPG) &mdash; or just describe it and we draft it free.</li>
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
