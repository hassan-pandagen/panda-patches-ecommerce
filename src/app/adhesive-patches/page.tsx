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
import ReviewsSection from "@/components/home/ReviewsSection";
import CTASection from "@/components/home/CTASection";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { getClusterPageData } from "@/lib/clusterPageData";
import { getFromPriceLabel } from "@/lib/pricingCalculator";

const CANONICAL = "https://www.pandapatches.com/adhesive-patches";

export const revalidate = 86400;

const adhesiveFAQs = [
  {
    question: "What are adhesive patches?",
    answer:
      "Adhesive patches, also called peel-and-stick or sticker patches, have a pre-applied adhesive layer on the back covered by a release liner. You peel off the liner and press the patch onto a clean, dry surface, no iron and no sewing required. They are made for fast, temporary placement on apparel, signage, packaging, laptops, and event giveaways.",
  },
  {
    question: "Are adhesive patches permanent?",
    answer:
      "No. Peel-and-stick adhesive is a one-time, temporary bond designed to hold through an event or a short wear period, not through laundry. It is ideal for trade shows, conferences, product launches, and giveaways where the patch only needs to last hours or days. For a permanent bond on a garment that will be washed, choose iron-on or sew-on backing instead.",
  },
  {
    question: "Which patch types support adhesive backing?",
    answer:
      "Peel-and-stick adhesive works best on flat-backed patches: embroidered, printed (sublimation), and PVC. Heavily textured backs such as chenille do not bond well to sticker adhesive, and leather patches are usually heat-pressed or sewn instead. If you are unsure whether your design suits adhesive backing, our team will advise on the proof before production.",
  },
  {
    question: "Can I wash a garment with an adhesive patch on it?",
    answer:
      "No. Adhesive patches are not wash-durable, the bond breaks down in water and detergent. If you need a patch that survives the wash, order the same design with iron-on (lasts roughly 50 washes) or sew-on (permanent) backing. Many customers order adhesive for the event, then reorder a sew-on batch for the keepsake version.",
  },
  {
    question: "How much do adhesive patches cost?",
    answer:
      "Peel-and-stick adhesive is a free backing, so the patch costs the same as the base price for its type, size, and quantity with no upcharge. Embroidered patches start at " + getFromPriceLabel("Custom Embroidered Patches") + " per piece and printed patches at " + getFromPriceLabel("Custom Printed Patches") + " per piece, both at 2 by 2 inches and 1,000 pieces. Smaller runs cost more per piece. The price includes free worldwide shipping and a mockup in 12 to 24 hours.",
  },
  {
    question: "What are adhesive patches used for?",
    answer:
      "Common uses include trade-show and conference giveaways, product-launch swag, temporary event branding, name tags, packaging and box seals, laptop and water-bottle stickers, and seasonal promotions. They are popular when you want the look of a real embroidered or PVC patch with the convenience of a sticker.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Adhesive Patches | Peel-and-Stick Sticker Backing",
  description:
    "Custom peel-and-stick adhesive patches for events, trade shows, and giveaways. Embroidered, printed, and PVC. Free backing, no iron or sewing. 5-piece minimum, free worldwide shipping, mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Adhesive Patches: Peel-and-Stick, Sticker-Style, Free Backing",
  ogDescription:
    "Peel-and-stick adhesive patches for short-term branding and event swag. The look of a real patch with the convenience of a sticker. From a low 5-piece minimum.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Adhesive Patches: Peel-and-Stick Backing for Events and Giveaways",
  description:
    "Guide to custom peel-and-stick adhesive (sticker) patches at Panda Patches. How they work, compatible patch types, the right and wrong uses, and pricing. Low 5-piece minimum, free worldwide shipping, mockup in 12 to 24 hours.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Backing Options", url: "https://www.pandapatches.com/custom-patches/backing-options" },
  { name: "Adhesive Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(adhesiveFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Adhesive (Peel-and-Stick) Patches",
  description:
    "Custom patches with free peel-and-stick adhesive backing for events, trade shows, and giveaways. Available on embroidered, printed, and PVC. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.74",
    highPrice: "4.60",
    offerCount: "4",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

export default async function AdhesivePatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("printed");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[
          { label: "Custom Patches", href: "/custom-patches" },
          { label: "Backing Options", href: "/custom-patches/backing-options" },
        ]}
        currentPage="Adhesive Patches"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Adhesive Patches"
        customSubheading="Peel-and-Stick Backing, Free, From 5 Pieces"
        customDescription="The look of a real embroidered or PVC patch with the convenience of a sticker. Peel the liner, press it on, done. Made for events, trade shows, and giveaways. Mockup in 12 to 24 hours, free worldwide shipping."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            Yes, Panda Patches makes <strong>peel-and-stick adhesive patches</strong> for short-term branding
            and event swag, with a free backing and a low 5-piece minimum. You peel off the release liner and
            press the patch onto a clean, dry surface, no iron and no sewing. Adhesive backing is best on flat
            embroidered, printed, and PVC patches and is built for a one-time, temporary hold through an event,
            not through the laundry. For a wash-proof version of the same design, choose iron-on or sew-on.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />

      {/* BEST USE / NOT FOR */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Where Peel-and-Stick Shines
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[17px] font-black text-panda-dark mb-2">Great for</h3>
              <ul className="text-[14px] text-gray-600 leading-[1.8] list-disc pl-5 space-y-1">
                <li>Trade-show and conference giveaways</li>
                <li>Product launches and event swag bags</li>
                <li>Temporary apparel and banner branding</li>
                <li>Name tags, box seals, and packaging</li>
                <li>Laptop, notebook, and water-bottle stickers</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[17px] font-black text-panda-dark mb-2">Not the right pick for</h3>
              <ul className="text-[14px] text-gray-600 leading-[1.8] list-disc pl-5 space-y-1">
                <li>Garments that will be washed (use <Link href="/sew-on-patches" prefetch={false} className="text-panda-green underline font-semibold">sew-on</Link> or <Link href="/custom-iron-on-patches" prefetch={false} className="text-panda-green underline font-semibold">iron-on</Link>)</li>
                <li>Long-term, permanent placement</li>
                <li>Heavily textured chenille backs</li>
                <li>High-flex areas that peel under stress</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed text-center mt-6">
            See how adhesive compares with all six backings in the <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">backing options guide</Link>.
          </p>
        </div>
      </section>

      <Promises bgColor="bg-white" />
      <ReviewsSection />
      <ProcessSection />

      {/* SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Order Custom Peel-and-Stick Patches From 5 Pieces
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Adhesive patches give you the premium look of an embroidered, printed, or PVC patch with the
              grab-and-go convenience of a sticker. The backing is a pressure-sensitive adhesive under a peel
              liner, so anyone can apply one in seconds without tools. That makes them a favorite for trade
              shows, product launches, and event giveaways where speed matters more than permanence. Adhesive is
              a free backing, so you only pay the base patch price for your type, size, and quantity.
            </p>
            <p>
              Keep in mind that peel-and-stick is a temporary bond and is not made to survive washing. If the
              patch needs to live on a uniform or a garment that goes through the laundry, order the same artwork
              with iron-on or sew-on backing. A common approach is to hand out adhesive patches at the event and
              offer a sew-on reorder as the lasting version. Every order includes free worldwide shipping, a
              digital mockup in 12 to 24 hours, unlimited free revisions, and a money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full pb-10 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[14px] text-gray-500 leading-relaxed">
            <span className="font-bold text-panda-dark">Related:</span>{" "}
            <Link href="/comparing-patch-backings-which-one-is-right-for-you" prefetch={false} className="text-panda-green underline font-semibold">Comparing Patch Backings</Link>
            {" · "}
            <Link href="/custom-patches/printed" prefetch={false} className="text-panda-green underline font-semibold">Printed patches</Link>
            {" · "}
            <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">All backing options</Link>
          </p>
        </div>
      </section>

      <CategoryFAQ title="Adhesive Patches FAQ" faqs={adhesiveFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
