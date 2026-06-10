/**
 * patchPricing.ts — Calculator-derived price tier helpers
 *
 * Single source of truth for static pages that need to render per-piece price tiers
 * for any patch type. Wraps `pricingCalculator.ts` (which the live calculator uses)
 * so static pages, schema generators, and AI-info clusters can render
 * the SAME numbers the customer sees in checkout.
 *
 * Goals:
 *   1. Per-quantity-tier price tables for every patch type (embroidered, woven, PVC,
 *      chenille, leather, printed, silicone, sequin, chenille TPU, chenille glitter,
 *      3D embroidered transfers).
 *   2. getPriceTierTable(patchType) returns { qty, size, pricePerPc }[].
 *   3. Order configurator does NOT import from here — it imports from pricingCalculator.ts
 *      directly. This module re-uses those tables so we never copy numbers.
 *   4. Static pages import getPriceTierTable() / getPriceRange() / getStartingPrice()
 *      from here instead of hardcoding strings.
 *
 * IMPORTANT: All prices include the global 1.10 PRICE_MULTIPLIER applied inside
 * pricingCalculator.ts. Do not apply it again here.
 */

import { calculatePatchPrice } from "@/lib/pricingCalculator";

// Canonical patch type IDs (also used as productName-compatible strings for the
// underlying calculator's keyword fallback resolver in pricingCalculator.ts).
export type PatchType =
  | "embroidered"
  | "woven"
  | "pvc"
  | "chenille"
  | "leather"
  | "printed"
  | "silicone"
  | "sequin"
  | "chenille-tpu"
  | "chenille-glitter"
  | "3d-embroidered-transfer";

// Map each canonical PatchType to the productName string that pricingCalculator
// already understands via its productPricingMap / keyword fallback. Keeping this
// here means static pages don't need to know the calculator's internal naming.
const PATCH_TYPE_TO_PRODUCT_NAME: Record<PatchType, string> = {
  "embroidered": "Custom Embroidered Patches",
  "woven": "Custom Woven Patches",
  "pvc": "Custom PVC Patches",
  "chenille": "Custom Chenille Patches",
  "leather": "Custom Leather Patches",
  "printed": "Custom Printed Patches",
  "silicone": "Custom Silicone Patches",
  "sequin": "Custom Sequin Patches",
  "chenille-tpu": "Custom Chenille TPU Patches",
  "chenille-glitter": "Custom Chenille Glitter Patches",
  "3d-embroidered-transfer": "Custom 3D Embroidered Transfer",
};

// Default quantity breaks rendered in the public tier table.
// Sized to match the qty breaks customers actually see across product pages.
const DEFAULT_QTY_BREAKS = [10, 25, 50, 100, 200, 500, 1000, 5000];

// Default sizes (1" through 5") used when callers don't specify their own.
const DEFAULT_SIZES = [2, 3, 5];

export interface PriceTierRow {
  qty: number;
  size: number; // longest-dimension in inches (also used as width=height for square reference)
  pricePerPc: number; // already includes the 1.10 PRICE_MULTIPLIER
}

/**
 * Resolve any PatchType id (or a calculator-compatible productName string) into
 * the productName string the underlying calculator expects.
 */
function resolveProductName(patchTypeOrProductName: PatchType | string): string {
  if (patchTypeOrProductName in PATCH_TYPE_TO_PRODUCT_NAME) {
    return PATCH_TYPE_TO_PRODUCT_NAME[patchTypeOrProductName as PatchType];
  }
  return patchTypeOrProductName;
}

/**
 * Get the per-quantity-tier price table for a given patch type.
 *
 * Returns one row per (size, qty) combination, sourced live from the calculator
 * so the static page can never drift out of sync with checkout pricing.
 *
 * @param patchType  canonical PatchType id (e.g. "embroidered") OR a productName
 *                   string the calculator already knows (e.g. "Custom Woven Patches")
 * @param sizes      sizes in inches to include (defaults to [2, 3, 5])
 * @param qtyBreaks  quantities to include (defaults to [10, 25, 50, 100, 200, 500, 1000, 5000])
 */
export function getPriceTierTable(
  patchType: PatchType | string,
  sizes: number[] = DEFAULT_SIZES,
  qtyBreaks: number[] = DEFAULT_QTY_BREAKS,
): PriceTierRow[] {
  const productName = resolveProductName(patchType);
  const rows: PriceTierRow[] = [];
  for (const size of sizes) {
    for (const qty of qtyBreaks) {
      const result = calculatePatchPrice(productName, size, size, qty);
      // Skip combinations the calculator refuses (e.g. qty below minQty).
      if (result.error || !result.unitPrice) continue;
      rows.push({
        qty,
        size,
        pricePerPc: Math.round(result.unitPrice * 100) / 100,
      });
    }
  }
  return rows;
}

/**
 * Get per-piece prices for a single size across all default qty breaks.
 * Convenience helper for narrow tables (e.g. "PVC at 3 inch").
 */
export function getPriceTierTableForSize(
  patchType: PatchType | string,
  size: number,
  qtyBreaks: number[] = DEFAULT_QTY_BREAKS,
): Array<{ qty: number; pricePerPc: number }> {
  return getPriceTierTable(patchType, [size], qtyBreaks).map((r) => ({
    qty: r.qty,
    pricePerPc: r.pricePerPc,
  }));
}

/**
 * Lowest per-piece price observable for a patch type across reasonable sizes
 * and the largest standard volume tier. Useful for "starting at $X.XX/pc" copy
 * and schema priceRange ceilings.
 */
export function getStartingPrice(
  patchType: PatchType | string,
  size: number = 3,
  qty: number = 1000,
): number | null {
  const productName = resolveProductName(patchType);
  const result = calculatePatchPrice(productName, size, size, qty);
  if (result.error || !result.unitPrice) return null;
  return Math.round(result.unitPrice * 100) / 100;
}

/**
 * Compute a [min, max] per-piece price band for a patch type, scanning the
 * default sizes and qty breaks. Used to populate Product schema priceRange
 * (e.g. "$0.95-$5.84") without hardcoding strings on each product page.
 */
export function getPriceRange(
  patchType: PatchType | string,
  sizes: number[] = DEFAULT_SIZES,
  qtyBreaks: number[] = DEFAULT_QTY_BREAKS,
): { min: number; max: number } | null {
  const rows = getPriceTierTable(patchType, sizes, qtyBreaks);
  if (!rows.length) return null;
  let min = rows[0].pricePerPc;
  let max = rows[0].pricePerPc;
  for (const r of rows) {
    if (r.pricePerPc < min) min = r.pricePerPc;
    if (r.pricePerPc > max) max = r.pricePerPc;
  }
  return { min, max };
}

/**
 * Format a price-range band as a `$X.XX-$Y.YY` string for schema priceRange.
 */
export function formatPriceRange(
  patchType: PatchType | string,
  sizes?: number[],
  qtyBreaks?: number[],
): string | null {
  const range = getPriceRange(patchType, sizes, qtyBreaks);
  if (!range) return null;
  return `$${range.min.toFixed(2)}-$${range.max.toFixed(2)}`;
}
