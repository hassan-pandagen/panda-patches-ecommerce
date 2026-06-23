import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resolveLeadSource } from '@/lib/attribution';
import { sendMetaEvent, type Attribution } from '@/lib/metaCapi';
import { sendCustomerEmail } from '@/lib/sendCustomerEmail';
import { ensureCustomerAccount } from '@/lib/ensureCustomerAccount';
import { sendOrderEmails } from '@/lib/orderEmails';
import { verifySquareWebhookSignature, resolveSquareReference, WEB_REF_PREFIX } from '@/lib/square';

export const runtime = 'nodejs';

// MUST exactly match the URL subscribed in the Square Developer Dashboard, or the
// HMAC signature will never validate.
const WEBHOOK_URL = 'https://www.pandapatches.com/api/webhooks/square';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const ok = (extra: Record<string, unknown> = {}) =>
  NextResponse.json({ received: true, ...extra });

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get('x-square-hmacsha256-signature');

  if (!verifySquareWebhookSignature(rawBody, sigHeader, WEBHOOK_URL)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    if (event?.type !== 'payment.updated') return ok({ type: event?.type });

    const payment = event?.data?.object?.payment;
    if (!payment) return ok({ skipped: 'no payment object' });
    if (payment.status !== 'COMPLETED') return ok({ skipped: `status=${payment.status}` });

    // Resolve the WEB- reference. Square Payment Links do not copy reference_id onto
    // the payment, so this falls back to fetching the Square order.
    const reference = await resolveSquareReference(payment);
    if (!reference.startsWith(WEB_REF_PREFIX)) {
      // Not a website payment (portal/agent payment) — the portal webhook owns it.
      return ok({ skipped: 'not a website payment' });
    }
    const token = reference.slice(WEB_REF_PREFIX.length);

    // Atomic claim: only the first delivery for this token consumes the pending row.
    // Square emits several payment.updated events per payment, so this is what stops
    // duplicate orders. A second delivery matches zero rows and is a clean no-op.
    const { data: claimed } = await supabase
      .from('square_pending_orders')
      .update({ consumed_at: new Date().toISOString() })
      .eq('token', token)
      .is('consumed_at', null)
      .select('order_data')
      .maybeSingle();

    if (!claimed) return ok({ deduped: 'pending order already consumed or not found' });

    const d = claimed.order_data as Record<string, any>;
    const amountPaid = (payment.amount_money?.amount ?? 0) / 100;

    const validName = (d.customer_name || '').trim();
    const validEmail = (d.customer_email || '').trim();
    if (!validName || !validEmail || !validEmail.includes('@')) {
      console.error('[square webhook] pending order missing customer data', token);
      return ok({ skipped: 'missing customer data' });
    }

    // Attribution + Square ids for traceability (square ids live in the JSONB, since
    // the orders table has no square columns).
    const attribution: Attribution = {
      ...(d.attribution || {}),
      square_payment_id: payment.id,
      square_order_id: payment.order_id || null,
    } as Attribution;

    const paidAtIso = new Date().toISOString();
    const { data: inserted, error: insertError } = await supabase
      .from('orders')
      .insert({
        customer_name: validName,
        customer_email: validEmail,
        customer_phone: d.customer_phone || '',
        shipping_address: d.shipping_address || '',
        design_name: d.product_name || 'Custom Patch',
        patches_type: d.product_name || 'Custom Patch',
        patches_quantity: d.quantity ? parseInt(String(d.quantity), 10) : 1,
        design_backing: d.backing || null,
        design_size: d.design_size || '',
        customer_attachment_urls: d.artwork_url ? [d.artwork_url] : null,
        instructions: d.instructions || null,
        delivery_option: d.delivery_option || 'standard',
        rush_date: d.rush_date || null,
        website_addons: Array.isArray(d.website_addons) ? d.website_addons : null,
        order_amount: d.order_amount ? parseFloat(String(d.order_amount)) : amountPaid,
        amount_paid: amountPaid,
        // Pipeline stage, not 'PAID'; payment tracked via payment_status (matches Stripe).
        status: 'NEW_ORDER',
        payment_status: 'paid',
        paid_at: paidAtIso,
        // Offers checkout sets these in order_data; product checkout leaves them
        // unset and falls back to the attribution-derived source + WEB_CHECKOUT.
        lead_source: d.lead_source || resolveLeadSource(attribution),
        sales_agent: d.sales_agent || 'WEB_CHECKOUT',
        attribution,
        meta_capi_sent_at: paidAtIso,
        user_id: typeof d.user_id === 'string' && d.user_id.length === 36 ? d.user_id : null,
      })
      .select('id, order_number, patches_quantity')
      .single();

    if (insertError || !inserted) {
      console.error('[square webhook] order insert failed:', insertError);
      // Release the claim so a later delivery of this payment can retry.
      await supabase
        .from('square_pending_orders')
        .update({ consumed_at: null })
        .eq('token', token);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const orderRef =
      inserted.order_number || `PP-${String(inserted.id).padStart(5, '0')}`;

    // Customer payment-confirmation (branded edge template), send-once guarded.
    try {
      const { data: claimedEmail } = await supabase
        .from('orders')
        .update({ customer_confirmation_sent_at: new Date().toISOString() })
        .eq('id', inserted.id)
        .is('customer_confirmation_sent_at', null)
        .select('id')
        .maybeSingle();
      if (claimedEmail) {
        const amountStr = `$${amountPaid.toFixed(2)}`;
        await sendCustomerEmail({
          to: validEmail,
          templateId: 'CUSTOMER_PAYMENT_CONFIRMATION',
          dynamicData: {
            customer_name: validName,
            customer_email: validEmail,
            order_number: orderRef,
            amount_paid: amountStr,
            total_amount: amountStr,
            portal_action_url: `https://www.pandapatches.com/login?email=${encodeURIComponent(validEmail)}`,
          },
        });
      }
    } catch (e) {
      console.error('[square webhook] CUSTOMER_PAYMENT_CONFIRMATION failed (non-blocking):', e);
    }

    // Auto-provision a customer account (non-blocking).
    ensureCustomerAccount({
      email: validEmail,
      fullName: validName,
      phone: d.customer_phone || null,
      orderNumber: orderRef,
    }).catch((e) => console.error('[square webhook] ensureCustomerAccount failed (non-blocking):', e));

    // Meta CAPI Purchase (non-blocking). Shared eventId with the browser pixel.
    const [firstName, ...lastParts] = validName.trim().split(/\s+/);
    sendMetaEvent({
      eventName: 'Purchase',
      // Dedup key is the pending-order TOKEN, not payment.id, because the success
      // page only knows the token (?ref=) and fires the browser pixel with the same
      // `${token}_purchase`. Keeps Meta from double-counting Square purchases.
      eventId: `${token}_purchase`,
      actionSource: 'website',
      email: validEmail,
      phone: d.customer_phone || null,
      firstName,
      lastName: lastParts.join(' ') || undefined,
      externalId: validEmail,
      attribution,
      value: amountPaid,
      currency: 'USD',
      orderId: orderRef,
      numItems: inserted.patches_quantity || undefined,
      contentName: d.product_name || 'Custom Patches Order',
      contentCategory: 'Custom Patches',
    }).catch((err) => console.error('[META CAPI] Purchase (Square) failed (non-blocking):', err));

    // Mark abandoned-cart row purchased (provider_session_id = token).
    await supabase
      .from('checkout_attempts')
      .update({ status: 'PURCHASED', purchased_at: paidAtIso })
      .eq('provider_session_id', token)
      .then(({ error }) => {
        if (error) console.error('checkout_attempts mark purchased (square):', error);
      });

    // Internal new-order + customer confirmation HTML emails (non-blocking).
    sendOrderEmails(
      {
        customer_name: validName,
        customer_email: validEmail,
        customer_phone: d.customer_phone || '',
        product_name: d.product_name || 'Custom Patch',
        quantity: String(d.quantity || ''),
        backing: d.backing || '',
        design_size: d.design_size || '',
        delivery_option: d.delivery_option || 'standard',
        website_addons: Array.isArray(d.website_addons) ? d.website_addons.join(', ') : '',
        instructions: d.instructions || '',
        shipping_address: d.shipping_address || '',
        artwork_url: d.artwork_url || '',
        order_number: orderRef,
        order_source: d.order_source || 'WEBSITE',
      },
      amountPaid,
      payment.id,
    ).catch((e) => console.error('[square webhook] order emails failed (non-blocking):', e));

    // Clean up the lead quote now that the order exists.
    await supabase
      .from('quotes')
      .delete()
      .eq('customer_email', validEmail)
      .eq('lead_source', 'WEBSITE_LEAD');

    return ok({ order_number: orderRef, paid: amountPaid });
  } catch (error: unknown) {
    console.error('[square webhook] handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
