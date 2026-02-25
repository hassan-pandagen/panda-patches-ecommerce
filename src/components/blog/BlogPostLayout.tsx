import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import { convertWordPressUrl } from "@/lib/convertWordPressUrls";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";
import RelatedLinks from "@/components/seo/RelatedLinks";

export default function BlogPostLayout({ post }: { post: any }) {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <article className="max-w-[800px] mx-auto py-24 px-6">
        
        {/* Main Title (H1) */}
        <h1 className="text-[42px] md:text-[52px] font-black text-panda-dark mb-10 leading-[1.2] tracking-tight">
          {post.title}
        </h1>

        {/* Featured Image */}
        {post.image && (
          <div className="relative w-full h-[400px] md:h-[500px] mb-16 rounded-[20px] overflow-hidden shadow-sm border border-gray-100">
            <Image src={urlFor(post.image).url()} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Author Byline (before content) */}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-panda-dark flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">IR</span>
          </div>
          <div>
            <a
              href="https://www.linkedin.com/in/imran-raza-ladhani/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-bold text-panda-dark hover:underline"
            >
              Imran Raza
            </a>
            <p className="text-[13px] text-gray-500">Founder & CEO · 13 years in patch manufacturing</p>
          </div>
        </div>

        {/* Content Body - Custom Styling */}
        <div className="text-gray-800">
          <PortableText
            value={post.content}
            components={{
              block: {
                // H1 converted to H2 for SEO (only one H1 per page - the post title)
                h1: ({children}) => <h2 className="text-4xl font-black text-panda-dark mt-12 mb-6">{children}</h2>,

                // H2 in Body (Like "Conclusion")
                h2: ({children}) => <h2 className="text-3xl font-bold text-panda-dark mt-12 mb-6">{children}</h2>,

                // H3 in Body
                h3: ({children}) => <h3 className="text-2xl font-bold text-panda-dark mt-10 mb-4">{children}</h3>,
                
                // Standard Paragraph
                normal: ({children}) => <p className="text-[18px] leading-[1.8] text-gray-700 mb-6 font-normal">{children}</p>,
                
                // Blockquote
                blockquote: ({children}) => <blockquote className="border-l-4 border-panda-yellow pl-6 py-2 my-8 italic text-xl text-gray-600 bg-gray-50 rounded-r-lg">{children}</blockquote>,
              },
              marks: {
                // Links - Auto-convert WordPress URLs to Next.js URLs
                link: ({value, children}) => {
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
                bullet: ({children}) => <ul className="list-disc pl-6 mb-8 space-y-2 text-[18px] text-gray-700">{children}</ul>,
                number: ({children}) => <ol className="list-decimal pl-6 mb-8 space-y-2 text-[18px] text-gray-700">{children}</ol>,
              }
            }}
          />
        </div>

        {/* Author Bio Card (bottom) */}
        <div className="mt-16 pt-10 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-8 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-panda-dark flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-2xl">IR</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Written by</p>
              <a
                href="https://www.linkedin.com/in/imran-raza-ladhani/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[20px] font-black text-panda-dark hover:underline block mb-1"
              >
                Imran Raza
              </a>
              <p className="text-[14px] text-gray-500 font-medium mb-3">Founder & CEO, Panda Patches</p>
              <p className="text-[15px] text-gray-600 leading-[1.8]">
                Imran brings 13 years of hands-on expertise in embroidered patches and textile manufacturing.
                As the founder of Panda Patches, he oversees quality control, production standards, and customer satisfaction
                for thousands of custom patch orders each year. He founded the company in 2016 to make premium custom patches
                accessible with no minimum orders and a fast turnaround.
              </p>
            </div>
          </div>
        </div>

      </article>

      {/* Related Internal Links for SEO */}
      <RelatedLinks
        content={post.title + " " + (post.excerpt || "")}
        title="Related Pages You Might Like"
        maxLinks={4}
      />

      <CTASection />
      <Footer />
    </main>
  );
}
