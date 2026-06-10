import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase admin client — uses the service-role key, bypasses RLS, and can call
 * `auth.admin.*` methods (createUser, generateLink, deleteUser, etc.).
 *
 * Server-only. Never imported from client components or pages with `"use client"`.
 *
 * Used for:
 *  - generating action links (signup confirm / magic link / password reset /
 *    email change) that we then deliver via our shared `send-email` Edge
 *    Function, so all customer emails come from the same branded template.
 *  - any admin operation that needs to bypass RLS (e.g. account deletion).
 */

let cached: SupabaseClient | null = null;

export function createSupabaseAdminClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  cached = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cached;
}
