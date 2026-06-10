-- ============================================================================
-- orders.user_id — column add + email backfill
-- Project: panda-patches-ecommerce (production Supabase)
-- File:    sql/orders_user_id_link.sql
-- ----------------------------------------------------------------------------
-- DO NOT EXECUTE WITHOUT CRM DEV CONFIRMATION.
-- The CRM at portal.pandapatches.com reads/writes public.orders directly.
-- Hassan's CRM dev controls the maintenance window for this migration.
-- This file is checked in so it can be reviewed, dry-run, and gated.
--
-- WHAT THIS FILE DOES
--   1. Adds public.orders.user_id (uuid, nullable) with a FK to auth.users(id).
--   2. Adds the lookup index idx_orders_user_id.
--   3. Adds idx_orders_customer_email_lower so the backfill (and future
--      "claim guest orders on signup" flows) can do case-insensitive joins
--      without a seq scan. The pre-existing idx_orders_customer_email is a
--      plain btree on customer_email and cannot serve lower() predicates.
--   4. Backfills user_id from public.customer_profiles via lower(email).
--   5. Adds an additive RLS policy 'customers_read_own_orders_by_user_id' so
--      the portal can read via the indexed user_id path. The existing
--      'customers_read_own_orders' policy stays in place untouched (RLS is OR
--      across policies, so adding one only widens what the user can see, and
--      both policies match the same row anyway once backfill runs).
--
-- WHAT THIS FILE DOES NOT DO
--   * It does not touch public.orders.customer_confirmation_sent_at.
--     That column is unrelated; it is owned by the customer-email pipeline.
--   * It does not modify or drop the existing RLS policies. The CRM's
--     orders_select_policy / orders_update_policy / orders_insert_policy /
--     orders_delete_policy / website_checkout_insert remain unchanged.
--   * It does not delete or alter the existing idx_orders_customer_email.
--
-- WHY THE EXTRA POLICY (read this if you are wondering "do we even need it")
--   The live RLS already includes 'customers_read_own_orders' which scopes
--   by customer_email = (subquery on customer_profiles). It works, but
--   every portal page load runs that subquery against customer_profiles
--   per row. After we backfill orders.user_id we want the portal to use
--   the new indexed equality check (user_id = auth.uid()) which is one
--   index probe per query. The additive policy enables that path without
--   removing the email path, so guest orders that have not been backfilled
--   yet still surface for the signed-in customer.
--
-- IDEMPOTENCY
--   Every statement uses IF NOT EXISTS or a DO-block guard, so re-running
--   this file is a no-op once converged. The backfill UPDATE is scoped to
--   rows where user_id IS NULL, so re-running cannot overwrite a real link.
--
-- LIVE AUDIT (snapshot taken from production Supabase before commit)
--   orders rows ................. 714
--   distinct lower(email) ....... 570
--   customer_profiles rows ...... 133
--   orders linkable via email ... 175  (~24.5% of total)
--   The remaining ~539 orders are guest orders whose customer_email has no
--   matching customer_profiles row. They stay NULL until that customer
--   signs up. That is the documented contract, not a bug.
-- ============================================================================


-- ============================================================================
-- BLOCK 1 — MIGRATION
-- Adds column, FK, and indexes. Wrap in a single transaction so a failure
-- on any step leaves the schema untouched.
-- ============================================================================

BEGIN;

-- 1) Add the column itself.
--    - uuid to match auth.users.id (uuid PK).
--    - NULL allowed because guest checkouts produce orders with no user.
--    - No DEFAULT because we never want a synthetic value; NULL = guest.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2) FK to auth.users so a deleted auth user cleans up the link without
--    nuking the historical order. ON DELETE SET NULL preserves the row.
--    Wrapped in a DO block because ADD CONSTRAINT IF NOT EXISTS is not
--    supported on older Postgres versions used by Supabase.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orders_user_id_fkey'
      AND conrelid = 'public.orders'::regclass
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- 3) Lookup index. /account/orders queries filter by user_id via RLS
--    (auth.uid() = user_id). Without this index the dashboard does a
--    seq scan over the orders table at every page load.
CREATE INDEX IF NOT EXISTS idx_orders_user_id
  ON public.orders (user_id);

-- 4) Case-insensitive email lookup index. The backfill below joins on
--    lower(customer_email). The existing idx_orders_customer_email is a
--    plain btree on customer_email and cannot serve lower() predicates.
--    Also used by future "claim guest orders on signup" flows.
CREATE INDEX IF NOT EXISTS idx_orders_customer_email_lower
  ON public.orders (lower(customer_email));

COMMIT;

-- POST-MIGRATION RLS NOTE
-- The live policy 'customers_read_own_orders' (FOR SELECT TO authenticated)
-- already scopes order reads to the signed-in customer by matching
-- customer_email against the customer_profiles row for auth.uid(). The
-- portal will keep working today even before block 3 runs. Block 3 below
-- ADDS a second SELECT policy that uses the new user_id column so the
-- portal can use an indexed equality check after the backfill. Both
-- policies coexist; RLS is OR across policies for the same command.


-- ============================================================================
-- BLOCK 2 — BACKFILL
-- Run AFTER block 1 commits. Idempotent — only touches rows where
-- orders.user_id IS NULL, so re-running is a no-op once converged.
-- ----------------------------------------------------------------------------
-- EXPECTED IMPACT (from live audit, 2026-06-01 snapshot)
--   orders rows ............... 714
--   distinct lower(email) ..... 570
--   customer_profiles rows .... 133
--   orders linkable via email . 175  (~24.5% of total)
-- The remaining ~539 orders predate any customer_profile with that email
-- and stay NULL until that customer signs up.
-- ============================================================================

BEGIN;

-- 1) Backfill itself. Join on lower(email) to be case-insensitive because
--    customer_profiles.email is not citext and no functional unique exists.
--    Only updates rows that have NULL user_id, so this is safe to re-run.
WITH matched AS (
  SELECT
    o.id            AS order_id,
    cp.id           AS customer_id
  FROM public.orders o
  JOIN public.customer_profiles cp
    ON lower(cp.email) = lower(o.customer_email)
  WHERE o.user_id IS NULL
    AND o.customer_email IS NOT NULL
    AND length(trim(o.customer_email)) > 0
)
UPDATE public.orders o
SET user_id = m.customer_id
FROM matched m
WHERE o.id = m.order_id;

-- 2) Report. Run this manually after commit for an audit trail.
--    (Kept as a comment so the migration tool does not choke on SELECTs.)
--
--   SELECT
--     COUNT(*) FILTER (WHERE user_id IS NOT NULL) AS linked_orders,
--     COUNT(*) FILTER (WHERE user_id IS NULL)     AS guest_orders,
--     COUNT(*)                                    AS total_orders
--   FROM public.orders;

COMMIT;

-- After this runs, expect approximately:
--   linked_orders ~ 175
--   guest_orders  ~ 539
--   total_orders    714
-- Numbers will drift up as new customers sign up with emails matching
-- historical guest orders. A future "claim on signup" job can re-run this
-- same UPDATE for a single email to associate prior guest orders to the
-- new account row.


-- ============================================================================
-- BLOCK 3 — ADDITIVE RLS POLICY
-- Adds a SECOND SELECT policy on public.orders so the portal can read via
-- the indexed user_id column. The existing 'customers_read_own_orders'
-- (email-based) policy is NOT modified. PostgreSQL RLS is OR-of-policies
-- per command, so a row visible under either policy stays visible.
-- ----------------------------------------------------------------------------
-- SAFETY
--   * Idempotent: wrapped in DO-block, no-op if the policy already exists.
--   * Cannot reduce visibility: adding a permissive policy can only widen
--     reads, never narrow them. The CRM and existing customer-portal access
--     remain intact.
--   * Scoped to 'authenticated' role only. service_role bypasses RLS as
--     always; anonymous reads remain blocked.
-- ============================================================================

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy
    WHERE polrelid = 'public.orders'::regclass
      AND polname = 'customers_read_own_orders_by_user_id'
  ) THEN
    CREATE POLICY customers_read_own_orders_by_user_id
      ON public.orders
      FOR SELECT
      TO authenticated
      USING (user_id = ( SELECT auth.uid() ));
  END IF;
END $$;

COMMIT;

-- VERIFICATION (run after commit, outside this file)
--
--   SELECT polname, polcmd, pg_get_expr(polqual, polrelid) AS using_expr
--   FROM pg_policy
--   WHERE polrelid = 'public.orders'::regclass
--   ORDER BY polname;
--
-- Expect 'customers_read_own_orders' AND 'customers_read_own_orders_by_user_id'
-- both listed. If only one appears, the policy creation was skipped because it
-- already exists — that is also a pass.
