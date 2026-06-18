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

const CANONICAL = "https://www.pandapatches.com/patch-threads-and-twills";

export const revalidate = 86400;

const threadFAQs = [
  {
    question: "What thread do you use for embroidered patches?",
    answer:
      "Standard embroidered patches use high-sheen polyester embroidery thread, available in hundreds of stock colors plus Pantone (PMS) matching at no extra charge. Polyester thread is colorfast, holds its sheen through repeated washing, and is the default at no upcharge on every embroidered and woven patch. We match your brand colors from the thread color chart or a supplied Pantone reference on the free mockup.",
  },
  {
    question: "Can I get metallic thread on a patch?",
    answer:
      "Yes. Metallic thread in gold, silver, and copper adds a reflective, premium accent, popular on crests, monograms, military insignia, and luxury brand patches. Metallic is a special-finish thread, so it carries a small upgrade cost on top of the base patch price. See the special finish patches cost guide for exact metallic pricing, and note metallic is usually used as an accent rather than the whole design.",
  },
  {
    question: "What is glow-in-the-dark thread?",
    answer:
      "Glow-in-the-dark thread charges under light and glows in darkness for a period afterward. It is used for novelty patches, safety and night-visibility designs, event and concert merch, and kids' apparel. Like metallic, glow thread is a special finish with a small upgrade cost. It works best as a highlight on key elements of the design rather than across the entire patch.",
  },
  {
    question: "What is neon thread?",
    answer:
      "Neon thread is bright fluorescent polyester in colors like hi-vis yellow, orange, pink, and green that pop far more than standard shades. It suits sportswear, streetwear, safety apparel, and any design meant to stand out. Neon shades are selected from the thread color chart and, being standard polyester, generally carry no special-finish upcharge.",
  },
  {
    question: "What is twill, and what is camo twill?",
    answer:
      "Twill is the woven fabric background that an embroidered design is stitched onto. You can choose the twill color to set the base of the patch, and for partially embroidered designs the twill shows through as the background. Camo twill is a patterned twill printed with a camouflage design (woodland, multicam-style, desert), used as the base for tactical, military, hunting, and outdoor patches so the background itself carries the camo pattern.",
  },
  {
    question: "How do I match my exact thread color?",
    answer:
      "Pick from the Panda Patches thread color chart, or send a Pantone (PMS) code and we match it at no extra charge. The chosen colors are shown on your free digital mockup in 12 to 24 hours so you can confirm before production. If a shade falls between stock threads, our designers recommend the closest match and note it on the proof.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patch Threads & Twills | Metallic, Glow, Camo Twill",
  description:
    "Custom patch thread and twill options: standard polyester, metallic, glow-in-the-dark, and neon thread, plus twill colors and camo twill backgrounds. Pantone matching free. 5-piece minimum, free worldwide shipping.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Patch Threads & Twills: Metallic, Glow, Neon, and Camo Twill",
  ogDescription:
    "Thread and twill choices for custom patches. Standard polyester, metallic, glow-in-the-dark, neon, and camo twill backgrounds, with free Pantone color matching.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Patch Threads and Twills: Metallic, Glow, Neon, and Camo Twill",
  description:
    "Guide to thread and twill options for custom patches at Panda Patches. Standard polyester, metallic, glow-in-the-dark, and neon threads, twill background colors, and camo twill, plus free Pantone matching. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Threads & Twills", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(threadFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Patches with Thread and Twill Options",
  description:
    "Custom patches with thread options (standard polyester, metallic, glow-in-the-dark, neon) and twill backgrounds including camo twill. Free Pantone matching. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.91",
    highPrice: "4.60",
    offerCount: "4",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

const THREADS = [
  { name: "Standard polyester", body: "Hundreds of colorfast shades plus free Pantone matching. The default at no upcharge.", tag: "Included" },
  { name: "Metallic thread", body: "Gold, silver, and copper reflective accents for crests, monograms, and insignia.", tag: "Special finish" },
  { name: "Glow-in-the-dark", body: "Charges under light and glows in the dark. Novelty, safety, and event merch.", tag: "Special finish" },
  { name: "Neon thread", body: "Bright fluorescent hi-vis shades for sportswear, streetwear, and safety apparel.", tag: "Standard color" },
];

export default async function PatchThreadsAndTwillsPage() {
  const { workSamples, trustBadges } = await getClusterPageData("custom-military-patches");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Threads & Twills"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Patch Threads & Twills"
        customSubheading="Metallic, Glow, Neon, and Camo Twill Backgrounds"
        customDescription="The thread sets the detail and the twill sets the background. Choose standard polyester, metallic, glow-in-the-dark, or neon thread, on a twill color or camo twill base. Free Pantone matching. Mockup in 12 to 24 hours."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            On an embroidered patch, the <strong>thread</strong> creates the design and the <strong>twill</strong>
            {" "}is the fabric background it is stitched onto. Panda Patches offers standard polyester thread (free,
            with Pantone matching), plus <strong>metallic</strong>, <strong>glow-in-the-dark</strong>, and
            {" "}<strong>neon</strong> threads, and twill backgrounds including <strong>camo twill</strong> for
            tactical and outdoor designs. Standard polyester and neon are included; metallic and glow are
            special-finish upgrades. Every option ships on a 5-piece minimum with free worldwide shipping and a
            mockup in 12 to 24 hours.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />

      {/* THREAD OPTIONS */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Thread Options
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {THREADS.map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[16px] font-black text-panda-dark">{t.name}</h3>
                </div>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-panda-dark text-panda-yellow px-2 py-0.5 rounded-full mb-3">{t.tag}</span>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed text-center mt-6">
            Metallic and glow are special finishes. See exact pricing in the <Link href="/special-finish-patches-cost-guide" prefetch={false} className="text-panda-green underline font-semibold">special finish patches cost guide</Link>, and browse shades on the <Link href="/assets/thread-color-chart" prefetch={false} className="text-panda-green underline font-semibold">thread color chart</Link>.
          </p>
        </div>
      </section>

      {/* TWILL / CAMO */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Twill Backgrounds &amp; Camo Twill
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[17px] font-black text-panda-dark mb-2">Twill colors</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Twill is the woven base fabric. Choose its color to set the background of the patch. On partially embroidered designs the twill shows through, so the twill color is part of the look, not just the backing.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[17px] font-black text-panda-dark mb-2">Camo twill</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Camo twill is a patterned base fabric, woodland, multicam-style, or desert, used for tactical, military, hunting, and outdoor patches so the background itself carries the camouflage. Pairs naturally with <Link href="/custom-tactical-patches" prefetch={false} className="text-panda-green underline font-semibold">tactical</Link> and <Link href="/custom-airsoft-patches" prefetch={false} className="text-panda-green underline font-semibold">airsoft</Link> designs.</p>
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
            Build Your Patch From Thread Up
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Thread choice changes both the look and the feel of an embroidered patch. Standard polyester thread
              covers the full color range with free Pantone matching and is included at no upcharge. Metallic
              thread adds gold, silver, or copper shine for crests and insignia; glow-in-the-dark thread charges
              under light for novelty and safety designs; and neon thread delivers hi-vis fluorescent color for
              sportswear and streetwear. Metallic and glow are special-finish upgrades, the rest are included.
            </p>
            <p>
              The twill background matters just as much. Choosing the twill color sets the base of the patch, and
              camo twill puts a woodland, multicam-style, or desert pattern right into the background fabric,
              perfect for tactical and outdoor designs. See the <Link href="/special-finish-patches-cost-guide" prefetch={false} className="text-panda-green underline font-semibold">special finish cost guide</Link> for metallic and glow pricing, match shades on the <Link href="/assets/thread-color-chart" prefetch={false} className="text-panda-green underline font-semibold">thread color chart</Link>, then start your design on the <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">embroidered patches</Link> page. Every order includes free worldwide shipping and a mockup in 12 to 24 hours.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Threads & Twills FAQ" faqs={threadFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
