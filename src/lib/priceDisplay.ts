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

/** Live order total as "$X,XXX" (unit price x qty), same engine/basis as perPc. */
export function orderTotal(productName: string, size: number, qty: number): string {
  const r = calculatePatchPrice(productName, size, size, qty);
  if (r.error || !r.unitPrice) return "—";
  return `$${Math.round(r.unitPrice * qty).toLocaleString("en-US")}`;
}
