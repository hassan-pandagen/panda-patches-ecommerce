import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import WorkGallery from "@/components/bulk/WorkGallery";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { getProductReviewSchema } from "@/lib/productReviews";
import ProductReviews from "@/components/reviews/ProductReviews";
import { buildPageMetadata } from "@/lib/seo";
import { getClusterPageData, getUseCaseImages } from "@/lib/clusterPageData";
import { getFromPriceLabel } from "@/lib/pricingCalculator";
import { TRUSTPILOT_RATING } from "@/lib/reviewConstants";
import { COUNTRY_HREFLANG } from "@/lib/countryHreflang";

// CL532C_1 item B5. Same template as UK/CA/AU, including the DDP claim.
//
// That claim was DELIBERATELY held back when this page was first written: the
// orders table only shows 2 German-destination rows (one a 1-piece Sample Box
// with a confirmed FedEx delivery, the other still in production), neither
// recording how customs was actually handled, and EU import VAT
// (Einfuhrumsatzsteuer) is not the same regime as the UK's post-Brexit one —
// verified true for GB/CA/AU does not carry over automatically. That was a
// financial claim without evidence, not a product fact, so it was left out.
//
// CEO confirmed 2026-08-18: German shipments clear customs DDP, import VAT
// paid by us. Brought in line with UK/CA/AU in this pass.
//
// 2026-09-01 — FINISHED. This page shipped with 3 body sections where UK/CA/AU
// have 8, and it is the only one of the four GSC lists as "Discovered –
// currently not indexed". The other three are indexed and between them earn 420
// impressions. A page that is visibly a thinner copy of three near-identical
// siblings is a reasonable thing for a crawler to skip, so the fix is to finish
// it, not to request indexing on a page that has not earned the crawl.
//
// Added: quick facts, the customs explainer, delivery, pricing, and the close.
// The customs section is the reason this page can now beat the German field.
// On 1 July 2026 the EU abolished the EUR 150 duty-de-minimis and imposed a flat
// EUR 3 per-item duty (temporary, to 1 July 2028; a further ~EUR 2 handling fee
// is expected around November 2026). Verified against the European Commission's
// own guidance, zoll.de, and FedEx's customer notice — three sources, because
// this is a regulatory claim on a commercial page.
//
// That reform makes the DDP position MORE valuable than when it was written,
// and it directly answers the strongest German-market counter-pitch, which is
// "EU-made means no customs" (mottopatch.com ranks on exactly that argument).
// Most competitor pages still describe the pre-July rules.
const CANONICAL = "https://www.pandapatches.com/custom-patches-germany";

export const revalidate = 86400;

const germanyFAQs = [
  {
    question: "Do I pay import VAT or customs at the border on custom patches in Germany?",
    answer:
      "No. Panda Patches ships to Germany on a DDP (delivered duty paid) basis, so German import VAT (Einfuhrumsatzsteuer), customs, and any duties are already included and settled before your parcel arrives. The USD price you are quoted is the full amount you pay. There is no import VAT to settle at the border, no duty owed, and no customs handling fee from the courier on delivery.",
  },
  {
    question: "What currency are your prices in?",
    answer:
      "All prices are in US dollars (USD), and that USD figure is the complete, delivered price. We do not bill in EUR, but your card converts at the day's rate. There are no separate shipping, VAT, or customs charges added at any point; the USD number you approve is exactly what reaches us.",
  },
  {
    question: "How long does delivery to Germany take?",
    answer:
      "Standard delivery to Germany runs approximately 7 to 15 business days after you approve your digital mockup: production takes 7 to 14 business days, plus international transit via DHL or FedEx. Rush production is available when you need patches sooner, with the exact in-hand date confirmed by email within a few hours of ordering.",
  },
  {
    question: "Is there a minimum order for customers in Germany?",
    answer:
      "Just 5 pieces, the same low minimum we offer everywhere. No setup fees, no digitising fees, and no small-order surcharge, so a German club, brand, or individual pays the same per-piece quality on a small run as on a 1,000-piece order.",
  },
  {
    question: "Can I see my patch before it is made?",
    answer:
      "Yes. Every order includes a free digital mockup within 24 hours showing your exact colours, size, stitching, and backing, with unlimited free revisions until it is right. Production only starts after you approve. A free physical sample box is also available so you can feel the embroidery, PVC, woven, and leather quality before committing to a full order.",
  },
  {
    question: "Did the July 2026 EU customs change affect ordering patches from outside the EU?",
    answer:
      "It did, but not for our customers. On 1 July 2026 the EU abolished the EUR 150 customs-duty exemption for low-value consignments and replaced it with a flat EUR 3 duty per item, a temporary measure running until 1 July 2028, with a further handling fee of roughly EUR 2 per parcel expected from around November 2026. German import VAT at 19% was already due at any value. Together that means a parcel of twenty patches from a supplier who ships DAP can now attract 19% VAT, EUR 60 in per-item duty, and a courier clearance fee on arrival. Because Panda Patches ships DDP, we pay all of it before the parcel leaves, and the USD price you approved is still the whole cost.",
  },
  {
    question: "Can I give my patch sizes in centimetres?",
    answer:
      "Yes. The instant calculator works in inches because most of our volume is in the US, but our design team quotes and produces from centimetres without being asked — a recent German order was specified as 30 cm and 10 cm and made to those figures. Send the sizes in whatever unit you work in and the mockup will come back matching them.",
  },
  {
    question: "Do you make button-loop patches for trachten and lederhosen?",
    answer:
      "Yes. Button-loop backing is the traditional hang-loop attachment used on trachten and lederhosen, and it is one of our standard backing options — patches hang from a uniform or garment button rather than being sewn or ironed on, so they can be swapped between pieces. See our button-loop patches page for the full construction and other uses.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patches Germany | Free Shipping, No Import VAT, From 5 Pieces",
  description:
    "Custom patches shipped to Germany, no import VAT, customs, or hidden fees. The USD price is all you pay. Embroidered, PVC, woven, chenille, leather, and button-loop patches for trachten and lederhosen. Free 24h mockup, 5-piece minimum.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Patches Germany: Free Shipping, No Import VAT, One All-In USD Price",
  ogDescription:
    "We ship custom patches to Germany on a DDP basis, no import VAT or customs on arrival. Embroidered, PVC, woven, chenille, leather, and button-loop patches for trachten and lederhosen. Free 24-hour mockup, low 5-piece minimum.",
  twitterDescription:
    "Custom patches shipped to Germany with no import VAT or customs. The USD price is all you pay. Free 24h mockup, 5-piece minimum.",
  robots: { index: true, follow: true },
  alternates: { languages: COUNTRY_HREFLANG },
});

const articleSchema = generateArticleSchema({
  title: "Custom Patches in Germany: Free Shipping, No Import VAT, One All-In USD Price",
  description:
    "How Panda Patches serves customers in Germany: free DDP delivery with no import VAT or customs, all-in USD pricing, a low 5-piece minimum, a free 24-hour mockup, and button-loop patches for trachten and lederhosen.",
  datePublished: "2026-08-18",
  dateModified: "2026-08-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Custom Patches Germany", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(germanyFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches Shipped to Germany",
  description:
    "Custom embroidered, PVC, woven, chenille, leather, and button-loop patches shipped to Germany on a DDP basis with no import VAT or customs. All-in USD pricing, low 5-piece minimum, free 24-hour mockup.",
  brand: { "@type": "Brand", name: "Panda Patches" },
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
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "DE" },
    },
  },
  ...(getProductReviewSchema("custom-patches-germany") ?? {}),
};

const GERMANY_USE_CASES = [
  { title: "Trachten & Lederhosen", body: "Button-loop patches for the traditional hang-loop look on Bavarian and Alpine dress.", href: "/button-loop-patches", imgSlug: "custom-motorcycle-club-patches" },
  { title: "Motorcycle Clubs", body: "Back patches, rockers, and centre patches in embroidered or chenille.", href: "/custom-back-patches", imgSlug: "custom-motorcycle-club-patches" },
  { title: "Football & Sports Clubs", body: "Club crests and supporters' patches for grassroots and semi-pro sides.", href: "/custom-patches/woven", imgSlug: "industry-sports", contain: true },
  { title: "Scouts & Youth Groups", body: "Section badges, camp and event patches, and group identifiers.", href: "/custom-patches/embroidered", imgSlug: "custom-school-patches" },
  { title: "Schools & Universities", body: "House, society, and varsity-style chenille patches.", href: "/custom-patches/chenille", imgSlug: "custom-fraternity-sorority-patches" },
  { title: "Business & Brand Branding", body: "Logo patches for workwear, caps, and streetwear labels.", href: "/custom-patches/pvc", imgSlug: "custom-corporate-patches" },
];

export default async function CustomPatchesGermanyPage() {
  const { workSamples, trustBadges } = await getClusterPageData("embroidered");
  const useCaseImages = await getUseCaseImages(GERMANY_USE_CASES.map((u) => u.imgSlug));

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Custom Patches Germany"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Patches Germany"
        customSubheading="Free Shipping, No Import VAT, From 5 Pieces"
        customDescription="Custom embroidered, PVC, woven, chenille, leather, and button-loop patches shipped to Germany on a DDP basis, so the USD price you see is exactly what you pay, with no import VAT or customs at the border. Free digital mockup within 24 hours, low 5-piece minimum."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] max-w-[51.25rem]">
            Yes, Panda Patches ships custom patches to Germany, from a low 5-piece minimum, with free shipping via
            DHL or FedEx on a <strong>DDP (delivered duty paid)</strong> basis — no import VAT or customs fee on
            arrival. Beyond standard embroidered, PVC, woven, chenille, and leather patches, we also produce{" "}
            <strong>button-loop patches</strong> — the traditional hang-loop attachment used on{" "}
            <strong>trachten and lederhosen</strong>. Every order includes a free digital mockup within 24 hours,
            and production starts only after you approve it.
          </p>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[62.5rem]">
          <h2 className="text-[1.375rem] md:text-[1.875rem] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Germany Quick Facts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { k: "Currency", v: "USD (all-in)" },
              { k: "Shipping to Germany", v: "Free" },
              { k: "Einfuhrumsatzsteuer", v: "None, shipped DDP" },
              { k: "Minimum order", v: "5 pieces" },
              { k: "Mockup", v: "Free, 24 hours" },
              { k: "Turnaround", v: "Standard + rush" },
              { k: "Rating", v: `${TRUSTPILOT_RATING} Trustpilot` },
              { k: "Patches delivered", v: "1,000,000+" },
            ].map((f) => (
              <div key={f.k} className="bg-[#F9FAF5] rounded-2xl p-5 border border-gray-200 text-center">
                <p className="text-[0.6875rem] font-black uppercase tracking-wider text-gray-500 mb-1">{f.k}</p>
                <p className="text-[0.9375rem] md:text-[1.0625rem] font-black text-panda-dark leading-tight">{f.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorkGallery samples={workSamples} />

      {/* CUSTOMS / EINFUHRUMSATZSTEUER EXPLAINER
          The differentiator. Every figure here is public regulation, verified
          against three independent sources (European Commission guidance,
          zoll.de, FedEx customer notice) because a wrong number on a page that
          tells people what they will owe at the border is worse than no page. */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <h2 className="text-[1.5rem] md:text-[2.125rem] font-black text-panda-dark mb-4">
            Do German customers pay Einfuhrumsatzsteuer or customs?
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-4">
            <strong>No.</strong> Every German order ships DDP (delivered duty paid), which means we handle and
            pre-pay import formalities, German import VAT (Einfuhrumsatzsteuer) and any duty before the parcel
            reaches you. The USD price you approve at checkout is the entire cost. Nothing is collected at the
            door: no 19% VAT bill, no duty, no courier clearance fee.
          </p>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-6">
            That matters more in 2026 than it used to, because the rules changed in July — and most patch
            suppliers&rsquo; websites still describe the old ones.
          </p>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-7 mb-6">
            <p className="text-[0.6875rem] font-black uppercase tracking-wider text-gray-500 mb-4">
              What a non-EU parcel costs a German buyer since 1 July 2026
            </p>
            <ul className="space-y-3 text-[0.9375rem] md:text-[1rem] text-gray-700 leading-[1.7]">
              <li>
                <strong className="text-panda-dark">19% import VAT</strong> — due on non-EU goods at any value.
                The old &euro;22 VAT-free allowance disappeared back in July 2021.
              </li>
              <li>
                <strong className="text-panda-dark">The &euro;150 duty exemption is gone.</strong> Until 30 June
                2026, consignments under &euro;150 were free of customs duty. That exemption was abolished on
                1 July 2026.
              </li>
              <li>
                <strong className="text-panda-dark">A flat &euro;3 duty per item</strong> now applies to low-value
                consignments in its place — per <em>item</em>, not per parcel, so a box of twenty patches is not
                charged like one patch. It is a temporary measure running to 1 July 2028.
              </li>
              <li>
                <strong className="text-panda-dark">A further handling fee of roughly &euro;2 per parcel</strong> is
                expected from around November 2026.
              </li>
              <li>
                <strong className="text-panda-dark">Courier clearance charges are separate again</strong> — DHL,
                FedEx and UPS each add their own presentation fee on top of whatever the state collects.
              </li>
            </ul>
          </div>

          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-4">
            Run that against a real order. A German customer ordering 20 embroidered patches from a non-EU
            supplier that ships DAP now meets 19% VAT on the goods, &euro;3 per patch in duty, and a courier
            clearance fee — arriving after the patches do, on an invoice they did not agree to. On our
            <strong> August order to Moers</strong> — 20 patches, two sizes — the customer paid the quoted USD
            figure and nothing else.
          </p>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8]">
            This is the honest version of the &ldquo;buy EU-made and avoid customs&rdquo; argument you will see
            elsewhere. It is a real advantage against suppliers who ship DAP or DDU and let the border sort it
            out. It is not an advantage over us, because we have already paid it. Compare the delivered total,
            not the sticker price — and see our{" "}
            <Link href="/custom-patch-hidden-fees" prefetch={false} className="text-panda-green underline font-semibold">
              guide to hidden patch fees
            </Link>{" "}
            for how overseas patch pricing really works.
          </p>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <h2 className="text-[1.5rem] md:text-[2.125rem] font-black text-panda-dark mb-4">
            How long does delivery to Germany take?
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] mb-4">
            Standard delivery runs approximately <strong>7 to 15 business days</strong> from the moment you
            approve your mockup: production takes 7 to 14 business days and international transit is by DHL or
            FedEx with full tracking. Because we ship DDP, the parcel does not sit in customs waiting for you to
            pay something — clearance is arranged before it lands.
          </p>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8]">
            Need them sooner? Rush production puts qualifying orders in hand in as fast as 5 business days, with
            the confirmed date emailed within a few hours of your order. If we cannot meet your date, the rush
            fee comes off.
          </p>
        </div>
      </section>


      {/* USE CASES */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[62.5rem]">
          <h2 className="text-[1.5rem] md:text-[2.25rem] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Who We Make Patches For in Germany
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GERMANY_USE_CASES.map((u) => {
              const img = useCaseImages[u.imgSlug] as { asset?: unknown; alt?: string } | undefined;
              return (
                <Link
                  key={u.title}
                  href={u.href}
                  prefetch={false}
                  className="block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-panda-green transition-colors"
                >
                  <div className="p-6">
                    <h3 className="text-[1rem] font-black text-panda-dark mb-2">{u.title}</h3>
                    <p className="text-[0.875rem] text-gray-600 leading-[1.6]">{u.body}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRACHTEN / LEDERHOSEN HOOK */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[52rem]">
          <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-4">
            Button-loop patches for trachten and lederhosen
          </h2>
          <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
            Button-loop is a construction detail, not a decoration: the patch hangs from a loop that fits over a
            garment button, the classic attachment for trachten and lederhosen, so it can be swapped between
            pieces without sewing or ironing.
          </p>
          <p className="text-[1rem] text-gray-700 leading-[1.8]">
            See the full construction, sizing, and other button-loop uses on our{" "}
            <Link href="/button-loop-patches" prefetch={false} className="text-panda-green underline font-semibold">
              button-loop patches
            </Link>{" "}
            page.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <h2 className="text-[1.5rem] md:text-[2.125rem] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            Germany Pricing, All-In USD
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-600 leading-[1.7] text-center mb-8 max-w-[45rem] mx-auto">
            One price, in USD, with free DDP delivery to Germany included. Figures below are the per-piece
            starting price at 2&quot; x 2&quot; and 1,000 pieces; smaller runs cost more per piece. Get your
            exact, instant price on the calculator.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-4 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[0.75rem] uppercase tracking-wider">Patch Type</th>
                  <th className="text-left px-5 py-4 font-bold text-[0.75rem] uppercase tracking-wider bg-panda-green text-panda-dark">From (2&quot;, 1,000 pcs)</th>
                  <th className="text-left px-5 py-4 font-bold text-[0.75rem] uppercase tracking-wider">Delivered to Germany</th>
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
            Prices are all-in USD with free worldwide shipping and German import VAT already paid. For an exact
            quote at any size or quantity from 5 pieces up, use the{" "}
            <Link href="/custom-patches" prefetch={false} className="text-panda-green underline font-semibold">
              instant calculator
            </Link>.
          </p>
        </div>
      </section>

      {/* WHY GERMAN BUYERS CHOOSE PANDA */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-6">
            Ordering from Germany, practically
          </h2>
          <div className="space-y-5 text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8]">
            <p>
              <strong className="text-panda-dark">Give us sizes in centimetres if that is how you think.</strong>{" "}
              The calculator works in inches because most of our volume is US, but our design team quotes in cm
              without being asked — a recent German order specified &ldquo;30 cm and 10 cm&rdquo; and was produced
              from those figures. You never have to convert anything to place an order.
            </p>
            <p>
              <strong className="text-panda-dark">The minimum is 5 pieces, on every type and every size.</strong>{" "}
              Not 50, not 100, and not 5-on-embroidered-only. A club ordering five crests pays the same per-piece
              quality and gets the same free mockup as a 1,000-piece corporate run, with no setup, digitising, or
              small-order fee.
            </p>
            <p>
              <strong className="text-panda-dark">Approve the design before anything is made.</strong> Your free
              digital mockup arrives within 24 hours with your exact colours, size, stitching and backing, and
              revisions are unlimited until it is right. Production starts only when you say so — which matters
              more when the supplier is on another continent.
            </p>
            <p>
              <strong className="text-panda-dark">We manufacture; we do not resell.</strong> The patches are made
              in our own facility, which is why rush capacity scales and why we can publish our real production
              limits rather than a sales estimate. Our{" "}
              <Link href="/patch-manufacturability-specs" prefetch={false} className="text-panda-green underline font-semibold">
                manufacturability specifications
              </Link>{" "}
              are open and free to cite.
            </p>
          </div>
        </div>
      </section>

      <ProcessSection />

      <ProductReviews productKey="custom-patches-germany" productName="Custom Patches Germany" />

      <CategoryFAQ title="Custom Patches Germany FAQ" faqs={germanyFAQs} />

      <CTASection />
      <Footer />
    </main>
  );
}
