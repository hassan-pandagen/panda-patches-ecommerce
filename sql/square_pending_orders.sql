-- Website Square checkout: pending order payload, keyed by a per-checkout token.
--
-- The website checkout route (/api/checkout-square) stores the full order payload
-- here and puts the token (as WEB-<token>) into the Square Payment Link's
-- reference_id. The website Square webhook (/api/webhooks/square) reads this row on
-- payment.updated and creates the paid order.
--
-- consumed_at is the idempotency guard: the webhook claims the row with an atomic
-- "UPDATE ... WHERE consumed_at IS NULL", so the multiple payment.updated events
-- Square emits for one payment can never create duplicate orders.
--
-- This is the Square analogue of paypal_pending_orders. Service-role only.

CREATE TABLE IF NOT EXISTS public.square_pending_orders (
  token       UUID PRIMARY KEY,
  order_data  JSONB NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS on with no policies: only the service role (server-side) can read/write.
ALTER TABLE public.square_pending_orders ENABLE ROW LEVEL SECURITY;

-- Helps a periodic cleanup of stale, never-paid checkouts.
CREATE INDEX IF NOT EXISTS idx_square_pending_orders_created_at
  ON public.square_pending_orders (created_at);
