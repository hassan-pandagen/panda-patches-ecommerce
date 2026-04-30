import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';

interface SanitySlugItem {
  slug: string;
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.pandapatches.com';

  // Fetch all dynamic content from Sanity
  const query = `{
    "products": *[_type == "productPage" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "customProducts": *[_type == "customProductPage" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "blogs": *[_type == "blog" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "locations": *[_type == "locationPage" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "patchStyles": *[_type == "patchStyle" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "assets": *[_type == "assetResource" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "ironOn": *[_type == "ironOn" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt }
  }`;

  const data = await client.fetch(query);

  // Static pages with highest priority
  // Note: lastModified uses fixed dates (not new Date()) so Google doesn't think pages
  // change on every deploy — only update these when you actually update the page content.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ai-info`,
      lastModified: new Date('2026-04-11'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date('2026-04-30'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date('2026-04-16'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/custom-patches`,
      lastModified: new Date('2026-02-15'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bulk-custom-patches`,
      lastModified: new Date('2026-02-15'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/custom-products`,
      lastModified: new Date('2026-02-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/custom-police-patches`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-sports-patches`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-corporate-patches`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-fire-department-patches`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sample-box`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/how-much-do-custom-patches-cost-full-pricing-breakdown`,
      lastModified: new Date('2026-04-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Product pages (highest priority for SEO)
  const productPages: MetadataRoute.Sitemap = (data.products || []).map((product: SanitySlugItem) => ({
    url: `${baseUrl}/custom-patches/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Custom product pages (coins, pins, keychains)
  const customProductPages: MetadataRoute.Sitemap = (data.customProducts || []).map((product: SanitySlugItem) => ({
    url: `${baseUrl}/custom-products/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Blog posts (good for SEO)
  const blogPages: MetadataRoute.Sitemap = (data.blogs || []).map((blog: SanitySlugItem) => ({
    url: `${baseUrl}/${blog.slug}`,
    lastModified: new Date(blog._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Location pages (local SEO)
  const locationPages: MetadataRoute.Sitemap = (data.locations || []).map((location: SanitySlugItem) => ({
    url: `${baseUrl}/${location.slug}`,
    lastModified: new Date(location._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Patch style pages (category SEO)
  const patchStylePages: MetadataRoute.Sitemap = (data.patchStyles || []).map((style: SanitySlugItem) => ({
    url: `${baseUrl}/${style.slug}`,
    lastModified: new Date(style._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Asset pages (thread charts, iron-on instructions)
  const assetPages: MetadataRoute.Sitemap = (data.assets || []).map((asset: SanitySlugItem) => ({
    url: `${baseUrl}/assets/${asset.slug}`,
    lastModified: new Date(asset._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const ironOnPages: MetadataRoute.Sitemap = (data.ironOn || []).map((iron: SanitySlugItem) => ({
    url: `${baseUrl}/assets/${iron.slug}`,
    lastModified: new Date(iron._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Combine all pages
  return [
    ...staticPages,
    ...productPages,
    ...customProductPages,
    ...blogPages,
    ...locationPages,
    ...patchStylePages,
    ...assetPages,
    ...ironOnPages,
  ];
}
