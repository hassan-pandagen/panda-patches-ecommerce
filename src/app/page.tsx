import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { generateLocalBusinessSchema, generateSchemaScript } from "@/lib/schemas";
import { client, urlFor } from "@/lib/sanity";
import Hero from "@/components/home/Hero";
import Promises from "@/components/home/Promises";
import ProductGrid from "@/components/home/ProductGrid";

// Navbar is "use client" — dynamic import defers its JS bundle from critical path
// SSR: true ensures it still renders in the initial HTML
const Navbar = dynamic(() => import("@/components/layout/Navbar"), { ssr: true });

// Lazy load below-fold components to reduce initial JS bundle
// ssr:false for heavy interactive components (video, carousels) that are far below fold
const Craftsmanship = dynamic(() => import("@/components/home/Craftsmanship"), { ssr: true });
const ReviewsSection = dynamic(() => import("@/components/home/LazyReviewsSection"), { ssr: true });
const ProcessSection = dynamic(() => import("@/components/home/ProcessSection"), { ssr: true });
const TimelineSection = dynamic(() => import("@/components/home/TimelineSection"), { ssr: true });
const FAQ = dynamic(() => import("@/components/home/FAQ"), { ssr: true });
const BlogSection = dynamic(() => import("@/components/home/BlogSection"), { ssr: true });
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
      ogImageUrl = urlFor(hero.imageUrl).width(1200).height(630).quality(75).format('webp').url();
    }
  } catch {
    // fallback to static image
  }

  return {
    title: "Custom Patches | Embroidered, PVC & Woven | Free Design | Panda Patches",
    description: "Custom patches starting at $0.50/pc. Embroidered, PVC, woven, chenille & leather patches. Low 5-piece minimums, free design mockup in 24hrs, ships in 7-14 days. 1M+ delivered. Get your free quote!",
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

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Panda Patches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Panda Patches is a US-based custom patch company founded by Imran Raza, headquartered in Missouri City, Texas, built on 13 years of patch manufacturing experience. We design and manufacture embroidered, PVC, woven, chenille, and leather patches for small businesses, sports teams, military units, schools, motorcycle clubs, and brands across the United States. We have delivered over 1,000,000 custom patches and hold a 4.8-star Trustpilot rating from 66 verified reviews.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Panda Patches have a minimum order?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The minimum order at Panda Patches is 5 pieces on all patch types. There are no setup fees, no digitizing fees, and no hidden charges on any order size.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Panda Patches include a free mockup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Every order includes a free digital mockup delivered within 24 hours. Unlimited free revisions are included until you approve the design. Production never starts until you give written approval on the mockup.",
      },
    },
    {
      "@type": "Question",
      "name": "How much do custom patches cost at Panda Patches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Custom embroidered patches cost $3.60 per piece at 50 pieces, $2.40 at 100 pieces, $1.50 at 500 pieces, and $1.20 at 1,000 pieces. PVC patches cost $4.60 at 50 pieces, $3.40 at 100, $2.80 at 500, and $2.20 at 1,000. All prices include free US shipping and free mockup. No setup fees on any order.",
      },
    },
    {
      "@type": "Question",
      "name": "How long does it take to get custom patches from Panda Patches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard production is 7-14 business days after you approve your digital mockup. Rush production is available with delivery confirmed by email within 2-6 hours of ordering. Economy option (16-18 business days) saves 10% off the order total. Free US shipping is included on all orders.",
      },
    },
    {
      "@type": "Question",
      "name": "What types of custom patches does Panda Patches make?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Panda Patches makes embroidered patches, PVC patches, woven patches, chenille patches, and leather patches. All types are available with iron-on, sew-on, or Velcro backing. Velcro backing adds $30 flat to any order. Every order includes a free digital mockup within 24 hours, free US shipping, and no setup fees.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Panda Patches offer free shipping?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Free shipping is included on all orders to any US address with no minimum order value. No hidden fees or setup charges.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Panda Patches have a money-back guarantee?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Panda Patches offers a full money-back guarantee. If we cannot produce a design you are happy with after unlimited free revisions, you receive a full refund with no questions asked. Production never starts until you approve the mockup, so you are never charged for patches you have not approved.",
      },
    },
  ],
};

// 1. THIS MUST BE A SERVER COMPONENT (No 'use client')
export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* LocalBusiness Schema — triggers star ratings in Google Search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(generateLocalBusinessSchema())}
      />
      {/* FAQPage Schema — enables AI engines to extract and cite homepage answers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(homeFaqSchema)}
      />

      <Navbar />

      {/* 2. Hero fetches data from Sanity (Async) - TrustedBy section now inside Hero */}
      <Hero />

      {/* New Sections Added Here */}
      <div className="min-h-[300px] md:min-h-[400px] cv-auto">
        <Craftsmanship />
      </div>

      {/* Customer Reviews — social proof immediately after craftsmanship */}
      <div className="min-h-[400px] md:min-h-[500px] cv-auto">
        <ReviewsSection />
      </div>

      <div className="cv-auto">
        <Promises />
      </div>

      {/* The New Grid */}
      <div className="cv-auto">
        <ProductGrid />
      </div>

      {/* Process Section with Interactive Animation */}
      <div className="min-h-[300px] md:min-h-[400px] cv-auto">
        <ProcessSection />
      </div>

      {/* Timeline/Zig-Zag Section */}
      <div className="cv-auto">
        <TimelineSection />
      </div>

      {/* FAQ Section with Accordion */}
      <div className="cv-auto">
        <FAQ />
      </div>

      {/* Blog Section */}
      <div className="min-h-[400px] md:min-h-[550px] cv-auto">
        <BlogSection />
      </div>

      {/* SEO Content Section */}
      <div className="cv-auto">
        <ContentSection />
      </div>

      {/* CTA Section */}
      <div className="cv-auto">
        <CTASection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
