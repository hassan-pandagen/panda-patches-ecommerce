import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Search engines: allow everything except admin/api
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',
          '/api/',
        ],
      },
      // Block AI training-only crawlers (scrape content, send zero traffic)
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },

      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'cohere-ai',
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'Amazonbot',
        disallow: '/',
      },
      {
        userAgent: 'FacebookBot',
        disallow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        disallow: '/',
      },
      {
        userAgent: 'Meta-ExternalAgent',
        disallow: '/',
      },
      // Allow AI browsing bots (they can recommend your site to users)
      // ChatGPT-User, Claude-Web, PerplexityBot = allowed via wildcard *
    ],
    sitemap: 'https://pandapatches.com/sitemap.xml',
  };
}
