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
import { buildPageMetadata } from "@/lib/seo";
import { getClusterPageData } from "@/lib/clusterPageData";
import { getFromPriceLabel } from "@/lib/pricingCalculator";

const CANONICAL = "https://www.pandapatches.com/custom-letterman-patches";

export const revalidate = 86400;

const lettermanFAQs = [
  {
    question: "What are letterman patches?",
    answer:
      "Letterman patches are the chenille patches worn on varsity and letterman jackets: the large school letter (the chenille \"letter\"), mascots, sport and activity icons, year and grade patches, and award stars and bars. They use thick, raised chenille yarn on a felt base for the classic fuzzy varsity texture, and are the traditional way students display their school, sport, and achievements.",
  },
  {
    question: "What is the best patch type for a letterman jacket?",
    answer:
      "Chenille is the standard for letterman jackets. Its raised, soft yarn pile gives the authentic varsity look for letters, mascots, and award patches, and it pairs with a felt backing that sits well on wool-body jackets. Embroidered patches are used for smaller, fine-detail elements like year patches or sponsor marks. For the main letter and mascot, choose chenille.",
  },
  {
    question: "Can you match our school colors and mascot?",
    answer:
      "Yes. We Pantone (PMS) match your exact school colors at no extra charge and reproduce your mascot, letter style, and trim on a free digital mockup in 12 to 24 hours. Two-color and outlined chenille letters, custom shapes, and felt trim are all standard. Request unlimited revisions until it matches your program; production starts only after you approve.",
  },
  {
    question: "What sizes do letterman patches come in?",
    answer:
      "Chenille letters are typically 4 to 12 inches for the main jacket letter, with mascots, sport icons, and award patches sized to suit. Because chenille pricing is based on size, larger letters cost more per piece than small ones. Tell us the finished size you need and we will quote it and show it to scale on the mockup.",
  },
  {
    question: "What is the minimum order for letterman patches?",
    answer:
      "Just 5 pieces, so a single student can order a letter and a few award patches, or a school can run a full team or graduating-class order with the unit price dropping at higher quantities. Chenille patches start at " + getFromPriceLabel("Custom Chenille Patches") + " per piece at 2 by 2 inches and 1,000 pieces; larger varsity letters are priced by size. No setup fees, free worldwide shipping on every order.",
  },
  {
    question: "What backing do letterman patches use?",
    answer:
      "Chenille letterman patches come with a felt sew-on base, the traditional choice that is stitched onto the jacket so it survives years of wear and washing. Iron-on is not used on chenille because the textured yarn does not bond to adhesive, and because letterman jackets are kept for years, sew-on is the durable standard. We can advise on placement for letters, mascots, and award patches.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Letterman & Varsity Patches | Chenille, 5-Piece Min",
  description:
    "Custom letterman and varsity patches in classic chenille: school letters, mascots, sport icons, and award patches. School-color matched, felt sew-on backing. 5-piece minimum, free worldwide shipping, mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "article",
  ogTitle: "Custom Letterman & Varsity Patches: Chenille Letters, Mascots & Awards",
  ogDescription:
    "Classic chenille letterman patches: varsity letters, mascots, sport icons, and award patches, color-matched to your school. From a low 5-piece minimum.",
  robots: { index: true, follow: true },
});

const articleSchema = generateArticleSchema({
  title: "Custom Letterman and Varsity Patches: Chenille Letters, Mascots, and Awards",
  description:
    "Guide to custom letterman patches at Panda Patches. Classic chenille varsity letters, mascots, sport icons, and award patches, school-color matching, sizing, felt sew-on backing, and pricing. Low 5-piece minimum, free worldwide shipping.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  image: "https://www.pandapatches.com/assets/og-image.png",
  url: CANONICAL,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Letterman Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(lettermanFAQs);

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Letterman & Varsity Patches",
  description:
    "Custom chenille letterman and varsity patches: school letters, mascots, sport icons, and award patches with felt sew-on backing. School-color matched. Low 5-piece minimum, free worldwide shipping.",
  brand: { "@type": "Brand", name: "Panda Patches" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    itemCondition: "https://schema.org/NewCondition",
    lowPrice: "1.31",
    highPrice: "9.20",
    offerCount: "3",
    seller: { "@type": "Organization", name: "Panda Patches" },
  },
};

export default async function CustomLettermanPatchesPage() {
  const { workSamples, trustBadges } = await getClusterPageData("chenille");

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(productSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[{ label: "Custom Patches", href: "/custom-patches" }]}
        currentPage="Letterman Patches"
      />

      <BulkHero
        simpleForm
        trustBadges={trustBadges}
        customHeading="Custom Letterman Patches"
        customSubheading="Chenille Letters, Mascots &amp; Award Patches"
        customDescription="The classic raised chenille look for varsity and letterman jackets: school letters, mascots, sport icons, and award patches, matched to your school colors. Felt sew-on backing. From 5 pieces, free worldwide shipping, mockup in 12 to 24 hours."
      />

      {/* ANSWER-FIRST */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[820px]">
            Yes, Panda Patches makes <strong>custom letterman and varsity patches</strong> in classic chenille,
            from a low 5-piece minimum. The raised, soft chenille yarn on a felt base gives the authentic varsity
            look for school letters, mascots, sport icons, and award patches. We Pantone-match your school colors
            and stitch the felt with a <strong>sew-on backing</strong> built to last years on a jacket. Every
            design ships with free worldwide shipping and a digital mockup in 12 to 24 hours.
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
            What Goes on a Letterman Jacket
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Varsity letters", body: "The main chenille school letter, 4 to 12 inches, in your colors and style." },
              { title: "Mascots", body: "School mascot patches in raised chenille to pair with the letter." },
              { title: "Sport & activity icons", body: "Sport, band, and club icons for the sleeves and chest." },
              { title: "Award stars & years", body: "Year patches, award stars, and bars marking each season and honor." },
            ].map((u) => (
              <div key={u.title} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="text-[16px] font-black text-panda-dark mb-2">{u.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUILD */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-8">
            How a Letterman Patch Is Built
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Type</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]"><Link href="/custom-patches/chenille" prefetch={false} className="text-panda-green underline font-semibold">Chenille</Link> for the raised varsity texture; <Link href="/custom-patches/embroidered" prefetch={false} className="text-panda-green underline font-semibold">embroidered</Link> for fine-detail year and sponsor patches.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Backing</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">Felt <Link href="/sew-on-patches" prefetch={false} className="text-panda-green underline font-semibold">sew-on</Link> base, stitched to the jacket for years of wear. Iron-on does not bond to chenille.</p>
            </div>
            <div className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
              <h3 className="text-[16px] font-black text-panda-dark mb-2">Size &amp; color</h3>
              <p className="text-[14px] text-gray-600 leading-[1.6]">4 to 12 inch letters, two-color and outlined styles, with free Pantone school-color matching.</p>
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
            Custom Letterman &amp; Varsity Patches From 5 Pieces
          </h2>
          <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4">
            <p>
              The letterman patch is a keepsake, worn for years and often kept for life, so the build matters.
              Chenille is the authentic choice: thick, raised yarn on a felt base gives the classic varsity letter
              its soft texture, and the felt is stitched on with a sew-on backing that lasts. We make the main
              school letter, the mascot, sport and activity icons, and the award stars, year patches, and bars
              that record each season, all matched to your exact school colors.
            </p>
            <p>
              With a 5-piece minimum and no setup fees, a single student can order a letter and a couple of award
              patches, or a school can run a whole team or graduating class with the unit price falling at volume.
              Chenille is priced by size, so larger letters cost more per piece, and we quote and show every design
              to scale on a free mockup first. Start on the <Link href="/custom-patches/chenille" prefetch={false} className="text-panda-green underline font-semibold">chenille patches</Link> page, read the <Link href="/custom-chenille-patches-guide" prefetch={false} className="text-panda-green underline font-semibold">chenille letterman guide</Link>, and choose <Link href="/sew-on-patches" prefetch={false} className="text-panda-green underline font-semibold">sew-on backing</Link>. Every order includes free worldwide shipping, unlimited free revisions, and a money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      <CategoryFAQ title="Letterman Patches FAQ" faqs={lettermanFAQs} />
      <CTASection />
      <Footer />
    </main>
  );
}
