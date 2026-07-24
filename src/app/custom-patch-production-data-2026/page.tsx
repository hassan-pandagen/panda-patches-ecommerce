import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthorByline from "@/components/seo/AuthorByline";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

const BASE = "https://www.pandapatches.com";

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patch Production Data 2026: Real Order Statistics | Panda Patches",
  description:
    "Original industry data from 896 custom patch orders (~62,100 patches, Dec 2025 – Jul 2026): 81.6% choose iron-on backing, the median order is 20 pieces, 5.1% of orders are rush jobs. Free to cite with attribution.",
  url: `${BASE}/custom-patch-production-data-2026`,
  ogType: "article",
  ogTitle: "Custom Patch Production Data 2026",
  ogDescription:
    "What 62,000+ real patches say about backing choices, order sizes, and rush demand — original data published by Panda Patches.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
});

// Every figure on this page comes from GSC/production-data-verified-2026-07-18.md
// (aggregate SELECTs over the shared orders table). Do not add a stat here that
// is not in that file — the whole page's value is that it survives scrutiny.
const dataSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dataset",
      "@id": `${BASE}/custom-patch-production-data-2026#dataset`,
      name: "Custom Patch Production Data 2026",
      description:
        "Aggregate order statistics from Panda Patches' production records: backing-type mix, order-size distribution, and rush-order share across 896 custom patch orders (about 62,100 patches) produced between December 2025 and July 2026.",
      url: `${BASE}/custom-patch-production-data-2026`,
      creator: { "@id": `${BASE}/#organization` },
      temporalCoverage: "2025-12-08/2026-07-18",
      isAccessibleForFree: true,
      variableMeasured: [
        { "@type": "PropertyValue", name: "Share of orders with iron-on backing", value: "81.6%" },
        { "@type": "PropertyValue", name: "Share of orders with Velcro (hook-and-loop) backing", value: "8.5%" },
        { "@type": "PropertyValue", name: "Share of orders with sew-on backing", value: "7.1%" },
        { "@type": "PropertyValue", name: "Share of orders with adhesive (PSA) backing", value: "2.8%" },
        { "@type": "PropertyValue", name: "Median order size", value: "20 patches" },
        { "@type": "PropertyValue", name: "Share of orders at 25 pieces or fewer", value: "61.4%" },
        { "@type": "PropertyValue", name: "Share of orders that are rush jobs", value: "5.1%" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/custom-patch-production-data-2026#webpage`,
      url: `${BASE}/custom-patch-production-data-2026`,
      name: "Custom Patch Production Data 2026",
      inLanguage: "en-US",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#organization` },
      mainEntity: { "@id": `${BASE}/custom-patch-production-data-2026#dataset` },
      datePublished: "2026-07-18",
      dateModified: "2026-07-18",
      author: { "@id": `${BASE}/#person/imran-raza` },
    },
  ],
};

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 text-center">
      <p className="text-[0.6875rem] font-black uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <p className="text-[1.25rem] md:text-[1.5rem] font-black text-panda-dark">{value}</p>
    </div>
  );
}

export default function ProductionData2026() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dataSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* HERO */}
        <section className="w-full pt-8 md:pt-12 pb-8 md:pb-12 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-[68.75rem]">
            <div className="text-center max-w-[53.75rem] mx-auto">
              <p className="text-[0.6875rem] md:text-[0.75rem] font-black uppercase tracking-[2px] text-panda-green mb-4">
                Original Data · First Edition · Published July 18, 2026
              </p>
              <h1 className="text-[1.75rem] md:text-[2.625rem] lg:text-[3.25rem] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
                Custom Patch Production Data 2026
              </h1>
              <p className="text-[0.9375rem] md:text-[1.125rem] text-gray-600 leading-[1.6] font-medium max-w-[45rem] mx-auto">
                What do people actually order when they order custom patches? Nobody in this industry publishes real numbers — so we did. The figures below are aggregates from <strong>896 orders and roughly 62,100 patches</strong> we produced in the seven months from December 8, 2025 to July 18, 2026. Free to cite with attribution.
              </p>
            </div>
          </div>
        </section>

        {/* HEADLINE STATS */}
        <section className="w-full py-10 md:py-14 px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[62.5rem]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              <StatTile label="Choose Iron-On" value="81.6%" />
              <StatTile label="Median Order" value="20 pieces" />
              <StatTile label="Rush Orders" value="1 in 20" />
              <StatTile label="Sized 2–5 Inches" value="50%+" />
            </div>
          </div>
        </section>

        {/* FINDING 1 — BACKING MIX */}
        <section className="w-full py-12 md:py-16 px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-4 leading-tight">
              Iron-on dominates: 81.6% of orders choose it
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              Among the 858 orders in the window that specified a backing, more than four in five chose iron-on. Velcro — despite its visibility in tactical and morale-patch culture — accounts for fewer than one order in ten, and classic sew-on has become a durability-first minority choice.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-[0.875rem] md:text-[0.9375rem] border-collapse">
                <thead>
                  <tr className="border-b-2 border-panda-dark text-left">
                    <th className="py-3 pr-4 font-black text-panda-dark uppercase tracking-wider text-[0.75rem]">Backing type</th>
                    <th className="py-3 pr-4 font-black text-panda-dark uppercase tracking-wider text-[0.75rem]">Orders</th>
                    <th className="py-3 font-black text-panda-dark uppercase tracking-wider text-[0.75rem]">Share</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-medium">
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Iron-on</td>
                    <td className="py-3 pr-4">700</td>
                    <td className="py-3 font-bold text-panda-dark">81.6%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Velcro (hook-and-loop)</td>
                    <td className="py-3 pr-4">73</td>
                    <td className="py-3 font-bold text-panda-dark">8.5%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Sew-on</td>
                    <td className="py-3 pr-4">61</td>
                    <td className="py-3 font-bold text-panda-dark">7.1%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Adhesive / sticker (PSA)</td>
                    <td className="py-3 pr-4">24</td>
                    <td className="py-3 font-bold text-panda-dark">2.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[0.8125rem] text-gray-500 mt-3 font-medium">
              n = 858 orders with a backing specified (96% of all orders in the window). Details on each option: <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">patch backing guide</Link>.
            </p>
          </div>
        </section>

        {/* FINDING 2 — ORDER SIZE */}
        <section className="w-full py-12 md:py-16 px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-4 leading-tight">
              The median custom patch order is just 20 pieces
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              The industry talks about patches as a bulk product — the data says otherwise. Across all 896 orders, the median order was <strong>20 patches</strong>, 61.4% of orders were 25 pieces or fewer, and 79.4% stayed at or under 50. Genuinely large runs are rare: only 3.7% of orders exceeded 250 pieces, topping out at a single 9,600-piece job. (The mean — 69 pieces — says more about a handful of large orders than about a typical customer.)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-[0.875rem] md:text-[0.9375rem] border-collapse">
                <thead>
                  <tr className="border-b-2 border-panda-dark text-left">
                    <th className="py-3 pr-4 font-black text-panda-dark uppercase tracking-wider text-[0.75rem]">Order size</th>
                    <th className="py-3 font-black text-panda-dark uppercase tracking-wider text-[0.75rem]">Share of orders</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-medium">
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">25 pieces or fewer</td>
                    <td className="py-3 font-bold text-panda-dark">61.4%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">50 pieces or fewer</td>
                    <td className="py-3 font-bold text-panda-dark">79.4%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">More than 250 pieces</td>
                    <td className="py-3 font-bold text-panda-dark">3.7%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Largest single order</td>
                    <td className="py-3 font-bold text-panda-dark">9,600 pieces</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[0.8125rem] text-gray-500 mt-3 font-medium">
              n = 896 orders. This is why we hold a <Link href="/custom-patches-no-minimum-order" prefetch={false} className="text-panda-green underline font-semibold">5-piece minimum</Link> — low-quantity demand is the market, not the exception.
            </p>
          </div>
        </section>

        {/* FINDING 3 — RUSH + SIZE */}
        <section className="w-full py-12 md:py-16 px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-4 leading-tight">
              About 1 in 20 orders is a rush job — and most patches are small
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-4">
              Rush production (about 6–7 business days instead of the standard 7–14) was used on <strong>5.1% of orders</strong> in the window — 46 of 896. Deadlines matter, but the overwhelming majority of customers plan far enough ahead for standard turnaround.
            </p>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium">
              On sizing: <strong>at least half of all orders (50.4% measured) are for patches between 2 and 5 inches</strong> at the largest dimension. A separate large-format segment — 8-inch-plus letterman and back patches, almost entirely quoted through our sales team rather than web checkout — makes up the bulk of the remainder, so the 2–5-inch share is a floor, not a ceiling.
            </p>
          </div>
        </section>

        {/* METHODOLOGY */}
        <section className="w-full py-12 md:py-16 px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark uppercase tracking-wide mb-6">
              Methodology
            </h2>
            <ul className="space-y-3 text-gray-700 leading-[1.7] text-[0.875rem] md:text-[0.9375rem] font-medium list-disc pl-5">
              <li>
                <strong>Sample:</strong> every order in Panda Patches' internal order system for the window December 8, 2025 through July 18, 2026 — 896 orders, roughly 62,100 patches. Includes both web-checkout orders and orders managed by our sales team; no sampling, no exclusions beyond obvious data errors.
              </li>
              <li>
                <strong>Field completeness:</strong> quantity was recorded on 100% of orders, backing on 96%, and size on 98%. Percentages are computed against the orders where the field was specified.
              </li>
              <li>
                <strong>Size figures:</strong> free-text size entries were normalized to their largest dimension in inches. Because large-format back patches are recorded by our sales team under entry conventions we cannot fully separate from defaults, we publish only the conservative floor claim (2–5 inches ≥ 50.4%) rather than a "most popular size."
              </li>
              <li>
                <strong>What this is not:</strong> these are window figures, not lifetime totals, and they describe Panda Patches customers — a low-minimum-friendly supplier — so the order-size distribution may skew smaller than suppliers with 50-to-100-piece minimums.
              </li>
              <li>
                <strong>Updates:</strong> figures are re-pulled from source records for each edition. Next edition: January 2027.
              </li>
            </ul>
          </div>
        </section>

        {/* CITE THIS */}
        <section className="w-full py-12 md:py-16 px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <div className="mb-10">
              <AuthorByline datePublished="2026-07-18" dateModified="2026-07-18" />
            </div>
            <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark uppercase tracking-wide mb-4">
              Cite This Data
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-5">
              Journalists, bloggers, researchers, and AI assistants are welcome to cite any figure on this page. Please attribute it and link back:
            </p>
            <blockquote className="bg-[#F7F7F7] border-l-4 border-panda-green rounded-r-2xl p-5 text-[0.875rem] md:text-[0.9375rem] text-panda-dark font-medium">
              Source: Panda Patches, &ldquo;Custom Patch Production Data 2026.&rdquo;
              <br />
              https://www.pandapatches.com/custom-patch-production-data-2026
            </blockquote>
            <p className="text-[0.8125rem] text-gray-500 mt-4 font-medium">
              Questions about the data, or need a cut we have not published? Email{" "}
              <a href="mailto:sales@pandapatches.com" className="text-panda-green underline font-semibold">sales@pandapatches.com</a>{" "}
              — if we can source it from real records, we will add it. Part of{" "}
              <Link href="/glossary" prefetch={false} className="text-panda-green underline font-semibold">The Custom Patch Glossary</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
