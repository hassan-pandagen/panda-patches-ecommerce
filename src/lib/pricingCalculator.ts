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

// Chenille/TPU/Glitter Pricing - Size-based
const chenillePricing = {
  qtyBreaks: [1, 5, 10, 25, 50, 100, 250, 500],
  prices: {
    // Under 6 inches - standard embroidery pricing
    2:  [80.00, 20.00, 12.00, 5.60, 3.60, 2.30, 1.60, 1.40],
    3:  [80.00, 20.00, 12.00, 5.60, 3.60, 2.30, 1.60, 1.40],
    4:  [85.00, 21.00, 13.00, 6.00, 4.00, 2.50, 1.80, 1.50],
    5:  [90.00, 22.00, 14.00, 6.50, 4.50, 3.00, 2.00, 1.70],
    // 6-9 inches
    6:  [100.00, 24.00, 15.00, 7.50, 5.50, 3.50, 2.50, 2.00],
    7:  [105.00, 25.00, 16.00, 8.00, 6.00, 4.00, 2.80, 2.20],
    8:  [110.00, 26.00, 17.00, 9.00, 7.00, 5.00, 3.50, 2.80],
    9:  [115.00, 28.00, 18.00, 10.00, 8.00, 6.00, 4.00, 3.20],
    // 9-12 inches
    10: [120.00, 30.00, 20.00, 12.00, 10.00, 7.00, 5.00, 4.00],
    11: [125.00, 32.00, 22.00, 13.00, 11.00, 8.00, 6.00, 4.50],
    12: [130.00, 35.00, 25.00, 15.00, 12.00, 10.00, 7.00, 5.50],
    // 12-14 inches
    13: [135.00, 37.00, 27.00, 16.00, 13.00, 11.00, 7.50, 6.00],
    14: [140.00, 40.00, 30.00, 18.00, 15.00, 12.00, 8.00, 6.50]
  },
  minSize: 2,
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

// PVC Pricing
const pvcPricing = {
  qtyBreaks: [10, 25, 50, 100, 250, 500, 1000, 5000],
  prices: {
    // Up to 3 inches
    2:  [13.00, 6.80, 4.60, 3.00, 2.80, 2.00, 1.50, 1.00],
    3:  [13.00, 6.80, 4.60, 3.00, 2.80, 2.00, 1.50, 1.00],
    // Scales up
    4:  [15.00, 7.50, 5.20, 3.50, 3.20, 2.30, 1.70, 1.20],
    5:  [17.00, 8.50, 6.00, 4.00, 3.60, 2.70, 2.00, 1.40],
    6:  [20.00, 10.00, 7.00, 5.00, 4.20, 3.30, 2.50, 1.70],
    7:  [23.00, 12.00, 8.50, 6.00, 5.00, 4.00, 3.00, 2.00],
    8:  [26.00, 14.00, 10.00, 7.00, 6.00, 4.80, 3.50, 2.50],
    9:  [30.00, 16.00, 12.00, 8.50, 7.00, 5.50, 4.20, 3.00],
    10: [35.00, 18.00, 14.00, 10.00, 8.50, 6.50, 5.00, 3.50],
    11: [40.00, 20.00, 16.00, 12.00, 10.00, 7.50, 6.00, 4.00],
    12: [45.00, 23.00, 18.00, 14.00, 12.00, 9.00, 7.00, 5.00]
  },
  minSize: 2,
  maxSize: 12
};

// Woven Pricing - Same as PVC
const wovenPricing = pvcPricing;

// Leather Pricing - Same as PVC
const leatherPricing = pvcPricing;

// Silicone Labels Pricing - Same as PVC
const siliconePricing = pvcPricing;

// Sublimated/Printed Pricing - Same as Embroidery
const sublimatedPricing = embroideryPricing;

// Sequin Pricing - Same as Embroidery
const sequinPricing = embroideryPricing;

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
