# Abandoned Cart Recovery — Implementation Context

**Status:** Phase 1 BUILT (2026-04-30) — schema + checkout insert + webhook PURCHASED marks + cron + emails. Phase 2 (CRM push) not built.
**Last updated:** 2026-04-30

## Pre-deploy checklist (do this before pushing live)

1. **Run the SQL migration** in Supabase: open SQL editor, paste [`sql/abandoned_cart.sql`](sql/abandoned_cart.sql), run.
2. **Generate and set `CRON_SECRET`** — a long random string, add to:
   - Local: `.env.local`
   - Vercel: Project Settings → Environment Variables (Production + Preview)
3. **Deploy to Vercel** — the cron picks up `vercel.json` automatically on next deploy.
4. **Verify in Vercel dashboard** → Cron Jobs tab — confirm the `/api/cron/abandoned-cart` job is listed and shows a recent successful run after first deploy + 15 min.
5. **Smoke test** — abandon a real checkout with your own email, wait 30 min, confirm email arrives. Click the CTA, complete the order, confirm the row flips to `PURCHASED` in Supabase.

This document is the full plan for recovering customers who start checkout but don't pay. It's written as a build spec so any developer (or AI agent) can implement it without re-discovering the architecture.

---

## Why this exists

Roughly 70% of online checkouts get abandoned. Even a basic recovery email recovers 10-15% of those. For Panda Patches, with ~$200-$2,000 average order value, recovering one abandoned cart per day pays for the entire system in a week.

The Meta CAPI doc (delivered 2026-04-30) referenced Zoho CRM workflows for this. We don't use Zoho CRM. We use **ZeptoMail + Supabase + Vercel + a separate portal CRM**, so the workflow has to be rebuilt against that stack.

---

## What we have to work with

| Service | Role | Already in use? |
|---------|------|-----------------|
| Supabase | Database for checkout state, dedup, status tracking | Yes — `orders`, `quotes`, `paypal_pending_orders` tables exist |
| ZeptoMail | Transactional email delivery | Yes — used for order confirmations, quote emails |
| Vercel Cron | Scheduled job runner | **Not yet configured** — needs `vercel.json` + new API route |
| Portal CRM | Sales team's lead/order pipeline | Yes — `portal.pandapatches.com`. **API endpoint TBD** — confirm what it accepts before integrating |
| Meta CAPI | Already firing `InitiateCheckout` events | Yes — server-side from `/api/checkout` and `/api/checkout-paypal` |
| Tawk.to | Live chat — could nudge abandoners with a proactive message | Yes — could add a chat trigger later as Phase 2 |

---

## High-level flow

```
User enters email + clicks "Continue to checkout"
     ↓
[/api/checkout] or [/api/checkout-paypal]
     ↓
1. Existing flow runs (Stripe session / PayPal order created)
2. NEW: Upsert row into `checkout_attempts` table
   - Includes email, name, phone, value, items, fbp/fbc, status='PENDING'
3. Existing flow returns redirect URL → user goes to Stripe/PayPal
     ↓
   ┌────────────────────────┬─────────────────────────┐
   │                        │                         │
[User pays]            [User abandons]           [User cancels]
   ↓                        ↓                         ↓
Stripe webhook fires    Nothing happens           Same as abandon
Purchase event             ↓                         ↓
   ↓
[/api/webhooks/stripe]    [Vercel Cron @ */15 min]
Mark checkout_attempts    Find rows where:
status = 'PURCHASED'        - status = 'PENDING'
                            - initiated_at older than 30 min
                            - email_sent_at IS NULL
                          → Send ZeptoMail abandoned-cart email
                          → Update status = 'EMAIL_SENT'
                          → Push lead to portal CRM (optional)
                              ↓
                          [User clicks email link, returns]
                              ↓
                          Goes back to product/checkout page
                              ↓
                          (eventually) pays → webhook → mark PURCHASED
```

The key invariant: **`checkout_attempts.status` is the single source of truth.** PENDING means "we haven't emailed yet." EMAIL_SENT means "we tried." PURCHASED means "they came back and paid." RECOVERED means "they came back via the email link and paid" (optional, more granular).

---

## Database schema

Run this SQL in Supabase:

```sql
CREATE TABLE IF NOT EXISTS checkout_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity (need at least email)
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,

  -- What they were buying
  product_name TEXT,
  quantity INTEGER,
  design_size TEXT,
  backing TEXT,
  delivery_option TEXT,
  cart_value NUMERIC NOT NULL,
  artwork_url TEXT,

  -- Where they tried to check out
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'paypal')),
  provider_session_id TEXT,         -- Stripe session.id or PayPal order ID
  return_url TEXT,                  -- Deep link to bring them back to /custom-patches/<slug>?recover=...

  -- For Meta retargeting + match quality
  fbp TEXT,
  fbc TEXT,
  attribution JSONB,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'EMAIL_SENT', 'EMAIL_2_SENT', 'PURCHASED', 'RECOVERED', 'EXPIRED')),
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  email_sent_at TIMESTAMPTZ,
  email_2_sent_at TIMESTAMPTZ,      -- For 24-hour follow-up
  purchased_at TIMESTAMPTZ,

  -- CRM sync
  pushed_to_crm_at TIMESTAMPTZ,
  crm_lead_id TEXT
);

-- Indexes the cron job will hit hard
CREATE INDEX IF NOT EXISTS idx_checkout_attempts_status_initiated
  ON checkout_attempts(status, initiated_at);
CREATE INDEX IF NOT EXISTS idx_checkout_attempts_email
  ON checkout_attempts(customer_email);
CREATE INDEX IF NOT EXISTS idx_checkout_attempts_provider_session
  ON checkout_attempts(provider_session_id);

-- One unique constraint so a single Stripe session never gets two abandoned emails
CREATE UNIQUE INDEX IF NOT EXISTS uniq_checkout_attempts_session
  ON checkout_attempts(provider_session_id) WHERE provider_session_id IS NOT NULL;
```

---

## Implementation tasks

### Task 1 — Insert the row when checkout starts

**File:** `src/app/api/checkout/route.ts`

After Stripe session is created (around line 188 in current code), insert into `checkout_attempts`:

```typescript
// After: const session = await stripe.checkout.sessions.create(sessionConfig);

await supabase.from('checkout_attempts').upsert({
  customer_email: customer.email,
  customer_name: customer.name,
  customer_phone: customer.phone || null,
  product_name: productName,
  quantity,
  design_size: `${width}" x ${height}"`,
  backing: backing || null,
  delivery_option: deliveryOption,
  cart_value: finalPrice,
  artwork_url: artworkUrl || null,
  payment_provider: 'stripe',
  provider_session_id: session.id,
  return_url: `${baseUrl}/custom-patches?recover=${session.id}`,
  fbp: attribution?.fbp || null,
  fbc: attribution?.fbc || null,
  attribution: attribution || null,
  status: 'PENDING',
  initiated_at: new Date().toISOString(),
}, { onConflict: 'provider_session_id' });
```

**File:** `src/app/api/checkout-paypal/route.ts`

Same pattern, after the PayPal order is created. Use `paypalOrder.id` as `provider_session_id` and `payment_provider: 'paypal'`.

### Task 2 — Mark as PURCHASED on Stripe webhook

**File:** `src/app/api/webhooks/stripe/route.ts`

In the `checkout.session.completed` handler (existing file), add after the order insert:

```typescript
await supabase
  .from('checkout_attempts')
  .update({
    status: 'PURCHASED',
    purchased_at: new Date().toISOString(),
  })
  .eq('provider_session_id', session.id);
```

### Task 3 — Mark as PURCHASED on PayPal capture + webhook

**File:** `src/app/api/capture-paypal/route.ts`

After the order insert, mark the abandoned-cart row purchased:

```typescript
await supabase
  .from('checkout_attempts')
  .update({
    status: 'PURCHASED',
    purchased_at: new Date().toISOString(),
  })
  .eq('provider_session_id', orderId);
```

**File:** `src/app/api/webhooks/paypal/route.ts`

Same in `handlePaymentCaptured` — the webhook is the backup path if capture-paypal didn't run.

### Task 4 — Build the cron handler

**New file:** `src/app/api/cron/abandoned-cart/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SendMailClient } from 'zeptomail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ABANDON_DELAY_MIN = 30;          // Wait 30 min before first email
const FOLLOW_UP_DELAY_HOURS = 24;      // Second email 24 hours later
const EXPIRE_AFTER_DAYS = 7;           // Stop trying after a week

export async function GET(req: Request) {
  // Auth: Vercel Cron sends a CRON_SECRET header
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const firstEmailCutoff = new Date(now.getTime() - ABANDON_DELAY_MIN * 60_000).toISOString();
  const secondEmailCutoff = new Date(now.getTime() - FOLLOW_UP_DELAY_HOURS * 3600_000).toISOString();
  const expireCutoff = new Date(now.getTime() - EXPIRE_AFTER_DAYS * 86400_000).toISOString();

  // 1) First email — PENDING rows older than 30 minutes
  const { data: firstBatch = [] } = await supabase
    .from('checkout_attempts')
    .select('*')
    .eq('status', 'PENDING')
    .lt('initiated_at', firstEmailCutoff)
    .limit(50);

  const firstResults = await Promise.allSettled(
    (firstBatch ?? []).map((row) => sendFirstEmail(row))
  );

  // 2) Follow-up email — EMAIL_SENT rows where email_sent_at is older than 24 hours
  const { data: secondBatch = [] } = await supabase
    .from('checkout_attempts')
    .select('*')
    .eq('status', 'EMAIL_SENT')
    .lt('email_sent_at', secondEmailCutoff)
    .limit(50);

  const secondResults = await Promise.allSettled(
    (secondBatch ?? []).map((row) => sendSecondEmail(row))
  );

  // 3) Expire stale rows after 7 days so we don't spam forever
  await supabase
    .from('checkout_attempts')
    .update({ status: 'EXPIRED' })
    .in('status', ['PENDING', 'EMAIL_SENT', 'EMAIL_2_SENT'])
    .lt('initiated_at', expireCutoff);

  return NextResponse.json({
    firstSent: firstResults.filter((r) => r.status === 'fulfilled').length,
    secondSent: secondResults.filter((r) => r.status === 'fulfilled').length,
  });
}

async function sendFirstEmail(row: any) {
  const mail = new SendMailClient({
    url: 'https://api.zeptomail.com/v1.1/email',
    token: process.env.ZEPTOMAIL_TOKEN!,
  });

  await mail.sendMail({
    from: { address: 'hello@pandapatches.com', name: 'Panda Patches' },
    to: [{ email_address: { address: row.customer_email, name: row.customer_name || '' } }],
    subject: `${row.customer_name?.split(' ')[0] || 'Hey'} — your custom patches are waiting`,
    htmlbody: buildFirstEmailHtml(row),
  });

  await supabase
    .from('checkout_attempts')
    .update({
      status: 'EMAIL_SENT',
      email_sent_at: new Date().toISOString(),
    })
    .eq('id', row.id);

  // Optional: push to portal CRM
  // await pushToCrm(row);
}

async function sendSecondEmail(row: any) {
  const mail = new SendMailClient({
    url: 'https://api.zeptomail.com/v1.1/email',
    token: process.env.ZEPTOMAIL_TOKEN!,
  });

  await mail.sendMail({
    from: { address: 'hello@pandapatches.com', name: 'Panda Patches' },
    to: [{ email_address: { address: row.customer_email, name: row.customer_name || '' } }],
    subject: `One last reminder — 10% off if you finish today`,
    htmlbody: buildSecondEmailHtml(row),  // Include a discount code
  });

  await supabase
    .from('checkout_attempts')
    .update({
      status: 'EMAIL_2_SENT',
      email_2_sent_at: new Date().toISOString(),
    })
    .eq('id', row.id);
}

function buildFirstEmailHtml(row: any): string {
  // Use the same template structure as the order confirmation email in
  // src/app/api/capture-paypal/route.ts (sendOrderEmails fn). Black header,
  // logo, message, line-item summary, CTA button, IG banner, black footer.
  // CTA href = row.return_url or https://www.pandapatches.com/custom-patches/<slug>
  return `<!-- TODO: build template -->`;
}

function buildSecondEmailHtml(row: any): string {
  return `<!-- TODO: build template with PANDA10 discount code -->`;
}
```

### Task 5 — Vercel Cron config

**File:** `vercel.json` (project root — create if it doesn't exist)

```json
{
  "crons": [
    {
      "path": "/api/cron/abandoned-cart",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

This runs every 15 minutes. Vercel automatically sends the `Authorization: Bearer <CRON_SECRET>` header.

**Add to environment variables (Vercel dashboard + .env.local):**

```
CRON_SECRET=<generate a long random string>
```

### Task 6 — Email templates

Build two HTML emails matching the existing brand (black header, logo, lime green accents, IG banner). Use the order confirmation email in [`src/app/api/capture-paypal/route.ts`](src/app/api/capture-paypal/route.ts) as a structural template.

**Email 1 (sent at T+30min):**
- Subject: `<First name> — your custom patches are waiting`
- Tone: warm, helpful, not pushy
- Content: "Looks like you got pulled away — here's your cart summary, click to finish"
- CTA: Button → `return_url`
- Mention: free mockup, money-back guarantee, no setup fees

**Email 2 (sent at T+24hr if no purchase):**
- Subject: `One last reminder — 10% off if you finish today`
- Tone: gentle nudge with incentive
- Content: same cart summary + a one-time discount code
- CTA: Button → `return_url?promo=PANDA10`

### Task 7 — CRM push (optional, Phase 2)

Once the portal CRM API is documented, add a `pushToCrm(row)` function in the cron handler. Likely shape:

```typescript
async function pushToCrm(row: any) {
  const res = await fetch(`${process.env.PORTAL_CRM_URL}/api/leads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PORTAL_CRM_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: 'abandoned_cart',
      email: row.customer_email,
      name: row.customer_name,
      phone: row.customer_phone,
      value: row.cart_value,
      product: row.product_name,
      session_id: row.provider_session_id,
    }),
  });

  if (res.ok) {
    const { id } = await res.json();
    await supabase
      .from('checkout_attempts')
      .update({ pushed_to_crm_at: new Date().toISOString(), crm_lead_id: id })
      .eq('id', row.id);
  }
}
```

**Confirm with portal team before building:** the endpoint URL, auth method (bearer token vs. API key), and the exact field names the portal expects.

---

## Edge cases to handle

1. **User checks out twice with the same email and same cart** — `provider_session_id` is unique, so each session gets its own row. If they pay on session #2, only #2's row gets marked PURCHASED. The cron will still email about session #1. **Fix:** when marking a row PURCHASED, also update any other PENDING/EMAIL_SENT rows for the same email + same cart fingerprint (product, quantity, size) to status `RECOVERED`.

2. **User completes payment but webhook is delayed** — Stripe webhooks usually arrive within seconds, but during incidents they can be hours late. The 30-minute initial delay protects against this; if the delay is even longer, the user might get an email after they paid. Acceptable trade-off — the email is friendly enough that it doesn't look broken.

3. **Test orders / dev environment** — Add a check at the top of the cron handler to skip if `process.env.NODE_ENV !== 'production'` OR check that `customer_email` doesn't end in `@example.com` / `@test.com`.

4. **Bot traffic / spam** — Validate the email address before inserting into `checkout_attempts`. Consider rate-limiting by IP at the checkout API level (already partly done via `middleware.ts`).

5. **GDPR / unsubscribe** — Every email should include an unsubscribe link. Track unsubscribed emails in a separate `email_unsubscribes` table and skip them in the cron.

6. **Customer fixes a typo and uses a different email on retry** — The first email goes nowhere useful. Acceptable — small loss, no harm done.

---

## Test plan

1. **Manual test in dev:**
   - Set `META_TEST_EVENT_CODE` if testing CAPI dedup
   - Submit a checkout but cancel before paying
   - Verify a `checkout_attempts` row is created with `status='PENDING'`
   - Manually `curl` the cron route with the `CRON_SECRET` header
   - Confirm email arrives, row is updated to `EMAIL_SENT`

2. **Production smoke test:**
   - Use a real test email (yours)
   - Run a $1 test product through Stripe checkout, abandon
   - Wait 30 min, confirm email arrives
   - Click the email's CTA, complete payment
   - Confirm row flips to `PURCHASED` in Supabase

3. **Cron health check:**
   - Vercel dashboard → Cron Jobs → see last run timestamp + status
   - Add Sentry or BetterStack alert if cron fails 3 times in a row

---

## Metrics worth tracking

After 30 days of running, check:

- `SELECT COUNT(*) FROM checkout_attempts` — total abandoned carts
- `SELECT COUNT(*) FROM checkout_attempts WHERE status = 'PURCHASED'` — recovered (came back later)
- `SELECT COUNT(*) FROM checkout_attempts WHERE status = 'EMAIL_SENT' AND email_sent_at > NOW() - INTERVAL '30 days'` — emails sent
- Recovery rate: `PURCHASED / (PURCHASED + EXPIRED)` — target 8-15%
- Revenue recovered: `SELECT SUM(cart_value) FROM checkout_attempts WHERE status = 'PURCHASED' AND purchased_at > email_sent_at`

If recovery rate < 5% after a month of clean data, revisit the email copy or shorten the delay.

---

## Build order

When we sit down to build this:

1. Schema first — run the SQL, verify the table is empty and indexes exist
2. Insert logic — Task 1 + Task 2 + Task 3 (purely additive, no risk)
3. Cron skeleton — Task 4 with template stubs that just log, no email sends yet
4. Email templates — Task 6 with real HTML
5. Wire cron to send — flip the `// TODO` lines in Task 4 to live
6. `vercel.json` + `CRON_SECRET` — Task 5
7. Deploy to preview, run smoke test
8. Deploy to production
9. Wait a week, look at metrics
10. Phase 2 — CRM push (Task 7) once portal API is confirmed

Estimated build time: **3-5 hours of focused work** for Phase 1 (no CRM push). Phase 2 (CRM push) is another 1-2 hours once endpoint is documented.

---

## Open questions for the team

1. Does the portal CRM have a documented API? If yes, what's the lead-creation endpoint shape?
2. Should the second email include a discount code, and if so, what code? (Suggesting `PANDA10` for 10% off, but needs Lance's sign-off.)
3. Should we also fire a Meta CAPI `Lead` event when an abandoned-cart email is sent? (This would push these contacts into Meta's lookalike audiences.) Recommendation: yes.
4. Trigger threshold — is 30 minutes the right delay? Some brands wait 1 hour, some 2 hours. 30 min is the most common starting point.
