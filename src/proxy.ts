import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/cloudflare';

// ============================================
// UPSTASH REDIS SETUP (FOR VERCEL SERVERLESS)
// ============================================
// Initialize Redis client (only if env vars are set)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Create rate limiters for different endpoints
const checkoutLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 checkout attempts per hour
      analytics: true,
      prefix: 'ratelimit:checkout',
    })
  : null;

const quoteLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 h'), // 30 quote requests per hour
      analytics: true,
      prefix: 'ratelimit:quote',
    })
  : null;

const contactLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 h'), // 30 contact form submissions per hour
      analytics: true,
      prefix: 'ratelimit:contact',
    })
  : null;

const sampleBoxLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 sample box orders per hour
      analytics: true,
      prefix: 'ratelimit:samplebox',
    })
  : null;

// Allowed origins for API requests
const ALLOWED_ORIGINS = [
  'https://www.pandapatches.com',
  'https://pandapatches.com',
  'https://panda-patches-ecommerce.vercel.app',
  'https://panda-patches-ecommerce-7w28lefz.vercel.app',
];

// ============================================
// CONTENT SECURITY POLICY (CSP)
// ============================================
// Build wildcard domains at runtime to prevent Next.js build from stripping asterisks
const W = String.fromCharCode(42); // '*' character — assembled at runtime, not compile time
const w = (domain: string) => `https://${W}.${domain}`;
const ww = (domain: string) => `wss://${W}.${domain}`;

const cspHeader = [
  "default-src 'self'",

  // Scripts: Google (GTM, GA4, Ads), Stripe, PayPal, Trustpilot, Clarity, Tawk.to, Facebook, Bing, Vercel, Pinterest
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${w('googletagmanager.com')} ${w('google-analytics.com')} ${w('googleadservices.com')} ${w('googlesyndication.com')} ${w('doubleclick.net')} https://js.stripe.com ${w('paypal.com')} ${w('paypalobjects.com')} ${w('trustpilot.com')} ${w('clarity.ms')} ${w('tawk.to')} https://cdn.jsdelivr.net ${w('vercel-scripts.com')} ${w('vercel-insights.com')} ${w('facebook.net')} ${w('facebook.com')} https://bat.bing.com https://s.pinimg.com`,

  `script-src-elem 'self' 'unsafe-inline' ${w('googletagmanager.com')} ${w('google-analytics.com')} ${w('googleadservices.com')} ${w('googlesyndication.com')} ${w('doubleclick.net')} https://js.stripe.com ${w('paypal.com')} ${w('paypalobjects.com')} ${w('trustpilot.com')} ${w('clarity.ms')} ${w('tawk.to')} https://cdn.jsdelivr.net ${w('vercel-scripts.com')} ${w('vercel-insights.com')} ${w('facebook.net')} ${w('facebook.com')} https://bat.bing.com https://s.pinimg.com`,

  // Styles
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ${w('tawk.to')}`,

  // Fonts
  `font-src 'self' https://fonts.gstatic.com ${w('tawk.to')}`,

  // Images: everything that might serve pixels/images
  `img-src 'self' data: blob: https://cdn.sanity.io ${w('google-analytics.com')} ${w('googletagmanager.com')} ${w('googleadservices.com')} ${w('googlesyndication.com')} ${w('doubleclick.net')} ${w('google.com')} ${w('google.co.uk')} ${w('google.ca')} ${w('google.com.au')} ${w('google.com.pk')} ${w('paypalobjects.com')} ${w('clarity.ms')} ${w('tawk.to')} ${w('tawk.link')} https://tawk.link ${w('amazonaws.com')} ${w('trustpilot.com')} ${w('facebook.com')} ${w('facebook.net')} https://tr.facebook.com https://bat.bing.com ${w('bing.com')} ${w('bing.net')} https://bat.bing.net https://cdn.jsdelivr.net https://ct.pinterest.com ${w('pinimg.com')}`,

  // Connect: API calls, websockets, beacons
  `connect-src 'self' ${w('sanity.io')} ${w('google-analytics.com')} ${w('analytics.google.com')} ${w('googletagmanager.com')} ${w('doubleclick.net')} ${w('googleadservices.com')} ${w('google.com')} ${w('google.co.uk')} ${w('google.ca')} ${w('google.com.au')} ${w('google.com.pk')} https://api.stripe.com ${w('supabase.co')} ${w('clarity.ms')} ${w('tawk.to')} ${ww('tawk.to')} https://mpc-prod-24-s6uit34pua-uw.a.run.app https://api.zeptomail.com ${w('facebook.com')} ${w('facebook.net')} https://tr.facebook.com https://demo-1.conversionsapigateway.com ${w('trustpilot.com')} https://bat.bing.com ${w('bing.com')} ${w('bing.net')} https://bat.bing.net ${w('paypal.com')} ${w('vercel-insights.com')} ${w('vercel-scripts.com')} https://ct.pinterest.com ${w('pinterest.com')} ${w('pinimg.com')}`,

  // Media
  `media-src 'self' data: https://cdn.sanity.io ${w('tawk.to')}`,

  // Frames: Stripe, PayPal, GTM, Trustpilot, Tawk.to, Facebook, Google Ads
  `frame-src 'self' https://js.stripe.com https://hooks.stripe.com ${w('paypal.com')} ${w('googletagmanager.com')} ${w('trustpilot.com')} ${w('tawk.to')} ${w('facebook.com')} ${w('doubleclick.net')} ${w('google.com')}`,

  "worker-src 'self' blob:",
  "object-src 'none'",
].join('; ');

// Sanity Studio permissive CSP
const sanityCspHeader = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') || '';

  // ============================================
  // TRAILING SLASH CANONICAL REDIRECT
  // Apex -> www is handled by Vercel's domain config at the edge, so we only
  // need to strip trailing slashes here. Preserves the www host on redirect
  // so we don't bounce through apex and re-trigger Vercel's 308.
  // ============================================
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const hasTrailingSlash = pathname.length > 1 && pathname.endsWith('/');

  if (!isLocal && hasTrailingSlash) {
    const cleanPath = pathname.replace(/\/+$/, '') || '/';
    const targetUrl = new URL(cleanPath, `https://${host}`);
    targetUrl.search = request.nextUrl.search;
    return NextResponse.redirect(targetUrl, 301);
  }

  // Add CSP header to response
  const response = NextResponse.next();

  // Skip CSP on localhost (dev mode)
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');

  // Apply different CSP based on route (skip in dev to avoid blocking)
  if (!isLocalhost) {
    if (pathname.startsWith('/studio')) {
      response.headers.set('Content-Security-Policy', sanityCspHeader);
      response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    } else {
      response.headers.set('Content-Security-Policy', cspHeader);
    }
  }

  // ============================================
  // RATE LIMITING (UPSTASH REDIS)
  // ============================================
  if (pathname === '/api/checkout' && checkoutLimiter) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success, limit, reset, remaining } = await checkoutLimiter.limit(ip);

    if (!success) {
      const resetDate = new Date(reset);
      const minutesUntilReset = Math.ceil((reset - Date.now()) / 1000 / 60);

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `You've reached the limit of ${limit} checkout attempts. Please try again in ${minutesUntilReset} minutes.`,
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetDate.toISOString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  if (pathname === '/api/quote' && quoteLimiter) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success, limit, reset, remaining } = await quoteLimiter.limit(ip);

    if (!success) {
      const resetDate = new Date(reset);
      const minutesUntilReset = Math.ceil((reset - Date.now()) / 1000 / 60);

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `You've reached the limit of ${limit} quote requests. Please try again in ${minutesUntilReset} minutes.`,
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetDate.toISOString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  if (pathname === '/api/contact' && contactLimiter) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success, limit, reset, remaining } = await contactLimiter.limit(ip);

    if (!success) {
      const resetDate = new Date(reset);
      const minutesUntilReset = Math.ceil((reset - Date.now()) / 1000 / 60);

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `You've reached the limit of ${limit} contact submissions. Please try again in ${minutesUntilReset} minutes.`,
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetDate.toISOString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  if (pathname === '/api/sample-box' && sampleBoxLimiter) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success, limit, reset, remaining } = await sampleBoxLimiter.limit(ip);

    if (!success) {
      const resetDate = new Date(reset);
      const minutesUntilReset = Math.ceil((reset - Date.now()) / 1000 / 60);

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `You've reached the limit of ${limit} sample box requests. Please try again in ${minutesUntilReset} minutes.`,
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetDate.toISOString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  // ============================================
  // ORIGIN VALIDATION FOR API ROUTES
  // ============================================
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');

    // Allow requests without origin (direct API calls, server-to-server)
    // But validate if present
    if (origin) {
      const isAllowed = ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed)) ||
                        origin.includes('vercel.app') || // Allow all Vercel preview deployments
                        origin.startsWith('http://localhost'); // Allow local development
      if (!isAllowed) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Invalid origin' },
          { status: 403 }
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes EXCEPT static files, Next.js internals, and Sanity Studio
    '/((?!_next/static|_next/image|favicon\\.ico|assets/|studio).*)',
  ],
};
