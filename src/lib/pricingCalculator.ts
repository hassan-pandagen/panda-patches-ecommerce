/**
 * PATCH PRICING CALCULATOR - Updated with new pricing
 * NOW STARTING FROM 1 PATCH!
 */

// Embroidery Pricing - Under 3 inches
const embroideryPricing = {
  qtyBreaks: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 5000],
  prices: {
    // Under 3 inches
    2:  [80.00, 20.00, 12.00, 5.60, 3.60, 2.30, 1.60, 1.40, 1.00, 0.70],
    3:  [80.00, 20.00, 12.00, 5.60, 3.60, 2.30, 1.60, 1.40, 1.00, 0.70],
    // Scales up for larger sizes
    4:  [85.00, 21.00, 13.00, 6.00, 4.00, 2.50, 1.80, 1.50, 1.10, 0.80],
    5:  [90.00, 22.00, 14.00, 6.50, 4.50, 3.00, 2.00, 1.70, 1.25, 0.90],
    6:  [100.00, 24.00, 15.00, 7.50, 5.50, 3.50, 2.50, 2.00, 1.50, 1.00],
    7:  [105.00, 25.00, 16.00, 8.00, 6.00, 4.00, 2.80, 2.20, 1.70, 1.20],
    8:  [110.00, 26.00, 17.00, 9.00, 7.00, 5.00, 3.50, 2.80, 2.00, 1.50],
    9:  [115.00, 28.00, 18.00, 10.00, 8.00, 6.00, 4.00, 3.20, 2.50, 1.80],
    10: [120.00, 30.00, 20.00, 12.00, 10.00, 7.00, 5.00, 4.00, 3.00, 2.00],
    11: [125.00, 32.00, 22.00, 13.00, 11.00, 8.00, 6.00, 4.50, 3.50, 2.50],
    12: [130.00, 35.00, 25.00, 15.00, 12.00, 10.00, 7.00, 5.50, 4.00, 3.00],
    13: [135.00, 37.00, 27.00, 16.00, 13.00, 11.00, 7.50, 6.00, 4.50, 3.20],
    14: [140.00, 40.00, 30.00, 18.00, 15.00, 12.00, 8.00, 6.50, 5.00, 3.50]
  },
  minSize: 2,
  maxSize: 14
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

// Product name to pricing table mapping
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
  // Get pricing table for this product
  const pricingTable = productPricingMap[productName];

  // If no pricing table found, use embroidery as default
  const pricing = pricingTable || embroideryPricing;

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
  const pricing = productPricingMap[productName] || embroideryPricing;
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
