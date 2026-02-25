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

// Allowed origins for API requests
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://pandapatches.com',
  'https://www.pandapatches.com',
  'https://panda-patches-ecommerce.vercel.app',
  'https://panda-patches-ecommerce-7w28lefz.vercel.app',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

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

  // ============================================
  // ORIGIN VALIDATION FOR API ROUTES
  // ============================================
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');

    // Allow requests without origin (direct API calls, server-to-server)
    // But validate if present
    if (origin) {
      const isAllowed = ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed)) ||
                        origin.includes('vercel.app'); // Allow all Vercel preview deployments
      if (!isAllowed) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Invalid origin' },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/checkout', '/api/quote'],
};
