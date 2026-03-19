import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OffersClient from '@/components/offers/OffersClient';
import { generateSchemaScript } from '@/lib/schemas';
import { OFFER_CATEGORIES } from '@/lib/offerPackages';
import { client, urlFor } from '@/lib/sanity';
import { getTrustpilotData } from '@/lib/reviewConstants';
import { cache } from 'react';

export const metadata: Metadata = {
  title: 'Custom Patch Packages — Fixed Prices, Free Design | Panda Patches',
  description: 'Order custom patch packages at fixed prices. Embroidered, woven, PVC, chenille and leather patches with free mockup, free shipping, and 7-14 day delivery.',
  alternates: {
    canonical: 'https://pandapatches.com/offers',
  },
  openGraph: {
    title: 'Custom Patch Packages — Fixed Prices | Panda Patches',
    description: 'Fixed-price patch packages with free mockup, free US shipping, and money-back guarantee. Embroidered, woven, PVC, chenille, leather.',
    url: 'https://pandapatches.com/offers',
    type: 'website',
    images: [{ url: 'https://pandapatches.com/assets/og-image.png', width: 1200, height: 630, alt: 'Custom patch packages at fixed prices — Panda Patches' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Patch Packages — Fixed Prices | Panda Patches',
    description: 'Fixed-price patch packages with free mockup, free US shipping, and money-back guarantee.',
    images: ['https://pandapatches.com/assets/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pandapatches.com' },
    { '@type': 'ListItem', position: 2, name: 'Offers', item: 'https://pandapatches.com/offers' },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What happens after I pay?',
      acceptedAnswer: { '@type': 'Answer', text: 'Within 24 hours, our design team emails you a digital mockup. You review, request changes, and approve. Production starts only after your sign-off.' },
    },
    {
      '@type': 'Question',
      name: 'What if I don\'t like the mockup?',
      acceptedAnswer: { '@type': 'Answer', text: 'Request as many changes as needed — all free. If we still can\'t get it right, full refund. Money-back guarantee.' },
    },
    {
      '@type': 'Question',
      name: 'What delivery options are there?',
      acceptedAnswer: { '@type': 'Answer', text: 'Economy (16-18 days, 10% off) | Standard (7-14 days, free) | Rush (50pcs +$50, 100pcs +$75, 500pcs +$150, 1000pcs +$200). Rush date confirmed by email within 2-6 hours.' },
    },
    {
      '@type': 'Question',
      name: 'What does "under 4 inches" mean?',
      acceptedAnswer: { '@type': 'Answer', text: 'The longest dimension is 4" or less — covers 90% of hat patches, left-chest and shoulder patches.' },
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept?',
      acceptedAnswer: { '@type': 'Answer', text: 'Visa, Mastercard, Amex, PayPal, Apple Pay, AfterPay, Klarna. All 256-bit SSL encrypted via Stripe.' },
    },
  ],
};

const shippingDetails = {
  '@type': 'OfferShippingDetails',
  shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 7, maxValue: 14, unitCode: 'DAY' },
  },
};

const merchantReturnPolicy = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'US',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 30,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
};

const getCtaImage = cache(async (): Promise<string | null> => {
  try {
    const data = await client.fetch(`*[_type == "cta"][0]{ backgroundImage }`, {}, { next: { revalidate: 86400 } });
    if (data?.backgroundImage) {
      return urlFor(data.backgroundImage).width(1400).quality(80).auto('format').url();
    }
    return null;
  } catch {
    return null;
  }
});

const getCategoryImages = cache(async (): Promise<Record<string, string>> => {
  try {
    const slugs = ['embroidered', 'woven', 'pvc', 'chenille', 'leather'];
    const query = `{
      ${slugs.map(s => `"${s}": *[_type == "productPage" && slug.current == "${s}"][0].gallery[0...4]`).join(',\n      ')}
    }`;
    const data: Record<string, any[]> = await client.fetch(query, {}, { next: { revalidate: 86400 } });
    const result: Record<string, string> = {};
    for (const [slug, imgs] of Object.entries(data)) {
      if (imgs && imgs.length > 0) {
        for (let i = 0; i < imgs.length; i++) {
          const key = i === 0 ? slug : `${slug}_${i}`;
          try {
            result[key] = urlFor(imgs[i].image || imgs[i]).width(500).height(500).quality(80).auto('format').fit('max').url();
          } catch { /* skip if urlFor fails */ }
        }
      }
    }
    return result;
  } catch {
    return {};
  }
});

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'woven-u4': 'Custom woven patches under 4 inches. Fixed-price packs from 50 to 1000 pieces with free US shipping, free mockup, and money-back guarantee.',
  'embroidered-u4': 'Custom embroidered patches under 4 inches. Fixed-price packs from 50 to 1000 pieces with free US shipping, free mockup, and money-back guarantee.',
  'embroidered-12in': 'Custom 12-inch embroidered patches across the chest. Fixed-price packs from 25 to 100 pieces with free US shipping and free mockup.',
  'pvc-u4': 'Custom PVC patches under 4 inches. Fixed-price packs from 50 to 1000 pieces with free US shipping, free mockup, and money-back guarantee.',
  'chenille-u4': 'Custom chenille patches under 4 inches. Fixed-price packs from 25 to 100 pieces with free US shipping and free mockup.',
  'chenille-12in': 'Custom 12-inch chenille patches. Fixed-price packs from 25 to 100 pieces with free US shipping and free mockup.',
  'leather-u4': 'Custom leather patches under 4 inches. Fixed-price packs from 50 to 1000 pieces with free US shipping, free mockup, and money-back guarantee.',
};

export default async function OffersPage() {
  const [categoryImages, ctaImageUrl, trustpilot] = await Promise.all([getCategoryImages(), getCtaImage(), getTrustpilotData()]);

  const slugSchemaCount: Record<string, number> = {};
  const productSchemas = OFFER_CATEGORIES.map(cat => {
    const count = slugSchemaCount[cat.slug] || 0;
    slugSchemaCount[cat.slug] = count + 1;
    const imgKey = count === 0 ? cat.slug : `${cat.slug}_${count}`;
    return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Custom ${cat.type} - ${cat.subtitle}`,
    description: CATEGORY_DESCRIPTIONS[cat.id] ?? `Custom ${cat.type} fixed-price packages from Panda Patches.`,
    image: categoryImages[imgKey] ?? categoryImages[cat.slug] ?? 'https://pandapatches.com/assets/og-image.png',
    brand: { '@type': 'Brand', name: 'Panda Patches' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: trustpilot.rating,
      reviewCount: String(trustpilot.reviewCount),
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Billy Bob Jackson' },
        datePublished: '2026-02-21',
        reviewBody: "They're legit!!! I saw the reviews and asked ChatGPT before ordering. My patches arrived on time and a few were messed up. I sent 1 email with pictures and they mailed me more than I said were unusable. I'll be back for more! Good quality!",
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' },
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Selena Perry' },
        datePublished: '2026-02-16',
        reviewBody: 'The quality is outstanding, durable, vibrant, and exactly what I envisioned. From my very first message, the team was friendly, responsive, and incredibly helpful. They checked in to make sure I was satisfied, and their customer service didn\'t stop after delivery. I highly recommend them!',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' },
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Taye Sims' },
        datePublished: '2025-11-28',
        reviewBody: 'My experience was quite positive. They were impressively on time with both delivery and service. The quality of the material was excellent. It felt sturdy yet flexible, which is essential for long-lasting wear. I would recommend Panda Patches for anyone looking for reliable service.',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' },
      },
    ],
    offers: cat.packs.map(pack => ({
      '@type': 'Offer',
      name: `${pack.name} Pack - ${pack.qty} pieces`,
      price: pack.price.toFixed(2),
      priceCurrency: 'USD',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url: 'https://pandapatches.com/offers',
      seller: { '@type': 'Organization', name: 'Panda Patches' },
      shippingDetails,
      hasMerchantReturnPolicy: merchantReturnPolicy,
    })),
  };
  });

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />
      {productSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(schema)} />
      ))}
      <Navbar />
      <OffersClient categoryImages={categoryImages} ctaImageUrl={ctaImageUrl ?? undefined} />
      <Footer />
    </main>
  );
}
