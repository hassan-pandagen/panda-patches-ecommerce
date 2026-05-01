-- Abandoned cart recovery — schema migration
-- Run this once in Supabase SQL editor before deploying the cron.
-- See ABANDONED_CART_CONTEXT.md for the full implementation plan.

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
  provider_session_id TEXT,
  return_url TEXT,

  -- For Meta retargeting + match quality
  fbp TEXT,
  fbc TEXT,
  attribution JSONB,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'EMAIL_SENT', 'EMAIL_2_SENT', 'PURCHASED', 'RECOVERED', 'EXPIRED')),
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  email_sent_at TIMESTAMPTZ,
  email_2_sent_at TIMESTAMPTZ,
  purchased_at TIMESTAMPTZ,

  -- CRM sync (Phase 2)
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

-- One unique constraint so a single Stripe/PayPal session never gets two abandoned emails
CREATE UNIQUE INDEX IF NOT EXISTS uniq_checkout_attempts_session
  ON checkout_attempts(provider_session_id)
  WHERE provider_session_id IS NOT NULL;
