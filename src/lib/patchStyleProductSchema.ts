// Product schema data for patchStyle pages
// Used by src/app/[slug]/page.tsx to inject Product schema for all patchStyle pages

interface ProductSchemaData {
  name: string;
  description: string;
  url: string;
  lowPrice: string;
  highPrice: string;
  offerCount: string;
  offers: Array<{
    name: string;
    price: string;
  }>;
}

// Specific overrides for key patchStyle slugs
const specificSchemas: Record<string, ProductSchemaData> = {
  "patches-for-hats": {
    name: "Custom Patches for Hats",
    description: "Custom hat patches for snapbacks, trucker hats, fitted caps, dad hats, and beanies. Available in embroidered, woven, leather, and PVC. Low minimums, mockup in 12-24 hours.",
    url: "https://www.pandapatches.com/patches-for-hats",
    lowPrice: "0.71",
    highPrice: "6.80",
    offerCount: "4",
    offers: [
      { name: "Embroidered Hat Patches, 50 pieces", price: "180.00" },
      { name: "Woven Hat Patches, 50 pieces", price: "220.00" },
      { name: "Leather Hat Patches, 50 pieces", price: "220.00" },
      { name: "PVC Hat Patches, 50 pieces", price: "230.00" },
    ],
  },
  "custom-jacket-patches": {
    name: "Custom Jacket Patches",
    description: "Custom patches for jackets including biker vests, varsity jackets, denim jackets, and leather. Embroidered, woven, and chenille options. Low minimums, free design services.",
    url: "https://www.pandapatches.com/custom-jacket-patches",
    lowPrice: "0.71",
    highPrice: "6.80",
    offerCount: "3",
    offers: [
      { name: "Embroidered Jacket Patches, 50 pieces", price: "180.00" },
      { name: "Woven Jacket Patches, 50 pieces", price: "220.00" },
      { name: "Chenille Jacket Patches, 25 pieces", price: "230.00" },
    ],
  },
  "motorcycle-patches": {
    name: "Custom Motorcycle Patches",
    description: "Custom motorcycle club patches, MC back patches, and biker vest patches. Embroidered and woven options. Durable, bold designs for clubs and solo riders.",
    url: "https://www.pandapatches.com/motorcycle-patches",
    lowPrice: "0.71",
    highPrice: "6.80",
    offerCount: "3",
    offers: [
      { name: "Embroidered MC Patches, 50 pieces", price: "180.00" },
      { name: "Woven MC Patches, 50 pieces", price: "220.00" },
      { name: "Embroidered MC Patches, 100 pieces", price: "240.00" },
    ],
  },
  "custom-velcro-patches": {
    name: "Custom Velcro Patches",
    description: "Custom Velcro patches with hook and loop backing. Removable and reusable, ideal for tactical vests, uniforms, backpacks, and jackets. Embroidered and PVC options.",
    url: "https://www.pandapatches.com/custom-velcro-patches",
    lowPrice: "1.01",
    highPrice: "7.10",
    offerCount: "3",
    offers: [
      { name: "Embroidered Velcro Patches, 50 pieces", price: "210.00" },
      { name: "PVC Velcro Patches, 50 pieces", price: "260.00" },
      { name: "Embroidered Velcro Patches, 100 pieces", price: "270.00" },
    ],
  },
  "custom-tactical-patches": {
    name: "Custom Tactical Patches",
    description: "Custom tactical patches for vests, uniforms, and gear. Velcro-backed, PVC, and embroidered options. Built for military, law enforcement, and outdoor use.",
    url: "https://www.pandapatches.com/custom-tactical-patches",
    lowPrice: "1.01",
    highPrice: "7.10",
    offerCount: "3",
    offers: [
      { name: "Embroidered Tactical Patches, 50 pieces", price: "210.00" },
      { name: "PVC Tactical Patches, 50 pieces", price: "260.00" },
      { name: "Embroidered Tactical Patches, 100 pieces", price: "270.00" },
    ],
  },
  "custom-morale-patches": {
    name: "Custom Morale Patches",
    description: "Custom morale patches for military units, teams, and organizations. Embroidered and PVC options with Velcro backing. Bold designs, durable construction.",
    url: "https://www.pandapatches.com/custom-morale-patches",
    lowPrice: "1.01",
    highPrice: "7.10",
    offerCount: "3",
    offers: [
      { name: "Embroidered Morale Patches, 50 pieces", price: "210.00" },
      { name: "PVC Morale Patches, 50 pieces", price: "260.00" },
      { name: "Embroidered Morale Patches, 100 pieces", price: "270.00" },
    ],
  },
  "custom-law-enforcement-patches": {
    name: "Custom Law Enforcement Patches",
    description: "Custom law enforcement and tactical patches for uniforms, vests, and gear. Embroidered, woven, and PVC. Precision crafted for professional use.",
    url: "https://www.pandapatches.com/custom-law-enforcement-patches",
    lowPrice: "0.71",
    highPrice: "6.80",
    offerCount: "3",
    offers: [
      { name: "Embroidered Law Enforcement Patches, 50 pieces", price: "180.00" },
      { name: "Woven Law Enforcement Patches, 50 pieces", price: "220.00" },
      { name: "PVC Law Enforcement Patches, 50 pieces", price: "230.00" },
    ],
  },
  "custom-logo-patches": {
    name: "Custom Logo Patches",
    description: "Custom logo patches for apparel, bags, and accessories. Embroidered, woven, PVC, and leather options. Perfect for brand promotion, uniforms, and merchandise.",
    url: "https://www.pandapatches.com/custom-logo-patches",
    lowPrice: "0.71",
    highPrice: "6.80",
    offerCount: "4",
    offers: [
      { name: "Embroidered Logo Patches, 50 pieces", price: "180.00" },
      { name: "Woven Logo Patches, 50 pieces", price: "220.00" },
      { name: "PVC Logo Patches, 50 pieces", price: "230.00" },
      { name: "Leather Logo Patches, 50 pieces", price: "220.00" },
    ],
  },
  "custom-name-patches": {
    name: "Custom Name Patches",
    description: "Custom name patches for uniforms, teams, and personal use. Embroidered and woven options in various shapes, colors, and sizes. Low minimums, fast turnaround.",
    url: "https://www.pandapatches.com/custom-name-patches",
    lowPrice: "0.71",
    highPrice: "4.40",
    offerCount: "3",
    offers: [
      { name: "Embroidered Name Patches, 50 pieces", price: "180.00" },
      { name: "Woven Name Patches, 50 pieces", price: "220.00" },
      { name: "Embroidered Name Patches, 100 pieces", price: "240.00" },
    ],
  },
  "custom-anime-patches": {
    name: "Custom Anime Patches",
    description: "Custom anime patches featuring your favorite characters and series. Embroidered with fine detail. Perfect for jackets, bags, and apparel.",
    url: "https://www.pandapatches.com/custom-anime-patches",
    lowPrice: "0.71",
    highPrice: "4.40",
    offerCount: "3",
    offers: [
      { name: "Embroidered Anime Patches, 50 pieces", price: "180.00" },
      { name: "Embroidered Anime Patches, 100 pieces", price: "240.00" },
      { name: "Woven Anime Patches, 50 pieces", price: "220.00" },
    ],
  },
  "custom-soccer-patches": {
    name: "Custom Soccer Patches",
    description: "Custom soccer patches for teams, clubs, and leagues. Embroidered and woven, built to last through tough play. Show team pride with bold, vibrant designs.",
    url: "https://www.pandapatches.com/custom-soccer-patches",
    lowPrice: "0.71",
    highPrice: "4.40",
    offerCount: "3",
    offers: [
      { name: "Embroidered Soccer Patches, 50 pieces", price: "180.00" },
      { name: "Woven Soccer Patches, 50 pieces", price: "220.00" },
      { name: "Embroidered Soccer Patches, 100 pieces", price: "240.00" },
    ],
  },
  "custom-hockey-patches": {
    name: "Custom Hockey Patches",
    description: "Custom hockey patches for teams, leagues, and fans. Embroidered and woven, durable and vibrant. Perfect for jerseys, jackets, and gear bags.",
    url: "https://www.pandapatches.com/custom-hockey-patches",
    lowPrice: "0.71",
    highPrice: "4.40",
    offerCount: "3",
    offers: [
      { name: "Embroidered Hockey Patches, 50 pieces", price: "180.00" },
      { name: "Woven Hockey Patches, 50 pieces", price: "220.00" },
      { name: "Embroidered Hockey Patches, 100 pieces", price: "240.00" },
    ],
  },
  "custom-baseball-patches": {
    name: "Custom Baseball Patches",
    description: "Custom baseball patches for teams, clubs, and fans. Embroidered and woven in team colors. Perfect for jerseys, hats, and jackets.",
    url: "https://www.pandapatches.com/custom-baseball-patches",
    lowPrice: "0.71",
    highPrice: "4.40",
    offerCount: "3",
    offers: [
      { name: "Embroidered Baseball Patches, 50 pieces", price: "180.00" },
      { name: "Woven Baseball Patches, 50 pieces", price: "220.00" },
      { name: "Embroidered Baseball Patches, 100 pieces", price: "240.00" },
    ],
  },
  // Added June 2026 (WEBSIT_1.MD T22). Scout patches use the embroidered-
  // anchored pricing floor because BSA Insignia Guide compliance and
  // merit-badge-style designs are virtually always thread on twill.
  "custom-scout-patches": {
    name: "Custom Scout Patches",
    description: "Custom scout patches for Cub Scouts, Webelos, Boy Scouts, Girl Scouts, Venturing Crew, and Eagle Scout courts of honor. BSA Insignia Guide compliant. Patrol patches, troop numerals, council strips, segments, and event patches.",
    url: "https://www.pandapatches.com/custom-scout-patches",
    lowPrice: "0.91",
    highPrice: "6.80",
    offerCount: "4",
    offers: [
      { name: "Embroidered Scout Patches, 50 pieces", price: "180.00" },
      { name: "Embroidered Scout Patches, 100 pieces", price: "240.00" },
      { name: "Embroidered Scout Patches, 500 pieces", price: "750.00" },
      { name: "Embroidered Scout Patches, 1,000 pieces", price: "1200.00" },
    ],
  },
  "custom-rock-band-patches": {
    name: "Custom Rock Band Patches",
    description: "Custom rock band patches for jackets, vests, and bags. Iron-on and sew-on options. Bold designs for punk, metal, and rock fans.",
    url: "https://www.pandapatches.com/custom-rock-band-patches",
    lowPrice: "0.71",
    highPrice: "4.40",
    offerCount: "3",
    offers: [
      { name: "Embroidered Rock Band Patches, 50 pieces", price: "180.00" },
      { name: "Woven Rock Band Patches, 50 pieces", price: "220.00" },
      { name: "Embroidered Rock Band Patches, 100 pieces", price: "240.00" },
    ],
  },
};

// Generic fallback for patchStyle pages not in the map above
function buildGenericSchema(styleName: string, slug: string): ProductSchemaData {
  const nameForDesc = styleName.toLowerCase().startsWith("custom ") ? styleName.slice(7) : styleName;
  return {
    name: styleName,
    description: `Custom ${nameForDesc} with low minimums, free design services, and fast 7-14 day delivery. Embroidered, woven, PVC, and more.`,
    url: `https://www.pandapatches.com/${slug}`,
    lowPrice: "0.71",
    highPrice: "6.80",
    offerCount: "3",
    offers: [
      { name: `${styleName}, 50 pieces`, price: "180.00" },
      { name: `${styleName}, 100 pieces`, price: "240.00" },
      { name: `${styleName}, 500 pieces`, price: "750.00" },
    ],
  };
}

export function getPatchStyleProductSchema(slug: string, styleName: string) {
  const data = specificSchemas[slug] ?? buildGenericSchema(styleName, slug);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    "image": "https://www.pandapatches.com/assets/og-image.png",
    "brand": { "@type": "Brand", "name": "Panda Patches" },
    "url": data.url,
    // itemCondition added June 2026 (WEBSIT_1.MD T7). Required by Google
    // Merchant for shopping snippet eligibility. Missing it on the inner
    // Offers was the likely cause of the listings drop from pos 4.0 to 0.
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": data.lowPrice,
      "highPrice": data.highPrice,
      "offerCount": data.offerCount,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "priceValidUntil": "2027-01-01",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 7, "maxValue": 14, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 5, "unitCode": "DAY" },
        },
      },
      "offers": data.offers.map((o) => ({
        "@type": "Offer",
        "name": o.name,
        "price": o.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "priceValidUntil": "2027-01-01",
      })),
    },
  };
}
