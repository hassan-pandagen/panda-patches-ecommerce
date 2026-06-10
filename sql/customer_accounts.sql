-- ============================================================================
-- SUPERSEDED — DO NOT RUN.
-- ----------------------------------------------------------------------------
-- The orders.user_id column add, FK, indexes, and email backfill in this file
-- have been split out into sql/orders_user_id_link.sql, which is the canonical,
-- gated migration. Run that file instead.
--
-- The profiles table / RLS / signup trigger sections below were never deployed
-- to production; the live schema uses public.customer_profiles (not profiles)
-- with its own policies. Kept on disk for historical reference only.
--
-- Do not delete this file — git history references it. Just do not execute it.
-- ============================================================================
--
-- Customer Account Portal — Supabase schema
-- Run this once in the Supabase SQL editor (or via psql).
-- Idempotent: safe to run repeatedly.
--
-- Scope:
-- 1. profiles table (one row per Supabase auth user; mirrors auth.users + extra fields)
-- 2. orders.user_id column (link existing orders to auth users when emails match)
-- 3. Row Level Security so customers only see their own orders/profile
-- 4. Signup trigger: when a new auth user is created, backfill user_id on any
--    historical orders that share the same email.

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  company text,
  default_shipping_address jsonb,
  -- jsonb shape: { line1, line2, city, state, postal_code, country }
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Customer profile data linked 1-to-1 with auth.users. Owned by the user.';

-- Updated-at trigger
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row
  execute function public.touch_updated_at();

-- ============================================================================
-- 2. ORDERS.USER_ID COLUMN
-- ============================================================================

alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_customer_email_lower_idx
  on public.orders((lower(customer_email)));

-- ============================================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================================

-- Profiles: each user can read + update their own row only.
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Orders RLS:
--   - Service role (used by /api/webhooks/stripe, /api/checkout, the CRM) keeps full access by default.
--   - Authenticated users (the customer portal) see only their own orders.
--   - We match on user_id OR (case-insensitive) customer_email so guest orders
--     paid before signup still surface in the portal even before the backfill
--     trigger fires (defense-in-depth).
alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or lower(customer_email) = lower(coalesce((auth.jwt() ->> 'email'), ''))
  );

-- IMPORTANT: We do NOT add INSERT/UPDATE policies for the authenticated role.
-- Orders are only written by the service_role (via webhooks / API routes),
-- which bypasses RLS automatically. Customers cannot mutate their own orders.

-- ============================================================================
-- 4. SIGNUP BACKFILL: link historical guest orders on signup
-- ============================================================================

-- When a new auth.users row appears, create a matching profiles row AND
-- backfill any historical orders with the same email so the portal shows them.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  meta_full_name text;
  meta_phone text;
begin
  -- Pull metadata the signup form may have passed via supabase.auth.signUp({ data: ... })
  meta_full_name := coalesce(new.raw_user_meta_data ->> 'full_name', null);
  meta_phone     := coalesce(new.raw_user_meta_data ->> 'phone', null);

  -- 1. Create the profile row (idempotent — does nothing if it already exists)
  insert into public.profiles (id, full_name, phone)
  values (new.id, meta_full_name, meta_phone)
  on conflict (id) do nothing;

  -- 2. Backfill: link historical guest orders that share this email
  update public.orders
     set user_id = new.id
   where user_id is null
     and lower(customer_email) = lower(new.email);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================================================
-- DONE.
-- After running:
--   * Confirm profiles table exists: select * from public.profiles limit 1;
--   * Confirm orders.user_id exists: select user_id from public.orders limit 1;
--   * Confirm RLS is on: select relname, relrowsecurity from pg_class
--                        where relname in ('orders', 'profiles');
--   * Manual backfill (optional, for existing orders predating this migration):
--       update public.orders o
--          set user_id = u.id
--         from auth.users u
--        where o.user_id is null
--          and lower(o.customer_email) = lower(u.email);
-- ============================================================================
