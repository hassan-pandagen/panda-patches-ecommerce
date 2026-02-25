/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://pandapatches.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/api/*',
    '/success',
    '/success-paypal',
    '/error-payment',
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    additionalSitemaps: [
      'https://pandapatches.com/server-sitemap.xml', // For dynamic blog posts
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
    // Custom priority based on page type
    let priority = config.priority;
    let changefreq = config.changefreq;

    // Homepage - highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Product pages - high priority
    else if (path.includes('/custom-patches/') || path.includes('/custom-products/')) {
      priority = 0.9;
      changefreq = 'weekly';
    }
    // Category pages - medium-high priority
    else if (
      path.includes('/custom-military-patches') ||
      path.includes('/custom-police-patches') ||
      path.includes('/custom-sports-patches') ||
      path.includes('/custom-corporate-patches') ||
      path.includes('/custom-fire-department-patches')
    ) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    // Blog listing and posts - medium priority
    else if (path.includes('/blogs') || path.includes('/blog/')) {
      priority = 0.7;
      changefreq = 'weekly';
    }
    // About, Contact - medium priority
    else if (path.includes('/about') || path.includes('/contact')) {
      priority = 0.8;
      changefreq = 'monthly';
    }
    // Other pages - lower priority
    else {
      priority = 0.6;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
