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

const CANONICAL = "https://www.pandapatches.com/sew-on-patches";

export const revalidate = 86400;

const sewOnFAQs = [
  {
    question: "Is sew-on backing free?",
    answer:
      "Yes. Sew-on is a free backing on every patch type at Panda Patches, including embroidered, woven, printed, leather, PVC, and chenille. A sew-on patch ships with a clean finished edge and no adhesive, ready to be stitched on by hand or machine. There is no upcharge, no setup fee, and no minimum-quantity surcharge.",
  },
  {
    question: "How do I sew a patch onto a garment?",
    answer:
      "Pin or tack the patch in position first. Thread a needle with thread that matches the patch border (or use a sewing machine with a zig-zag or straight stitch). Stitch a continuous line around the outer edge, about 1.5 to 3mm in from the border, keeping the patch flat against the fabric. Knot off on the inside. For machine sewing, a denim or heavy-duty needle handles the dense border. A whip stitch by hand gives the cleanest result on embroidered and chenille patches.",
  },
  {
    question: "Should I choose sew-on or iron-on backing?",
    answer:
      "Choose sew-on when the garment is washed often, washed industrially, or made of a fabric that cannot take heat (nylon, polyester athletic wear, waterproof shells, leather goods). Sew-on is permanent and survives unlimited wash cycles. Choose iron-on for speed and convenience on cotton, denim, and canvas that is washed occasionally. Many buyers do both: iron the patch on to hold position, then sew the edge for permanence.",
  },
  {
    question: "Can a sew-on patch be removed later?",
    answer:
      "Yes. Because a sew-on patch is held by thread rather than adhesive, you can unpick the stitches with a seam ripper and remove the patch cleanly, leaving only small needle holes that close up after a wash. This makes sew-on a good choice for rental uniforms, loaner gear, and garments that may be reassigned.",
  },
  {
    question: "Do PVC and chenille patches come with sew-on backing?",
    answer:
      "Yes. Sew-on is the default backing for PVC and chenille because neither can take the heat of an iron-on press: PVC rubber distorts and chenille yarn is too textured for adhesive to bond. Both come with a stitch channel or border suited to sewing. Hook-and-loop Velcro (+$30 per order) is also available on both for a removable option.",
  },
  {
    question: "What is the minimum order for sew-on patches?",
    answer:
      "5 pieces for embroidered, printed, leather, PVC, and chenille; 10 pieces for woven because of the loom setup. Base patches start at " + getFromPriceLabel("Custom Embroidered Patches") + " per piece for embroidered at 2 by 2 inches and 1,000 pieces, with no setup or digitizing fees. Every order includes free worldwide shipping and a digital mockup in 12 to 24 hours.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Sew-On Patches | Free Backing, Low 5-Piece Min",
  description:
    "Custom sew-on patches with a free finished-edge backing on every patch type. Permanent, wash-proof attachment for uniforms and frequently washed garments. 5-piece minimum, free worldwide shipping, mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Sew-On Patches: Permanent Backing, Free, Low 5-Piece Minimum",
  ogDescription:
    "Sew-on patches in every type, free backing, no setup fees. The most durable, wash-proof way to attach a patch. How to sew one on, and when to choose it over iron-on.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Sew-On Patches: Free Backing, Durability, and How to Apply",
  description:
    "Complete guide to custom sew-on patches at Panda Patches. Free finished-edge backing on every patch type, wash durability, how to sew a patch on by hand or machine, and when to choose sew-on over iron-on. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Backing Options", url: "https://www.pandapatches.com/custom-patches/backing-options" },
  { name: "Sew-On Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(sewOnFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Sew-On Patches",
  description:
    "Custom patches with free sew-on backing. The most durable, wash-proof attachment, available on embroidered, woven, printed, leather, PVC, and chenille. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.74",
    highPrice: "4.60",
    offerCount: "6",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

export default async function SewOnPatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("woven");

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
        currentPage="Sew-On Patches"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Sew-On Patches"
        customSubheading="Free Backing, Permanent Hold, From 5 Pieces"
        customDescription="The most durable way to attach a patch: a clean finished edge stitched straight to the garment. Survives unlimited wash cycles. Free on every patch type. Mockup in 12 to 24 hours, free worldwide shipping."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            Yes, Panda Patches offers <strong>free sew-on backing on every patch type</strong>, embroidered,
            woven, printed, leather, PVC, and chenille, from a low 5-piece minimum. Sew-on is the most permanent
            and wash-proof backing because the patch is stitched directly to the fabric rather than glued. It is
            the right choice for work uniforms, game jerseys, scout sashes, and any garment washed often. The
            patch arrives with a clean stitched edge ready to attach by hand or machine, with free worldwide
            shipping and a digital mockup in 12 to 24 hours.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />

      {/* WHEN TO CHOOSE SEW-ON */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            When To Choose Sew-On
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[17px] font-black text-panda-dark mb-2">Choose sew-on for</h3>
              <ul className="text-[14px] text-gray-600 leading-[1.8] list-disc pl-5 space-y-1">
                <li>Work uniforms and industrial-wash garments</li>
                <li>Game jerseys and team kit washed weekly</li>
                <li>Scout and military uniforms, sashes</li>
                <li>Heat-sensitive fabrics (nylon, polyester, waterproof shells)</li>
                <li>PVC and chenille patches (default backing)</li>
                <li>Any patch you may want to remove later</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[17px] font-black text-panda-dark mb-2">Iron-on may be easier for</h3>
              <ul className="text-[14px] text-gray-600 leading-[1.8] list-disc pl-5 space-y-1">
                <li>Hats, denim, and canvas washed occasionally</li>
                <li>One-off personal projects with no sewing kit</li>
                <li>Cotton t-shirts, hoodies, and tote bags</li>
                <li>Fast application with a household iron</li>
              </ul>
              <p className="text-[13px] text-gray-500 leading-[1.6] mt-3">
                Compare both on the <Link href="/custom-iron-on-patches" prefetch={false} className="text-panda-green underline font-semibold">iron-on patches</Link> page, or see all six in the <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">backing options guide</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO SEW ON */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-10">
            How To Sew On a Patch
          </h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-[800px] mx-auto">
            {[
              { n: 1, title: "Position and pin", desc: "Place the patch where you want it and pin or fabric-tape it flat so it cannot shift." },
              { n: 2, title: "Match your thread", desc: "Use thread that matches the patch border for an invisible seam, or a contrast color for a visible stitch." },
              { n: 3, title: "Stitch the edge", desc: "Sew a continuous line 1.5 to 3mm inside the border, by hand (whip stitch) or machine (zig-zag)." },
              { n: 4, title: "Knot and finish", desc: "Tie off on the inside of the garment. A heavy-duty or denim needle handles the dense border best." },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 bg-[#F9FAF5] border border-gray-100 rounded-2xl p-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-panda-dark text-panda-yellow font-black flex items-center justify-center text-lg">{step.n}</div>
                <div>
                  <h3 className="text-[16px] font-black text-panda-dark mb-1">{step.title}</h3>
                  <p className="text-[14px] text-gray-600 leading-[1.6]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Promises bgColor="bg-[#F9FAF5]" />
      <ReviewsSection />
      <ProcessSection />

      {/* SEO CONTENT */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            Order Custom Sew-On Patches From 5 Pieces
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              A sew-on patch is finished with a clean border and no adhesive, so it can be stitched permanently
              to almost any fabric. It is the most durable backing Panda Patches offers and the standard choice
              for garments that see heavy or industrial laundry. Sew-on is free on every patch type, with a
              5-piece minimum (10 on woven), no setup fees, and no digitizing fees.
            </p>
            <p>
              Sew-on backing also future-proofs a garment: because the patch is held by thread, it can be
              unpicked and removed cleanly, which suits rental uniforms and gear that gets reassigned. For
              frequently washed items where convenience matters too, many customers iron the patch on first to
              hold position, then sew the edge for a permanent bond. Every order ships with free worldwide
              shipping, a digital mockup in 12 to 24 hours, unlimited free revisions, and a money-back
              guarantee. Read more in <Link href="/patch-backings-101-iron-on-vs-sew-on-vs-velcro" prefetch={false} className="text-panda-green underline font-semibold">Patch Backings 101</Link>.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Sew-On Patches FAQ" faqs={sewOnFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
