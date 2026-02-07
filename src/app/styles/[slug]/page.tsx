import { client } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PortableText } from "@portabletext/react";

// COMPONENTS
import ProductHero from "@/components/product/ProductHero"; // Reusing Hero (Gallery + Form)
import TrustStrip from "@/components/products/TrustStrip"; // 5 Star Strip
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection"; // Gorilla
import WorkSamples from "@/components/product/WorkSamples";
import TimelineSection from "@/components/home/TimelineSection"; // The 4 Steps (Zig Zag)
import FAQ from "@/components/home/FAQ";
import CTASection from "@/components/home/CTASection";

async function getStylePageData(slug: string) {
  const query = `*[_type == "patchStyle" && slug.current == "${slug}"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function PatchStylePage({ params }: { params: { slug: string } }) {
  const data = await getStylePageData(params.slug);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
      </div>
    );
  }

  // Helper for SEO Text Styling
  const SEOBlock = ({ title, content }: { title: string, content: any }) => (
    <section className="py-16 max-w-[1000px] mx-auto px-6">
      {title && (
        <h2 className="text-[32px] font-black text-panda-dark uppercase mb-6 text-center lg:text-left">
          {title}
        </h2>
      )}
      <div className="prose prose-lg text-gray-600 leading-relaxed">
        <PortableText value={content} />
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* 1. HERO (Gallery Left, Quote Form Right) */}
      {/* isMainPage={true} -> Shows Quote Form */}
      <ProductHero productData={data} isMainPage={true} />

      {/* 2. TRUST STRIP (Panda is 5 Star) */}
      <TrustStrip />

      {/* 3. PANDA PROMISES */}
      <Promises bgColor="bg-white" />

      {/* 4. GORILLA PROCESS (Sketch -> Mockup -> Patch) */}
      <ProcessSection />

      {/* 5. SEO SECTION 1 */}
      {data.seoContent1 && (
        <SEOBlock title={data.seoTitle1} content={data.seoContent1} />
      )}

      {/* 6. WORK SAMPLES (Specific to this style) */}
      <WorkSamples samples={data.workSamples} />

      {/* 7. SEO SECTION 2 */}
      {data.seoContent2 && (
        <div className="bg-[#F9FAF5]">
           <SEOBlock title={data.seoTitle2} content={data.seoContent2} />
        </div>
      )}

      {/* 8. FAQ */}
      <FAQ />

      {/* 9. HOW TO ORDER (Replaced Panda Cartoons with Home Timeline) */}
      <TimelineSection />

      {/* 10. CTA & Footer */}
      <CTASection />
      <Footer />
    </main>
  );
}
