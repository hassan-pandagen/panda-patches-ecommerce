import { calculatePatchPrice } from "@/lib/pricingCalculator";

// Server-side price formatters used by static marketing/AEO tables so their
// numbers come from the SAME engine as the product calculators and can never
// drift stale again (the leather +12% uplift and the PVC reduction both left
// hardcoded tables behind — this closes that gap). These run at build/render on
// the server, so the values are baked into static HTML and stay crawlable.
//
// calcPerPc needs ONE size basis, so every caller passes the size its
// surrounding copy states (e.g. "3-inch, per piece"). NOTE: do not use this for
// the /partners wholesale table — that is a separate reseller price scheme, not
// the retail calculator.

/** Live per-piece price as "$X.XX". Returns "—" below the product minimum. */
export function perPc(productName: string, size: number, qty: number): string {
  const r = calculatePatchPrice(productName, size, size, qty);
  if (r.error || !r.unitPrice) return "—";
  return `$${r.unitPrice.toFixed(2)}`;
}

/**
 * Live per-piece price minus a discount fraction (0-1), as "$X.XX". Used for the
 * /partners reseller table: partner cost = live retail x (1 - discount), so the
 * reseller prices track the calculator instead of drifting stale.
 */
export function discountedPerPc(productName: string, size: number, qty: number, discount: number): string {
  const r = calculatePatchPrice(productName, size, size, qty);
  if (r.error || !r.unitPrice) return "—";
  return `$${(r.unitPrice * (1 - discount)).toFixed(2)}`;
}

/**
 * Live order total as "$X,XXX", same engine/basis as perPc. Uses the DISPLAYED
 * (cent-rounded) per-piece so that shown-per-piece x qty === shown-total and a
 * reader can verify the arithmetic (avoids a float-rounding drift where the raw
 * unit price x qty lands a few dollars off the cent-rounded per-piece).
 */
export function orderTotal(productName: string, size: number, qty: number): string {
  const r = calculatePatchPrice(productName, size, size, qty);
  if (r.error || !r.unitPrice) return "—";
  // Derive from the SAME cents perPc renders (toFixed), so shown-per-piece x qty
  // === shown-total exactly. Using Math.round(x*100) here instead would diverge
  // from toFixed at half-cent values (e.g. $1.045 -> perPc "$1.04" but total "$1,050").
  const perPiece = Number(r.unitPrice.toFixed(2));
  return `$${Math.round(perPiece * qty).toLocaleString("en-US")}`;
}
