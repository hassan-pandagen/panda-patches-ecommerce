import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { generateLocalBusinessSchema, generateSchemaScript } from "@/lib/schemas";
import { client, urlFor } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Promises from "@/components/home/Promises";
import ProductGrid from "@/components/home/ProductGrid";

// Lazy load below-fold components to reduce initial JS bundle
// ssr:false for heavy interactive components (video, carousels) that are far below fold
const Craftsmanship = dynamic(() => import("@/components/home/Craftsmanship"), { ssr: false });
const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection"), { ssr: false });
const ProcessSection = dynamic(() => import("@/components/home/ProcessSection"), { ssr: false });
const TimelineSection = dynamic(() => import("@/components/home/TimelineSection"), { ssr: true });
const FAQ = dynamic(() => import("@/components/home/FAQ"), { ssr: true });
const BlogSection = dynamic(() => import("@/components/home/BlogSection"), { ssr: false });
const ContentSection = dynamic(() => import("@/components/home/ContentSection"), { ssr: true });
const CTASection = dynamic(() => import("@/components/home/CTASection"), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: true });

// ISR: Revalidate homepage every hour
export const revalidate = 3600;

// SEO Metadata for Homepage — OG image pulled live from Sanity hero image
export async function generateMetadata(): Promise<Metadata> {
  let ogImageUrl = "https://www.pandapatches.com/assets/og-image.png"; // fallback

  try {
    const hero = await client.fetch(`*[_type == "hero"][0]{ "imageUrl": heroImage.asset->url }`, {}, { next: { revalidate: 3600 } });
    if (hero?.imageUrl) {
      ogImageUrl = urlFor(hero.imageUrl).width(1200).height(630).quality(85).auto('format').url();
    }
  } catch {
    // fallback to static image
  }

  return {
    title: "Custom Patches, Embroidered Patches - Low Minimums | Panda Patches",
    description: "Custom embroidered patches, iron-on patches, woven and PVC patches with no minimum orders. Free design, fast 7-14 day delivery. Get a free quote!",
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
      title: "Custom Patches From $0.50/pc. Free Design. Ships in 14 Days.",
      description: "1,000,000+ patches delivered to brands worldwide. Custom embroidered, PVC, chenille & woven patches with free artwork, no setup fees, and a 4.8-star rating on Trustpilot. Get your free quote today.",
      type: "website",
      url: "https://www.pandapatches.com",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Panda Patches - Custom Embroidered Patches From $0.50/pc"
        }
      ],
      siteName: "Panda Patches"
    },
    twitter: {
      card: "summary_large_image",
      title: "Custom Patches From $0.50/pc. Free Design. Ships in 14 Days.",
      description: "1,000,000+ patches delivered worldwide. Free artwork, no setup fees, 4.8 stars on Trustpilot.",
      images: [ogImageUrl]
    },
    alternates: {
      canonical: "https://www.pandapatches.com"
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
}

// 1. THIS MUST BE A SERVER COMPONENT (No 'use client')
export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* LocalBusiness Schema — triggers star ratings in Google Search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(generateLocalBusinessSchema())}
      />

      <Navbar />

      {/* 2. Hero fetches data from Sanity (Async) - TrustedBy section now inside Hero */}
      <Hero />

      {/* New Sections Added Here */}
      <Craftsmanship />

      {/* Customer Reviews — social proof immediately after craftsmanship */}
      <ReviewsSection />

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
