/**
 * Loyalty tier program — server-side callers for the CRM edge functions
 * (CL86F1 contract). SERVER ONLY: holds LOYALTY_VALIDATE_SECRET and calls the
 * CRM's Supabase functions server-to-server. The browser never sees the secret
 * or these URLs.
 *
 * validate = check a code (never redeems). status = the account badge lookup.
 * The CRM marks single-use Bronze codes redeemed at order placement, reading
 * order.metadata.loyalty_code off the Square webhook — so the website's job is
 * only: validate, apply the %, and stamp the code onto the Square order.
 */
const VALIDATE_URL =
  "https://uxgzlneefybifvccfhwp.supabase.co/functions/v1/validate-loyalty-code";
const STATUS_URL =
  "https://uxgzlneefybifvccfhwp.supabase.co/functions/v1/loyalty-status";

export type LoyaltyReason =
  | "ok"
  | "code_not_found"
  | "email_mismatch"
  | "expired"
  | "already_used"
  | "revoked"
  | "not_combinable_with_custom_quotes"
  | "unauthorized"
  | "server_error";

export interface ValidateResult {
  valid: boolean;
  tier: string;
  percent: number;
  reason: LoyaltyReason;
}

export interface LoyaltyStatus {
  tier: "none" | "bronze" | "silver" | "gold";
  lifetime_paid_value: number;
  codes: Array<{
    code: string;
    percent: number;
    tier: string;
    single_use: boolean;
    expires_at: string | null;
    status: string;
  }>;
}

/** Plain-language copy per reason code (Task 1 point 3). */
export const REASON_COPY: Record<string, string> = {
  ok: "Discount applied",
  code_not_found: "We couldn't find that code.",
  email_mismatch: "That code belongs to a different account.",
  expired: "This code has expired.",
  already_used: "This code has already been used.",
  revoked: "This code is no longer active.",
  not_combinable_with_custom_quotes:
    "Loyalty discounts apply to standard pricing only, not custom quotes or offers.",
  unauthorized: "We couldn't verify that code right now. Please try again.",
  server_error: "We couldn't verify that code right now. Please try again.",
};

export async function validateLoyaltyCode(
  code: string,
  email: string,
  pricingSource: string = "calculator",
): Promise<ValidateResult> {
  const secret = process.env.LOYALTY_VALIDATE_SECRET;
  if (!secret) return { valid: false, tier: "", percent: 0, reason: "server_error" };
  try {
    const res = await fetch(VALIDATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-loyalty-secret": secret },
      body: JSON.stringify({
        code: code.trim(),
        email: email.trim().toLowerCase(),
        order_context: { pricing_source: pricingSource },
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      return { valid: false, tier: "", percent: 0, reason: res.status === 401 ? "unauthorized" : "server_error" };
    }
    const json = await res.json();
    return {
      valid: !!json.valid,
      tier: typeof json.tier === "string" ? json.tier : "",
      percent: Number(json.percent) || 0,
      reason: (json.reason as LoyaltyReason) || "server_error",
    };
  } catch {
    return { valid: false, tier: "", percent: 0, reason: "server_error" };
  }
}

export async function getLoyaltyStatus(email: string): Promise<LoyaltyStatus | null> {
  const secret = process.env.LOYALTY_VALIDATE_SECRET;
  if (!secret || !email) return null;
  try {
    const res = await fetch(STATUS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-loyalty-secret": secret },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return {
      tier: (json.tier as LoyaltyStatus["tier"]) || "none",
      lifetime_paid_value: Number(json.lifetime_paid_value) || 0,
      codes: Array.isArray(json.codes) ? json.codes : [],
    };
  } catch {
    return null;
  }
}
