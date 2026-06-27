import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import MakerNote from "@/components/seo/MakerNote";
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

const CANONICAL = "https://www.pandapatches.com/patch-borders";

export const revalidate = 86400;

const borderFAQs = [
  {
    question: "What is a merrowed border?",
    answer:
      "A merrowed border is the thick, raised, rope-like edge stitched around a patch by a merrow overlock machine. It wraps the cut edge in a dense band of thread, giving the classic finished patch look and a durable, fray-proof rim. Because the machine runs a continuous overlock, merrowed borders work on simple shapes: circles, squares, rectangles, ovals, and shields. It is the traditional border for scout, military, and uniform patches.",
  },
  {
    question: "What is the difference between a merrowed border and an embroidered (satin) border?",
    answer:
      "A merrowed border is a raised rope edge made by an overlock machine and only follows simple convex shapes. A satin (embroidered) border is a flat band of tight satin stitching that the embroidery machine can run along any outline, including letters, mascots, flames, and intricate custom die-cuts. Rule of thumb: choose merrowed for a classic raised rim on a simple shape, and satin for a custom or detailed shape that a merrow machine cannot trace.",
  },
  {
    question: "What is a hot-cut or laser-cut border?",
    answer:
      "A hot-cut (or laser-cut) border is a clean, flat edge sealed by heat with no raised rim. The blade or laser melts and seals the patch edge so it will not fray, following any outline no matter how intricate. It produces a slim, modern look and is the standard for printed (sublimation) patches and complex die-cut shapes where a thick merrowed rim would not fit the design.",
  },
  {
    question: "Which border should I choose for my patch shape?",
    answer:
      "Match the border to the outline. Simple shapes (circle, square, oval, shield) suit a merrowed border for that classic raised rim. Custom or detailed outlines (text, logos, mascots, flames, die-cuts) need a satin embroidered border or a hot-cut edge that can follow the shape. For a flush, borderless modern look, choose a hot-cut edge or no border at all. Our designers recommend the best border for your artwork on the free proof.",
  },
  {
    question: "Do all patch types have the same border options?",
    answer:
      "No. Embroidered and woven patches can take merrowed, satin, or hot-cut borders. Printed (sublimation) patches use a hot-cut sealed edge. PVC patches are molded to shape with a clean molded edge rather than a stitched border. Chenille patches use a felt or embroidered edge cut to the letter or shape. Whatever the type, the edge is finished so it will not fray.",
  },
  {
    question: "Can I preview a border in the AI patch generator?",
    answer:
      "Yes. The free AI Patch Generator includes a Border control with Merrowed, Satin, and None options, so you can see how each looks on your concept before you order. Describe your patch, pick a border style, and refine until you like it, then send it to our team for a production mockup.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patch Borders | Merrowed vs Satin vs Hot-Cut",
  description:
    "Patch border options explained: merrowed (raised rope edge), satin embroidered border, hot-cut/laser-cut, and no border. Which suits which shape, with pricing and a 5-piece minimum. Free worldwide shipping.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Patch Borders: Merrowed vs Satin vs Hot-Cut, Explained",
  ogDescription:
    "The complete guide to patch borders. Merrowed rope edge, satin embroidered border, and hot-cut laser edge, what each looks like and which shape it suits.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Patch Borders: Merrowed, Satin, and Hot-Cut Edges Compared",
  description:
    "Guide to custom patch borders at Panda Patches. Merrowed overlock edge, satin embroidered border, hot-cut and laser-cut edges, and no-border finishes, what each looks like, which patch shapes suit each, and how to choose. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Patch Borders", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(borderFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches with Choice of Border",
  description:
    "Custom patches with a choice of border: merrowed rope edge, satin embroidered border, or hot-cut laser edge. Matched to your shape. Low 5-piece minimum, free worldwide shipping, mockup in 12 to 24 hours.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.74",
    highPrice: "4.60",
    offerCount: "3",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

const BORDERS = [
  { name: "Merrowed", look: "Thick raised rope edge", shapes: "Circle, square, oval, shield", note: "The classic finished-patch rim. Simple convex shapes only.", types: "Embroidered, woven" },
  { name: "Satin (Embroidered)", look: "Flat tight stitched band", shapes: "Any outline, including text & die-cuts", note: "Follows custom and intricate shapes a merrow machine cannot.", types: "Embroidered, woven" },
  { name: "Hot-Cut / Laser-Cut", look: "Clean flat sealed edge, no rim", shapes: "Any intricate die-cut", note: "Slim modern look. Standard for printed and detailed shapes.", types: "Printed, embroidered" },
  { name: "No Border", look: "Flush to the design edge", shapes: "Molded or sealed shapes", note: "Borderless finish for a minimal look or molded PVC.", types: "PVC, printed" },
];

export default async function PatchBordersPage() {
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
        currentPage="Patch Borders"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Patch Borders"
        customSubheading="Merrowed, Satin, or Hot-Cut, Matched to Your Shape"
        customDescription="The border is the edge that frames and protects your patch. Choose a raised merrowed rim, a flat satin embroidered border, or a clean hot-cut edge. We recommend the right one for your shape. Mockup in 12 to 24 hours, free worldwide shipping."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            A patch border is the finished edge that frames the design and stops it fraying. Panda Patches offers
            three main borders plus a borderless option: a <strong>merrowed</strong> rope edge for simple shapes,
            a flat <strong>satin embroidered</strong> border that follows any outline, and a <strong>hot-cut
            (laser-cut)</strong> sealed edge for intricate die-cuts and printed patches. The right choice depends
            on your shape: simple outlines suit merrowed, custom and detailed outlines suit satin or hot-cut.
            Every border ships on a 5-piece minimum with free worldwide shipping and a mockup in 12 to 24 hours.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />

      {/* BORDER COMPARISON */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[960px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            The Four Border Finishes
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panda-dark text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Border</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Look</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Best Shapes</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Patch Types</th>
                </tr>
              </thead>
              <tbody>
                {BORDERS.map((b) => (
                  <tr key={b.name} className="border-t border-gray-100 align-top">
                    <td className="px-5 py-4 font-bold">{b.name}</td>
                    <td className="px-5 py-4 text-gray-700">{b.look}<span className="block text-gray-500 text-[13px] mt-0.5">{b.note}</span></td>
                    <td className="px-5 py-4 text-gray-600">{b.shapes}</td>
                    <td className="px-5 py-4 text-gray-600">{b.types}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed text-center mt-4">
            Want to see a border on your idea first? Try the <Link href="/ai-patch-generator" prefetch={false} className="text-panda-green underline font-semibold">AI Patch Generator</Link>, it has a Border control (Merrowed / Satin / None).
          </p>
        </div>
      </section>

      {/* CHOOSE BY SHAPE */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Choose Your Border by Shape
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[17px] font-black text-panda-dark mb-2">Simple shape</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Circle, square, oval, or shield? A merrowed border gives the classic raised rim and the most traditional patch look.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[17px] font-black text-panda-dark mb-2">Custom outline</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Text, mascot, flames, or a logo silhouette? A satin embroidered border follows the exact shape a merrow machine cannot.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[17px] font-black text-panda-dark mb-2">Modern / detailed</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Intricate die-cut or printed art? A hot-cut sealed edge gives a slim, flush, fray-proof finish with no raised rim.</p>
            </div>
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
            Get the Right Border on Your Custom Patch
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              The border does two jobs: it frames the design and it seals the edge so the patch never frays. A
              merrowed border is the raised rope edge most people picture on a classic patch, made by an overlock
              machine that can only follow simple convex shapes. A satin embroidered border is a flat stitched
              band that the embroidery machine runs along any outline, which is why custom shapes, lettering, and
              mascots use satin. A hot-cut or laser-cut edge seals the patch flat with no rim and handles the most
              intricate die-cuts, and it is standard on printed patches.
            </p>
            <p>
              Choosing the border early keeps the design clean: a complex shape with a merrowed border will be
              simplified to fit the machine, while the same shape with a satin or hot-cut edge keeps every detail.
              Our designers recommend the best border for your artwork on the free proof, and you can preview
              styles in the <Link href="/ai-patch-generator" prefetch={false} className="text-panda-green underline font-semibold">AI Patch Generator</Link> first. See more on fonts, colors, and borders in our <Link href="/best-fonts-colors-and-borders-for-custom-patches" prefetch={false} className="text-panda-green underline font-semibold">design guide</Link>, or start on the <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">embroidered patches</Link> page.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Patch Borders FAQ" faqs={borderFAQs} />
      <MakerNote />
      <CTASection />
      <Footer />
    </main>
  );
}
