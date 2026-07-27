/**
 * SEO Schema Markup Library
 * Generates JSON-LD structured data for all pages
 *
 * Usage:
 * import { generateOrganizationSchema } from '@/lib/schemas';
 * <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(generateOrganizationSchema())} />
 */

import { TRUSTPILOT_RATING, TRUSTPILOT_REVIEW_COUNT } from '@/lib/reviewConstants';
import { getProductReviewSchema } from '@/lib/productReviews';

// ============================================
// HELPER FUNCTION
// ============================================

/**
 * Converts schema object to safe HTML script content.
 * `<` is escaped to `<` so a `</script>` sequence inside any schema value can
 * never break out of the JSON-LD block (defense-in-depth — audit P1; JSON.stringify
 * alone does not neutralize it). Unicode escapes are valid JSON, so parsers and
 * Google read the schema identically.
 */
export function generateSchemaScript(schema: Record<string, any>) {
  return {
    __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
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
    "description": "Custom embroidered patches, challenge coins, enamel pins, and keychains with low minimums, free design services, and fast 7-14 day delivery. 13+ years of expertise.",
    "email": "sales@pandapatches.com",
    "telephone": "+1-302-250-4340",
    "founder": {
      "@type": "Person",
      "name": "Imran Raza",
      "sameAs": "https://www.linkedin.com/in/imran-raza-ladhani/"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "701 Tillery St Ste 12",
      "addressLocality": "Austin",
      "addressRegion": "TX",
      "postalCode": "78702",
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
      "https://www.provenexpert.com/en-us/panda-patches/",
      "https://www.yelp.com/biz/panda-patches"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-302-250-4340",
      "contactType": "Customer Service",
      "email": "sales@pandapatches.com",
      "availableLanguage": ["English"],
      "areaServed": ["US", "CA", "GB", "AU"]
    }
  };
}

// ============================================
// 1b. ENTITY GRAPH (Global — consolidated @graph for layout.tsx)
//
// Connects Organization <-> Brand <-> WebSite <-> Person (founder) through stable
// @id URIs so engines and LLMs resolve ONE entity instead of four isolated islands.
// knowsAbout + makesOffer encode the brand's core semantic triples (Subject ->
// Predicate -> Object) as machine-readable facts, and knowsAbout points at canonical
// Wikipedia URIs for entity validation. This is the authoritative entity node every
// page inherits from the root layout.
// ============================================

const SITE_URL = "https://www.pandapatches.com";
export const ORG_ID = `${SITE_URL}/#organization`;
export const BRAND_ID = `${SITE_URL}/#brand`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PERSON_ID = `${SITE_URL}/#person/imran-raza`;

function makesOfferEntry(name: string, path: string, category: string) {
  // itemOffered is a Service (made-to-order custom-patch production), NOT a Product.
  // A nested Product here has no offers/price of its own, which trips Google's
  // "Product snippets" validator ("Either offers, review or aggregateRating should be
  // specified") on EVERY page this global entity graph renders on. Real Product schema
  // with offers lives on the product pages that actually transact. Do not change back
  // to Product without giving each one its own offers.
  return {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": name,
      "category": category,
      "url": `${SITE_URL}${path}`,
    },
    "seller": { "@id": ORG_ID },
  };
}

export function generateEntityGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // OnlineStore subtype (§1.1) — an online merchant, no physical-visit
        // signal. Other pages reference this node by @id; there is exactly ONE
        // Organization/OnlineStore node sitewide (no LocalBusiness anywhere).
        "@type": "OnlineStore",
        "@id": ORG_ID,
        "name": "Panda Patches",
        "alternateName": "Panda Patches - Custom Embroidered Patches",
        "legalName": "MC Patches LLC",
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          "url": `${SITE_URL}/assets/logo-panda.svg`,
          "caption": "Panda Patches",
        },
        "image": `${SITE_URL}/assets/og-image.png`,
        "description":
          "Custom embroidered patches, challenge coins, enamel pins, and keychains with low minimums, free design services, and fast 7-14 day delivery. 13+ years of expertise.",
        "email": "sales@pandapatches.com",
        "telephone": "+1-302-250-4340",
        "brand": { "@id": BRAND_ID },
        "founder": { "@id": PERSON_ID },
        "foundingDate": "2023-06",
        // Subject -> knowsAbout -> Object, validated against canonical Wikipedia entities
        "knowsAbout": [
          { "@type": "Thing", "name": "Embroidered patch", "sameAs": "https://en.wikipedia.org/wiki/Embroidered_patch" },
          { "@type": "Thing", "name": "Embroidery", "sameAs": "https://en.wikipedia.org/wiki/Embroidery" },
          { "@type": "Thing", "name": "Woven label", "sameAs": "https://en.wikipedia.org/wiki/Woven_label" },
          { "@type": "Thing", "name": "Chenille fabric", "sameAs": "https://en.wikipedia.org/wiki/Chenille_fabric" },
          { "@type": "Thing", "name": "Polyvinyl chloride", "sameAs": "https://en.wikipedia.org/wiki/Polyvinyl_chloride" },
          { "@type": "Thing", "name": "Challenge coin", "sameAs": "https://en.wikipedia.org/wiki/Challenge_coin" },
          { "@type": "Thing", "name": "Lapel pin", "sameAs": "https://en.wikipedia.org/wiki/Lapel_pin" },
          "Custom patch manufacturing",
          "Velcro / hook-and-loop backing",
          "Pantone color matching",
          "Embroidery digitizing",
        ],
        // Subject -> makesOffer -> Object: the brand's product lines as discrete facts
        "makesOffer": [
          makesOfferEntry("Custom Embroidered Patches", "/custom-patches/embroidered", "Embroidered Patches"),
          makesOfferEntry("Custom Woven Patches", "/custom-patches/woven", "Woven Patches"),
          makesOfferEntry("Custom PVC Patches", "/custom-patches/pvc", "PVC Patches"),
          makesOfferEntry("Custom Chenille Patches", "/custom-patches/chenille", "Chenille Patches"),
          makesOfferEntry("Custom Leather Patches", "/custom-patches/leather", "Leather Patches"),
          makesOfferEntry("Custom Printed Patches", "/custom-patches/printed", "Printed Patches"),
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "701 Tillery St Ste 12",
          "addressLocality": "Austin",
          "addressRegion": "TX",
          "postalCode": "78702",
          "addressCountry": "US",
        },
        "areaServed": [
          { "@type": "Country", "name": "United States" },
          { "@type": "Country", "name": "Canada" },
          { "@type": "Country", "name": "United Kingdom" },
          { "@type": "Country", "name": "Australia" },
        ],
        "sameAs": [
          "https://www.facebook.com/pandapatchesofficial",
          "https://www.instagram.com/pandapatchesofficial",
          "https://www.linkedin.com/company/pandapatchesofficial",
          "https://www.youtube.com/@PandaPatchesOfficial",
          "https://www.tiktok.com/@pandapatchesofficial",
          // Trustpilot profile — links the entity to its strongest review signal
          // (4.7/76). Review-platform sameAs is an entity/citation signal for AI
          // engines (AEO-CONTENT-REWORK-SPEC-2026-07.md). A Wikidata entry is the
          // remaining entity gap — create off-page, then add its URL here.
          "https://www.trustpilot.com/review/pandapatches.com",
          "https://www.provenexpert.com/en-us/panda-patches/",
          "https://www.yelp.com/biz/panda-patches",
          "https://www.crunchbase.com/organization/panda-patches",
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-302-250-4340",
          "contactType": "Customer Service",
          "email": "sales@pandapatches.com",
          "availableLanguage": ["English"],
          "areaServed": ["US", "CA", "GB", "AU"],
        },
        // NO aggregateRating on this Organization (removed per SEDAA3_1 §A.2):
        // the Trustpilot score is self-serving AND third-party-sourced, which
        // makes it ineligible under Google's Review Snippet guidelines. The
        // rating stays visible on-page as exact, dated, linked text instead —
        // see reviewConstants.ts. The Trustpilot profile remains in sameAs
        // above, which is the legitimate way to associate the entity with it.
        // Product-level aggregateRating is still fine where genuine, on-page
        // product reviews back it (productReviews.ts).
        // NO openingHoursSpecification (§0.5) — removed entirely; there is no
        // visitable office and support hours are not a schema claim.
      },
      {
        "@type": "Brand",
        "@id": BRAND_ID,
        "name": "Panda Patches",
        "logo": `${SITE_URL}/assets/logo-panda.svg`,
        "slogan": "Custom patches with low minimums, free mockups, and no setup fees.",
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        "name": "Panda Patches",
        "url": SITE_URL,
        "description":
          "Custom embroidered patches, iron-on patches, PVC patches with low minimums, free design services, and fast 7-14 day delivery.",
        "inLanguage": "en-US",
        "publisher": { "@id": ORG_ID },
        "about": { "@id": ORG_ID },
        // NO SearchAction (§1.1) — the site has no functional search endpoint,
        // so the sitelinks-searchbox action was nonfunctional and is removed.
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        "name": "Imran Raza",
        "jobTitle": "Founder & CEO",
        "description":
          "Founder of Panda Patches with 13 years of hands-on experience in embroidered patches and textile manufacturing.",
        "url": `${SITE_URL}/about`,
        "worksFor": { "@id": ORG_ID },
        "sameAs": [
          "https://www.linkedin.com/in/imran-raza-ladhani/",
          "https://www.behance.net/imranraza1",
        ],
        "knowsAbout": [
          "Custom Embroidered Patches",
          "Textile Manufacturing",
          "Custom Patch Design",
          "Wholesale Patches",
          "Embroidery Production",
          "Military & Tactical Patches",
        ],
      },
    ],
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
  // UCP / Variant Support
  pricingTiers?: PricingTier[];
  variants?: ProductVariant[];
  materials?: string[];
  weight?: { value: number; unit: string };
  dimensions?: { width?: number; height?: number; depth?: number };
  // Product-review key (e.g. "pvc"). When set AND enough genuine reviews exist,
  // a product-specific aggregateRating + review[] is merged in (productReviews.ts).
  // The SAME reviews must be shown on the page via <ProductReviews>. Omit for
  // products with no real reviews (e.g. challenge coins) so no rating is emitted.
  reviewKey?: string;
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
    reviewKey,
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
    "shippingDestination": [
      { "@type": "DefinedRegion", "addressCountry": "US" },
      { "@type": "DefinedRegion", "addressCountry": "CA" },
      { "@type": "DefinedRegion", "addressCountry": "GB" },
      { "@type": "DefinedRegion", "addressCountry": "AU" }
    ],
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
    "merchantReturnDays": 10,
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
    "brand": brand === "Panda Patches" ? { "@id": BRAND_ID } : { "@type": "Brand", "name": brand },
    "manufacturer": { "@id": ORG_ID },
    "hasMerchantReturnPolicy": merchantReturnPolicy,
    // itemCondition is REQUIRED by Google Merchant for product rich results
    // and shopping snippets. Custom patches are made-to-order so every offer
    // ships as a brand-new item; NewCondition is the only correct value here.
    // Missing this field was the root cause of the Merchant listings impression
    // drop from pos 4.0 to 0 (WEBSIT_1.MD T7).
    "offers": pricingTiers && pricingTiers.length > 0
      ? {
          "@type": "AggregateOffer",
          "priceCurrency": priceCurrency,
          "lowPrice": lowPrice,
          "highPrice": highPrice,
          "offerCount": pricingTiers.length.toString(),
          "availability": `https://schema.org/${schemaAvailability}`,
          "itemCondition": "https://schema.org/NewCondition",
          "url": url,
          "shippingDetails": shippingDetails,
          "hasMerchantReturnPolicy": merchantReturnPolicy
        }
      : {
          "@type": "Offer",
          "priceCurrency": priceCurrency,
          "price": lowPrice,
          "availability": `https://schema.org/${schemaAvailability}`,
          "itemCondition": "https://schema.org/NewCondition",
          "url": url,
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
      "offers": pricingTiers.map((tier, index) => ({
        "@type": "Offer",
        "price": tier.unitPrice.toFixed(2),
        "priceCurrency": priceCurrency,
        "availability": `https://schema.org/${schemaAvailability}`,
        "shippingDetails": shippingDetails,
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "minValue": tier.minQuantity,
          ...(tier.maxQuantity ? { "maxValue": tier.maxQuantity } : {}),
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

  // Product-specific aggregateRating + review[] — merged ONLY when reviewKey is set
  // and enough genuine reviews back it. These MUST be rendered on the page too
  // (<ProductReviews productKey={reviewKey}>), or Google treats the markup as invalid.
  const reviewSchema = reviewKey ? getProductReviewSchema(reviewKey) : null;
  if (reviewSchema) {
    productSchema.aggregateRating = reviewSchema.aggregateRating;
    productSchema.review = reviewSchema.review;
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
    // Default author (Imran Raza) references the global Person entity by @id so
    // founder E-E-A-T authority flows through the graph; custom authors stay inline.
    "author": authorName === "Imran Raza"
      ? { "@id": PERSON_ID }
      : {
          "@type": "Person",
          "name": authorName,
          "url": authorUrl,
        },
    "publisher": { "@id": ORG_ID },
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
// 6. (removed) LOCAL BUSINESS SCHEMA — §1.1: zero LocalBusiness sitewide.
// The homepage and /contact now rely solely on the global OnlineStore entity
// graph (generateEntityGraph, root layout). The old generator carried a
// #localbusiness @id, Houston geo coordinates, and an openingHours block — all
// visitable-office signals that must not exist. Call sites were removed too.
// generateLocalBusinessSchema is intentionally deleted; do not reintroduce it.
// ============================================


// ============================================
// 9. LOCATION-SPECIFIC LOCAL BUSINESS SCHEMA (for state/city landing pages)
// ============================================

export function generateLocationBusinessSchema(locationName: string, pageSlug?: string) {
  const fallbackSlug = locationName.toLowerCase().replace(/\s+/g, '-');
  const urlSlug = pageSlug || fallbackSlug;
  // §1.1/§8.3: NOT a LocalBusiness. A city page describes a delivery SERVICE
  // provided by the global OnlineStore (referenced by @id), with areaServed =
  // the metro. No physical address / geo / openingHours (nothing visitable).
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Custom patch manufacturing and delivery",
    "name": `Custom Patches Delivered to ${locationName} | Panda Patches`,
    "description": `Order custom embroidered patches delivered to ${locationName}. Low minimums, mockup in 12-24 hours, fast 7-14 day turnaround. Founded by Imran Raza with 13 years of patch manufacturing expertise.`,
    "provider": { "@id": ORG_ID },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": locationName
    },
    "url": `https://www.pandapatches.com/${urlSlug}`,
    "image": "https://www.pandapatches.com/assets/logo-panda.svg"
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
    "description": "Order custom embroidered patches in 4 simple steps. Mockup in 12-24 hours, low 5-piece minimum, 7-14 day delivery.",
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
        "text": "Upload your artwork or describe your idea. Our designers send a digital mockup in 12 to 24 hours."
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
        "text": "Confirm patch type, size, quantity, and backing. Low 5-piece minimum order. Pay securely online."
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
// 11. (removed) WEBSITE SCHEMA — was dead code carrying a nonfunctional
// SearchAction (§1.1). The live WebSite node lives in generateEntityGraph.
// ============================================

// ============================================
// 12. SERVICE SCHEMA (for Free Design Service)
// ============================================

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Custom Patch Design",
    "name": "Free Custom Patch Design Service",
    "description": "Professional digital mockup in 12 to 24 hours for every custom patch order. Our designers create your patch design with unlimited revisions until you are satisfied. No setup fees, no hidden charges.",
    "provider": {
      "@type": "Organization",
      "name": "Panda Patches",
      "url": "https://www.pandapatches.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Digital mockup in 12 to 24 hours included with every patch order. Unlimited revisions at no extra cost."
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
// 12b. RUSH SERVICE SCHEMA (RUSH-C_1.MD)
//
// provider references the entity-graph Organization via @id rather than
// duplicating name/address/founder/aggregateRating inline — the PANDAP_1 brief's
// explicit rule is that aggregateRating lives at the org level only, so this
// avoids re-emitting it (and every other org fact) as a second, disconnected
// copy on this one page.
// ============================================

export function generateRushServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Rush Custom Patches",
    "serviceType": "Rush custom patch manufacturing",
    "description": "Rush custom patches in hand in as fast as 5 business days, depending on quantity and patch type. From 5 pieces, free 12-24 hour mockup, no setup fees.",
    "url": "https://www.pandapatches.com/rush-custom-patches",
    "provider": { "@id": ORG_ID },
    "areaServed": "Worldwide",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "description": "Rush fee from +$50 at 50 pieces; exact pricing shown at checkout"
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
// 15. WEB APPLICATION SCHEMA (browser-based tools, e.g. AI Patch Generator)
// ============================================

export function generateWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free AI Patch Generator",
    "url": "https://www.pandapatches.com/ai-patch-generator",
    "description": "Describe a patch in plain English and get an instant AI concept preview in embroidered, chenille, PVC, and woven styles. Free, no signup, refine until you love it.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Panda Patches",
      "url": "https://www.pandapatches.com"
    }
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
    answer: "Our minimum order is 5 pieces. Order as few or as many as you need beyond that."
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
