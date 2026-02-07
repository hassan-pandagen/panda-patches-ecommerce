import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/contact/ContactHero";
import MapSection from "@/components/contact/MapSection";
import Promises from "@/components/home/Promises";
import PickPatch from "@/components/about/PickPatch";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* 1. Contact Form & Info */}
      <ContactHero />
      
      {/* 2. Panda Promises (White Background) */}
      <Promises bgColor="bg-white" />

      {/* 3. Pick Your Patch (Reused) */}
      <PickPatch />

      {/* 4. Map Section */}
      <MapSection />
      
      <Footer />
    </main>
  );
}
