import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import { convertWordPressUrl } from "@/lib/convertWordPressUrls";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";
import RelatedLinks from "@/components/seo/RelatedLinks";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import CitedPageBridge from "@/components/blog/CitedPageBridge";
import { CITED_PAGE_BRIDGES } from "@/lib/citedPageBridges";

function slugifyBlock(value: any): string {
  const text = (value?.children || []).map((c: any) => c.text || '').join('');
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Flatten portable-text blocks to plain text. */
function blocksToText(content: any[]): string {
  if (!content) return '';
  return content
    .flatMap((block: any) => block.children?.map((c: any) => c.text || '') || [])
    .join(' ');
}

function getReadingTime(content: any[]): number {
  if (!content) return 3;
  return Math.max(1, Math.round(blocksToText(content).split(/\s+/).length / 200));
}

export default function BlogPostLayout({ post, slug }: { post: any; slug?: string }) {
  const readingTime = getReadingTime(post.content);
  const dateSource = post.publishedAt || post._createdAt;
  const publishDate = dateSource
    ? new Date(dateSource).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const updatedSource = post._updatedAt;
  const updatedDate = updatedSource
    ? new Date(updatedSource).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  // Only show "Updated" if it's a different day than published
  const showUpdated = updatedDate && publishDate && updatedDate !== publishDate;

  // Commercial bridge (CL9F69 Workstream A): if this slug has a bridge, split the
  // body and inject the bridge after the first substantial section (the first h2
  // that sits at least ~15% into the body, so it never crowds the intro). Splitting
  // only at an h2 boundary means we never break a list or table mid-block. The
  // bridge lives here, not in the Sanity content, so it can't dilute the copy that
  // earns the citations and editors can't accidentally delete it.
  const content: any[] = post.content || [];
  const bridge = slug ? CITED_PAGE_BRIDGES[slug] : undefined;
  let bodyHead: any[] = content;
  let bodyTail: any[] = [];
  if (bridge && content.length > 6) {
    const minIdx = Math.max(3, Math.ceil(content.length * 0.15));
    let splitIdx = content.findIndex((b, i) => i >= minIdx && b?.style === "h2");
    if (splitIdx === -1) splitIdx = Math.ceil(content.length * 0.4);
    bodyHead = content.slice(0, splitIdx);
    bodyTail = content.slice(splitIdx);
  }

  const bodyComponents = {
    block: {
      // H1 converted to H2 for SEO (only one H1 per page - the post title)
      h1: ({children, value}: any) => <h2 id={slugifyBlock(value)} className="text-4xl font-black text-panda-dark mt-12 mb-6">{children}</h2>,

      // H2 in Body (Like "Conclusion")
      h2: ({children, value}: any) => <h2 id={slugifyBlock(value)} className="text-3xl font-bold text-panda-dark mt-12 mb-6">{children}</h2>,

      // H3 in Body
      h3: ({children, value}: any) => <h3 id={slugifyBlock(value)} className="text-2xl font-bold text-panda-dark mt-10 mb-4">{children}</h3>,

      // Standard Paragraph
      normal: ({children}: any) => <p className="text-[1.125rem] leading-[1.8] text-gray-700 mb-6 font-normal">{children}</p>,

      // Blockquote
      blockquote: ({children}: any) => <blockquote className="border-l-4 border-panda-yellow pl-6 py-2 my-8 italic text-xl text-gray-600 bg-gray-50 rounded-r-lg">{children}</blockquote>,
    },
    marks: {
      // Links - Auto-convert WordPress URLs to Next.js URLs
      link: ({value, children}: any) => {
        const originalHref = value?.href || '';
        const convertedHref = convertWordPressUrl(originalHref);

        // Check if it's an external link (keeps Instagram, social media, etc.)
        const isExternal = convertedHref.startsWith('http');
        const target = isExternal ? '_blank' : undefined;
        const rel = isExternal ? 'noopener noreferrer' : undefined;

        // Use Next.js Link for internal links, regular <a> for external
        if (isExternal) {
          return (
            <a href={convertedHref} target={target} rel={rel} className="text-blue-600 underline hover:text-blue-800 font-medium">
              {children}
            </a>
          );
        } else {
          return (
            <Link href={convertedHref} className="text-blue-600 underline hover:text-blue-800 font-medium">
              {children}
            </Link>
          );
        }
      }
    },
    list: {
      // Bullet Lists
      bullet: ({children}: any) => <ul className="list-disc pl-6 mb-8 space-y-2 text-[1.125rem] text-gray-700">{children}</ul>,
      number: ({children}: any) => <ol className="list-decimal pl-6 mb-8 space-y-2 text-[1.125rem] text-gray-700">{children}</ol>,
    },
    types: {
      image: ({value}: {value: any}) => {
        if (!value?.asset) return null;
        return (
          <figure className="my-10">
            <div className="relative w-full rounded-[16px] overflow-hidden">
              <Image
                src={urlFor(value).width(800).format('webp').quality(80).url()}
                alt={value.alt || ''}
                width={800}
                height={500}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {value.caption && (
              <figcaption className="text-center text-sm text-gray-400 mt-3 italic">{value.caption}</figcaption>
            )}
          </figure>
        );
      },
      tableBlock: ({value}: {value: any}) => {
        if (!value?.rows?.length) return null;
        return (
          <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full border-collapse text-[0.9375rem]">
              {value.headers?.length > 0 && (
                <thead>
                  <tr>
                    {value.headers.map((h: string, i: number) => (
                      <th key={i} className="bg-panda-dark text-white px-4 py-3 text-left font-bold text-[0.875rem] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {value.rows.map((row: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.cells?.map((cell: string, j: number) => (
                      <td key={j} className="px-4 py-3 border-b border-gray-100 text-gray-700 align-top">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {value.caption && (
              <p className="text-center text-sm text-gray-400 py-2 italic">{value.caption}</p>
            )}
          </div>
        );
      },
      productionFloorCallout: ({value}: {value: any}) => {
        if (!value?.body) return null;
        const heading = value.heading || 'From our production floor';
        return (
          <aside className="my-10 rounded-xl border-l-4 border-panda-green bg-[#F9FAF5] px-6 py-5 md:px-8 md:py-6">
            <p className="text-xs font-bold uppercase tracking-widest text-panda-green mb-2">{heading}</p>
            <p className="text-[1rem] leading-[1.75] text-gray-700 m-0">{value.body}</p>
          </aside>
        );
      },
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <article className="max-w-[50rem] mx-auto pt-24 pb-12 px-6">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-[0.8125rem] text-gray-500 flex-wrap">
            <li><Link href="/" className="hover:text-panda-dark transition-colors">Home</Link></li>
            <li className="select-none">/</li>
            <li><Link href="/blogs" className="hover:text-panda-dark transition-colors">Blog</Link></li>
            <li className="select-none">/</li>
            <li className="text-panda-dark font-medium truncate max-w-[240px]" aria-current="page">{post.title}</li>
          </ol>
        </nav>

        <h1 className="text-[2.625rem] md:text-[3.25rem] font-black text-panda-dark mb-6 leading-[1.2] tracking-tight [text-wrap:balance]">
          {post.title}
        </h1>

        {/* Publish + Updated Dates */}
        {publishDate && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.875rem] text-gray-500 mb-10">
            <span>
              Published <time dateTime={dateSource} className="font-medium text-gray-700">{publishDate}</time>
            </span>
            {showUpdated && (
              <span>
                · Updated <time dateTime={updatedSource} className="font-medium text-gray-700">{updatedDate}</time>
              </span>
            )}
            <span>· {readingTime} min read</span>
          </div>
        )}

        {/* Featured Image */}
        {post.image && (
          <div className="relative w-full h-[400px] md:h-[500px] mb-16 rounded-[20px] overflow-hidden shadow-sm border border-gray-100">
            <Image
              src={urlFor(post.image).width(800).format('webp').quality(75).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Speakable excerpt — rendered BEFORE byline so AI extractors pick up the actual
            lede as the page summary, not the author tag. Referenced by Speakable schema cssSelector. */}
        {post.excerpt && (
          <p className="speakable-summary text-[1.125rem] leading-[1.8] text-gray-600 font-medium mb-10 border-l-4 border-panda-yellow pl-5 italic">
            {post.excerpt}
          </p>
        )}

        {/* Author Byline — wrapped in <aside> so semantic parsers skip it when extracting
            the page summary. Renders after the lede in DOM order. */}
        <aside className="flex items-center gap-3 mb-10 pb-8 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-panda-dark flex items-center justify-center flex-shrink-0 overflow-hidden">
            {post.authorPhoto ? (
              <Image
                src={urlFor(post.authorPhoto).width(80).height(80).format('webp').quality(85).url()}
                alt="Imran Raza"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-white font-black text-sm">IR</span>
            )}
          </div>
          <div>
            <a
              href="https://www.linkedin.com/in/imran-raza-ladhani/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.9375rem] font-bold text-panda-dark hover:underline"
            >
              Imran Raza
            </a>
            <p className="text-[0.8125rem] text-gray-500">
              Founder & CEO · 13 years in patch manufacturing
            </p>
            <p className="text-[0.75rem] text-gray-400 mt-0.5">
              Reviewed by Imran Raza{publishDate ? ` · ${publishDate}` : ''}
            </p>
          </div>
        </aside>

        {/* Content Body - Custom Styling */}
        <div className="text-gray-800">
          <PortableText value={bodyHead} components={bodyComponents} />
          {bridge && bodyTail.length > 0 && (
            <CitedPageBridge config={bridge} fromPage={`/${slug}`} />
          )}
          {bodyTail.length > 0 && <PortableText value={bodyTail} components={bodyComponents} />}
        </div>

        {/* Author Bio Card (bottom) */}
        <div className="mt-16 pt-10 border-t border-gray-100 cv-auto">
          <div className="bg-gray-50 rounded-2xl p-8 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-panda-dark flex items-center justify-center flex-shrink-0 overflow-hidden">
              {post.authorPhoto ? (
                <Image
                  src={urlFor(post.authorPhoto).width(128).height(128).format('webp').quality(85).url()}
                  alt="Imran Raza - Founder of Panda Patches"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-white font-black text-2xl">IR</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Written by</p>
              <a
                href="https://www.linkedin.com/in/imran-raza-ladhani/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[1.25rem] font-black text-panda-dark hover:underline block mb-1"
              >
                Imran Raza
              </a>
              <p className="text-[0.875rem] text-gray-500 font-medium mb-3">Founder & CEO, Panda Patches</p>
              <p className="text-[0.9375rem] text-gray-600 leading-[1.8]">
                Imran brings 13 years of hands-on expertise in embroidered patches and textile manufacturing.
                As the founder of Panda Patches, he oversees quality control, production standards, and customer satisfaction
                for thousands of custom patch orders each year. He founded the company to make premium custom patches
                accessible with a low 5-piece minimum and a fast turnaround.
              </p>
            </div>
          </div>
        </div>

      </article>

      {/* Visible FAQ — every post with faqItems already emits FAQPage JSON-LD
          (src/app/[slug]/page.tsx); Google requires that markup to reflect
          content actually shown on the page, so this renders the same
          question/answer pairs 1:1 (audit 2026-07-12, CLAUDE_3.MD). */}
      {post.faqItems?.length > 0 && (
        <div className="cv-auto">
          <CategoryFAQ title="Frequently Asked Questions" faqs={post.faqItems} />
        </div>
      )}

      {/* Related Internal Links for SEO */}
      <div className="cv-auto">
        <RelatedLinks
          // Score against the BODY, not just title + excerpt (CLB408_1 §5).
          // findRelevantLinks counts keyword hits, so feeding it two short
          // strings meant a 2,000-word PVC guide scored the same as its title
          // and frequently surfaced unrelated cards. The body is the signal
          // that decides which product pages these ranking guides link to.
          content={post.title + " " + (post.excerpt || "") + " " + blocksToText(content)}
          title="Related Pages You Might Like"
          maxLinks={4}
        />
      </div>

      <div className="cv-auto">
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
