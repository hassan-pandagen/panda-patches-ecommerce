import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendCustomerEmail } from "@/lib/sendCustomerEmail";
import { resolveAuthBaseUrl } from "@/lib/authRedirect";

const SignupSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  phone: z.string().max(40).optional(),
  returnTo: z.string().max(200).optional(),
  origin: z.string().url().optional(),
});

/**
 * POST /api/auth/signup
 *
 * Server-side signup that creates the user (unconfirmed), generates the
 * Supabase confirmation link, and delivers it through our branded `send-email`
 * Edge Function — NOT through Supabase's built-in templates.
 *
 * Body: { email, password, firstName, lastName, phone?, returnTo?, origin? }
 * firstName + lastName are required by the form; they are stitched into a
 * single full_name on the server (customer_profiles has no first/last split).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }

  const { email, password, firstName, lastName, phone, returnTo, origin } = parsed.data;
  const baseUrl = resolveAuthBaseUrl(origin, req.headers.get("origin"));
  const redirectTo = `${baseUrl}/auth/callback${returnTo ? `?next=${encodeURIComponent(returnTo)}` : ""}`;

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const fullName = `${trimmedFirst} ${trimmedLast}`.trim();

  const admin = createSupabaseAdminClient();

  // is_customer: true routes this signup down the customer trigger path.
  // handle_new_customer() reads full_name from user_metadata and inserts
  // the customer_profiles row. handle_new_user() bails when is_customer is true.
  //
  // email_confirm is intentionally FALSE: Supabase would otherwise mark the
  // user as confirmed and skip the verification flow. We send our own branded
  // WEBSITE_AUTH_SIGNUP_CONFIRM email through the send-email Edge Function
  // below, so the user must click that link to be marked confirmed.
  const { data: createdUser, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: {
      is_customer: true,
      full_name: fullName,
      phone: phone || null,
    },
  });

  if (createErr || !createdUser?.user) {
    const message = createErr?.message || "Could not create account";
    const status = /already|exists|registered/i.test(message) ? 409 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }

  // The on_customer_signup trigger inserted the customer_profiles row using
  // user_metadata.full_name. Phone is not auto-populated by the trigger, so
  // we patch it in here. The row exists thanks to the SECURITY DEFINER
  // trigger; if RLS or timing prevents the update we still want the signup
  // to succeed, so the failure is logged but not surfaced to the user.
  if (phone) {
    // supabase-js .update() returns { error } instead of throwing, so the
    // try/catch alone would silently swallow RLS rejections or missing rows.
    // We log both the thrown path and the returned-error path.
    try {
      const { error: phoneErr } = await admin
        .from("customer_profiles")
        .update({ phone, updated_at: new Date().toISOString() })
        .eq("id", createdUser.user.id);
      if (phoneErr) {
        console.error("[signup] customer_profiles phone update returned error:", phoneErr);
      }
    } catch (err) {
      console.error("[signup] customer_profiles phone update threw:", err);
    }
  }

  // Generate the signup confirmation link (Supabase format) — we deliver it
  // ourselves rather than letting Supabase send its built-in template.
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: { redirectTo },
  });

  if (linkErr || !linkData?.properties?.action_link) {
    console.error("[signup] generateLink failed:", linkErr);
    return NextResponse.json(
      { ok: false, error: "Could not generate confirmation link" },
      { status: 500 }
    );
  }

  // Fire branded email through shared Edge Function.
  const emailResult = await sendCustomerEmail({
    to: email,
    templateId: "WEBSITE_AUTH_SIGNUP_CONFIRM",
    dynamicData: {
      customer_name: trimmedFirst,
      portal_action_url: linkData.properties.action_link,
    },
  });

  if (!emailResult.ok) {
    // The account exists but the email failed. Tell the user — they can use
    // /forgot-password to re-request a verification flow.
    console.error("[signup] email send failed:", emailResult.error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Account created, but we could not send the confirmation email. Please contact support.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
