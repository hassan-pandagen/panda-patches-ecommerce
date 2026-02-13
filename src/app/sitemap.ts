import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pandapatches.com';

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
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/custom-patches`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/custom-products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sample-box`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Product pages (highest priority for SEO)
  const productPages: MetadataRoute.Sitemap = (data.products || []).map((product: any) => ({
    url: `${baseUrl}/custom-patches/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Custom product pages (coins, pins, keychains)
  const customProductPages: MetadataRoute.Sitemap = (data.customProducts || []).map((product: any) => ({
    url: `${baseUrl}/custom-products/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Blog posts (good for SEO)
  const blogPages: MetadataRoute.Sitemap = (data.blogs || []).map((blog: any) => ({
    url: `${baseUrl}/${blog.slug}`,
    lastModified: new Date(blog._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Location pages (local SEO)
  const locationPages: MetadataRoute.Sitemap = (data.locations || []).map((location: any) => ({
    url: `${baseUrl}/${location.slug}`,
    lastModified: new Date(location._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Patch style pages (category SEO)
  const patchStylePages: MetadataRoute.Sitemap = (data.patchStyles || []).map((style: any) => ({
    url: `${baseUrl}/${style.slug}`,
    lastModified: new Date(style._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Asset pages (thread charts, iron-on instructions)
  const assetPages: MetadataRoute.Sitemap = (data.assets || []).map((asset: any) => ({
    url: `${baseUrl}/assets/${asset.slug}`,
    lastModified: new Date(asset._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const ironOnPages: MetadataRoute.Sitemap = (data.ironOn || []).map((iron: any) => ({
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
