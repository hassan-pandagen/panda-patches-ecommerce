# Meta Conversions API — Testing Guide

Shipped: 2026-04-20. Test before relying on for ad optimization.

---

## 1. Pre-flight checklist

Before you test anything, verify these are live:

### Vercel environment variables
Production scope, all saved:

| Key | Value |
|---|---|
| `META_PIXEL_ID` | `1515101469424765` |
| `META_ACCESS_TOKEN` | `EAA...` (long token from Meta Events Manager) |
| `SUPABASE_WEBHOOK_SECRET` | `585f44cac0b89c78e1e32245fc64fefaa5f74cf00acd24f7c6cd2a33496b1635` |
| `META_TEST_EVENT_CODE` | *(optional — set this during testing to send to Test Events tab only, unset for production)* |

### Supabase
Run if not already:

```sql
ALTER TABLE orders  ADD COLUMN IF NOT EXISTS attribution JSONB;
ALTER TABLE quotes  ADD COLUMN IF NOT EXISTS attribution JSONB;
ALTER TABLE orders  ADD COLUMN IF NOT EXISTS meta_capi_sent_at TIMESTAMPTZ;
ALTER TABLE orders  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
```

### Database webhook
Supabase dashboard → Database → Webhooks → `meta_capi_order_paid`:
- Table: `public.orders`
- Events: UPDATE only
- URL: `https://www.pandapatches.com/api/webhooks/supabase-order-paid`
- Header: `Authorization: Bearer 585f44cac0b89c78e1e32245fc64fefaa5f74cf00acd24f7c6cd2a33496b1635`

### Vercel deployment
`main` branch deploy is live with the latest code.

---

## 2. What fires when

| Trigger | Event sent to Meta | Source file |
|---|---|---|
| User submits any quote form on the site | `Lead` (server + browser pixel, deduped via `eventID`) | `/api/quote/route.ts` |
| User completes Stripe Checkout on `/custom-patches/*` or `/offers` | `Purchase` (server only, from Stripe webhook) | `/api/webhooks/stripe/route.ts` |
| CRM marks an order paid (`amount_paid >= order_amount`) | `Purchase` (server only, from Supabase DB webhook) | `/api/webhooks/supabase-order-paid/route.ts` |

**Dedup rule:** Stripe-direct orders get `meta_capi_sent_at` stamped at insert time so the Supabase webhook treats them as already-sent and skips firing again.

---

## 3. Testing

### Set up Test Events mode first (recommended)
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2) → Pixel `1515101469424765` → **Test Events** tab.
2. Copy the test event code (like `TEST12345`).
3. Set it in Vercel as `META_TEST_EVENT_CODE`. Redeploy.
4. All events will now go ONLY to the Test Events panel in real-time, not to your live data.
5. After all tests pass, REMOVE the env var and redeploy.

### Test 1: Lead event (quote form)

**Steps:**
1. Open an incognito window. Visit `https://www.pandapatches.com/?fbclid=TEST_LEAD_001`.
2. Open DevTools → Application → Cookies → confirm `_fbp` cookie exists (set by the pixel).
3. Scroll to the hero form. Fill it with real-looking test data:
   - Name: Test User
   - Email: test+lead@pandapatches.com
   - Phone: +13025554444
   - Any quantity, size, backing
4. Submit.

**Expected within 10 seconds:**
- Meta Events Manager → Test Events tab:
  - One `Lead` event appears
  - Badge shows **"Received from browser AND server"** → deduplication working
  - Match quality tab shows email, phone, fbp, fbc, IP, user agent

**If badge shows only "Server" or only "Browser":**
- Only "Server" = browser pixel didn't fire. Check `fbq` is loaded on the page (DevTools console: `typeof fbq` should be `"function"`).
- Only "Browser" = server CAPI failed. Check Vercel logs for `[META CAPI]` lines.

**Supabase verification:**
Go to `quotes` table, find your test quote. Confirm the `attribution` column has `{"fbp": "fb.1...", "fbc": "fb.1...TEST_LEAD_001", ...}` JSON.

### Test 2: Purchase via direct Stripe checkout

**Steps:**
1. Open an incognito window. Visit `https://www.pandapatches.com/custom-patches/embroidered?fbclid=TEST_PURCH_001`.
2. Configure a small patch (50 qty, under $200).
3. Proceed to checkout. Use real-looking data.
4. Use Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC.
5. Complete payment.

**Expected within 30 seconds (Stripe webhook delay):**
- Meta Events Manager → Test Events tab: `Purchase` event with "Server" badge.
- `value` field shows the order total.
- `user_data` has email + phone hashes + fbp + fbc.

**Supabase verification:**
`orders` table → find the new row:
- `status = 'PAID'`
- `amount_paid = order_amount`
- `attribution` populated
- `meta_capi_sent_at` has a timestamp (critical — this is what prevents the Supabase webhook from re-firing)
- `paid_at` has a timestamp

### Test 3: Purchase via CRM manual update

**Steps:**
1. In Supabase, create a test order row:
```sql
INSERT INTO orders (
  customer_name, customer_email, customer_phone,
  order_amount, amount_paid, status,
  sales_agent, lead_source, patches_quantity
) VALUES (
  'Test CRM Customer', 'test+crm@pandapatches.com', '+13025555555',
  100.00, 0, 'NEW_ORDER',
  'CRM_TEST', 'Chat', 50
) RETURNING id;
```
Note the returned `id`.

2. Wait 2 seconds. Now mark it paid:
```sql
UPDATE orders
SET amount_paid = 100.00, status = 'APPROVED'
WHERE id = <the id from above>;
```

**Expected within 5 seconds:**
- Meta Events Manager → Test Events tab: `Purchase` event appears, "Server" badge.
- Event ID format: `<order_number>_purchase` (e.g. `ORD-000123_purchase`)

**Supabase verification:**
The same order row now has `meta_capi_sent_at` stamped and `paid_at` set.

### Test 4: Edge cases

**Cancelled orders should NOT fire:**
```sql
UPDATE orders SET status = 'CANCELLED' WHERE id = <id>;
UPDATE orders SET amount_paid = 100 WHERE id = <id>;  -- just in case
```
No event should fire in Meta.

**Already-sent orders should NOT re-fire:**
```sql
UPDATE orders SET amount_paid = amount_paid WHERE id = <id>;
```
No-op UPDATE. Should not double-fire. Check Vercel logs: response should show `skipped: 'already_sent'` or `not_newly_paid`.

---

## 4. Production cut-over

After all 4 tests pass in Test Events mode:

1. Remove `META_TEST_EVENT_CODE` from Vercel env vars.
2. Redeploy.
3. Submit one real test quote via the live site (not test mode).
4. Meta Events Manager → **Overview** tab → confirm event appears in real-time feed (not Test Events tab this time).
5. Wait 30 minutes → Diagnostics tab → Event Match Quality score should start populating (need ~10 events minimum).

**Target match quality: 7.0+ within 48 hours of live traffic.**

---

## 5. Vercel log debugging

Useful log filters (Vercel → Deployments → Functions → Logs):

| Grep pattern | What it tells you |
|---|---|
| `[META CAPI]` | Every CAPI send attempt with event name + event_id |
| `[META CAPI] Sent` | Successful sends |
| `[META CAPI] Event send failed` | Meta rejected the event — check status code + JSON response |
| `[META CAPI] META_ACCESS_TOKEN not set` | Env var missing — check Vercel config |
| `meta_capi_sent_at` | Appears in order insert/update queries |
| `supabase-order-paid` | The DB webhook route being hit |

---

## 6. Common issues

### "Lead fires but Purchase doesn't"
- Check Stripe webhook is configured for `https://www.pandapatches.com/api/webhooks/stripe` (not apex).
- Confirm `STRIPE_WEBHOOK_SECRET` env var matches Stripe dashboard.
- Check Vercel function logs for Stripe webhook — should show "Sent Purchase" line.

### "Manual CRM updates don't fire"
- Verify Supabase Database Webhook `meta_capi_order_paid` is Active (not disabled).
- Check the webhook's "Delivery Logs" in Supabase — should show 200 responses from `/api/webhooks/supabase-order-paid`.
- If getting 401, the `Authorization` header value doesn't match `SUPABASE_WEBHOOK_SECRET` in Vercel.
- If getting "skipped: not_newly_paid", check: was `amount_paid` actually increased, and did it cross `order_amount`?

### "Match Quality stuck below 6"
- Need more events (10+).
- Ensure email and phone are being captured on quote forms (not all forms require phone).
- Add first_name / last_name more aggressively (currently only parsed from `customer_name`).

### "Duplicate events in Meta"
- Check the `event_id` field in Test Events — browser event and server event should have the SAME event_id.
- If different, dedup is broken. Inspect `HeroForm.tsx` / `BulkQuoteForm.tsx` / etc. — they should pass `eventId` to `/api/quote` AND use it in the `fbq('track', ..., { eventID })` call.

---

## 7. What's NOT in this phase

Phase 2 work (not blocking):
- **Messenger/Instagram DM orders** — no PSID capture yet. Match quality for these = email + phone only (~6-7/10). Build Messenger Page webhook later to grab PSIDs.
- **InitiateCheckout from portal** when team sends a quote — portal-side work.
- **Historical backfill** — upload past 60 orders to Meta Events Manager via CSV to seed optimization (the exporter script isn't built yet).
- **Deposit vs Final payment** — currently fires one Purchase event when `amount_paid >= order_amount`. To track partial deposits separately, add a `deposit_capi_sent_at` column and split logic.

---

## 8. Rollback

If something goes wrong in production, disable Meta CAPI entirely without deploying:

1. Vercel → Settings → Environment Variables → delete `META_ACCESS_TOKEN`.
2. Redeploy (any deploy).

The code will log `[META CAPI] META_ACCESS_TOKEN not set, skipping event` and skip all sends silently. Orders still flow normally. No customer-facing impact.

---

## Quick reference — files changed

**New:**
- `src/lib/metaCapi.ts`
- `src/lib/attribution.ts`
- `src/lib/clientAttribution.ts`
- `src/components/AttributionCapture.tsx`
- `src/app/api/webhooks/supabase-order-paid/route.ts`

**Modified:**
- `src/app/layout.tsx` — mounted `<AttributionCapture />`
- `src/app/api/quote/route.ts` — attribution + Lead CAPI
- `src/app/api/checkout/route.ts` — forwards attribution to Stripe metadata
- `src/app/api/webhooks/stripe/route.ts` — parses attribution, fires Purchase CAPI, stamps `meta_capi_sent_at`
- `src/components/home/HeroForm.tsx`, `BulkQuoteForm.tsx`, `QuoteModal.tsx`, `ComplexCalculator.tsx`, `OffersClient.tsx` — attribution capture + pixel Lead/InitiateCheckout events
