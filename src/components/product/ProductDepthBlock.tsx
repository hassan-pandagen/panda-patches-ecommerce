import Link from "next/link";
import {
  calculatePatchPrice,
  formatMoney,
  FROM_PRICE_QUALIFIER,
} from "@/lib/pricingCalculator";
import { construction, getSpecsForSlug, hasSpecCanon, SPEC_VERSION, SPEC_DATE_LABEL } from "@/lib/patchSpecs";
import { MIN_ORDER_DEFAULT } from "@/lib/factConstants";

/**
 * Product-page depth block (CLB408_1 §5).
 *
 * The problem this solves: our product pages lose their own head terms
 * ("custom pvc patches" pos 56.6, woven 47.3, leather 67.5, chenille 43.3)
 * while our GUIDES rank 4-10 for the same topics. The guides win because they
 * answer the buying question with real numbers; the product pages were mostly
 * imagery, carousels and social proof. This block gives each product page the
 * substance its own head term deserves: how the type is actually made, the
 * production limits we hold, and a real price ladder.
 *
 * TWO RULES, both learned the hard way this month:
 *  1. Specs are IMPORTED from `patchSpecs.ts`, never retyped. Copying spec
 *     numbers is what left a stale 5 mm text height live on three surfaces
 *     after v1.1 corrected it to 4 mm.
 *  2. The cost ladder is COMPUTED by `calculatePatchPrice` — the same function
 *     checkout uses — never hand-written. Hand-written prices are how the woven
 *     page promised a 5-piece minimum that checkout rejected.
 * If you find yourself typing a number into this file, you are doing it wrong.
 */

/** Quantities to show. Chosen to match the real tier breaks buyers care about. */
const LADDER_QTYS = [MIN_ORDER_DEFAULT, 50, 100, 500, 1000];

/** Ladder is quoted at one size so the column is comparable down the page. */
const LADDER_SIZE = 3;

interface Props {
  slug: string;
  productName: string;
  /** Display title, e.g. "Custom Woven Patches" — used in the head-term H2. */
  title: string;
}

export default function ProductDepthBlock({ slug, productName, title }: Props) {
  const specs = getSpecsForSlug(slug);
  const build = hasSpecCanon(slug) ? construction[slug] : null;

  const ladder = LADDER_QTYS.map((qty) => {
    const r = calculatePatchPrice(productName, LADDER_SIZE, LADDER_SIZE, qty);
    if (r.error) return null;
    return { qty, unit: r.unitPrice, total: r.totalPrice };
  }).filter((r): r is { qty: number; unit: number; total: number } => r !== null);

  // Nothing authored and nothing priceable — render nothing rather than an empty shell.
  if (!build && specs.length === 0 && ladder.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
        <p className="text-[0.6875rem] font-black uppercase tracking-[2px] text-panda-green mb-3">
          Specs &amp; pricing
        </p>
        {/* Head-term H2 — this page should own its own product term. */}
        <h2 className="text-[1.375rem] md:text-[1.875rem] font-black text-panda-dark leading-tight mb-5">
          {title}: how they are made, what they cost
        </h2>

        {build && (
          <>
            <h3 className="text-[1.0625rem] md:text-[1.1875rem] font-black text-panda-dark mb-2">
              Construction
            </h3>
            <p className="text-gray-700 leading-[1.8] text-[0.9375rem] md:text-[1rem] font-medium mb-8">
              {build}
            </p>
          </>
        )}

        {specs.length > 0 && (
          <>
            <h3 className="text-[1.0625rem] md:text-[1.1875rem] font-black text-panda-dark mb-2">
              Production limits we hold
            </h3>
            <p className="text-gray-600 text-[0.875rem] leading-[1.7] font-medium mb-4">
              These are the real limits our production floor holds for this type — design to
              them and your artwork comes out crisp the first time. Figures are for finished
              patches; minimum text height assumes a clean sans-serif.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white mb-3">
              <table className="w-full text-[0.8125rem] md:text-[0.9375rem] border-collapse min-w-[420px]">
                <tbody className="text-gray-700 font-medium">
                  {specs.map((row) => (
                    <tr key={row.spec} className="border-b border-gray-100 last:border-0">
                      <th
                        scope="row"
                        className="py-3 px-4 font-bold text-panda-dark text-left w-[45%]"
                      >
                        {row.spec}
                      </th>
                      <td className="py-3 px-4">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[0.8125rem] text-gray-500 mb-8 font-medium">
              From our published{" "}
              <Link
                href="/patch-manufacturability-specs"
                prefetch={false}
                className="text-panda-green underline font-semibold"
              >
                patch manufacturability standard
              </Link>{" "}
              ({SPEC_VERSION}, {SPEC_DATE_LABEL}) — free to cite.
            </p>
          </>
        )}

        {ladder.length > 0 && (
          <>
            <h3 className="text-[1.0625rem] md:text-[1.1875rem] font-black text-panda-dark mb-2">
              What they actually cost
            </h3>
            <p className="text-gray-600 text-[0.875rem] leading-[1.7] font-medium mb-4">
              Live prices for a {LADDER_SIZE}-inch design, straight from the same calculator
              that runs checkout — not an estimate. No setup, digitizing, or mould fees, and
              free worldwide shipping is included at every quantity.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white mb-3">
              <table className="w-full text-[0.8125rem] md:text-[0.9375rem] border-collapse min-w-[420px]">
                <thead>
                  <tr className="border-b-2 border-panda-dark text-left">
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                      Quantity
                    </th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                      Per piece
                    </th>
                    <th className="py-3 px-4 font-black text-panda-dark uppercase tracking-wider text-[0.6875rem]">
                      Order total
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-medium">
                  {ladder.map((r) => (
                    <tr key={r.qty} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 px-4 font-bold text-panda-dark">
                        {r.qty.toLocaleString()} pc
                        {r.qty === MIN_ORDER_DEFAULT && (
                          <>
                            {" "}
                            <span className="ml-2 text-[0.6875rem] font-bold uppercase tracking-wide text-panda-green">
                              minimum
                            </span>
                          </>
                        )}
                      </td>
                      <td className="py-3 px-4">${formatMoney(r.unit)}</td>
                      <td className="py-3 px-4">${formatMoney(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[0.8125rem] text-gray-500 font-medium">
              Per-piece figures are rounded to the nearest cent, so multiplying one out
              can land a few cents from the order total — the total column is what
              checkout charges. Advertised &ldquo;from&rdquo; prices elsewhere on the site
              use a {FROM_PRICE_QUALIFIER} basis; larger sizes cost more per piece. Use the
              calculator at the top of this page for your exact size and quantity.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
