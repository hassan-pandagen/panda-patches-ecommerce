import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";
import AuthorByline from "@/components/seo/AuthorByline";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { generateSchemaScript, PERSON_ID, ORG_ID } from "@/lib/schemas";

const PUBLISHED = "2026-07-28";

/**
 * CL9BCF_1 item 4b flagged this as "draft for CEO review" — stale. The page
 * has been live since PUBLISHED above, unreviewed by anyone in this session's
 * history; the actual gap was that nothing on the site LINKED here (verified
 * 2026-08-16: zero inbound references anywhere except this file and the
 * sitemap). Linked now from /contact (pre-purchase trust surface) and
 * /success (post-purchase, reassurance-framed rather than doubt-framed).
 */

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "How to Vet a Custom Patch Supplier: A 7-Point Checklist",
    description:
      "A neutral checklist for choosing a reputable custom patch company: transparent all-in pricing, a mockup before payment, a disclosed production location, realistic minimums, stated turnaround and rush terms, verifiable third-party reviews, and real production data.",
    url: `${SITE_URL}/how-to-vet-a-custom-patch-supplier`,
    ogType: "article",
    ogDescription:
      "Seven things a reputable custom patch supplier should give you before you order — and the red flags to walk away from.",
  });
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Vet a Custom Patch Supplier: A 7-Point Checklist",
  description:
    "A neutral, criteria-based guide to choosing a reputable custom patch supplier, with the red flags to avoid.",
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  author: { "@id": PERSON_ID },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: `${SITE_URL}/how-to-vet-a-custom-patch-supplier`,
};

const CRITERIA = [
  {
    h: "1. Transparent, all-in pricing",
    good: "Per-piece prices published by quantity, or a written quote that states every cost up front.",
    flag: "&ldquo;Request a quote&rdquo; with no pricing published anywhere, or setup, mold, digitizing, or art fees that only appear at checkout.",
  },
  {
    h: "2. A mockup before you pay",
    good: "A digital proof of your exact design, at its real size, before any money changes hands and before production starts &mdash; with revisions until it is right.",
    flag: "Pay-first ordering, or &ldquo;we&rsquo;ll send a proof after you pay.&rdquo; You should never commit to production you haven&rsquo;t seen.",
  },
  {
    h: "3. A disclosed production location",
    good: "A straight answer about where patches are actually made. Honest sourcing is a sign the rest of the operation is honest too.",
    flag: "Vague &ldquo;US-based&rdquo; language that turns out to mean an office rather than a factory, or no answer at all.",
  },
  {
    h: "4. Realistic minimums",
    good: "A clearly stated minimum order (small suppliers often start around 5 to 50 pieces). You know exactly what you can order.",
    flag: "&ldquo;No minimum&rdquo; or &ldquo;order one piece&rdquo; claims that don&rsquo;t survive a real conversation, or a high minimum buried in the fine print.",
  },
  {
    h: "5. A stated turnaround with rush terms",
    good: "A real production window in business days, plus clear rush terms and what qualifies for them.",
    flag: "&ldquo;24-hour&rdquo; or next-day promises with no business-day basis, weekend claims, or no timeline offered at all.",
  },
  {
    h: "6. Verifiable third-party reviews",
    good: "Reviews on an independent platform you can click through to (Trustpilot, Google), with a visible count and a recent date.",
    flag: "Only on-site testimonials you can&rsquo;t verify, or a star rating with no link, no count, and no date.",
  },
  {
    h: "7. Real production data, not round numbers",
    good: "A supplier that can point to actual figures &mdash; order volumes, delivery times, quality steps &mdash; rather than only marketing slogans.",
    flag: "Unverifiable superlatives (&ldquo;fastest,&rdquo; &ldquo;best,&rdquo; &ldquo;#1&rdquo;) with nothing measurable behind them.",
  },
];

export default function VetSupplierGuide() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(articleSchema)} />

      <Navbar />

      <article className="max-w-[52.5rem] mx-auto px-6 py-16 md:py-20">
        <h1 className="text-[2rem] md:text-[2.75rem] font-black text-panda-dark leading-tight tracking-tight mb-4">
          How to Vet a Custom Patch Supplier
        </h1>
        <p className="text-[1.0625rem] text-gray-600 leading-[1.8] mb-8">
          Custom patches look simple, but suppliers vary enormously in honesty and quality. Use this seven-point
          checklist to separate a reputable manufacturer from a reseller that will surprise you with fees, timelines,
          or a product that doesn&rsquo;t match the proof. It applies to any supplier &mdash; the point is to ask the
          right questions before you order.
        </p>

        <div className="space-y-8">
          {CRITERIA.map((c) => (
            <section key={c.h} className="border-l-4 border-panda-green pl-5">
              <h2 className="text-[1.375rem] font-black text-panda-dark mb-2">{c.h}</h2>
              <p className="text-[1rem] text-gray-700 leading-[1.8]">
                <strong className="text-panda-dark">What good looks like:</strong>{" "}
                <span dangerouslySetInnerHTML={{ __html: c.good }} />
              </p>
              <p className="text-[1rem] text-gray-700 leading-[1.8] mt-2">
                <strong className="text-panda-dark">Red flag:</strong>{" "}
                <span dangerouslySetInnerHTML={{ __html: c.flag }} />
              </p>
            </section>
          ))}
        </div>

        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-[1.625rem] font-black text-panda-dark mb-3">Check the receipts</h2>
          <p className="text-[1rem] text-gray-700 leading-[1.8]">
            You can run this checklist against Panda Patches directly: the full{" "}
            <Link href="/how-much-do-custom-patches-cost-full-pricing-breakdown" prefetch={false} className="text-panda-green font-semibold underline">
              per-piece pricing breakdown
            </Link>{" "}
            (all-in, no setup fees), the{" "}
            <Link href="/patch-manufacturability-specs" prefetch={false} className="text-panda-green font-semibold underline">
              manufacturability specifications
            </Link>{" "}
            (what actually reproduces), the{" "}
            <Link href="/custom-patch-production-data-2026" prefetch={false} className="text-panda-green font-semibold underline">
              published production data
            </Link>{" "}
            (real order and turnaround numbers), and our{" "}
            <a href="https://www.trustpilot.com/review/pandapatches.com" target="_blank" rel="noopener noreferrer" className="text-panda-green font-semibold underline">
              independent Trustpilot reviews
            </a>
            . Production location is stated plainly on the{" "}
            <Link href="/ai-info/company" prefetch={false} className="text-panda-green font-semibold underline">
              company page
            </Link>
            , and every order includes a digital mockup before you pay.
          </p>
        </section>

        <div className="mt-12">
          <AuthorByline datePublished={PUBLISHED} dateModified={PUBLISHED} />
        </div>
      </article>

      <CTASection />
      <Footer />
    </main>
  );
}
