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
        // Static assets - Long cache (1 year)
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // SVGs, fonts - Long cache (1 year)
        source: '/:path*.(svg|woff2|woff|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
    ];
  },
};

export default nextConfig;