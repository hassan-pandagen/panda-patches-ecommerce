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
      "ratingValue": "4.9",
      "reviewCount": "50",
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

interface ProductSchemaParams {
  name: string;
  description: string;
  image: string;
  url: string;
  sku?: string;
  brand?: string;
  priceRange?: string; // e.g., "$50-$500"
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  includeReviews?: boolean; // Include Trustpilot aggregate rating
}

export function generateProductSchema(params: ProductSchemaParams) {
  const {
    name,
    description,
    image,
    url,
    sku = "custom-product",
    brand = "Panda Patches",
    priceRange = "$50-$500",
    priceCurrency = "USD",
    availability = "InStock",
    includeReviews = true,
  } = params;

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
      "lowPrice": priceRange.split('-')[0].replace('$', ''),
      "highPrice": priceRange.split('-')[1].replace('$', ''),
      "availability": `https://schema.org/${availability}`,
      "url": url,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    }
  };

  // Add aggregate rating from Trustpilot
  if (includeReviews) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "50",
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
    authorName = "Panda Patches Team",
    authorUrl = "https://pandapatches.com/about",
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
      "@type": "Organization",
      "name": authorName,
      "url": authorUrl
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
// 8. LOCAL BUSINESS SCHEMA (optional enhancement)
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "50"
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
