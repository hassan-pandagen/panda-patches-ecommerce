import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Metadata } from 'next';
import { generateSchemaScript, generateFAQSchema } from "@/lib/schemas";
import { genericFaqs } from "@/lib/genericFaqs";
import { buildPageMetadata } from "@/lib/seo";
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
// Below-fold AI teaser — split its JS chunk out of the initial bundle (ssr:true keeps SSR markup)
const AiGeneratorTeaser = dynamic(() => import("@/components/ai-patch/AiGeneratorTeaser"), { ssr: true });
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
  // price is $0.91/pc, the EMBROIDERED rate the calculator returns at the
  // 2"x2", 1,000-pc basis (getFromPrice in pricingCalculator.ts). PAE792
  // supersedes the earlier $0.85 teaser: every advertised "from" price now
  // states that 2x2/1,000 basis so it can never be misread as a 5-piece
  // price, and it equals what the live configurator quotes at that basis.
  // TYPE LABEL REQUIRED (CEO, 2026-09-06). Printed publishes at $0.74, below
  // embroidered's $0.91, so a bare "from $0.91" is no longer the site floor —
  // it is false. Every advertised from-price now names its type beside the
  // figure, and verify:canon section 14 fails the build on an unlabelled one.
  return buildPageMetadata({
    title: "Custom Patches from $0.91/pc (embroidered, 1k) | 24h Mockup",
    description: "Custom patches: embroidered from $0.91/pc, printed from $0.74 (2x2, 1,000 pcs). Smaller orders cost more per piece. 5-piece minimum, free worldwide shipping.",
    url: "https://www.pandapatches.com",
    image: { url: ogImageUrl, alt: "Panda Patches custom embroidered patches from $0.91 per piece at 2x2 inches and 1,000 pieces" },
    ogTitle: "Custom Patches from $0.91/pc (embroidered, 1k). 24h Mockup.",
    ogDescription: "1,000,000+ patches delivered. Embroidered from $0.91/pc, printed from $0.74/pc (2x2, 1,000 pcs), with free artwork, no setup fees, mockup in 12 to 24 hours.",
    twitterDescription: "1,000,000+ patches delivered. Embroidered from $0.91/pc, printed from $0.74/pc (2x2, 1k pcs). Free artwork, no setup fees, mockup in 12-24 hours.",
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

/**
 * Homepage FAQ schema, generated from the SAME array the visible accordion
 * renders. It has to be, and it was not.
 *
 * Until 9 Sept 2026 this was a hand-written FAQPage of eight questions that
 * appeared nowhere on the page — "What is Panda Patches?", "Does Panda Patches
 * have a minimum order?" — while the accordion showed ten entirely different
 * ones from genericFaqs. Google requires FAQ markup to be visible on the page,
 * so all eight were ineligible, and the divergence had a second cost: the
 * hand-written copy was the stale one. It still quoted the pre-correction rush
 * and pricing lines that genericFaqs had already been fixed for.
 *
 * Deriving it means the two cannot disagree again. Edit the answers in
 * genericFaqs and the markup follows.
 */
const homeFaqSchema = generateFAQSchema(
  genericFaqs.map((f) => ({ question: f.question, answer: f.answer })),
);

// 1. THIS MUST BE A SERVER COMPONENT (No 'use client')
export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* FAQPage Schema — enables AI engines to extract and cite homepage answers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(homeFaqSchema)}
      />

      <Navbar />

      {/* 2. Hero fetches data from Sanity (Async) - TrustedBy section now inside Hero */}
      <Hero />

      {/* New Sections Added Here */}
      <div className="min-h-[300px] md:min-h-[400px] cv-auto" style={{ containIntrinsicSize: "auto 740px" }}>
        <Craftsmanship />
      </div>

      {/* Customer Reviews — social proof immediately after craftsmanship */}
      <div className="min-h-[400px] md:min-h-[500px] cv-auto" style={{ containIntrinsicSize: "auto 580px" }}>
        <ReviewsSection />
      </div>

      {/* Featured case study — internal link from the homepage (highest-authority page) */}
      <div className="px-6 py-5 text-center bg-panda-light">
        <Link
          href="/case-studies/wise-nasdaq-times-square-activation"
          className="inline-flex items-center gap-2 text-[0.875rem] md:text-[0.9375rem] font-bold text-panda-dark hover:text-panda-green transition-colors"
        >
          <span className="text-panda-green font-black">&#9733;</span>
          See how we delivered 9,600 patches for Wise&apos;s Nasdaq Times Square activation
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>

      <div className="cv-auto" style={{ containIntrinsicSize: "auto 584px" }}>
        <Promises />
      </div>

      {/* The New Grid — no content-visibility: it renders ~8500px tall on mobile
          vs shorter on desktop, so no single contain-intrinsic-size fits both;
          skipping it here was the dominant homepage CLS source (§3). */}
      <div>
        <ProductGrid />
      </div>

      {/* Process Section with Interactive Animation */}
      <div className="min-h-[300px] md:min-h-[400px] cv-auto" style={{ containIntrinsicSize: "auto 1780px" }}>
        <ProcessSection />
      </div>

      {/* Timeline/Zig-Zag Section */}
      <div className="cv-auto" style={{ containIntrinsicSize: "auto 1452px" }}>
        <TimelineSection />
      </div>

      {/* Panda AI teaser — discovery band for /ai-patch-generator. Mid-low
          placement on purpose: the CEO wants the tool visible for SEO and
          credibility without competing with the primary quote-form funnel. */}
      <div className="cv-auto" style={{ containIntrinsicSize: "auto 380px" }}>
        <AiGeneratorTeaser />
      </div>

      {/* FAQ Section with Accordion */}
      <div className="cv-auto" style={{ containIntrinsicSize: "auto 1242px" }}>
        <FAQ />
      </div>

      {/* Blog Section */}
      <div className="min-h-[400px] md:min-h-[550px] cv-auto" style={{ containIntrinsicSize: "auto 810px" }}>
        <BlogSection />
      </div>

      {/* SEO Content Section — 1074px was the legacy three-block version's height.
          The rewritten single-block section renders 238px at every width tested
          (360/390/1440), so the stale reservation collapsed by ~836px the moment
          it scrolled into view, jerking CTASection + Footer upward. Scroll-
          triggered, so lab CLS never sees it (CLB408_1 §1). */}
      <div className="cv-auto" style={{ containIntrinsicSize: "auto 240px" }}>
        <ContentSection />
      </div>

      {/* CTA Section */}
      <div className="cv-auto" style={{ containIntrinsicSize: "auto 460px" }}>
        <CTASection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
