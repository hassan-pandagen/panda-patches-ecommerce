import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Craftsmanship from "@/components/home/Craftsmanship";
import Promises from "@/components/home/Promises";
import ProductGrid from "@/components/home/ProductGrid";

// Lazy load below-fold components to improve initial page load
const ProcessSection = dynamic(() => import("@/components/home/ProcessSection"), { ssr: true });
const TimelineSection = dynamic(() => import("@/components/home/TimelineSection"), { ssr: true });
const FAQ = dynamic(() => import("@/components/home/FAQ"), { ssr: true });
const BlogSection = dynamic(() => import("@/components/home/BlogSection"), { ssr: true });
const ContentSection = dynamic(() => import("@/components/home/ContentSection"), { ssr: true });
const CTASection = dynamic(() => import("@/components/home/CTASection"), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: true });

// ISR: Revalidate homepage every hour
// Revalidate every 60 seconds (faster for development, increase for production)
export const revalidate = 60;

// SEO Metadata for Homepage
export const metadata: Metadata = {
  title: "Custom Patches & Embroidered Patches - No Minimums | Panda Patches",
  description: "Create custom embroidered patches, iron-on patches, woven patches, PVC patches with no minimum orders. Free design, fast 7-14 day delivery, 4.9★ rated. Get instant quote!",
  keywords: [
    "custom patches",
    "embroidered patches",
    "iron on patches",
    "custom embroidered patches",
    "woven patches",
    "PVC patches",
    "no minimum patches",
    "custom patch maker",
    "patch design services"
  ],
  openGraph: {
    title: "Custom Patches & Embroidered Patches - No Minimums | Panda Patches",
    description: "Create custom embroidered patches, iron-on patches, woven patches with no minimums. Free design, fast delivery, 4.9★ rated by 50+ customers.",
    type: "website",
    url: "https://pandapatches.com",
    images: [
      {
        url: "https://pandapatches.com/assets/logo-panda.svg",
        width: 1200,
        height: 630,
        alt: "Panda Patches - Custom Embroidered Patches"
      }
    ],
    siteName: "Panda Patches"
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Patches & Embroidered Patches - No Minimums",
    description: "Create custom embroidered patches with no minimums. Free design, fast delivery, 4.9★ rated.",
    images: ["https://pandapatches.com/assets/logo-panda.svg"]
  },
  alternates: {
    canonical: "https://pandapatches.com"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
};

// 1. THIS MUST BE A SERVER COMPONENT (No 'use client')
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* 2. Hero fetches data from Sanity (Async) - TrustedBy section now inside Hero */}
      <Hero />

      {/* New Sections Added Here */}
      <Craftsmanship />
      <Promises />
      
      {/* The New Grid */}
      <ProductGrid />

      {/* Process Section with Interactive Animation */}
      <ProcessSection />

      {/* Timeline/Zig-Zag Section */}
      <TimelineSection />

      {/* FAQ Section with Accordion */}
      <FAQ />

      {/* Blog Section */}
      <BlogSection />

      {/* SEO Content Section */}
      <ContentSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
