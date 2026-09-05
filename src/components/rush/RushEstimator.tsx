"use client";

/**
 * Rush Patch Price Calculator (CLC97E §2).
 *
 * WHY THIS EXISTS, in one number: GSC shows 249 impressions/month across
 * "rush patch price calculator", "rush patch price calculator for dog patches"
 * and "rush patch iron on patches price calculator" — all at position 23-29
 * with ZERO clicks. People are searching for exactly this and landing nowhere.
 *
 * It answers the question the rush form cannot answer until you fill it in:
 * what does rush cost, and what DATE do I get them.
 *
 * EVERY FIGURE COMES FROM CANON, none is restated here:
 *   price        calculatePatchPrice()   — the same table the checkout uses
 *   rush fee     getRushSurcharge()      — 25% of subtotal, $50 floor
 *   velcro       VELCRO_PER_PIECE_FEE    — $0.35/piece
 *   in-hand date the +6-business-day rule the calculator's rush picker enforces
 *
 * The date rule is duplicated from ComplexCalculator deliberately and marked
 * below — see the comment on earliestInHandDate(). If that rule changes, both
 * move together or the quote page and this page disagree in public.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { calculatePatchPrice } from "@/lib/pricingCalculator";
import { getRushSurcharge, VELCRO_PER_PIECE_FEE } from "@/lib/checkoutConfig";

const TYPES = [
  { label: "Embroidered", product: "Custom Embroidered Patches" },
  { label: "PVC", product: "Custom PVC Patches" },
  { label: "Woven", product: "Custom Woven Patches" },
  { label: "Chenille", product: "Custom Chenille Patches" },
  { label: "Leather", product: "Custom Leather Patches" },
  { label: "Printed", product: "Custom Printed Patches" },
] as const;

// Starts at the canon minimum (5, every type, every size). It started at 10 for
// its first three days while the page above it said "from 5 pieces" (CLD22B B2).
const QUANTITIES = [5, 10, 25, 50, 100, 250, 500, 1000] as const;
const SIZES = [2, 2.5, 3, 3.5, 4, 5, 6, 8] as const;

/**
 * Earliest in-hand date we will confirm for a rush order placed today.
 *
 * MIRRORS ComplexCalculator's getMinRushDate(): today + 6 days, and if that
 * lands on a weekend it moves to the Monday. Rush is quoted in BUSINESS days
 * (compliance, factConstants §0.2), so a Saturday delivery is never offered.
 *
 * This is an ESTIMATE and the page says so: the confirmed date comes by email
 * within 2-6 hours of ordering, because it depends on quantity and patch type
 * in ways a date rule cannot capture.
 */
function earliestInHandDate(from = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + 6);
  const day = d.getDay();
  if (day === 0) d.setDate(d.getDate() + 1);
  if (day === 6) d.setDate(d.getDate() + 2);
  return d;
}

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function RushEstimator() {
  const [type, setType] = useState<string>(TYPES[0].product);
  const [size, setSize] = useState<number>(3);
  const [qty, setQty] = useState<number>(50);
  const [velcro, setVelcro] = useState(false);

  const result = useMemo(() => {
    const priced = calculatePatchPrice(type, size, size, qty) as {
      unitPrice?: number;
      totalPrice?: number;
      error?: string;
      quoteOnly?: boolean;
    };

    if (priced.error || priced.quoteOnly || typeof priced.totalPrice !== "number") {
      return { quoteOnly: true as const, reason: priced.error ?? "This size is quoted rather than auto-priced." };
    }

    const velcroFee = velcro ? Math.round(VELCRO_PER_PIECE_FEE * qty * 100) / 100 : 0;
    const subtotal = Math.round((priced.totalPrice + velcroFee) * 100) / 100;
    const rushFee = getRushSurcharge(subtotal);

    return {
      quoteOnly: false as const,
      unit: priced.unitPrice ?? 0,
      subtotal,
      velcroFee,
      rushFee,
      total: Math.round((subtotal + rushFee) * 100) / 100,
      inHand: earliestInHandDate(),
    };
  }, [type, size, qty, velcro]);

  const field =
    "w-full h-[46px] rounded-[10px] border-2 border-gray-300 px-3 font-bold text-black bg-white outline-none focus:border-panda-green";
  const labelCls =
    "block text-[0.6875rem] font-black uppercase tracking-wider text-gray-500 mb-1.5";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-7 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="rush-type" className={labelCls}>Patch type</label>
          <select id="rush-type" className={field} value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t.product} value={t.product}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rush-size" className={labelCls}>Size (inches)</label>
          <select id="rush-size" className={field} value={size} onChange={(e) => setSize(Number(e.target.value))}>
            {SIZES.map((s) => <option key={s} value={s}>{s}&quot;</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="rush-qty" className={labelCls}>Quantity</label>
          <select id="rush-qty" className={field} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
            {QUANTITIES.map((q) => <option key={q} value={q}>{q} pieces</option>)}
          </select>
        </div>
        <div>
          <span className={labelCls}>Backing</span>
          <label className="flex h-[46px] items-center gap-2 rounded-[10px] border-2 border-gray-300 px-3 cursor-pointer">
            <input
              type="checkbox"
              checked={velcro}
              onChange={(e) => setVelcro(e.target.checked)}
              className="h-4 w-4 accent-panda-green"
            />
            <span className="text-[0.875rem] font-bold text-black">
              Velcro (+${VELCRO_PER_PIECE_FEE.toFixed(2)}/pc)
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-[#F7F9F5] border border-gray-200 p-5">
        {result.quoteOnly ? (
          <div>
            <p className="text-[1rem] font-black text-panda-dark mb-1">This one we quote</p>
            <p className="text-[0.9375rem] text-gray-700 leading-relaxed">
              {result.reason}{" "}
              <Link href="/contact" prefetch={false} className="text-panda-green underline font-semibold">
                Send us the details
              </Link>{" "}
              and we will come back with the price and the in-hand date together.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className={labelCls}>Patches</p>
                <p className="text-[1.25rem] font-black text-panda-dark tabular-nums">{money(result.subtotal)}</p>
                <p className="text-[0.75rem] text-gray-500">
                  {money(result.unit)}/pc{result.velcroFee > 0 ? ` · velcro ${money(result.velcroFee)}` : ""}
                </p>
              </div>
              <div>
                <p className={labelCls}>Rush fee</p>
                <p className="text-[1.25rem] font-black text-red-600 tabular-nums">+{money(result.rushFee)}</p>
                <p className="text-[0.75rem] text-gray-500">25% of order, $50 minimum</p>
              </div>
              <div>
                <p className={labelCls}>Total</p>
                <p className="text-[1.5rem] font-black text-panda-dark tabular-nums">{money(result.total)}</p>
                <p className="text-[0.75rem] text-gray-500">Free worldwide shipping included</p>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-4">
              <p className={labelCls}>Estimated in hand</p>
              <p className="text-[1.375rem] font-black text-panda-green">
                {result.inHand.toLocaleString("en-US", {
                  weekday: "long", month: "long", day: "numeric",
                })}
              </p>
              <p className="text-[0.8125rem] text-gray-600 leading-relaxed mt-1">
                Earliest date we would confirm for an order placed today. Your exact
                in-hand date arrives by email within 2 to 6 hours of ordering, before any
                rush fee is charged &mdash; it depends on quantity and patch type. If we
                cannot hit your date, we remove the rush fee.
              </p>
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-[0.8125rem] text-gray-500 leading-relaxed">
        Prices are all-in USD with free worldwide shipping, a free digital mockup in
        12&ndash;24 hours and no setup or digitizing fees. For an exact quote at any size or
        quantity from 5 pieces up, use the{" "}
        <Link href="/custom-patches" prefetch={false} className="text-panda-green underline font-semibold">
          full patch calculator
        </Link>.
      </p>
    </div>
  );
}
