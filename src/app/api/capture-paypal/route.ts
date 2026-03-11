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
    const { orderId, orderData } = await req.json();

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
      const captureData = captureResult.purchaseUnits?.[0]?.payments?.captures?.[0];
      const amountPaid = parseFloat(captureData?.amount?.value ?? '0');
      const captureId = captureData?.id ?? '';

      // Check if order already exists (legacy flow with pre-created orders)
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('paypal_order_id', orderId)
        .single();

      if (existingOrder) {
        // Legacy flow: update existing order
        await supabase
          .from('orders')
          .update({
            status: 'CONFIRMED',
            payment_status: 'paid',
            amount_paid: amountPaid,
            paypal_capture_id: captureId,
            paid_at: new Date().toISOString()
          })
          .eq('id', existingOrder.id);
      } else if (orderData) {
        // New flow: create order only on successful payment
        const { error: insertError } = await supabase
          .from('orders')
          .insert({
            customer_name: orderData.customer_name || 'Unknown',
            customer_email: orderData.customer_email || '',
            customer_phone: orderData.customer_phone || '',
            shipping_address: orderData.shipping_address || '',
            design_name: orderData.product_name || 'Custom Patch',
            patches_type: orderData.product_name || 'Custom Patch',
            patches_quantity: orderData.quantity || 1,
            design_backing: orderData.backing || null,
            design_size: orderData.design_size || '',
            customer_attachment_urls: orderData.artwork_url ? [orderData.artwork_url] : null,
            instructions: orderData.instructions || null,
            delivery_option: orderData.delivery_option || 'standard',
            rush_date: orderData.rush_date || null,
            website_addons: orderData.website_addons || null,
            order_amount: orderData.order_amount || amountPaid,
            amount_paid: amountPaid,
            paypal_order_id: orderId,
            paypal_capture_id: captureId,
            status: 'CONFIRMED',
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            lead_source: 'WEBSITE',
            sales_agent: 'WEBSITE_BOT',
          });

        if (insertError) {
          console.error('Database insert error:', insertError);
        }
      } else {
        // Fallback: create minimal order from PayPal data
        await supabase
          .from('orders')
          .insert({
            customer_name: 'PayPal Customer',
            customer_email: '',
            design_name: 'Custom Patch',
            patches_type: 'Custom Patch',
            patches_quantity: 1,
            order_amount: amountPaid,
            amount_paid: amountPaid,
            paypal_order_id: orderId,
            paypal_capture_id: captureId,
            status: 'CONFIRMED',
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            lead_source: 'WEBSITE',
            sales_agent: 'WEBSITE_BOT',
          });
      }

      // Clean up the lead quote now that order is created
      const customerEmail = orderData?.customer_email;
      if (customerEmail) {
        await supabase
          .from('quotes')
          .delete()
          .eq('customer_email', customerEmail)
          .eq('lead_source', 'WEBSITE_LEAD');
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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('PayPal capture route error:', msg);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to capture payment. Please contact support.'
      },
      { status: 500 }
    );
  }
}
