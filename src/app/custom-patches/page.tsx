import { client } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// COMPONENTS
import ProductHero from "@/components/product/ProductHero";
import PickPatch from "@/components/about/PickPatch";
import Promises from "@/components/home/Promises";
import CategoryZigZag from "@/components/product/CategoryZigZag";
import ProductInfoCarousel from "@/components/product/ProductInfoCarousel";
import ProcessSection from "@/components/home/ProcessSection";
import IndustrySection from "@/components/home/IndustrySection";
import FAQ from "@/components/home/FAQ";
import ContentSection from "@/components/home/ContentSection";
import Craftsmanship from "@/components/home/Craftsmanship";
import CTASection from "@/components/home/CTASection";

// ISR: Revalidate main patches page every 24 hours
export const revalidate = 86400;

async function getMainProductData() {
  const query = `*[_type == "productPage" && slug.current == "custom-patches"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function ProductLandingPage() {
  const data = await getMainProductData();

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <h1 className="text-2xl font-bold">Main Product Page Not Found</h1>
        <p className="text-gray-500">
          Please go to Sanity Studio and create a Product Page with slug: <strong>custom-patches</strong>
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* 1. HERO (Quote Form Mode) */}
      <ProductHero productData={data} isMainPage={true} />
      
      {/* 2. PICK YOUR PATCH (5 Cards) */}
      <PickPatch />
      
      {/* 3. PROMISES */}
      <Promises bgColor="bg-white" />

      {/* 4. CATEGORY ZIG-ZAG LIST */}
      <CategoryZigZag />

      {/* 5. EDUCATION (Backing & Borders) */}
      {data.backingOptions && data.backingOptions.length > 0 && (
        <ProductInfoCarousel 
          options={data.backingOptions} 
          title="Backing Options" 
          subtitle="Select the perfect backing"
          layout="left" 
        />
      )}

      {data.borderOptions && data.borderOptions.length > 0 && (
        <ProductInfoCarousel 
          options={data.borderOptions} 
          title="Border Options" 
          subtitle="Edge finishing styles"
          layout="right" 
        />
      )}
      
      {/* 6. GORILLA PROCESS */}
      <ProcessSection />

      {/* 7. INDUSTRY USE CASES */}
      <IndustrySection />

      {/* 8. FAQ & SEO */}
      <FAQ />
      <ContentSection />

      {/* 9. REELS & CTA */}
      <Craftsmanship />
      <CTASection />
      
      <Footer />
    </main>
  );
}
