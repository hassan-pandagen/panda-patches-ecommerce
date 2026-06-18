import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { buildPageMetadata } from "@/lib/seo";
import {
  generateSchemaScript,
  generateBreadcrumbSchema,
} from "@/lib/schemas";
import { getPublishedCaseStudies } from "@/lib/caseStudies";

const BASE = "https://www.pandapatches.com";
const CANONICAL = `${BASE}/case-studies`;

export const metadata: Metadata = buildPageMetadata({
  title: "Case Studies: Custom Patches for Brands & Events | Panda Patches",
  description:
    "Real brands, real events, real patches. See how Panda Patches delivers custom patches at scale, on deadline, for brand activations, teams, and organizations.",
  url: CANONICAL,
  ogType: "website",
  robots: { index: true, follow: true },
});

export default function CaseStudiesPage() {
  const studies = getPublishedCaseStudies();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: BASE },
    { name: "Case Studies", url: CANONICAL },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Panda Patches Case Studies",
    description:
      "Custom patch projects for brands, events, teams, and organizations.",
    url: CANONICAL,
    hasPart: studies.map((s) => ({
      "@type": "Article",
      name: s.title,
      url: `${BASE}/case-studies/${s.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(collectionSchema)}
      />

      {/* Hero */}
      <section className="bg-panda-dark text-white pt-24 pb-16 px-6">
        <div className="max-w-[1000px] mx-auto">
          <nav className="text-[13px] text-gray-400 mb-6">
            <Link href="/" className="hover:text-panda-green">
              Home
            </Link>{" "}
            <span className="mx-1.5">/</span>
            <span className="text-gray-200">Case Studies</span>
          </nav>
          <h1 className="text-[34px] md:text-[48px] font-black leading-tight tracking-tight mb-5">
            Real brands. Real events. Real patches.
          </h1>
          <p className="text-[17px] md:text-[19px] text-gray-300 leading-[1.7] max-w-[680px]">
            From a Nasdaq listing in Times Square to teams and organizations
            across the country, here is how Panda Patches delivers custom
            patches at scale, on deadline, and exactly on brand.
          </p>
        </div>
      </section>

      {/* Case study grid */}
      <section className="max-w-[1000px] mx-auto px-6 py-16">
        {studies.length === 0 ? (
          <p className="text-gray-500 text-[16px]">
            Case studies are on the way. Check back soon.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {studies.map((s) => (
              <Link
                key={s.slug}
                href={`/case-studies/${s.slug}`}
                className="group block w-full md:w-[calc(50%-0.75rem)] max-w-[520px] border border-gray-200 rounded-2xl overflow-hidden hover:border-panda-green hover:shadow-lg transition-all"
              >
                {s.heroImage?.src && (
                  <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
                    <Image
                      src={s.heroImage.src}
                      alt={s.heroImage.alt}
                      fill
                      quality={70}
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-7">
                  {s.tags && s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-bold uppercase tracking-wide text-panda-green bg-panda-green/10 px-2.5 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[12px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                    {s.client} &middot; {s.date}
                  </p>
                  <h2 className="text-[22px] md:text-[24px] font-black text-panda-dark leading-tight mb-3 group-hover:text-panda-green transition-colors">
                    {s.cardTitle}
                  </h2>
                  <p className="text-[15px] text-gray-600 leading-[1.7] mb-5">
                    {s.summary}
                  </p>
                  <div className="flex items-end justify-between gap-4 pt-5 border-t border-gray-100">
                    <div className="flex gap-6">
                      {s.stats.slice(0, 2).map((st) => (
                        <div key={st.label}>
                          <div className="text-[20px] font-black text-panda-dark leading-none">
                            {st.value}
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium mt-1">
                            {st.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="text-[14px] font-black text-panda-green whitespace-nowrap group-hover:underline underline-offset-4">
                      Read case study &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-panda-light px-6 py-14">
        <div className="max-w-[760px] mx-auto text-center">
          <h2 className="text-[26px] md:text-[32px] font-black text-panda-dark mb-3">
            Planning an event or a brand drop?
          </h2>
          <p className="text-[16px] text-gray-600 leading-[1.7] mb-7 max-w-[560px] mx-auto">
            We make custom patches at any scale, matched to your brand, with a
            digital mockup in 12 to 24 hours and free worldwide shipping. Tell
            us the date and we will hit it.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/custom-patches"
              className="bg-panda-yellow text-panda-dark font-black text-[15px] px-7 py-3.5 rounded-full hover:bg-panda-green hover:text-white transition-all"
            >
              Start your patches
            </Link>
            <Link
              href="/contact"
              className="bg-white border border-gray-300 text-panda-dark font-black text-[15px] px-7 py-3.5 rounded-full hover:border-panda-green transition-all"
            >
              Talk to us about an event
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
