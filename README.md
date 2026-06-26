# 🐼 Panda Patches — Storefront & Marketing Site

The **customer-facing** half of Panda Patches: the public marketing site, ~68 product/SEO pages, the FAL-powered AI patch generator, the `/offers` ordering flow, Square checkout, a Supabase customer portal, and a deep conversion-tracking + SEO/AEO stack. Built with Next.js 16 (App Router), React 19, TypeScript, Sanity CMS, and Supabase; deployed on Vercel.

**Live:** [pandapatches.com](https://www.pandapatches.com)

> ### Two repos, one backend
> This repository is the **storefront + customer portal**. The internal **staff CRM & order-management system** (full 13-status order lifecycle, quotes→order conversion, production/QA, fulfillment, **refunds**, financial reporting, attendance, RBAC) is a **separate React + Vite application** that shares the **same Supabase backend** as this site. This repo *feeds data in* (leads, quotes, orders, payments, attribution); the CRM *operates* on it. Order management, inventory, and reporting belong in the CRM repo — not here.

---

## 📋 Table of Contents

- [What This Repo Is](#what-this-repo-is)
- [Architecture](#architecture)
- [Features](#features)
- [Original Roadmap — Status](#original-roadmap--status)
- [Tech Stack](#tech-stack)
- [Analytics & Conversion Tracking](#analytics--conversion-tracking)
- [Order & Payment Flow](#order--payment-flow)
- [Security](#security)
- [Content & SEO](#content--seo)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Scheduled Jobs (Cron)](#scheduled-jobs-cron)
- [Project Structure](#project-structure)
- [Configuration & Conventions](#configuration--conventions)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## What This Repo Is

A B2B/B2C storefront for custom patches and related products. Customers discover products, get instant pricing, generate AI patch mockups, order through fixed-price offer packs or quote requests, pay via Square (incl. BNPL), and self-serve their orders through an authenticated portal. Everything customer-facing lives here; everything staff-facing lives in the separate CRM.

**Payments:** **Square only.** Card, Apple Pay, Google Pay, **Cash App Pay**, and **Afterpay** (BNPL / "pay in installments") are enabled on the hosted Square checkout. Stripe and PayPal were removed as checkout methods in June 2026 — there are **no `STRIPE_`/`PAYPAL_` env vars** in this repo. The legacy `stripe` + `@paypal/paypal-server-sdk` packages, the Stripe CSP entries, and the PayPal `serverExternalPackages` line were pruned (June 2026). PayPal's CSP domains are intentionally kept — PayPal checkout is only *temporarily* disabled (account hold), not removed. Stripe is still used by the *CRM* for payout/balance reporting, so it isn't gone org-wide.

---

## Architecture

```
                         ┌──────────────────────────────┐
   Customer ──HTTP──►    │  panda-patches-ecommerce      │   (THIS REPO)
                         │  Next.js 16 / React 19 · Vercel
                         │  storefront · /offers · AI gen ·
                         │  customer portal · SEO/AEO
                         └───────────────┬──────────────┘
                                         │ writes leads / quotes / orders /
                                         │ payments / attribution
                                         ▼
                         ┌──────────────────────────────┐
                         │       Supabase (shared)       │
                         │  Postgres + RLS · Auth ·      │
                         │  Storage · Realtime · 20 Edge │
                         │  Functions (send-email, etc.) │
                         └───────────────┬──────────────┘
                                         │ reads / manages / refunds
                                         ▼
                         ┌──────────────────────────────┐
                         │    Staff CRM (separate repo)  │
                         │  React + Vite · order ops ·   │
                         │  production · reporting · RBAC│
                         └──────────────────────────────┘

  External services:
   Sanity (CMS, 25 doc types) · Square (checkout + BNPL) · ZeptoMail (email)
   Meta Pixel + CAPI · Upstash Redis (rate limiting) · Tawk.to (live chat)
   FAL (AI image gen) · GA4 + GTM + Google Ads · Pinterest · Bing UET · OpenAI pixel
```

**Data flow:** Marketing pages render from Sanity (ISR). Forms (hero/bulk/contact/sample-box/design-services/partner) and the `/offers` flow write to Supabase via `/api` routes. Checkout creates a Square hosted Payment Link; Square's webhook (plus a Supabase order-paid webhook for redundancy) marks orders paid, auto-provisions a customer account, sends a ZeptoMail confirmation, and fires a Meta CAPI Purchase. The CRM picks everything up from Supabase.

---

## Features

### 🛍️ Storefront & Ordering
- Catalog: 9 patch categories + additional products (lapel pins, challenge coins, keychains, PVC shoe charms), driven by Sanity
- Real-time pricing calculator ([ComplexCalculator.tsx](src/components/product/ComplexCalculator.tsx), [pricingCalculator.ts](src/lib/pricingCalculator.ts)) — size, material, quantity tiers, backing, delivery; centralized `PRICE_MULTIPLIER` and Chenille/Leather uplift
- **`/offers`** — fixed-price packs with inline multi-step ordering ([OffersClient.tsx](src/components/offers/OffersClient.tsx), [offerPackages.ts](src/lib/offerPackages.ts))
- **Bulk orders** — [bulk-custom-patches](src/app/bulk-custom-patches/page.tsx) with volume pricing table, bulk quote form, case studies
- Quote & lead capture (hero, bulk, design-service forms) with partial-lead tracking on email blur
- `$45` sample box ordering · design services intake (vector / raster-to-vector / embroidery digitizing)

### 🎨 AI Patch Generator (FAL)
[ai-patch-generator](src/app/ai-patch-generator/page.tsx) · [aiGenerator.ts](src/lib/aiGenerator.ts)
- Provider abstraction (`mock` for dev / `fal` for prod via `AI_GEN_PROVIDER` + `AI_GEN_MODEL`), 60s timeout, per-model cost tracking
- Prompt pipeline ([patchPrompt.ts](src/lib/patchPrompt.ts)): shape/style/border/color presets + injection scrubber
- Abuse controls ([aiGenBlocklist.ts](src/lib/aiGenBlocklist.ts)): 120+ rules blocking trademarks, sports/character logos, hate symbols, gang/luxury marks
- Storage with 30-day TTL ([aiGenStorage.ts](src/lib/aiGenStorage.ts)), GA4 funnel analytics, and a daily cleanup cron; clean design handed off into the order flow ([prepare-handoff](src/app/api/ai-patch/prepare-handoff/route.ts))

### 👤 Customer Portal (Supabase Auth)
- Login / signup / forgot / reset password / OAuth callback / signout
- `/account` dashboard, profile editor, order history, order detail & tracking, one-click reorder ([account/reorder](src/app/api/account/reorder/route.ts)) with loyalty re-pricing
- Accounts auto-provisioned on first paid order ([ensureCustomerAccount.ts](src/lib/ensureCustomerAccount.ts))

### 💳 Checkout & Payments
- Square hosted Payment Links for the calculator/quote path ([checkout-square](src/app/api/checkout-square/route.ts)) and `/offers` ([checkout-offers-square](src/app/api/checkout-offers-square/route.ts)); server-side re-pricing prevents tampering
- BNPL / fast pay: **Afterpay + Cash App Pay** (plus Apple Pay / Google Pay / card)
- HMAC-verified Square webhook + Supabase order-paid webhook → order creation, email, account, Meta CAPI

### 📧 Email Automation (ZeptoMail)
Via the shared Supabase `send-email` Edge Function ([sendCustomerEmail.ts](src/lib/sendCustomerEmail.ts), [orderEmails.ts](src/lib/orderEmails.ts)): signup confirmation, password reset, payment confirmation, account provisioning, quote (priced/unpriced), internal new-order alerts, and a two-stage **abandoned-cart** sequence (30 min, then 24 h with a 10% code).

### 📈 Marketing, Attribution & Reviews
- **Meta Conversions API** (Lead / Contact / InitiateCheckout / Purchase, with reversal on refund) + rich UTM/click-ID attribution ([metaCapi.ts](src/lib/metaCapi.ts), [attribution.ts](src/lib/attribution.ts))
- Full analytics stack (see [below](#analytics--conversion-tracking))
- **Trustpilot** reviews — [reviews page](src/app/reviews/page.tsx) + single-source rating constants ([reviewConstants.ts](src/lib/reviewConstants.ts)); refunds/returns handled in the CRM
- Google/Meta product feed ([products-feed](src/app/api/products-feed/route.ts)), UCP-ready product API

### 🔎 SEO / AEO Surface
~30 SEO landing pages (industry, geo, competitor comparisons), AI-answer `/ai-info/*` pages + `public/llms.txt`, case studies, location pages, hreflang clusters, JSON-LD (Organization, Person, Product, FAQPage, Article, BreadcrumbList, AggregateOffer), dynamic sitemap/robots, and IndexNow pinging.

---

## Original Roadmap — Status

The previous README listed these as "In Progress" / "Planned." Verified against the actual code, here's reality:

| Original item | Status | Where |
|---|---|---|
| Order tracking system | ✅ Done | `/account/orders` + order detail + reorder |
| Email notification system | ✅ Done | ZeptoMail (all milestones + abandoned cart) |
| Customer dashboard | ✅ Done | `/account/*` |
| Admin order management | ✅ Done | **separate staff CRM** (13-status lifecycle, RBAC, reporting) |
| Analytics integration | ✅ Done | GA4 + GTM + Google Ads + Meta Pixel/CAPI + Pinterest + Bing + OpenAI (Mixpanel not used — superseded) |
| User accounts & login | ✅ Done | Supabase Auth |
| Live chat (Tawk) | ✅ Done | [TawkToWidget.tsx](src/components/TawkToWidget.tsx) |
| Bulk order pricing tiers | ✅ Done | `/bulk-custom-patches`, `/offers` |
| Custom API endpoints | ✅ Done | products / products/[id] / products-feed |
| Payment installments (BNPL) | ✅ Done | Square Afterpay + Cash App Pay |
| Customer reviews & ratings | ✅ Done (display) | Trustpilot — curated + schema (no user-submitted ratings) |
| Returns / refunds system | ✅ Done | in the **CRM**; storefront reverses Meta CAPI on refund |
| Wishlist / favorites | ❌ Not built | — |
| Advanced search & filters | ❌ Not built | — |
| Inventory management | ⬜ CRM scope | not in storefront |
| Shipping API (EasyPost/ShipStation) | ❌ Not built | — |
| Mobile app (React Native) | ❌ Not built | — |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 (custom `panda` brand tokens) · styled-components · Swiper · Lucide |
| CMS | Sanity 3 (`next-sanity`) — 25 document types, Studio embedded at `/studio` |
| Auth / DB / Storage | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) — RLS, Storage, Realtime |
| Payments | Square (direct REST, [square.ts](src/lib/square.ts)) · Afterpay / Cash App / Apple Pay / Google Pay |
| Email | ZeptoMail (via shared Supabase `send-email` Edge Function) |
| AI generation | FAL (`fal-ai/flux*`, `ideogram`) with mock fallback |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) in [proxy.ts](src/proxy.ts) |
| Forms / Validation | React Hook Form · Zod |
| Ads / Analytics | GA4 + GTM (GTM-KQQQ674D) · Google Ads (AW-11221237770) · Meta Pixel + CAPI · Pinterest · Bing UET · OpenAI |
| Live chat | Tawk.to |
| Images | `next/image` (AVIF/WebP) · Sharp |
| Hosting | Vercel (Pro) + Vercel Cron |

---

## Analytics & Conversion Tracking

Wired globally in [layout.tsx](src/app/layout.tsx) (IDs are hardcoded there, not env-driven), all deferred to `lazyOnload` to protect Core Web Vitals:

| Platform | ID / Notes |
|----------|-----------|
| Google Tag Manager | `GTM-KQQQ674D` (loads GA4) |
| Google Ads | `AW-11221237770` — conversions for quote forms, chat start, and purchase (with hashed enhanced-conversion PII) |
| Meta Pixel + CAPI | Pixel `1515101469424765`; server events deduped with the browser pixel via shared `eventID` |
| Pinterest Tag | `2612823226033` |
| Bing UET | `97147013` |
| OpenAI conversions pixel | for ChatGPT/AI-search attribution |
| Tawk.to | live chat; fires Google Ads + Meta Contact on first visitor message, with AI-referrer source tagging |

Attribution (`fbp`/`fbc`/`fbclid`/`gclid`/`utm_*`) is captured client-side ([AttributionCapture.tsx](src/components/AttributionCapture.tsx)) and re-derived server-side into `lead_source` / `traffic_source` on every order and quote.

---

## Order & Payment Flow

```
Quote/cart ─► /api/checkout-square (re-price, park in square_pending_orders,
              create Square Payment Link, fire Meta InitiateCheckout, track cart)
          ─► Square hosted checkout (card · Apple/Google Pay · Cash App · Afterpay)
          ─► /api/webhooks/square (HMAC verify → atomically claim pending order →
              insert orders row → confirmation email → auto-provision account →
              Meta CAPI Purchase → mark cart PURCHASED → clean up lead)
          ─► /success (browser PurchaseConversion fires Google Ads + Meta Purchase)
   safety ─► /api/webhooks/supabase-order-paid (Realtime; re-fires Purchase if missed,
              handles manual imports/refunds; skips CANCELLED/REFUNDED)
```

Refunds are issued in the **CRM**; this repo only recognizes `REFUNDED`/`CANCELLED` status and avoids double-firing Purchase events.

---

## Security

- **Rate limiting** ([proxy.ts](src/proxy.ts), Upstash): checkout 20/h, quote 30/h, contact 30/h, sample-box 20/h, **signup 5/h** — all per IP; disabled gracefully if Upstash env is absent
- **CSP + CORS** in `proxy.ts` (Next.js 16 middleware, renamed from `middleware.ts`): strict allowlist per third-party domain; permissive policy only on `/studio`; origin allowlist for `pandapatches.com` + Vercel previews
- **Bot defense**: honeypot fields, time-to-submit gate, gibberish-name detection across all forms
- **Webhook verification**: Square HMAC-SHA256 (constant-time); Supabase webhook bearer token (`SUPABASE_WEBHOOK_SECRET`); cron routes gated by `CRON_SECRET`
- **Input sanitization** ([sanitize.ts](src/lib/sanitize.ts)) + AI prompt-injection scrubbing; RLS enforces customer data ownership; service-role key is server-only
- **Hardened headers** in [next.config.mjs](next.config.mjs): HSTS, X-Frame-Options DENY, nosniff, Permissions-Policy, etc.

---

## Content & SEO

- **Sanity CMS** (project `hjpcv7rv`, dataset `production`, API `2024-01-01`): **25 document types** — `hero`, `product`, `customProduct`, `productPage`, `patchStyle`, `categoryPage`, `locationPage`, `blog`, `faq`, `bulkCaseStudy`, `craftsmanship`, `about`, `partnersPage`, `process`, `timeline`, `content`, `cta`, `workSample`, `patchOption`, `sampleBox`, `patchTypes`, `industry`, `ironOn`, `assetResource`, and more. Studio is embedded at `/studio`; content updates propagate via ISR + on-demand `/api/revalidate`.
- **JSON-LD** ([schemas.ts](src/lib/schemas.ts)): Organization, Person (founder E-E-A-T), Product, AggregateOffer, FAQPage, Article, BreadcrumbList
- **AEO**: dedicated `/ai-info/*` pages, `public/llms.txt`, "answer-first" FAQ libraries (generic / per-slug / per-location)
- **International**: hreflang clusters for US/UK/CA/AU ([countryHreflang.ts](src/lib/countryHreflang.ts))
- **Indexing**: dynamic [sitemap.ts](src/app/sitemap.ts) + [robots.ts](src/app/robots.ts) (explicitly allows AI crawlers), `next-sitemap`, and an [IndexNow ping script](indexnow-ping.mjs)
- **Migration**: 300+ legacy WordPress redirects live in `next.config.mjs`

---

## Getting Started

### Prerequisites
- **Node.js 20+** and npm (developed on Node 24)
- Access to the shared Supabase project, the Sanity project, and the Square account

### Setup
```bash
# 1. Install dependencies (auto-approves build scripts for sharp/esbuild via allowScripts)
npm install

# 2. Create .env.local (gitignored — never commit) — see Environment Variables

# 3. Run the dev server
npm run dev          # http://localhost:3000
```

### Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`.ts`/`.tsx`) |

> Sanity Studio is embedded at [`/studio`](src/app/studio) — there is no separate `studio` script.

---

## Environment Variables

`.env.local` is gitignored; production values live in Vercel (and Supabase/Square dashboards for server secrets). `NEXT_PUBLIC_*` values are browser-exposed by design (the Supabase anon key is RLS-protected). Analytics IDs are hardcoded in `layout.tsx`, not env vars.

```env
# ── Supabase ──
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>          # browser, RLS-protected
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>       # server-only, bypasses RLS
SUPABASE_WEBHOOK_SECRET=<shared-secret>            # verifies order-paid webhook

# ── Sanity ──
NEXT_PUBLIC_SANITY_PROJECT_ID=hjpcv7rv
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<token>                           # writes / authenticated reads

# ── App URLs ──
APP_URL=https://www.pandapatches.com               # Square redirect base
NEXT_PUBLIC_SITE_URL=https://www.pandapatches.com  # canonical / feeds

# ── Square (checkout) ──
SQUARE_ACCESS_TOKEN=<token>
SQUARE_LOCATION_ID=<location-id>
SQUARE_WEBHOOK_SIGNATURE_KEY=<signature-key>

# ── Email ──
ZEPTOMAIL_TOKEN=<send-token>

# ── AI generator (FAL) ──
FAL_API_KEY=<fal-key>
AI_GEN_PROVIDER=fal                                # or "mock" for local dev
AI_GEN_MODEL=<model-id>                            # e.g. fal-ai/flux/schnell

# ── Meta CAPI ──
META_PIXEL_ID=<pixel-id>
META_ACCESS_TOKEN=<capi-token>
META_TEST_EVENT_CODE=<test-code>                   # optional, sandbox only

# ── Infra ──
UPSTASH_REDIS_REST_URL=<url>
UPSTASH_REDIS_REST_TOKEN=<token>
CRON_SECRET=<secret>                               # authorizes Vercel cron calls
REVALIDATE_TOKEN=<secret>                          # authorizes on-demand ISR
```

---

## API Routes

| Route | Purpose |
|-------|---------|
| `POST /api/checkout-square` · `/api/checkout-offers-square` | Create Square checkout (calculator/quote vs. offers) |
| `POST /api/webhooks/square` | Square payment webhook → create order |
| `POST /api/webhooks/supabase-order-paid` | Realtime order-paid → Meta CAPI Purchase (redundant/refund-aware) |
| `POST /api/ai-patch/generate` · `/api/ai-patch/prepare-handoff` | Generate AI patch · hand design into order flow |
| `POST /api/auth/signup` · `/api/auth/reset-password` · `GET /auth/signout` | Auth helpers |
| `POST /api/account/reorder` | Re-priced reorder from history |
| `POST /api/quote` · `/api/lead` · `/api/partial-lead` | Quote / lead / partial-lead capture |
| `POST /api/contact` · `/api/partner` · `/api/sample-box` · `/api/feedback` | Form intake |
| `POST /api/meta/contact` | Meta CAPI Contact (Tawk + others) |
| `GET /api/products` · `/api/products/[id]` · `/api/products-feed` | Product data + Google/Meta shopping feed |
| `POST /api/revalidate` | On-demand ISR (token-gated) |
| `GET /api/cron/abandoned-cart` · `/api/cron/cleanup-ai-generations` | Scheduled jobs |

---

## Scheduled Jobs (Cron)

Configured in [vercel.json](vercel.json), authorized via `CRON_SECRET`:

| Job | Schedule | Purpose |
|-----|----------|---------|
| `/api/cron/abandoned-cart` | every 15 min (`*/15 * * * *`) | Recover abandoned carts (email at 30 min, then 24 h with 10% code); expire after 7 days |
| `/api/cron/cleanup-ai-generations` | daily 04:00 UTC (`0 4 * * *`) | Purge 30-day-old AI artifacts; keep analytics rows |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx · layout.tsx          # Home + global analytics/Tawk/attribution
│   ├── offers/                        # Fixed-price packs + inline order flow
│   ├── ai-patch-generator/            # FAL AI generator
│   ├── bulk-custom-patches/           # Bulk ordering
│   ├── custom-patches/[slug] · custom-products/[slug]
│   ├── account/ · login · signup · forgot/reset-password · auth/
│   ├── ai-info/ · case-studies/ · reviews/ · partners/ · locations/
│   ├── custom-*-patches · *-vs-* · custom-patches-{uk,canada,australia}
│   ├── blogs/ · [slug] · styles/[slug] · assets/[slug]
│   ├── studio/                        # Embedded Sanity Studio
│   ├── sitemap.ts · robots.ts
│   └── api/                           # 23 route handlers (see above)
├── components/                        # ~92 components (home, product, bulk, auth,
│                                      #   ai-patch, offers, reviews, layout, seo, …)
├── lib/                               # 45 modules — square, aiGenerator, metaCapi,
│                                      #   attribution, pricing, email, seo, schemas,
│                                      #   supabase/*, sanitize, offerPackages, …
├── hooks/                             # useFileUpload, usePriceCalculation
└── proxy.ts                           # Next.js 16 middleware: CSP · rate limit · CORS

sanity/schemas/                        # 25 Sanity document types
next.config.mjs                        # images, headers, 300+ WP redirects
vercel.json · next-sitemap.config.js · indexnow-ping.mjs
```

---

## Configuration & Conventions

- **CSP / middleware:** managed in **[src/proxy.ts](src/proxy.ts)** (Next.js 16 renamed `middleware.ts` → `proxy.ts`). Add any new third-party script domain here — **not** in `next.config.mjs`.
- **Brand tokens:** `panda.green #3B7E00`, `panda.yellow #E3FF15`, `panda.dark #001400` ([tailwind.config.ts](tailwind.config.ts)); font is Outfit.
- **Images:** `next/image` with `cdn.sanity.io` + Supabase remote patterns; AVIF/WebP; long-lived cache.
- **Conventions:** components `PascalCase.tsx`, utilities `camelCase.ts`, Tailwind for styling; new pages → add to sitemap, use the **`www.pandapatches.com`** canonical.
- **Do not touch** without intent: `proxy.ts` CSP rules, conversion-tracking IDs in `layout.tsx`, and the Tawk init.

---

## Deployment

Auto-deploys to **Vercel** on push to `main`. Set all env vars in the Vercel project and pin Node to 20.x. Cron runs from `vercel.json`. The shared Supabase backend (DB migrations + Edge Functions) is owned/deployed alongside the CRM.

```bash
npm run build && npm start   # local production check
```

---

## Contributing

1. Branch from `main`: `git checkout -b feature/your-feature`
2. Keep `/custom-patches/*` pages, `proxy.ts` CSP, and conversion IDs intact unless intentionally changing them
3. `npm run lint` and verify responsive/mobile before opening a PR

---

## Author

**Hassan Jamal** — Full-stack Developer · Owner/CEO: Imran Raza (Panda Patches)

**Last Updated:** June 2026 · **Version:** 1.2.0
