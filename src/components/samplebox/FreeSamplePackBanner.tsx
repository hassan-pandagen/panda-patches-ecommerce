import Link from "next/link";

/**
 * Free-sample-with-first-order offer (PAC949 Part 2).
 *
 * The owner decision: keep the paid $45 Sample Box AND give a free sample pack
 * with every customer's first order. This reusable banner presents that offer.
 * Drop it on /sample-box, the offers page, or any product page with one line:
 *   <FreeSamplePackBanner />
 *
 * Fulfilment rule (default, flagged for ops): the free pack is AUTO-INCLUDED on
 * a customer's first production order; no code needed. If ops would rather grant
 * it via a checkout code, change the copy line marked below.
 */
export default function FreeSamplePackBanner({
  compact = false,
}: {
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-panda-green/30 bg-panda-green/5 px-5 py-4">
        <span className="text-[20px] leading-none" aria-hidden="true">🎁</span>
        <p className="text-[14px] text-panda-dark leading-[1.6]">
          <strong>Your first order includes a free sample pack.</strong> A set of
          patch samples in other materials ships with your first production order,
          automatically, so you can feel the quality firsthand.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full py-12 md:py-16 bg-panda-dark">
      <div className="container mx-auto px-6 max-w-[1000px]">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[2px] text-panda-dark bg-panda-yellow px-3 py-1.5 rounded-full mb-4">
              🎁 Free with your first order
            </span>
            <h2 className="text-[28px] md:text-[40px] font-black text-white leading-[1.05] tracking-tight mb-4">
              Your First Order Includes a <span className="text-panda-yellow">Free Sample Pack</span>
            </h2>
            <p className="text-[15px] md:text-[17px] text-gray-300 leading-[1.7] mb-5 max-w-[560px]">
              Buying patches from us for the first time? We tuck a free sample pack
              into your first production order, a hand-picked set of patches in other
              materials, so you can feel the embroidery, PVC, woven, leather, and
              chenille quality in person before your next run.
            </p>
            {/* Fulfilment copy — default is auto-include on first order. */}
            <p className="text-[13px] text-panda-yellow/90 font-bold mb-6">
              Automatically added to your first order. No code needed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/offers"
                className="inline-flex items-center gap-2 bg-panda-yellow text-panda-dark font-black text-[14px] uppercase tracking-wider px-6 py-3 rounded-full hover:scale-[1.03] transition-transform"
              >
                Start Your First Order
              </Link>
              <Link
                href="/custom-patches"
                prefetch={false}
                className="inline-flex items-center gap-2 bg-white/10 text-white font-bold text-[14px] px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                Browse Patch Types
              </Link>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-[12px] font-black uppercase tracking-wider text-panda-yellow mb-4">What you get free</p>
            <ul className="space-y-3">
              {[
                "Samples across our core patch materials",
                "See real stitching, color, and backing in hand",
                "Shipped inside your first order, no extra postage",
                "Plus the usual: mockup in 12-24h, free worldwide shipping",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-panda-green font-black text-lg leading-none mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-[14px] text-gray-200 leading-[1.5]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[12px] text-gray-400 leading-[1.6] mt-5 pt-4 border-t border-white/10">
              Want samples before you order? The paid $45 Sample Box below ships on its own, anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
