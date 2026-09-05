/**
 * The published chenille yarn colour chart (CEO, 2026-09-06).
 *
 * A reference block, not a picker — it renders on /chenille-letters and on the
 * chenille product page, where it serves custom orders too: a customer speccing
 * a 12-inch back piece can quote a code in the quote form and skip the same
 * confirmation round trip the letter packages skip.
 *
 * Server component on purpose. It has no state, so it costs no JavaScript, and
 * the codes are in the initial HTML where an assistant or a crawler can read
 * them. That matters more than it looks: "what colours do chenille patches come
 * in" is a question we currently answer with adjectives on every competitor's
 * site, and this answers it with 140 codes.
 */
import { YARN_COLOURS, YARN_FAMILIES, YARN_CHART_DISCLAIMER } from "@/lib/yarnColours";

export default function YarnColourChart({ heading = true }: { heading?: boolean }) {
  return (
    <div>
      {heading && (
        <>
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-2">
            Chenille yarn colours
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.7] mb-5 max-w-[47.5rem]">
            Every colour we hold in chenille yarn, {YARN_COLOURS.length} in all. Quote the code on
            any order, letters or custom, and we pull that cone. No colour approval step and no
            waiting on a match.
          </p>
        </>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
        {YARN_FAMILIES.map((family) => {
          const colours = YARN_COLOURS.filter((c) => c.family === family.id);
          if (colours.length === 0) return null;
          return (
            <div key={family.id} className="mb-5 last:mb-0">
              <h3 className="text-[0.6875rem] font-black uppercase tracking-wider text-gray-500 mb-2">
                {family.label}
                <span className="ml-2 font-bold text-gray-400">{colours.length}</span>
              </h3>
              <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 list-none p-0 m-0">
                {colours.map((c) => (
                  <li key={c.code} className="rounded-[8px] overflow-hidden border border-gray-200">
                    <span
                      className="block h-8 w-full"
                      style={{ backgroundColor: c.hex }}
                      aria-hidden
                    />
                    <span className="block text-[0.625rem] font-bold text-gray-600 py-0.5 text-center tabular-nums">
                      {c.code}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[0.8125rem] text-gray-600 leading-[1.6] max-w-[47.5rem]">
        {YARN_CHART_DISCLAIMER}
      </p>
    </div>
  );
}
