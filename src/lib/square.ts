/**
 * Square API helpers for the website checkout + webhook.
 *
 * Mirrors the proven portal integration (Supabase edge functions
 * create-square-checkout + square-payment-webhook): hosted Payment Links via the
 * Checkout API on production connect.squareup.com, and HMAC-SHA256 webhook
 * signature verification. Raw fetch + Node crypto, no SDK dependency, so the
 * website matches the portal exactly and adds no bundle weight.
 *
 * Credentials (the SAME Square account as the portal) come from env:
 *   SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, SQUARE_WEBHOOK_SIGNATURE_KEY.
 */
import crypto from 'crypto';

export const SQUARE_BASE_URL = 'https://connect.squareup.com';
export const SQUARE_API_VERSION = '2025-05-21';

/**
 * Website Square payments carry a "WEB-" reference prefix. The portal's
 * square-payment-webhook and the website webhook are both subscribed to
 * payment.updated on the SAME Square account, so each must process only its own
 * payments. The website ignores any reference that is not WEB-prefixed; the
 * portal already ignores anything that is not a bare UUID token or a PP-/numeric
 * order id, so a WEB- reference is a no-op there.
 */
export const WEB_REF_PREFIX = 'WEB-';

function squareToken(): string {
  const t = process.env.SQUARE_ACCESS_TOKEN;
  if (!t) throw new Error('SQUARE_ACCESS_TOKEN not configured');
  return t;
}

function squareLocation(): string {
  const l = process.env.SQUARE_LOCATION_ID;
  if (!l) throw new Error('SQUARE_LOCATION_ID not configured');
  return l;
}

export interface PaymentLinkInput {
  token: string; // our square_pending_orders token (UUID)
  itemName: string; // line-item label shown on Square's hosted page
  amount: number; // dollars (converted to cents here)
  buyerEmail?: string | null;
  redirectUrl: string; // where Square sends the customer after payment
  metadata?: Record<string, string>;
}

/**
 * Create a Square hosted Payment Link. reference_id is set to WEB-<token> so the
 * website webhook can resolve the payment back to its pending order, and the
 * portal webhook leaves it alone.
 */
export async function createSquarePaymentLink(
  input: PaymentLinkInput,
): Promise<{ url: string; squareOrderId: string | null }> {
  const referenceId = `${WEB_REF_PREFIX}${input.token}`;

  const body = {
    idempotency_key: `web_${input.token}`,
    order: {
      location_id: squareLocation(),
      reference_id: referenceId, // webhook resolves this back to the token
      line_items: [
        {
          name: input.itemName,
          quantity: '1',
          base_price_money: {
            amount: Math.round(input.amount * 100),
            currency: 'USD',
          },
        },
      ],
      metadata: {
        web_token: input.token,
        source: 'website',
        ...(input.metadata || {}),
      },
    },
    // Phone intentionally omitted: Square rejects non-E.164 numbers and would fail
    // the whole checkout. We still capture phone in our own order data.
    ...(input.buyerEmail
      ? { pre_populated_data: { buyer_email: input.buyerEmail } }
      : {}),
    redirect_url: input.redirectUrl,
    merchant_support_email: 'hello@pandapatches.com',
    // Offer every wallet + BNPL Square supports. Each only renders when the buyer's
    // device/browser supports it AND the method is enabled on the Square account.
    // Apple Pay: Apple devices/Safari only (Square handles it on their domain, no
    // domain verification needed for hosted checkout). Google Pay: where available.
    // Cash App Pay + Afterpay must also be switched ON in the Square Dashboard
    // (Settings -> Payment methods); Afterpay additionally needs merchant approval
    // and has order-amount limits, so it hides on out-of-range totals.
    checkout_options: {
      accepted_payment_methods: {
        apple_pay: true,
        google_pay: true,
        cash_app_pay: true,
        afterpay_clearpay: true,
      },
    },
  };

  const res = await fetch(`${SQUARE_BASE_URL}/v2/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${squareToken()}`,
      'Content-Type': 'application/json',
      'Square-Version': SQUARE_API_VERSION,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(json.errors?.[0]?.detail || 'Square payment link creation failed');
  }

  const url = json.payment_link?.url;
  if (!url) throw new Error('No checkout URL in Square response');

  const squareOrderId =
    json.payment_link?.order_id || json.related_resources?.orders?.[0]?.id || null;

  return { url, squareOrderId };
}

/**
 * Square Payment Links do NOT copy the order reference_id onto the payment object,
 * so payment.reference_id is usually empty. Resolve it from the Square order.
 * Returns the WEB-<token> reference (or '' if it cannot be resolved).
 */
export async function resolveSquareReference(payment: {
  reference_id?: string | null;
  order_id?: string | null;
}): Promise<string> {
  if (payment?.reference_id) return payment.reference_id;
  const orderId = payment?.order_id;
  if (!orderId) return '';
  try {
    const res = await fetch(`${SQUARE_BASE_URL}/v2/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${squareToken()}`,
        'Square-Version': SQUARE_API_VERSION,
      },
    });
    const json = await res.json();
    return json?.order?.reference_id || '';
  } catch {
    return '';
  }
}

/**
 * Verify a Square webhook. HMAC-SHA256 over (notificationUrl + rawBody), base64,
 * constant-time compared to the x-square-hmacsha256-signature header. Same scheme
 * the portal webhook uses. notificationUrl MUST be the exact subscribed URL.
 */
export function verifySquareWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  notificationUrl: string,
): boolean {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key || !signatureHeader) return false;
  const expected = crypto
    .createHmac('sha256', key)
    .update(notificationUrl + rawBody)
    .digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
