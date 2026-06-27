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
import MakerNote from "@/components/seo/MakerNote";
import { generateSchemaScript, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { getClusterPageData } from "@/lib/clusterPageData";
import { getFromPriceLabel } from "@/lib/pricingCalculator";

const CANONICAL = "https://www.pandapatches.com/custom-ems-patches";

export const revalidate = 86400;

const emsFAQs = [
  {
    question: "What patches do EMS, EMT, and paramedic crews wear?",
    answer:
      "EMS uniforms typically carry a shoulder patch with the service or agency name on each sleeve, a rank or role identifier (EMT, paramedic, supervisor), name tapes, and sometimes a state certification or unit patch. Many services also add the Star of Life symbol and reflective or hi-vis elements for night-scene visibility. We produce all of these as embroidered patches built for daily uniform wear.",
  },
  {
    question: "What is the best patch type and backing for EMS uniforms?",
    answer:
      "Embroidered patches with sew-on backing are the standard for EMS, EMT, and paramedic uniforms. Embroidery is durable and reads clearly at a distance, and sew-on backing survives the frequent, hot, and sometimes industrial laundering that duty uniforms go through. Iron-on is not recommended for uniforms washed this often. Hook-and-loop Velcro is available where crews swap patches between jackets and duty shirts.",
  },
  {
    question: "Can you include the Star of Life or our agency insignia?",
    answer:
      "We reproduce your department or agency insignia and standard EMS design elements on your patch. Some symbols and seals are protected or restricted (the Star of Life is a controlled symbol, and many state and agency seals require authorization), so we ask that you confirm you are authorized to use any protected mark on your order. Our designers will lay out your approved artwork on a free mockup before production.",
  },
  {
    question: "Can I get reflective or hi-vis EMS patches for night visibility?",
    answer:
      "Yes. Bright neon and hi-vis thread improves visibility on night scenes and roadside calls, and is a common request for EMS and rescue patches. Glow-in-the-dark thread is also available for specific elements. See the threads and twills guide for the full range; our team will recommend the most legible combination for your design on the proof.",
  },
  {
    question: "What is the minimum order for EMS patches?",
    answer:
      "Just 5 pieces, so a small volunteer squad or a single station can order without a large run, and unit price falls as quantity rises for department-wide orders. Embroidered EMS patches start at " + getFromPriceLabel("Custom Embroidered Patches") + " per piece at 2 by 2 inches and 1,000 pieces; smaller runs cost more per piece. No setup fees, no digitizing fees, and free worldwide shipping on every order.",
  },
  {
    question: "Can you produce matching sets for a whole service?",
    answer:
      "Yes. Departments commonly order a coordinated set: left and right shoulder patches, rank patches, name tapes, and unit or specialty patches, all color-matched and consistent across the service. With a 5-piece minimum and no setup fees you can standardize the whole crew, reorder as staff change, and keep every patch identical. Every order includes a free mockup, unlimited revisions, and a money-back guarantee.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom EMS, EMT & Paramedic Patches | Low 5-Piece Min",
  description:
    "Custom EMS, EMT, and paramedic patches for uniforms: shoulder patches, rank, name tapes, and reflective options. Embroidered with sew-on backing. 5-piece minimum, free worldwide shipping, mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom EMS & Paramedic Patches: Uniform Shoulder, Rank & Reflective Designs",
  ogDescription:
    "Embroidered EMS, EMT, and paramedic patches built for duty uniforms. Shoulder patches, rank, name tapes, and hi-vis options with sew-on backing. From a low 5-piece minimum.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom EMS, EMT, and Paramedic Patches: Uniform Designs and Build",
  description:
    "Guide to custom EMS patches at Panda Patches. Shoulder, rank, name-tape, and reflective designs for EMS, EMT, and paramedic uniforms, embroidered with sew-on backing, plus a note on protected symbols. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "EMS Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(emsFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom EMS, EMT & Paramedic Patches",
  description:
    "Custom embroidered EMS, EMT, and paramedic patches for duty uniforms. Shoulder, rank, name-tape, and reflective designs with sew-on backing. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.91",
    highPrice: "4.00",
    offerCount: "3",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

export default async function CustomEmsPatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("custom-3d-embroidered-transfers");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="EMS Patches"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom EMS &amp; Paramedic Patches"
        customSubheading="Shoulder, Rank &amp; Name Patches for Duty Uniforms"
        customDescription="Embroidered EMS, EMT, and paramedic patches built to survive frequent hot laundry. Agency shoulder patches, rank, name tapes, and hi-vis options with sew-on backing. From 5 pieces, free worldwide shipping, mockup in 12 to 24 hours."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            Yes, Panda Patches makes <strong>custom EMS, EMT, and paramedic patches</strong> for duty uniforms,
            from a low 5-piece minimum. The standard build is an <strong>embroidered patch with sew-on
            backing</strong>, durable, clearly legible, and able to survive the frequent hot laundering that EMS
            uniforms go through. We produce agency shoulder patches, rank and role identifiers, name tapes, and
            hi-vis designs, and we color-match your department on a free mockup in 12 to 24 hours.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />
      <Craftsmanship />

      {/* WHAT TO ORDER */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            EMS Uniform Patches We Make
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Agency shoulder patches", body: "Service-name sleeve patches, one per shoulder, color-matched to your department." },
              { title: "Rank & role", body: "EMT, paramedic, supervisor, and crew-chief identifiers." },
              { title: "Name tapes", body: "Individual name strips that read clearly across a scene." },
              { title: "Hi-vis & reflective", body: "Bright and reflective elements for night-scene and roadside visibility." },
            ].map((u) => (
              <div key={u.title} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="text-[16px] font-black text-panda-dark mb-2">{u.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYMBOL / AUTHORIZATION NOTE */}
      <section className="w-full py-8 md:py-10 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-[16px] font-black text-blue-900 mb-2">Protected symbols and seals</h3>
            <p className="text-[14px] text-blue-900/90 leading-[1.7]">
              Some EMS symbols and seals are controlled, the Star of Life is a protected symbol and many state and
              agency seals require authorization. We reproduce your approved artwork and ask that you confirm you
              are authorized to use any protected mark. Our team lays out the design on a free proof so you can
              review it before production.
            </p>
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
            Custom EMS &amp; Paramedic Patches From 5 Pieces
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              EMS uniforms are washed hard and worn daily, so duty patches have to last. Embroidered patches with
              sew-on backing are the standard because they hold color, read clearly at a distance, and stay
              attached through repeated hot laundering, where an iron-on patch would lift. We build agency
              shoulder patches, rank and role identifiers, name tapes, and unit patches, with hi-vis or reflective
              detail where night visibility matters.
            </p>
            <p>
              The 5-piece minimum and no-setup-fee pricing let a small volunteer squad or a single station order
              without a large run, while unit price drops for department-wide sets. Many services standardize a
              full kit, left and right shoulder, rank, and name tapes, all color-matched and consistent. For
              related public-safety designs see our <Link href="/custom-fire-department-patches" prefetch={false} className="text-panda-green underline font-semibold">fire department</Link> and <Link href="/custom-police-patches" prefetch={false} className="text-panda-green underline font-semibold">police</Link> patch pages, start your design on the <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">embroidered patches</Link> page, and choose <Link href="/sew-on-patches" prefetch={false} className="text-panda-green underline font-semibold">sew-on backing</Link>. Every order includes free worldwide shipping, a mockup in 12 to 24 hours, and a money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full pb-10 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[14px] text-gray-500 leading-relaxed">
            <span className="font-bold text-panda-dark">Related:</span>{" "}
            <Link href="/types-of-patches-complete-guide" prefetch={false} className="text-panda-green underline font-semibold">Types of Patches Guide</Link>
            {" · "}
            <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">Embroidered patches</Link>
            {" · "}
            <Link href="/custom-fire-department-patches" prefetch={false} className="text-panda-green underline font-semibold">Fire department patches</Link>
          </p>
        </div>
      </section>

      <CategoryFAQ title="EMS Patches FAQ" faqs={emsFAQs} />
      <MakerNote />
      <CTASection />
      <Footer />
    </main>
  );
}
