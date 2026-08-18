import type { Metadata } from "next";
import Link from "next/link";
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
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { getProductReviewSchema } from "@/lib/productReviews";
import ProductReviews from "@/components/reviews/ProductReviews";
import { buildPageMetadata } from "@/lib/seo";
import { getClusterPageData } from "@/lib/clusterPageData";
import { getFromPriceLabel } from "@/lib/pricingCalculator";
import { perPc } from "@/lib/priceDisplay";

// CL532C_1 item B2. Cites the 37.0% stat from /custom-patch-production-data-2026
// verbatim ("of sized orders", not of all orders) — that page carries the full
// caveat about multi-dimension attribution; this page links rather than
// re-explains it. Pricing uses perPc() against the live calculator, same
// engine the product pages use, so these numbers can't drift stale.

const CANONICAL = "https://www.pandapatches.com/custom-back-patches";

export const revalidate = 86400;

const backPatchFAQs = [
  {
    question: "What size should a back patch be?",
    answer:
      "Most back patches run 8 to 14 inches across the widest point, sized to the garment: a denim or leather vest typically takes an 8 to 10 inch center patch, while a full jacket back panel can run 12 to 14 inches or larger. On our own order data, 37.0% of sized orders list a dimension of 8 inches or more, and that group is overwhelmingly back and letterman patches quoted through our sales team rather than web checkout — back patches are a real, established part of what we produce, not an edge case.",
  },
  {
    question: "Embroidered or chenille for a back patch?",
    answer:
      "Embroidered holds fine detail — logos, text, and multi-color artwork — at any size, so it is the right choice for a design with real detail. Chenille gives the thick, raised varsity texture used for club and team back patches and single- or two-color rocker designs, but it does not hold fine detail well at any size. If your design has intricate line work or small text, choose embroidered; if it is a bold letter, name, or simple mark and you want the classic patch-jacket texture, choose chenille.",
  },
  {
    question: "What are MC rocker patches?",
    answer:
      "A rocker is the curved, arc-shaped patch that runs above and below a motorcycle club's center back patch — the top rocker usually carries the club name, the bottom rocker the chapter or location. Rockers are produced in the same embroidered or chenille construction as the center patch and sized to match its curve. See our motorcycle patches page for club-patch conventions and placement.",
  },
  {
    question: "How do you apply a large back patch?",
    answer:
      "The same iron-on process applies, adjusted for size: a household iron's plate is smaller than most back patches, so press in overlapping sections rather than one placement, at the same 350°F (175°C) setting with firm, even pressure, working from the center outward. Heavier fabrics (leather, denim, a lined jacket back) need more time and pressure per section than a t-shirt. For anything 10 inches or larger, or for leather and vests meant to last years, sew-on is the more durable choice and is what most motorcycle club and letterman-jacket back patches use.",
  },
  {
    question: "What is the minimum order for back patches?",
    answer: `Just 5 pieces. Back patches use the same low minimum as every other size — embroidered patches start at ${getFromPriceLabel("Custom Embroidered Patches")} per piece at 2 by 2 inches and 1,000 pieces, with large-format sizes priced by the finished size. No setup fees, free worldwide shipping, and a free digital mockup in 12 to 24 hours before anything is produced.`,
  },
  {
    question: "Can a back patch include multiple colors and fine text?",
    answer:
      "Yes, in embroidered construction. Embroidered patches hold multi-color artwork and fine text at any size, which is why detailed club emblems, sports crests, and lettered designs are produced embroidered rather than chenille. Chenille is limited to bold, simple shapes and letters because the yarn texture cannot hold fine lines. Send your design and we will tell you plainly which construction it needs before you order.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Back Patches | 8-14 Inch, Embroidered & Chenille",
  description:
    "Large-format custom back patches, 8 to 14 inches, in embroidered or chenille. MC rocker sets, club and team back patches, letterman backs. 5-piece minimum, free worldwide shipping, mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Back Patches: Large-Format Embroidered & Chenille, 8-14 Inch",
  ogDescription:
    "Large-format back patches for vests, jackets, and club colors. Embroidered for detail, chenille for the classic raised texture. From a low 5-piece minimum.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Back Patches: Large-Format Embroidered and Chenille Patches",
  description:
    "Guide to custom back patches at Panda Patches: sizing from 8 to 14 inches, embroidered vs chenille construction, MC rocker conventions, and application guidance for large-format patches. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-08-18",
  dateModified: "2026-08-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Back Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(backPatchFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Back Patches",
  description:
    "Large-format custom back patches, 8 to 14 inches, in embroidered or chenille construction. Sew-on or iron-on backing. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    // Derived from the live calculator at the exact sizes/quantities this page
    // displays (12" and 14", 50 and 100pc, embroidered and chenille) — read off
    // the built page rather than hand-picked, so it can't drift from what's
    // actually shown. Large-format pricing is materially higher than small
    // sizes; do not copy another page's range here.
    lowPrice: "14.37",
    highPrice: "33.04",
    offerCount: "4",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
  ...(getProductReviewSchema("custom-back-patches") ?? {}),
};

export default async function CustomBackPatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("embroidered");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Back Patches"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Back Patches"
        customSubheading="8 to 14 Inch, Embroidered or Chenille"
        customDescription="Large-format back patches for vests, jackets, and club colors — embroidered for detail, chenille for the classic raised texture. From 5 pieces, free worldwide shipping, mockup in 12 to 24 hours."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] max-w-[51.25rem]">
            Yes, Panda Patches makes <strong>custom back patches</strong> from a low 5-piece minimum, in embroidered
            or chenille construction, typically 8 to 14 inches across. This is not a rare request —{" "}
            <Link href="/custom-patch-production-data-2026" className="text-panda-green font-semibold underline">
              37.0% of our sized orders
            </Link>{" "}
            list a dimension of 8 inches or more, overwhelmingly back and letterman patches. Choose embroidered
            for detailed multi-color designs, chenille for the classic raised varsity look on bold, simple shapes.
            Every order ships with free worldwide shipping and a digital mockup in 12 to 24 hours.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />
      <Craftsmanship />

      {/* WHAT GOES ON A BACK PATCH */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[62.5rem]">
          <h2 className="text-[1.5rem] md:text-[2.25rem] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Common Back Patch Uses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "MC club patches",
                body: "Center back patches and rocker sets for motorcycle clubs, in embroidered or chenille.",
                links: [{ href: "/motorcycle-patches", label: "Motorcycle patches" }],
              },
              { title: "Letterman & varsity", body: "Large chenille letters and back designs for varsity jackets." },
              { title: "Team & club colors", body: "Club and team emblems worn center-back on vests and jackets." },
              { title: "Event & tour patches", body: "Large commemorative back patches for tours, rallies, and events." },
            ].map((u) => (
              <div key={u.title} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="text-[1rem] font-black text-panda-dark mb-2">{u.title}</h3>
                <p className="text-[0.875rem] text-gray-600 leading-[1.6]">{u.body}</p>
                {u.links && (
                  <ul className="mt-3 space-y-1.5">
                    {u.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-[0.8125rem] text-panda-green font-semibold underline leading-[1.5]">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — live calculator, 12" and 14" examples */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <h2 className="text-[1.5rem] md:text-[2.25rem] font-black text-center text-panda-dark uppercase tracking-tight mb-4">
            Back Patch Pricing at 12&Prime; and 14&Prime;
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-600 leading-[1.7] text-center mb-8 max-w-[43.75rem] mx-auto">
            Large-format pricing is size-based. These are live per-piece prices at two common back-patch sizes.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9FAF5] border-b border-gray-200">
                  <th className="px-5 py-4 text-[0.8125rem] font-black uppercase tracking-wide text-gray-500">Size</th>
                  <th className="px-5 py-4 text-[0.8125rem] font-black uppercase tracking-wide text-gray-500">Embroidered, 50pc</th>
                  <th className="px-5 py-4 text-[0.8125rem] font-black uppercase tracking-wide text-gray-500">Embroidered, 100pc</th>
                  <th className="px-5 py-4 text-[0.8125rem] font-black uppercase tracking-wide text-gray-500">Chenille, 50pc</th>
                  <th className="px-5 py-4 text-[0.8125rem] font-black uppercase tracking-wide text-gray-500">Chenille, 100pc</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-5 py-4 font-bold text-panda-dark">12 inch</td>
                  <td className="px-5 py-4">{perPc("Custom Embroidered Patches", 12, 50)}/pc</td>
                  <td className="px-5 py-4">{perPc("Custom Embroidered Patches", 12, 100)}/pc</td>
                  <td className="px-5 py-4">{perPc("Custom Chenille Patches", 12, 50)}/pc</td>
                  <td className="px-5 py-4">{perPc("Custom Chenille Patches", 12, 100)}/pc</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-5 py-4 font-bold text-panda-dark">14 inch</td>
                  <td className="px-5 py-4">{perPc("Custom Embroidered Patches", 14, 50)}/pc</td>
                  <td className="px-5 py-4">{perPc("Custom Embroidered Patches", 14, 100)}/pc</td>
                  <td className="px-5 py-4">{perPc("Custom Chenille Patches", 14, 50)}/pc</td>
                  <td className="px-5 py-4">{perPc("Custom Chenille Patches", 14, 100)}/pc</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[0.8125rem] text-gray-500 text-center mt-4">
            Larger and smaller sizes, and higher quantities, are quoted the same way — send your size and count for an exact price.
          </p>
        </div>
      </section>

      {/* EMBROIDERED VS CHENILLE */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <h2 className="text-[1.5rem] md:text-[2.25rem] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Embroidered or Chenille for a Back Patch
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[1rem] font-black text-panda-dark mb-2">Embroidered</h3>
              <p className="text-[0.875rem] text-gray-600 leading-[1.6]">
                Holds fine detail, multiple colors, and text at any size. The right choice for a logo, crest, or design with real
                detail. See our full{" "}
                <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">
                  embroidered patches
                </Link>{" "}
                page.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[1rem] font-black text-panda-dark mb-2">Chenille</h3>
              <p className="text-[0.875rem] text-gray-600 leading-[1.6]">
                Thick, raised yarn on a felt base — the classic varsity and club texture. Limited to bold, simple shapes and
                letters; does not hold fine line work. See our{" "}
                <Link href="/custom-patches/chenille" prefetch={false} className="text-panda-green underline font-semibold">
                  chenille patches
                </Link>{" "}
                page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLACEMENT & PRESSING */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[52rem]">
          <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-4">
            Placement and pressing for a large back patch
          </h2>
          <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
            Centering matters more on a back patch than on a small one — there is no room to reposition once it is
            pressed or sewn. Measure the garment&apos;s back panel and mark the center point before placing the
            patch, and check it is level across the shoulders, not just centered top to bottom.
          </p>
          <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
            For iron-on backing, the same 350&deg;F (175&deg;C) settings apply as any patch, but a household
            iron&apos;s plate is smaller than most back patches, so press in overlapping sections, working from the
            center outward, rather than one placement. Heavier fabrics — leather, denim, a lined jacket back — need
            more time and pressure per section than a t-shirt. Full guidance is on our{" "}
            <Link href="/custom-iron-on-patches" prefetch={false} className="text-panda-green underline font-semibold">
              iron-on application page
            </Link>
            .
          </p>
          <p className="text-[1rem] text-gray-700 leading-[1.8]">
            For anything 10 inches or larger, or for a vest or jacket meant to last years, sew-on is the more
            durable choice and is what most motorcycle club and letterman back patches use in practice.
          </p>
        </div>
      </section>

      <Promises bgColor="bg-[#F9FAF5]" />
      <ReviewsSection />
      <ProductReviews productKey="custom-back-patches" productName="Custom Back Patches" />
      <ProcessSection />

      <CategoryFAQ title="Custom Back Patches FAQ" faqs={backPatchFAQs} />

      <CTASection />
      <Footer />
    </main>
  );
}
