import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutContent from "@/components/about/AboutContent";
import SocialReviews from "@/components/about/SocialReviews";
import Promises from "@/components/home/Promises";
import CTASection from "@/components/home/CTASection";
import FactorySection from "@/components/about/FactorySection";
import PickPatch from "@/components/about/PickPatch";
import ProcessSection from "@/components/home/ProcessSection";

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
