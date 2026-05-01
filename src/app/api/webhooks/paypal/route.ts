import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMetaEvent, type Attribution } from '@/lib/metaCapi';

interface PayPalEventResource {
  id: string;
  amount?: { value: string };
  supplementary_data?: { related_ids?: { order_id?: string } };
}

interface PayPalEvent {
  event_type: string;
  resource: PayPalEventResource;
}

// Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Verify PayPal webhook signature via PayPal's verification API.
 * Set PAYPAL_WEBHOOK_ID in your env (from PayPal Developer Dashboard → Webhooks).
 */
async function verifyPayPalWebhook(req: Request, rawBody: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    if (process.env.NODE_ENV === 'production') {
      console.error('PAYPAL_WEBHOOK_ID not set — rejecting webhook in production');
      return false;
    }
    return true; // Allow in dev without webhook ID configured
  }

  const transmissionId = req.headers.get('paypal-transmission-id');
  const transmissionTime = req.headers.get('paypal-transmission-time');
  const certUrl = req.headers.get('paypal-cert-url');
  const transmissionSig = req.headers.get('paypal-transmission-sig');
  const authAlgo = req.headers.get('paypal-auth-algo');

  if (!transmissionId || !transmissionTime || !certUrl || !transmissionSig || !authAlgo) {
    return false;
  }

  try {
    const baseUrl = process.env.PAYPAL_ENVIRONMENT === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const credentials = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials',
    });
    const { access_token } = await tokenRes.json();

    const verifyRes = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(rawBody),
      }),
    });

    const { verification_status } = await verifyRes.json();
    return verification_status === 'SUCCESS';
  } catch (error) {
    console.error('PayPal webhook verification error:', error);
    return false;
  }
}

/**
 * PayPal Webhook Handler
 *
 * Handled events:
 * - CHECKOUT.ORDER.APPROVED    — Customer approves payment
 * - PAYMENT.CAPTURE.COMPLETED  — Payment successfully captured
 * - PAYMENT.CAPTURE.DENIED     — Payment capture failed
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    const isValid = await verifyPayPalWebhook(req, rawBody);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const eventType: string = body.event_type;

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        await handleOrderApproved(body);
        break;
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptured(body);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentDenied(body);
        break;
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleOrderApproved(event: PayPalEvent) {
  const orderId = event.resource.id;

  // Update order status in database
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'PAYMENT_APPROVED',
      payment_status: 'approved',
    })
    .eq('paypal_order_id', orderId);

  if (error) {
    console.error('Failed to update order on approval:', error);
  }
}

async function handlePaymentCaptured(event: PayPalEvent) {
  const captureId = event.resource.id;
  const orderId = event.resource.supplementary_data?.related_ids?.order_id;
  const amountPaid = parseFloat(event.resource.amount?.value ?? '0');

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'CONFIRMED',
      payment_status: 'paid',
      amount_paid: amountPaid,
      paypal_capture_id: captureId,
      paid_at: new Date().toISOString(),
      meta_capi_sent_at: new Date().toISOString(),
    })
    .eq('paypal_order_id', orderId);

  if (error) {
    console.error('Failed to update order on capture:', error);
  }

  // Mark abandoned-cart row as purchased so the cron skips it
  if (orderId) {
    await supabase
      .from('checkout_attempts')
      .update({
        status: 'PURCHASED',
        purchased_at: new Date().toISOString(),
      })
      .eq('provider_session_id', orderId);
  }

  // Mirror the Purchase event to Meta CAPI as a webhook backup.
  // capture-paypal already fires this with the same eventId (`${orderId}_purchase`),
  // so Meta will dedupe whichever arrives second. This ensures Purchase is sent
  // even if the customer closes the browser before /api/capture-paypal runs.
  if (orderId) {
    try {
      const { data: order } = await supabase
        .from('orders')
        .select('customer_name, customer_email, customer_phone, patches_quantity, patches_type, attribution')
        .eq('paypal_order_id', orderId)
        .single();

      if (order?.customer_email) {
        const [firstName, ...lastParts] = String(order.customer_name || '').trim().split(/\s+/);
        sendMetaEvent({
          eventName: 'Purchase',
          eventId: `${orderId}_purchase`,
          actionSource: 'website',
          email: order.customer_email,
          phone: order.customer_phone || null,
          firstName,
          lastName: lastParts.join(' ') || undefined,
          attribution: (order.attribution as Attribution) || undefined,
          value: amountPaid,
          currency: 'USD',
          orderId,
          numItems: order.patches_quantity || undefined,
          contentName: order.patches_type || 'Custom Patches Order',
          contentCategory: 'Custom Patches',
        }).catch((err) => console.error('[META CAPI] PayPal webhook Purchase send failed:', err));
      }
    } catch (e) {
      console.error('PayPal webhook Meta CAPI lookup failed:', e);
    }
  }
}

async function handlePaymentDenied(event: PayPalEvent) {
  const orderId = event.resource.supplementary_data?.related_ids?.order_id;

  // Update order status
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'PAYMENT_FAILED',
      payment_status: 'failed',
    })
    .eq('paypal_order_id', orderId);

  if (error) {
    console.error('Failed to update order on payment denial:', error);
  }
}
