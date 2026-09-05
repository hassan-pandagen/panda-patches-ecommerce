"use client";

/**
 * Chenille letter/number package configurator (CLDB68 §4).
 *
 * Renders on BOTH surfaces the brief names — /offers alongside the existing
 * packs, and /chenille-letters above the quote form — from one component, so a
 * price or a size option cannot end up different on the two pages.
 *
 * NO MOCKUP CYCLE. These are standard glyphs, so there is nothing to approve
 * before production. The only approval step is the COLOUR MATCH, and the copy
 * says so plainly rather than letting a buyer expect a proof that never comes.
 *
 * COLOUR IS A PICKER NOW, NOT A TEXT BOX (CEO, 2026-09-06). The supplier chart
 * is published, so the customer chooses a yarn CODE and the cone is decided at
 * checkout — no approval email, no supervisor step. Free text still exists for a
 * colour the chart does not carry, and still takes the confirmation path. The
 * old help text explained why precision was slower than vagueness; the chart
 * removes that trap rather than explaining it.
 *
 * Totals are shown from the same helper the server prices with. The client never
 * sends a price; checkout-letters-square recalculates from canon.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LETTER_PACKAGES,
  GLITTER_OPTIONS,
  calculateLetterPackageTotal,
  perGlyphPrice,
  type GlitterOption,
  type LetterPackage,
} from "@/lib/letterPackages";
import { SELECTABLE_BACKINGS } from "@/lib/factConstants";
import YarnCodePicker from "@/components/letters/YarnCodePicker";
import { getStoredAttribution, generateEventId } from "@/lib/clientAttribution";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function PackageCard({ pkg }: { pkg: LetterPackage }) {
  const [size, setSize] = useState<number>(3);
  const [colour, setColour] = useState("");
  const [glitter, setGlitter] = useState<GlitterOption | "">("");
  // Sew-on is the default: it is what we recommend for letterman jackets, where
  // a sewn letter can be repositioned by a tailor over the life of the garment.
  const [backing, setBacking] = useState<string>(SELECTABLE_BACKINGS[1]?.label ?? "Sew-On");
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const price = useMemo(
    () => calculateLetterPackageTotal({ packageId: pkg.id, glitter: glitter || null, backing }),
    [pkg.id, glitter, backing],
  );

  async function buy() {
    setErr("");
    if (!colour.trim()) return setErr("Tell us the letter colour before you order.");
    if (!customer.name.trim() || !customer.email.trim()) return setErr("Name and email are required.");
    setBusy(true);
    const initiateCheckoutEventId = generateEventId("initcheckout");
    try {
      const res = await fetch("/api/checkout-letters-square", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
          size,
          letterColour: colour.trim(),
          glitter: glitter || null,
          backing,
          customer,
          attribution: getStoredAttribution(),
          initiateCheckoutEventId,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setErr(data.error || "Could not start checkout. Please try again.");
    } catch {
      setErr("Could not start checkout. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full h-[46px] rounded-[10px] border-2 border-gray-300 px-3 font-bold text-black bg-white outline-none focus:border-panda-green";
  const label = "block text-[0.6875rem] font-black uppercase tracking-wider text-gray-500 mb-1.5";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm flex flex-col">
      <h3 className="text-[1.25rem] md:text-[1.5rem] font-black text-panda-dark leading-tight">{pkg.name}</h3>
      <p className="mt-1 text-[0.9375rem] text-gray-600 leading-[1.6]">{pkg.blurb}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-[2rem] font-black text-panda-dark tabular-nums">{money(pkg.price)}</span>
        <span className="text-[0.875rem] text-gray-500">
          {pkg.pieces} pieces &middot; {money(perGlyphPrice(pkg))} each
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${pkg.id}-size`} className={label}>Size (one for the whole set)</label>
          <select id={`${pkg.id}-size`} className={field} value={size} onChange={(e) => setSize(Number(e.target.value))}>
            {pkg.sizes.map((s) => <option key={s} value={s}>{s}&quot; tall</option>)}
          </select>
          {/* Canon, and the brief asks for it beside the selector: 2 in is the
              floor, but it is not the size we recommend. */}
          <p className="mt-1 text-[0.75rem] text-gray-500">3&quot;+ recommended for fullest loop texture.</p>
        </div>
        <div>
          <label htmlFor={`${pkg.id}-glitter`} className={label}>Glitter background</label>
          <select id={`${pkg.id}-glitter`} className={field} value={glitter}
                  onChange={(e) => setGlitter(e.target.value as GlitterOption | "")}>
            <option value="">None</option>
            {GLITTER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g[0].toUpperCase() + g.slice(1)} (+{money(pkg.glitterFee)})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <YarnCodePicker value={colour} onChange={setColour} idPrefix={pkg.id} />
      </div>

      <div className="mt-4">
        <label htmlFor={`${pkg.id}-backing`} className={label}>Backing</label>
        <select id={`${pkg.id}-backing`} className={field} value={backing} onChange={(e) => setBacking(e.target.value)}>
          {SELECTABLE_BACKINGS.map((b) => <option key={b.id} value={b.label}>{b.label}</option>)}
        </select>
        <p className="mt-1 text-[0.75rem] text-gray-500">
          Sew-on is what we recommend for letterman jackets. Velcro is charged per piece.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <input className={field} placeholder="Your name" value={customer.name}
               onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
        <input className={field} type="email" placeholder="Email" value={customer.email}
               onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
        <input className={field} placeholder="Phone (optional)" value={customer.phone}
               onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
      </div>

      {price && (
        <div className="mt-5 rounded-xl bg-[#F7F9F5] border border-gray-200 p-4 text-[0.875rem]">
          <div className="flex justify-between"><span>Set of {price.pieces}</span><span className="tabular-nums font-bold">{money(price.base)}</span></div>
          {price.glitter > 0 && (
            <div className="flex justify-between mt-1"><span>{glitter} glitter background</span><span className="tabular-nums font-bold">+{money(price.glitter)}</span></div>
          )}
          {price.velcro > 0 && (
            <div className="flex justify-between mt-1">
              <span>Velcro &times; {price.pieces} pieces</span>
              <span className="tabular-nums font-bold">+{money(price.velcro)}</span>
            </div>
          )}
          <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 text-[1.0625rem]">
            <span className="font-black text-panda-dark">Total</span>
            <span className="tabular-nums font-black text-panda-dark">{money(price.total)}</span>
          </div>
          <p className="mt-2 text-[0.75rem] text-gray-500">
            All-in &mdash; free worldwide shipping, no setup or digitizing fees, and no duties on arrival (DDP).
          </p>
        </div>
      )}

      {err && <p className="mt-3 text-[0.875rem] font-semibold text-red-600">{err}</p>}

      <button onClick={buy} disabled={busy}
              className="mt-5 h-[52px] rounded-[12px] bg-panda-dark text-white font-black uppercase tracking-wide disabled:opacity-60">
        {busy ? "Starting checkout…" : `Order for ${money(price?.total ?? pkg.price)}`}
      </button>

      <p className="mt-3 text-[0.75rem] text-gray-500 leading-[1.55]">
        <strong className="text-panda-dark">No mockup cycle.</strong> These are standard varsity glyphs, so there is
        nothing to proof. Pick a yarn code and the set goes straight to production. Every letter in
        the set is made from one programmed loop path on a digitally controlled machine, so piece one and piece{" "}
        {pkg.pieces} are identical &mdash; and one batch means one dye lot.
      </p>
    </div>
  );
}

export default function LetterPackageCards({ heading = true }: { heading?: boolean }) {
  return (
    <div>
      {heading && (
        <>
          <h2 className="text-[1.5rem] md:text-[2rem] font-black text-panda-dark mb-2">
            Chenille alphabet and number sets
          </h2>
          <p className="text-[0.9375rem] md:text-[1.0625rem] text-gray-700 leading-[1.7] mb-6 max-w-[47.5rem]">
            Complete sets at a fixed price, in one size and one colour. Need a different font, multiple colours in a
            letter, sizes above the range here, or a partial set?{" "}
            <Link href="#quote" className="text-panda-green underline font-semibold">Ask for a quote</Link> instead.
          </p>
        </>
      )}
      <div className="grid gap-5 lg:grid-cols-2">
        {LETTER_PACKAGES.map((p) => <PackageCard key={p.id} pkg={p} />)}
      </div>
    </div>
  );
}
