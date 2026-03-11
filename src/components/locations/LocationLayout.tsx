import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductHero from "@/components/product/ProductHero";
import TrustStrip from "@/components/products/TrustStrip";
import PickPatch from "@/components/about/PickPatch";
import Promises from "@/components/home/Promises";
import CategoryZigZag from "@/components/product/CategoryZigZag";
import ProcessSection from "@/components/home/ProcessSection";
import IndustrySection from "@/components/home/IndustrySection";
import FAQ from "@/components/home/FAQ";
import CTASection from "@/components/home/CTASection";
import LocationSEOSections from "@/components/locations/LocationSEOSections";
import { PortableText } from "@portabletext/react";
import { convertWordPressUrl } from "@/lib/convertWordPressUrls";
import { client } from "@/lib/sanity";
import locationFaqs from "@/lib/locationFaqs";
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
  const heroData = {
    title: data.isPatchStyle
      ? data.locationName
      : `Custom Patches in ${data.locationName}`,
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
            normal: ({children}) => <p className="text-[17px] leading-[1.8] mb-6 text-gray-600">{children}</p>,
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
        { name: "Home", url: "https://pandapatches.com" },
        { name: "Custom Patches", url: "https://pandapatches.com/custom-patches" },
        { name: data.locationName, url: `https://pandapatches.com/${slug}` },
      ]
    : [
        { name: "Home", url: "https://pandapatches.com" },
        { name: `Custom Patches in ${data.locationName}`, url: `https://pandapatches.com/${slug}` },
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

      {/* 1. HERO (Quote Form Mode) */}
      <ProductHero productData={heroData} isMainPage={true} />

      {/* 2. PANDA IS 5 STAR */}
      <TrustStrip />

      {/* 3. PICK YOUR PATCH */}
      <PickPatch />

      {/* 4. PROMISES */}
      <Promises bgColor="bg-white" />

      {/* 5. ZIG ZAG LIST (With Location Suffix for location pages only!) */}
      <CategoryZigZag locationName={data.isPatchStyle ? undefined : data.locationName} />

      {/* 6. GORILLA PROCESS */}
      <ProcessSection />

      {/* 7. SEO TEXT SECTION 1 (Buy [Location] Iron On...) */}
      {data.seoSection1 && (
        <section className="py-8 md:py-10 bg-white border-t border-b border-gray-100">
          <div className="container mx-auto px-6 max-w-[860px]">
            <div className="w-10 h-1 bg-panda-yellow mb-6 rounded-full" />
            <SEOText content={data.seoSection1} />
          </div>
        </section>
      )}

      {/* 8. POPULAR CATEGORIES (Industry Section) */}
      <IndustrySection />

      {/* 9. FAQ — location-specific if available, otherwise generic fallback */}
      <FAQ questions={locationFaqQuestions} />

      {/* 10. SEO TEXT SECTION 2 — Sanity content (from WordPress migration) */}
      {data.seoSection2 && (
        <section className="py-8 md:py-10 bg-[#F9FAF5] border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-[860px]">
            <div className="w-10 h-1 bg-panda-yellow mb-6 rounded-full" />
            <SEOText content={data.seoSection2} />
          </div>
        </section>
      )}

      {/* 11. HARDCODED SEO SECTIONS — location-specific content with interlinks */}
      {slug && <LocationSEOSections slug={slug} />}
      
      <CTASection />
      <Footer />
    </main>
  );
}
