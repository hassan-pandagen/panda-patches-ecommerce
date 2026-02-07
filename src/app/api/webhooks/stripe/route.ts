import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
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

        // Get the order ID from metadata
        const orderId = session.metadata?.order_id;

        if (!orderId) {
          console.error('No order_id in session metadata');
          break;
        }

        // Update the order in Supabase
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            amount_paid: session.amount_total ? session.amount_total / 100 : 0,
            stripe_payment_intent_id: session.payment_intent as string,
            status: 'PAID', // Update status to PAID
            paid_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error updating order:', updateError);
          return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
          );
        }

        console.log(`✅ Payment successful for order ${orderId}`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.order_id;

        if (orderId) {
          // Mark the order as expired/cancelled
          await supabase
            .from('orders')
            .update({
              payment_status: 'expired',
              status: 'CANCELLED',
            })
            .eq('id', orderId);

          console.log(`⏰ Checkout session expired for order ${orderId}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Find the order by payment intent ID
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

          console.log(`❌ Payment failed for order ${order.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
