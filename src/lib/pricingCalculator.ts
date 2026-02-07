/**
 * PATCH PRICING CALCULATOR
 * Calculates accurate pricing based on patch type, size, and quantity
 */

// Chenille Pricing
const chenillePricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000],
  prices: {
    2:  [11.00, 6.00, 3.75, 3.50, 2.75, 2.25, 2.00],
    3:  [11.00, 6.00, 4.50, 4.00, 3.25, 2.50, 2.25],
    4:  [12.00, 6.50, 5.00, 4.50, 4.00, 3.00, 2.75],
    5:  [13.00, 7.50, 6.50, 6.00, 4.50, 3.50, 3.25],
    6:  [15.00, 10.00, 8.50, 7.50, 5.00, 4.50, 4.00],
    7:  [16.00, 12.00, 10.00, 8.00, 6.00, 5.50, 5.00],
    8:  [17.00, 15.00, 13.00, 10.00, 8.75, 7.00, 6.50],
    9:  [19.00, 17.00, 15.00, 12.00, 9.50, 8.00, 7.50],
    10: [20.00, 19.00, 16.00, 13.00, 10.50, 9.00, 8.50],
    11: [22.00, 20.00, 17.00, 15.00, 11.00, 9.50, 9.00],
    12: [26.00, 21.00, 19.00, 16.00, 11.50, 10.00, 9.50]
  },
  minSize: 2,
  maxSize: 12
};

// Embroidery Pricing
const embroideryPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000],
  prices: {
    2:  [11.50, 5.00, 2.80, 1.50, 0.80, 0.40, 0.10],
    3:  [12.00, 5.50, 3.30, 2.00, 1.30, 0.90, 0.40],
    4:  [12.50, 6.00, 3.80, 2.50, 1.80, 1.40, 0.90],
    5:  [13.00, 6.50, 4.50, 3.50, 2.50, 1.50, 1.25],
    6:  [14.00, 9.00, 7.00, 4.00, 3.00, 2.50, 2.00],
    7:  [15.00, 11.00, 8.00, 5.00, 4.00, 3.50, 3.00],
    8:  [16.00, 13.00, 10.00, 7.00, 5.00, 4.50, 4.00],
    9:  [18.00, 14.00, 11.00, 8.00, 6.00, 5.50, 5.00],
    10: [19.00, 16.00, 12.00, 9.00, 7.00, 6.50, 6.00],
    11: [21.00, 18.00, 13.00, 10.00, 8.00, 7.50, 7.00],
    12: [25.00, 20.00, 15.00, 11.00, 9.00, 8.50, 8.00]
  },
  minSize: 2,
  maxSize: 12
};

// PVC Pricing (max size based)
const pvcPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000],
  tiers: [
    { maxSize: 2, prices: [13.00, 6.00, 3.80, 2.80, 2.80, 1.90, 1.30] },
    { maxSize: 4, prices: [15.00, 7.00, 5.00, 3.50, 3.00, 1.40, 1.35] },
    { maxSize: 6, prices: [20.00, 8.00, 6.00, 5.00, 4.00, 2.30, 2.00] },
    { maxSize: 8, prices: [30.00, 10.00, 8.00, 6.50, 5.00, 4.00, 3.00] }
  ],
  minSize: 2,
  maxSize: 8
};

// Woven Pricing
const wovenPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 250, 500, 1000, 5000],
  prices: {
    2: [13.00, 6.40, 4.00, 3.25, 2.25, 2.20, 2.00, 1.50, 1.00],
    3: [13.50, 6.90, 4.50, 3.75, 2.75, 2.70, 2.50, 2.00, 1.50],
    4: [14.00, 7.40, 5.00, 4.25, 3.25, 3.20, 3.00, 2.50, 2.00],
    5: [14.50, 7.90, 5.50, 4.75, 3.75, 3.70, 3.50, 3.00, 2.50],
    6: [15.00, 9.00, 7.50, 4.00, 3.50, 3.50, 3.00, 2.50, 2.30],
    7: [16.00, 11.00, 9.00, 5.50, 5.00, 5.00, 4.50, 4.00, 3.50],
    8: [17.00, 13.00, 11.00, 7.50, 6.00, 6.00, 5.50, 5.00, 4.50]
  },
  minSize: 2,
  maxSize: 8
};

// Sublimated Pricing (same as embroidery for smaller sizes)
const sublimatedPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000],
  prices: {
    2:  [11.50, 5.00, 2.80, 1.50, 0.80, 0.40, 0.10],
    3:  [12.00, 5.50, 3.30, 2.00, 1.30, 0.90, 0.40],
    4:  [12.50, 6.00, 3.80, 2.50, 1.80, 1.40, 0.90],
    5:  [13.00, 6.50, 4.50, 3.50, 2.50, 1.50, 1.25],
    6:  [14.00, 8.50, 7.00, 3.50, 3.00, 2.50, 2.00],
    7:  [15.00, 10.00, 8.00, 4.50, 4.00, 3.50, 3.00],
    8:  [16.00, 12.00, 10.00, 6.50, 5.00, 4.50, 4.00]
  },
  minSize: 2,
  maxSize: 8
};

// 3D Embroidery Transfer Pricing
const threeDEmbroideryPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000],
  prices: {
    2:  [11.50, 5.00, 2.80, 1.50, 0.80, 0.40, 0.10],
    3:  [12.00, 5.50, 3.30, 2.00, 1.30, 0.90, 0.40],
    4:  [12.50, 6.00, 3.80, 2.50, 1.80, 1.40, 0.90],
    5:  [13.00, 6.50, 4.50, 3.50, 2.50, 1.50, 1.25],
    6:  [15.00, 10.00, 8.00, 5.00, 4.00, 3.50, 3.00],
    7:  [16.00, 12.00, 9.00, 6.00, 5.00, 4.50, 4.00],
    8:  [17.00, 14.00, 11.00, 8.00, 6.00, 5.50, 5.00],
    9:  [19.00, 15.00, 12.00, 9.00, 7.00, 6.50, 6.00],
    10: [20.00, 17.00, 13.00, 10.00, 8.00, 7.50, 7.00],
    11: [22.00, 19.00, 14.00, 11.00, 9.00, 8.50, 8.00],
    12: [26.00, 21.00, 16.00, 12.00, 10.00, 9.50, 9.00]
  },
  minSize: 2,
  maxSize: 12
};

// Leather Pricing (same as PVC - tier-based)
const leatherPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000],
  tiers: [
    { maxSize: 2, prices: [13.00, 6.00, 3.80, 2.80, 2.80, 1.90, 1.30] },
    { maxSize: 4, prices: [15.00, 7.00, 5.00, 3.50, 3.00, 1.40, 1.35] },
    { maxSize: 6, prices: [20.00, 8.00, 6.00, 5.00, 4.00, 2.30, 2.00] },
    { maxSize: 8, prices: [30.00, 10.00, 8.00, 6.50, 5.00, 4.00, 3.00] }
  ],
  minSize: 2,
  maxSize: 8
};

// Silicone Labels Pricing (same as PVC - tier-based)
const siliconePricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000],
  tiers: [
    { maxSize: 2, prices: [13.00, 6.00, 3.80, 2.80, 2.80, 1.90, 1.30] },
    { maxSize: 4, prices: [15.00, 7.00, 5.00, 3.50, 3.00, 1.40, 1.35] },
    { maxSize: 6, prices: [20.00, 8.00, 6.00, 5.00, 4.00, 2.30, 2.00] },
    { maxSize: 8, prices: [30.00, 10.00, 8.00, 6.50, 5.00, 4.00, 3.00] }
  ],
  minSize: 2,
  maxSize: 8
};

// Sequin Pricing (3D Embroidery Transfer + $1)
const sequinPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000],
  prices: {
    2:  [12.50, 6.00, 3.80, 2.50, 1.80, 1.40, 1.10],
    3:  [13.00, 6.50, 4.30, 3.00, 2.30, 1.90, 1.40],
    4:  [13.50, 7.00, 4.80, 3.50, 2.80, 2.40, 1.90],
    5:  [14.00, 7.50, 5.50, 4.50, 3.50, 2.50, 2.25],
    6:  [16.00, 11.00, 9.00, 6.00, 5.00, 4.50, 4.00],
    7:  [17.00, 13.00, 10.00, 7.00, 6.00, 5.50, 5.00],
    8:  [18.00, 15.00, 12.00, 9.00, 7.00, 6.50, 6.00],
    9:  [20.00, 16.00, 13.00, 10.00, 8.00, 7.50, 7.00],
    10: [21.00, 18.00, 14.00, 11.00, 9.00, 8.50, 8.00],
    11: [23.00, 20.00, 15.00, 12.00, 10.00, 9.50, 9.00],
    12: [27.00, 22.00, 17.00, 13.00, 11.00, 10.50, 10.00]
  },
  minSize: 2,
  maxSize: 12
};

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

  // Handle PVC special case (max size based)
  if (pricing.tiers) {
    return calculatePVCPrice(avgSize, quantity, pricing);
  }

  // Bound size to available range
  const lookupSize = Math.max(pricing.minSize, Math.min(pricing.maxSize, avgSize));

  // Check minimum quantity
  if (quantity < pricing.qtyBreaks[0]) {
    return {
      unitPrice: 0,
      totalPrice: 0,
      patchSize: lookupSize,
      error: `Minimum order is ${pricing.qtyBreaks[0]} patches.`
    };
  }

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
 * Calculate PVC price (uses max size tiers)
 */
function calculatePVCPrice(size: number, quantity: number, pricing: any): PriceResult {
  // Find the appropriate tier
  let tier = pricing.tiers[pricing.tiers.length - 1]; // Default to largest
  for (const t of pricing.tiers) {
    if (size <= t.maxSize) {
      tier = t;
      break;
    }
  }

  // Check minimum quantity
  if (quantity < pricing.qtyBreaks[0]) {
    return {
      unitPrice: 0,
      totalPrice: 0,
      patchSize: size,
      error: `Minimum order is ${pricing.qtyBreaks[0]} patches.`
    };
  }

  // Find quantity tier
  let tierIndex = 0;
  for (let i = 0; i < pricing.qtyBreaks.length; i++) {
    if (quantity >= pricing.qtyBreaks[i]) {
      tierIndex = i;
    }
  }

  const unitPrice = tier.prices[tierIndex];
  const totalPrice = unitPrice * quantity;

  return {
    unitPrice,
    totalPrice,
    patchSize: size
  };
}

/**
 * Get all available product types with pricing
 */
export function getAvailableProducts(): string[] {
  return Object.keys(productPricingMap);
}
