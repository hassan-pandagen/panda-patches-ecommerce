import { Metadata } from 'next';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateSchemaScript, generateBreadcrumbSchema, generateLocalBusinessSchema } from "@/lib/schemas";

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Contact", url: "https://www.pandapatches.com/contact" },
]);
const localBusinessSchema = generateLocalBusinessSchema();
import ContactHero from "@/components/contact/ContactHero";
import MapSection from "@/components/contact/MapSection";
import Promises from "@/components/home/Promises";
import PickPatch from "@/components/about/PickPatch";

// SEO Metadata for Contact Page
export const metadata: Metadata = {
  title: "Contact Us - Get Custom Patch Quote | Panda Patches",
  description: "Contact Panda Patches for custom patch quotes. Phone: +1 302 250 4340. Email: admin@pandapatches.com. Free design consultation available.",
  openGraph: {
    title: "Contact Us - Get Custom Patch Quote | Panda Patches",
    description: "Get in touch for custom patch quotes. Phone: +1 302 250 4340. Free design consultation available.",
    type: "website",
    url: "https://www.pandapatches.com/contact",
    images: [
      {
        url: "https://www.pandapatches.com/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Panda Patches"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Panda Patches",
    description: "Get custom patch quotes. Phone: +1 302 250 4340. Free design consultation.",
    images: ["https://www.pandapatches.com/assets/og-image.png"]
  },
  alternates: {
    canonical: "https://www.pandapatches.com/contact"
  }
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(localBusinessSchema)}
      />
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
