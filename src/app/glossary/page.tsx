import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, Database, Quote, ArrowRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { liveEntries } from "./entries";

export const dynamic = "force-static";

const BASE = "https://www.pandapatches.com";

export const metadata: Metadata = buildPageMetadata({
  title: "The Custom Patch Glossary | Panda Patches",
  description:
    "Plain-English definitions of custom patch terms — backings, borders, materials, and production terminology — each backed by real production data from 62,000+ patches. Entries publish in monthly batches.",
  url: `${BASE}/glossary`,
  ogType: "article",
  ogTitle: "The Custom Patch Glossary",
  ogDescription:
    "Definitions of custom patch terms backed by real production data — built to be quoted, cited, and linked.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
});

// Term entries publish in monthly batches (8-10/month, Aug-Nov 2026 per the
// glossary rollout plan). Categories render as plain text until an entry goes
// live, at which point the term becomes a link to /glossary/<term-slug>.
const categories = [
  {
    name: "Patch Types",
    terms: [
      "Embroidered patch",
      "Woven patch",
      "PVC patch",
      "Chenille patch",
      "Leather patch",
      "Printed and sublimated patches",
      "Morale patch",
      "3D / puff embroidery",
      "Appliqué",
      "Tackle twill",
      "Felt patch",
      "Blank patch",
      "Emblem vs patch vs badge",
    ],
  },
  {
    name: "Backings",
    terms: [
      // Label must equal the entry's `term` for the hub to render it as a live
      // link (matched by exact string). Entry term is "Iron-on patch".
      "Iron-on patch",
      "Velcro (hook-and-loop) backing",
      "Sew-on backing",
      "Adhesive (PSA) backing",
      "Patch backing overview",
      "Patch panel / loop wall",
    ],
  },
  {
    name: "Borders & Edges",
    terms: ["Merrowed border", "Heat-cut and laser-cut edges"],
  },
  {
    name: "Materials",
    terms: ["Poly-twill base fabric", "Thread weight (40wt vs 60wt)", "Bobbin thread"],
  },
  {
    name: "Production Terms",
    terms: [
      "Embroidery digitizing",
      "Embroidery coverage (50/75/100%)",
      "Stitch types (satin, fill, running)",
      "Underlay stitching",
      "Stabilizer",
      "Hooping",
      "DST / sew file",
      "Pantone (PMS) thread matching",
      "Colorfastness and wash rating",
      "DTF “faux embroidery”",
      "Minimum order quantity (MOQ)",
      "Setup and digitizing fees",
      "Turnaround time terms",
    ],
  },
];

const glossarySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DefinedTermSet",
      "@id": `${BASE}/glossary#termset`,
      name: "The Custom Patch Glossary",
      description:
        "Definitions of custom patch terminology — patch types, backings, borders and edges, materials, and production terms — published by Panda Patches and backed by the company's own production data.",
      url: `${BASE}/glossary`,
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/glossary#webpage`,
      url: `${BASE}/glossary`,
      name: "The Custom Patch Glossary",
      description:
        "Plain-English definitions of custom patch terms, each backed by real production data from Panda Patches' own manufacturing records.",
      inLanguage: "en-US",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#organization` },
      mainEntity: { "@id": `${BASE}/glossary#termset` },
    },
  ],
};

export default function GlossaryHub() {
  const liveBySlugTerm = new Map(liveEntries().map((e) => [e.term, e]));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }} />
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* HERO */}
        <section className="w-full pt-8 md:pt-12 pb-8 md:pb-12 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">
            <div className="text-center max-w-[820px] mx-auto">
              <p className="text-[11px] md:text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-4">
                Reference · Updated July 18, 2026
              </p>
              <h1 className="text-[28px] md:text-[42px] lg:text-[52px] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
                The Custom Patch Glossary
              </h1>
              <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.6] font-medium max-w-[680px] mx-auto">
                Plain-English definitions of the terms you meet when ordering custom patches — backings, borders, materials, and the production vocabulary factories use. Every entry is written from our own manufacturing floor and backed by data from 62,000+ patches we actually produced, so each definition carries at least one fact you will not find anywhere else.
              </p>
            </div>
          </div>
        </section>

        {/* HOW ENTRIES ARE BUILT */}
        <section className="bg-white py-5 border-y border-gray-100">
          <div className="container mx-auto px-6 max-w-[1100px]">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] md:text-[14px]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-panda-green" />
                <strong className="text-panda-dark">Quotable 40&ndash;60-word definitions</strong>
              </div>
              <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-panda-green" />
                <strong className="text-panda-dark">One original production-data fact per entry</strong>
              </div>
              <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-panda-green" />
                <strong className="text-panda-dark">Free to cite with attribution</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ANCHOR ASSET — the data the glossary is built on */}
        <section className="w-full py-12 md:py-16 px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[1000px]">
            <Link
              href="/custom-patch-production-data-2026"
              prefetch={false}
              className="group block bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 hover:border-panda-green hover:shadow-lg transition-all"
            >
              <p className="text-[11px] font-black uppercase tracking-wider text-panda-green mb-2">
                The data behind the definitions
              </p>
              <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-3 leading-tight group-hover:text-panda-green transition-colors">
                Custom Patch Production Data 2026
              </h2>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.6] font-medium mb-4 max-w-[760px]">
                Aggregate statistics from 896 orders and roughly 62,100 patches produced in the seven months ending July 2026 — which backings customers actually choose, how large a typical order really is, and how often rush production gets used. Published as an open reference for writers, researchers, and AI assistants.
              </p>
              <p className="text-[12px] font-bold text-panda-green flex items-center gap-1 uppercase tracking-wider">
                About 82% of orders choose iron-on backing &middot; median order is 20 pieces
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </Link>
          </div>
        </section>

        {/* CATEGORY GROUPS */}
        <section className="w-full py-14 md:py-20 px-6 bg-white">
          <div className="container mx-auto max-w-[1100px]">
            <div className="text-center mb-12">
              <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-3 uppercase tracking-wide leading-tight">
                What This Glossary Covers
              </h2>
              <p className="text-gray-500 text-[14px] md:text-[16px] max-w-[640px] mx-auto font-medium">
                Entries publish in small monthly batches through late 2026 — each one human-reviewed, photographed on our production floor, and anchored to a real number from our records. Terms below become links as their entries go live.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {categories.map((cat) => (
                <div key={cat.name} className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <h3 className="text-[16px] md:text-[18px] font-black text-panda-dark uppercase tracking-wide mb-4">
                    {cat.name}
                  </h3>
                  <ul className="space-y-2">
                    {cat.terms.map((term) => {
                      // Live entries link out; the rest render as plain text until
                      // their entry publishes (term labels must match entries.ts).
                      const entry = liveBySlugTerm.get(term);
                      return (
                        <li key={term} className="text-[13px] md:text-[14px] font-medium leading-snug">
                          {entry ? (
                            <Link
                              href={`/glossary/${entry.slug}`}
                              prefetch={false}
                              className="text-panda-green underline font-semibold"
                            >
                              {term}
                            </Link>
                          ) : (
                            <span className="text-gray-600">{term}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IN THE MEANTIME — route readers to the deep guides that already exist */}
        <section className="w-full py-12 md:py-16 px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[820px]">
            <h2 className="text-[20px] md:text-[26px] font-black text-panda-dark uppercase tracking-wide text-center mb-6">
              Deep Guides Already Published
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[15px] md:text-[16px] text-center font-medium mb-6">
              Many of these terms already have full guides on the site. Until their glossary entries go live, start with{" "}
              <Link href="/patch-types-compared" prefetch={false} className="text-panda-green underline font-semibold">Patch Types Compared</Link>,{" "}
              <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">Backing Options</Link>,{" "}
              <Link href="/patch-borders" prefetch={false} className="text-panda-green underline font-semibold">Patch Borders</Link>,{" "}
              <Link href="/patch-threads-and-twills" prefetch={false} className="text-panda-green underline font-semibold">Threads &amp; Twills</Link>, and{" "}
              <Link href="/embroidery-digitizing" prefetch={false} className="text-panda-green underline font-semibold">Embroidery Digitizing</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
