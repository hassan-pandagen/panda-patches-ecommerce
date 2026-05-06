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
    return {
      title: `${pageTitle} | No Minimum, Free Mockup | Panda Patches`,
      description: `Order ${pageTitle.toLowerCase()} with no minimum, free digital mockup in 24 hours, and 7-14 day delivery. 4.8 stars on Trustpilot. Money-back guarantee.`,
      alternates: { canonical: `https://www.pandapatches.com/${slug}` },
      robots: { index: true, follow: true },
      openGraph: {
        title: `${pageTitle} | Panda Patches`,
        description: `${pageTitle} with free mockup, no minimum, and 7-14 day delivery.`,
        url: `https://www.pandapatches.com/${slug}`,
        siteName: 'Panda Patches',
        type: 'website',
        images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${pageTitle} | Panda Patches`,
        description: `${pageTitle} with free mockup, no minimum, and 7-14 day delivery.`,
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
    const blogTitle = data.blog.metaTitle
      ? `${data.blog.metaTitle} | Panda Patches`
      : `${data.blog.title} | Panda Patches Blog`;
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

    const howToSchema = data.blog.howToSteps?.length > 0 ? {
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
      description: `${pageTitle} with no minimum order, free digital mockup in 24 hours, and 7-14 day delivery. 4.8 stars on Trustpilot.`,
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
          customSubheading="No Minimum Order. Free Digital Mockup. 7-14 Day Delivery."
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
