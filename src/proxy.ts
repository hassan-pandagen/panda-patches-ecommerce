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

// Every limiter below is `limiter ? guard : skip`. Without Redis they are all
// null, so EVERY rate limit silently disappears — no error, no log, no 429,
// just an uncapped site. That is the worst failure mode a guard can have: it
// looks identical to "no attack". Say so once at cold start.
//
// Deliberately not fatal. A checkout that still works unthrottled beats a
// checkout that 500s because a cache is unreachable. The AI generation route
// is the exception and is handled separately below, because it spends money.
if (!redis) {
  console.error(
    '[proxy] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — ALL rate ' +
    'limits are DISABLED (checkout, quote, contact, sample box, signup, AI generation). ' +
    'Set both in the Vercel project environment.',
  );
}

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

// Account signups: real users sign up once. A tight per-IP cap throttles the
// signup-spam bot (random-name accounts that email-bomb harvested addresses).
// This is a baseline; CAPTCHA on the form is the real fix for IP-rotating bots.
const signupLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 signups per hour per IP
      analytics: true,
      prefix: 'ratelimit:signup',
    })
  : null;

// AI patch generation: unauthenticated with a PAID provider (fal.ai) behind it.
// Per-IP cap stops a script from burning provider credits (audit P0-1). Generous
// enough for a real user iterating on designs.
const aiGenLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 generations per hour per IP
      analytics: true,
      prefix: 'ratelimit:aigen',
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

// Google Ads fires its remarketing/user-list pixel (/pagead/1p-user-list/...)
// against the VISITOR'S local Google domain — google.nl for a Dutch visitor,
// google.de for a German one — not just google.com. CSP cannot wildcard TLDs,
// so every ship-to market's Google domain must be listed or that visitor's
// conversion/remarketing pixel is silently blocked (seen as a CSP console
// error in PageSpeed, July 2026, google.nl). Used in img-src AND connect-src.
const GOOGLE_ADS_DOMAINS = [
  'google.com', 'google.co.uk', 'google.ca', 'google.com.au', 'google.com.pk',
  // EU / EEA
  'google.nl', 'google.de', 'google.fr', 'google.es', 'google.it', 'google.ie',
  'google.be', 'google.at', 'google.ch', 'google.se', 'google.dk', 'google.no',
  'google.fi', 'google.pl', 'google.pt', 'google.cz', 'google.gr', 'google.ro',
  'google.hu',
  // Rest of world (free worldwide shipping — major markets)
  'google.co.nz', 'google.co.in', 'google.com.br', 'google.com.mx', 'google.ae',
  'google.com.sa', 'google.co.jp', 'google.co.kr', 'google.com.sg', 'google.com.hk',
  'google.com.tw', 'google.co.za', 'google.com.tr', 'google.com.my', 'google.com.ph',
  'google.co.th', 'google.co.id', 'google.com.vn',
].map(w).join(' ');

const cspHeader = [
  "default-src 'self'",

  // Scripts: Google (GTM, GA4, Ads), PayPal, Tawk.to, Facebook, Vercel
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${w('googletagmanager.com')} ${w('google-analytics.com')} ${w('googleadservices.com')} ${w('googlesyndication.com')} ${w('doubleclick.net')} ${w('paypal.com')} ${w('paypalobjects.com')} ${w('tawk.to')} https://cdn.jsdelivr.net ${w('vercel-scripts.com')} ${w('vercel-insights.com')} ${w('facebook.net')} ${w('facebook.com')}`,

  `script-src-elem 'self' 'unsafe-inline' ${w('googletagmanager.com')} ${w('google-analytics.com')} ${w('googleadservices.com')} ${w('googlesyndication.com')} ${w('doubleclick.net')} ${w('paypal.com')} ${w('paypalobjects.com')} ${w('tawk.to')} https://cdn.jsdelivr.net ${w('vercel-scripts.com')} ${w('vercel-insights.com')} ${w('facebook.net')} ${w('facebook.com')}`,

  // Styles
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ${w('tawk.to')}`,

  // Fonts
  `font-src 'self' https://fonts.gstatic.com ${w('tawk.to')}`,

  // Images: everything that might serve pixels/images
  `img-src 'self' data: blob: https://cdn.sanity.io ${w('supabase.co')} ${w('google-analytics.com')} ${w('googletagmanager.com')} ${w('googleadservices.com')} ${w('googlesyndication.com')} ${w('doubleclick.net')} ${GOOGLE_ADS_DOMAINS} ${w('paypalobjects.com')} ${w('tawk.to')} ${w('tawk.link')} https://tawk.link ${w('amazonaws.com')} ${w('facebook.com')} ${w('facebook.net')} https://tr.facebook.com https://cdn.jsdelivr.net`,

  // Connect: API calls, websockets, beacons
  `connect-src 'self' ${w('sanity.io')} ${w('google-analytics.com')} ${w('analytics.google.com')} ${w('googletagmanager.com')} ${w('doubleclick.net')} ${w('googleadservices.com')} ${GOOGLE_ADS_DOMAINS} ${w('supabase.co')} ${w('tawk.to')} ${ww('tawk.to')} https://mpc-prod-24-s6uit34pua-uw.a.run.app https://api.zeptomail.com ${w('facebook.com')} ${w('facebook.net')} https://tr.facebook.com https://demo-1.conversionsapigateway.com ${w('paypal.com')} ${w('vercel-insights.com')} ${w('vercel-scripts.com')}`,

  // Media
  `media-src 'self' data: https://cdn.sanity.io ${w('tawk.to')}`,

  // Frames: PayPal, GTM, Tawk.to, Facebook, Google Ads
  `frame-src 'self' ${w('paypal.com')} ${w('googletagmanager.com')} ${w('tawk.to')} ${w('facebook.com')} ${w('doubleclick.net')} ${w('google.com')}`,

  "worker-src 'self' blob:",
  "object-src 'none'",
].join('; ');

// Sanity Studio permissive CSP
const sanityCspHeader = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:";

// ============================================
// BOT SIGNATURE BLOCK (edge-level, July 2026)
// ============================================
// Blocks generic scraper/scanner user agents that were hitting the site with
// spoofed google.com/facebook.com referrers to evade simple referrer-based
// filters (reported via Tawk dashboard while no ads were even running — ruling
// out ad-click fraud, pointing to raw scraping instead).
//
// IMPORTANT: this list is deliberately narrow and only matches known scraping
// libraries / vulnerability scanners / SEO-spam crawlers with zero upside for
// this site. It must NEVER match the AI-answer-engine and search crawlers this
// site explicitly courts (see robots.ts) — Googlebot, Bingbot, GPTBot,
// OAI-SearchBot, ChatGPT-User, ClaudeBot/Claude-*, PerplexityBot/Perplexity-User,
// Google-Extended, CCBot, Applebot, Meta-ExternalAgent, Amazonbot are all
// unaffected. A missing User-Agent (real browsers always send one) is blocked too.
const BLOCKED_BOT_UA = /python-requests|python-urllib|curl\/|Go-http-client|libwww-perl|Wget|scrapy|HttpClient|Java\/\d|MJ12bot|SemrushBot|AhrefsBot|DotBot|PetalBot|masscan|zgrab|nikto|sqlmap/i;

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') || '';

  // Skip the studio and API routes (API has its own rate limiting below; Sanity
  // Studio auth already gates access) — this check targets public page scraping.
  if (!pathname.startsWith('/studio') && !pathname.startsWith('/api/')) {
    const ua = request.headers.get('user-agent') || '';
    if (!ua || BLOCKED_BOT_UA.test(ua)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

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
  // All Square checkout starters share the cap (offers + reorder were previously
  // unthrottled — audit P0-6; the dead '/api/checkout' path was dropped).
  if (
    (pathname === '/api/checkout-square' ||
      pathname === '/api/checkout-offers-square' ||
      pathname === '/api/account/reorder') &&
    checkoutLimiter
  ) {
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

  if (pathname === '/api/auth/signup' && signupLimiter) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success, reset } = await signupLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: 'Too many signups from this network. Please try again later.' },
        { status: 429, headers: { 'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString() } },
      );
    }
  }

  // AI generation is the one route where a missing limiter costs real money on
  // every request, so it does NOT fall through silently the way the form routes
  // do. `x-forwarded-for` can carry a client-supplied prefix ahead of the real
  // address; keying on the whole header would let an attacker mint a fresh
  // bucket per request. Take the LAST hop — the one the platform appended — and
  // prefer x-real-ip, which is not client-writable.
  if (pathname === '/api/ai-patch/generate') {
    if (!aiGenLimiter) {
      console.error(
        '[proxy] /api/ai-patch/generate hit with NO rate limiter (Redis unavailable). ' +
        'Refusing rather than allowing uncapped paid generations.',
      );
      return NextResponse.json(
        { ok: false, error: 'Image generation is temporarily unavailable. Please try again shortly.' },
        { status: 503, headers: { 'Retry-After': '300' } },
      );
    }

    const forwarded = request.headers.get('x-forwarded-for') || '';
    const ip =
      request.headers.get('x-real-ip') ||
      forwarded.split(',').map((v) => v.trim()).filter(Boolean).pop() ||
      'anonymous';

    const { success, reset } = await aiGenLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many generations. Please try again in a bit.' },
        { status: 429, headers: { 'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString() } },
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
