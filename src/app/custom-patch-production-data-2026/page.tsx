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
    "Original industry data from 963 custom patch orders (68,785 patches, Dec 2025 – Aug 2026): 81.3% choose iron-on backing, the median order is 25 pieces, 4.9% of orders are rush jobs. Free to cite with attribution.",
  url: `${BASE}/custom-patch-production-data-2026`,
  ogType: "article",
  ogTitle: "Custom Patch Production Data 2026",
  ogDescription:
    "What 68,000+ real patches say about backing choices, order sizes, and rush demand — original data published by Panda Patches.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
});

// Every figure on this page comes from GSC/production-data-verified-2026-08-06.md
// (aggregate SELECTs over the shared orders table). Do not add a stat here that
// is not in that file — the whole page's value is that it survives scrutiny.
//
// 2nd edition, Aug 2026. Base is PURE-PATCH per CEO ruling: non-patch line items
// (keychains, challenge coins, sample boxes, DST service) are excluded from both
// totals and percentages — 12 orders / 2,956 pieces removed, leaving 963 orders
// and 68,785 patches. A gross figure would make "patches delivered" literally
// false, which is the one thing this page cannot afford.
//
// The methodology was validated by re-running every query on the 1st edition's
// window: it reproduces the published Jul-18 figures (median 20, ≤25 at 61.3%,
// rush 5.1%, iron-on 81.6%). Do that again before the next edition.
const dataSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dataset",
      "@id": `${BASE}/custom-patch-production-data-2026#dataset`,
      name: "Custom Patch Production Data 2026",
      description:
        "Aggregate order statistics from Panda Patches' production records: backing-type mix, order-size distribution, rush-order share, and size distribution across 963 custom patch orders (68,785 patches) delivered through pandapatches.com between December 2025 and August 2026. Counts finished patches only; non-patch items are excluded from both totals and percentages.",
      url: `${BASE}/custom-patch-production-data-2026`,
      creator: { "@id": `${BASE}/#organization` },
      temporalCoverage: "2025-12-08/2026-08-05",
      isAccessibleForFree: true,
      variableMeasured: [
        { "@type": "PropertyValue", name: "Share of orders with iron-on backing", value: "81.3%" },
        { "@type": "PropertyValue", name: "Share of orders with Velcro (hook-and-loop) backing", value: "8.7%" },
        { "@type": "PropertyValue", name: "Share of orders with sew-on backing", value: "7.1%" },
        { "@type": "PropertyValue", name: "Share of orders with adhesive (PSA) backing", value: "2.9%" },
        { "@type": "PropertyValue", name: "Median order size", value: "25 patches" },
        { "@type": "PropertyValue", name: "Share of orders at 25 pieces or fewer", value: "60.6%" },
        { "@type": "PropertyValue", name: "Share of orders that are rush jobs", value: "4.9%" },
        { "@type": "PropertyValue", name: "Share of orders sized 2 to 5 inches at the largest dimension", value: "53.7%" },
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
      dateModified: "2026-08-06",
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
                Original Data · Second Edition · Updated August 6, 2026
              </p>
              <h1 className="text-[1.75rem] md:text-[2.625rem] lg:text-[3.25rem] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
                Custom Patch Production Data 2026
              </h1>
              <p className="text-[0.9375rem] md:text-[1.125rem] text-gray-600 leading-[1.6] font-medium max-w-[45rem] mx-auto mb-6">
                What do people actually order when they order custom patches? Nobody in this industry publishes real numbers — so we did. The figures below are aggregates from <strong>963 orders and 68,785 patches</strong>. Free to cite with attribution.
              </p>
              <div className="max-w-[45rem] mx-auto bg-[#F7F7F7] border border-gray-200 rounded-2xl p-5 text-left">
                <p className="text-[0.875rem] md:text-[0.9375rem] text-panda-dark font-black mb-2">
                  Orders delivered through pandapatches.com, Dec 2025 &ndash; Aug 2026.
                </p>
                <p className="text-[0.8125rem] md:text-[0.875rem] text-gray-600 leading-[1.7] font-medium mb-2">
                  Our factory also produces patches for other patch brands and resellers &mdash; the figures on this page count only orders from our own store.
                </p>
                <p className="text-[0.8125rem] md:text-[0.875rem] text-gray-600 leading-[1.7] font-medium">
                  Counts finished patches only; excludes non-patch items (challenge coins, pins, keychains) from both totals and percentages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HEADLINE STATS */}
        <section className="w-full py-10 md:py-14 px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[62.5rem]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              <StatTile label="Choose Iron-On" value="81.3%" />
              <StatTile label="Median Order" value="25 pieces" />
              <StatTile label="Rush Orders" value="1 in 20" />
              <StatTile label="Sized 2–5 Inches" value="53.7%" />
            </div>
          </div>
        </section>

        {/* FINDING 1 — BACKING MIX */}
        <section className="w-full py-12 md:py-16 px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-4 leading-tight">
              Iron-on dominates: 81.3% of orders choose it
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              Among the 931 orders in the window that specified a backing, more than four in five chose iron-on. Velcro — despite its visibility in tactical and morale-patch culture — accounts for fewer than one order in ten, and classic sew-on has become a durability-first minority choice.
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
                    <td className="py-3 pr-4">757</td>
                    <td className="py-3 font-bold text-panda-dark">81.3%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Velcro (hook-and-loop)</td>
                    <td className="py-3 pr-4">81</td>
                    <td className="py-3 font-bold text-panda-dark">8.7%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Sew-on</td>
                    <td className="py-3 pr-4">66</td>
                    <td className="py-3 font-bold text-panda-dark">7.1%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Adhesive / sticker (PSA)</td>
                    <td className="py-3 pr-4">27</td>
                    <td className="py-3 font-bold text-panda-dark">2.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[0.8125rem] text-gray-500 mt-3 font-medium">
              n = 931 orders with a backing specified (97% of all orders in the window). Details on each option: <Link href="/custom-patches/backing-options" prefetch={false} className="text-panda-green underline font-semibold">patch backing guide</Link>.
            </p>
          </div>
        </section>

        {/* FINDING 2 — ORDER SIZE */}
        <section className="w-full py-12 md:py-16 px-6 bg-[#F7F7F7]">
          <div className="container mx-auto max-w-[51.25rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-4 leading-tight">
              The median custom patch order is just 25 pieces
            </h2>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-6">
              The industry talks about patches as a bulk product — the data says otherwise. Across all 963 orders, the median order was <strong>25 patches</strong>, 60.6% of orders were 25 pieces or fewer, and 78.2% stayed at or under 50. Genuinely large runs are rare: only 4.0% of orders exceeded 250 pieces, topping out at a single 9,600-piece job. (The mean — 71 pieces — says more about a handful of large orders than about a typical customer.) The median moved up from 20 in our first edition, the one headline figure that shifted between editions.
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
                    <td className="py-3 font-bold text-panda-dark">60.6%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">50 pieces or fewer</td>
                    <td className="py-3 font-bold text-panda-dark">78.2%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">More than 250 pieces</td>
                    <td className="py-3 font-bold text-panda-dark">4.0%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">Largest single order</td>
                    <td className="py-3 font-bold text-panda-dark">9,600 pieces</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[0.8125rem] text-gray-500 mt-3 font-medium">
              n = 963 orders. This is why we hold a <Link href="/custom-patches-no-minimum-order" prefetch={false} className="text-panda-green underline font-semibold">5-piece minimum</Link> — low-quantity demand is the market, not the exception.
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
              <Link href="/rush-custom-patches" className="text-panda-green underline">Rush production</Link> (as soon as 5 business days instead of the standard 7–14) was used on <strong>4.9% of orders</strong> in the window — 47 of 963. Deadlines matter, but the overwhelming majority of customers plan far enough ahead for standard turnaround.
            </p>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-4">
              On sizing: <strong>53.7% of orders were sized 2 to 5 inches</strong> at the largest listed dimension (as of August 2026). A real large-format segment accounts for most of the rest — 37.0% of sized orders list a dimension of 8 inches or more, overwhelmingly letterman and back patches quoted through our sales team rather than web checkout.
            </p>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium">
              Read 53.7% as a floor rather than a ceiling, for a specific reason: 320 of the 921 sized orders list more than one dimension (&ldquo;12 and 4&rdquo;, &ldquo;14 inches + 8 inches + 2 inches&rdquo;), and we attribute each order wholly to its largest one. An order containing both a 12-inch back patch and a 4-inch crest counts only in the 8-inch-plus bucket. Counting every order that includes at least one 2-to-5-inch dimension raises the share to roughly 60%.
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
                <strong>Sample:</strong> every order delivered through pandapatches.com for the window December 8, 2025 through August 5, 2026 — <strong>963 orders, 68,785 patches</strong>. Includes both web-checkout orders and orders managed by our sales team; no sampling. Our factory also produces patches for other patch brands and resellers, and those orders are not in this dataset.
              </li>
              <li>
                <strong>What counts as a patch:</strong> finished patches only. Non-patch line items — challenge coins, pins, keychains, sample boxes, and digitizing-only services — are excluded from both the totals and every percentage. That removed 12 orders and 2,956 pieces from the raw window, which is the difference between the 71,741 gross figure and the 68,785 we publish. We quote the patch-only number because a page titled &ldquo;patch production data&rdquo; should not count keychains.
              </li>
              <li>
                <strong>Field completeness:</strong> quantity was recorded on 100% of orders, backing on 97%, and a parseable size on 96%. Percentages are computed against the orders where the field was specified.
              </li>
              <li>
                <strong>Size figures:</strong> free-text size entries were normalized to their largest listed dimension in inches. Our first edition withheld a measured share because we could not rule out that the 12-inch entries were a sales-team default; we have since checked, and the 217 twelve-inch orders span 44 distinct descriptions rather than one repeated value, so the large-format segment is real. The remaining limitation is multi-dimension orders, described above. We still do not publish a &ldquo;most popular size,&rdquo; because attributing multi-size orders to one bucket makes a modal claim unsafe.
              </li>
              <li>
                <strong>Rush definition, updated 6 September 2026:</strong> the 4.9% above counts orders inside this edition&rsquo;s window under the flag available when it was published. An all-time re-run using the CRM&rsquo;s full rush marker (urgent flag OR a customer deadline date) gives 9.8% — 117 of 1,200 orders. Both are correct for what they measure; the third edition will restate the window figure under the wider definition so the two are directly comparable. <strong>Comparability between editions:</strong> before publishing this edition we re-ran every query against the first edition&rsquo;s window and reproduced its published figures (median 20, 61.3% at 25 or fewer, 5.1% rush, 81.6% iron-on). Differences between editions are real movement in the data, not changes in how we count.
              </li>
              <li>
                <strong>What this is not:</strong> these are window figures, not lifetime totals, and they describe Panda Patches customers — a low-minimum-friendly supplier — so the order-size distribution may skew smaller than suppliers with 50-to-100-piece minimums.
              </li>
              <li>
                <strong>Updates:</strong> figures are re-pulled from source records for each edition. This is the second edition, published August 6, 2026. Next edition: January 2027.
              </li>
            </ul>
          </div>
        </section>

        {/* CITE THIS */}
        <section className="w-full py-12 md:py-16 px-6 bg-white">
          <div className="container mx-auto max-w-[51.25rem]">
            <div className="mb-10">
              <AuthorByline datePublished="2026-07-18" dateModified="2026-08-06" />
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
