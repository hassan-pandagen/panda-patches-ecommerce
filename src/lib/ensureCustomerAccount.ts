import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendCustomerEmail } from "@/lib/sendCustomerEmail";
import { resolveAuthBaseUrl } from "@/lib/authRedirect";

interface EnsureAccountParams {
  email: string;
  fullName?: string | null;
  phone?: string | null;
  /** Shown in the email so the customer knows which order this is for. */
  orderNumber?: string | null;
}

export interface EnsureAccountResult {
  ok: boolean;
  /** true when a brand-new account was created (and the email was sent). */
  created: boolean;
  reason?: string;
}

/**
 * Auto-provision a customer account from an order.
 *
 * The CEO flow: every order gives the customer a way to log in, track, and
 * reorder. If no account exists for the email, we create one and email a
 * branded "set your password / track your order" link (the same recovery link
 * the reset-password flow uses, so it lands on /reset-password). The account is
 * created already email-confirmed because a paying customer's email is verified
 * by the transaction itself, so there is no second confirmation step.
 *
 * De-dup: we do NOT pre-list users (that caps at one page). Instead we attempt
 * the create and treat an "already registered" error as "account exists" and
 * skip silently. Existing customers keep their account and get no extra email.
 *
 * Never throws. Callers fire this AFTER the order is saved and ignore the
 * result, so nothing here can ever affect the order or the payment. The link is
 * a standard Supabase recovery link, so its validity is the Supabase
 * Email-OTP-expiry setting (set this to 24h in the dashboard); an expired link
 * is never a dead end because the account is permanent and "Forgot password"
 * re-issues a fresh one.
 */
export async function ensureCustomerAccount(
  params: EnsureAccountParams,
): Promise<EnsureAccountResult> {
  const email = params.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { ok: false, created: false, reason: "invalid email" };
  }

  try {
    const admin = createSupabaseAdminClient();

    const fullName = (params.fullName || "").trim();
    const firstName = fullName.split(/\s+/)[0] || "there";

    // Create the account, already confirmed (the order proves the email). No
    // password is set — they choose their own via the recovery link below.
    // is_customer:true routes the customer_profiles trigger like signup does.
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        is_customer: true,
        full_name: fullName || null,
        phone: params.phone || null,
        created_from: "order",
      },
    });

    if (createErr || !created?.user) {
      // Account already exists — leave it alone, no duplicate, no email.
      if (/already|exists|registered/i.test(createErr?.message || "")) {
        return { ok: true, created: false, reason: "account already exists" };
      }
      console.error("[ensureCustomerAccount] createUser failed:", createErr);
      return { ok: false, created: false, reason: createErr?.message };
    }

    // The on_customer_signup trigger inserts customer_profiles from full_name;
    // phone is not auto-populated, so patch it in. Non-fatal if it fails.
    if (params.phone) {
      try {
        const { error: phoneErr } = await admin
          .from("customer_profiles")
          .update({ phone: params.phone, updated_at: new Date().toISOString() })
          .eq("id", created.user.id);
        if (phoneErr) {
          console.error("[ensureCustomerAccount] phone patch returned error:", phoneErr);
        }
      } catch (err) {
        console.error("[ensureCustomerAccount] phone patch threw:", err);
      }
    }

    // Recovery (set-password) link -> /reset-password, delivered branded.
    const baseUrl = resolveAuthBaseUrl();
    const redirectTo = `${baseUrl}/reset-password`;
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

    if (linkErr || !linkData?.properties?.action_link) {
      console.error("[ensureCustomerAccount] generateLink failed:", linkErr);
      // Account exists; they can still get a link via "Forgot password".
      return { ok: false, created: true, reason: "link generation failed" };
    }

    const emailResult = await sendCustomerEmail({
      to: email,
      templateId: "WEBSITE_AUTH_ORDER_ACCOUNT",
      dynamicData: {
        customer_name: firstName,
        portal_action_url: linkData.properties.action_link,
        order_number: params.orderNumber || undefined,
      },
    });

    if (!emailResult.ok) {
      console.error("[ensureCustomerAccount] email send failed:", emailResult.error);
      return { ok: false, created: true, reason: "email send failed" };
    }

    return { ok: true, created: true };
  } catch (err) {
    console.error("[ensureCustomerAccount] unexpected error:", err);
    return { ok: false, created: false, reason: "unexpected error" };
  }
}
