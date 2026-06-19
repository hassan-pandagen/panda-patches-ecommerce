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

const CANONICAL = "https://www.pandapatches.com/button-loop-patches";

export const revalidate = 86400;

const buttonLoopFAQs = [
  {
    question: "What is a button-loop patch?",
    answer:
      "A button-loop patch has a small fabric or stitched loop extending from the top edge. Instead of being ironed or sewn flat, the patch hangs from an existing button on a shirt pocket, vest, or jacket: you slip the loop over the button and the patch dangles below it. It is a traditional, tool-free way to display a patch that can be added or removed in seconds.",
  },
  {
    question: "What are button-loop patches used for?",
    answer:
      "Button-loop patches are a classic on scouting uniforms and temporary insignia, biker and club vests, German and Bavarian lederhosen and trachten, and travel or souvenir collections where wearers add and swap patches often. They suit any garment with a button where a hanging, removable patch is part of the look.",
  },
  {
    question: "Which patch types support a button loop?",
    answer:
      "Button-loop backing is best on embroidered and woven patches, where the loop can be stitched cleanly into the top border. It is not used on PVC, chenille, or leather, which do not pair well with a fabric hang loop. If you are not sure your design suits a button loop, our team will confirm on the proof before production.",
  },
  {
    question: "Are button-loop patches removable?",
    answer:
      "Yes. That is the main appeal: the patch lifts off the moment you unbutton or slide the loop free, with nothing to unpick and no adhesive. This makes button-loop ideal for collections that change often, such as scout temporary patches and travel souvenirs, and for shared garments where the insignia is swapped between wearers.",
  },
  {
    question: "How much do button-loop patches cost?",
    answer:
      "Button-loop is a specialty backing quoted per order because of the extra loop construction. The patch itself follows standard pricing by type, size, and quantity, for example embroidered patches start at " + getFromPriceLabel("Custom Embroidered Patches") + " per piece at 2 by 2 inches and 1,000 pieces. Send your design and quantity for a free exact quote or use live chat. Free worldwide shipping and a mockup in 12 to 24 hours are included on every order.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Button-Loop Patches | Hang-From-Button Backing",
  description:
    "Custom button-loop patches that hang from an existing button, the traditional removable style for scout sashes, biker vests, and travel collections. Embroidered and woven. 5-piece minimum, free worldwide shipping.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Button-Loop Patches: Traditional Hang-From-Button Backing",
  ogDescription:
    "Button-loop patches slip over a button and lift off in seconds. The classic removable choice for scout uniforms, biker vests, and souvenir collections.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Button-Loop Patches: The Traditional Hang-From-Button Backing",
  description:
    "Guide to custom button-loop patches at Panda Patches. How the loop works, traditional use cases from scouting to biker vests, compatible patch types, and pricing. Low 5-piece minimum, free worldwide shipping, mockup in 12 to 24 hours.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Backing Options", url: "https://www.pandapatches.com/custom-patches/backing-options" },
  { name: "Button-Loop Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(buttonLoopFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Button-Loop Patches",
  description:
    "Custom embroidered and woven patches with a traditional button-loop backing that hangs from an existing button. Removable, tool-free. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "0.91",
    highPrice: "4.40",
    offerCount: "2",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

export default async function ButtonLoopPatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("custom-motorcycle-club-patches");

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
        currentPage="Button-Loop Patches"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Button-Loop Patches"
        customSubheading="Hang It From a Button, Lift It Off in Seconds"
        customDescription="The traditional removable backing for scout sashes, biker vests, and travel collections. A stitched loop slips over an existing button, no iron and no sewing. Mockup in 12 to 24 hours, free worldwide shipping."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            Yes, Panda Patches makes <strong>button-loop patches</strong> with a stitched loop that hangs from an
            existing button, from a low 5-piece minimum. Slip the loop over a shirt-pocket or vest button and the
            patch hangs below it; lift it off the moment you unbutton. It is the classic, tool-free style for
            scout uniforms, biker and club vests, Bavarian trachten, and travel or souvenir patch collections
            that are swapped often. Button-loop is made on embroidered and woven patches and is quoted per order.
          </p>
        </div>
      </section>

      <WorkGallery samples={workSamples} />
      <TrustStrip />

      {/* TRADITION / USE CASES */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            A Traditional Style With Real Uses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Scouting", body: "Temporary patches and event insignia that hang from a uniform button and change through the year." },
              { title: "Biker & club vests", body: "Club and rally patches that wearers add and rotate without altering the vest." },
              { title: "Trachten & lederhosen", body: "The classic hang-loop look for Bavarian and Alpine traditional dress." },
              { title: "Travel & souvenirs", body: "Collectors hang and swap destination patches across a strap or sash." },
            ].map((u) => (
              <div key={u.title} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="text-[16px] font-black text-panda-dark mb-2">{u.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{u.body}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed text-center mt-6">
            Prefer a fixed or swappable alternative? Compare every option in the <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">backing options guide</Link>.
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
            Order Custom Button-Loop Patches From 5 Pieces
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              A button-loop patch keeps a long-standing tradition alive: rather than fixing the patch flat, a
              small stitched loop lets it hang from a button so it can be added, rotated, and removed without
              tools. That makes it the natural backing for collections that change, from scout temporary patches
              to traveler souvenir sets, and for shared garments where insignia is swapped between wearers.
            </p>
            <p>
              We build the loop into the top border of embroidered and woven patches, the two types that carry it
              cleanly. Button-loop is a specialty backing quoted per order, while the patch follows standard
              pricing by type, size, and quantity. Every order includes free worldwide shipping, a digital mockup
              in 12 to 24 hours, unlimited free revisions, and a money-back guarantee. For a permanent or
              swappable alternative, see <Link href="/sew-on-patches" prefetch={false} className="text-panda-green underline font-semibold">sew-on</Link> and <Link href="/custom-velcro-patches" prefetch={false} className="text-panda-green underline font-semibold">Velcro</Link> backing.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full pb-10 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[14px] text-gray-500 leading-relaxed">
            <span className="font-bold text-panda-dark">Related:</span>{" "}
            <Link href="/patch-backings-101-iron-on-vs-sew-on-vs-velcro" prefetch={false} className="text-panda-green underline font-semibold">Patch Backings 101</Link>
            {" · "}
            <Link href="/custom-patches/woven" prefetch={false} className="text-panda-green underline font-semibold">Woven patches</Link>
            {" · "}
            <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">All backing options</Link>
          </p>
        </div>
      </section>

      <CategoryFAQ title="Button-Loop Patches FAQ" faqs={buttonLoopFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
