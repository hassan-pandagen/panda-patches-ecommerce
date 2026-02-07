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
import { PortableText } from "@portabletext/react";
import { convertWordPressUrl } from "@/lib/convertWordPressUrls";

export default function LocationLayout({ data }: { data: any }) {

  // Construct Hero Data with Multiple Images
  // For patch style pages, use the title directly. For location pages, add "Custom Patches in" prefix
  const heroData = {
    title: data.isPatchStyle
      ? data.locationName
      : `Custom Patches in ${data.locationName}`,
    description: data.isPatchStyle
      ? `The best source for ${data.locationName}. High quality, fast turnaround, and free design services.`
      : `The best source for Custom Patches in ${data.locationName}. High quality, fast turnaround, and free design services.`,
    gallery: data.gallery || [] // Pass the array of images
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

  return (
    <main className="min-h-screen bg-white">
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
        <section className="py-20 bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 max-w-[1000px]">
            <SEOText content={data.seoSection1} />
          </div>
        </section>
      )}

      {/* 8. POPULAR CATEGORIES (Industry Section) */}
      <IndustrySection />

      {/* 9. FAQ */}
      <FAQ />

      {/* 10. SEO TEXT SECTION 2 (Why Choose Us / Ordering Made Easy...) */}
      {data.seoSection2 && (
        <section className="py-20 bg-[#F9FAF5]">
          <div className="container mx-auto px-6 max-w-[1000px]">
            <SEOText content={data.seoSection2} />
          </div>
        </section>
      )}
      
      <CTASection />
      <Footer />
    </main>
  );
}
