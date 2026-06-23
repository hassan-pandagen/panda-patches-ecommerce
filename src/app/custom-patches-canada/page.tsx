import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import WorkGallery from "@/components/bulk/WorkGallery";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { getClusterPageData, getUseCaseImages } from "@/lib/clusterPageData";
import { getFromPriceLabel } from "@/lib/pricingCalculator";
import { TRUSTPILOT_RATING } from "@/lib/reviewConstants";
import { COUNTRY_HREFLANG } from "@/lib/countryHreflang";

const CANONICAL = "https://www.pandapatches.com/custom-patches-canada";

export const revalidate = 86400;

const caFAQs = [
  {
    question: "Do I pay GST/HST or duty at the border on custom patches in Canada?",
    answer:
      "No. Panda Patches ships to Canada on a DDP (delivered duty paid) basis, so GST/HST, customs, and any duties are already included and settled before your parcel arrives. The USD price you are quoted is the full amount you pay. There is no tax to settle at the border, no duty owed, and no brokerage or clearance fee from the courier on delivery.",
  },
  {
    question: "What currency are your prices in?",
    answer:
      "All prices are in US dollars (USD), and that USD figure is the complete, delivered price. We do not bill in CAD, but your card converts at the day's rate. There are no separate shipping, GST/HST, duty, or brokerage charges added at any point; the USD number you approve is exactly what reaches us.",
  },
  {
    question: "How long does delivery to Canada take?",
    answer:
      "Standard delivery to Canada is approximately 7 to 15 business days after you approve your digital mockup: production runs 7 to 14 business days and international transit is handled by DHL or FedEx with tracking. Rush production is available when you need patches sooner, with the exact date confirmed by email shortly after you order.",
  },
  {
    question: "Is there a minimum order for Canadian customers?",
    answer:
      "The minimum order is just 5 pieces. There are no setup fees, no digitizing fees, and no small-order surcharge, so a minor-hockey association, scout group, small business, or individual can order a handful of patches at the same per-piece quality as a 1,000-piece run.",
  },
  {
    question: "Can I see my patch before it is made?",
    answer:
      "Yes. Every order includes a free digital mockup within 24 hours showing your exact colors, size, stitching, and backing, with unlimited free revisions until it is right. Production starts only after you approve. A free physical sample box is also available so you can feel the embroidery, PVC, woven, and leather quality before ordering.",
  },
  {
    question: "Where are your patches made and how do they reach Canada?",
    answer:
      "We make every patch in our own factory rather than brokering production out, which keeps quality and lead times tight. The full story is on our about page. Finished patches ship DDP to Canada, so all import formalities, GST/HST, and duties are handled for you and the patches arrive at your door with nothing further to pay, including no brokerage fee.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patches Canada | Free Shipping, No Duties, From 5 Pieces",
  description:
    "Custom patches shipped free across Canada, no GST/HST, customs, or hidden fees. The USD price is all you pay. Embroidered, PVC, woven & more. Free 24h mockup, 5-piece minimum.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Patches Canada: Free Shipping, No Duties, One All-In USD Price",
  ogDescription:
    "We ship custom patches free across Canada on a DDP basis, no GST/HST or duties at the border. Embroidered, PVC, woven, chenille and more. Free 24-hour mockup, low 5-piece minimum.",
  twitterDescription:
    "Custom patches shipped free across Canada with no GST/HST or duties. The USD price is all you pay. Free 24h mockup, 5-piece minimum.",
  robots: { index: true, follow: true },
  alternates: { languages: COUNTRY_HREFLANG },
});

const articleSchema = generateArticleSchema({
  title: "Custom Patches in Canada: Free Shipping, No Duties, One All-In USD Price",
  description:
    "How Panda Patches serves Canadian customers: free DDP delivery with no GST/HST or duties at the border, all-in USD pricing, a low 5-piece minimum, a free 24-hour mockup, and Canadian use cases from hockey associations to first responders.",
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Custom Patches Canada", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(caFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches Shipped Free to Canada",
  description:
    "Custom embroidered, PVC, woven, chenille and leather patches shipped free across Canada on a DDP basis with no GST/HST or duties. All-in USD pricing, low 5-piece minimum, free 24-hour mockup.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: TRUSTPILOT_RATING,
    bestRating: "5",
    ratingCount: "72",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0.91",
    highPrice: "6.00",
    offerCount: "6",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: "Panda Patches" },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "CA" },
    },
  },
};

const CA_USE_CASES = [
  { title: "Hockey Teams & Minor-Hockey", body: "Team crests, association patches, and tournament patches for the rink.", href: "/custom-patches/woven", imgSlug: "chenille" },
  { title: "Scouts & Guides Canada", body: "Section badges, camp patches, and group identifiers.", href: "/custom-patches/embroidered", imgSlug: "custom-school-patches" },
  { title: "Fire, Police & EMS", body: "Service and unit patches for first responders.", href: "/custom-ems-patches", imgSlug: "custom-military-patches" },
  { title: "Schools & Universities", body: "Varsity letters, house patches, and faculty crests.", href: "/custom-letterman-patches", imgSlug: "custom-fraternity-sorority-patches" },
  { title: "Motorcycle Clubs", body: "Back patches, rockers, and centre patches for Canadian riding clubs.", href: "/custom-patches/leather", imgSlug: "custom-motorcycle-club-patches" },
  { title: "Business & Promo", body: "Logo patches for workwear, caps, and brand merch.", href: "/custom-patches/pvc", imgSlug: "custom-corporate-patches" },
];

export default async function CustomPatchesCanadaPage() {
  const { workSamples, trustBadges } = await getClusterPageData("woven");
  const useCaseImages = await getUseCaseImages(CA_USE_CASES.map((u) => u.imgSlug));

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Custom Patches Canada"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Patches in Canada"
        customSubheading="Free Canada-Wide Shipping, No Duties, No Surprises. From 5 Pieces."
        customDescription="We ship custom patches free across Canada on a DDP basis, so the USD price you see is exactly what you pay, with no GST/HST or duties at the border. Free digital mockup within 24 hours."
      />

      {/* SHORT ANSWER */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <div className="rounded-2xl border-2 border-panda-green/30 bg-white p-6 md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[2px] text-panda-green mb-3">Short answer</p>
            <p className="text-[16px] md:text-[18px] text-panda-dark leading-[1.7]">
              Yes, we make custom patches for Canadian customers and ship them to your door <strong>free</strong>,
              with <strong>no GST/HST, customs, or import fees</strong> on arrival. We ship <strong>DDP (delivered
              duty paid)</strong>, so the <strong>USD price you see is exactly what you pay</strong>, nothing extra
              at the border or on delivery. Embroidered, PVC, woven, chenille and more, with a <strong>low 5-piece
              minimum</strong> and a <strong>free digital mockup within 24 hours</strong>. Rated {TRUSTPILOT_RATING} on
              Trustpilot.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[22px] md:text-[30px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Canada Quick Facts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { k: "Currency", v: "USD (all-in)" },
              { k: "Shipping to Canada", v: "Free" },
              { k: "GST/HST / customs / duties", v: "None, shipped DDP" },
              { k: "Minimum order", v: "5 pieces" },
              { k: "Mockup", v: "Free, 24 hours" },
              { k: "Turnaround", v: "Standard + rush" },
              { k: "Rating", v: `${TRUSTPILOT_RATING} Trustpilot` },
              { k: "Patches delivered", v: "1,000,000+" },
            ].map((f) => (
              <div key={f.k} className="bg-[#F9FAF5] rounded-2xl p-5 border border-gray-200 text-center">
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">{f.k}</p>
                <p className="text-[15px] md:text-[17px] font-black text-panda-dark leading-tight">{f.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorkGallery samples={workSamples} />

      {/* GST/HST / DDP EXPLAINER */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-4">
            Do Canadian customers pay GST/HST or duty?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] mb-4">
            No. Every Canadian order ships <strong>DDP (delivered duty paid)</strong>, so we handle and pre-pay
            GST/HST, customs, and any duties before the parcel reaches you. The USD price you approve at checkout is
            the entire cost. There is <strong>no tax to settle at the border, no duty owed, and no brokerage or
            clearance fee</strong> from the courier, the charges that so often turn a cheap-looking overseas quote
            into an expensive surprise.
          </p>
          <p className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8]">
            Courier brokerage and duty on cross-border parcels can add a painful amount on delivery. With DDP, the
            number you see is the number you pay, full stop. See how overseas patch pricing really adds up in our
            guide to <Link href="/custom-patch-hidden-fees" prefetch={false} className="text-panda-green underline font-semibold">hidden patch fees</Link>.
          </p>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-4">
            How long does delivery to Canada take?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] mb-4">
            Standard delivery to Canada is approximately <strong>7 to 15 business days</strong> from mockup
            approval: production takes 7 to 14 business days and international transit runs by DHL or FedEx with full
            tracking. <strong>Rush production is available</strong> when a deadline is tight, with the confirmed
            delivery date emailed shortly after you order.
          </p>
          <p className="text-[14px] text-gray-500 leading-[1.7]">
            Timelines begin after written mockup approval, so approving your proof quickly is the fastest route to an
            in-hands date. Tell us your deadline in the quote and we will confirm whether standard or rush meets it.
          </p>
        </div>
      </section>

      {/* CA USE CASES */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            Patch Types &amp; Canadian Use Cases
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-10 max-w-[720px] mx-auto">
            Embroidered, woven, PVC, chenille, and leather, all shipped free across Canada with no GST/HST or
            duties. A few of the communities we make for:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CA_USE_CASES.map((u) => {
              const img = useCaseImages[u.imgSlug] || null;
              return (
              <Link key={u.title} href={u.href} prefetch={false} className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-panda-green hover:shadow-md transition-all">
                {img && (
                  <div className="relative w-full aspect-square flex-shrink-0">
                    <Image src={urlFor(img).width(600).height(600).format("webp").quality(75).url()} alt={`${u.title} custom patches`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <h3 className="text-[17px] font-black text-panda-dark mb-2 group-hover:text-panda-green transition-colors">{u.title}</h3>
                  <p className="text-[14px] text-gray-600 leading-[1.6]">{u.body}</p>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            Canada Pricing, All-In USD
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-8 max-w-[720px] mx-auto">
            One price, in USD, with free DDP delivery to Canada included. Figures below are the per-piece starting
            price at 2&quot; x 2&quot; and 1,000 pieces; smaller runs cost more per piece. Get your exact price on
            the calculator.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Patch Type</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">From (2&quot;, 1,000 pcs)</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Shipping to CA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { t: "Embroidered", p: getFromPriceLabel("Custom Embroidered Patches"), href: "/custom-patches/embroidered" },
                  { t: "PVC", p: getFromPriceLabel("Custom PVC Patches"), href: "/custom-patches/pvc" },
                  { t: "Woven", p: getFromPriceLabel("Custom Woven Patches"), href: "/custom-patches/woven" },
                  { t: "Chenille", p: getFromPriceLabel("Custom Chenille Patches"), href: "/custom-patches/chenille" },
                  { t: "Leather", p: getFromPriceLabel("Custom Leather Patches"), href: "/custom-patches/leather" },
                  { t: "Printed", p: getFromPriceLabel("Custom Printed Patches"), href: "/custom-patches/printed" },
                ].map((r) => (
                  <tr key={r.t} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-bold"><Link href={r.href} prefetch={false} className="text-panda-dark hover:text-panda-green underline decoration-1 underline-offset-2">{r.t}</Link></td>
                    <td className="px-5 py-4 font-black bg-panda-green/10">{r.p}/pc</td>
                    <td className="px-5 py-4 text-gray-600">Free (DDP)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed text-center">
            Prices are all-in USD with free worldwide shipping. For an exact quote at any size or quantity from 5
            upward, use the <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">live calculator</Link> on any product page, or the quote form above.
          </p>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <ProcessSection />

      {/* WHY CA BRANDS CHOOSE PANDA */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-5">
            Why Canadian buyers choose Panda Patches
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-700 leading-[1.8] space-y-4">
            <p>
              We deliver real production at scale and on deadline. When <strong>Wise</strong> rang the Nasdaq bell
              in Times Square, they came to us for custom patches at scale under a tight timeline, the full story is
              in our <Link href="/case-studies/wise-nasdaq-times-square-activation" prefetch={false} className="text-panda-green underline font-semibold">Wise case study</Link>. Canadian teams and businesses get that same capability
              with transparent, all-in pricing.
            </p>
            <p>
              No hidden fees and no border surprises (we ship DDP, so no GST/HST, duty, or brokerage), a low
              {" "}<strong>5-piece minimum</strong> so associations and small businesses are never priced out, a free
              mockup within 24 hours with unlimited revisions, free worldwide shipping, and a money-back guarantee.
              We make every patch in our own factory rather than brokering it out. Read the story on our <Link href="/about" prefetch={false} className="text-panda-green underline font-semibold">about page</Link>, see why the minimum is 5 in our <Link href="/custom-patches-no-minimum-order-5-pieces" prefetch={false} className="text-panda-green underline font-semibold">minimum-order guide</Link>, or browse <Link href="/bulk-custom-patches" prefetch={false} className="text-panda-green underline font-semibold">bulk orders</Link> for larger runs.
            </p>
            <p className="text-[14px] text-gray-500">
              Shipping elsewhere? We also ship free to the <Link href="/custom-patches-uk" prefetch={false} className="text-panda-green underline font-semibold">UK</Link> and <Link href="/custom-patches-australia" prefetch={false} className="text-panda-green underline font-semibold">Australia</Link>, both DDP with no local tax.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Custom Patches Canada: FAQ" faqs={caFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
