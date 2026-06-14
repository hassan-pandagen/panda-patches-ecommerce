import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { generateLocalBusinessSchema, generateSchemaScript } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { client, urlFor } from "@/lib/sanity";
import Hero from "@/components/home/Hero";
import Promises from "@/components/home/Promises";
import ProductGrid from "@/components/home/ProductGrid";
import AiGeneratorTeaser from "@/components/ai-patch/AiGeneratorTeaser";

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

  // Title 60 chars, meta 155 chars per WEBSIT_1.MD T8. Canonical "from"
  // price is $0.91/pc, the embroidered rate the calculator returns at the
  // 2"x2", 1,000-pc basis (getFromPrice in pricingCalculator.ts). PAE792
  // supersedes the earlier $0.85 teaser: every advertised "from" price now
  // states that 2x2/1,000 basis so it can never be misread as a 5-piece
  // price, and it equals what the live configurator quotes at that basis.
  return buildPageMetadata({
    title: "Custom Patches from $0.91/pc (1k) | Free Design, 24h Mockup",
    description: "Custom embroidered, PVC, woven & leather patches from $0.91/pc (2x2, 1,000 pcs). Smaller orders cost more per piece. 5-piece minimum, free worldwide shipping.",
    url: "https://www.pandapatches.com",
    image: { url: ogImageUrl, alt: "Panda Patches custom embroidered, PVC, and woven patches from $0.91 per piece at 2x2 inches and 1,000 pieces" },
    ogTitle: "Custom Patches from $0.91/pc (1k). Free Design. 24h Mockup.",
    ogDescription: "1,000,000+ patches delivered. Custom embroidered, PVC, chenille and woven from $0.91/pc (2x2, 1,000 pcs) with free artwork, no setup fees, mockup in 12 to 24 hours.",
    twitterDescription: "1,000,000+ patches delivered. From $0.91/pc (2x2, 1k pcs). Free artwork, no setup fees, mockup in 12-24 hours.",
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
  });
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
        "text": "Panda Patches is a custom patch company founded by Imran Raza, headquartered in Missouri City, Texas, built on 13 years of patch experience. We design and produce embroidered, PVC, woven, chenille, and leather patches for small businesses, sports teams, military units, schools, motorcycle clubs, and brands across the United States. We have delivered over 1,000,000 custom patches with a digital mockup in 12 to 24 hours, low 5-piece minimum, and money-back guarantee on every order.",
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
      "name": "Does Panda Patches include a mockup with every order?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Every order includes a digital mockup delivered in 12 to 24 hours. Unlimited free revisions are included until you approve the design. Production never starts until you give written approval on the mockup.",
      },
    },
    {
      "@type": "Question",
      "name": "How much do custom patches cost at Panda Patches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Custom embroidered patches cost about $3.92 per piece at 50 pieces, $2.55 at 100 pieces, $1.18 at 500 pieces, and $1.05 at 1,000 pieces for a 3-inch patch. PVC patches cost about $6.19 at 50 pieces, $4.33 at 100, $3.10 at 500, and $2.78 at 1,000. Smaller orders cost more per piece. All prices include free worldwide shipping and a digital mockup in 12 to 24 hours. No setup fees on any order.",
      },
    },
    {
      "@type": "Question",
      "name": "How long does it take to get custom patches from Panda Patches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard production is 7-14 business days after you approve your digital mockup. Rush production is available with delivery confirmed by email within 2-6 hours of ordering. Economy option (16-18 business days) saves 10% off the order total. Free worldwide shipping is included on all orders.",
      },
    },
    {
      "@type": "Question",
      "name": "What types of custom patches does Panda Patches make?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Panda Patches makes embroidered patches, PVC patches, woven patches, chenille patches, and leather patches. All types are available with iron-on, sew-on, or Velcro backing. Velcro backing adds $30 flat to any order. Every order includes a digital mockup in 12 to 24 hours, free worldwide shipping, and no setup fees.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Panda Patches offer free shipping?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Free worldwide shipping is included on every order regardless of size, with no hidden fees and no setup charges. Our minimum order is 5 pieces per design.",
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

      {/* Panda AI teaser — discovery band for /ai-patch-generator. Mid-low
          placement on purpose: the CEO wants the tool visible for SEO and
          credibility without competing with the primary quote-form funnel. */}
      <div className="cv-auto">
        <AiGeneratorTeaser />
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
