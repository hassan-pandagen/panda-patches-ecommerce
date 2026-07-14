import Link from "next/link";

/**
 * AeoAnswerBlock — the reusable "answer-first" citation block (AEO-CONTENT-REWORK-SPEC-2026-07.md).
 *
 * WHY THIS EXISTS: 2026 studies show ~44% of AI citations are pulled from the
 * first 30% of a page, comprehensive guides WITH data tables get the highest
 * citation rate (~67%), and AI engines cite self-contained answer-first passages
 * of ~134-167 words. Our product/bulk pages were conversion-first (calculator +
 * carousels up top, text buried at the bottom), so the extractable answer content
 * sat below the fold in the DOM and was rarely cited. This block puts a direct
 * answer + a key-facts table + a comparison table + fan-out Q&A passages HIGH in
 * the DOM so answer engines can extract them.
 *
 * Rendered near the top of every buying-intent page. Content per page lives in
 * src/lib/aeoContent.ts (codegen-editable). Q&A is rendered OPEN (not an
 * accordion) so the text is unambiguously visible/extractable.
 */

export interface KeyFact {
  label: string;
  value: string;
}

export interface FanoutQA {
  /** Question-style heading, mapped to a real fan-out sub-query. */
  q: string;
  /** Answer-first passage, ~134-167 words, self-contained (quotable alone). */
  a: string;
}

export interface ComparisonTable {
  caption: string;
  columns: string[];
  rows: string[][];
}

export interface AeoAnswerContent {
  /** H2 for the block (natural-language buying query). */
  heading: string;
  /** 40-60 word direct answer with the key number; makes sense quoted alone. */
  answer: string;
  keyFacts: KeyFact[];
  comparison?: ComparisonTable;
  faqs: FanoutQA[];
  /** e.g. "July 2026" — visible freshness signal. */
  updated: string;
}

export default function AeoAnswerBlock({ content }: { content: AeoAnswerContent }) {
  return (
    <section className="w-full py-8 md:py-12 bg-white border-t border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-[900px]">

        {/* H2 + answer-first block (first-30% extraction zone) */}
        <h2 className="text-[22px] md:text-[30px] font-black text-panda-dark leading-tight mb-4">
          {content.heading}
        </h2>
        <p className="text-[16px] md:text-[18px] text-gray-700 leading-[1.7] mb-6 font-medium">
          {content.answer}
        </p>

        {/* KEY-FACTS table — highest-citation format; plain <table>, text-extractable */}
        <div className="overflow-x-auto rounded-[12px] border border-gray-200 mb-8">
          <table className="w-full text-[14px] md:text-[15px] text-left">
            <tbody className="divide-y divide-gray-100">
              {content.keyFacts.map((f, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <th scope="row" className="px-4 py-3 font-bold text-panda-dark whitespace-nowrap align-top w-[45%]">
                    {f.label}
                  </th>
                  <td className="px-4 py-3 text-gray-700">{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COMPARISON table (optional) */}
        {content.comparison && (
          <div className="mb-8">
            <h3 className="text-[18px] md:text-[22px] font-black text-panda-dark mb-4">
              {content.comparison.caption}
            </h3>
            <div className="overflow-x-auto rounded-[12px] border border-gray-200">
              <table className="w-full text-[13px] md:text-[14px] text-left">
                <thead className="bg-panda-dark text-white">
                  <tr>
                    {content.comparison.columns.map((c, i) => (
                      <th key={i} className="px-4 py-3 font-bold whitespace-nowrap">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {content.comparison.rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {row.map((cell, ci) => (
                        <td key={ci} className={`px-4 py-3 ${ci === 0 ? "font-bold text-panda-dark whitespace-nowrap" : "text-gray-600"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAN-OUT Q&A — one question-style heading per sub-query, answer-first
            passage below. Rendered OPEN (visible) for reliable AI extraction. */}
        <div className="space-y-6">
          {content.faqs.map((qa, i) => (
            <div key={i}>
              <h3 className="text-[17px] md:text-[19px] font-black text-panda-dark mb-2 leading-snug">
                {qa.q}
              </h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">
                {qa.a}
              </p>
            </div>
          ))}
        </div>

        {/* Freshness signal */}
        <p className="text-[12px] text-gray-400 mt-8">
          Last updated: {content.updated} ·{" "}
          <Link href="/how-much-do-custom-patches-cost-full-pricing-breakdown" className="underline hover:text-panda-green">
            See full pricing breakdown
          </Link>
        </p>

      </div>
    </section>
  );
}
