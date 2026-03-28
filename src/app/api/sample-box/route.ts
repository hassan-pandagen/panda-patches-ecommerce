import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { resolveBaseUrl } from '@/lib/checkoutConfig';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Validation schema — no card fields, Stripe handles payment
const sampleBoxSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }).max(200),
  email: z.string().email({ message: 'Invalid email address' }),
  contactNumber: z.string().min(1, { message: 'Contact number is required' }).max(30),
  shippingAddress: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check — bots fill this, real users don't
    if (body.website) {
      return NextResponse.json({ success: true, checkoutUrl: null });
    }

    const validationResult = sampleBoxSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: validationResult.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const amount = 4500; // $45.00 in cents

    const origin = request.headers.get('origin');
    const baseUrl = resolveBaseUrl(origin);

    // Create Stripe Checkout Session (secure — card data never touches our server)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: data.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Box',
              description: 'Custom patch sample box including setup and shipping',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        // Keys used by the Stripe webhook handler
        customer_name: data.fullName,
        customer_email: data.email,
        customer_phone: data.contactNumber,
        shipping_address: data.shippingAddress || '',
        product_name: 'Sample Box',
        quantity: '1',
        backing: 'N/A',
        design_size: 'N/A',
        delivery_option: 'standard',
        order_source: 'SAMPLE_BOX',
        orderType: 'sample_box',
      },
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/error-payment`,
    });

    // Store pending order in Supabase
    const { error: dbError } = await supabase
      .from('sample_box_orders')
      .insert({
        full_name: data.fullName,
        email: data.email,
        contact_number: data.contactNumber,
        shipping_address: data.shippingAddress,
        amount,
        stripe_session_id: session.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error: unknown) {
    console.error('Sample box order error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', message: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to process sample box order' },
      { status: 500 }
    );
  }
}
