import Link from "next/link";
import { TRUSTPILOT_RATING, TRUSTPILOT_REVIEW_COUNT_STR } from "@/lib/reviewConstants";

interface MakerNoteProps {
  /** Optional one-line, page-specific lead-in (e.g. "Police patches are our most-repeated order."). Must be factual. */
  intro?: string;
}

/**
 * MakerNote — visible E-E-A-T / author-attribution block.
 *
 * Server component (no client JS). Fixes the site-wide gap surfaced by the
 * google-content-audit "32-grade": every commercial page asserted trust but never
 * SHOWED who stands behind it (item 13 failed everywhere). This renders the real
 * founder, credentials, and verifiable proof on the page itself.
 *
 * Every claim here is fact-grounded (llms.txt + reviewConstants) — do not add a
 * claim that is not already true and documented.
 */
export default function MakerNote({ intro }: MakerNoteProps) {
  return (
    <section className="w-full py-10 md:py-14 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[820px]">
        <div className="flex flex-col sm:flex-row items-start gap-5 bg-panda-light/60 border border-gray-100 rounded-2xl p-6 md:p-7">
          {/* Founder initials avatar — no invented headshot */}
          <div className="shrink-0 w-14 h-14 rounded-full bg-panda-green flex items-center justify-center">
            <span className="text-white text-[18px] font-black tracking-tight">IR</span>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-panda-green mb-1">
              Who makes your patches
            </p>
            <h2 className="text-[18px] md:text-[20px] font-black text-panda-dark leading-tight mb-2">
              Imran Raza — Founder &amp; CEO, Panda Patches
            </h2>
            <p className="text-[14px] text-gray-600 leading-[1.7]">
              {intro ? <span className="text-panda-dark font-semibold">{intro} </span> : null}
              Panda Patches (legally MC Patches LLC) is run by Imran Raza, who has spent 13+ years in
              custom patch and textile manufacturing. We&rsquo;re the maker, not a reseller. Most suppliers just
              want the sale&nbsp;&mdash; we get the mockup right first, send unlimited free revisions until you
              approve, and only then start production. If a finished patch isn&rsquo;t right, we remake it.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[13px] font-bold text-panda-dark">
              <span>1,000,000+ patches delivered</span>
              <span className="text-gray-300">·</span>
              <span>{TRUSTPILOT_RATING}/5 from {TRUSTPILOT_REVIEW_COUNT_STR} Trustpilot reviews</span>
              <span className="text-gray-300">·</span>
              <span>Austin, TX</span>
            </div>

            <Link
              href="/about"
              prefetch={false}
              className="inline-flex items-center gap-1.5 mt-4 text-[14px] font-bold text-panda-green hover:gap-2.5 transition-all"
            >
              More about how we work
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
