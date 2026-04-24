import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMetaEvent, type Attribution } from '@/lib/metaCapi';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;
const CANCELLED_STATUSES = new Set(['CANCELLED', 'REFUNDED']);

interface SupabaseWebhookBody {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: OrderRow | null;
  old_record: OrderRow | null;
  schema: string;
}

interface OrderRow {
  id: number;
  order_number: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  order_amount: number;
  amount_paid: number;
  status: string;
  attribution: Attribution | null;
  meta_capi_sent_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  patches_quantity: number | null;
}

function unauthorized(reason: string) {
  return NextResponse.json({ ok: false, reason }, { status: 401 });
}

function splitName(full: string | null | undefined): { firstName?: string; lastName?: string } {
  if (!full) return {};
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function parseZipFromAddress(addr: string | null | undefined): string | undefined {
  if (!addr) return undefined;
  const match = addr.match(/\b(\d{5})(?:-\d{4})?\b/);
  return match?.[1];
}

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    console.error('[META CAPI] SUPABASE_WEBHOOK_SECRET not configured');
    return unauthorized('not_configured');
  }

  const authHeader = req.headers.get('authorization') || '';
  const expected = `Bearer ${WEBHOOK_SECRET}`;
  if (authHeader !== expected) {
    return unauthorized('bad_token');
  }

  let body: SupabaseWebhookBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_json' }, { status: 400 });
  }

  if (body.table !== 'orders' || body.type !== 'UPDATE') {
    return NextResponse.json({ ok: true, skipped: 'not_orders_update' });
  }

  const n = body.record;
  const o = body.old_record;
  if (!n || !o) {
    return NextResponse.json({ ok: true, skipped: 'missing_record' });
  }

  const nowPaid = Number(n.amount_paid) >= Number(n.order_amount) && Number(n.order_amount) > 0;
  const wasPaid = Number(o.amount_paid) >= Number(o.order_amount) && Number(o.order_amount) > 0;
  const paymentIncreased = Number(n.amount_paid) > Number(o.amount_paid);

  if (!nowPaid || wasPaid || !paymentIncreased) {
    return NextResponse.json({ ok: true, skipped: 'not_newly_paid' });
  }

  if (CANCELLED_STATUSES.has(n.status)) {
    return NextResponse.json({ ok: true, skipped: 'cancelled_or_refunded' });
  }

  if (n.meta_capi_sent_at) {
    return NextResponse.json({ ok: true, skipped: 'already_sent' });
  }

  const { firstName, lastName } = splitName(n.customer_name);
  const zip = parseZipFromAddress(n.shipping_address);

  const eventIdBase = n.order_number || `order_${n.id}`;
  const eventId = `${eventIdBase}_purchase`;

  const result = await sendMetaEvent({
    eventName: 'Purchase',
    eventId,
    eventTime: Math.floor(new Date(n.updated_at).getTime() / 1000),
    actionSource: 'website',
    email: n.customer_email,
    phone: n.customer_phone,
    firstName,
    lastName,
    zip,
    externalId: eventIdBase,
    attribution: n.attribution || undefined,
    value: Number(n.amount_paid),
    currency: 'USD',
    orderId: eventIdBase,
    numItems: n.patches_quantity || undefined,
    contentName: 'Custom Patches Order',
    contentCategory: 'Custom Patches',
  });

  // Mark as sent (and stamp paid_at) regardless of CAPI success so we don't
  // retry forever on a permanent failure. Meta failures are logged in metaCapi.
  const nowIso = new Date().toISOString();
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      meta_capi_sent_at: nowIso,
      paid_at: n.paid_at || nowIso,
    })
    .eq('id', n.id);

  if (updateError) {
    console.error('[META CAPI] Failed to stamp order after send', updateError);
  }

  return NextResponse.json({
    ok: true,
    sent: result.success,
    error: result.error,
    event_id: eventId,
  });
}
