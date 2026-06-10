import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendCustomerEmail } from "@/lib/sendCustomerEmail";
import { resolveAuthBaseUrl } from "@/lib/authRedirect";
import { resolveCustomerName } from "@/lib/resolveCustomerName";

const ResetSchema = z.object({
  email: z.string().email().max(255),
  origin: z.string().url().optional(),
});

/**
 * POST /api/auth/reset-password
 *
 * Server-side password reset request. Generates the Supabase recovery link
 * and delivers it through our branded `send-email` Edge Function.
 *
 * Always returns 200 even for unknown emails — account-enumeration mitigation.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ResetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }

  const { email, origin } = parsed.data;
  const baseUrl = resolveAuthBaseUrl(origin, req.headers.get("origin"));
  const redirectTo = `${baseUrl}/reset-password`;

  const admin = createSupabaseAdminClient();

  // Look up user without leaking existence to the caller.
  const lookup = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = lookup.data?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!existing) {
    return NextResponse.json({ ok: true });
  }

  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (linkErr || !linkData?.properties?.action_link) {
    console.error("[reset-password] generateLink failed:", linkErr);
    return NextResponse.json(
      { ok: false, error: "Could not generate reset link" },
      { status: 500 }
    );
  }

  // Uses customer_profiles.full_name (first token) per 2026-06 migration.
  const customerName = await resolveCustomerName(email, existing.id);

  const emailResult = await sendCustomerEmail({
    to: email,
    templateId: "WEBSITE_AUTH_PASSWORD_RESET",
    dynamicData: {
      customer_name: customerName,
      portal_action_url: linkData.properties.action_link,
    },
  });

  if (!emailResult.ok) {
    console.error("[reset-password] email send failed:", emailResult.error);
    return NextResponse.json(
      { ok: false, error: "Could not send reset email. Please try again or contact support." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
