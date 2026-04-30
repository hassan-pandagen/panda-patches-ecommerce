import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { SendMailClient } from 'zeptomail';
import { sendMetaEvent, type Attribution } from '@/lib/metaCapi';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

// Initialize Supabase with service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// IMPORTANT: This endpoint must be excluded from middleware body parsing
export const runtime = 'nodejs';

function esc(s: string) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function sendOrderEmails(meta: Record<string, string>, amountPaid: number, sessionId: string) {
  const token = process.env.ZEPTOMAIL_TOKEN;
  if (!token) return;

  const name = meta.customer_name || 'Customer';
  const email = meta.customer_email || '';
  const product = meta.product_name || 'Custom Patch';
  const qty = meta.quantity || '1';
  const backing = meta.backing || 'Not specified';
  const size = meta.design_size || 'Not specified';
  const delivery = meta.delivery_option || 'standard';
  const addons = meta.website_addons || '';
  const instructions = meta.instructions || '';
  const shipping = meta.shipping_address || '';
  const source = meta.order_source || 'WEBSITE';

  const deliveryLabel = delivery === 'economy' ? 'Economy (16-18 business days)'
    : delivery === 'rush' ? 'Rush'
    : 'Standard (7-14 business days)';

  const mail = new SendMailClient({ url: 'https://api.zeptomail.com/v1.1/email', token });

  const LOGO = 'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/213c03ef-699b-4ff5-b568-76cbe38d40d7/1190x571.png';
  const IG_BANNER = 'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/4f0fe337-478e-473c-b6aa-baa8b6c94def/1600x406.jpg';
  const FONT = "'lucida sans unicode','lucida grande',sans-serif";

  // ── Internal notification to lance ───────────────────────────────────────
  try {
    await mail.sendMail({
      from: { address: 'hello@pandapatches.com', name: 'Panda Patches Website' },
      to: [{ email_address: { address: 'lance@pandapatches.com', name: 'Lance' } }],
      subject: `[NEW ORDER] ${product} - ${qty} pcs - $${amountPaid.toFixed(2)} - ${source}`,
      htmlbody: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:640px;margin:0 auto;font-family:${FONT};">
  <div style="background:#000;padding:20px 32px;text-align:center;">
    <img src="${LOGO}" alt="Panda Patches" width="200" style="display:block;margin:0 auto;">
    <p style="color:#aaa;margin:10px 0 0;font-size:13px;letter-spacing:2px;">NEW ORDER RECEIVED</p>
  </div>
  <div style="background:#fff;padding:28px 32px;">
    <p style="font-size:15px;color:#333;margin-top:0;">A new order has been placed on the website. Details below:</p>
    <div style="background:#000;padding:12px 18px;border-radius:4px 4px 0 0;margin-top:20px;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Customer Information</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:9px 14px;color:#666;width:140px;background:#fafafa;">Name</td><td style="padding:9px 14px;font-weight:600;color:#fb6e1d;">${esc(name)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Email</td><td style="padding:9px 14px;"><a href="mailto:${esc(email)}" style="color:#333;">${esc(email)}</a></td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Phone</td><td style="padding:9px 14px;">${esc(meta.customer_phone || 'Not provided')}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Ship To</td><td style="padding:9px 14px;">${esc(shipping) || 'Not provided'}</td></tr>
    </table>
    <div style="background:#000;padding:12px 18px;border-radius:4px 4px 0 0;margin-top:20px;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Order Details</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:9px 14px;color:#666;width:140px;background:#fafafa;">Product</td><td style="padding:9px 14px;font-weight:600;">${esc(product)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Quantity</td><td style="padding:9px 14px;font-weight:600;">${esc(qty)} pcs</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Size</td><td style="padding:9px 14px;">${esc(size)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Backing</td><td style="padding:9px 14px;">${esc(backing)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Delivery</td><td style="padding:9px 14px;">${esc(deliveryLabel)}</td></tr>
      ${addons ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Upgrades</td><td style="padding:9px 14px;">${esc(addons)}</td></tr>` : ''}
      ${instructions ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;vertical-align:top;">Instructions</td><td style="padding:9px 14px;white-space:pre-wrap;">${esc(instructions)}</td></tr>` : ''}
      ${meta.artwork_url ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Artwork</td><td style="padding:9px 14px;"><a href="${esc(meta.artwork_url)}" style="color:#fb6e1d;font-weight:600;">View File</a></td></tr>` : ''}
      <tr style="background:#000;"><td style="padding:12px 14px;color:#aaa;font-size:13px;">Amount Paid</td><td style="padding:12px 14px;color:#dcff70;font-size:22px;font-weight:900;">$${amountPaid.toFixed(2)}</td></tr>
    </table>
    <p style="font-size:12px;color:#aaa;margin-top:16px;">Stripe Session: ${esc(sessionId)}</p>
  </div>
  <div style="background:#000;padding:14px 32px;text-align:center;">
    <hr style="border:none;border-top:1px solid #b8975a;margin:0 0 12px;">
    <p style="color:#aaa;font-size:12px;margin:0;">Panda Patches | pandapatches.com | (302) 250-4340</p>
    <p style="color:#555;font-size:11px;margin:6px 0 0;">Quail Feather Ct, Missouri City, TX 77489</p>
  </div>
</div>
</body></html>`,
    });
  } catch (e) {
    console.error('Internal order email error:', e);
  }

  // ── Customer confirmation ────────────────────────────────────────────────
  if (!email) return;
  try {
    await mail.sendMail({
      from: { address: 'hello@pandapatches.com', name: 'Panda Patches' },
      to: [{ email_address: { address: email, name: name } }],
      subject: 'Order Confirmation - Panda Patches',
      htmlbody: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:620px;margin:0 auto;font-family:${FONT};">
  <div style="background:#000000;padding:24px 32px;text-align:center;">
    <img src="${LOGO}" alt="Panda Patches" width="220" style="display:block;margin:0 auto;">
  </div>
  <div style="background:#ffffff;padding:32px 32px 24px;">
    <p style="font-size:15px;color:#333333;margin-top:0;line-height:1.6;">
      Hello <strong style="color:#fb6e1d;">${esc(name)}</strong>,
    </p>
    <p style="font-size:15px;color:#333333;line-height:1.6;">
      Thank you for your order! Your payment has been confirmed and we are excited to get started on your custom patches. Our design team will send you a digital mockup within <strong>24 hours</strong> for your review and approval.
    </p>
    <p style="font-size:14px;color:#555555;line-height:1.6;">
      Production begins only after you approve the mockup. You can request unlimited revisions at no extra charge. If we cannot get it right, we offer a full money-back guarantee.
    </p>

    <div style="background:#000000;padding:12px 20px;margin-top:28px;border-radius:4px 4px 0 0;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">Order Information</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:10px 16px;color:#666666;width:130px;background:#f9f9f9;">Order No.</td><td style="padding:10px 16px;font-weight:700;color:#fb6e1d;">${esc(sessionId.substring(0, 18).toUpperCase())}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Product</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(product)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Quantity</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(qty)} pieces</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Size</td><td style="padding:10px 16px;color:#222222;">${esc(size)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Backing</td><td style="padding:10px 16px;color:#222222;">${esc(backing)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Delivery</td><td style="padding:10px 16px;color:#222222;">${esc(deliveryLabel)}</td></tr>
      ${addons ? `<tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Upgrades</td><td style="padding:10px 16px;color:#222222;">${esc(addons)}</td></tr>` : ''}
      ${shipping ? `<tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Ship To</td><td style="padding:10px 16px;color:#222222;">${esc(shipping)}</td></tr>` : ''}
      <tr style="background:#000000;"><td style="padding:12px 16px;color:#aaaaaa;font-size:13px;">Amount Paid</td><td style="padding:12px 16px;color:#dcff70;font-size:22px;font-weight:900;">$${amountPaid.toFixed(2)}</td></tr>
    </table>

    <div style="margin-top:28px;padding:20px 24px;background:#f9f9f9;border-left:4px solid #fb6e1d;border-radius:0 4px 4px 0;">
      <p style="margin:0 0 10px;font-weight:bold;color:#222222;font-size:14px;">What happens next?</p>
      <p style="margin:0;color:#444444;font-size:14px;line-height:1.8;">
        1. Our design team creates your mockup within 24 hours.<br>
        2. We email the mockup to <strong>${esc(email)}</strong>.<br>
        3. You review and request any changes - all free, no limits.<br>
        4. You approve - production starts immediately.<br>
        5. Your patches ship with full tracking to your door.
      </p>
    </div>

    <p style="color:#555555;font-size:14px;margin-top:24px;line-height:1.6;">
      Questions? Simply reply to this email or call us at <a href="tel:+13022504340" style="color:#fb6e1d;font-weight:bold;">(302) 250-4340</a>. We are happy to help.
    </p>
    <p style="color:#555555;font-size:14px;line-height:1.6;">
      Thank you for choosing Panda Patches. We look forward to delivering something you will love!
    </p>
    <p style="color:#333333;font-size:14px;margin-bottom:0;">
      Warm regards,<br>
      <strong>The Panda Patches Team</strong>
    </p>
  </div>

  <div style="background:#ffffff;padding:0 32px 24px;">
    <a href="https://www.instagram.com/pandapatchesofficial/" target="_blank">
      <img src="${IG_BANNER}" alt="Follow Panda Patches on Instagram" width="556" style="display:block;width:100%;border-radius:4px;">
    </a>
  </div>

  <div style="background:#000000;padding:20px 32px;text-align:center;">
    <hr style="border:none;border-top:1px solid #b8975a;margin:0 0 16px;">
    <p style="color:#ffffff;font-size:12px;margin:0 0 6px;letter-spacing:1px;">PANDA PATCHES</p>
    <p style="color:#aaaaaa;font-size:11px;margin:0;">Quail Feather Ct, Missouri City, TX 77489</p>
    <p style="color:#aaaaaa;font-size:11px;margin:4px 0 0;">(302) 250-4340 | <a href="https://www.pandapatches.com" style="color:#aaaaaa;">pandapatches.com</a></p>
    <p style="color:#555555;font-size:10px;margin:12px 0 0;">This is a transactional email confirming your order with Panda Patches.</p>
  </div>
</div>
</body></html>`,
    });
  } catch (e) {
    console.error('Customer confirmation email error:', e);
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  // Verify webhook signature
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const meta = session.metadata || {};
        const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

        // Check if order already exists (e.g. from payment links or older flow)
        let orderId = meta.order_id;
        if (orderId) {
          // Legacy flow: update existing order
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              amount_paid: amountPaid,
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string | null,
              status: 'PAID',
              paid_at: new Date().toISOString(),
            })
            .eq('id', orderId);
          break;
        }

        // Sample box — update status to paid and send emails
        if (meta.orderType === 'sample_box') {
          const { error: sbErr } = await supabase
            .from('sample_box_orders')
            .update({ status: 'paid' })
            .eq('stripe_session_id', session.id);

          if (sbErr) console.error('Sample box status update error:', sbErr);

          sendOrderEmails(meta, amountPaid, session.id).catch(e =>
            console.error('Sample box email error:', e)
          );
          break;
        }

        // Only create order if it came through our website checkout with valid customer data
        const validName = meta.customer_name?.trim();
        const validEmail = meta.customer_email?.trim();
        if (
          !validName || !validEmail ||
          validName.toLowerCase() === 'unknown' ||
          !validEmail.includes('@')
        ) {
          console.log('Webhook: skipping order — missing or invalid customer data', { validName, validEmail });
          break;
        }

        // New flow: create order only on successful payment
        const addonsArray = meta.website_addons ? meta.website_addons.split(', ').filter(Boolean) : null;

        // Parse attribution from Stripe metadata (serialized JSON, may be empty)
        let attribution: Attribution | null = null;
        if (meta.attribution) {
          try { attribution = JSON.parse(meta.attribution) as Attribution; } catch { attribution = null; }
        }

        const paidAtIso = new Date().toISOString();
        const { data: inserted, error: insertError } = await supabase
          .from('orders')
          .insert({
            customer_name: validName,
            customer_email: validEmail,
            customer_phone: meta.customer_phone || '',
            shipping_address: meta.shipping_address || '',
            design_name: meta.product_name || 'Custom Patch',
            patches_type: meta.product_name || 'Custom Patch',
            patches_quantity: meta.quantity ? parseInt(meta.quantity) : 1,
            design_backing: meta.backing || null,
            design_size: meta.design_size || '',
            customer_attachment_urls: meta.artwork_url ? [meta.artwork_url] : null,
            instructions: meta.instructions || null,
            delivery_option: meta.delivery_option || 'standard',
            rush_date: meta.rush_date || null,
            website_addons: addonsArray,
            order_amount: meta.order_amount ? parseFloat(meta.order_amount) : amountPaid,
            amount_paid: amountPaid,
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string | null,
            status: 'PAID',
            payment_status: 'paid',
            paid_at: paidAtIso,
            lead_source: 'Checkout',
            sales_agent: 'WEB_CHECKOUT',
            attribution,
            meta_capi_sent_at: paidAtIso,
          })
          .select('id, order_number, patches_quantity')
          .single();

        if (insertError) {
          console.error('Error creating order from webhook:', insertError);
          return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
          );
        }

        // Fire Meta CAPI Purchase (non-blocking). Direct-Stripe orders are inserted
        // already PAID so the Supabase UPDATE webhook never sees the transition — we
        // fire here instead. meta_capi_sent_at above prevents Supabase webhook from
        // double-firing if any future UPDATE touches the row.
        const orderIdBase = inserted?.order_number || `order_${inserted?.id}` || session.id;
        const [firstName, ...lastParts] = validName.trim().split(/\s+/);
        sendMetaEvent({
          eventName: 'Purchase',
          eventId: `${session.id}_purchase`,
          actionSource: 'website',
          email: validEmail,
          phone: meta.customer_phone || null,
          firstName,
          lastName: lastParts.join(' ') || undefined,
          attribution: attribution || undefined,
          value: amountPaid,
          currency: 'USD',
          orderId: orderIdBase,
          numItems: inserted?.patches_quantity || undefined,
          contentName: meta.product_name || 'Custom Patches Order',
          contentCategory: 'Custom Patches',
        }).catch((err) => console.error('[META CAPI] Purchase send failed (non-blocking):', err));

        // Send email notifications (non-blocking)
        sendOrderEmails(meta, amountPaid, session.id).catch(e =>
          console.error('Order email send error:', e)
        );

        // Clean up the lead quote now that order is created
        await supabase
          .from('quotes')
          .delete()
          .eq('customer_email', validEmail)
          .eq('lead_source', 'WEBSITE_LEAD');

        break;
      }

      case 'checkout.session.expired': {
        // No order was created, so nothing to update. Session just expired.
        // The lead stays in quotes table for follow-up.
        break;
      }

      case 'payment_intent.payment_failed': {
        // Check if an order exists for this payment intent (legacy flow)
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { data: order } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .single();

        if (order) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'failed',
              status: 'PAYMENT_FAILED',
            })
            .eq('id', order.id);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
