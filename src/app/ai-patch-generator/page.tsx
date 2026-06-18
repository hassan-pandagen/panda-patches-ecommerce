import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PatchGeneratorClient from "@/components/ai-patch/PatchGeneratorClient";
import { buildPageMetadata } from "@/lib/seo";
import { generateSchemaScript, generateBreadcrumbSchema, generateFAQSchema, generateWebApplicationSchema } from "@/lib/schemas";

/**
 * WEBSIT_4.MD G7 — SEO landing wrapper for /ai-patch-generator.
 *
 * Shipped with robots: noindex while the route is on the mock provider.
 * Flip to index/follow in the same commit that swaps to AI_GEN_PROVIDER=fal
 * so Google never crawls a "MOCK GENERATION" image. The rest of the page
 * (H1, copy, FAQ schema) stays as-is so the moment it is publishable, it
 * is fully built for ranking.
 */

const CANONICAL = "https://www.pandapatches.com/ai-patch-generator";

const HOW_IT_WORKS = [
  {
    title: "Describe your patch",
    body: "Type the subject, vibe, and colors. The more specific you are, the better the first preview.",
  },
  {
    title: "Pick a style",
    body: "Embroidered, chenille, PVC, or woven. Choose the shape, border, and color budget that match how you want the real patch to feel.",
  },
  {
    title: "Refine",
    body: "Generate again with a tweaked prompt, or hit Refine to edit the same image. No limits while you experiment.",
  },
  {
    title: "Get a quote",
    body: "Happy with the concept? Send it to our design team. We refine it into a production mockup, then make the real patch from 5 pieces up.",
  },
];

const FAQS = [
  {
    question: "Is the AI patch generator free?",
    answer:
      "Yes. Generating patch concepts on /ai-patch-generator is free for everyone. There is no charge until you place an order for real patches, and even then there are no setup fees and no design fees.",
  },
  {
    question: "What does the AI image actually become?",
    answer:
      "The AI image is a concept preview to help you communicate what you want. Our human designers take the concept, refine it for embroidery, fix any details that would not stitch cleanly, and send you a production mockup. Nothing is manufactured until you approve the mockup.",
  },
  {
    question: "Can I get the un-watermarked image?",
    answer:
      "When you send a generated concept to our team using the Get Free Quote button, the clean image is attached to your quote automatically. The public preview on this page is watermarked to protect the design while it is still a concept.",
  },
  {
    question: "How many patches do I have to order?",
    answer:
      "The minimum order at Panda Patches is 5 pieces. The AI generator is meant to help you explore designs whether you order 5 patches or 5,000. There are no setup fees, no digitizing fees, and no design fees.",
  },
  {
    question: "Will my patch look exactly like the AI image?",
    answer:
      "Close, not identical. The AI image is a digital concept; the final embroidered, chenille, PVC, or woven patch is made of real thread, yarn, or rubber. Our designers adjust colors, refine details that thread cannot reproduce literally, and send you a digital mockup of how the actual patch will look before production.",
  },
  {
    question: "Can the AI generate trademarked logos or copyrighted characters?",
    answer:
      "No. Our generator blocks well-known brands, sports league marks, and copyrighted characters. We make your original designs, not copies of someone else's. If you have the rights to a specific brand or character, contact our team directly and we can review the licensing.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Free AI Patch Generator | Design Custom Patches Online",
  description:
    "Describe a patch in plain English and our AI sketches an instant concept preview. Embroidered, chenille, PVC, and woven styles. Free, no signup, refine until you love it.",
  url: CANONICAL,
  ogType: "website",
  ogTitle: "Free AI Patch Generator. Sketch a custom patch in seconds.",
  ogDescription:
    "Type your patch idea, pick a style, see a concept in seconds. Refine until you love it, then quote a real patch from 5 pieces.",
  robots: { index: true, follow: true },
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "AI Patch Generator", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(FAQS);

const webAppSchema = generateWebApplicationSchema();

export default function AiPatchGeneratorPage() {
  return (
    <main className="min-h-screen bg-[#F9FAF5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(webAppSchema)} />

      <Navbar />

      {/* Hero — short, flows straight into the composer card */}
      <section className="w-full pt-10 md:pt-14 pb-6 md:pb-8">
        <div className="container mx-auto px-6 max-w-[820px] text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[2px] text-panda-green bg-panda-green/10 px-3 py-1.5 rounded-full mb-4">
            ✨ Panda AI: Dream it. Patch it.
          </span>
          <h1 className="text-[34px] md:text-[52px] font-black text-panda-dark leading-[1.02] tracking-tight mb-3">
            Free AI Patch Generator
          </h1>
          <p className="text-[15px] md:text-[17px] text-gray-500 leading-[1.6] max-w-[560px] mx-auto">
            Describe a patch, pick a style, see it in seconds. Refine until you love it, then order the real thing from 5 pieces.
          </p>
        </div>
      </section>

      {/* Generator — white composer card pops on the page's tinted background */}
      <section className="w-full pb-14 md:pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <PatchGeneratorClient />
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-12 md:py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark text-center mb-8">
            How it works
          </h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <li
                key={step.title}
                className="bg-[#F9FAF5] border border-gray-200 rounded-[16px] p-5"
              >
                <span className="inline-flex w-8 h-8 items-center justify-center bg-panda-dark text-panda-yellow font-black rounded-full mb-3">
                  {i + 1}
                </span>
                <h3 className="text-[15px] font-black text-panda-dark mb-1.5">
                  {step.title}
                </h3>
                <p className="text-[13px] text-gray-600 leading-[1.6]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-12 md:py-16 bg-[#F9FAF5] border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-[820px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.question}
                className="group bg-white border border-gray-200 rounded-[14px] overflow-hidden"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-5 py-4 text-[14px] font-bold text-panda-dark">
                  {f.question}
                  <span className="text-panda-green font-black group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-[13px] text-gray-600 leading-[1.7]">
                  {f.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-12 md:py-16 bg-panda-dark text-white">
        <div className="container mx-auto px-6 max-w-[640px] text-center">
          <h2 className="text-[26px] md:text-[36px] font-black text-panda-yellow leading-[1.1] mb-3">
            Want a real patch from your design?
          </h2>
          <p className="text-[14px] md:text-[16px] text-gray-300 mb-6 leading-[1.6]">
            From 5 pieces. Free digital mockup in 12 to 24 hours. Free worldwide shipping.
          </p>
          <Link
            href="/contact?utm_source=ai-patch&utm_medium=landing-cta"
            className="inline-flex items-center gap-2 bg-panda-yellow text-panda-dark font-black text-[14px] uppercase tracking-wider px-6 py-3 rounded-full hover:scale-[1.03] transition-transform"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
