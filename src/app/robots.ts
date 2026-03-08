import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/', // Block Sanity CMS admin
          '/api/',    // Block API routes
        ],
      },
    ],
    sitemap: 'https://www.pandapatches.com/sitemap.xml',
  };
}
