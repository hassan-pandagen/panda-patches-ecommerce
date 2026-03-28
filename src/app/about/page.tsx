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

const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection"), { ssr: true });

// SEO Metadata for About Page
export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getSanityOgImage();
  return {
    title: "About Panda Patches | 8+ Years Custom Patch Experts",
    description: "Learn about Panda Patches. 8+ years creating custom embroidered patches with low minimums. Family-owned factory, 4.8 star Trustpilot rating.",
    keywords: [
      "about Panda Patches",
      "custom patch manufacturer",
      "embroidered patch company",
      "patch maker USA",
      "Imran Raza founder",
      "custom patch experts",
      "patch supplier USA",
      "trusted patch manufacturer",
      "family owned patch company",
      "8 years patch manufacturing",
      "patch production factory",
      "ASI patch supplier",
      "wholesale patch manufacturer",
      "military patch maker",
      "police patch supplier",
    ],
    openGraph: {
      title: "About Panda Patches | 8+ Years Custom Patch Experts",
      description: "Family-owned custom patch manufacturer with 8+ years experience. Low minimums, free design services, 4.8★ rated.",
      type: "website",
      url: "https://pandapatches.com/about",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "About Panda Patches" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "About Panda Patches | 8+ Years Custom Patch Experts",
      description: "Family-owned custom patch manufacturer with 8+ years experience. Low minimums, free design services.",
      images: [ogImage],
    },
    alternates: {
      canonical: "https://pandapatches.com/about",
    },
  };
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

      {/* 2. Trustpilot Reviews */}
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
