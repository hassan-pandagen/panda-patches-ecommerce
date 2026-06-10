import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, ArrowRight, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | Panda Patches",
  description:
    "The page you're looking for doesn't exist. Browse our patch types, get a free quote, or chat with our team.",
  robots: { index: false, follow: true },
};

const PATCH_TYPES = [
  { name: "Embroidered Patches", href: "/custom-patches/embroidered" },
  { name: "PVC Patches", href: "/custom-patches/pvc" },
  { name: "Woven Patches", href: "/custom-patches/woven" },
  { name: "Chenille Patches", href: "/custom-patches/chenille" },
  { name: "Leather Patches", href: "/custom-patches/leather" },
  { name: "Iron On Patches", href: "/custom-iron-on-patches" },
];

const POPULAR_PAGES = [
  { name: "Custom Patches (All Types)", href: "/custom-patches" },
  { name: "Bulk Custom Patches", href: "/bulk-custom-patches" },
  { name: "Pricing", href: "/ai-info/pricing" },
  { name: "Customer Reviews", href: "/reviews" },
  { name: "Embroidery Digitizing", href: "/embroidery-digitizing" },
  { name: "Sample Box", href: "/sample-box" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F9FAF5] flex flex-col">
      <Navbar />

      <section className="flex-1 w-full pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="container mx-auto px-6 max-w-[920px]">

          <div className="text-center mb-12 md:mb-16">
            <p className="text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-3">
              404 . Page Not Found
            </p>
            <h1 className="text-[40px] md:text-[56px] font-black text-panda-dark leading-[1.05] tracking-tight mb-4">
              We could not find that page.
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-600 max-w-[600px] mx-auto leading-[1.6]">
              The link might be broken, or the page may have moved. Try a search,
              jump to a popular page, or chat with our team for a free quote.
            </p>
          </div>

          {/* Search box. Submits to Google site search so users always get a result. */}
          <form
            action="https://www.google.com/search"
            method="get"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-12 md:mb-16"
          >
            <input type="hidden" name="sitesearch" value="pandapatches.com" />
            <div className="flex items-center bg-white border-2 border-gray-200 focus-within:border-panda-green rounded-full px-5 py-2 max-w-[560px] mx-auto shadow-sm">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="search"
                name="q"
                placeholder="Search for custom patches, pricing, or a blog post"
                aria-label="Search the site"
                className="flex-1 bg-transparent border-0 outline-none px-3 py-2.5 text-[14px] text-panda-dark placeholder:text-gray-400"
                required
              />
              <button
                type="submit"
                className="bg-panda-dark text-panda-yellow font-black text-[13px] uppercase tracking-wider px-4 py-2 rounded-full hover:scale-[1.03] transition-transform flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          <div className="grid md:grid-cols-2 gap-6 mb-12 md:mb-16">

            <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-7">
              <h2 className="text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-4">
                Patch Types
              </h2>
              <ul className="space-y-2">
                {PATCH_TYPES.map((t) => (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      className="flex items-center justify-between gap-2 py-2 text-[14px] font-bold text-panda-dark hover:text-panda-green transition-colors group"
                    >
                      <span>{t.name}</span>
                      <ArrowRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-7">
              <h2 className="text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-4">
                Popular Pages
              </h2>
              <ul className="space-y-2">
                {POPULAR_PAGES.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="flex items-center justify-between gap-2 py-2 text-[14px] font-bold text-panda-dark hover:text-panda-green transition-colors group"
                    >
                      <span>{p.name}</span>
                      <ArrowRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="bg-panda-dark text-white rounded-[24px] p-8 md:p-10 text-center">
            <h2 className="text-[24px] md:text-[32px] font-black text-panda-yellow leading-[1.1] mb-3">
              Need a quote? We move fast.
            </h2>
            <p className="text-[14px] md:text-[16px] text-gray-300 mb-6 max-w-[520px] mx-auto leading-[1.6]">
              Free digital mockup in 12 to 24 hours. Low minimums from 5 pieces.
              Free worldwide shipping. No setup fees.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-panda-yellow text-panda-dark font-black text-[14px] uppercase tracking-wider px-6 py-3 rounded-full hover:scale-[1.03] transition-transform"
              >
                Get a Free Quote
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/custom-patches"
                className="inline-flex items-center gap-2 bg-white/10 text-white font-black text-[14px] uppercase tracking-wider px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                <MessageCircle size={16} />
                Browse Patches
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
