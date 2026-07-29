import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { generateSchemaScript } from "@/lib/schemas";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Panda Patches Rewards — Automatic Loyalty Tiers",
    description:
      "Panda Patches Rewards is automatic: your lifetime paid spend unlocks Bronze ($1,000), Silver ($5,000), or Gold ($10,000) — each with a member discount of 5-10% on standard pricing. No signup; your code arrives by email.",
    url: `${SITE_URL}/rewards`,
    ogDescription:
      "Automatic loyalty tiers at $1k / $5k / $10k lifetime spend, with 5-10% member discounts on standard pricing. No signup.",
  });
}

const TIERS = [
  {
    name: "Bronze",
    threshold: "$1,000",
    code: "5% code — single-use, valid 90 days",
    benefits: ["Bronze badge on your account", "A one-time 5% discount code"],
    ring: "border-[#CD7F32]",
  },
  {
    name: "Silver",
    threshold: "$5,000",
    code: "5% code — reusable, no expiry",
    benefits: ["Silver badge", "Standing 5% member discount", "Free Velcro backing", "Priority mockup"],
    ring: "border-gray-400",
  },
  {
    name: "Gold",
    threshold: "$10,000",
    code: "10% code — reusable, no expiry",
    benefits: ["Gold badge", "Standing 10% member discount", "Quarterly rush upgrade", "Dedicated contact"],
    ring: "border-panda-yellow",
  },
];

// FAQ — the visible text below and this schema are kept 1:1 (Task 2.5).
const FAQ = [
  {
    q: "How do I join Panda Patches Rewards?",
    a: "There is no signup. The program is automatic — your lifetime paid spend is tracked on your account, and you are awarded a tier the moment you cross a threshold.",
  },
  {
    q: "How is my tier calculated?",
    a: "By lifetime paid value — the total of your Square-confirmed paid orders. Unpaid, pending, cancelled, and refunded orders are excluded. Your tier only goes up; it is never automatically downgraded.",
  },
  {
    q: "Where do I get my discount code?",
    a: "When you cross a tier threshold, your personal code is emailed to your account email. Your current tier and code are also visible in your account.",
  },
  {
    q: "Can I combine my code with a custom quote or a sale?",
    a: "No. Loyalty discounts apply to standard calculator pricing only. They cannot be combined with custom or negotiated quotes, fixed-price offer packs, or other promotions.",
  },
  {
    q: "Is my code tied to my email?",
    a: "Yes. Codes are personal and email-bound — they only work on an order placed with the account email they were issued to. Bronze codes are single-use and expire 90 days after issue; Silver and Gold codes are reusable.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />

      <div className="max-w-[62.5rem] mx-auto px-6 py-16 md:py-20">
        <h1 className="text-[2rem] md:text-[2.75rem] font-black text-panda-dark leading-tight tracking-tight mb-4">
          Panda Patches Rewards
        </h1>
        <p className="text-[1.0625rem] text-gray-700 leading-[1.8] mb-12 max-w-[46rem]">
          Panda Patches Rewards is our automatic loyalty program. Spend more over time and you unlock three tiers &mdash;
          Bronze, Silver, and Gold &mdash; each with a member discount. There is no signup: your lifetime paid spend is
          tracked on your account, and your personal code arrives by email.
        </p>

        {/* Tier table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {TIERS.map((t) => (
            <div key={t.name} className={`rounded-2xl border-2 ${t.ring} bg-white p-6 shadow-sm`}>
              <p className="text-[1.5rem] font-black text-panda-dark">{t.name}</p>
              <p className="text-[0.9375rem] font-bold text-panda-green mt-1 mb-1">{t.threshold} lifetime spend</p>
              <p className="text-[0.8125rem] text-gray-600 font-medium mb-4">{t.code}</p>
              <ul className="space-y-2">
                {t.benefits.map((b) => (
                  <li key={b} className="text-[0.9375rem] text-gray-700 leading-[1.6] flex gap-2">
                    <span className="text-panda-green font-black">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* How it works */}
        <section className="mb-14">
          <h2 className="text-[1.625rem] font-black text-panda-dark mb-4">How it works</h2>
          <ol className="space-y-3 text-[1rem] text-gray-700 leading-[1.8] list-decimal pl-6">
            <li>Place orders as usual. Your lifetime paid spend is tracked automatically on your account.</li>
            <li>The moment your paid spend crosses a threshold, your tier is awarded and your personal discount code is emailed to you.</li>
            <li>Your tier badge and code are visible in your account. Apply the code at payment to take your member discount off standard pricing.</li>
          </ol>
        </section>

        {/* Fine print — visible (Task 2.4) */}
        <section className="mb-14 rounded-2xl bg-panda-light border border-gray-100 p-6">
          <h2 className="text-[1.25rem] font-black text-panda-dark mb-3">The details</h2>
          <ul className="space-y-2 text-[0.9375rem] text-gray-600 leading-[1.7] list-disc pl-6">
            <li>Discounts apply to <strong>standard calculator pricing only</strong>. They are not combinable with custom or negotiated quotes, fixed-price offer packs, or other promotions.</li>
            <li>Codes are <strong>personal and email-bound</strong> &mdash; they only work on an order placed with the account email they were issued to.</li>
            <li>The <strong>Bronze</strong> code is single-use and expires 90 days after it is issued. <strong>Silver</strong> and <strong>Gold</strong> codes are reusable with no expiry.</li>
            <li>Silver adds free Velcro backing and priority mockup; Gold adds a quarterly rush upgrade and a dedicated contact.</li>
            <li>Lifetime spend counts <strong>paid orders only</strong> (Square-confirmed). Unpaid, pending, cancelled, and refunded orders are excluded. Your tier only goes up.</li>
          </ul>
        </section>

        {/* FAQ — 1:1 with faqSchema */}
        <section className="mb-4">
          <h2 className="text-[1.625rem] font-black text-panda-dark mb-5">Frequently asked questions</h2>
          <div className="space-y-6">
            {FAQ.map((f) => (
              <div key={f.q}>
                <h3 className="text-[1.0625rem] font-bold text-panda-dark mb-1">{f.q}</h3>
                <p className="text-[1rem] text-gray-700 leading-[1.8]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-[0.9375rem] text-gray-600 mt-10">
          Logged in?{" "}
          <Link href="/account" prefetch={false} className="text-panda-green font-semibold underline">
            See your tier and code in your account
          </Link>
          .
        </p>
      </div>

      <CTASection />
      <Footer />
    </main>
  );
}
