import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

// Initialize Supabase with service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// IMPORTANT: This endpoint must be excluded from middleware body parsing
export const runtime = 'nodejs';

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

        // New flow: create order only on successful payment
        const addonsArray = meta.website_addons ? meta.website_addons.split(', ').filter(Boolean) : null;

        const { error: insertError } = await supabase
          .from('orders')
          .insert({
            customer_name: meta.customer_name || 'Unknown',
            customer_email: meta.customer_email || '',
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
            paid_at: new Date().toISOString(),
            lead_source: 'WEBSITE',
            sales_agent: 'WEBSITE_BOT',
          });

        if (insertError) {
          console.error('Error creating order from webhook:', insertError);
          return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
          );
        }

        // Clean up the lead quote now that order is created
        if (meta.customer_email) {
          await supabase
            .from('quotes')
            .delete()
            .eq('customer_email', meta.customer_email)
            .eq('lead_source', 'WEBSITE_LEAD');
        }

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
