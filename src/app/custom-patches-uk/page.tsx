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

const CANONICAL = "https://www.pandapatches.com/custom-patches-uk";

export const revalidate = 86400;

const ukFAQs = [
  {
    question: "Do I pay VAT or import duty on custom patches in the UK?",
    answer:
      "No. Panda Patches ships to the UK on a DDP (delivered duty paid) basis, which means VAT, customs, and any import duties are already included and settled before your parcel arrives. The USD price you are quoted is the full amount you pay. There is nothing extra to pay the courier, no VAT invoice on arrival, and no customs handling fee when the parcel lands.",
  },
  {
    question: "What currency are your prices in?",
    answer:
      "All prices are in US dollars (USD), and the USD figure is the complete, delivered price. We do not bill in GBP, but your card or PayPal will convert at the day's rate, and what you see quoted in USD is exactly what reaches us; there are no separate shipping, VAT, or handling charges added at any stage.",
  },
  {
    question: "How long does delivery to the UK take?",
    answer:
      "Standard delivery to the UK is approximately 7 to 15 business days after you approve your digital mockup: production runs 7 to 14 business days and international transit is handled by DHL or FedEx. Rush production is available when you need patches sooner, with the exact date confirmed by email within a few hours of ordering.",
  },
  {
    question: "Is there a minimum order for UK customers?",
    answer:
      "The minimum order is just 5 pieces, the same low minimum we offer everywhere. There are no setup fees, no digitising fees, and no small-order surcharge, so a UK club, small business, or individual can order a handful of patches at the same per-piece quality as a 1,000-piece run.",
  },
  {
    question: "Can I see my patch before it is made?",
    answer:
      "Yes. Every order includes a free digital mockup within 24 hours showing your exact colours, size, stitching, and backing. You can request unlimited free revisions until it is right, and production only starts after you approve. A free physical sample box is also available so UK buyers can feel the embroidery, PVC, woven, and leather quality in hand first.",
  },
  {
    question: "Where are your patches made and how do they reach the UK?",
    answer:
      "We make every patch in our own factory rather than brokering production out, which is how we keep quality and lead times tight. You can read the full story on our about page. Finished patches are shipped DDP to the UK, so all import formalities and duties are handled for you and the patches arrive at your door with nothing further to pay.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patches UK | Free Shipping, No VAT, From 5 Pieces",
  description:
    "Custom patches shipped free to the UK, no VAT, customs, or hidden fees. The USD price is all you pay. Embroidered, PVC, woven & more. Free 24h mockup, 5-piece minimum.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Patches UK: Free Shipping, No VAT, One All-In USD Price",
  ogDescription:
    "We ship custom patches free to the UK on a DDP basis, no VAT or customs on arrival. Embroidered, PVC, woven, chenille and more. Free 24-hour mockup, low 5-piece minimum.",
  twitterDescription:
    "Custom patches shipped free to the UK with no VAT or customs. The USD price is all you pay. Free 24h mockup, 5-piece minimum.",
  robots: { index: true, follow: true },
  alternates: { languages: COUNTRY_HREFLANG },
});

const articleSchema = generateArticleSchema({
  title: "Custom Patches in the UK: Free Shipping, No VAT, One All-In USD Price",
  description:
    "How Panda Patches serves UK customers: free DDP delivery with no VAT or customs, all-in USD pricing, a low 5-piece minimum, a free 24-hour mockup, and UK use cases from regimental and club patches to business branding.",
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Custom Patches UK", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(ukFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches Shipped Free to the UK",
  description:
    "Custom embroidered, PVC, woven, chenille and leather patches shipped free to the UK on a DDP basis with no VAT or customs. All-in USD pricing, low 5-piece minimum, free 24-hour mockup.",
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
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "GB" },
    },
  },
};

const UK_USE_CASES = [
  { title: "Regimental, Military & Veterans", body: "Unit, association, and commemorative patches for serving and ex-service communities.", href: "/custom-patches/embroidered", imgSlug: "custom-military-patches" },
  { title: "Football & Rugby Clubs", body: "Club crests, supporters' group patches, and matchday merch for grassroots and semi-pro sides.", href: "/custom-patches/woven", imgSlug: "industry-sports", contain: true },
  { title: "Scouts & Youth Groups", body: "Section badges, camp and event patches, and group identifiers.", href: "/custom-patches/embroidered", imgSlug: "custom-school-patches" },
  { title: "Motorcycle Clubs", body: "Back patches, rockers, and centre patches for UK riding clubs.", href: "/custom-patches/leather", imgSlug: "custom-motorcycle-club-patches" },
  { title: "Schools & Universities", body: "House, society, and society-trip patches plus varsity-style chenille.", href: "/custom-patches/chenille", imgSlug: "custom-fraternity-sorority-patches" },
  { title: "Business & Brand Branding", body: "Logo patches for workwear, caps, and streetwear labels.", href: "/custom-patches/pvc", imgSlug: "custom-corporate-patches" },
];

export default async function CustomPatchesUKPage() {
  const { workSamples, trustBadges } = await getClusterPageData("embroidered");
  const useCaseImages = await getUseCaseImages(UK_USE_CASES.map((u) => u.imgSlug));

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Custom Patches UK"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Patches in the UK"
        customSubheading="Free UK Shipping, No VAT, No Surprises. From 5 Pieces."
        customDescription="We ship custom patches free to the UK on a DDP basis, so the USD price you see is exactly what you pay, with no VAT or customs on arrival. Free digital mockup within 24 hours. Trusted by UK brands including Wise."
      />

      {/* SHORT ANSWER (answer-first) */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <div className="rounded-2xl border-2 border-panda-green/30 bg-white p-6 md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[2px] text-panda-green mb-3">Short answer</p>
            <p className="text-[16px] md:text-[18px] text-panda-dark leading-[1.7]">
              Yes, we make custom patches for UK customers and ship them to your door <strong>free</strong>, with
              {" "}<strong>no VAT, customs, or import fees</strong> on arrival. We ship <strong>DDP (delivered duty
              paid)</strong>, so the <strong>USD price you see is exactly what you pay</strong>, nothing extra when
              your parcel lands. Embroidered, PVC, woven, chenille and more, with a <strong>low 5-piece
              minimum</strong> and a <strong>free digital mockup within 24 hours</strong>. Rated {TRUSTPILOT_RATING} on
              Trustpilot and trusted by UK brands including <Link href="/case-studies/wise-nasdaq-times-square-activation" prefetch={false} className="text-panda-green underline font-semibold">Wise</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[22px] md:text-[30px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            UK Quick Facts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { k: "Currency", v: "USD (all-in)" },
              { k: "Shipping to UK", v: "Free" },
              { k: "VAT / customs / duties", v: "None, shipped DDP" },
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

      {/* VAT / DDP EXPLAINER */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-4">
            Do UK customers pay VAT or customs?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] mb-4">
            No. Every UK order ships <strong>DDP (delivered duty paid)</strong>, which means we handle and pre-pay
            all import formalities, VAT, and duties before the parcel reaches you. The USD price you approve at
            checkout is the entire cost. When your patches arrive, there is no VAT bill, no customs charge, and no
            courier handling fee to settle on the doorstep, the most common nasty surprise with overseas patch
            suppliers who ship DAP or DDU.
          </p>
          <p className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8]">
            This is the single biggest reason UK buyers choose us over a cheaper-looking quote elsewhere: a low
            sticker price means little if the courier adds 20% VAT plus a clearance fee on delivery. With DDP, the
            number you see is the number you pay. See the full breakdown of how overseas patch pricing really works
            in our guide to <Link href="/custom-patch-hidden-fees" prefetch={false} className="text-panda-green underline font-semibold">hidden patch fees</Link>.
          </p>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-4">
            How long does UK delivery take?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] mb-4">
            Standard UK delivery is approximately <strong>7 to 15 business days</strong> from the moment you approve
            your mockup: production takes 7 to 14 business days and international transit is by DHL or FedEx with
            full tracking. Need them sooner? <strong>Rush production is available</strong>, with the confirmed
            delivery date emailed within a few hours of your order.
          </p>
          <p className="text-[14px] text-gray-500 leading-[1.7]">
            Timelines start after written mockup approval, so the fastest way to hit a deadline is to approve your
            proof quickly. Tell us your in-hands date in the quote and we will confirm whether standard or rush
            meets it.
          </p>
        </div>
      </section>

      {/* UK USE CASES */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            Patch Types &amp; UK Use Cases
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-10 max-w-[720px] mx-auto">
            Embroidered, woven, PVC, chenille, and leather, all shipped free to the UK with no VAT. A few of the
            communities we make for:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {UK_USE_CASES.map((u) => {
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
            UK Pricing, All-In USD
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-8 max-w-[720px] mx-auto">
            One price, in USD, with free DDP delivery to the UK included. Figures below are the per-piece starting
            price at 2&quot; x 2&quot; and 1,000 pieces; smaller runs cost more per piece. Get your exact, instant
            price on the calculator.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Patch Type</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">From (2&quot;, 1,000 pcs)</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Shipping to UK</th>
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

      {/* WHY UK BRANDS CHOOSE PANDA */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-5">
            Why UK brands choose Panda Patches
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-700 leading-[1.8] space-y-4">
            <p>
              When <strong>Wise</strong> rang the Nasdaq bell in Times Square, they needed custom patches at scale
              and on a tight deadline, and they came to us. You can read the full story in our <Link href="/case-studies/wise-nasdaq-times-square-activation" prefetch={false} className="text-panda-green underline font-semibold">Wise case study</Link>. That same combination, real production capacity with transparent,
              all-in pricing, is what UK buyers value most.
            </p>
            <p>
              No hidden fees and no VAT surprises (we ship DDP), a low <strong>5-piece minimum</strong> so clubs and
              small businesses are never priced out, a free mockup within 24 hours with unlimited revisions, free
              worldwide shipping, and a money-back guarantee. We make every patch in our own factory rather than
              brokering it out, which keeps quality consistent and turnaround fast. Read the story on our <Link href="/about" prefetch={false} className="text-panda-green underline font-semibold">about page</Link>, see why the minimum is 5 in our <Link href="/custom-patches-no-minimum-order-5-pieces" prefetch={false} className="text-panda-green underline font-semibold">minimum-order guide</Link>, or browse <Link href="/bulk-custom-patches" prefetch={false} className="text-panda-green underline font-semibold">bulk orders</Link> for larger runs.
            </p>
            <p className="text-[14px] text-gray-500">
              Shipping further afield? We also ship free to <Link href="/custom-patches-australia" prefetch={false} className="text-panda-green underline font-semibold">Australia</Link> and <Link href="/custom-patches-canada" prefetch={false} className="text-panda-green underline font-semibold">Canada</Link>, both DDP with no local tax.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Custom Patches UK: FAQ" faqs={ukFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
