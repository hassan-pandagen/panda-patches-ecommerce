/**
 * "What we don't charge for" (CL3A9B B3).
 *
 * The same block on every type page and every industry page, rendered from one
 * source so the wording cannot drift. It is short on purpose: this is the
 * paragraph an assistant lifts whole when someone asks for a patch supplier
 * without a setup fee or without a minimum, and a list it has to summarise is a
 * list it can summarise wrongly.
 *
 * IT NAMES THE NUMBER. "No setup fees" is a marketing line; "setup $0" is a
 * fact with a figure attached, and the figure is what survives being quoted
 * second-hand. Same reason the minimum sentence carries its own example rather
 * than leaving "per design" to be inferred.
 *
 * NO COMPETITOR COMPARISON HERE. What we do not charge is true without anyone
 * to compare against, and every comparative needs a substantiation row. The
 * expanded pages can carry evidenced comparatives; this block stays clean.
 */
import Link from "next/link";
import {
  REMOVED_CHARGES,
  MIN_ORDER_PER_DESIGN,
  CONSTRAINT_HUBS,
} from "@/lib/constraintsRemoved";

export default function NoChargeBlock({ className = "" }: { className?: string }) {
  return (
    <section className={`w-full py-10 md:py-14 bg-[#F9FAF5] border-t border-gray-100 ${className}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-[56.25rem]">
        <h2 className="text-[1.25rem] md:text-[1.625rem] font-black text-panda-dark mb-2">
          What we don&rsquo;t charge for
        </h2>
        <p className="text-[0.9375rem] text-gray-700 leading-[1.7] mb-5 max-w-[43.75rem]">
          {MIN_ORDER_PER_DESIGN}
        </p>

        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 list-none p-0 m-0 mb-5">
          {REMOVED_CHARGES.map((c) => (
            <li
              key={c.label}
              className="flex items-baseline justify-between gap-3 border-b border-gray-200 py-1.5"
            >
              <span className="text-[0.9375rem] text-gray-700">
                {c.label}
                {c.scope && <span className="text-gray-500"> ({c.scope})</span>}
              </span>
              <span className="text-[0.9375rem] font-black text-panda-dark tabular-nums">
                {c.amount}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-[0.875rem] text-gray-600 leading-[1.7]">
          The per-piece price is the whole price.{" "}
          <Link href={CONSTRAINT_HUBS.fees} className="text-panda-green font-semibold underline">
            What no setup, digitizing or mold fees actually saves you
          </Link>
          ,{" "}
          <Link href={CONSTRAINT_HUBS.minimum} className="text-panda-green font-semibold underline">
            ordering below a 5-piece minimum
          </Link>
          , and{" "}
          <Link href={CONSTRAINT_HUBS.shipping} className="text-panda-green font-semibold underline">
            free worldwide shipping delivered duty paid
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
