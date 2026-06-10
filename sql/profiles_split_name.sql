-- ============================================================================
-- SUPERSEDED — DO NOT RUN.
-- ----------------------------------------------------------------------------
-- This file targets a public.profiles table that was never deployed. The live
-- schema uses public.customer_profiles, which already has full_name (no split).
-- The handle_new_user trigger rewrite at the bottom also references that
-- never-deployed table, so executing this file in production will fail.
--
-- For the orders.user_id work that originally lived in customer_accounts.sql,
-- see sql/orders_user_id_link.sql — the canonical, gated migration.
--
-- Do not delete this file — git history references it. Just do not execute it.
-- ============================================================================
--
-- profiles.first_name + last_name migration
-- Splits the existing `full_name` column into two for cleaner email
-- personalization ("Hi Hassan," vs "Hi Hassan Jamal,").
--
-- Idempotent. Safe to run more than once. Existing rows with full_name set
-- are auto-split on first run (first token = first_name, rest = last_name).

-- 1. Add the two new columns ------------------------------------------------
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name  text;

-- 2. Backfill existing rows from full_name ---------------------------------
-- Only touches rows where the new columns are empty AND full_name is set.
update public.profiles
   set first_name = split_part(trim(full_name), ' ', 1),
       last_name  = nullif(
         trim(substring(trim(full_name) from position(' ' in trim(full_name)) + 1)),
         ''
       )
 where (first_name is null or first_name = '')
   and full_name is not null
   and trim(full_name) <> '';

-- 3. Keep full_name in sync going forward ---------------------------------
-- Trigger that auto-updates full_name whenever first_name / last_name change,
-- so any code that still reads full_name (CRM, legacy queries) keeps working.
create or replace function public.sync_profile_full_name()
returns trigger
language plpgsql
as $$
begin
  if new.first_name is not null or new.last_name is not null then
    new.full_name := trim(concat_ws(' ', new.first_name, new.last_name));
  end if;
  return new;
end;
$$;

drop trigger if exists sync_profile_full_name on public.profiles;
create trigger sync_profile_full_name
  before insert or update of first_name, last_name on public.profiles
  for each row
  execute function public.sync_profile_full_name();

-- 4. Update the signup-time handle_new_user trigger to read first_name/last_name
--    from auth metadata as well, so accounts created via /api/auth/signup get
--    the split right at creation time. Idempotent: just overwrites the function.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  meta_first text;
  meta_last  text;
  meta_full  text;
  meta_phone text;
begin
  meta_first := coalesce(new.raw_user_meta_data ->> 'first_name', null);
  meta_last  := coalesce(new.raw_user_meta_data ->> 'last_name', null);
  meta_full  := coalesce(new.raw_user_meta_data ->> 'full_name', null);
  meta_phone := coalesce(new.raw_user_meta_data ->> 'phone', null);

  -- If full_name was supplied but split fields were not, derive them.
  if meta_first is null and meta_full is not null then
    meta_first := split_part(trim(meta_full), ' ', 1);
    meta_last  := nullif(
      trim(substring(trim(meta_full) from position(' ' in trim(meta_full)) + 1)),
      ''
    );
  end if;

  -- Create the profile row (idempotent).
  insert into public.profiles (id, first_name, last_name, full_name, phone)
  values (
    new.id,
    meta_first,
    meta_last,
    coalesce(meta_full, trim(concat_ws(' ', meta_first, meta_last))),
    meta_phone
  )
  on conflict (id) do nothing;

  -- Backfill: link historical guest orders that share this email.
  update public.orders
     set user_id = new.id
   where user_id is null
     and lower(customer_email) = lower(new.email);

  return new;
end;
$$;

-- (handle_new_user trigger itself already exists from customer_accounts.sql;
--  re-creating the function is enough.)
