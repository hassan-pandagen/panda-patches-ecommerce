import crypto from 'crypto';

// Aligned to v25.0 to match the CRM/backend CAPI (send-meta-* edge functions).
// Keep both sides on the same Graph version so event schema and EMQ behavior
// stay consistent across the website and the order-database integration.
const META_GRAPH_VERSION = 'v25.0';
const PIXEL_ID = process.env.META_PIXEL_ID || '1515101469424765';
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

function sha256(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function hashEmail(email: string | undefined | null) {
  if (!email) return undefined;
  return sha256(email.trim().toLowerCase());
}

export function hashPhone(phone: string | undefined | null) {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  // Meta spec: hash the phone with country code, digits only, no "+" or symbols.
  // A bare 10-digit US/CA number hashes to a value Meta can't match against its
  // graph (which stores country-code-prefixed). Prepend "1" for 10-digit numbers;
  // 11+ digit numbers are assumed to already carry a country code.
  if (digits.length === 10) digits = '1' + digits;
  return sha256(digits);
}

export function hashName(name: string | undefined | null) {
  if (!name) return undefined;
  return sha256(name.trim().toLowerCase());
}

export interface Attribution {
  fbp?: string;
  fbc?: string;
  gclid?: string;
  wbraid?: string;
  gbraid?: string;
  /** ISO capture time of the Google click id — read by the CRM's
   *  google-ads-conversions edge function for the 90-day click-age check. */
  gclid_captured_at?: string;
  fbclid?: string;
  client_ip?: string;
  client_ua?: string;
  page_url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  msclkid?: string;
  ttclid?: string;
}

export interface MetaEventInput {
  eventName: 'Lead' | 'Purchase' | 'Contact' | 'InitiateCheckout' | 'ViewContent' | 'AddToCart';
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  actionSource?: 'website' | 'chat' | 'email' | 'physical_store' | 'system_generated' | 'other';
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  externalId?: string | null;
  attribution?: Attribution | null;
  value?: number;
  currency?: string;
  contentName?: string;
  contentCategory?: string;
  contentIds?: string[];
  numItems?: number;
  orderId?: string;
  /**
   * Meta `content_type` — 'product' for a normal purchasable item. Improves
   * delivery matching (CL4DE6 §1.2). The CRM edge function already sends
   * 'product' on Purchase; this keeps the website senders consistent.
   */
  contentType?: 'product' | 'product_group';
}

export async function sendMetaEvent(input: MetaEventInput): Promise<{ success: boolean; error?: string }> {
  if (!ACCESS_TOKEN) {
    console.warn('[META CAPI] META_ACCESS_TOKEN not set, skipping event', input.eventName);
    return { success: false, error: 'no_token' };
  }

  // PURCHASE VALUE GUARD (CL4DE6 §1.1). Events Manager's top flagged action is
  // "send higher-quality price data for more accurate ROAS". A Purchase with a
  // missing, zero or negative value is worse than no Purchase at all: Meta
  // cannot compute ROAS from it, and a purchase-optimized campaign learns that
  // a conversion is worth nothing. Refuse to send and log loudly so the calling
  // path gets fixed, rather than quietly polluting the dataset.
  if (input.eventName === 'Purchase') {
    const v = input.value;
    if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) {
      console.error(
        `[META CAPI] BLOCKED Purchase with invalid value (${JSON.stringify(v)}) — ` +
          `event_id=${input.eventId}, order_id=${input.orderId ?? 'n/a'}. ` +
          `Every Purchase must carry the real order total. Fix the caller.`
      );
      return { success: false, error: 'purchase_missing_value' };
    }
  }

  const attr = input.attribution || {};

  const user_data: Record<string, unknown> = {
    em: hashEmail(input.email),
    ph: hashPhone(input.phone),
    fn: hashName(input.firstName),
    ln: hashName(input.lastName),
    ct: hashName(input.city),
    st: hashName(input.state),
    zp: sha256(input.zip?.trim().toLowerCase()),
    // external_id is normalized (trim + lowercase) before hashing so a
    // customer's hashed email matches across every event and repeat order
    // (Customer Match). Callers should pass the customer email here.
    external_id: input.externalId ? sha256(input.externalId.trim().toLowerCase()) : undefined,
    client_ip_address: attr.client_ip,
    client_user_agent: attr.client_ua,
    fbp: attr.fbp,
    fbc: attr.fbc,
  };

  for (const k of Object.keys(user_data)) {
    if (user_data[k] === undefined || user_data[k] === null || user_data[k] === '') {
      delete user_data[k];
    }
  }

  const custom_data: Record<string, unknown> = {};
  // Meta requires value AND currency together. Sending value without currency (or vice versa)
  // causes the 48% Lead-event currency-format failure flagged in Events Manager May 2026.
  // Defaults missing currency to USD — safe today because all Panda Patches revenue is in USD.
  // IMPORTANT: Update this default when adding multi-currency support (CAD, GBP, EUR, AUD, etc).
  // The fallback would silently miscategorize non-USD orders if international sales launch.
  //
  // A ZERO VALUE IS OMITTED ENTIRELY, NOT SENT AS 0 (CL4DE6 §3, Aug 2026).
  // Events Manager reported "57% of price data from website Lead events has
  // formatting issues or missing values". The cause was three Lead senders
  // hardcoding `value: 0` — contact, partner, and (highest volume by far) the
  // quote route, which sent 0 for any form without a priced calculator. A Lead
  // does not need a price: an unpriced enquiry genuinely has no monetary value,
  // and "0" is not a neutral placeholder — Meta reads it as malformed price data
  // and it drags the whole dataset's quality score down.
  //
  // LEAD SENDS NO VALUE AND NO CURRENCY, EVER (Sept 2026).
  //
  // The Aug 2026 fix omitted only NON-POSITIVE values, so a priced calculator
  // quote still sent a figure. That left Lead value present on some paths and
  // absent on others, which is itself the malformed-price complaint: Events
  // Manager still reported 9% of Lead events with malformed currency and 48%
  // with none. Mixed presence reads worse than consistent absence.
  //
  // We do not value-optimize leads. There is no campaign objective consuming a
  // Lead value, so the correct figure to send is none — on every Lead path,
  // whether or not a price happens to be available. The pixel side is aligned
  // to this same rule in the five fbq('track','Lead') call sites.
  //
  // Purchase is unaffected and still carries value+currency; it is also blocked
  // outright above when the value is missing, zero or negative.
  const isLead = input.eventName === 'Lead';
  const hasRealValue =
    !isLead &&
    typeof input.value === 'number' && Number.isFinite(input.value) && input.value > 0;
  if (hasRealValue) {
    custom_data.value = input.value;
    custom_data.currency = input.currency || 'USD';
  }
  // Note: currency is never sent without value — an orphan currency is the other
  // half of the same formatting complaint.
  // content_type defaults to 'product' on Purchase so every Purchase carries it
  // without each call site having to remember (CL4DE6 §1.2).
  const contentType = input.contentType ?? (input.eventName === 'Purchase' ? 'product' : undefined);
  if (contentType) custom_data.content_type = contentType;
  if (input.contentName) custom_data.content_name = input.contentName;
  if (input.contentCategory) custom_data.content_category = input.contentCategory;
  if (input.contentIds) custom_data.content_ids = input.contentIds;
  if (input.numItems !== undefined) custom_data.num_items = input.numItems;
  if (input.orderId) custom_data.order_id = input.orderId;

  const event = {
    event_name: input.eventName,
    event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    action_source: input.actionSource ?? 'website',
    event_source_url: input.eventSourceUrl,
    user_data,
    custom_data,
  };

  const payload: Record<string, unknown> = { data: [event] };
  if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

  try {
    const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      console.error('[META CAPI] Event send failed', input.eventName, res.status, json);
      return { success: false, error: `status_${res.status}` };
    }
    console.log('[META CAPI] Sent', input.eventName, 'event_id=', input.eventId);
    return { success: true };
  } catch (err) {
    console.error('[META CAPI] Network error sending event', input.eventName, err);
    return { success: false, error: 'network_error' };
  }
}
