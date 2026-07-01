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

const CANONICAL = "https://www.pandapatches.com/magnetic-patches";

export const revalidate = 86400;

const magneticFAQs = [
  {
    question: "How do magnetic patches work?",
    answer:
      "A magnetic patch has a thin magnet bonded behind the patch and a matching counterpart magnet that sits behind the fabric. The two magnets clamp the garment between them, holding the patch firmly with no pin, no hole, and no sewing. To move the patch, you simply pull it off and the counterpart comes away with it. It is the cleanest no-damage way to wear a badge on a suit, blazer, or uniform.",
  },
  {
    question: "Will a magnetic patch damage my clothes?",
    answer:
      "No, that is the whole point. Because nothing pierces the fabric, a magnetic patch leaves no pin holes, no needle marks, and no adhesive residue. This makes it the preferred badge backing for tailored suits, blazers, silk, and uniform fabrics where a pin would leave permanent damage. The magnet grips through the cloth without marking it.",
  },
  {
    question: "What are magnetic patches used for?",
    answer:
      "Magnetic backing is the standard for reusable name badges and ID patches: real-estate agents, hospitality and front-desk staff, conference and trade-show teams, sales reps in suits, and corporate uniforms. It suits any setting where staff wear a badge daily, swap it between outfits, and cannot put holes in the garment.",
  },
  {
    question: "Are magnetic patches strong enough to stay on?",
    answer:
      "For normal daily wear, walking, sitting, presenting, shaking hands, a properly specified magnet holds securely. We match magnet strength to patch size and weight so it stays put without distorting lightweight fabric. Magnetic backing is not intended for high-activity use such as sport, manual labor, or outdoor gear that takes knocks; for those, choose hook-and-loop Velcro or sew-on instead.",
  },
  {
    question: "Is there a safety concern with magnetic backing?",
    answer:
      "Yes, one to note. Strong magnets can interfere with pacemakers and other implanted medical devices, so anyone with such a device should not wear a magnetic patch and should choose pin, Velcro, or sew-on backing instead. Magnets can also affect the strips on credit cards and some electronics if kept in direct contact. Keep magnetic patches away from medical devices, cards, and hard drives.",
  },
  {
    question: "How much do magnetic patches cost?",
    answer:
      "Magnetic is a specialty backing priced per order because magnet count and strength depend on patch size and weight. The base patch itself follows standard pricing, for example embroidered patches start at " + getFromPriceLabel("Custom Embroidered Patches") + " per piece at 2 by 2 inches and 1,000 pieces. Send your design and quantity for a free exact quote, or use live chat. Every order still includes free worldwide shipping and a mockup in 12 to 24 hours.",
  },
  {
    question: "Do you offer safety-pin backing instead of magnetic?",
    answer:
      "Yes. If magnetic backing is not suitable, for example for anyone with a pacemaker or for children's wear, we offer safety-pin backing alongside standard pin-back, Velcro, sew-on, iron-on, and sticker. Safety-pin backing attaches a small bar pin with a locking clasp to the back of the patch, so it fastens and removes without a magnet. Choose Safety Pin in the backing dropdown on this page or note it in your quote.",
  },
  {
    question: "Magnetic vs. pin vs. Velcro backing, which should I choose for a name badge?",
    answer:
      "For daily-wear name badges on suits and blazers where you cannot mark the fabric, magnetic is the cleanest choice: no hole, reusable, fast to swap. Choose pin or safety-pin backing when budget matters or the wearer has a pacemaker, since magnets are unsafe near implanted medical devices. Choose Velcro when the badge must survive high activity, uniforms washed often, or gear that takes knocks. All are available from a low 5-piece minimum.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Magnetic Patches & Name Badges | No-Hole Backing",
  description:
    "Custom magnetic patches and magnetic name badges with no-pin, no-hole backing for suits, blazers, and uniforms. Reusable, fabric-safe, fast to swap. 5-piece minimum, free worldwide shipping, mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Magnetic Patches: No-Hole Name-Badge Backing for Suits and Uniforms",
  ogDescription:
    "Magnetic-backed patches and name badges that grip through fabric with no pin and no damage. The reusable choice for suits, blazers, and front-of-house uniforms.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Magnetic Patches and Name Badges: No-Hole Backing Guide",
  description:
    "Guide to custom magnetic patches and magnetic name badges at Panda Patches. How magnetic backing works, why it protects tailored fabric, the right use cases, a magnet-safety note, and pricing. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Backing Options", url: "https://www.pandapatches.com/custom-patches/backing-options" },
  { name: "Magnetic Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(magneticFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Magnetic Patches and Name Badges",
  description:
    "Custom patches with no-hole magnetic backing for suits, blazers, and uniforms. Reusable, fabric-safe name badges and ID patches. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.91",
    highPrice: "5.00",
    offerCount: "3",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

export default async function MagneticPatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("leather");

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
        currentPage="Magnetic Patches"
      />

      <BulkHero
        simpleForm
        extraBackingOptions={[
          { value: "magnetic", label: "Magnetic" },
          { value: "safety-pin", label: "Safety Pin" },
        ]}
        trustBadges={trustBadges}
        customHeading="Custom Magnetic Patches"
        customSubheading="No Pin, No Hole, No Damage, From 5 Pieces"
        customDescription="The reusable name-badge backing for suits, blazers, and uniforms. Two magnets grip through the fabric and leave no marks. Swap between outfits in seconds. Mockup in 12 to 24 hours, free worldwide shipping."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            Yes, Panda Patches makes <strong>magnetic patches and magnetic name badges</strong> with a no-hole,
            no-sew backing, from a low 5-piece minimum. A magnet bonded behind the patch pairs with a counterpart
            magnet behind the fabric, clamping the garment between them so the patch holds firmly without a pin.
            It is the standard for reusable name badges on tailored suits, blazers, and uniforms where you cannot
            put holes in the cloth. Magnetic is best on embroidered, PVC, and leather patches and is quoted per
            order because magnet strength is matched to the patch size.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />

      {/* WHO USES IT */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            Who Wears Magnetic Badges
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Real-estate agents", body: "A sharp name badge on a blazer with zero pin holes in tailored cloth." },
              { title: "Hospitality & front desk", body: "Reusable staff badges that swap between uniform shirts and jackets." },
              { title: "Conferences & expos", body: "Team ID patches that go on and come off cleanly between events." },
              { title: "Corporate uniforms", body: "Daily-wear name and role badges on shirts, suits, and lab coats." },
            ].map((u) => (
              <div key={u.title} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="text-[16px] font-black text-panda-dark mb-2">{u.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY NOTE */}
      <section className="w-full py-8 md:py-10 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="text-[16px] font-black text-amber-900 mb-2">A note on magnet safety</h3>
            <p className="text-[14px] text-amber-900/90 leading-[1.7]">
              Magnets can interfere with pacemakers and other implanted medical devices. Anyone with such a
              device should not wear a magnetic patch and should choose pin, <Link href="/custom-velcro-patches" prefetch={false} className="underline font-semibold">Velcro</Link>, or <Link href="/sew-on-patches" prefetch={false} className="underline font-semibold">sew-on</Link> backing
              instead. Keep magnetic patches away from credit cards and hard drives. We are happy to advise on a
              non-magnetic alternative if magnetic backing is not suitable for your team.
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
            Order Custom Magnetic Name Badges From 5 Pieces
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              Magnetic backing is the professional choice for badges that are worn daily and must not damage the
              garment. Because two magnets grip the fabric instead of a pin piercing it, magnetic patches protect
              tailored suits, blazers, and fine uniform cloth, and they reposition in seconds with no holes left
              behind. We match magnet strength to the size and weight of each design so it stays secure during
              normal wear without sagging the fabric.
            </p>
            <p>
              Magnetic is a specialty backing quoted per order, while the patch itself follows standard pricing
              by type, size, and quantity. It works best on embroidered, PVC, and leather patches at name-badge
              sizes. For high-activity or outdoor use, hook-and-loop Velcro or sew-on is a better fit, see the
              full <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">backing options guide</Link> to compare. Every order includes free worldwide shipping, a
              digital mockup in 12 to 24 hours, unlimited free revisions, and a money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full pb-10 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[14px] text-gray-500 leading-relaxed">
            <span className="font-bold text-panda-dark">Related:</span>{" "}
            <Link href="/how-to-choose-the-right-custom-patch-size-type-backing-guide" prefetch={false} className="text-panda-green underline font-semibold">How to Choose the Right Patch</Link>
            {" · "}
            <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">Embroidered patches</Link>
            {" · "}
            <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">All backing options</Link>
          </p>
        </div>
      </section>

      <CategoryFAQ title="Magnetic Patches FAQ" faqs={magneticFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
