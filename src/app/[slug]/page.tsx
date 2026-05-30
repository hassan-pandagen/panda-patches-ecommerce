import type { Metadata } from "next";
import { client, urlFor } from "@/lib/sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogPostLayout from "@/components/blog/BlogPostLayout";
import LocationLayout from "@/components/locations/LocationLayout";
import { generateArticleSchema, generateBreadcrumbSchema, generateLocationBusinessSchema, generateSchemaScript, generateFAQSchema } from "@/lib/schemas";
import { getSanityOgImage } from "@/lib/sanityOgImage";
import cityPageMeta from "@/lib/cityPageMeta";
import patchStyleMeta from "@/lib/patchStyleMeta";
import { getPatchStyleProductSchema } from "@/lib/patchStyleProductSchema";
import { TRUSTPILOT_RATING, TRUSTPILOT_REVIEW_COUNT_STR } from "@/lib/reviewConstants";
import BulkHero from "@/components/bulk/BulkHero";
import WorkGallery from "@/components/bulk/WorkGallery";
import CategoryFAQ from "@/components/bulk/CategoryFAQ";
import TrustStrip from "@/components/products/TrustStrip";
import Craftsmanship from "@/components/home/Craftsmanship";
import ReviewsSection from "@/components/home/ReviewsSection";
import Promises from "@/components/home/Promises";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PortableText } from "@portabletext/react";

// ISR: Revalidate blog/location/patch-style pages every 1 hour
export const revalidate = 3600;

// Dynamic metadata for Google/AI search engines
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData(slug);

  // Location page metadata
  if (data.location) {
    const locationName = data.location.locationName;
    const ogImage = await getSanityOgImage();
    // Use city-specific meta if available, otherwise fall back to generic
    const meta = cityPageMeta[slug];
    const pageTitle = meta?.title || `Custom Patches in ${locationName} | Panda Patches`;
    const pageDesc = meta?.description || `Order custom embroidered patches in ${locationName}. Low minimums, free mockups, fast 7-14 day turnaround. Get a free quote today!`;
    const ogDesc = meta?.ogDescription || `Custom patches delivered anywhere in ${locationName}. Low minimums, free design, fast shipping.`;
    return {
      title: pageTitle,
      description: pageDesc,
      alternates: { canonical: `https://www.pandapatches.com/${slug}` },
      robots: { index: true, follow: true },
      openGraph: {
        title: pageTitle,
        description: ogDesc,
        url: `https://www.pandapatches.com/${slug}`,
        siteName: 'Panda Patches',
        type: 'website',
        images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: ogDesc,
        images: [ogImage],
      },
    };
  }

  // Patch style page metadata
  if (data.patchStyle) {
    const styleName = data.patchStyle.title;
    const ogImage = await getSanityOgImage();
    // Use slug-specific meta if available, otherwise use generic template
    const meta = patchStyleMeta[slug];
    // Strip leading "Custom " from styleName to avoid "custom Custom X" in descriptions
    const nameForDesc = styleName.toLowerCase().startsWith('custom ') ? styleName.slice(7) : styleName;
    const pageTitle = meta?.title || `${styleName} | Panda Patches`;
    const pageDesc = meta?.description || `Order custom ${nameForDesc} with low minimums, free design services, and fast 7-14 day delivery. Get a free quote today!`;
    const ogTitle = meta?.ogTitle || pageTitle;
    const ogDesc = meta?.ogDescription || `Custom ${nameForDesc} with free mockups and fast delivery.`;
    return {
      title: pageTitle,
      description: pageDesc,
      alternates: { canonical: `https://www.pandapatches.com/${slug}` },
      openGraph: {
        title: ogTitle,
        description: ogDesc,
        url: `https://www.pandapatches.com/${slug}`,
        siteName: 'Panda Patches',
        type: 'website',
        images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDesc,
        images: [ogImage],
      },
    };
  }

  // Category page metadata (military, motorcycle club, school, fraternity, etc.)
  if (data.categoryPage) {
    const pageTitle = data.categoryPage.title || "Custom Patches";
    const ogImage = await getSanityOgImage();
    // Strip any existing "| Panda Patches" suffix so we never double-append
    const cleanTitle = pageTitle.replace(/\s*\|\s*Panda Patches\s*$/i, '').trim();
    return {
      title: `${cleanTitle} | Low 5-Piece Minimum, Free Mockup | Panda Patches`,
      description: `Order ${cleanTitle.toLowerCase()} with a 5-piece minimum, free digital mockup in 24 hours, and 7-14 day delivery. 4.8 stars on Trustpilot. Money-back guarantee.`,
      alternates: { canonical: `https://www.pandapatches.com/${slug}` },
      robots: { index: true, follow: true },
      openGraph: {
        title: `${cleanTitle} | Panda Patches`,
        description: `${cleanTitle} with free mockup, 5-piece minimum, and 7-14 day delivery.`,
        url: `https://www.pandapatches.com/${slug}`,
        siteName: 'Panda Patches',
        type: 'website',
        images: [{ url: ogImage, width: 1200, height: 630, alt: cleanTitle }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${cleanTitle} | Panda Patches`,
        description: `${cleanTitle} with free mockup, 5-piece minimum, and 7-14 day delivery.`,
        images: [ogImage],
      },
    };
  }

  // Blog post metadata
  if (data.blog) {
    const imageUrl = data.blog.mainImage
      ? urlFor(data.blog.mainImage).width(1200).height(630).fit('crop').format('jpg').quality(80).url()
      : data.blog.image
        ? urlFor(data.blog.image).width(1200).height(630).fit('crop').format('jpg').quality(80).url()
        : 'https://www.pandapatches.com/assets/og-image.png';
    // Title suffix logic: only append "| Panda Patches" if not already present.
    // Editor-supplied metaTitle often already includes the brand suffix; appending again
    // creates the "Title | Panda Patches | Panda Patches" duplicate seen in Google SERPs.
    const appendBrand = (s: string) =>
      /\|\s*Panda Patches\s*$/i.test(s.trim()) ? s.trim() : `${s.trim()} | Panda Patches`;
    const blogTitle = data.blog.metaTitle
      ? appendBrand(data.blog.metaTitle)
      : appendBrand(`${data.blog.title} Blog`);
    const blogDesc = data.blog.metaDescription || data.blog.excerpt || data.blog.description || 'Custom patch tips, tutorials, and industry insights from Panda Patches.';
    return {
      title: blogTitle,
      description: blogDesc,
      alternates: { canonical: `https://www.pandapatches.com/${slug}` },
      robots: { index: true, follow: true },
      openGraph: {
        title: data.blog.title,
        description: blogDesc,
        url: `https://www.pandapatches.com/${slug}`,
        siteName: 'Panda Patches',
        type: 'article',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: data.blog.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: blogTitle,
        description: blogDesc,
        images: [imageUrl],
      },
    };
  }

  return {
    title: 'Panda Patches | Custom Iron On Patches',
    description: 'Low Minimums, Quick Delivery!',
  };
}

// Fetch Logic: Try to find Blog, Location Page, OR Patch Style Page
async function getData(slug: string) {
  // Validate slug format to prevent injection (alphanumeric, hyphens, and underscores only)
  if (!/^[a-z0-9-_]+$/i.test(slug)) {
    return { blog: null, location: null, patchStyle: null };
  }

  // Use parameterized query to prevent GROQ injection
  // Explicitly exclude drafts to only get published documents
  const query = `
    {
      "blog": *[_type == "blog" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
        ...,
        "resolvedImageUrl": coalesce(mainImage.asset->url, image.asset->url)
      },
      "location": *[_type == "locationPage" && slug.current == $slug && !(_id in path("drafts.**"))][0],
      "patchStyle": *[_type == "patchStyle" && slug.current == $slug && !(_id in path("drafts.**"))][0],
      "categoryPage": *[_type == "categoryPage" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
        title,
        "heroImage": {
          "url": heroImage.asset->url,
          "alt": heroImage.alt
        },
        "workSamples": workSamples[]{ "image": @, "alt": alt },
        seoHeading,
        seoContent,
        "faqItems": faqItems[]{ question, answer }
      },
      "trustBadges": *[_type == "hero"][0].trustBadges[]{ "url": image.asset->url, "alt": alt }
    }
  `;
  const data = await client.fetch(query, { slug });
  return data;
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getData(slug);

  // OPTION A: It's a Patch Style Page (e.g., "custom-anime-patches")
  if (data.patchStyle) {
    // Product schema for all patchStyle pages
    const patchStyleProductSchema = getPatchStyleProductSchema(slug, data.patchStyle.title);

    return (
      <>
        {patchStyleProductSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={generateSchemaScript(patchStyleProductSchema)}
          />
        )}
        <LocationLayout data={{
          locationName: data.patchStyle.title,
          gallery: data.patchStyle.gallery,
          seoSection1: data.patchStyle.seoContent1,
          seoSection2: data.patchStyle.seoContent2,
          isPatchStyle: true
        }} slug={slug} />
      </>
    );
  }

  // OPTION B: It's a Location Page (e.g., "custom-patches-in-alabama")
  if (data.location) {
    const locationSchema = generateLocationBusinessSchema(data.location.locationName, slug);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(locationSchema)}
        />
        <LocationLayout data={data.location} slug={slug} />
      </>
    );
  }

  // OPTION C: It's a Blog Post
  if (data.blog) {
    // Generate Article schema for SEO
    const articleSchema = generateArticleSchema({
      title: data.blog.title || "Blog Post",
      description: data.blog.description || data.blog.excerpt || "Read our latest blog post about custom patches.",
      datePublished: data.blog.publishedAt || data.blog._createdAt || new Date().toISOString(),
      dateModified: data.blog._updatedAt || data.blog.publishedAt || data.blog._createdAt || new Date().toISOString(),
      image: data.blog.mainImage
        ? urlFor(data.blog.mainImage).width(1200).height(630).fit('crop').format('jpg').quality(80).url()
        : data.blog.image
          ? urlFor(data.blog.image).width(1200).height(630).fit('crop').format('jpg').quality(80).url()
          : 'https://www.pandapatches.com/assets/og-image.png',
      url: `https://www.pandapatches.com/${slug}`,
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: "Home", url: "https://www.pandapatches.com" },
      { name: "Blog", url: "https://www.pandapatches.com/blogs" },
      { name: data.blog.title || "Blog Post", url: `https://www.pandapatches.com/${slug}` },
    ]);

    const faqSchema = data.blog.faqItems?.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.blog.faqItems.map((item: { question: string; answer: string }) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer,
        },
      })),
    } : null;

    // HowTo schema: opt-in only via Sanity `enableHowToSchema` boolean field.
    // Google deprecated the HowTo rich result in September 2023 — emitting HowTo
    // by default wastes crawl budget and triggers no SERP feature. Editors must
    // explicitly enable it per-post if there is a specific reason.
    const howToSchema = (data.blog.enableHowToSchema && data.blog.howToSteps?.length > 0) ? {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to Order ${data.blog.title?.replace(/:.*/,'')} from Panda Patches`,
      "description": "Order custom patches in 5 simple steps. Free mockup within 24 hours, free US shipping, no setup fees.",
      "totalTime": "PT5M",
      "supply": [
        { "@type": "HowToSupply", "name": "Artwork file or design idea" },
      ],
      "step": data.blog.howToSteps.map((step: { name: string; text: string }, i: number) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": step.name,
        "text": step.text,
        "url": `https://www.pandapatches.com/${slug}#how-to-order`,
      })),
    } : null;

    // Image source for Product / Merchant Listing schema.
    // Use GROQ-resolved URL directly (coalesce mainImage → image → OG fallback)
    // so Google always sees a valid image URL in the schema.
    const productImage = data.blog.resolvedImageUrl
      ? `${data.blog.resolvedImageUrl}?w=1200&h=630&fit=crop&auto=format`
      : 'https://www.pandapatches.com/assets/og-image.png';

    // Shared shipping details for every Offer — free US shipping, 1-2 day handling, 7-14 day transit
    const productShippingDetails = {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
      "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "DAY" },
        "transitTime": { "@type": "QuantitativeValue", "minValue": 7, "maxValue": 14, "unitCode": "DAY" },
      },
    };

    // Shared return policy — money-back guarantee, 30-day window, free return
    const productReturnPolicy = {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "US",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/FreeReturn",
    };

    const productSchema = data.blog.productOffers?.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": data.blog.title,
      "image": productImage,
      "brand": { "@type": "Brand", "name": "Panda Patches" },
      "description": data.blog.metaDescription || data.blog.excerpt || "",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": TRUSTPILOT_RATING,
        "reviewCount": TRUSTPILOT_REVIEW_COUNT_STR,
        "bestRating": "5",
        "worstRating": "1",
      },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Adam Stranc" },
          "datePublished": "2026-04-14",
          "reviewBody": "Ordering was easy, production was fast, and the patches look amazing! Will be ordering again soon.",
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        },
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Selena Perry" },
          "datePublished": "2026-02-16",
          "reviewBody": "I had an excellent experience ordering my patches. The quality is outstanding, durable, vibrant, and exactly what I envisioned. From my very first message, the team was friendly, responsive, and incredibly helpful.",
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        },
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Taye Sims" },
          "datePublished": "2025-11-28",
          "reviewBody": "My experience with Panda Patches was quite positive. They were impressively on time with both delivery and service. The quality of the material used for the patches was excellent.",
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        },
      ],
      "offers": data.blog.productOffers.map((offer: { name: string; price: number; description?: string }) => ({
        "@type": "Offer",
        "name": offer.name,
        "price": offer.price.toFixed(2),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "Panda Patches" },
        "shippingDetails": productShippingDetails,
        "hasMerchantReturnPolicy": productReturnPolicy,
        ...(offer.description ? { "description": offer.description } : {}),
      })),
    } : null;

    return (
      <>
        {/* Article Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(articleSchema)}
        />
        {/* BreadcrumbList Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)}
        />
        {/* FAQPage Schema for rich results */}
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={generateSchemaScript(faqSchema)}
          />
        )}
        {/* HowTo Schema for "How to Order" rich results */}
        {howToSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={generateSchemaScript(howToSchema)}
          />
        )}
        {/* Product Schema for price rich snippets */}
        {productSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={generateSchemaScript(productSchema)}
          />
        )}
        {/* Slug-specific FAQ override for top manufacturers post */}
        {slug === 'top-10-custom-patch-manufacturers-in-the-usa-2026-honest-review' && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Who is the best custom patch manufacturer in the USA in 2026?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Panda Patches ranks as the top overall custom patch manufacturer in the USA for 2026, recognized for pricing transparency, a verified 4.8-star Trustpilot rating, and a strict approval-before-production policy — nothing is manufactured until the customer signs off on the digital mockup. They offer embroidered, woven, PVC, chenille, and leather patches with a 5-piece minimum, no setup fees, free digital mockup within 24 hours, unlimited free revisions, free US shipping, and a money-back guarantee. Standard turnaround is 7-14 business days."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What should I look for when choosing a custom patch manufacturer in the USA?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "When choosing a custom patch manufacturer, look for: (1) No setup fees — many companies charge $25-75 per design; (2) Free digital proof before production starts; (3) Approval policy — production should never start without your written sign-off; (4) Verified reviews on Trustpilot or Google, not just the company's own site; (5) Clear turnaround time — standard is 7-14 business days; (6) A low minimum of 5-10 pieces; (7) Free US shipping included in the price. Panda Patches meets all seven criteria."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which custom patch companies have a low minimum order in the USA?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Panda Patches offers custom patches with a 5-piece minimum — one of the lowest in the US patch market with no setup fees and no digitizing fees. Other companies with low minimums include GS-JJ, The American Patch, and Vivipins, though minimums and fees vary. Panda Patches is unique in combining a low 5-piece minimum, no setup fee, free mockup within 24 hours, and a money-back guarantee on a single order."
                  }
                },
              ]
            })}}
          />
        )}
        <BlogPostLayout post={data.blog} slug={slug} />
      </>
    );
  }

  // OPTION D: Sanity-driven Category Page (military, motorcycle club, school, fraternity, etc.)
  if (data.categoryPage) {
    const cp = data.categoryPage;
    const pageTitle = cp.title || "Custom Patches";

    const categoryProductSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: pageTitle,
      description: `${pageTitle} with a 5-piece minimum, free digital mockup in 24 hours, and 7-14 day delivery. 4.8 stars on Trustpilot.`,
      image: "https://www.pandapatches.com/assets/og-image.png",
      brand: { "@type": "Brand", name: "Panda Patches" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "0.85",
        highPrice: "4.50",
        offerCount: "3",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2027-01-01",
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 10, maxValue: 14, unitCode: "DAY" },
            transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "DAY" },
          },
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "57",
        bestRating: "5",
      },
    };

    const categoryBreadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pandapatches.com" },
        { "@type": "ListItem", position: 2, name: "Bulk Orders", item: "https://www.pandapatches.com/bulk-custom-patches" },
        { "@type": "ListItem", position: 3, name: pageTitle, item: `https://www.pandapatches.com/${slug}` },
      ],
    };

    const categoryFaqSchema = cp.faqItems?.length > 0 ? generateFAQSchema(cp.faqItems) : null;

    return (
      <main className="min-h-screen bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(categoryProductSchema)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(categoryBreadcrumbSchema)} />
        {categoryFaqSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(categoryFaqSchema)} />
        )}
        {slug === 'custom-woven-patches' && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Where can I order custom woven patches in small quantities?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Panda Patches offers custom woven patches in small quantities with a low 5-piece minimum. Woven patches use fine thread for sharper detail and small text than embroidered patches, ideal for clothing brands, hat patches, and logo labels. Free digital mockup within 24 hours, unlimited free revisions, free US shipping, no setup fees, and a money-back guarantee. Standard turnaround is 7-14 business days."
                }
              },
              {
                "@type": "Question",
                "name": "What is the minimum order for custom woven patches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "At Panda Patches, the minimum order for custom woven patches is 5 pieces. No setup fees, no digitizing fees. Woven patches are ideal for clothing brand labels, hat patches, and designs with fine detail or small text. Free digital mockup within 24 hours on every order."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between woven and embroidered patches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Woven patches use thinner thread on a tighter weave for a flatter, more detailed result — ideal for small text, fine lines, and intricate logos. Embroidered patches use thicker thread for a raised, textured look — best for bold logos and solid color designs. Woven patches are the standard choice for clothing brand labels and hat patches. Panda Patches makes both with a 5-piece minimum."
                }
              }
            ]
          })}}
          />
        )}
        {slug === 'custom-embroidered-patches' && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Where can I order custom embroidered patches with a low minimum order?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Panda Patches offers custom embroidered patches with a low 5-piece minimum, no setup fees, no digitizing fees. Free digital mockup within 24 hours, unlimited free revisions until you approve, free US shipping, and a money-back guarantee. Standard turnaround is 7-14 business days. Pricing: 50 patches for $180 ($3.60/pc), 100 for $240 ($2.40/pc), 500 for $750 ($1.50/pc), 1,000 for $1,200 ($1.20/pc)."
                }
              },
              {
                "@type": "Question",
                "name": "Do custom embroidered patches come with a free mockup?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Every order at Panda Patches includes a free digital mockup within 24 hours. Unlimited free revisions are included — request as many changes as needed until you are 100% satisfied. Production starts only after your written approval. No setup fees, no digitizing fees on any order size."
                }
              },
              {
                "@type": "Question",
                "name": "Where can I get custom patches with free mockup and no setup fees?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Panda Patches provides custom patches with a free digital mockup within 24 hours and zero setup fees on every order. All five patch types — embroidered, woven, PVC, chenille, and leather — come with free mockup, free unlimited revisions, free US shipping, and no setup or digitizing fees. Minimum order is 5 pieces. Production starts only after your written approval."
                }
              }
            ]
          })}}
          />
        )}
        {slug === 'custom-chenille-patches' && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Where can I buy custom chenille patches for letterman jackets?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Panda Patches makes custom chenille patches for letterman jackets and varsity jackets with a low 5-piece minimum. Chenille patches feature the classic raised, fuzzy varsity texture with felt backing — standard for school letters, mascots, sport award patches, and club emblems. Options include iron-on or sew-on backing. Free digital mockup within 24 hours, unlimited free revisions, free US shipping, and a money-back guarantee. Standard turnaround is 7-14 business days. Rush available."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between chenille and embroidered patches for varsity jackets?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Chenille patches have a soft, raised, fuzzy pile texture made from thick yarn — the traditional look for varsity letters, mascots, and award patches on letterman jackets. They are typically 4-12 inches and have a felt backing. Embroidered patches are flat, detailed, and durable — better for jerseys, uniform sleeves, and bags. For letterman jackets, chenille is the standard. For game jerseys and uniforms, embroidered is preferred. Panda Patches makes both with a 5-piece minimum."
                }
              },
              {
                "@type": "Question",
                "name": "Can I order chenille patches for a letterman jacket in small quantities?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Panda Patches offers chenille patches for letterman jackets with a 5-piece minimum. Custom shapes, school colors, mascots, sport icons, year patches, and club emblems. Sew-on or iron-on backing. Free mockup in 24 hours, unlimited revisions, free US shipping, money-back guarantee."
                }
              }
            ]
          })}}
          />
        )}
        {slug === 'custom-leather-patches' && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Where can I get custom leather patches for hats with fast turnaround?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Panda Patches makes custom leather patches for hats with a 7-14 business day standard turnaround and rush production available. Laser-engraved and debossed leather patches for snapbacks, dad hats, beanies, and trucker hats. Low 5-piece minimum. Free digital mockup within 24 hours, unlimited free revisions, free US shipping. Heat-press and sew-on backing included. Production starts only after your written approval."
                }
              },
              {
                "@type": "Question",
                "name": "What is the turnaround time for custom leather hat patches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "At Panda Patches, standard turnaround for custom leather patches is 7-14 business days after design approval. Rush production is available — turnaround confirmed by email within 2-6 hours of ordering. Every order includes a free digital mockup within 24 hours and unlimited free revisions before production begins. Free US shipping on all orders."
                }
              },
              {
                "@type": "Question",
                "name": "Can I order custom leather patches for hats in small quantities?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Panda Patches offers custom leather patches for hats with a 5-piece minimum. Options include laser-engraved, debossed, and embossed leather patches in any shape. Popular for snapback hats, dad hats, beanies, and trucker hats for clothing brands, merch drops, and small businesses. No setup fees, free mockup, free US shipping."
                }
              }
            ]
          })}}
          />
        )}
        {slug === 'custom-pvc-patches' && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Where can I buy custom PVC patches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Panda Patches offers custom PVC patches with a low 5-piece minimum. Fully waterproof, flexible 2D or 3D molded PVC in any shape, size, and color. Backing options: sew-on (free), iron-on (free), or hook-and-loop Velcro (+$30). Free digital mockup within 24 hours, unlimited free revisions, free US shipping, no setup fees, money-back guarantee. Standard turnaround 7-14 business days. Rush available. Popular for tactical gear, military units, schools, sports teams, motorcycle clubs, and clothing brands."
                }
              },
              {
                "@type": "Question",
                "name": "Which custom PVC patch suppliers handle small orders for school programs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Panda Patches handles small orders of custom PVC patches for school programs with a low 5-piece minimum. Suitable for school clubs, robotics teams, NHS chapters, sports teams, and spirit wear. Free digital mockup within 24 hours, unlimited free revisions, free US shipping, no setup fees. Standard turnaround 7-14 business days. PVC patches are waterproof and durable — ideal for backpacks, uniforms, jackets, and outdoor gear used by students."
                }
              },
              {
                "@type": "Question",
                "name": "Where can I get custom PVC patches made for tactical gear and military units?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Panda Patches makes custom PVC patches for tactical gear, military units, law enforcement, and first responders. Waterproof, weather-resistant, durable — ideal for plate carriers, rucksacks, uniforms, and outdoor equipment. 2D and 3D molded designs, hook-and-loop Velcro backing (+$30), sew-on, or iron-on. 5-piece minimum, free digital mockup within 24 hours, free US shipping, 7-14 business day turnaround. Common uses: unit insignia, morale patches, name tapes, blood type patches, flag patches, call sign patches."
                }
              },
              {
                "@type": "Question",
                "name": "Can I order custom PVC morale patches in small quantities?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Panda Patches offers custom PVC morale patches with a low 5-piece minimum. Full color, 2D or 3D molded PVC, hook-and-loop or sew-on backing. Free digital mockup within 24 hours, unlimited free revisions, free US shipping. Standard delivery 7-14 business days. Rush available."
                }
              }
            ]
          })}}
          />
        )}
        {slug === 'custom-motorcycle-club-patches' && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Where can I get motorcycle club patches made?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Panda Patches makes custom motorcycle club patches including top rockers, bottom rockers, center patches, and full back patch sets. They offer embroidered, woven, and PVC patches with a 5-piece minimum, sew-on or iron-on backing, free digital mockup within 24 hours, unlimited free revisions, and free US shipping. Standard turnaround is 7-14 business days. Velcro backing is available for +$30. All MC patches are made to order with production starting only after customer approval."
                }
              },
              {
                "@type": "Question",
                "name": "What type of patch is best for a motorcycle club vest?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Embroidered patches are the traditional choice for motorcycle club vests — high stitch density, durable, and the classic biker look. Sew-on backing is recommended for leather and denim vests as iron-on adhesive does not bond reliably to those materials. For a full MC set (top rocker, center patch, bottom rocker), order all pieces together so colors and borders match exactly. Panda Patches produces complete MC patch sets with a 5-piece minimum."
                }
              },
              {
                "@type": "Question",
                "name": "Can I order a 3-piece motorcycle club patch set in small quantities?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Panda Patches produces 3-piece motorcycle club patch sets — top rocker, center patch, and bottom rocker — with a 5-piece minimum. You can order as few as 5 sets. Free digital mockup within 24 hours, unlimited revisions, sew-on backing included free, and free US shipping on every order."
                }
              }
            ]
          })}}
          />
        )}

        <Navbar />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Bulk Orders", href: "/bulk-custom-patches" },
          ]}
          currentPage={pageTitle}
        />

        <BulkHero
          heroImage={cp.heroImage?.url || null}
          trustBadges={data.trustBadges || []}
          customHeading={pageTitle}
          customSubheading="Low 5-Piece Minimum. Free Digital Mockup. 7-14 Day Delivery."
          customDescription="Professional patches with free design service, unlimited revisions, and money-back guarantee. Trusted by 4,000+ bulk customers nationwide."
        />

        <WorkGallery samples={cp.workSamples || []} />
        <TrustStrip />
        <Craftsmanship />
        <ReviewsSection />
        <Promises bgColor="bg-white" />
        <ProcessSection />

        {cp.faqItems && cp.faqItems.length > 0 && (
          <CategoryFAQ title={`${pageTitle} — FAQ`} faqs={cp.faqItems} />
        )}

        {cp.seoContent && cp.seoContent.length > 0 && (
          <section className="w-full py-8 md:py-12 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-[900px]">
              {cp.seoHeading && (
                <h2 className="text-[24px] md:text-[32px] font-black text-panda-dark mb-6">
                  {cp.seoHeading}
                </h2>
              )}
              <div className="text-[15px] md:text-[16px] text-gray-600 leading-[1.8] space-y-4 prose prose-sm max-w-none">
                <PortableText value={cp.seoContent} />
              </div>
            </div>
          </section>
        )}

        <CTASection />
        <Footer />
      </main>
    );
  }

  // OPTION E: 404 Not Found
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-black text-panda-dark">Page Not Found</h1>
        <p className="text-gray-500">
          We couldn&apos;t find a page or blog post at <span className="font-mono bg-gray-100 px-2 py-1">{slug}</span>
        </p>
      </div>
      <Footer />
    </div>
  );
}
