/**
 * SEO Schema Markup Library
 * Generates JSON-LD structured data for all pages
 *
 * Usage:
 * import { generateOrganizationSchema } from '@/lib/schemas';
 * <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(generateOrganizationSchema())} />
 */

// ============================================
// HELPER FUNCTION
// ============================================

/**
 * Converts schema object to safe HTML script content
 */
export function generateSchemaScript(schema: Record<string, any>) {
  return {
    __html: JSON.stringify(schema),
  };
}

// ============================================
// 0. PERSON SCHEMA (Imran Raza - Founder Authority for E-E-A-T + AEO)
// ============================================

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Imran Raza",
    "jobTitle": "Founder & CEO",
    "description": "Founder of Panda Patches with 13 years of hands-on experience in embroidered patches and textile manufacturing. Expert in custom patch production, quality control, and textile industry standards.",
    "url": "https://pandapatches.com/about",
    "sameAs": [
      "https://www.linkedin.com/in/imran-raza-ladhani/"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Panda Patches",
      "url": "https://pandapatches.com"
    },
    "knowsAbout": [
      "Custom Embroidered Patches",
      "Iron On Patches",
      "Textile Manufacturing",
      "Custom Patch Design",
      "Wholesale Patches",
      "Embroidery Production",
      "Military & Tactical Patches",
      "Velcro Patches"
    ]
  };
}

// ============================================
// 1. ORGANIZATION SCHEMA (Global - for layout.tsx)
// ============================================

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Panda Patches",
    "alternateName": "Panda Patches - Custom Embroidered Patches",
    "legalName": "MC Patches LLC",
    "url": "https://pandapatches.com",
    "logo": "https://pandapatches.com/assets/logo-panda.svg",
    "foundingDate": "2016",
    "description": "Custom embroidered patches, challenge coins, enamel pins, and keychains with low minimums, free design services, and fast 7-14 day delivery. 8+ years of excellence.",
    "email": "admin@pandapatches.com",
    "telephone": "+1-302-250-4340",
    "founder": {
      "@type": "Person",
      "name": "Imran Raza",
      "sameAs": "https://www.linkedin.com/in/imran-raza-ladhani/"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Missouri City",
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "Canada"
      },
      {
        "@type": "Country",
        "name": "United Kingdom"
      },
      {
        "@type": "Country",
        "name": "Australia"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/pandapatches",
      "https://www.instagram.com/pandapatches",
      "https://www.linkedin.com/company/pandapatches",
      "https://www.trustpilot.com/review/pandapatches.com"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "55",
      "bestRating": "5",
      "worstRating": "1"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-302-250-4340",
      "contactType": "Customer Service",
      "email": "admin@pandapatches.com",
      "availableLanguage": ["English"],
      "areaServed": ["US", "CA", "GB", "AU"]
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "11:00",
      "closes": "19:00"
    }
  };
}

// ============================================
// 2. PRODUCT SCHEMA (for product pages)
// ============================================

interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
}

interface ProductVariant {
  title: string;
  description?: string;
  image?: string;
}

interface ProductSchemaParams {
  name: string;
  description: string;
  image: string;
  url: string;
  sku?: string;
  gtin?: string;
  brand?: string;
  priceRange?: string; // e.g., "$50-$500"
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "MadeToOrder";
  includeReviews?: boolean; // Include Trustpilot aggregate rating
  // UCP / Variant Support
  pricingTiers?: PricingTier[];
  variants?: ProductVariant[];
  materials?: string[];
  weight?: { value: number; unit: string };
  dimensions?: { width?: number; height?: number; depth?: number };
}

export function generateProductSchema(params: ProductSchemaParams) {
  const {
    name,
    description,
    image,
    url,
    sku = "custom-product",
    gtin,
    brand = "Panda Patches",
    priceRange = "$50-$500",
    priceCurrency = "USD",
    availability = "InStock",
    includeReviews = true,
    pricingTiers,
    variants,
    materials,
    weight,
    dimensions,
  } = params;

  // Calculate price range from pricing tiers if available
  let lowPrice = priceRange.split('-')[0].replace('$', '').trim();
  let highPrice = priceRange.split('-')[1]?.replace('$', '').trim() || lowPrice;

  if (pricingTiers && pricingTiers.length > 0) {
    const prices = pricingTiers.map(tier => tier.unitPrice);
    lowPrice = Math.min(...prices).toFixed(2);
    highPrice = Math.max(...prices).toFixed(2);
  }

  // Map availability to Schema.org format
  const availabilityMap: Record<string, string> = {
    'InStock': 'InStock',
    'OutOfStock': 'OutOfStock',
    'PreOrder': 'PreOrder',
    'MadeToOrder': 'PreOrder', // Map MadeToOrder to PreOrder for Schema.org
  };

  const schemaAvailability = availabilityMap[availability] || 'InStock';

  const productSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "url": url,
    "sku": sku,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": priceCurrency,
      "lowPrice": lowPrice,
      "highPrice": highPrice,
      "availability": `https://schema.org/${schemaAvailability}`,
      "url": url,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    }
  };

  // Add GTIN if available
  if (gtin) {
    productSchema.gtin = gtin;
  }

  // Add material if available
  if (materials && materials.length > 0) {
    productSchema.material = materials.join(', ');
  }

  // Add weight if available
  if (weight?.value && weight?.unit) {
    productSchema.weight = {
      "@type": "QuantitativeValue",
      "value": weight.value,
      "unitText": weight.unit
    };
  }

  // Add dimensions if available
  if (dimensions?.width || dimensions?.height || dimensions?.depth) {
    const dim = dimensions;
    if (dim.width && dim.height && dim.depth) {
      productSchema.depth = {
        "@type": "QuantitativeValue",
        "value": dim.depth,
        "unitText": "in"
      };
      productSchema.height = {
        "@type": "QuantitativeValue",
        "value": dim.height,
        "unitText": "in"
      };
      productSchema.width = {
        "@type": "QuantitativeValue",
        "value": dim.width,
        "unitText": "in"
      };
    }
  }

  // Add individual offers for pricing tiers (UCP enhancement)
  if (pricingTiers && pricingTiers.length > 0) {
    productSchema.offers = {
      "@type": "AggregateOffer",
      "priceCurrency": priceCurrency,
      "lowPrice": lowPrice,
      "highPrice": highPrice,
      "availability": `https://schema.org/${schemaAvailability}`,
      "url": url,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "offers": pricingTiers.map((tier, index) => ({
        "@type": "Offer",
        "price": tier.unitPrice.toFixed(2),
        "priceCurrency": priceCurrency,
        "availability": `https://schema.org/${schemaAvailability}`,
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "minValue": tier.minQuantity,
          "maxValue": tier.maxQuantity || 999999,
          "unitText": "units"
        },
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": tier.unitPrice.toFixed(2),
          "priceCurrency": priceCurrency,
          "referenceQuantity": {
            "@type": "QuantitativeValue",
            "value": 1,
            "unitText": "unit"
          }
        }
      }))
    };
  }

  // Add product variants (if available)
  if (variants && variants.length > 0) {
    productSchema.isVariantOf = {
      "@type": "ProductGroup",
      "name": name,
      "variesBy": "material",
      "hasVariant": variants.map((variant, index) => ({
        "@type": "Product",
        "name": variant.title,
        "description": variant.description || description,
        "image": variant.image || image,
        "sku": `${sku}-VARIANT-${index + 1}`
      }))
    };
  }

  // Add aggregate rating from Trustpilot
  if (includeReviews) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "55",
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  return productSchema;
}

// ============================================
// 3. ARTICLE SCHEMA (for blog posts)
// ============================================

interface ArticleSchemaParams {
  title: string;
  description: string;
  datePublished: string; // ISO 8601 format
  dateModified: string; // ISO 8601 format
  image: string;
  url: string;
  authorName?: string;
  authorUrl?: string;
}

export function generateArticleSchema(params: ArticleSchemaParams) {
  const {
    title,
    description,
    datePublished,
    dateModified,
    image,
    url,
    authorName = "Imran Raza",
    authorUrl = "https://www.linkedin.com/in/imran-raza-ladhani/",
  } = params;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": authorUrl,
      "sameAs": "https://www.linkedin.com/in/imran-raza-ladhani/",
      "jobTitle": "Founder & CEO, Panda Patches",
      "description": "13 years of expertise in embroidered patches and textile manufacturing"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Panda Patches",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pandapatches.com/assets/logo-panda.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
}

// ============================================
// 4. FAQ SCHEMA (for FAQ section)
// ============================================

interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// ============================================
// 5. BREADCRUMB SCHEMA (for product/category pages)
// ============================================

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// ============================================
// 6. AGGREGATE RATING SCHEMA (standalone)
// ============================================

interface AggregateRatingParams {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function generateAggregateRatingSchema(params: AggregateRatingParams) {
  const {
    ratingValue,
    reviewCount,
    bestRating = 5,
    worstRating = 1,
  } = params;

  return {
    "@type": "AggregateRating",
    "ratingValue": ratingValue.toString(),
    "reviewCount": reviewCount.toString(),
    "bestRating": bestRating.toString(),
    "worstRating": worstRating.toString()
  };
}

// ============================================
// 7. REVIEW SCHEMA (for individual reviews)
// ============================================

interface ReviewSchemaParams {
  author: string;
  datePublished: string;
  reviewBody: string;
  ratingValue: number;
  itemReviewed: {
    name: string;
    type?: string; // default: "Organization"
  };
}

export function generateReviewSchema(params: ReviewSchemaParams) {
  const {
    author,
    datePublished,
    reviewBody,
    ratingValue,
    itemReviewed,
  } = params;

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": datePublished,
    "reviewBody": reviewBody,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": ratingValue.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "itemReviewed": {
      "@type": itemReviewed.type || "Organization",
      "name": itemReviewed.name
    }
  };
}

// ============================================
// 8. LOCAL BUSINESS SCHEMA (global - for homepage/about)
// ============================================

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Panda Patches",
    "image": "https://pandapatches.com/assets/logo-panda.svg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Missouri City",
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "telephone": "+1-302-250-4340",
    "email": "admin@pandapatches.com",
    "url": "https://pandapatches.com",
    "priceRange": "$$",
    "founder": {
      "@type": "Person",
      "name": "Imran Raza",
      "sameAs": "https://www.linkedin.com/in/imran-raza-ladhani/"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "55"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "11:00",
      "closes": "19:00"
    }
  };
}

// ============================================
// 9. LOCATION-SPECIFIC LOCAL BUSINESS SCHEMA (for state/city landing pages)
// ============================================

export function generateLocationBusinessSchema(locationName: string) {
  const slug = locationName.toLowerCase().replace(/\s+/g, '-');
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "name": `Custom Patches in ${locationName} | Panda Patches`,
    "description": `Order custom embroidered patches delivered to ${locationName}. Low minimums, free mockups, fast 7-14 day turnaround. Founded by Imran Raza with 13 years of patch manufacturing expertise.`,
    "telephone": "+1-302-250-4340",
    "email": "admin@pandapatches.com",
    "url": `https://pandapatches.com/custom-patches-in-${slug}`,
    "image": "https://pandapatches.com/assets/logo-panda.svg",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Missouri City",
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "State",
      "name": locationName
    },
    "founder": {
      "@type": "Person",
      "name": "Imran Raza",
      "sameAs": "https://www.linkedin.com/in/imran-raza-ladhani/"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "55",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

// ============================================
// 10. HOW-TO SCHEMA (for process/ordering section - AEO)
// ============================================

export function generateHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Order Custom Patches from Panda Patches",
    "description": "Order custom embroidered patches in 4 simple steps. Free mockup, no minimum order, 7-14 day delivery.",
    "totalTime": "PT14D",
    "supply": [
      { "@type": "HowToSupply", "name": "Artwork file or design idea" }
    ],
    "tool": [
      { "@type": "HowToTool", "name": "Online quote calculator" }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Submit Your Design",
        "text": "Upload your artwork or describe your idea. Our designers send a free digital mockup within 24 hours."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Approve Your Mockup",
        "text": "Review the free digital proof. Request unlimited revisions until you are 100% satisfied."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Place Your Order",
        "text": "Confirm patch type, size, quantity, and backing. No minimum order required. Pay securely online."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Receive Your Patches",
        "text": "Your custom patches are manufactured and delivered to your door within 7-14 business days."
      }
    ]
  };
}

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Example 1: Add Organization schema to layout.tsx
import { generateOrganizationSchema, generateSchemaScript } from '@/lib/schemas';

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={generateSchemaScript(generateOrganizationSchema())}
/>

// Example 2: Add Product schema to product page
import { generateProductSchema, generateSchemaScript } from '@/lib/schemas';

const productSchema = generateProductSchema({
  name: "Custom Embroidered Patches",
  description: "High-quality custom patches with low minimums",
  image: "https://pandapatches.com/patch-image.jpg",
  url: "https://pandapatches.com/custom-patches/embroidered-patches",
  priceRange: "$50-$500"
});

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={generateSchemaScript(productSchema)}
/>

// Example 3: Add FAQ schema
import { generateFAQSchema, generateSchemaScript } from '@/lib/schemas';

const faqSchema = generateFAQSchema([
  {
    question: "What is the minimum order quantity?",
    answer: "We have no minimum order requirements. Order as few or as many as you need."
  },
  {
    question: "How long does production take?",
    answer: "Standard production time is 7-14 business days after artwork approval."
  }
]);

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={generateSchemaScript(faqSchema)}
/>
*/
