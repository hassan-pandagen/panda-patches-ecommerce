import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import BulkHero from "@/components/bulk/BulkHero";
import TrustStrip from "@/components/products/TrustStrip";
import Craftsmanship from "@/components/home/Craftsmanship";
import ReviewsSection from "@/components/home/ReviewsSection";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import CTASection from "@/components/home/CTASection";
import MakerNote from "@/components/seo/MakerNote";
import { Award, Shield, Gift, Clock } from "lucide-react";
import { generateSchemaScript, generateFAQSchema, generateBreadcrumbSchema, generateRushServiceSchema } from "@/lib/schemas";
import { buildPageMetadata } from "@/lib/seo";
import { MOCKUP_SLA, STANDARD_DELIVERY } from "@/lib/factConstants";
import { addBusinessDays, formatShortDate } from "@/lib/businessDays";

// Rush landing page (RUSH-C_1.MD, July 2026 rewrite). COMPLIANCE: rush is stated
// in business days only; "24 hours" refers ONLY to the digital mockup; "from 5
// pieces", never "no minimum"; no next-day/weekend/date promises; no "Made in USA".
//
// SCOPING NOTE: the "in hand in as fast as 5 business days" claim on this page is
// a page-specific rewrite of this page's own copy, per the brief's own scope
// ("rewrite the page ... and any shared components [it uses]"). It intentionally
// does NOT change the sitewide RUSH_DELIVERY constant ("about 6-7 business days")
// consumed by the offers page / product calculator / wholesale page's rush
// checkout options — that's a live checkout promise on a different, revenue-
// critical flow, so changing it sitewide needs its own explicit confirmation
// rather than being silently pulled in as a side effect of this page rewrite.

const CANONICAL = "https://www.pandapatches.com/rush-custom-patches";

export const revalidate = 86400;

const rushFAQs = [
  {
    question: "How fast can you make custom patches?",
    answer: `Rush orders arrive in hand in as fast as 5 business days, depending on quantity and patch type — compared to our standard ${STANDARD_DELIVERY} turnaround. Your free digital mockup arrives in ${MOCKUP_SLA}, and after you order rush we confirm your exact in-hand date by email within 2-6 hours. If the date doesn't work, we remove the rush upgrade and refund the rush fee.`,
  },
  {
    question: "Can you rush large orders?",
    answer: "Yes. We own our production facility, so rush capacity scales. For Wise's Nasdaq Times Square activation we delivered 9,600 woven patches across 16 designs in two shipments on May 4 and May 7 — both on the contractual dates, with every design approved before production. For event deadlines, uniform rollouts, and line-of-duty memorial patches, tell us your date and we plan production around it.",
  },
  {
    question: "What is the fastest turnaround for custom patches?",
    answer: `The fastest realistic turnaround is patches in hand in about 5 business days: mockup in ${MOCKUP_SLA}, your approval, rush production, and tracked express shipping. Smaller quantities and simpler patch types hit the fast end of the range; large or complex orders take longer. We state turnaround in business days and confirm your exact date by email before production starts — we don't make next-day promises we can't keep.`,
  },
  {
    question: "Do rush orders cost more?",
    answer: "Rush adds a flat fee based on quantity — for example +$50 at 50 pieces, +$75 at 100, +$150 at 500, and +$200 at 1,000 on fixed-price packs (the calculator shows exact rush pricing for custom sizes at checkout). That's a flat fee, not a percentage of your order — a 1,000-piece rush costs the same +$200 whether your patches total $2,000 or $20,000, unlike rush surcharges elsewhere that scale with order value. Everything else stays the same: free digital mockup, no setup or digitizing fees, and free worldwide shipping.",
  },
  {
    question: "Which patch types can be rushed?",
    answer: "Embroidered, PVC, chenille, and woven patches all qualify for rush production, from 5 pieces (woven from 10). Backing options — iron-on, sew-on, Velcro, sticker — don't affect the rush timeline. Patch type affects speed because of the production steps involved: simpler, single-technique designs in smaller quantities move fastest, while multi-step techniques like chenille and 3D puff embroidery — or very large quantities — need more production passes. That's why we confirm your exact date within 2-6 hours instead of quoting one number for every order.",
  },
  {
    question: "What do I need to start a rush order?",
    answer: `Three things: your artwork (AI, EPS, SVG, PDF, PNG, or JPG — or just describe your idea), your quantity, and the date you need patches in hand. Submit them through the quote form; your mockup arrives in ${MOCKUP_SLA} and production starts the moment you approve.`,
  },
  {
    question: "Can I get custom patches in 5 days?",
    answer: "Yes — for many quantities and patch types we can put patches in your hands in 5 business days. Submit the quote form with your deadline and we'll confirm within 2-6 hours whether your exact order qualifies, before you pay anything for rush.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Rush Custom Patches — In Hand in as Fast as 5 Business Days",
  description:
    "Rush custom patches in hand in as fast as 5 business days, depending on quantity and patch type. From 5 pieces, free 12-24h mockup, no setup fees. Exact delivery date confirmed within 2-6 hours.",
  url: CANONICAL,
  ogTitle: "Rush Custom Patches — In Hand in as Fast as 5 Business Days",
  ogDescription:
    "Need patches fast? In hand in as fast as 5 business days, mockup in 12-24 hours, from 5 pieces. Free worldwide shipping, no setup fees.",
  robots: { index: true, follow: true },
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.pandapatches.com" },
  { name: "Custom Patches", url: "https://www.pandapatches.com/custom-patches" },
  { name: "Rush Custom Patches", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(rushFAQs);
const serviceSchema = generateRushServiceSchema();

// dateModified: bump whenever RECENT_RUSH_ORDERS entries change (RECENT_1.MD's
// freshness-signal ask). WebPage is the correct schema.org type for this
// property — not bolted onto the Service schema above.
const RUSH_ORDERS_LAST_UPDATED = "2026-07-07";
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": CANONICAL,
  "name": "Rush Custom Patches",
  "dateModified": RUSH_ORDERS_LAST_UPDATED,
};

// Recent Rush Orders — real, dated CRM-verified deliveries (RECENT_1.MD, July
// 2026). Privacy rule: no customer/business names, emails, phones, or dollar
// amounts. Order IDs, patch type, quantity, dates, and destination city/state
// only.
//
// <!-- To add a new entry: pick a DELIVERED rush order from
// portal.pandapatches.com, verify created date and delivered date in the
// order's activity log, count business days, add row, remove the oldest row.
// Keep 4-6 rows. Never publish names or amounts. -->
const RECENT_RUSH_ORDERS = [
  { id: "PP-11017", desc: "200 PVC patches", dest: "Balch Springs, TX", ordered: "Jun 24, 2026", inHand: "Jul 3, 2026", turnaround: "7 business days" },
  { id: "PP-10788", desc: "4 oversized 3D puff patches (up to 12\")", dest: "Gardiner, MT", ordered: "May 12, 2026", inHand: "Shipped May 14 via FedEx", turnaround: "Produced in 2 days" },
  { id: "PP-10241", desc: "100 patches (embroidered + leather)", dest: "Las Vegas, NV", ordered: "Jan 28, 2026", inHand: "Feb 4, 2026", turnaround: "5 business days" },
  { id: "PP-10231", desc: "12 embroidered patches", dest: "Woodmere, NY", ordered: "Jan 22, 2026", inHand: "Jan 28, 2026", turnaround: "~5 business days" },
  { id: "PP-10091", desc: "200 embroidered patches", dest: "Miami, FL", ordered: "Dec 18, 2025", inHand: "Dec 26, 2025", turnaround: "5 business days (over Christmas)" },
];

// Rush-specific trust stat replacing "2-Week Turnaround" (RUSH-C_1.MD section 3).
const rushTrustStats = [
  { icon: Award, label: "4,000+", sub: "Bulk Orders" },
  { icon: Shield, label: "ASI", sub: "Verified" },
  { icon: Gift, label: "Free Sample", sub: "500+ Orders" },
  { icon: Clock, label: "5-Day In-Hand", sub: "earliest, rush orders" },
];

// "4 Things Every Order Gets" override — replaces the contradictory "Quick
// Turnaround" card with a rush-specific one; keeps the other 3 as-is (RUSH-C_1.MD
// section 6).
const rushPromises = [
  { icon: "/assets/icon-money.svg", title: "Money Back Guarantee", desc: "Your satisfaction owns the patch; our promise ensures it's truly yours!" },
  { icon: "/assets/icon-check.svg", title: "Low Minimums", desc: "Craft your distinct style starting from just 5 patches. Low minimums, maximum creativity!" },
  { icon: "/assets/icon-mail.svg", title: "Rush When You Need It", desc: "Deadline coming up? Rush orders arrive in hand in as fast as 5 business days, depending on quantity and patch type." },
  { icon: "/assets/icon-check.svg", title: "Free Sample First", desc: "For orders 500+, get a free physical sample. Verify quality, color, and sizing before full production." },
];

export default function RushCustomPatchesPage() {
  const earliestInHand = formatShortDate(addBusinessDays(new Date(), 5));

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(serviceSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(webPageSchema)} />

      <Navbar />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Custom Patches", href: "/custom-patches" },
        ]}
        currentPage="Rush Custom Patches"
      />

      {/* HERO — quote form above the fold; pageUrl tags the lead as rush-sourced */}
      <BulkHero
        simpleForm
        customHeading="Rush Custom Patches"
        customSubheading="In hand in as fast as 5 business days — exact date confirmed within 2-6 hours"
        customDescription="Order from 5 pieces, free 12-24 hour mockup, no setup fees. Embroidered, PVC, chenille, and woven patches all qualify. We confirm your exact in-hand delivery date within 2-6 hours — if we can't hit your deadline, we remove the rush fee."
        trustStats={rushTrustStats}
        formNote={`Order today → mockup by tomorrow → in hand as early as ${earliestInHand}.`}
        heroFormHeadline="Need Patches by a Date?"
        heroFormSubhead="Get your guaranteed in-hand date in 2-6 hours + free 12-24h mockup"
        heroFormCtaText="Get My Delivery Date + Free Mockup"
        heroFormCtaMicrocopy="We reply with your exact in-hand date within 2-6 hours. If we can't make your deadline, there's no rush fee."
        showDeadlineField
        showZipField
      />

      <TrustStrip />

      {/* ANSWER-FIRST TL;DR — liftable by AI engines */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <p className="text-[15px] md:text-[17px] text-gray-700 leading-[1.8] max-w-[840px]">
            <strong>Panda Patches delivers rush custom patches in hand in as fast as 5 business days</strong>,
            depending on quantity and patch type. Order from just 5 pieces with a free 12-24 hour mockup and
            no setup fees. <Link href="/custom-patches/embroidered" className="text-panda-green font-semibold underline">Embroidered</Link>,{" "}
            <Link href="/custom-patches/pvc" className="text-panda-green font-semibold underline">PVC</Link>,{" "}
            <Link href="/custom-patches/chenille" className="text-panda-green font-semibold underline">chenille</Link>, and{" "}
            <Link href="/custom-patches/woven" className="text-panda-green font-semibold underline">woven</Link> patches all
            qualify. Because we own our production facility, rush capacity scales: we delivered{" "}
            <Link href="/case-studies/wise-nasdaq-times-square-activation" className="text-panda-green font-semibold underline">
              9,600 patches for Wise&apos;s Nasdaq Times Square activation
            </Link>{" "}
            in two shipments, both on the contractual dates. We confirm your exact in-hand delivery date by
            email within 2-6 hours of ordering — if we can&apos;t hit your deadline, we remove the rush fee.
          </p>
        </div>
      </section>

      {/* HOW RUSH WORKS */}
      <section className="w-full py-8 md:py-12 bg-[#F9FAF5]">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
            How Rush Orders Work
          </h2>
          <ol className="space-y-3 text-[15px] md:text-[16px] text-gray-700 leading-[1.7] list-decimal pl-5">
            <li><strong>Send your design and deadline.</strong> Upload artwork (AI, EPS, SVG, PDF, PNG, JPG) or describe your idea in the form above — and tell us the date you need patches in hand.</li>
            <li><strong>We confirm your in-hand date within 2-6 hours.</strong> You get your exact delivery date by email before any rush fee is charged. Doesn&apos;t work? We remove the rush fee.</li>
            <li><strong>Approve your mockup in {MOCKUP_SLA}.</strong> Unlimited free revisions — production never starts without your sign-off.</li>
            <li><strong>Patches in hand in as fast as 5 business days.</strong> Timing depends on quantity and patch type; free worldwide shipping with full tracking either way.</li>
          </ol>
        </div>
      </section>

      {/* RECENT RUSH ORDERS — real, dated CRM-verified proof (RECENT_1.MD).
          First-party evidence like this is exactly what AI Overviews/assistants
          cite over generic competitor copy — semantic <table>, not an image. */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
          <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-2">
            Recent Rush Orders
          </h2>
          <p className="text-[14px] text-gray-500 mb-1">Real orders from our production log — updated monthly.</p>
          <p className="text-[12px] text-gray-400 mb-6">Last updated: July 2026</p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="text-left px-4 py-3 font-bold text-[11px] uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px] uppercase tracking-wider">What</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px] uppercase tracking-wider">Ordered</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px] uppercase tracking-wider">In Hand</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px] uppercase tracking-wider">Turnaround</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_RUSH_ORDERS.map((o) => (
                  <tr key={o.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono text-[13px] text-gray-500">{o.id}</td>
                    <td className="px-4 py-3 font-semibold text-panda-dark">{o.desc} → {o.dest}</td>
                    <td className="px-4 py-3 text-gray-600">{o.ordered}</td>
                    <td className="px-4 py-3 text-gray-600">{o.inHand}</td>
                    <td className="px-4 py-3 font-bold text-green-700">{o.turnaround}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-gray-400 mt-3">Turnaround counted in business days from order to delivery confirmation.</p>
        </div>
      </section>

      {/* WHO USES RUSH */}
      <section className="w-full py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
          <h2 className="text-[24px] md:text-[32px] font-black text-center text-panda-dark mb-8">
            Built for Real Deadlines
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Events & activations", body: "Trade shows, launches, and brand activations — like Wise's 9,600-patch Nasdaq event, delivered on the contractual dates." },
              { title: "Memorial patches", body: "Line-of-duty memorial patches for fire and police departments are treated as our highest priority." },
              { title: "Team deadlines", body: "Tournament weekends, season openers, and jersey deadlines for sports teams and schools." },
              { title: "Uniform rollouts", body: "New-hire batches and company rebrands that can't wait for standard production." },
            ].map((u) => (
              <div key={u.title} className="bg-[#F9FAF5] border border-gray-100 rounded-2xl p-6">
                <h3 className="text-[16px] font-black text-panda-dark mb-2">{u.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.6]">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Craftsmanship />
      <ReviewsSection />
      <Promises bgColor="bg-white" items={rushPromises} />
      <ProcessSection />

      <CategoryFAQ title="Rush Custom Patches FAQ" faqs={rushFAQs} />

      <MakerNote intro="Rush orders run through the same facility with priority scheduling — which is how we can commit to an exact in-hand date within hours, not days." />
      <CTASection />
      <Footer />
    </main>
  );
}
