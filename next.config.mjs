/** @type {import('next').NextConfig} */
const nextConfig = {
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
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.stripe.com https://tawk.to https://www.googletagmanager.com https://www.google-analytics.com https://*.sanity.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.sanity.io; img-src 'self' https: data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.stripe.com https://tawk.to https://www.google-analytics.com https://*.sanity.io https://*.supabase.co; frame-src 'self' https://js.stripe.com https://tawk.to https://*.sanity.io; media-src 'self' https://*.sanity.io https://cdn.sanity.io blob: data:; object-src 'none';",
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

      // POLICY PAGES - Redirect to homepage for now
      // TODO: Create these pages in Sanity or as static pages
      {
        source: '/privacy-policy',
        destination: '/',
        permanent: false, // 302 temporary until pages are created
      },
      {
        source: '/privacy-policy/',
        destination: '/',
        permanent: false,
      },
      {
        source: '/terms-conditions',
        destination: '/',
        permanent: false,
      },
      {
        source: '/terms-conditions/',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;