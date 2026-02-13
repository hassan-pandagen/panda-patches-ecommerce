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
    sitemap: 'https://pandapatches.com/sitemap.xml',
  };
}
