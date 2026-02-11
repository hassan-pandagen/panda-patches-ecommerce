import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Validation schema
const sampleBoxSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  contactNumber: z.string().min(1, { message: 'Contact number is required' }),
  quantity: z.number().int().positive({ message: 'Quantity must be positive' }),
  shippingAddress: z.string().optional(),
  cardNumber: z.string().min(1, { message: 'Card number is required' }),
  cardholderName: z.string().min(1, { message: 'Cardholder name is required' }),
  expiryMonth: z.string().min(1, { message: 'Expiry month is required' }),
  expiryYear: z.string().min(1, { message: 'Expiry year is required' }),
  securityCode: z.string().min(1, { message: 'Security code is required' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
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

    // Create Stripe payment intent (Note: In production, use Stripe Elements for secure card handling)
    // For now, we'll store the order and handle payment separately
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: `Sample Box Order - ${data.fullName}`,
      metadata: {
        fullName: data.fullName,
        email: data.email,
        quantity: data.quantity.toString(),
      },
    });

    // Store order in Supabase
    const { error: dbError } = await supabase
      .from('sample_box_orders')
      .insert({
        full_name: data.fullName,
        email: data.email,
        contact_number: data.contactNumber,
        quantity: data.quantity,
        shipping_address: data.shippingAddress,
        amount,
        payment_intent_id: paymentIntent.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway - payment intent was created
    }

    return NextResponse.json({
      success: true,
      message: 'Sample box order received successfully',
      paymentIntentId: paymentIntent.id,
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
