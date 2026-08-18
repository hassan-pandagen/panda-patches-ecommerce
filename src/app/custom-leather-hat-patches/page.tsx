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
import { perPc } from "@/lib/priceDisplay";

// CL532C_1 item B3. Bridges the two existing parent pages: /custom-patches/leather
// (product category) and /patches-for-hats (Sanity patchStyle, verified live
// 2026-08-18). Genuine-hide-default and laser-engraved/UV-printed wording mirrors
// the canon already established on /ai-info/products verbatim, so this page cannot
// contradict it.

const CANONICAL = "https://www.pandapatches.com/custom-leather-hat-patches";

export const revalidate = 86400;

const leatherHatFAQs = [
  {
    question: "What size should a leather patch be for a hat?",
    answer:
      "Most leather hat patches run 2.25 to 3 inches to fit the front panel of a structured cap or trucker hat cleanly, without crowding the seams. A round or oval patch reads slightly smaller than a square one at the same width, so we size to the actual panel on your mockup rather than a single fixed number.",
  },
  {
    question: "Is genuine or faux leather better for a hat patch?",
    answer:
      "Genuine leather is what we produce by default — it is the material behind the premium, retail-grade look hat brands want, and it is what our own hat patches ship in unless an order specifies otherwise. Premium synthetic (PU) leather is available on request and takes the same engraving and printing. Both are real options; genuine is the default because it is what most hat-brand orders actually choose.",
  },
  {
    question: "Laser-engraved or UV-printed leather patch?",
    answer:
      "Laser engraving is a single-tone burn into the leather surface — a debossed, tonal look that reads as premium and is the traditional hat-patch style. UV printing reproduces full color, including true gradients and photographic artwork, on top of the leather. Choose engraving for a clean logo or wordmark in one tone; choose UV printing if your design needs multiple colors or a gradient.",
  },
  {
    question: "How does a leather patch attach to a hat?",
    answer:
      "Sew-on and adhesive are both available. Sew-on is the more durable choice for a hat that gets worn hard and washed occasionally. Adhesive iron-on works, but leather needs a pressing cloth between the iron and the patch every time — a hot iron placed directly on leather can stick or scorch it, even though the temperature and timing are otherwise the same as any other patch type.",
  },
  {
    question: "What is the minimum order for leather hat patches?",
    answer: `Just 5 pieces. Leather patches for a 3-inch design start at ${perPc("Custom Leather Patches", 3, 1000)} per piece at 1,000 pieces and ${perPc("Custom Leather Patches", 3, 50)} per piece at the 50-piece starter tier. No setup fees, free worldwide shipping, and a free digital mockup in 12 to 24 hours that previews the emboss or print, the color, and the edge before production.`,
  },
  {
    question: "Can a leather hat patch include a full-color logo?",
    answer:
      "Yes, with UV printing rather than laser engraving. UV printing reproduces full color, gradients, and photographic detail on the leather surface. If your logo is a single flat color or a clean wordmark, laser engraving gives the more traditional, higher-contrast hat-patch look at a similar price.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Leather Hat Patches | Genuine Leather, 2.25-3 Inch",
  description:
    "Custom leather patches for hats, genuine leather by default. Laser-engraved or UV-printed, 2.25 to 3 inch panel sizing, sew-on or adhesive backing. 5-piece minimum, free worldwide shipping, mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Leather Hat Patches: Genuine Leather, Laser-Engraved or UV-Printed",
  ogDescription:
    "Premium leather patches for hats and caps, genuine hide by default, sized to fit the front panel. From a low 5-piece minimum.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Leather Hat Patches: Genuine Leather, Laser-Engraved or UV-Printed",
  description:
    "Guide to custom leather patches for hats at Panda Patches: genuine-hide default, laser engraving vs UV printing, 2.25 to 3 inch hat-panel sizing, and backing options. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-08-18",
  dateModified: "2026-08-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Leather Hat Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(leatherHatFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Leather Hat Patches",
  description:
    "Custom leather patches for hats, genuine leather by default, laser-engraved or UV-printed, sized for a hat's front panel. Sew-on or adhesive backing. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: perPc("Custom Leather Patches", 3, 1000).replace("$", ""),
    highPrice: perPc("Custom Leather Patches", 3, 50).replace("$", ""),
    offerCount: "2",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
  ...(getProductReviewSchema("custom-leather-hat-patches") ?? {}),
};

export default async function CustomLeatherHatPatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("leather");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Leather Hat Patches"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Leather Hat Patches"
        customSubheading="Genuine Leather, Laser-Engraved or UV-Printed"
        customDescription="Premium leather patches sized to a hat's front panel, genuine leather by default. Laser-engraved for a clean single-tone mark, UV-printed for full color. From 5 pieces, free worldwide shipping, mockup in 12 to 24 hours."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.8] max-w-[51.25rem]">
            Yes, Panda Patches makes <strong>custom leather patches for hats</strong> from a low 5-piece minimum,
            in genuine leather by default. Panels typically run 2.25 to 3 inches to fit a structured cap or trucker
            hat front cleanly. Laser engraving gives a single-tone, debossed look for a clean logo or wordmark; UV
            printing reproduces full color and gradients. Every order ships with a free digital mockup in 12 to 24
            hours that previews the emboss or print before production.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />
      <Craftsmanship />

      {/* GENUINE VS SYNTHETIC */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <h2 className="text-[1.5rem] md:text-[2.25rem] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Genuine Leather Is the Default
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[1rem] font-black text-panda-dark mb-2">Genuine leather</h3>
              <p className="text-[0.875rem] text-gray-600 leading-[1.6]">
                What we produce by default — the material behind the premium, retail-grade look most hat-brand
                orders want. Takes both laser engraving and UV printing.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[1rem] font-black text-panda-dark mb-2">Premium synthetic (PU)</h3>
              <p className="text-[0.875rem] text-gray-600 leading-[1.6]">
                Available on request. A real alternative, not a downgrade — same engraving and printing options,
                specify it when you order if you want it instead of genuine hide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LASER-ENGRAVED VS UV-PRINTED */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
          <h2 className="text-[1.5rem] md:text-[2.25rem] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Laser-Engraved or UV-Printed
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[1rem] font-black text-panda-dark mb-2">Laser-engraved</h3>
              <p className="text-[0.875rem] text-gray-600 leading-[1.6]">
                A single-tone burn into the leather surface — a debossed, tonal look. The traditional hat-patch
                style, best for a clean logo or wordmark in one color.
              </p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[1rem] font-black text-panda-dark mb-2">UV-printed</h3>
              <p className="text-[0.875rem] text-gray-600 leading-[1.6]">
                Full color on the leather surface, including true gradients and photographic artwork. Choose this
                when your design needs more than one tone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HAT-PANEL SIZING */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[52rem]">
          <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-4">
            Sizing a leather patch to the hat
          </h2>
          <p className="text-[1rem] text-gray-700 leading-[1.8] mb-4">
            2.25 to 3 inches is the range that fits a structured cap or trucker hat&apos;s front panel without
            crowding the seams or the brim. A round or oval patch reads slightly smaller than a square patch at the
            same width, since the corners of a square shape carry more visible area — we size to the actual panel
            on your mockup rather than a single fixed number.
          </p>
          <p className="text-[1rem] text-gray-700 leading-[1.8]">
            For the full range of hat-patch styles, shapes, and placement beyond leather, see our{" "}
            <Link href="/patches-for-hats" prefetch={false} className="text-panda-green underline font-semibold">
              patches for hats
            </Link>{" "}
            page. For leather in other sizes and applications, see the{" "}
            <Link href="/custom-patches/leather" prefetch={false} className="text-panda-green underline font-semibold">
              full leather patches
            </Link>{" "}
            page.
          </p>
        </div>
      </section>

      <Promises bgColor="bg-white" />
      <ReviewsSection />
      <ProductReviews productKey="custom-leather-hat-patches" productName="Custom Leather Hat Patches" />
      <ProcessSection />

      <CategoryFAQ title="Custom Leather Hat Patches FAQ" faqs={leatherHatFAQs} />

      <CTASection />
      <Footer />
    </main>
  );
}
