import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import AuthorByline from "@/components/seo/AuthorByline";
import { buildPageMetadata } from "@/lib/seo";
import { getEntry, isLive, liveEntries } from "../entries";

export const dynamic = "force-static";

const BASE = "https://www.pandapatches.com";

// Unpublished slugs must 404 — entries go live only via the registry gate
// (photo + human review), never by URL guessing.
export const dynamicParams = false;

export function generateStaticParams() {
  return liveEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry || !isLive(entry)) return {};
  return buildPageMetadata({
    title: `${entry.term} — Definition | The Custom Patch Glossary`,
    description: entry.definition.length > 155 ? `${entry.definition.slice(0, 152)}...` : entry.definition,
    url: `${BASE}/glossary/${entry.slug}`,
    ogType: "article",
    ogTitle: `What is a ${entry.term.toLowerCase()}?`,
    ogDescription: entry.fact,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1 },
    },
  });
}

export default async function GlossaryEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry || !isLive(entry)) notFound();

  const url = `${BASE}/glossary/${entry.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${url}#term`,
        name: entry.term,
        description: entry.definition,
        url,
        inDefinedTermSet: { "@id": `${BASE}/glossary#termset` },
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: `${entry.term} — definition and production data`,
        description: entry.definition,
        url,
        mainEntity: { "@id": `${url}#term` },
        author: { "@id": `${BASE}/#person/imran-raza` },
        publisher: { "@id": `${BASE}/#organization` },
        inLanguage: "en-US",
        ...(entry.datePublished ? { datePublished: entry.datePublished } : {}),
        ...(entry.dateModified ? { dateModified: entry.dateModified } : {}),
        ...(entry.photo ? { image: `${BASE}${entry.photo.src}` } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Glossary", item: `${BASE}/glossary` },
          { "@type": "ListItem", position: 2, name: entry.term, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* HEADER + DEFINITION FIRST — the quotable paragraph leads, nothing above it */}
        <section className="w-full pt-8 md:pt-12 pb-8 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-[51.25rem]">
            <nav className="text-[0.75rem] font-bold uppercase tracking-wider text-gray-500 mb-5">
              <Link href="/glossary" prefetch={false} className="text-panda-green hover:underline">
                Glossary
              </Link>
              {" / "}
              <span className="text-panda-dark">{entry.category}</span>
            </nav>
            <h1 className="text-[1.75rem] md:text-[2.5rem] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              {entry.term}
            </h1>
            <p className="text-[1rem] md:text-[1.1875rem] text-panda-dark leading-[1.7] font-medium">
              {entry.definition}
            </p>
          </div>
        </section>

        {/* FLOOR PHOTO */}
        {entry.photo && (
          <section className="w-full pb-8 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-[51.25rem]">
              <Image
                src={entry.photo.src}
                alt={entry.photo.alt ?? entry.term}
                width={1600}
                height={1000}
                className="w-full h-auto rounded-2xl border border-gray-200"
              />
              <p className="text-[0.75rem] text-gray-500 mt-2 font-medium">
                Photographed on the Panda Patches production floor.
              </p>
            </div>
          </section>
        )}

        {/* THE FACT — the one number nobody else publishes */}
        <section className="w-full py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <div className="bg-[#F7F7F7] border-l-4 border-panda-green rounded-r-2xl p-5 md:p-6">
              <p className="text-[0.6875rem] font-black uppercase tracking-wider text-panda-green mb-2">
                From our production data
              </p>
              <p className="text-[0.9375rem] md:text-[1rem] text-panda-dark leading-[1.7] font-medium">{entry.fact}</p>
            </div>
          </div>
        </section>

        {/* WHEN TO CHOOSE IT — honest trade-offs */}
        <section className="w-full py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.25rem] md:text-[1.5rem] font-black text-panda-dark uppercase tracking-wide mb-4">
              When to choose it — and when not to
            </h2>
            {entry.whenToChoose.map((p) => (
              <p key={p.slice(0, 40)} className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-3">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* FULL GUIDE (Mode A) */}
        {entry.fullGuide && (
          <section className="w-full py-6 px-4 md:px-6 bg-white">
            <div className="container mx-auto max-w-[51.25rem]">
              <Link
                href={entry.fullGuide.href}
                prefetch={false}
                className="group flex items-center justify-between bg-panda-dark rounded-2xl p-5 md:p-6 hover:bg-panda-green transition-colors"
              >
                <span className="text-[0.9375rem] md:text-[1.0625rem] font-black text-white">
                  Full guide: {entry.fullGuide.label}
                </span>
                <ArrowRight className="w-5 h-5 text-panda-yellow group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        )}

        {/* RELATED */}
        <section className="w-full py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <p className="text-[0.875rem] text-gray-500 leading-relaxed font-medium">
              <span className="font-bold text-panda-dark">Related:</span>{" "}
              {entry.related.map((r, i) => (
                <span key={r.href}>
                  {i > 0 && " · "}
                  <Link href={r.href} prefetch={false} className="text-panda-green underline font-semibold">
                    {r.label}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* BYLINE — E-E-A-T: named author on every published entry */}
        <section className="w-full py-6 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <AuthorByline datePublished={entry.datePublished} dateModified={entry.dateModified} />
          </div>
        </section>

        {/* CITE THIS ENTRY */}
        <section className="w-full py-8 px-4 md:px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1rem] md:text-[1.125rem] font-black text-panda-dark uppercase tracking-wide mb-3">
              Cite this entry
            </h2>
            <blockquote className="bg-white border-l-4 border-panda-green rounded-r-2xl p-4 md:p-5 text-[0.8125rem] md:text-[0.875rem] text-panda-dark font-medium">
              Source: Panda Patches Glossary — &ldquo;{entry.term}.&rdquo;
              <br />
              {url}
            </blockquote>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
