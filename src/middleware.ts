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
      limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 checkout attempts per hour (bank-grade security)
      analytics: true,
      prefix: 'ratelimit:checkout',
    })
  : null;

const quoteLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
      analytics: true,
      prefix: 'ratelimit:quote',
    })
  : null;

const contactLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 contact form submissions per hour
      analytics: true,
      prefix: 'ratelimit:contact',
    })
  : null;

const sampleBoxLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 sample box orders per hour
      analytics: true,
      prefix: 'ratelimit:samplebox',
    })
  : null;

// Allowed origins for API requests
const ALLOWED_ORIGINS = [
  'https://pandapatches.com',
  'https://www.pandapatches.com',
  'https://panda-patches-ecommerce.vercel.app',
  'https://panda-patches-ecommerce-7w28lefz.vercel.app',
];

// ============================================
// CONTENT SECURITY POLICY (CSP)
// ============================================
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://www.paypalobjects.com https://www.paypal.com https://widget.trustpilot.com https://www.clarity.ms https://scripts.clarity.ms https://embed.tawk.to https://cdn.tawk.to https://va.tawk.to https://cdn.jsdelivr.net https://va.vercel-scripts.com https://cdn.vercel-insights.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://connect.facebook.net https://bat.bing.com",
  "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://www.paypalobjects.com https://www.paypal.com https://widget.trustpilot.com https://www.clarity.ms https://scripts.clarity.ms https://embed.tawk.to https://cdn.tawk.to https://va.tawk.to https://cdn.jsdelivr.net https://va.vercel-scripts.com https://cdn.vercel-insights.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://connect.facebook.net https://bat.bing.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://embed.tawk.to https://cdn.tawk.to",
  "font-src 'self' https://fonts.gstatic.com https://cdn.tawk.to https://embed.tawk.to",
  "img-src 'self' data: blob: https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://www.paypalobjects.com https://c.clarity.ms https://www.clarity.ms https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://www.facebook.com https://bat.bing.com https://c.bing.com https://embed.tawk.to https://cdn.tawk.to https://va.tawk.to https://s3.tawk.to https://s3.amazonaws.com https://widget.trustpilot.com https://tr.facebook.com",
  "connect-src 'self' https://api.sanity.io https://cdn.sanity.io https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://api.stripe.com https://uxgzlneefybifvccfhwp.supabase.co https://www.clarity.ms https://k.clarity.ms https://i.clarity.ms https://h.clarity.ms https://api.zeptomail.com https://www.google.com https://stats.g.doubleclick.net https://googleleads.g.doubleclick.net https://connect.facebook.net https://www.facebook.com https://embed.tawk.to https://va.tawk.to https://cdn.tawk.to https://s3.tawk.to wss://ws.tawk.to https://widget.trustpilot.com https://bat.bing.com",
  "media-src 'self' data: https://cdn.sanity.io https://embed.tawk.to https://cdn.tawk.to https://va.tawk.to",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.paypal.com https://www.googletagmanager.com https://widget.trustpilot.com https://tawk.to https://embed.tawk.to https://frame.tawk.to https://www.facebook.com https://bid.g.doubleclick.net https://googleads.g.doubleclick.net",
  "worker-src 'self' blob:",
  "object-src 'none'",
].join('; ');

// Sanity Studio permissive CSP
const sanityCspHeader = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Add CSP header to response
  const response = NextResponse.next();
  
  // Apply different CSP based on route
  if (pathname.startsWith('/studio')) {
    response.headers.set('Content-Security-Policy', sanityCspHeader);
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  } else {
    response.headers.set('Content-Security-Policy', cspHeader);
  }

  // ============================================
  // RATE LIMITING (UPSTASH REDIS)
  // ============================================
  if (pathname === '/api/checkout' && checkoutLimiter) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
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
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
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
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
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
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
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
  matcher: ['/api/checkout', '/api/quote', '/api/contact', '/api/sample-box'],
};
