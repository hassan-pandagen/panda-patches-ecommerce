# Next.js 16 Migration Plan

**Project:** Panda Patches E-commerce
**Current:** Next.js 14.2.35, React 18, Edge middleware
**Target:** Next.js 16.2+, React 19, Node.js proxy
**Timeline:** 2 weeks (staging branch, behind closed doors)
**Goal:** Stable for 6+ months with zero framework maintenance

---

## Why Upgrade

| Reason | Detail |
|--------|--------|
| **Security** | Next.js 14 security support ended October 2025. No more patches. |
| **EOL on Vercel** | 14.x approaching end-of-life on Vercel's build system |
| **Performance** | Turbopack: ~400% faster dev startup, ~50% faster rendering |
| **Stability** | 16.x receives security patches through late 2027 |
| **React 19** | Modern hooks, better hydration, Server Components improvements |

---

## Codebase Audit Summary

The codebase is in excellent shape. Full App Router, no Pages Router legacy, no deprecated patterns.

### What's Clean (No Changes Needed)
- All API routes use proper async/await
- No `headers()` or `cookies()` imports from `next/headers`
- No AMP usage (removed in 16)
- No Pages Router / `getServerSideProps` / runtime config
- No `forwardRef` usage (deprecated in React 19)
- `useSearchParams()` already wrapped in proper client components
- All `next/image` and `next/link` usage is standard
- Supabase uses service role key in API routes only (no auth middleware)
- Stripe/PayPal SDKs are server-side only, fully compatible

### What Needs Changes (4 Files)

| File | Changes | Effort |
|------|---------|--------|
| `package.json` | Version bumps, remove critters, update lint script | 10 min |
| `next.config.mjs` | Remove 3 deprecated options, replace webpack alias | 15 min |
| `src/middleware.ts` | Rename to `proxy.ts`, rename export, fix `request.ip` | 20 min |
| 6 dynamic page files | Add `await` to `params` (type changes) | 30 min |

---

## Execution Strategy: One Change at a Time

We do NOT apply all changes at once. Each step is isolated so we know exactly what broke if something fails.

**How it works:** Claude makes one change, runs `npm run build`, confirms it passes or fails. Only then moves to the next step. If a step fails, we fix it before continuing. You do ONE round of browser testing at the end on the Vercel preview.

### Step-by-Step Execution Order

| Step | What Changes | File(s) | Build Check | If Build Fails |
|------|-------------|---------|-------------|----------------|
| 0 | Create branch, snapshot working state | - | Baseline build | Do not proceed |
| 1 | Run codemod (bumps versions, renames middleware, wraps params) | Many | `npm run build` | Review codemod output, fix manually |
| 2 | Remove `swcMinify: true` | `next.config.mjs` | `npm run build` | Check if codemod already removed it |
| 3 | Remove `experimental.optimizeCss` + uninstall critters | `next.config.mjs` + `package.json` | `npm run build` | Check for other experimental flags referencing it |
| 4 | Replace webpack alias with turbopack resolveAlias | `next.config.mjs` | `npm run build` | Try removing alias entirely (proxy is Node.js now) |
| 5 | Update Redis import if alias removed | `src/proxy.ts` | `npm run build` | Revert to cloudflare import + keep turbopack alias |
| 6 | Remove `request.ip` (4 occurrences) | `src/proxy.ts` | `npm run build` | Verify x-forwarded-for fallback syntax |
| 7 | Verify proxy function + config export renamed | `src/proxy.ts` | `npm run build` | Manually rename if codemod missed it |
| 8 | Fix `params` in `custom-patches/[slug]/page.tsx` | 1 file | `npm run build` | Check codemod output, fix await syntax |
| 9 | Fix `params` in `[slug]/page.tsx` | 1 file | `npm run build` | Same |
| 10 | Fix `params` in `custom-products/[slug]/page.tsx` | 1 file | `npm run build` | Same |
| 11 | Fix `params` in `assets/[slug]/page.tsx` | 1 file | `npm run build` | Same |
| 12 | Fix `params` in `styles/[slug]/page.tsx` | 1 file | `npm run build` | Same |
| 13 | Fix `params` in `api/products/[id]/route.ts` | 1 file | `npm run build` | Same |
| 14 | Update lint script in package.json | `package.json` | `npm run build` | Not build-critical, can skip |
| 15 | Update third-party packages (react-hook-form, lucide-react) | `package.json` | `npm run build` | Pin to last known working version |
| 16 | Final clean build (delete .next + node_modules, fresh install) | - | `npm run build` | Isolate which cached artifact is stale |

### After All Steps Pass

| What | Who | Where |
|------|-----|-------|
| Push branch to GitHub | Claude | `git push -u origin migration/nextjs-16` |
| Vercel preview auto-deploys | Vercel | Automatic |
| Browser testing (payments, CSP, chat, images, mobile) | **You** | Preview URL in browser |
| Fix any browser-only issues | Claude | On the same branch |
| Merge to main | **You** (confirm) then Claude | `git merge` |

### Why This Order?

1. **Codemod first** because it does the heavy lifting and we see what's left
2. **Config changes next** because they're most likely to cause build failures
3. **Proxy changes next** because they affect every request
4. **Page params last** because they're isolated per-page (one page failing won't break others)
5. **Lint + packages last** because they're non-critical to the build

### Tracking Progress

Each step will be marked as we go:

```
[ ] Step 0:  Create branch + baseline build
[ ] Step 1:  Run codemod
[ ] Step 2:  Remove swcMinify
[ ] Step 3:  Remove optimizeCss + critters
[ ] Step 4:  Replace webpack with turbopack alias
[ ] Step 5:  Update Redis import
[ ] Step 6:  Remove request.ip
[ ] Step 7:  Verify proxy rename
[ ] Step 8:  Fix params - custom-patches/[slug]
[ ] Step 9:  Fix params - [slug]
[ ] Step 10: Fix params - custom-products/[slug]
[ ] Step 11: Fix params - assets/[slug]
[ ] Step 12: Fix params - styles/[slug]
[ ] Step 13: Fix params - api/products/[id]
[ ] Step 14: Update lint script
[ ] Step 15: Update third-party packages
[ ] Step 16: Final clean build
[ ] Step 17: Push + Vercel preview
[ ] Step 18: Browser testing (YOU)
[ ] Step 19: Merge to production (YOUR APPROVAL)
```

---

## Phase 1: Preparation (Day 1)

### 1.1 Verify Node.js Version

Next.js 16 requires Node.js 20.9+.

```bash
node -v
```

If below 20.9, install Node.js 20 LTS. Also update Vercel:
**Vercel Dashboard > Project > Settings > General > Node.js Version > 20.x**

### 1.2 Create Migration Branch

```bash
git checkout -b migration/nextjs-16
```

### 1.3 Run the Official Codemod (Handles ~80% Automatically)

Preview first:
```bash
npx @next/codemod@canary upgrade latest --dry
```

Then apply:
```bash
npx @next/codemod@canary upgrade latest
```

**What the codemod does:**
- Bumps `next`, `react`, `react-dom` versions in package.json
- Renames `middleware.ts` to `proxy.ts` and the exported function
- Wraps `params` and `searchParams` with `await` where possible
- Moves stabilized experimental flags to top-level config
- Updates ESLint config

**What the codemod does NOT do (manual work below):**
- Remove `swcMinify` from config
- Remove `experimental.optimizeCss`
- Migrate webpack alias to Turbopack
- Replace `request.ip` with `x-forwarded-for` header
- Remove `critters` devDependency
- Update third-party package versions

---

## Phase 2: Manual Config Changes (Day 2-3)

### 2.1 package.json

**Remove `critters`** (only used by `optimizeCss`, incompatible with Turbopack):
```bash
npm uninstall critters
```

**Update lint script** (`next lint` is removed in 16):
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint . --ext .ts,.tsx"
}
```

**Update compatible packages:**
```bash
npm install react-hook-form@latest lucide-react@latest
```

**Verify these versions after codemod runs:**
```json
{
  "next": "^16.2.0",
  "react": "^19",
  "react-dom": "^19",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint-config-next": "^16.2.0"
}
```

### 2.2 next.config.mjs

**5 changes required.** Here is exactly what to change:

#### Change 1: Remove `swcMinify` (line 3)
SWC minification is always-on in 15+. This option causes a build error.

```diff
  const nextConfig = {
-   swcMinify: true,
    poweredByHeader: false,
```

#### Change 2: Remove `experimental.optimizeCss` (line 7)
Incompatible with Turbopack and App Router. Uses deprecated `critters` package.

```diff
  experimental: {
-   optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'swiper'],
  },
```

#### Change 3: Replace webpack alias with turbopack resolveAlias (lines 25-28)
Custom webpack config is ignored by Turbopack (the new default bundler).

Since `proxy.ts` now runs on Node.js (not Edge), you can use the standard `@upstash/redis` import. But to be safe, add the Turbopack equivalent:

```diff
- webpack: (config) => {
-   config.resolve.alias['@upstash/redis'] = '@upstash/redis/cloudflare';
-   return config;
- },
+ turbopack: {
+   resolveAlias: {
+     '@upstash/redis': '@upstash/redis/cloudflare',
+   },
+ },
```

**Alternative (simpler):** Since proxy.ts runs on Node.js in Next.js 16, you may not need the `/cloudflare` variant at all. Test without the alias first. If rate limiting works, delete the alias entirely.

#### Change 4: Update header comment (line 86)
```diff
- // Security headers for all routes (CSP now handled in middleware.ts)
+ // Security headers for all routes (CSP now handled in proxy.ts)
```

#### Change 5: Verify `serverExternalPackages` stays at top level
The codemod may or may not move this. Ensure it is NOT inside `experimental`:
```js
serverExternalPackages: ['@paypal/paypal-server-sdk'],
```

### 2.3 middleware.ts to proxy.ts

The codemod should rename the file and function. Verify and make these additional changes:

#### Change 1: Update import (if codemod misses it)
```diff
- import { Redis } from '@upstash/redis/cloudflare';
+ import { Redis } from '@upstash/redis';
```

Only if you removed the Turbopack alias. Otherwise keep as-is.

#### Change 2: Replace `request.ip` (4 occurrences)
`NextRequest.ip` was removed in Next.js 15. You already have the fallback in place. Just remove `request.ip`:

**Line 143:**
```diff
- const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
+ const ip = request.headers.get('x-forwarded-for') || 'anonymous';
```

**Line 170:**
```diff
- const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
+ const ip = request.headers.get('x-forwarded-for') || 'anonymous';
```

**Line 197:**
```diff
- const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
+ const ip = request.headers.get('x-forwarded-for') || 'anonymous';
```

**Line 225:**
```diff
- const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
+ const ip = request.headers.get('x-forwarded-for') || 'anonymous';
```

#### Change 3: Rename function export (if codemod misses it)
```diff
- export async function middleware(request: NextRequest) {
+ export async function proxy(request: NextRequest) {
```

#### Change 4: Rename matcher config export (if codemod misses it)
```diff
  export const config = {
    matcher: [
-     // Match all routes EXCEPT static files, Next.js internals, and Sanity Studio
      '/((?!_next/static|_next/image|favicon\\.ico|assets/|studio).*)',
    ],
  };
```

Matcher syntax stays the same. Just verify the codemod didn't break the regex.

#### CSP Wildcard Trick: No Change Needed
The `String.fromCharCode(42)` workaround (line 66-68) works at JavaScript runtime, not build time. It is compatible with both Webpack and Turbopack. Verify after build.

---

## Phase 3: Dynamic Page Params (Day 4)

In Next.js 16, `params` is a Promise that must be awaited. The codemod should handle most of this, but verify each file.

### Files to Update (6 page files + 1 API route)

#### src/app/custom-patches/[slug]/page.tsx

**Line 102 (generateMetadata):**
```diff
- export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
+ export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
+   const { slug } = await params;
```
Then replace all `params.slug` with `slug` inside this function.

**Line 144 (Page component):**
```diff
- export default async function DynamicProductPage({ params }: { params: { slug: string } }) {
+ export default async function DynamicProductPage({ params }: { params: Promise<{ slug: string }> }) {
+   const { slug } = await params;
```
Then replace all `params.slug` with `slug` inside this function.

#### src/app/[slug]/page.tsx

**Line 14 (generateMetadata):**
```diff
- export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
+ export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
+   const { slug } = await params;
```

**Line 126 (Page component):**
```diff
- export default async function CatchAllPage({ params }: { params: { slug: string } }) {
+ export default async function CatchAllPage({ params }: { params: Promise<{ slug: string }> }) {
+   const { slug } = await params;
```

#### src/app/custom-products/[slug]/page.tsx

**Line 30 (generateMetadata):**
```diff
- export async function generateMetadata({ params }: { params: { slug: string } }) {
+ export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
+   const { slug } = await params;
```

**Line 60 (Page component):**
```diff
- export default async function CustomProductPage({ params }: { params: { slug: string } }) {
+ export default async function CustomProductPage({ params }: { params: Promise<{ slug: string }> }) {
+   const { slug } = await params;
```

#### src/app/assets/[slug]/page.tsx

**Line 28 (Page component):**
```diff
- export default async function AssetPage({ params }: { params: { slug: string } }) {
+ export default async function AssetPage({ params }: { params: Promise<{ slug: string }> }) {
+   const { slug } = await params;
```

#### src/app/styles/[slug]/page.tsx

**Line 22 (Page component):**
```diff
- export default async function PatchStylePage({ params }: { params: { slug: string } }) {
+ export default async function PatchStylePage({ params }: { params: Promise<{ slug: string }> }) {
+   const { slug } = await params;
```

#### src/app/api/products/[id]/route.ts

**Lines 9-12 (API route):**
```diff
  export async function GET(
    request: NextRequest,
-   { params }: { params: { id: string } }
+   { params }: { params: Promise<{ id: string }> }
  ) {
+   const { id } = await params;
```
Then replace all `params.id` with `id` inside this function.

### Files That DON'T Need Changes

These use `request.nextUrl.searchParams` (from the URL object, not the page prop) and are NOT affected:
- `src/app/api/products/route.ts` (line 14)
- `src/app/api/revalidate/route.ts` (line 10)

This client component uses `useSearchParams()` hook, which is NOT affected:
- `src/app/success-paypal/page.tsx` (line 8)

---

## Phase 4: Build + Dev Smoke Test (Day 5-6)

### 4.1 Install Dependencies
```bash
rm -rf node_modules .next
npm install
```

### 4.2 Dev Server Test
```bash
npm run dev
```

Check for:
- Console errors on startup
- CSP violations in browser DevTools console
- Tawk.to chat widget loads
- Images load from Sanity CDN
- All product pages render (`/custom-patches/embroidered`, etc.)

### 4.3 Production Build
```bash
npm run build
```

Common build errors and fixes:

| Error | Fix |
|-------|-----|
| `swcMinify is not a valid option` | Remove from next.config.mjs |
| `Cannot find module '@upstash/redis/cloudflare'` | Update import or add turbopack alias |
| `params is not iterable` or `params.then is not a function` | Missing `await params` in a page |
| `experimental.optimizeCss is not supported` | Remove from next.config.mjs |
| Type errors on `@types/react` | Ensure @types/react@19 is installed |

### 4.4 Run Locally
```bash
npm run build && npm start
```

Walk through every page type manually:
- Home page
- Product pages (embroidered, woven, PVC, chenille, leather)
- Custom products pages
- Blog listing and individual posts
- Contact, About, Sample Box
- Offers page
- Success and error pages

---

## Phase 5: Vercel Preview Deployment (Day 7-8)

Push the branch. Vercel creates a preview deployment automatically.

```bash
git add -A
git commit -m "chore: migrate to Next.js 16 + React 19"
git push -u origin migration/nextjs-16
```

Vercel preview URL will look like:
`https://panda-patches-ecommerce-<hash>.vercel.app`

### 5.1 Verify Vercel Build

Check Vercel dashboard for:
- Build succeeds
- No function errors in logs
- Node.js 20.x is selected

### 5.2 Verify Environment Variables

All existing env vars work the same way. No changes needed. But verify on the preview deployment that:
- Stripe checkout creates a session
- PayPal buttons load
- Supabase writes work (check orders table)
- ZeptoMail sends emails
- Upstash rate limiting works

---

## Phase 6: Payment Flow Testing (Day 9-10) **CRITICAL**

This is the most important testing phase. Payments are your revenue. Test on the Vercel preview deployment.

### 6.1 Stripe Checkout Flow

1. Go to any product page on the preview URL
2. Fill out the calculator form
3. Click checkout
4. Complete payment with Stripe test card: `4242 4242 4242 4242`
5. Verify:
   - Redirected to success page
   - Order appears in Supabase `orders` table
   - Status updates to `PAID` (webhook fires)
   - Confirmation email sent via ZeptoMail

### 6.2 PayPal Checkout Flow

1. Complete an order using PayPal sandbox
2. Verify:
   - PayPal popup opens correctly
   - Order captured on return
   - Supabase order created and updated
   - `paypal_pending_orders` table used if localStorage missing

### 6.3 Stripe Webhook Test (CLI)

```bash
stripe listen --forward-to https://panda-patches-ecommerce-<hash>.vercel.app/api/webhooks/stripe
stripe trigger checkout.session.completed
```

Verify webhook handler processes the event and updates Supabase.

### 6.4 Quote Form Flows

Test all three quote entry points:
- Home page HeroForm
- Bulk order form
- Contact page form

Verify:
- Internal email to lance@ fires
- Customer email fires (when basePrice present)
- Supabase `quotes` table populated

---

## Phase 7: CSP + Security Verification (Day 11)

### 7.1 CSP Header Check

Open browser DevTools > Network tab on the preview deployment. Check any page response:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' ...
```

Verify:
- Header is present (not empty or missing)
- Wildcard domains resolve correctly (e.g., `https://*.tawk.to` not `https://.tawk.to`)
- No CSP violations in Console tab

### 7.2 Third-Party Script Verification

| Script | How to Verify |
|--------|---------------|
| Tawk.to chat | Widget appears in bottom-right corner |
| Google Analytics (GA4) | Network tab shows requests to google-analytics.com |
| Google Tag Manager | Network tab shows gtm.js loaded |
| Stripe.js | Loads on checkout pages |
| PayPal SDK | Loads on PayPal checkout pages |
| Trustpilot | Widget renders on pages that use it |
| Microsoft Clarity | Network tab shows clarity.ms requests |
| Facebook Pixel | Network tab shows facebook.net requests |

### 7.3 Rate Limiting Test

Hit `/api/checkout` with `curl` more than 20 times in a minute:
```bash
for i in $(seq 1 25); do curl -s -o /dev/null -w "%{http_code}\n" -X POST https://preview-url/api/checkout; done
```

Requests 21+ should return `429`.

### 7.4 Redirect Verification

Test a few key redirects:
```bash
curl -sI https://preview-url/blog | grep location
curl -sI https://preview-url/shop | grep location
curl -sI https://preview-url/about-us | grep location
```

---

## Phase 8: Full Regression (Day 12-13)

### 8.1 Mobile Testing

Test on a real phone (not just browser DevTools):
- Product pages scroll and zoom correctly
- Calculator form works on iOS Safari
- PayPal popup opens and closes properly
- Tawk.to chat works
- Images lazy-load correctly

### 8.2 SEO Verification

- View page source on key pages. Check `<title>`, `<meta description>`, canonical URLs
- Schema markup (JSON-LD) renders correctly
- `next-sitemap` generates sitemap.xml
- Open Graph images load

### 8.3 Sanity Studio

Visit `/studio` on the preview URL. Verify:
- Studio loads (uses permissive CSP)
- Can browse and edit content
- Revalidation webhook works (`/api/revalidate`)

### 8.4 Conversion Tracking

- Google Ads conversion tag fires on success page
- GTM container loads (check GTM debug mode)
- Tawk.to chat open event fires conversion tag

---

## Phase 9: Deploy to Production (Day 14)

### 9.1 Merge

```bash
git checkout main
git merge migration/nextjs-16
git push origin main
```

Vercel auto-deploys to production.

### 9.2 Post-Deploy Monitoring (24 hours)

| Check | Where |
|-------|-------|
| Vercel function errors | Vercel Dashboard > Logs |
| Stripe webhook failures | Stripe Dashboard > Developers > Webhooks |
| PayPal webhook failures | PayPal Developer Dashboard > Webhooks |
| Supabase order creation | Supabase Dashboard > orders table |
| Google Search Console | Any crawl errors or indexing issues |
| Site uptime | Visit pandapatches.com every few hours |

### 9.3 Rollback Plan

If anything critical breaks after production deploy:

```bash
git revert HEAD --no-edit
git push origin main
```

Vercel redeploys in ~60 seconds. You're back on the working 14.2.35 codebase. Zero downtime.

---

## Risk Matrix

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Payment flow breaks | HIGH | LOW | Test on preview deployment before merge |
| CSP wildcard trick fails | MEDIUM | LOW | Verify in build output, `String.fromCharCode` is runtime |
| React 19 hydration errors | LOW | LOW | No SSR/client mismatches found in audit |
| Supabase auth loops | NONE | NONE | No Supabase Auth in middleware, only service role API calls |
| Third-party package breaks | LOW | LOW | All major deps confirmed compatible |
| Turbopack build failure | MEDIUM | MEDIUM | Fallback: `next build --webpack` |

---

## Breaking Changes Reference

### Removed in Next.js 15
- `swcMinify` config option (always on)
- `NextRequest.geo` property
- `NextRequest.ip` property
- `@next/font` package (use `next/font`)

### Removed in Next.js 16
- Synchronous `params`, `searchParams`, `cookies()`, `headers()` (must await)
- `middleware.ts` filename (renamed to `proxy.ts`)
- `next lint` CLI command
- AMP support
- Webpack as default bundler (Turbopack is default, webpack available via `--webpack` flag)
- `experimental.optimizeCss` with App Router
- Node.js 18 support

### Changed Behavior in Next.js 16
- `fetch()` is no longer cached by default
- `GET` Route Handlers are no longer cached by default
- Proxy runs on Node.js runtime (not Edge)
- Image `minimumCacheTTL` default changed from 60s to 4 hours
- Parallel Routes require explicit `default.js` files

---

## Files Changed Summary

| File | Action |
|------|--------|
| `package.json` | Update versions, remove critters, update lint script |
| `next.config.mjs` | Remove swcMinify, optimizeCss. Replace webpack with turbopack alias |
| `src/middleware.ts` | Rename to `src/proxy.ts`. Rename export. Remove `request.ip` |
| `src/app/custom-patches/[slug]/page.tsx` | Await params (2 functions) |
| `src/app/[slug]/page.tsx` | Await params (2 functions) |
| `src/app/custom-products/[slug]/page.tsx` | Await params (2 functions) |
| `src/app/assets/[slug]/page.tsx` | Await params (1 function) |
| `src/app/styles/[slug]/page.tsx` | Await params (1 function) |
| `src/app/api/products/[id]/route.ts` | Await params (1 function) |

**Total files changed: 9**
**Estimated code changes: ~50 lines**

---

## Post-Migration Cleanup

After confirming production is stable for 48 hours:

1. Delete the `migration/nextjs-16` branch
2. Update `CLAUDE.md` to reference `proxy.ts` instead of `middleware.ts`
3. Update memory files referencing middleware.ts
4. Remove this migration README (or archive it)

---

## Useful Commands

```bash
# Preview codemod changes
npx @next/codemod@canary upgrade latest --dry

# Apply codemod
npx @next/codemod@canary upgrade latest

# Dev with Turbopack (default in 16)
npm run dev

# Dev with Webpack (fallback)
npx next dev --webpack

# Build with Turbopack (default in 16)
npm run build

# Build with Webpack (fallback if Turbopack fails)
npx next build --webpack

# Test Stripe webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Sources

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js proxy.ts API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Next.js Codemods](https://nextjs.org/docs/app/guides/upgrading/codemods)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Turbopack Configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
- [Next.js End of Life Dates](https://endoflife.date/nextjs)
