import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// COMPONENTS
import ProductHero from "@/components/product/ProductHero";
import TrustStrip from "@/components/products/TrustStrip";
import Promises from "@/components/home/Promises";
import ProductTypesList from "@/components/products/ProductTypesList";
import ProductInfoCarousel from "@/components/product/ProductInfoCarousel";
import ProcessSection from "@/components/home/ProcessSection";
import WorkSamples from "@/components/product/WorkSamples";
import TimelineSection from "@/components/home/TimelineSection";
import FAQ from "@/components/home/FAQ";

// 1. Fetch Data
async function getData(slug: string) {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const query = `*[_type == "customProduct" && slug.current == $slug][0]`;
  const data = await client.fetch(query, { slug });
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug);
  if (!data) return { title: "Product Not Found" };
  
  return {
    title: `${data.title} | Panda Patches`,
    description: data.description,
    openGraph: { type: "website", title: data.title, description: data.description }
  };
}

// 2. Page Layout
export default async function CustomProductPage({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Product Not Found</h1>
    </div>
  );

  // === PROFESSIONAL SEO TEXT COMPONENT ===
  const SEOText = ({ content, bgColor = "bg-white" }: { content: any, bgColor?: string }) => (
    <section className={`py-20 ${bgColor}`}>
      <div className="container mx-auto px-6 max-w-[1000px]">
        
        <div className="text-gray-700">
          <PortableText 
            value={content} 
            components={{
              block: {
                // H2: Big, Black, Bold
                h2: ({children}) => (
                  <h2 className="text-[32px] md:text-[36px] font-black text-panda-dark mt-12 mb-6 leading-tight text-left">
                    {children}
                  </h2>
                ),
                // H3: Slightly smaller
                h3: ({children}) => (
                  <h3 className="text-[24px] font-bold text-panda-dark mt-10 mb-4 text-left">
                    {children}
                  </h3>
                ),
                // Paragraph: Readable size, Left Aligned
                normal: ({children}) => (
                  <p className="text-[17px] leading-[1.8] text-gray-600 mb-6 text-left">
                    {children}
                  </p>
                ),
                // Blockquote
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-panda-yellow pl-6 py-2 my-8 italic text-lg text-gray-600 bg-gray-50 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
              },
              list: {
                bullet: ({children}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-[17px] text-gray-600">{children}</ul>,
                number: ({children}) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-[17px] text-gray-600">{children}</ol>,
              }
            }}
          />
        </div>

      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* 1. HERO (Gallery + Quote Form) */}
      <ProductHero productData={data} isMainPage={true} />
      
      {/* 2. TRUST STRIP */}
      <TrustStrip />

      {/* 3. PANDA PROMISES */}
      <Promises bgColor="bg-white" />

      {/* 4. PRODUCT TYPES (The Main Zig-Zag List) */}
      <ProductTypesList types={data.productTypes} heading={data.productTypesHeading} />

      {/* 5. OPTION CAROUSELS (Zig Zag Flow) */}
      
      {/* Carousel 1 (e.g. Plating) - Left */}
      {data.option1Cards && data.option1Cards.length > 0 && (
        <ProductInfoCarousel 
          options={data.option1Cards} 
          title={data.option1Title || "Options"} 
          subtitle={data.option1Subtitle || ""} 
          layout="left" 
        />
      )}

      {/* Carousel 2 (e.g. Backing) - Right */}
      {data.option2Cards && data.option2Cards.length > 0 && (
        <ProductInfoCarousel 
          options={data.option2Cards} 
          title={data.option2Title || "Options"} 
          subtitle={data.option2Subtitle || ""} 
          layout="right" 
        />
      )}

      {/* Carousel 3 (e.g. Packaging) - Left */}
      {data.option3Cards && data.option3Cards.length > 0 && (
        <ProductInfoCarousel 
          options={data.option3Cards} 
          title={data.option3Title || "Options"} 
          subtitle={data.option3Subtitle || ""} 
          layout="left" 
        />
      )}

      {/* 6. GORILLA PROCESS */}
      <ProcessSection />

      {/* 7. WORK SAMPLES */}
      {data.workSamples && data.workSamples.length > 0 && (
        <WorkSamples samples={data.workSamples} />
      )}

      {/* 8. SEO SECTION 1 (White Background) */}
      {data.seoTop && <SEOText content={data.seoTop} bgColor="bg-white" />}

      {/* 9. HOW TO ORDER (Timeline) */}
      <TimelineSection />

      {/* 10. FAQ */}
      <FAQ />

      {/* 11. SEO SECTION 2 (Grey Background to separate it) */}
      {data.seoBottom && <SEOText content={data.seoBottom} bgColor="bg-[#F9FAF5]" />}
      
      <Footer />
    </main>
  );
}
