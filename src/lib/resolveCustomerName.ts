import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Find the friendliest name to greet a customer by in transactional emails.
 *
 * Tries, in order:
 *   1. customer_profiles.full_name (first token) for the matching auth user
 *   2. The first name on the customer's most-recent order
 *      (covers guests-turned-account-holders whose profile is still blank)
 *   3. The email prefix (last-resort fallback so we never say "Hi ,")
 *
 * Server-only because it uses the service-role admin client to bypass RLS.
 * Used from /api/auth/* routes when composing email payloads.
 */
export async function resolveCustomerName(
  email: string,
  userId?: string | null
): Promise<string> {
  if (!email) return "there";
  const normalized = email.trim().toLowerCase();
  const fallback = normalized.split("@")[0] || "there";

  try {
    const admin = createSupabaseAdminClient();

    // 1. customer_profiles.full_name (first token) if we have the user id
    if (userId) {
      const { data: profile } = await admin
        .from("customer_profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();

      const full = (profile?.full_name as string | undefined)?.trim();
      if (full) {
        const firstTok = full.split(/\s+/)[0];
        if (firstTok) return firstTok;
      }
    }

    // 2. Most recent order's customer_name
    const { data: order } = await admin
      .from("orders")
      .select("customer_name")
      .ilike("customer_email", normalized)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const orderName = (order?.customer_name as string | undefined)?.trim();
    if (orderName) {
      const firstTok = orderName.split(/\s+/)[0];
      if (firstTok) return firstTok;
    }
  } catch (err) {
    // Don't let lookup failures block email sending.
    console.error("[resolveCustomerName] lookup failed:", err);
  }

  return fallback;
}
