/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js NOT to bundle these packages — load them natively via Node.js require().
  // Prevents dev-server worker crashes caused by bundler incompatibilities with the PayPal SDK.
  serverExternalPackages: ['@paypal/paypal-server-sdk'],
  webpack: (config, { isServer }) => {
    // Redirect @upstash/redis to its edge-compatible build to avoid Node.js API warnings
    config.resolve.alias['@upstash/redis'] = '@upstash/redis/cloudflare';
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Allow Sanity Images
      },
    ],
  },
  async headers() {
    return [
      {
        // Next.js optimized images - Medium cache (7 days CDN, 1 day browser)
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate',
          },
        ],
      },
      {
        // HTML pages - Strategic cache with ISR
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Static assets - Long cache (1 year) — after /:path* so it overrides
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // SVGs, fonts - Long cache (1 year) — after /:path* so it overrides
        source: '/:path*.(svg|woff2|woff|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes - No cache
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        // Sanity Studio — no CSP restrictions (admin only)
        source: '/studio/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:" },
        ],
      },
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://www.paypalobjects.com https://www.paypal.com https://widget.trustpilot.com https://www.clarity.ms https://scripts.clarity.ms https://embed.tawk.to https://cdn.tawk.to https://va.vercel-scripts.com https://cdn.vercel-insights.com https://googleads.g.doubleclick.net https://connect.facebook.net https://bat.bing.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://embed.tawk.to https://cdn.tawk.to",
              "font-src 'self' https://fonts.gstatic.com https://cdn.tawk.to",
              "img-src 'self' data: blob: https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://www.paypalobjects.com https://c.clarity.ms https://googleads.g.doubleclick.net https://www.google.com https://www.facebook.com https://bat.bing.com https://cdn.tawk.to",
              "connect-src 'self' https://api.sanity.io https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://api.stripe.com https://uxgzlneefybifvccfhwp.supabase.co https://www.clarity.ms https://api.zeptomail.com https://www.google.com https://stats.g.doubleclick.net https://connect.facebook.net https://www.facebook.com https://embed.tawk.to https://va.tawk.to wss://ws.tawk.to https://ipapi.co",
              "media-src 'self' https://cdn.sanity.io",
              "frame-src https://js.stripe.com https://hooks.stripe.com https://www.paypal.com https://www.googletagmanager.com https://widget.trustpilot.com https://embed.tawk.to",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // OLD BLOG URL → NEW BLOGS URL
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true, // 301 redirect
      },
      {
        source: '/blog/',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blog/feed',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blog/feed/',
        destination: '/blogs',
        permanent: true,
      },

      // CHECKOUT REDIRECTS
      {
        source: '/thank-you',
        destination: '/success',
        permanent: true,
      },
      {
        source: '/thank-you/',
        destination: '/success',
        permanent: true,
      },
      {
        source: '/secure-checkout',
        destination: '/',
        permanent: true,
      },
      {
        source: '/secure-checkout/',
        destination: '/',
        permanent: true,
      },

      // ASSET REDIRECTS
      {
        source: '/thread-chart',
        destination: '/assets/thread-chart',
        permanent: true,
      },
      {
        source: '/thread-chart/',
        destination: '/assets/thread-chart',
        permanent: true,
      },

      // POLICY PAGES - Redirect old URL to new URL
      {
        source: '/terms-conditions',
        destination: '/terms-of-service',
        permanent: true, // 301 permanent redirect
      },
      {
        source: '/terms-conditions/',
        destination: '/terms-of-service',
        permanent: true,
      },

      // ABOUT & CONTACT - WordPress used 'about-us' / 'contact-us', new site uses 'about' / 'contact'
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact-us/',
        destination: '/contact',
        permanent: true,
      },

      // IRON-ON INSTRUCTIONS - Static WordPress page, redirect to relevant blog post
      {
        source: '/iron-on-instructions',
        destination: '/how-to-iron-on-patches',
        permanent: true,
      },
      {
        source: '/iron-on-instructions/',
        destination: '/how-to-iron-on-patches',
        permanent: true,
      },

      // WORDPRESS BLOG POSTS - /blog/:slug → /:slug (individual posts now at root level)
      {
        source: '/blog/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/blog/:slug/',
        destination: '/:slug',
        permanent: true,
      },

      // SLUG CHANGES - Old WordPress slugs that changed during migration
      {
        source: '/varsity-jacket-patches-winter-trend-2024',
        destination: '/varsity-jacket-patches-or-what-can-be-done',
        permanent: true,
      },

      // WORDPRESS SYSTEM PATHS - Protect crawl budget, block bots hitting 404s
      {
        source: '/wp-admin',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-admin/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-login.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-content/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-includes/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/xmlrpc.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/feed/',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/:path*/feed',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/:path*/feed/',
        destination: '/blogs',
        permanent: true,
      },

      // TRAILING SLASH NORMALISATION — specific paths
      {
        source: '/custom-patches/:slug/',
        destination: '/custom-patches/:slug',
        permanent: true,
      },
      {
        source: '/custom-products/:slug/',
        destination: '/custom-products/:slug',
        permanent: true,
      },

      // TOP-LEVEL PAGES — trailing slash variants (WordPress adds these by default)
      { source: '/about/',               destination: '/about',               permanent: true },
      { source: '/contact/',             destination: '/contact',             permanent: true },
      { source: '/blogs/',               destination: '/blogs',               permanent: true },
      { source: '/bulk-custom-patches/', destination: '/bulk-custom-patches', permanent: true },
      { source: '/sample-box/',          destination: '/sample-box',          permanent: true },
      { source: '/custom-patches/',      destination: '/custom-patches',      permanent: true },
      { source: '/custom-products/',     destination: '/custom-products',     permanent: true },
      { source: '/assets/',              destination: '/assets',              permanent: true },

      // LOCATION PAGES — trailing slash
      { source: '/alabama-patches/',                    destination: '/alabama-patches',                    permanent: true },
      { source: '/custom-austin-patches/',              destination: '/custom-austin-patches',              permanent: true },
      { source: '/custom-patches-in-boston/',           destination: '/custom-patches-in-boston',           permanent: true },
      { source: '/custom-california-patches/',          destination: '/custom-california-patches',          permanent: true },
      { source: '/custom-patches-in-chicago/',          destination: '/custom-patches-in-chicago',          permanent: true },
      { source: '/custom-patches-colorado/',            destination: '/custom-patches-colorado',            permanent: true },
      { source: '/custom-patches-dallas/',              destination: '/custom-patches-dallas',              permanent: true },
      { source: '/custom-denver-patches/',              destination: '/custom-denver-patches',              permanent: true },
      { source: '/custom-patches-in-florida/',          destination: '/custom-patches-in-florida',          permanent: true },
      { source: '/custom-patches-houston/',             destination: '/custom-patches-houston',             permanent: true },
      { source: '/kentucky-patches/',                   destination: '/kentucky-patches',                   permanent: true },
      { source: '/custom-patches-los-angeles/',         destination: '/custom-patches-los-angeles',         permanent: true },
      { source: '/custom-miami-patches/',               destination: '/custom-miami-patches',               permanent: true },
      { source: '/custom-patches-in-new-york/',         destination: '/custom-patches-in-new-york',         permanent: true },
      { source: '/custom-ohio-state-patches/',          destination: '/custom-ohio-state-patches',          permanent: true },
      { source: '/custom-patches-portland/',            destination: '/custom-patches-portland',            permanent: true },
      { source: '/custom-patches-in-san-francisco/',    destination: '/custom-patches-in-san-francisco',    permanent: true },
      { source: '/custom-patches-in-texas/',            destination: '/custom-patches-in-texas',            permanent: true },
      { source: '/custom-utah-patches/',                destination: '/custom-utah-patches',                permanent: true },
      { source: '/custom-patches-in-washington/',       destination: '/custom-patches-in-washington',       permanent: true },

      // PATCH STYLE PAGES — trailing slash
      { source: '/custom-anime-patches/',               destination: '/custom-anime-patches',               permanent: true },
      { source: '/custom-baseball-patches/',            destination: '/custom-baseball-patches',            permanent: true },
      { source: '/christmas-patches/',                  destination: '/christmas-patches',                  permanent: true },
      { source: '/valentines-day-patches/',             destination: '/valentines-day-patches',             permanent: true },
      { source: '/custom-morale-patches/',              destination: '/custom-morale-patches',              permanent: true },
      { source: '/custom-soccer-patches/',              destination: '/custom-soccer-patches',              permanent: true },
      { source: '/custom-fire-department-patches/',     destination: '/custom-fire-department-patches',     permanent: true },
      { source: '/custom-hockey-patches/',              destination: '/custom-hockey-patches',              permanent: true },
      { source: '/patches-for-hats/',                   destination: '/patches-for-hats',                   permanent: true },
      { source: '/custom-jacket-patches/',              destination: '/custom-jacket-patches',              permanent: true },
      { source: '/custom-law-enforcement-patches/',     destination: '/custom-law-enforcement-patches',     permanent: true },
      { source: '/custom-logo-patches/',                destination: '/custom-logo-patches',                permanent: true },
      { source: '/motorcycle-patches/',                 destination: '/motorcycle-patches',                 permanent: true },
      { source: '/custom-name-patches/',                destination: '/custom-name-patches',                permanent: true },
      { source: '/custom-rock-band-patches/',           destination: '/custom-rock-band-patches',           permanent: true },
      { source: '/custom-super-bowl-patch/',            destination: '/custom-super-bowl-patch',            permanent: true },
      { source: '/custom-tactical-patches/',            destination: '/custom-tactical-patches',            permanent: true },
      { source: '/custom-velcro-patches/',              destination: '/custom-velcro-patches',              permanent: true },

      // WORDPRESS OLD PRODUCT/SHOP PATHS — common WooCommerce patterns
      { source: '/shop',                destination: '/custom-patches',      permanent: true },
      { source: '/shop/',               destination: '/custom-patches',      permanent: true },
      { source: '/shop/:path*',         destination: '/custom-patches',      permanent: true },
      { source: '/product/:path*',      destination: '/custom-patches',      permanent: true },
      { source: '/product-category/:path*', destination: '/custom-patches', permanent: true },
      { source: '/cart',                destination: '/',                    permanent: true },
      { source: '/cart/',               destination: '/',                    permanent: true },
      { source: '/checkout',            destination: '/',                    permanent: true },
      { source: '/checkout/',           destination: '/',                    permanent: true },
      { source: '/my-account',          destination: '/',                    permanent: true },
      { source: '/my-account/',         destination: '/',                    permanent: true },

      // CATCH-ALL TRAILING SLASH — must be LAST (handles any remaining /:slug/ paths)
      {
        source: '/:slug((?!api/).*[^/])/',
        destination: '/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;