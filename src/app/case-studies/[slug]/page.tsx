import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { buildPageMetadata } from "@/lib/seo";
import {
  generateSchemaScript,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateFAQSchema,
} from "@/lib/schemas";
import {
  getCaseStudy,
  getPublishedCaseStudies,
  type CaseStudy,
} from "@/lib/caseStudies";

const BASE = "https://www.pandapatches.com";

export function generateStaticParams() {
  return getPublishedCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: "Case Study Not Found | Panda Patches" };

  return buildPageMetadata({
    title: cs.metaTitle,
    description: cs.metaDescription,
    url: `${BASE}/case-studies/${cs.slug}`,
    ogType: "article",
    image: cs.heroImage?.src
      ? { url: cs.heroImage.src, alt: cs.heroImage.alt }
      : undefined,
  });
}

function paragraphs(body: string): string[] {
  return body.split("\n\n").map((p) => p.trim()).filter(Boolean);
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs: CaseStudy | undefined = getCaseStudy(slug);
  if (!cs) notFound();

  const url = `${BASE}/case-studies/${cs.slug}`;
  const ogImage = cs.heroImage?.src || `${BASE}/assets/og-image.png`;
  const hasHero = Boolean(cs.heroImage?.src);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: BASE },
    { name: "Case Studies", url: `${BASE}/case-studies` },
    { name: cs.client, url },
  ]);

  const articleSchema = generateArticleSchema({
    title: cs.title,
    description: cs.metaDescription,
    datePublished: cs.isoDate,
    dateModified: cs.isoDate,
    image: ogImage,
    url,
  });

  const faqSchema =
    cs.faqs && cs.faqs.length > 0 ? generateFAQSchema(cs.faqs) : null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(articleSchema)}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(faqSchema)}
        />
      )}

      {/* Hero — split layout: text on the left, photo on the right (clear, no
          heavy overlay). Falls back to a centered dark hero when no image. */}
      <section className="bg-panda-dark text-white overflow-hidden">
        <div className={hasHero ? "lg:grid lg:grid-cols-2 lg:items-stretch" : ""}>
          {/* Text column */}
          <div
            className={
              hasHero
                ? "px-6 md:px-10 lg:pl-12 xl:pl-16 lg:pr-12 pt-24 pb-12 lg:py-20 lg:flex lg:flex-col lg:justify-center"
                : "max-w-[820px] mx-auto px-6 pt-24 pb-14"
            }
          >
            <div className={hasHero ? "max-w-[640px]" : ""}>
              <nav className="text-[13px] text-gray-400 mb-6">
                <Link href="/" className="hover:text-panda-yellow">
                  Home
                </Link>{" "}
                <span className="mx-1.5">/</span>{" "}
                <Link href="/case-studies" className="hover:text-panda-yellow">
                  Case Studies
                </Link>{" "}
                <span className="mx-1.5">/</span>{" "}
                <span className="text-gray-200">{cs.client}</span>
              </nav>

              {cs.tags && cs.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {cs.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-bold uppercase tracking-wide text-panda-yellow bg-panda-yellow/15 px-2.5 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-[13px] font-bold uppercase tracking-[1.5px] text-panda-yellow mb-3">
                {cs.clientUrl ? (
                  <a
                    href={cs.clientUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-2"
                  >
                    {cs.client}
                  </a>
                ) : (
                  cs.client
                )}{" "}
                &middot; {cs.clientDescriptor}
              </p>
              <h1 className="text-[30px] md:text-[42px] font-black leading-[1.1] tracking-tight mb-5">
                {cs.title}
              </h1>
              <p className="speakable-summary text-[16px] md:text-[18px] text-gray-300 leading-[1.7]">
                {cs.summary}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8 pt-7 border-t border-white/10 text-[14px]">
                {cs.event && (
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide font-bold mb-0.5">
                      Event
                    </div>
                    <div className="text-gray-100 font-semibold">{cs.event}</div>
                  </div>
                )}
                {cs.location && (
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide font-bold mb-0.5">
                      Location
                    </div>
                    <div className="text-gray-100 font-semibold">
                      {cs.location}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-gray-500 text-[11px] uppercase tracking-wide font-bold mb-0.5">
                    Date
                  </div>
                  <div className="text-gray-100 font-semibold">{cs.date}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[11px] uppercase tracking-wide font-bold mb-0.5">
                    Product
                  </div>
                  <div className="text-gray-100 font-semibold">
                    {cs.productHref ? (
                      <Link
                        href={cs.productHref}
                        className="underline decoration-1 underline-offset-4 hover:text-panda-yellow"
                      >
                        {cs.productType}
                      </Link>
                    ) : (
                      cs.productType
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image column */}
          {hasHero && cs.heroImage && (
            <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-full">
              <Image
                src={cs.heroImage.src}
                alt={cs.heroImage.alt}
                fill
                priority
                quality={80}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* soft blend into the text panel on desktop */}
              <div className="hidden lg:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-panda-dark to-transparent" />
              {cs.heroImage.credit && (
                <p className="absolute bottom-2 right-3 text-[10px] text-white/75 bg-panda-dark/45 px-1.5 py-0.5 rounded">
                  Photo: {cs.heroImage.credit}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats strip */}
      {cs.stats.length > 0 && (
        <section className="bg-panda-light px-6 py-10">
          <div className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {cs.stats.map((st) => (
              <div key={st.label}>
                <div className="text-[30px] md:text-[38px] font-black text-panda-dark leading-none">
                  {st.value}
                </div>
                <div className="text-[13px] text-gray-500 font-medium mt-1.5">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Body sections */}
      <article className="max-w-[760px] mx-auto px-6 py-14 space-y-12">
        {/* At a glance — self-contained facts AI answer engines lift verbatim */}
        {cs.keyFacts && cs.keyFacts.length > 0 && (
          <section className="border border-gray-200 rounded-2xl p-6 md:p-7 bg-gray-50">
            <h2 className="text-[13px] font-black uppercase tracking-[1.5px] text-panda-green mb-4">
              At a glance
            </h2>
            <ul className="space-y-2.5">
              {cs.keyFacts.map((f, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-[15px] text-gray-700 leading-[1.6]"
                >
                  <span className="text-panda-green font-black flex-shrink-0 mt-0.5">
                    &bull;
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {cs.sections.map((sec) => (
          <section key={sec.heading}>
            <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
            <h2 className="text-[24px] md:text-[30px] font-black text-panda-dark leading-tight mb-4">
              {sec.heading}
            </h2>
            {paragraphs(sec.body).map((p, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.85] text-gray-700 mb-4"
              >
                {p}
              </p>
            ))}
            {sec.image?.src && (
              <figure className="mt-6">
                <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 aspect-[16/10]">
                  <Image
                    src={sec.image.src}
                    alt={sec.image.alt}
                    fill
                    quality={78}
                    sizes="(max-width: 760px) 100vw, 760px"
                    className="object-cover"
                  />
                </div>
                {(sec.image.caption || sec.image.credit) && (
                  <figcaption className="text-[12px] text-gray-400 mt-2.5">
                    {sec.image.caption}
                    {sec.image.caption && sec.image.credit ? " " : ""}
                    {sec.image.credit ? `Photo: ${sec.image.credit}` : ""}
                  </figcaption>
                )}
              </figure>
            )}
          </section>
        ))}

        {/* Quote (optional) */}
        {cs.quote && (
          <blockquote className="border-l-4 border-panda-yellow bg-panda-light rounded-r-2xl px-7 py-6">
            <p className="text-[19px] md:text-[21px] font-semibold text-panda-dark leading-[1.6] mb-3">
              &ldquo;{cs.quote.text}&rdquo;
            </p>
            <footer className="text-[14px] text-gray-500">
              {cs.quote.author}
              {cs.quote.role ? `, ${cs.quote.role}` : ""}
            </footer>
          </blockquote>
        )}
      </article>

      {/* FAQ — rendered on-page and as FAQPage schema (AEO) */}
      {cs.faqs && cs.faqs.length > 0 && (
        <section className="max-w-[760px] mx-auto px-6 pb-16">
          <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
          <h2 className="text-[24px] md:text-[30px] font-black text-panda-dark mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-5">
            {cs.faqs.map((f, i) => (
              <div key={i} className="border-b border-gray-100 pb-5">
                <h3 className="text-[17px] font-bold text-panda-dark mb-2">
                  {f.question}
                </h3>
                <p className="text-[16px] text-gray-700 leading-[1.7]">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery (optional) */}
      {cs.gallery && cs.gallery.length > 0 && (
        <section className="max-w-[1000px] mx-auto px-6 pb-16">
          <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
          <h2 className="text-[24px] md:text-[30px] font-black text-panda-dark mb-6">
            From the activation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cs.gallery.map((img) => (
              <figure key={img.src}>
                <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 aspect-square">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    quality={75}
                    sizes="(max-width: 1000px) 100vw, 333px"
                    className="object-cover"
                  />
                </div>
                {img.credit && (
                  <figcaption className="text-[11px] text-gray-400 mt-1.5">
                    Photo: {img.credit}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Related internal links — distribute authority to key pages and guide readers deeper */}
      <section className="max-w-[760px] mx-auto px-6 pb-14">
        <div className="w-10 h-1 bg-panda-yellow rounded-full mb-4" />
        <h2 className="text-[20px] md:text-[24px] font-black text-panda-dark mb-5">
          Explore more
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/bulk-custom-patches", label: "Bulk custom patches" },
            { href: "/offers", label: "Patch packages & pricing" },
            { href: "/custom-patches", label: "All custom patches" },
            { href: "/case-studies", label: "More case studies" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center border border-gray-200 rounded-full px-4 py-2 text-[14px] font-bold text-panda-dark hover:border-panda-green hover:text-panda-green transition-all"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-panda-dark text-white px-6 py-16">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="text-[26px] md:text-[34px] font-black mb-3">
            Got an event or a brand drop coming up?
          </h2>
          <p className="text-[16px] text-gray-300 leading-[1.7] mb-8 max-w-[540px] mx-auto">
            We make custom patches at any scale, matched to your brand, with a
            digital mockup in 12 to 24 hours. Tell us your date and we will hit
            it.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/custom-patches"
              className="bg-panda-yellow text-panda-dark font-black text-[15px] px-8 py-3.5 rounded-full hover:bg-panda-green hover:text-white transition-all"
            >
              Start your patches
            </Link>
            <Link
              href="/case-studies"
              className="border border-white/30 text-white font-black text-[15px] px-8 py-3.5 rounded-full hover:border-panda-yellow hover:text-panda-yellow transition-all"
            >
              See more case studies
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
