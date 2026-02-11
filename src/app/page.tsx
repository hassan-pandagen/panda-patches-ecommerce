import dynamic from 'next/dynamic';
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
