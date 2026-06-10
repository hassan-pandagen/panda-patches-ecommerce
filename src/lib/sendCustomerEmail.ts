import "server-only";

/**
 * sendCustomerEmail — server-only helper that calls the `send-email` Supabase
 * Edge Function shared with the CRM. Uses SUPABASE_SERVICE_ROLE_KEY in the
 * Authorization header, so it can only be invoked from server code (API routes,
 * server actions, server components). Never reaches the browser bundle.
 *
 * The `send-email` function accepts ANY `to` address from the caller, so it
 * MUST NOT be called with a public key from client-side code. The
 * `import "server-only"` line above + the service-role key check below
 * enforce that at build time and runtime.
 *
 * One source of truth for email templates — the same Edge Function powers the
 * CRM and the customer portal so brand identity stays consistent.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Known template IDs accepted by the shared `send-email` Edge Function.
 *
 * Website auth flow templates:
 *   - WEBSITE_AUTH_SIGNUP_CONFIRM, WEBSITE_AUTH_PASSWORD_RESET,
 *     WEBSITE_AUTH_EMAIL_CHANGE
 *
 * Order-lifecycle templates owned by the CRM but also fired by the website
 * webhook on first Stripe-paid INSERT (which the CRM trigger never sees):
 *   - CUSTOMER_PAYMENT_CONFIRMATION
 *
 * Open-ended `string` is also allowed so callers can fire any CRM-owned
 * template (e.g. CUSTOMER_NEW_ORDER) without us needing to update this list
 * every time the CRM adds one. Type-checking is still useful for the auth
 * flows we own.
 */
export type CustomerEmailTemplate =
  | "WEBSITE_AUTH_SIGNUP_CONFIRM"
  | "WEBSITE_AUTH_PASSWORD_RESET"
  | "WEBSITE_AUTH_EMAIL_CHANGE"
  | "CUSTOMER_PAYMENT_CONFIRMATION"
  | (string & {});

export interface CustomerEmailDynamicData {
  customer_name?: string;
  portal_action_url?: string;
  new_email?: string;
  // Order-flow fields (CUSTOMER_PAYMENT_CONFIRMATION etc.)
  order_number?: string;
  amount_paid?: string;
  total_amount?: string;
  customer_email?: string;
  [key: string]: unknown;
}

export interface SendCustomerEmailParams {
  to: string;
  templateId: CustomerEmailTemplate;
  dynamicData: CustomerEmailDynamicData;
}

export interface SendCustomerEmailResult {
  ok: boolean;
  status: number;
  error?: string;
}

export async function sendCustomerEmail(
  params: SendCustomerEmailParams
): Promise<SendCustomerEmailResult> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
      "[sendCustomerEmail] Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
    return { ok: false, status: 0, error: "Email service not configured" };
  }

  const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/functions/v1/send-email`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        apikey: SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({
        to: params.to,
        template_id: params.templateId,
        dynamic_data: params.dynamicData,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(
        `[sendCustomerEmail] Edge Function ${endpoint} returned ${response.status}: ${text}`
      );
      return { ok: false, status: response.status, error: text };
    }

    return { ok: true, status: response.status };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sendCustomerEmail] Network error to ${endpoint}:`, message);
    return { ok: false, status: 0, error: message };
  }
}
