import Link from "next/link";
import { CheckCircle2, XCircle, AlertCircle, Star, Award, Clock, Shield, MessageCircle, Phone, Package } from "lucide-react";

const CHECK = String.fromCharCode(10003); // ✓ — built at runtime so CSP doesn't trip

export interface ComparisonRow {
  category?: string;
  feature: string;
  panda: string;
  competitor: string;
  pandaWin?: boolean;
  competitorWin?: boolean;
  tie?: boolean;
}

export interface CustomerQuote {
  text: string;
  author: string;
  role?: string;
  company?: string;
  rating?: number;
}

export interface PricingExample {
  scenario: string;
  panda: string;
  competitor: string;
  pandaWin?: boolean;
}

export interface ComparisonPageProps {
  competitorName: string;
  competitorTagline?: string;
  heroHeadline: string;
  heroSubheadline: string;
  threePillars: Array<{
    icon: 'clock' | 'shield' | 'check' | 'star';
    title: string;
    body: string;
  }>;
  primaryQuote: CustomerQuote;
  comparisonRows: ComparisonRow[];
  pricingExamples: PricingExample[];
  whereCompetitorFits: string;
  secondaryQuote?: CustomerQuote;
  faqs: Array<{ question: string; answer: string }>;
}

const iconMap = {
  clock: Clock,
  shield: Shield,
  check: CheckCircle2,
  star: Star,
};

function CellResult({ value, win, lose }: { value: string; win?: boolean; lose?: boolean }) {
  const isYes = /^(yes|✓|true)$/i.test(value.trim());
  const isNo = /^(no|✗|false|none)$/i.test(value.trim());

  return (
    <div className={`flex items-start gap-2 ${win ? 'text-panda-green font-bold' : lose ? 'text-gray-500' : 'text-gray-800'}`}>
      {isYes && <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-panda-green" />}
      {isNo && <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400" />}
      <span className="leading-relaxed text-[14px] md:text-[15px]">{value}</span>
    </div>
  );
}

export default function ComparisonPage({
  competitorName,
  heroHeadline,
  heroSubheadline,
  threePillars,
  primaryQuote,
  comparisonRows,
  pricingExamples,
  whereCompetitorFits,
  secondaryQuote,
  faqs,
}: ComparisonPageProps) {
  // Group comparison rows by category
  const grouped: { [cat: string]: ComparisonRow[] } = {};
  const categoryOrder: string[] = [];
  comparisonRows.forEach((row) => {
    const cat = row.category || 'Features';
    if (!grouped[cat]) {
      grouped[cat] = [];
      categoryOrder.push(cat);
    }
    grouped[cat].push(row);
  });

  return (
    <>

      {/* 1. HERO — match BulkHero style */}
      <section className="w-full pt-8 md:pt-12 pb-8 md:pb-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <div className="text-center max-w-[820px] mx-auto">
            <p className="text-[11px] md:text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-4">
              Custom Patch Company Comparison · 2026
            </p>
            <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-black text-panda-dark leading-[1.1] tracking-tight mb-5">
              {heroHeadline}
            </h1>
            <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.6] font-medium mb-7 max-w-[640px] mx-auto">
              {heroSubheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link
                href="/contact"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#DFFF00] text-[#051C05] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap"
              >
                <MessageCircle size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                <span>Get 12-24h Mockup</span>
              </Link>
              <Link
                href="/offers"
                prefetch={false}
                className="flex items-center justify-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap"
              >
                <Package size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                <span>See Pricing</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP — match the homepage hero trust badges style */}
      <section className="bg-white py-5 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-[1100px]">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] md:text-[14px]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-panda-green" />
              <strong className="text-panda-dark">1,000,000+ patches delivered</strong>
            </div>
            <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-panda-green" />
              <strong className="text-panda-dark">Mockup in 12-24 hours</strong>
            </div>
            <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-panda-green" />
              <strong className="text-panda-dark">Money-back guarantee</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DISCLOSURE — subtle, transparent */}
      <section className="bg-[#FFFBEB] border-b border-amber-200 py-3 px-6">
        <div className="container mx-auto max-w-[900px]">
          <p className="text-[12px] text-amber-900 text-center leading-relaxed">
            <strong>Honest disclosure:</strong> This comparison is published by Panda Patches. {competitorName} information uses publicly available data from their website as of May 2026. Verify current pricing on their site.
          </p>
        </div>
      </section>

      {/* 4. THREE-PILLAR — match Promises section style */}
      <section className="w-full pb-8 md:pb-16 pt-10 md:pt-14 bg-[#F7F7F7]">
        <div className="container mx-auto px-6 flex flex-col items-center max-w-[1100px]">
          <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-black text-center text-panda-dark uppercase tracking-wide mb-3">
            Why switch from {competitorName}?
          </h2>
          <p className="text-center text-gray-500 text-[14px] md:text-[15px] font-medium mb-10 md:mb-14 max-w-[560px]">
            Three specific advantages buyers tell us drove their decision.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
            {threePillars.map((pillar, i) => {
              const Icon = iconMap[pillar.icon];
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-lg transition-shadow">
                  <div className="w-[60px] h-[60px] bg-panda-dark rounded-full flex items-center justify-center mb-5 shadow-md">
                    <Icon className="w-7 h-7 text-panda-yellow" />
                  </div>
                  <h3 className="text-[17px] md:text-[19px] font-extrabold text-panda-dark mb-3 leading-tight">{pillar.title}</h3>
                  <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.6] font-medium">{pillar.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PRIMARY CUSTOMER QUOTE — Panda dark theme */}
      <section className="bg-panda-dark py-14 md:py-20 px-6">
        <div className="container mx-auto max-w-[820px] text-center">
          <blockquote className="text-[20px] md:text-[28px] text-white font-medium leading-[1.4] mb-6 [text-wrap:balance]">
            &ldquo;{primaryQuote.text}&rdquo;
          </blockquote>
          <p className="text-panda-yellow font-bold text-[14px] md:text-[15px]">
            {primaryQuote.author}
            {primaryQuote.role && <span className="text-gray-400 font-normal"> · {primaryQuote.role}</span>}
            {primaryQuote.company && <span className="text-gray-400 font-normal"> · {primaryQuote.company}</span>}
          </p>
        </div>
      </section>

      {/* 6. COMPARISON TABLE — match the existing site table styling from /how-much-do-custom-patches-cost */}
      <section className="py-14 md:py-20 px-6 bg-white">
        <div className="container mx-auto max-w-[1100px]">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-3 leading-tight">
              Panda Patches vs {competitorName}
            </h2>
            <p className="text-gray-500 text-[14px] md:text-[16px] max-w-[600px] mx-auto">
              Honest comparison. Where {competitorName} wins, we say so.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">Feature</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider bg-panda-green text-panda-dark">Panda Patches</th>
                  <th className="text-left px-5 py-4 font-bold text-[12px] uppercase tracking-wider">{competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {categoryOrder.map((category) => (
                  <>
                    <tr key={`cat-${category}`} className="bg-[#F7F7F7]">
                      <td colSpan={3} className="px-5 py-3 font-black text-[11px] uppercase tracking-[1.5px] text-panda-dark">
                        {category}
                      </td>
                    </tr>
                    {grouped[category].map((row, i) => (
                      <tr key={`${category}-${i}`} className="border-t border-gray-100 hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-5 py-4 font-bold text-panda-dark align-top text-[14px] md:text-[15px]">{row.feature}</td>
                        <td className={`px-5 py-4 align-top ${row.pandaWin ? 'bg-panda-green/10' : ''}`}>
                          <CellResult value={row.panda} win={row.pandaWin} lose={row.competitorWin} />
                        </td>
                        <td className={`px-5 py-4 align-top ${row.competitorWin ? 'bg-amber-50' : ''}`}>
                          <CellResult value={row.competitor} win={row.competitorWin} lose={row.pandaWin} />
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[12px] md:text-[13px] text-gray-500 mt-4 leading-relaxed max-w-[900px] mx-auto text-center">
            Competitor stats are pulled from each company&apos;s public website, verified May 2026. Numbers move over time.
          </p>
        </div>
      </section>

      {/* 7. PRICING COMPARISON STRIP — light gray section like other pages */}
      <section className="bg-[#F7F7F7] py-14 md:py-20 px-6">
        <div className="container mx-auto max-w-[1100px]">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-3 leading-tight">
              Real pricing on a real order
            </h2>
            <p className="text-gray-500 text-[14px] md:text-[16px] max-w-[600px] mx-auto">
              Same patch specs, both companies. Prices verified from public sources May 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pricingExamples.map((ex, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 md:p-7 border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-500 mb-4">{ex.scenario}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-4 transition-colors ${ex.pandaWin ? 'bg-panda-green/10 border-2 border-panda-green' : 'bg-[#F7F7F7] border-2 border-transparent'}`}>
                    <p className="text-[11px] font-black uppercase tracking-wider text-panda-dark mb-1">Panda Patches</p>
                    <p className="text-[18px] md:text-[20px] font-black text-panda-dark leading-tight">{ex.panda}</p>
                    {ex.pandaWin && <p className="text-[11px] text-panda-green font-bold mt-2 uppercase tracking-wider">{`${CHECK} Better value`}</p>}
                  </div>
                  <div className="rounded-xl p-4 bg-[#F7F7F7]">
                    <p className="text-[11px] font-black uppercase tracking-wider text-gray-600 mb-1">{competitorName}</p>
                    <p className="text-[18px] md:text-[20px] font-black text-gray-700 leading-tight">{ex.competitor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHERE COMPETITOR FITS — honest disclosure box */}
      <section className="py-14 md:py-20 px-6 bg-white">
        <div className="container mx-auto max-w-[820px]">
          <div className="bg-[#F7F7F7] border-l-4 border-gray-400 rounded-r-2xl p-7 md:p-9">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
              <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark leading-tight">
                When {competitorName} might be the better choice
              </h2>
            </div>
            <p className="text-gray-700 leading-[1.7] text-[15px] md:text-[16px] pl-9 font-medium">
              {whereCompetitorFits}
            </p>
          </div>
        </div>
      </section>

      {/* 9. MONEY-BACK GUARANTEE — Panda moat section, theme yellow accent */}
      <section className="py-14 md:py-20 px-6 bg-[#F7F7F7]">
        <div className="container mx-auto max-w-[900px]">
          <div className="bg-white border-2 border-panda-green rounded-2xl p-8 md:p-12 shadow-sm text-center">
            <div className="inline-flex items-center gap-2 bg-panda-green/15 px-4 py-2 rounded-full mb-5">
              <Shield className="w-4 h-4 text-panda-green" />
              <span className="text-[11px] font-black uppercase tracking-[1.5px] text-panda-green">Money-Back Guarantee</span>
            </div>
            <h2 className="text-[24px] md:text-[34px] font-black text-panda-dark mb-4 leading-tight [text-wrap:balance]">
              We don&apos;t start production until you approve in writing
            </h2>
            <p className="text-gray-600 leading-[1.7] text-[15px] md:text-[16px] max-w-[640px] mx-auto mb-7 font-medium">
              You see a digital mockup in 12 to 24 hours. You request unlimited free revisions. Only when you give written approval do patches get manufactured. If we can&apos;t get the design right after revisions, you receive a full refund. No questions asked.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-panda-dark text-panda-yellow font-black text-[14px] md:text-[15px] px-8 py-3.5 rounded-full hover:bg-panda-green hover:text-panda-dark transition-colors"
            >
              Get Your Mockup in 12-24 Hours
            </Link>
          </div>
        </div>
      </section>

      {/* 10. SECONDARY QUOTE */}
      {secondaryQuote && (
        <section className="bg-white py-12 md:py-16 px-6 border-y border-gray-100">
          <div className="container mx-auto max-w-[820px]">
            <div className="flex items-start gap-5">
              <div className="hidden sm:block flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-panda-dark flex items-center justify-center text-panda-yellow font-black text-xl shadow-md">
                  {secondaryQuote.author.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <blockquote className="text-[16px] md:text-[18px] text-gray-800 leading-[1.7] italic mb-3 font-medium">
                  &ldquo;{secondaryQuote.text}&rdquo;
                </blockquote>
                <p className="text-[13px] md:text-[14px] text-gray-600">
                  <strong className="text-panda-dark">{secondaryQuote.author}</strong>
                  {secondaryQuote.role && <span> · {secondaryQuote.role}</span>}
                  {secondaryQuote.company && <span> · {secondaryQuote.company}</span>}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 11. FAQ — match FAQ section style from blog/product pages */}
      <section className="py-14 md:py-20 px-6 bg-[#F7F7F7]">
        <div className="container mx-auto max-w-[820px]">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-3 leading-tight uppercase tracking-wide">
              Common Questions
            </h2>
            <p className="text-gray-500 text-[14px] md:text-[16px]">
              About switching from {competitorName} to Panda Patches.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 hover:shadow-md transition-shadow">
                <h3 className="text-[16px] md:text-[18px] font-black text-panda-dark mb-3 leading-tight">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-[1.7] text-[14px] md:text-[15px] font-medium">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA BAND — match CTASection style */}
      <section className="relative w-full bg-panda-dark py-16 md:py-24 px-6 overflow-hidden">
        <div className="container mx-auto max-w-[820px] text-center relative z-10">
          <h2 className="text-[28px] md:text-[40px] lg:text-[48px] font-black text-white mb-4 leading-[1.1] [text-wrap:balance]">
            See what your patches will look like.
            <br />
            <span className="text-panda-yellow">Free, in 24 hours.</span>
          </h2>
          <p className="text-gray-300 leading-[1.6] mb-8 text-[15px] md:text-[17px] max-w-[600px] mx-auto font-medium">
            Send your design or describe your idea. We send a digital mockup within 24 hours. No setup fees. No commitment. Approve only when you love it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Link
              href="/contact"
              prefetch={false}
              className="flex items-center justify-center gap-2 bg-[#DFFF00] text-[#051C05] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap"
            >
              <MessageCircle size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              <span>Get 12-24h Mockup</span>
            </Link>
            <a
              href="tel:+13022504340"
              className="flex items-center justify-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] md:text-[15px] px-6 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap border-2 border-[#DFFF00]/30"
            >
              <Phone size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <span>Call (302) 250-4340</span>
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
