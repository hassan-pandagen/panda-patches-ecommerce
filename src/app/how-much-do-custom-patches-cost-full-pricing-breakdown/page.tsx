import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSchemaScript, generateBreadcrumbSchema } from '@/lib/schemas';
import { getSchemaPricingTiers } from '@/lib/pricingCalculator';
import { TRUSTPILOT_RATING, TRUSTPILOT_REVIEW_COUNT_STR } from '@/lib/reviewConstants';

const BASE = 'https://www.pandapatches.com';
const CANONICAL = `${BASE}/how-much-do-custom-patches-cost-full-pricing-breakdown`;

export const metadata: Metadata = {
  title: 'How Much Do Custom Patches Cost? $0.71 to $7/pc (2026)',
  description:
    'Custom patches cost $0.71 to $7 per piece in 2026. Full pricing tables for embroidered, woven, PVC, chenille, and leather patches by quantity and size. Free shipping included.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'How Much Do Custom Patches Cost? $0.71 to $7/pc (2026)',
    description:
      'Custom patch pricing in 2026. From $0.71/pc at volume to $80 flat for a single patch. Full tables by type and quantity. Free mockup, free shipping.',
    url: CANONICAL,
    type: 'website',
    images: [{ url: `${BASE}/assets/og-image.png`, width: 1200, height: 630, alt: 'Custom Patch Pricing' }],
  },
  robots: { index: true, follow: true },
};

// ── Schema markup ──────────────────────────────────────────────────────────────

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: BASE },
  { name: 'Pricing', url: CANONICAL },
]);

const embTiers = getSchemaPricingTiers('Custom Embroidered Patches');
const wovenTiers = getSchemaPricingTiers('Custom Woven Patches');
const pvcTiers = getSchemaPricingTiers('Custom PVC Patches');

function buildProductSchema(
  name: string,
  description: string,
  tiers: { minQuantity: number; unitPrice: number }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: { '@type': 'Brand', name: 'Panda Patches' },
    image: `${BASE}/assets/og-image.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: TRUSTPILOT_RATING,
      reviewCount: TRUSTPILOT_REVIEW_COUNT_STR,
      bestRating: '5',
      worstRating: '1',
    },
    offers: tiers.map((t) => ({
      '@type': 'Offer',
      price: t.unitPrice.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      eligibleQuantity: { '@type': 'QuantitativeValue', minValue: t.minQuantity },
      seller: { '@type': 'Organization', name: 'Panda Patches' },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
          cutoffTime: '17:00:00-06:00',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 7, maxValue: 14 },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3 },
        },
      },
    })),
  };
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much do custom patches cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Custom embroidered patches cost $0.71 to $5.87 per piece for a 3-inch patch, depending on quantity. 25 patches = ~$5.87/pc ($147 total). 100 patches = ~$2.55/pc ($255 total). 1,000 patches = ~$1.05/pc ($1,050 total). Free shipping and free mockup included.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum order for custom patches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most patch types (embroidered, PVC, chenille, leather) have no minimum order — you can order just 1 patch. Woven patches require a minimum of 10 pieces.',
      },
    },
    {
      '@type': 'Question',
      name: 'What affects the price of custom patches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Three main factors affect patch price: (1) Quantity — more patches means a lower per-piece price. (2) Size — larger patches cost more. (3) Patch type — woven patches are typically cheaper per piece at volume than embroidered; PVC and chenille cost slightly more. Velcro backing adds $30 to the order.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the price include shipping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Free shipping is included on all orders to any US address. No hidden fees or setup charges.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a single custom patch cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A single custom embroidered patch is a flat $80. A single PVC patch is $100 flat. These cover design time and production setup for small runs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cheapest custom patch option?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Woven patches are the lowest-cost option at volume, starting at $1.49/pc at 5,000 pieces for a 3-inch patch. Embroidered patches start at $0.71/pc at 5,000 pieces and are the most popular choice.',
      },
    },
  ],
};

// ── Pricing table data ─────────────────────────────────────────────────────────

const EMBROIDED_TABLE = [
  { qty: '1', size2: '$80 flat', size3: '$80 flat', size5: '$80 flat' },
  { qty: '10', size2: '$13.07', size3: '$13.07', size5: '$15.68' },
  { qty: '25', size2: '$5.87', size3: '$5.87', size5: '$7.84' },
  { qty: '50', size2: '$3.92', size3: '$3.92', size5: '$5.23' },
  { qty: '100', size2: '$2.42', size3: '$2.55', size5: '$3.92' },
  { qty: '200', size2: '$1.89', size3: '$1.96', size5: '$2.62' },
  { qty: '500', size2: '$1.05', size3: '$1.18', size5: '$1.69' },
  { qty: '1,000', size2: '$0.91', size3: '$1.05', size5: '$1.63' },
  { qty: '5,000', size2: '$0.78', size3: '$0.90', size5: '$1.43' },
];

const WOVEN_TABLE = [
  { qty: '10', per: '$13.75' },
  { qty: '25', per: '$8.06' },
  { qty: '50', per: '$5.36' },
  { qty: '100', per: '$3.97' },
  { qty: '200', per: '$3.86' },
  { qty: '500', per: '$3.10' },
  { qty: '1,000', per: '$2.49' },
  { qty: '5,000', per: '$2.49' },
];

const PVC_TABLE = [
  { qty: '1', per: '$100 flat' },
  { qty: '25', per: '$8.67' },
  { qty: '50', per: '$6.19' },
  { qty: '100', per: '$4.33' },
  { qty: '500', per: '$3.10' },
  { qty: '1,000', per: '$2.78' },
];

const TYPE_SUMMARY = [
  { type: 'Embroidered', from: '$0.71/pc', at: '5,000 pcs', best: 'Most popular. Durable, detailed.' },
  { type: 'Woven', from: '$1.49/pc', at: '5,000 pcs', best: 'Fine detail, thin profile, low volume min (10 pcs).' },
  { type: 'PVC', from: '$1.40/pc', at: '5,000 pcs', best: 'Waterproof, 3D look, military & outdoor.' },
  { type: 'Chenille', from: '$1.19/pc', at: '5,000 pcs', best: 'Varsity/letterman style, raised texture.' },
  { type: 'Leather', from: '$1.29/pc', at: '5,000 pcs', best: 'Premium look for biker clubs and branded apparel.' },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(buildProductSchema(
        'Custom Embroidered Patches',
        'Custom embroidered patches with free mockup, free shipping, and no minimum order. From $0.71/pc at volume.',
        embTiers
      ))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(buildProductSchema(
        'Custom Woven Patches',
        'Custom woven patches with fine-detail thread, minimum 10 pieces. From $1.49/pc at volume.',
        wovenTiers
      ))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(buildProductSchema(
        'Custom PVC Patches',
        'Custom PVC patches, waterproof and 3D textured. No minimum. From $1.40/pc at volume.',
        pvcTiers
      ))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />

      {/* Answer-first hero */}
      <section className="bg-black text-white pt-20 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            How Much Do Custom Patches Cost?
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-3xl">
            Custom embroidered patches cost <strong className="text-[#dcff70]">$0.71 to $5.87 per piece</strong> for a 3-inch patch, depending on quantity. A 25-pack runs about $147 total; a 100-pack runs about $255. Free shipping and a free design mockup are included on every order. No setup fees.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/custom-patches"
              className="bg-[#dcff70] text-black px-7 py-3 rounded-xl font-bold hover:brightness-110 transition-all"
            >
              Get an Instant Quote
            </Link>
            <Link
              href="/offers"
              className="border-2 border-white text-white px-7 py-3 rounded-xl font-bold hover:bg-white hover:text-black transition-all"
            >
              View Fixed-Price Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Quick comparison */}
      <section className="py-14 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Price Range by Patch Type</h2>
          <p className="text-gray-500 text-sm mb-6">3-inch patch, US free shipping included. Prices include 10% production uplift.</p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="text-left px-5 py-3 font-bold">Type</th>
                  <th className="text-left px-5 py-3 font-bold">Starting price</th>
                  <th className="text-left px-5 py-3 font-bold hidden sm:table-cell">At quantity</th>
                  <th className="text-left px-5 py-3 font-bold hidden md:table-cell">Best for</th>
                </tr>
              </thead>
              <tbody>
                {TYPE_SUMMARY.map((row, i) => (
                  <tr key={row.type} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3 font-semibold text-gray-900">{row.type}</td>
                    <td className="px-5 py-3 text-[#00b67a] font-bold">{row.from}</td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{row.at}</td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Embroidered full table */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-1">Embroidered Patch Pricing</h2>
          <p className="text-gray-500 text-sm mb-6">Price per piece by quantity and size. Includes free shipping. Velcro backing +$30 total.</p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="text-left px-5 py-3 font-bold">Qty</th>
                  <th className="text-right px-5 py-3 font-bold">2" patch</th>
                  <th className="text-right px-5 py-3 font-bold">3" patch</th>
                  <th className="text-right px-5 py-3 font-bold">5" patch</th>
                </tr>
              </thead>
              <tbody>
                {EMBROIDED_TABLE.map((row, i) => (
                  <tr key={row.qty} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3 font-semibold text-gray-900">{row.qty}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{row.size2}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">{row.size3}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{row.size5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">Size = longest dimension. 1-pc flat fee covers design setup. No minimum order.</p>
        </div>
      </section>

      {/* Woven + PVC side by side */}
      <section className="py-14 px-6 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Woven Patch Pricing</h2>
            <p className="text-gray-500 text-sm mb-5">3" patch, per piece. Min order: 10 pcs.</p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-4 py-2 font-bold">Qty</th>
                    <th className="text-right px-4 py-2 font-bold">Per piece</th>
                  </tr>
                </thead>
                <tbody>
                  {WOVEN_TABLE.map((row, i) => (
                    <tr key={row.qty} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 font-semibold text-gray-900">{row.qty}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{row.per}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">PVC Patch Pricing</h2>
            <p className="text-gray-500 text-sm mb-5">3" patch, per piece. No minimum.</p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left px-4 py-2 font-bold">Qty</th>
                    <th className="text-right px-4 py-2 font-bold">Per piece</th>
                  </tr>
                </thead>
                <tbody>
                  {PVC_TABLE.map((row, i) => (
                    <tr key={row.qty} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 font-semibold text-gray-900">{row.qty}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{row.per}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* What affects price */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8">What Affects Patch Price?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                num: '1',
                title: 'Quantity',
                body: 'The biggest driver. 100 patches cost roughly half as much per piece as 25 patches. Volume discounts are built into every tier automatically.',
              },
              {
                num: '2',
                title: 'Size',
                body: 'Price is based on the longest dimension, rounded up to the nearest inch. A 3" patch and a 3.5" patch are billed at the 4" rate.',
              },
              {
                num: '3',
                title: 'Patch type',
                body: 'Embroidered and woven are the most affordable. PVC and chenille cost slightly more. Leather is mid-range. Velcro backing adds a flat $30 to any order.',
              },
            ].map((item) => (
              <div key={item.num} className="bg-gray-50 rounded-2xl p-6">
                <div className="w-10 h-10 bg-black text-[#dcff70] rounded-full flex items-center justify-center font-black text-lg mb-4">
                  {item.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#dcff70] rounded-2xl p-6">
            <h3 className="font-black text-gray-900 mb-2 text-lg">What's always included — free</h3>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-800">
              {[
                'Free digital mockup within 24 hours',
                'Unlimited revisions until you approve',
                'Free shipping to any US address',
                'No setup fees or design fees',
                'No hidden charges',
                'Money-back guarantee',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-green-700 font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Use the calculator CTA */}
      <section className="py-10 px-6 bg-black">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-xl">Want an exact price for your order?</p>
            <p className="text-gray-400 text-sm mt-1">Enter your patch type, size, and quantity for an instant total.</p>
          </div>
          <Link
            href="/custom-patches"
            className="bg-[#dcff70] text-black px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all whitespace-nowrap"
          >
            Use the Pricing Calculator
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Pricing FAQs</h2>
          <div className="space-y-6">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Order?</h2>
          <p className="text-gray-300 mb-8">
            Free mockup in 24 hours. No minimum on most styles. {TRUSTPILOT_RATING} stars from {TRUSTPILOT_REVIEW_COUNT_STR} verified buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/custom-patches"
              className="bg-[#dcff70] text-black px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/offers"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all"
            >
              See Fixed-Price Packages
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
