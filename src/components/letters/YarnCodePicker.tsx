"use client";

/**
 * Yarn colour picker (CEO, 2026-09-06).
 *
 * TWO WAYS IN, AND THE FAST ONE IS THE DEFAULT. Picking a code from the chart
 * decides the cone at checkout: no confirmation email, no supervisor decision,
 * straight to production. The free-text box is the fallback for a colour the
 * chart does not carry, and it keeps the old confirmation path. The UI says
 * which is which before the customer commits, because the difference is days.
 *
 * WHY THE CODE IS SHOWN ON EVERY SWATCH rather than on hover: the code is the
 * thing we match, and the swatch is only an approximation of it. A picker that
 * shows colour alone teaches the customer to trust the colour. Showing the code
 * on the tile, in the selected state, and in the order confirmation teaches them
 * to trust the number, which is the one that survives their monitor, our screen
 * and the dye lot.
 */
import { useMemo, useState } from "react";
import {
  YARN_COLOURS,
  YARN_FAMILIES,
  YARN_CHART_DISCLAIMER,
  HEX_PROVENANCE,
  findYarnColour,
  type YarnFamily,
} from "@/lib/yarnColours";

interface Props {
  /** The submitted value: a chart code, or free text. */
  value: string;
  onChange: (value: string) => void;
  /** Distinguishes the two pickers on /offers, which renders both packages. */
  idPrefix: string;
}

export default function YarnCodePicker({ value, onChange, idPrefix }: Props) {
  const [family, setFamily] = useState<YarnFamily | "all">("all");
  const [query, setQuery] = useState("");
  const [freeText, setFreeText] = useState(false);

  const selected = findYarnColour(value);

  const visible = useMemo(() => {
    const q = query.trim().replace(/^#/, "");
    return YARN_COLOURS.filter(
      (c) => (family === "all" || c.family === family) && (q === "" || c.code.includes(q)),
    );
  }, [family, query]);

  // Families that actually have colours, so the filter row never offers a chip
  // that leads to an empty grid.
  const familiesPresent = useMemo(
    () => YARN_FAMILIES.filter((f) => YARN_COLOURS.some((c) => c.family === f.id)),
    [],
  );

  const label = "block text-[0.6875rem] font-black uppercase tracking-wider text-gray-500 mb-1.5";
  const chip =
    "px-2.5 py-1 rounded-full text-[0.75rem] font-bold border transition-colors whitespace-nowrap";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className={label + " mb-0"}>Letter colour</span>
        <button
          type="button"
          onClick={() => {
            setFreeText((v) => !v);
            onChange("");
          }}
          className="text-[0.75rem] font-semibold text-panda-green underline"
        >
          {freeText ? "Choose from the chart instead" : "Colour not on the chart?"}
        </button>
      </div>

      {freeText ? (
        <>
          <input
            id={`${idPrefix}-colour-free`}
            className="w-full h-[46px] rounded-[10px] border-2 border-gray-300 px-3 font-bold text-black bg-white outline-none focus:border-panda-green"
            value={value}
            placeholder="Pantone code, colour name, or hex"
            onChange={(e) => onChange(e.target.value)}
          />
          <p className="mt-1.5 text-[0.75rem] text-gray-600 leading-[1.5]">
            We will match this to the closest yarn we stock and email you a photograph to approve
            before production starts. That approval step adds a day or two, which is why picking a
            chart code is faster.
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <button
              type="button"
              onClick={() => setFamily("all")}
              className={`${chip} ${family === "all" ? "bg-panda-dark text-white border-panda-dark" : "bg-white text-gray-600 border-gray-300"}`}
            >
              All {YARN_COLOURS.length}
            </button>
            {familiesPresent.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFamily(f.id)}
                className={`${chip} ${family === f.id ? "bg-panda-dark text-white border-panda-dark" : "bg-white text-gray-600 border-gray-300"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <input
            id={`${idPrefix}-colour-search`}
            className="w-full h-[40px] rounded-[10px] border-2 border-gray-200 px-3 text-[0.875rem] font-semibold text-black bg-white outline-none focus:border-panda-green mb-2.5"
            value={query}
            placeholder="Search a code, e.g. 10029"
            inputMode="numeric"
            onChange={(e) => setQuery(e.target.value)}
          />

          <div
            role="listbox"
            aria-label="Chenille yarn colours"
            className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-[15rem] overflow-y-auto p-1 rounded-[10px] border border-gray-200 bg-[#FAFAF7]"
          >
            {visible.map((c) => {
              const isSelected = selected?.code === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  title={`Yarn code ${c.code}`}
                  onClick={() => onChange(c.code)}
                  className={`rounded-[8px] overflow-hidden border-2 transition-transform ${
                    isSelected ? "border-panda-dark scale-[0.96]" : "border-transparent hover:scale-[0.97]"
                  }`}
                >
                  <span className="block h-9 w-full" style={{ backgroundColor: c.hex }} />
                  <span className="block text-[0.625rem] font-bold text-gray-600 py-0.5 bg-white tabular-nums">
                    {c.code}
                  </span>
                </button>
              );
            })}
            {visible.length === 0 && (
              <p className="col-span-full text-[0.8125rem] text-gray-500 py-4 text-center">
                No code matches that search.
              </p>
            )}
          </div>

          {selected ? (
            <p className="mt-2 text-[0.8125rem] text-gray-700 flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: selected.hex }}
              />
              <span>
                <strong className="text-panda-dark">Yarn {selected.code}</strong> selected. No colour
                confirmation needed, so this goes straight to production.
              </span>
            </p>
          ) : (
            <p className="mt-2 text-[0.8125rem] text-gray-500">
              Pick a code to skip the colour-approval step.
            </p>
          )}
        </>
      )}

      <p className="mt-2 text-[0.6875rem] text-gray-500 leading-[1.5]">
        {YARN_CHART_DISCLAIMER}
        {HEX_PROVENANCE === "estimated" && " Swatches on this page are being replaced with values taken from the supplier's own chart."}
      </p>
    </div>
  );
}
