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

      <WorkGallery samples={workSamples} />

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

      <ProcessSection />

      <ProductReviews productKey="custom-patches-germany" productName="Custom Patches Germany" />

      <CategoryFAQ title="Custom Patches Germany FAQ" faqs={germanyFAQs} />

      <CTASection />
      <Footer />
    </main>
  );
}
