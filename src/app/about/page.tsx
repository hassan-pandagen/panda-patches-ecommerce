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
import { generatePersonSchema, generateSchemaScript, ORG_ID } from "@/lib/schemas";
import SeeItMadeSection from "@/components/media/SeeItMadeSection";
import { factoryVideoSchema } from "@/lib/factoryVideo";
import { buildPageMetadata } from "@/lib/seo";

const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection"), { ssr: true });

// SEO Metadata for About Page
export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getSanityOgImage();
  return buildPageMetadata({
    // The 13 years belong to the FOUNDER, never the company (founded 2023).
    // The previous title/description attributed them to Panda Patches while the
    // page body correctly credited Imran — the metadata was the version showing
    // in the SERP. "Family-owned" was also removed: it is not true and does not
    // enter canon (CEO, Aug 2026).
    title: "About Panda Patches | Our Story, Facility and Founder",
    description: "Panda Patches is a US-registered custom patch manufacturer founded in 2023 by Imran Raza, who brings 13+ years in patch manufacturing. Own facility, low minimums, mockup in 12-24 hours.",
    url: "https://www.pandapatches.com/about",
    image: { url: ogImage, alt: "About Panda Patches" },
    ogDescription: "US-registered custom patch manufacturer founded in 2023 by Imran Raza, with 13+ years in patch manufacturing. Own facility, low minimums, money-back guarantee.",
    twitterDescription: "US-registered custom patch manufacturer founded in 2023 by Imran Raza, with 13+ years in patch manufacturing. Low minimums, free design services.",
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

      {/* VideoObject lives HERE and nowhere else. This page gives the factory
          tour its own section, a large player and a written account of what it
          shows, which is Google's bar for video structured data. The three
          other placements are references beside a different argument, and
          emitting it there is what produced 30 "Video isn't on a watch page"
          warnings in August (see Craftsmanship.tsx). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(factoryVideoSchema(ORG_ID))}
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

      {/* 4b. See it made — the factory tour, immediately after the section that
             describes the factory in prose. */}
      <SeeItMadeSection />

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
