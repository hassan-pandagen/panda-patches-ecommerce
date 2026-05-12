/**
 * SEO Schema Markup Library
 * Generates JSON-LD structured data for all pages
 *
 * Usage:
 * import { generateOrganizationSchema } from '@/lib/schemas';
 * <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(generateOrganizationSchema())} />
 */

import { TRUSTPILOT_RATING, TRUSTPILOT_REVIEW_COUNT_STR, TRUSTPILOT_URL } from './reviewConstants';

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
    "url": "https://www.pandapatches.com/about",
    "sameAs": [
      "https://www.linkedin.com/in/imran-raza-ladhani/"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Panda Patches",
      "url": "https://www.pandapatches.com"
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
    "url": "https://www.pandapatches.com",
    "logo": "https://www.pandapatches.com/assets/logo-panda.svg",
    "image": "https://www.pandapatches.com/assets/og-image.png",
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
      "streetAddress": "Quail Feather Ct",
      "addressLocality": "Missouri City",
      "addressRegion": "TX",
      "postalCode": "77489",
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
      "https://www.facebook.com/pandapatchesofficial",
      "https://www.instagram.com/pandapatchesofficial",
      "https://www.linkedin.com/company/pandapatchesofficial",
      "https://www.youtube.com/@PandaPatchesOfficial",
      "https://www.tiktok.com/@pandapatchesofficial",
      TRUSTPILOT_URL,
      "https://www.provenexpert.com/en-us/panda-patches/",
      "https://www.yelp.com/biz/panda-patches",
      "https://maps.app.goo.gl/i5yZ6n2wUMJVAdUb7"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": TRUSTPILOT_RATING,
      "reviewCount": TRUSTPILOT_REVIEW_COUNT_STR,
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
  /** @deprecated brand-level Trustpilot rating no longer attached to Product schema (Google 2026 self-serving review enforcement). Kept for backwards compat; ignored. */
  includeReviews?: boolean;
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

  const shippingDetails = {
    "@type": "OfferShippingDetails",
    "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
    "deliveryTime": {
      "@type": "ShippingDeliveryTime",
      "handlingTime": { "@type": "QuantitativeValue", "minValue": 10, "maxValue": 14, "unitCode": "DAY" },
      "transitTime": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 5, "unitCode": "DAY" }
    }
  };

  const merchantReturnPolicy = {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "US",
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 30,
    "returnMethod": "https://schema.org/ReturnByMail",
    "returnFees": "https://schema.org/FreeReturn"
  };

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
    "hasMerchantReturnPolicy": merchantReturnPolicy,
    "offers": pricingTiers && pricingTiers.length > 0
      ? {
          "@type": "AggregateOffer",
          "priceCurrency": priceCurrency,
          "lowPrice": lowPrice,
          "highPrice": highPrice,
          "offerCount": pricingTiers.length.toString(),
          "availability": `https://schema.org/${schemaAvailability}`,
          "url": url,
          "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          "shippingDetails": shippingDetails,
          "hasMerchantReturnPolicy": merchantReturnPolicy
        }
      : {
          "@type": "Offer",
          "priceCurrency": priceCurrency,
          "price": lowPrice,
          "availability": `https://schema.org/${schemaAvailability}`,
          "url": url,
          "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          "shippingDetails": shippingDetails,
          "hasMerchantReturnPolicy": merchantReturnPolicy
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
      "offerCount": pricingTiers.length.toString(),
      "availability": `https://schema.org/${schemaAvailability}`,
      "url": url,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "offers": pricingTiers.map((tier, index) => ({
        "@type": "Offer",
        "price": tier.unitPrice.toFixed(2),
        "priceCurrency": priceCurrency,
        "availability": `https://schema.org/${schemaAvailability}`,
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        "shippingDetails": shippingDetails,
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

  // NOTE: Brand-level Trustpilot reviews intentionally NOT attached to Product schema.
  // Google's 2026 enforcement treats brand-level aggregateRating on individual Product
  // pages as self-serving (the rating is about the business, not the specific product).
  // Brand-level rating remains on Organization + LocalBusiness schemas (legitimate use).
  // Re-introduce here only when per-product reviews exist (3+ reviews per SKU).

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
        "url": "https://www.pandapatches.com/assets/logo-panda.svg"
      }
    },
    "inLanguage": "en",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".speakable-summary"]
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
    "@id": "https://www.pandapatches.com/#localbusiness",
    "name": "Panda Patches",
    "legalName": "MC Patches LLC",
    "image": "https://www.pandapatches.com/assets/og-image.png",
    "logo": "https://www.pandapatches.com/assets/logo-panda.svg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Quail Feather Ct",
      "addressLocality": "Missouri City",
      "addressRegion": "TX",
      "postalCode": "77489",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.6186,
      "longitude": -95.5377
    },
    "telephone": "+1-302-250-4340",
    "email": "admin@pandapatches.com",
    "url": "https://www.pandapatches.com",
    "priceRange": "$$",
    "founder": {
      "@type": "Person",
      "name": "Imran Raza",
      "sameAs": "https://www.linkedin.com/in/imran-raza-ladhani/"
    },
    "sameAs": [
      "https://www.trustpilot.com/review/pandapatches.com",
      "https://www.instagram.com/pandapatchesofficial/",
      "https://www.linkedin.com/in/imran-raza-ladhani/"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": TRUSTPILOT_RATING,
      "reviewCount": TRUSTPILOT_REVIEW_COUNT_STR,
      "bestRating": "5",
      "worstRating": "1"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ]
  };
}

// ============================================
// 9. LOCATION-SPECIFIC LOCAL BUSINESS SCHEMA (for state/city landing pages)
// ============================================

export function generateLocationBusinessSchema(locationName: string, pageSlug?: string) {
  const fallbackSlug = locationName.toLowerCase().replace(/\s+/g, '-');
  const urlSlug = pageSlug || fallbackSlug;
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "name": `Custom Patches in ${locationName} | Panda Patches`,
    "description": `Order custom embroidered patches delivered to ${locationName}. Low minimums, free mockups, fast 7-14 day turnaround. Founded by Imran Raza with 13 years of patch manufacturing expertise.`,
    "telephone": "+1-302-250-4340",
    "email": "admin@pandapatches.com",
    "url": `https://www.pandapatches.com/${urlSlug}`,
    "image": "https://www.pandapatches.com/assets/logo-panda.svg",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Quail Feather Ct",
      "addressLocality": "Missouri City",
      "addressRegion": "TX",
      "postalCode": "77489",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": locationName
    },
    "serviceArea": {
      "@type": "AdministrativeArea",
      "name": locationName
    },
    "founder": {
      "@type": "Person",
      "name": "Imran Raza",
      "sameAs": "https://www.linkedin.com/in/imran-raza-ladhani/"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": TRUSTPILOT_RATING,
      "reviewCount": TRUSTPILOT_REVIEW_COUNT_STR,
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
// 11. WEBSITE SCHEMA (global - for layout.tsx)
// ============================================

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Panda Patches",
    "url": "https://www.pandapatches.com",
    "description": "Custom embroidered patches, iron-on patches, PVC patches with low minimums, free design services, and fast 7-14 day delivery.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.pandapatches.com/custom-patches?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Panda Patches",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.pandapatches.com/assets/logo-panda.svg"
      }
    }
  };
}

// ============================================
// 12. SERVICE SCHEMA (for Free Design Service)
// ============================================

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Custom Patch Design",
    "name": "Free Custom Patch Design Service",
    "description": "Free professional digital mockup for every custom patch order. Our designers create your patch design within 24 hours with unlimited revisions until you are satisfied. No setup fees, no hidden charges.",
    "provider": {
      "@type": "Organization",
      "name": "Panda Patches",
      "url": "https://www.pandapatches.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free design mockup included with every patch order. Unlimited revisions at no extra cost."
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://www.pandapatches.com/custom-patches",
      "servicePhone": "+1-302-250-4340"
    }
  };
}

// ============================================
// 13. VIDEO OBJECT SCHEMA (for homepage reels section)
// ============================================

interface VideoSchemaItem {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
  duration?: string;
}

export function generateVideoObjectSchema(videos: VideoSchemaItem[]) {
  return videos.map((v) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": v.name,
    "description": v.description,
    "thumbnailUrl": v.thumbnailUrl,
    "contentUrl": v.contentUrl,
    "uploadDate": (() => {
      const d = (v.uploadDate || '').trim();
      if (!d) return '2025-01-01T00:00:00Z';
      // Date-only (YYYY-MM-DD) -> append midnight UTC
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d + 'T00:00:00Z';
      // Already full ISO with timezone
      if (/T\d{2}:\d{2}:\d{2}/.test(d)) {
        // Ensure it ends with Z or offset
        if (/[Zz]$/.test(d) || /[+-]\d{2}:\d{2}$/.test(d)) return d;
        return d + 'Z';
      }
      // Fallback
      try { return new Date(d).toISOString(); } catch { return '2025-01-01T00:00:00Z'; }
    })(),
    "duration": v.duration || "PT0M30S",
    "publisher": {
      "@type": "Organization",
      "name": "Panda Patches",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.pandapatches.com/assets/logo-panda.svg",
        "width": 200,
        "height": 60
      }
    }
  }));
}

// ============================================
// 14. COLLECTION PAGE SCHEMA (for blog hub)
// ============================================

export function generateCollectionPageSchema(posts: { title: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Custom Patch Blog - Tips, Guides & Industry News",
    "description": "Expert guides on custom patches, embroidery tips, design ideas, and industry trends from Panda Patches founder Imran Raza.",
    "url": "https://www.pandapatches.com/blogs",
    "publisher": {
      "@type": "Organization",
      "name": "Panda Patches",
      "url": "https://www.pandapatches.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.pandapatches.com/assets/logo-panda.svg"
      }
    },
    "hasPart": posts.map((post) => ({
      "@type": "BlogPosting",
      "name": post.title,
      "url": post.url
    }))
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
  image: "https://www.pandapatches.com/patch-image.jpg",
  url: "https://www.pandapatches.com/custom-patches/embroidered-patches",
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
