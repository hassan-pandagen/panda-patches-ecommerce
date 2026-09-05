import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductHero from "@/components/product/ProductHero";
import HatPageHero from "@/components/locations/HatPageHero";
import TrustStrip from "@/components/products/TrustStrip";
import PickPatch from "@/components/about/PickPatch";
import Promises from "@/components/home/Promises";
import CategoryZigZag from "@/components/product/CategoryZigZag";
import ProcessSection from "@/components/home/ProcessSection";
import IndustrySection from "@/components/home/IndustrySection";
import FAQ from "@/components/home/FAQ";
import LetterPackageCards from "@/components/letters/LetterPackageCards";
import YarnColourChart from "@/components/letters/YarnColourChart";
import CTASection from "@/components/home/CTASection";
import LocationSEOSections from "@/components/locations/LocationSEOSections";
import Craftsmanship from "@/components/home/Craftsmanship";
import ReviewsSection from "@/components/home/ReviewsSection";
import BulkCaseStudies from "@/components/bulk/BulkCaseStudies";
import { PortableText } from "@portabletext/react";
import { convertWordPressUrl } from "@/lib/convertWordPressUrls";
import { client } from "@/lib/sanity";
import locationFaqs from "@/lib/locationFaqs";
import StickyMobileCTA from "@/components/locations/StickyMobileCTA";
import ReviewSnippet from "@/components/layout/ReviewSnippet";
import ProductReviews from "@/components/reviews/ProductReviews";
import locationDescriptions from "@/lib/locationDescriptions";
import { generateFAQSchema, generateBreadcrumbSchema, generateSchemaScript } from "@/lib/schemas";

async function getFallbackGallery() {
  try {
    const query = `*[_type == "productPage" && slug.current == "embroidered"][0].workSamples[0..7]`;
    return await client.fetch(query) || [];
  } catch {
    return [];
  }
}

export default async function LocationLayout({ data, slug }: { data: any; slug?: string }) {

  // Look up location-specific FAQs and hero description
  const locationFaqQuestions = slug ? locationFaqs[slug] : undefined;
  const locationDescription = slug ? locationDescriptions[slug] : undefined;

  // Use location gallery if available, otherwise fall back to embroidered work samples
  const gallery = (data.gallery && data.gallery.length > 0)
    ? data.gallery
    : await getFallbackGallery();

  // Construct Hero Data with Multiple Images
  // For patch style pages, use the title directly. For location pages, add "Custom Patches in" prefix
  // H1 overrides for pages whose headline should sell a product rather than
  // name a category. Only the hero H1 changes; breadcrumb, reviews and schema
  // keep the Sanity title, because "…Alphabet Set $150 reviews" reads wrong.
  const H1_OVERRIDE: Record<string, string> = {
    // CLDB68 §4.2: the package is the conversion; the H1 should say so.
    "chenille-letters": "Custom Chenille Letters: Full A-Z Alphabet Set $150",
  };
  const heroData = {
    title: (slug && H1_OVERRIDE[slug]) ?? (data.isPatchStyle
      ? data.locationName
      : `Custom Patches in ${data.locationName}`),
    description: locationDescription || (data.isPatchStyle
      ? `The best source for ${data.locationName}. High quality, fast turnaround, and free design services.`
      : `The best source for Custom Patches in ${data.locationName}. High quality, fast turnaround, and free design services.`),
    gallery: gallery
  };

  // Reusable Component for Rich Text Styling
  const SEOText = ({ content }: { content: any }) => (
    <div className="text-gray-700">
      <PortableText
        value={content}
        components={{
          block: {
            h2: ({children}) => <h2 className="text-3xl font-black text-panda-dark mt-12 mb-6 leading-tight">{children}</h2>,
            h3: ({children}) => <h3 className="text-2xl font-bold text-panda-dark mt-8 mb-4">{children}</h3>,
            normal: ({children}) => <p className="text-[1.0625rem] leading-[1.8] mb-6 text-gray-600">{children}</p>,
          },
          marks: {
            strong: ({children}) => <strong className="font-bold text-panda-dark">{children}</strong>,
            em: ({children}) => <em className="italic">{children}</em>,
            // Links - Auto-convert WordPress URLs to Next.js URLs
            link: ({value, children}) => {
              const originalHref = value?.href || '';
              const convertedHref = convertWordPressUrl(originalHref);

              // Check if it's an external link (keeps Instagram, social media, etc.)
              const isExternal = convertedHref.startsWith('http');
              const target = isExternal ? '_blank' : undefined;
              const rel = isExternal ? 'noopener noreferrer' : undefined;

              // Use Next.js Link for internal links, regular <a> for external
              if (isExternal) {
                return (
                  <a href={convertedHref} target={target} rel={rel} className="text-blue-600 underline hover:text-blue-800 font-medium">
                    {children}
                  </a>
                );
              } else {
                return (
                  <Link href={convertedHref} className="text-blue-600 underline hover:text-blue-800 font-medium">
                    {children}
                  </Link>
                );
              }
            }
          }
        }}
      />
    </div>
  );

  // Generate breadcrumb schema
  const breadcrumbItems = data.isPatchStyle
    ? [
        { name: "Home", url: "https://www.pandapatches.com" },
        { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
        { name: data.locationName, url: `https://www.pandapatches.com/${slug}` },
      ]
    : [
        { name: "Home", url: "https://www.pandapatches.com" },
        { name: `Custom Patches in ${data.locationName}`, url: `https://www.pandapatches.com/${slug}` },
      ];
  const breadcrumbSchema = slug ? generateBreadcrumbSchema(breadcrumbItems) : null;
  const faqSchema = locationFaqQuestions ? generateFAQSchema(locationFaqQuestions) : null;

  return (
    <main className="min-h-screen bg-white">
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(faqSchema)}
        />
      )}
      <Navbar />

      {/* 1. HERO — hat page gets BulkQuoteForm hero, all others get standard ProductHero */}
      {slug === 'patches-for-hats' ? (
        <HatPageHero
          title={heroData.title}
          description={heroData.description}
          gallery={heroData.gallery}
        />
      ) : (
        <ProductHero productData={heroData} isMainPage={true} />
      )}

      {/* 2. TRUST STRIP */}
      <TrustStrip />

      {slug === 'patches-for-hats' ? (
        <>
          {/* HAT PAGE ORDER — optimised for conversion */}

          {/* 3. Review snippet — social proof immediately below hero */}
          <ReviewSnippet />

          {/* 4. Craftsmanship gallery — visual proof early */}
          <Craftsmanship />

          {/* 4. Customer reviews — social proof */}
          <ReviewsSection />

          {/* 5. Promises */}
          <Promises bgColor="bg-white" />

          {/* 6. Hat-specific content: type grid, size guide, patch types, backing, who orders, pricing, SEO */}
          <LocationSEOSections slug={slug} />

          {/* 7. Case studies */}
          <BulkCaseStudies />

          {/* 8. Hat FAQ */}
          <FAQ questions={locationFaqQuestions} />

          {/* After-FAQ CTA */}
          <div className="py-10 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-[53.75rem] text-center">
              <p className="text-[1.125rem] md:text-[1.375rem] font-black text-panda-dark mb-2">Ready to create your custom hat patches?</p>
              <p className="text-[0.9375rem] text-gray-500 mb-6">Upload your design and get a mockup in 12-24 hours.</p>
              <a href="#quote-form" className="inline-block bg-panda-green text-white font-black text-[1rem] px-10 py-4 rounded-full hover:bg-panda-dark transition-colors shadow-lg">Start Your Order</a>
            </div>
          </div>

          {/* 9. Our process */}
          <ProcessSection />

          {/* 10. Explore patch types */}
          <PickPatch />

          {/* Sticky mobile CTA — appears after scrolling past hero */}
          <StickyMobileCTA />

        </>
      ) : (
        <>
          {/* DEFAULT ORDER — all other location / patch style pages */}

          {/* 2b. LETTER/NUMBER PACKAGES (CLDB68 §4.2).
              Slug-gated rather than a new route: /chenille-letters is a live
              Sanity patchStyle with the designer's images, and moving it to a
              repo route would orphan that content. Placed directly under the
              hero because the brief says the page LEADS with the products; the
              quote form stays below for custom fonts, multi-colour letters,
              sizes above the range and partial sets. */}
          {slug === "chenille-letters" && (
            <>
              <section id="packages" className="py-10 md:py-14 bg-white scroll-mt-24">
                <div className="container mx-auto px-6 max-w-[62.5rem]">
                  <LetterPackageCards />
                </div>
              </section>
              {/* The chart sits BELOW the picker, not above it. Someone ready to
                  buy should meet the configurator first; the full chart is the
                  reference they scroll to when they want to compare, and the
                  page it anchors (#yarn-colours) is what we link from a quote
                  conversation. */}
              <section id="yarn-colours" className="py-10 md:py-14 bg-[#F9FAF5] scroll-mt-24">
                <div className="container mx-auto px-6 max-w-[62.5rem]">
                  <YarnColourChart />
                </div>
              </section>
            </>
          )}

          {/* 3. PICK YOUR PATCH */}
          <PickPatch />

          {/* 4. PROMISES */}
          <Promises bgColor="bg-white" />

          {/* 5. ZIG ZAG LIST */}
          <CategoryZigZag locationName={data.isPatchStyle ? undefined : data.locationName} />

          {/* 6. GORILLA PROCESS */}
          <ProcessSection />

          {/* 7. SEO TEXT SECTION 1 */}
          {data.seoSection1 && (
            <section className="py-8 md:py-10 bg-white border-t border-b border-gray-100">
              <div className="container mx-auto px-6 max-w-[53.75rem]">
                <div className="w-10 h-1 bg-panda-yellow mb-6 rounded-full" />
                <SEOText content={data.seoSection1} />
              </div>
            </section>
          )}

          {/* 8. POPULAR CATEGORIES */}
          <IndustrySection />

          {/* 9. FAQ */}
          <FAQ questions={locationFaqQuestions} />

          {/* 10. SEO TEXT SECTION 2 */}
          {data.seoSection2 && (
            <section className="py-8 md:py-10 bg-[#F9FAF5] border-t border-gray-100">
              <div className="container mx-auto px-6 max-w-[53.75rem]">
                <div className="w-10 h-1 bg-panda-yellow mb-6 rounded-full" />
                <SEOText content={data.seoSection2} />
              </div>
            </section>
          )}

          {/* 11. HARDCODED SEO SECTIONS */}
          {slug && <LocationSEOSections slug={slug} />}
        </>
      )}

      {/* Product reviews — patchStyle pages only. Renders the SAME genuine reviews
          that back this product's Product.aggregateRating (patchStyleProductSchema
          -> productReviews.ts), satisfying Google's "rated reviews must be visible
          on the page" rule. Location pages carry no product rating, so it no-ops
          for them. Renders nothing when a product lacks enough real reviews. */}
      {data.isPatchStyle && slug && (
        <ProductReviews productKey={slug} productName={data.locationName} />
      )}

      <CTASection />
      <Footer />
    </main>
  );
}
