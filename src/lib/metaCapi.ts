import crypto from 'crypto';

const META_GRAPH_VERSION = 'v21.0';
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
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
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
  fbclid?: string;
  client_ip?: string;
  client_ua?: string;
  page_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
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
}

export async function sendMetaEvent(input: MetaEventInput): Promise<{ success: boolean; error?: string }> {
  if (!ACCESS_TOKEN) {
    console.warn('[META CAPI] META_ACCESS_TOKEN not set, skipping event', input.eventName);
    return { success: false, error: 'no_token' };
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
    external_id: input.externalId ? sha256(input.externalId) : undefined,
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
  if (input.value !== undefined) custom_data.value = input.value;
  if (input.currency) custom_data.currency = input.currency;
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
