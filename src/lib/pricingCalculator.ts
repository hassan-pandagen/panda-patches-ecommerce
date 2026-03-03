/**
 * PATCH PRICING CALCULATOR - Updated with new pricing
 * NOW STARTING FROM 1 PATCH!
 */

// Embroidery Pricing
// Qty breaks: 10, 25, 50, 100, 200, 500, 1000, 2500, 5000
// Size = Math.ceil((width + height) / 2)
// No 250-break — 201-499 patches all use the 200-tier price, so totals always increase correctly.
const embroideryPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000, 2500, 5000],
  prices: {
    //         10      25      50     100    200    500   1000   2500   5000
    1:  [11.88,  5.35,  3.56,  2.19,  1.72,  0.86,  0.75,  0.71,  0.71],
    2:  [11.88,  5.35,  3.56,  2.19,  1.72,  0.86,  0.75,  0.71,  0.71],
    3:  [11.88,  5.35,  3.56,  2.32,  1.79,  0.96,  0.86,  0.82,  0.82],
    4:  [11.88,  5.94,  3.86,  2.38,  1.90,  1.18,  0.96,  0.91,  0.91],
    5:  [14.25,  7.13,  4.75,  3.56,  2.38,  1.39,  1.34,  1.27,  1.27],
    6:  [16.63, 10.69,  8.31,  4.75,  3.56,  2.67,  2.14,  2.03,  2.03],
    7:  [17.81, 13.06,  9.50,  5.94,  4.75,  3.74,  3.21,  3.05,  3.05],
    8:  [17.10, 13.90, 10.69,  7.49,  5.94,  4.81,  4.28,  4.07,  4.07],
    9:  [19.24, 14.96, 11.76,  8.55,  7.13,  5.88,  5.35,  5.08,  5.08],
    10: [20.31, 17.10, 12.83,  9.62,  8.31,  6.94,  6.41,  6.09,  6.09],
    11: [22.45, 19.24, 13.90, 10.69,  9.50,  8.02,  7.49,  7.11,  7.11],
    12: [26.72, 21.38, 16.04, 11.76, 10.69,  9.08,  8.55,  8.12,  8.12]
  },
  minSize: 1,
  maxSize: 12
};

// Chenille/TPU/Glitter Pricing - competitor-benchmarked, 5% below market
// Qty breaks 1-9: totals graduate smoothly from $80 (1pc flat) toward the 10pc total for each size.
// Formula: total_q = 80 + (total_10 - 80) * (q - 1) / 9, unit = total_q / q
// Qty breaks: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 5000
const chenillePricing = {
  qtyBreaks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //          1      2      3      4      5      6      7      8      9     10      25      50     100    200    500   1000   5000
    1:  [80.00, 42.16, 29.54, 23.23, 19.45, 16.93, 15.12, 13.77, 12.72, 11.88,  5.94,  3.27,  2.97,  2.08,  1.48,  1.19,  1.19],
    2:  [80.00, 42.16, 29.54, 23.23, 19.45, 16.93, 15.12, 13.77, 12.72, 11.88,  5.94,  3.27,  2.97,  2.08,  1.48,  1.19,  1.19],
    3:  [80.00, 42.16, 29.54, 23.23, 19.45, 16.93, 15.12, 13.77, 12.72, 11.88,  5.94,  4.16,  3.56,  2.67,  1.79,  1.48,  1.48],
    4:  [80.00, 42.81, 30.41, 24.22, 20.50, 18.02, 16.25, 14.92, 13.89, 13.06,  6.54,  4.75,  4.16,  3.56,  2.38,  2.08,  2.08],
    5:  [80.00, 43.47, 31.30, 25.21, 21.56, 19.12, 17.38, 16.08, 15.06, 14.25,  7.72,  6.54,  5.94,  4.16,  2.97,  2.67,  2.67],
    6:  [80.00, 44.80, 33.06, 27.19, 23.67, 21.32, 19.65, 18.39, 17.41, 16.63, 10.69,  8.91,  7.13,  4.75,  4.16,  3.56,  3.56],
    7:  [80.00, 45.45, 33.93, 28.18, 24.72, 22.42, 20.77, 19.54, 18.58, 17.81, 13.06, 10.69,  8.31,  5.94,  5.35,  4.75,  4.75],
    8:  [80.00, 46.11, 34.81, 29.17, 25.78, 23.52, 21.90, 20.69, 19.75, 19.00, 16.63, 14.25, 10.69,  9.21,  7.13,  6.54,  6.54],
    9:  [80.00, 47.44, 36.58, 31.15, 27.89, 25.72, 24.17, 23.01, 22.10, 21.38, 19.00, 16.63, 13.06, 10.10,  8.31,  7.72,  7.72],
    10: [80.00, 48.09, 37.45, 32.13, 28.94, 26.82, 25.30, 24.16, 23.27, 22.56, 21.38, 17.81, 14.25, 11.29,  9.50,  8.91,  8.91],
    11: [80.00, 49.41, 39.21, 34.12, 31.06, 29.02, 27.56, 26.47, 25.62, 24.94, 22.56, 19.00, 16.63, 11.88, 10.10,  9.50,  9.50],
    12: [80.00, 52.05, 42.73, 38.08, 35.28, 33.42, 32.09, 31.09, 30.31, 29.69, 23.75, 21.38, 17.81, 12.47, 10.69, 10.10, 10.10],
    13: [80.00, 54.03, 45.37, 41.04, 38.44, 36.71, 35.48, 34.55, 33.83, 33.25, 26.60, 23.95, 19.95, 13.97, 11.97, 11.31, 11.31],
    14: [80.00, 56.25, 48.33, 44.38, 42.00, 40.42, 39.29, 38.44, 37.78, 37.25, 29.79, 26.82, 22.34, 15.65, 13.41, 12.67, 12.67],
  },
  minSize: 1,
  maxSize: 14
};

// 3D Embroidery Transfer Pricing
const threeDEmbroideryPricing = {
  qtyBreaks: [10, 25, 50, 100, 250, 500, 1000, 5000],
  prices: {
    // Up to 3 inches
    2:  [13.00, 6.00, 4.00, 2.50, 1.80, 1.60, 1.20, 0.80],
    3:  [13.00, 6.00, 4.00, 2.50, 1.80, 1.60, 1.20, 0.80],
    // Scales up
    4:  [14.00, 6.50, 4.50, 2.80, 2.00, 1.80, 1.35, 0.90],
    5:  [15.00, 7.00, 5.00, 3.50, 2.50, 2.00, 1.50, 1.00],
    6:  [16.00, 8.00, 6.00, 4.00, 3.00, 2.50, 2.00, 1.30],
    7:  [18.00, 10.00, 7.00, 5.00, 3.50, 3.00, 2.50, 1.70],
    8:  [20.00, 12.00, 9.00, 6.00, 4.50, 3.80, 3.00, 2.00],
    9:  [22.00, 14.00, 11.00, 7.00, 5.50, 4.50, 3.50, 2.50],
    10: [25.00, 16.00, 13.00, 9.00, 6.50, 5.50, 4.50, 3.00],
    11: [28.00, 18.00, 14.00, 10.00, 7.50, 6.50, 5.00, 3.50],
    12: [32.00, 20.00, 16.00, 12.00, 9.00, 8.00, 6.00, 4.00]
  },
  minSize: 2,
  maxSize: 12
};

// PVC Pricing — updated, max 8 inches, min 1 inch
// Qty breaks: 10, 25, 50, 100, 200, 500, 1000, 5000
// Size 1 uses same price as size 2 (1.0–1.9 inch inputs)
const pvcPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //         10      25      50     100    200    500    1000   5000
    1:  [13.75,  7.50,  5.00,  3.44,  2.50,  1.88,  1.56,  1.56],
    2:  [13.75,  7.50,  5.00,  3.44,  2.50,  1.88,  1.56,  1.56],
    3:  [16.25,  8.75,  6.25,  4.38,  3.75,  3.13,  2.81,  2.81],
    4:  [18.75, 10.00,  7.50,  6.25,  5.00,  4.38,  3.75,  3.75],
    5:  [22.50, 15.00,  8.13,  7.30,  6.15,  5.00,  4.50,  4.50],
    6:  [23.75, 16.25,  9.00,  7.75,  6.54,  6.03,  4.80,  4.80],
    7:  [28.75, 17.50, 11.25,  9.00,  8.31,  7.40,  6.15,  6.15],
    8:  [31.25, 22.50, 15.00, 10.13,  9.00,  7.95,  6.25,  6.25],
  },
  minSize: 1,
  maxSize: 8
};

// Woven Pricing - competitor-benchmarked, 5% below market
// Qty breaks: 10, 25, 50, 100, 200, 500, 1000, 5000 | Sizes 1-8 (sizes 7+8 share same tier)
const wovenPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //         10      25      50     100    200    500   1000   5000
    1:  [11.88,  5.35,  4.75,  2.76,  2.59,  1.72,  1.57,  1.57],
    2:  [13.06,  5.35,  4.75,  3.56,  3.27,  2.67,  2.08,  2.08],
    3:  [14.25,  7.72,  5.13,  3.80,  3.69,  2.97,  2.38,  2.38],
    4:  [16.63,  8.31,  5.35,  4.16,  3.86,  3.27,  2.67,  2.67],
    5:  [19.00,  9.74,  6.18,  4.87,  4.28,  3.80,  3.09,  3.09],
    6:  [21.38, 10.15,  6.83,  5.75,  4.66,  4.28,  3.23,  3.23],
    7:  [23.75, 10.50,  7.27,  6.21,  5.28,  4.87,  3.80,  3.80],
    8:  [23.75, 10.50,  7.27,  6.21,  5.28,  4.87,  3.80,  3.80],
  },
  minSize: 1,
  maxSize: 8
};

// Leather Pricing - competitor-benchmarked, 5% below market
// Qty breaks: 10, 25, 50, 100, 200, 500, 1000, 5000 | Sizes 1-8 (sizes 6/7/8 share same tier)
const leatherPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //         10      25      50     100    200    500   1000   5000
    1:  [11.88,  5.94,  4.57,  3.56,  2.74,  1.93,  1.43,  1.43],
    2:  [12.47,  6.23,  4.66,  3.56,  2.97,  2.19,  1.57,  1.57],
    3:  [13.66,  6.83,  5.03,  4.16,  3.56,  2.38,  1.66,  1.66],
    4:  [14.25,  7.13,  5.35,  4.57,  3.94,  2.67,  2.38,  2.38],
    5:  [16.63,  8.10,  5.75,  4.87,  4.16,  2.97,  2.65,  2.65],
    6:  [21.38, 10.24,  6.54,  5.94,  3.56,  3.56,  2.97,  2.97],
    7:  [21.38, 10.24,  6.54,  5.94,  3.56,  3.56,  2.97,  2.97],
    8:  [21.38, 10.24,  6.54,  5.94,  3.56,  3.56,  2.97,  2.97],
  },
  minSize: 1,
  maxSize: 8
};

// Silicone / Woven Labels Pricing - competitor-benchmarked, 5% below market
// Qty breaks: 10, 25, 50, 100, 200, 500, 1000, 5000 | Sizes 1-4
const siliconePricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //         10      25      50     100    200    500   1000   5000
    1:  [11.88,  5.23,  2.97,  1.72,  1.19,  0.96,  0.86,  0.86],
    2:  [13.06,  5.51,  3.23,  1.93,  1.57,  1.07,  1.05,  1.05],
    3:  [14.25,  7.42,  4.42,  3.14,  2.65,  1.48,  1.19,  1.19],
    4:  [16.63,  8.31,  4.75,  3.56,  3.33,  1.72,  1.46,  1.46],
  },
  minSize: 1,
  maxSize: 4
};

// Sublimated/Printed Pricing - competitor-benchmarked, 5% below market
// Qty breaks: 10, 25, 50, 100, 200, 500, 1000, 5000
const sublimatedPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //         10      25      50     100    200    500   1000   5000
    1:  [11.88,  5.04,  3.86,  2.08,  1.43,  0.89,  0.71,  0.71],
    2:  [11.88,  5.04,  3.86,  2.08,  1.43,  0.89,  0.71,  0.71],
    3:  [11.88,  5.35,  4.46,  2.67,  1.79,  1.07,  0.95,  0.95],
    4:  [11.88,  5.64,  5.35,  3.27,  2.08,  1.19,  1.07,  1.07],
    5:  [11.88,  7.13,  5.94,  3.86,  2.97,  1.79,  1.48,  1.48],
    6:  [14.25, 10.69,  8.91,  5.94,  4.75,  3.56,  2.67,  2.67],
    7:  [17.81, 14.25, 10.69,  8.91,  6.54,  5.35,  4.75,  4.75],
    8:  [20.19, 15.44, 13.06, 10.69,  8.02,  7.13,  5.94,  5.94],
    9:  [21.38, 17.81, 15.44, 14.25, 10.69,  8.91,  7.13,  7.13],
    10: [24.94, 21.38, 17.81, 15.44, 13.06, 10.69,  8.91,  8.91],
    11: [27.31, 23.75, 21.38, 17.81, 15.44, 13.06, 10.69, 10.69],
    12: [30.88, 27.31, 23.75, 21.38, 17.81, 15.44, 13.06, 13.06],
  },
  minSize: 1,
  maxSize: 12
};

// Sequin Pricing - Same as Sublimated
const sequinPricing = sublimatedPricing;

// Product name to pricing table mapping (exact match first)
const productPricingMap: { [key: string]: any } = {
  'Custom Chenille Patches': chenillePricing,
  'Custom Embroidered Patches': embroideryPricing,
  'Custom Embroidery Patches': embroideryPricing,
  'Custom PVC Patches': pvcPricing,
  'Custom Woven Patches': wovenPricing,
  'Custom Sublimation Patches': sublimatedPricing,
  'Custom Sublimated Patches': sublimatedPricing,
  'Custom Printed Patches': sublimatedPricing,
  'Custom 3D Embroidered Transfer': threeDEmbroideryPricing,
  'Custom 3D Embroidery Transfer': threeDEmbroideryPricing,
  'Custom 3D Embroidered Transfers': threeDEmbroideryPricing,
  'Custom Leather Patches': leatherPricing,
  'Custom Silicone Labels': siliconePricing,
  'Custom Silicone Patches': siliconePricing,
  'Custom Sequin Patches': sequinPricing,
};

// Keyword-based fallback: handles Sanity titles like "Custom Chenille Patches No Minimum"
function getPricingTable(productName: string): any {
  // 1. Try exact match first
  if (productPricingMap[productName]) return productPricingMap[productName];

  // 2. Keyword match (case-insensitive) — ordered most-specific first
  const name = productName.toLowerCase();
  if (name.includes('chenille'))                          return chenillePricing;
  if (name.includes('3d embroid') || name.includes('3d embroider')) return threeDEmbroideryPricing;
  if (name.includes('pvc'))                               return pvcPricing;
  if (name.includes('woven'))                             return wovenPricing;
  if (name.includes('leather'))                           return leatherPricing;
  if (name.includes('silicone'))                          return siliconePricing;
  if (name.includes('sublim') || name.includes('print')) return sublimatedPricing;
  if (name.includes('sequin'))                            return sequinPricing;
  if (name.includes('embroid'))                           return embroideryPricing;

  // 3. Default to embroidery
  return embroideryPricing;
}

interface PriceResult {
  unitPrice: number;
  totalPrice: number;
  patchSize: number;
  error?: string;
}

/**
 * Calculate patch price based on product type, dimensions, and quantity
 */
export function calculatePatchPrice(
  productName: string,
  width: number,
  height: number,
  quantity: number
): PriceResult {
  const pricing = getPricingTable(productName);

  // Calculate average size (round up)
  const avgSize = Math.ceil((width + height) / 2);

  // Bound size to available range
  const lookupSize = Math.max(pricing.minSize, Math.min(pricing.maxSize, avgSize));

  // NO MINIMUM QUANTITY CHECK - Allow ordering from 1 patch

  // Find quantity tier
  let tierIndex = 0;
  for (let i = 0; i < pricing.qtyBreaks.length; i++) {
    if (quantity >= pricing.qtyBreaks[i]) {
      tierIndex = i;
    }
  }

  // Get unit price
  const unitPrice = pricing.prices[lookupSize][tierIndex];
  const totalPrice = unitPrice * quantity;

  return {
    unitPrice,
    totalPrice,
    patchSize: lookupSize
  };
}

/**
 * Get upsell tiers showing savings at higher quantities
 */
export interface UpsellTier {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  savingsPercent: number;
}

export function getUpsellTiers(
  productName: string,
  width: number,
  height: number,
  currentQuantity: number
): UpsellTier[] {
  const pricing = getPricingTable(productName);
  const avgSize = Math.ceil((width + height) / 2);
  const lookupSize = Math.max(pricing.minSize, Math.min(pricing.maxSize, avgSize));

  // Find current tier index
  let currentTierIndex = -1;
  for (let i = 0; i < pricing.qtyBreaks.length; i++) {
    if (currentQuantity >= pricing.qtyBreaks[i]) {
      currentTierIndex = i;
    }
  }

  if (currentTierIndex < 0) return [];

  const currentUnitPrice = pricing.prices[lookupSize][currentTierIndex];

  // Get next 2 tiers
  const upsells: UpsellTier[] = [];
  for (let i = currentTierIndex + 1; i < pricing.qtyBreaks.length && upsells.length < 2; i++) {
    const nextQty = pricing.qtyBreaks[i];
    const nextUnitPrice = pricing.prices[lookupSize][i];
    const savingsPercent = Math.round(((currentUnitPrice - nextUnitPrice) / currentUnitPrice) * 100);

    if (savingsPercent > 0) {
      upsells.push({
        quantity: nextQty,
        unitPrice: nextUnitPrice,
        totalPrice: nextQty * nextUnitPrice,
        savingsPercent,
      });
    }
  }

  return upsells;
}
