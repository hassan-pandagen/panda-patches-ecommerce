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

const CANONICAL = "https://www.pandapatches.com/custom-patches-australia";

export const revalidate = 86400;

const auFAQs = [
  {
    question: "Do I pay GST or import duty on custom patches in Australia?",
    answer:
      "No. Panda Patches ships to Australia on a DDP (delivered duty paid) basis, so GST, customs, and any import duties are already included and settled before your parcel arrives. The USD price you are quoted is the full amount you pay. There is no GST to settle on delivery, no customs charge, and no clearance fee from the courier when the parcel lands.",
  },
  {
    question: "What currency are your prices in?",
    answer:
      "All prices are in US dollars (USD), and that USD figure is the complete, delivered price. We do not bill in AUD, but your card converts at the day's rate. There are no separate shipping, GST, or handling charges added at any point; the USD number you approve is exactly what reaches us.",
  },
  {
    question: "How long does delivery to Australia take?",
    answer:
      "Standard delivery to Australia is approximately 10 to 20 business days after you approve your digital mockup: production runs 7 to 14 business days and international transit to Australia is handled by DHL or FedEx with tracking. Rush production is available when you need patches faster, with the exact date confirmed by email shortly after you order.",
  },
  {
    question: "Is there a minimum order for Australian customers?",
    answer:
      "The minimum order is just 5 pieces. There are no setup fees, no digitising fees, and no small-order surcharge, so a local sports club, surf lifesaving club, small business, or individual can order a handful of patches at the same per-piece quality as a 1,000-piece run.",
  },
  {
    question: "Can I see my patch before it is made?",
    answer:
      "Yes. Every order includes a free digital mockup within 24 hours showing your exact colours, size, stitching, and backing, with unlimited free revisions until it is right. Production starts only after you approve. A free physical sample box is also available so you can feel the embroidery, PVC, woven, and leather quality before ordering.",
  },
  {
    question: "Where are your patches made and how do they reach Australia?",
    answer:
      "We make every patch in our own factory rather than brokering production out, which keeps quality and lead times tight. The full story is on our about page. Finished patches ship DDP to Australia, so all import formalities, GST, and duties are handled for you and the patches arrive with nothing further to pay.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patches Australia | Free Shipping, No GST, From 5 Pieces",
  description:
    "Custom patches shipped free across Australia, no GST, customs, or hidden fees. The USD price is all you pay. Embroidered, PVC, woven & more. Free 24h mockup, 5-piece minimum.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Patches Australia: Free Shipping, No GST, One All-In USD Price",
  ogDescription:
    "We ship custom patches free across Australia on a DDP basis, no GST or customs on arrival. Embroidered, PVC, woven, chenille and more. Free 24-hour mockup, low 5-piece minimum.",
  twitterDescription:
    "Custom patches shipped free across Australia with no GST or customs. The USD price is all you pay. Free 24h mockup, 5-piece minimum.",
  robots: { index: true, follow: true },
  alternates: { languages: COUNTRY_HREFLANG },
});

const articleSchema = generateArticleSchema({
  title: "Custom Patches in Australia: Free Shipping, No GST, One All-In USD Price",
  description:
    "How Panda Patches serves Australian customers: free DDP delivery with no GST or customs, all-in USD pricing, a low 5-piece minimum, a free 24-hour mockup, and Australian use cases from defence and surf lifesaving to AFL, NRL, and trades branding.",
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Custom Patches Australia", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(auFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches Shipped Free to Australia",
  description:
    "Custom embroidered, PVC, woven, chenille and leather patches shipped free across Australia on a DDP basis with no GST or customs. All-in USD pricing, low 5-piece minimum, free 24-hour mockup.",
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
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "AU" },
    },
  },
};

const AU_USE_CASES = [
  { title: "ADF, Defence & Veterans", body: "Unit, squadron, and commemorative patches for serving and ex-service members.", href: "/custom-patches/embroidered", imgSlug: "custom-military-patches" },
  { title: "Surf Lifesaving Clubs", body: "Waterproof PVC patches that shrug off sun, salt, and sand for club gear.", href: "/custom-patches/pvc", imgSlug: "pvc" },
  { title: "AFL, NRL & Rugby Clubs", body: "Club crests and supporter patches in fine woven detail for local sides.", href: "/custom-patches/woven", imgSlug: "industry-sports", contain: true },
  { title: "Scouts Australia", body: "Section badges, camp patches, and group identifiers.", href: "/custom-patches/embroidered", imgSlug: "custom-school-patches" },
  { title: "Mining, Trades & Hi-Vis", body: "Durable logo patches for workwear, hi-vis, and safety apparel branding.", href: "/custom-patches/pvc", imgSlug: "custom-corporate-patches" },
  { title: "Motorcycle Clubs", body: "Back patches, rockers, and centre patches for Australian riding clubs.", href: "/custom-patches/leather", imgSlug: "custom-motorcycle-club-patches" },
];

export default async function CustomPatchesAustraliaPage() {
  const { workSamples, trustBadges } = await getClusterPageData("pvc");
  const useCaseImages = await getUseCaseImages(AU_USE_CASES.map((u) => u.imgSlug));

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Custom Patches Australia"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Patches in Australia"
        customSubheading="Free Australia-Wide Shipping, No GST, No Surprises. From 5 Pieces."
        customDescription="We ship custom patches free across Australia on a DDP basis, so the USD price you see is exactly what you pay, with no GST or customs on arrival. Free digital mockup within 24 hours."
      />

      {/* SHORT ANSWER */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <div className="rounded-2xl border-2 border-panda-green/30 bg-white p-6 md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[2px] text-panda-green mb-3">Short answer</p>
            <p className="text-[16px] md:text-[18px] text-panda-dark leading-[1.7]">
              Yes, we make custom patches for Australian customers and ship them to your door <strong>free</strong>,
              with <strong>no GST, customs, or import fees</strong> on arrival. We ship <strong>DDP (delivered duty
              paid)</strong>, so the <strong>USD price you see is exactly what you pay</strong>, no surprises at
              delivery. Embroidered, PVC, woven, chenille and more, with a <strong>low 5-piece minimum</strong> and
              a <strong>free digital mockup within 24 hours</strong>. Rated {TRUSTPILOT_RATING} on Trustpilot.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[22px] md:text-[30px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Australia Quick Facts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { k: "Currency", v: "USD (all-in)" },
              { k: "Shipping to Australia", v: "Free" },
              { k: "GST / customs / duties", v: "None, shipped DDP" },
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

      {/* GST / DDP EXPLAINER */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-4">
            Do Australian customers pay GST or customs?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] mb-4">
            No. Every Australian order ships <strong>DDP (delivered duty paid)</strong>, so we handle and pre-pay
            GST, customs, and any duties before the parcel reaches you. The USD price you approve at checkout is the
            entire cost. There is <strong>no GST to settle on delivery, no customs charge, and no clearance fee</strong>{" "}
            from the courier, the surprise that catches buyers out when an overseas supplier ships DAP or DDU.
          </p>
          <p className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8]">
            A cheaper sticker price means little if GST and a clearance fee land on your doorstep. With DDP, the
            number you see is the number you pay. See how overseas patch pricing really adds up in our guide to
            {" "}<Link href="/custom-patch-hidden-fees" prefetch={false} className="text-panda-green underline font-semibold">hidden patch fees</Link>.
          </p>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-4">
            How long does delivery to Australia take?
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] mb-4">
            Standard delivery to Australia is approximately <strong>10 to 20 business days</strong> from mockup
            approval: production takes 7 to 14 business days and international transit to Australia runs by DHL or
            FedEx with full tracking. <strong>Rush production is available</strong> when a deadline is tight, with
            the confirmed delivery date emailed shortly after you order.
          </p>
          <p className="text-[14px] text-gray-500 leading-[1.7]">
            Timelines begin after written mockup approval, so approving your proof quickly is the fastest route to
            an in-hands date. Tell us your deadline in the quote and we will confirm whether standard or rush meets
            it.
          </p>
        </div>
      </section>

      {/* AU USE CASES */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            Patch Types &amp; Australian Use Cases
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-10 max-w-[720px] mx-auto">
            Embroidered, woven, PVC, chenille, and leather, all shipped free across Australia with no GST. A few of
            the communities we make for:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AU_USE_CASES.map((u) => {
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
            Australia Pricing, All-In USD
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] text-center mb-8 max-w-[720px] mx-auto">
            One price, in USD, with free DDP delivery to Australia included. Figures below are the per-piece
            starting price at 2&quot; x 2&quot; and 1,000 pieces; smaller runs cost more per piece. Get your exact
            price on the calculator.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Patch Type</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">From (2&quot;, 1,000 pcs)</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Shipping to AU</th>
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

      {/* WHY AU BRANDS CHOOSE PANDA */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-5">
            Why Australian buyers choose Panda Patches
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-700 leading-[1.8] space-y-4">
            <p>
              We deliver real production at scale and on deadline. When <strong>Wise</strong> rang the Nasdaq bell
              in Times Square, they came to us for custom patches at scale under a tight timeline, the full story is
              in our <Link href="/case-studies/wise-nasdaq-times-square-activation" prefetch={false} className="text-panda-green underline font-semibold">Wise case study</Link>. Australian clubs and businesses get that same
              capability with transparent, all-in pricing.
            </p>
            <p>
              No hidden fees and no GST surprises (we ship DDP), a low <strong>5-piece minimum</strong> so local
              clubs and small businesses are never priced out, a free mockup within 24 hours with unlimited
              revisions, free worldwide shipping, and a money-back guarantee. We make every patch in our own factory
              rather than brokering it out. Read the story on our <Link href="/about" prefetch={false} className="text-panda-green underline font-semibold">about page</Link>, see why the minimum is 5 in our <Link href="/custom-patches-no-minimum-order-5-pieces" prefetch={false} className="text-panda-green underline font-semibold">minimum-order guide</Link>, or browse <Link href="/bulk-custom-patches" prefetch={false} className="text-panda-green underline font-semibold">bulk orders</Link> for larger runs.
            </p>
            <p className="text-[14px] text-gray-500">
              Shipping elsewhere? We also ship free to the <Link href="/custom-patches-uk" prefetch={false} className="text-panda-green underline font-semibold">UK</Link> and <Link href="/custom-patches-canada" prefetch={false} className="text-panda-green underline font-semibold">Canada</Link>, both DDP with no local tax.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Custom Patches Australia: FAQ" faqs={auFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
