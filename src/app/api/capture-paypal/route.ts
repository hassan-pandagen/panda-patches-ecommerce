import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PayPalClient } from '@/lib/paypal';

// Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Capture PayPal Payment
 * Called from the success page after customer approves payment
 */

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Initialize PayPal client
    const paypalClient = new PayPalClient();

    // Capture the payment
    const captureResult = await paypalClient.captureOrder(orderId);

    // Check if payment was successful
    if (captureResult.status === 'COMPLETED') {
      const amountPaid = parseFloat(captureResult.purchase_units[0].payments.captures[0].amount.value);
      const captureId = captureResult.purchase_units[0].payments.captures[0].id;

      // Update order in database
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'CONFIRMED',
          payment_status: 'paid',
          amount_paid: amountPaid,
          paypal_capture_id: captureId,
          paid_at: new Date().toISOString()
        })
        .eq('paypal_order_id', orderId);

      if (error) {
        console.error('Database update error:', error);
        // Payment was captured but DB update failed - log for manual review
      }

      return NextResponse.json({
        success: true,
        message: 'Payment captured successfully',
        captureId
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Payment capture failed with status: ${captureResult.status}`
        },
        { status: 400 }
      );
    }

  } catch (error: unknown) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to capture payment. Please contact support.'
      },
      { status: 500 }
    );
  }
}
