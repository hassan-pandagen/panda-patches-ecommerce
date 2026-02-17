import { Metadata } from 'next';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutContent from "@/components/about/AboutContent";
import SocialReviews from "@/components/about/SocialReviews";
import Promises from "@/components/home/Promises";
import CTASection from "@/components/home/CTASection";
import FactorySection from "@/components/about/FactorySection";
import PickPatch from "@/components/about/PickPatch";
import ProcessSection from "@/components/home/ProcessSection";

// SEO Metadata for About Page
export const metadata: Metadata = {
  title: "About Panda Patches | 8+ Years Custom Patch Experts",
  description: "Learn about Panda Patches - 8+ years creating custom embroidered patches with low minimums. Family-owned, Pakistan-based factory, 4.9★ Trustpilot rating, trusted by military & sports teams.",
  openGraph: {
    title: "About Panda Patches | 8+ Years Custom Patch Experts",
    description: "Family-owned custom patch manufacturer with 8+ years experience. Low minimums, free design services, 4.9★ rated.",
    type: "website",
    url: "https://pandapatches.com/about",
    images: [
      {
        url: "https://pandapatches.com/assets/logo-panda.svg",
        width: 1200,
        height: 630,
        alt: "About Panda Patches"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Panda Patches | 8+ Years Custom Patch Experts",
    description: "Family-owned custom patch manufacturer with 8+ years experience. Low minimums, free design services.",
    images: ["https://pandapatches.com/assets/logo-panda.svg"]
  },
  alternates: {
    canonical: "https://pandapatches.com/about"
  }
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* 1. Main Text & Badges */}
      <AboutContent />
      
      {/* 2. Social Reviews (Grey Background) */}
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
