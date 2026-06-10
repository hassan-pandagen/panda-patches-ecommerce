import type { Metadata } from 'next';
import dynamic from "next/dynamic";
import { getSanityOgImage } from "@/lib/sanityOgImage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutContent from "@/components/about/AboutContent";
import SocialReviews from "@/components/about/SocialReviews";
import Promises from "@/components/home/Promises";
import CTASection from "@/components/home/CTASection";
import FactorySection from "@/components/about/FactorySection";
import PickPatch from "@/components/about/PickPatch";
import ProcessSection from "@/components/home/ProcessSection";
import { generatePersonSchema, generateSchemaScript } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";

const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection"), { ssr: true });

// SEO Metadata for About Page
export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getSanityOgImage();
  return buildPageMetadata({
    title: "About Panda Patches | 13 Years Custom Patch Experts",
    description: "Learn about Panda Patches. 13 years of custom embroidered patch experience with low minimums. Family-owned with mockup in 12-24 hours and money-back guarantee.",
    url: "https://www.pandapatches.com/about",
    image: { url: ogImage, alt: "About Panda Patches" },
    ogDescription: "Family-owned custom patch company with 13 years of experience. Low minimums, free design services, money-back guarantee.",
    twitterDescription: "Family-owned custom patch company with 13 years of experience. Low minimums, free design services.",
  });
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Person Schema for E-E-A-T authority */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(generatePersonSchema())}
      />

      <Navbar />
      
      {/* 1. Main Text & Badges */}
      <AboutContent />

      {/* 2. Customer Reviews */}
      <ReviewsSection />

      {/* 3. Social Reviews (Grey Background) */}
      <SocialReviews />
      
      {/* 3. Promises (Grey Background - Blends with Reviews) */}
      <Promises bgColor="bg-[#F6F6F6]" />

      {/* 4. Factory Section (White Background) */}
      <FactorySection />

      {/* 5. Pick Your Patch (White Background) */}
      <PickPatch />
      
      {/* 6. Process Section (3-Step Quest) */}
      <ProcessSection />
      
      {/* 7. Bottom CTA */}
      <CTASection />
      
      <Footer />
    </main>
  );
}
