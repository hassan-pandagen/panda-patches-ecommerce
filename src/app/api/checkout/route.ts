import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { calculatePatchPrice } from '@/lib/pricingCalculator';
import { resolveBaseUrl, applyEconomyDiscount } from '@/lib/checkoutConfig';

// 1. Init Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

// 2. Init Supabase — use service role key server-side to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 4. Define Validation Schema
const CheckoutSchema = z.object({
  productName: z.string().min(1, 'Product name is required').max(100, 'Product name too long'),
  price: z.number().positive('Price must be positive').max(100000, 'Price too high'),
  quantity: z.number().int('Quantity must be an integer').min(1, 'Minimum quantity is 1').max(10000, 'Quantity too high'),
  backing: z.string().max(100, 'Backing type too long').optional().or(z.literal('')),
  color: z.string().max(100).optional().or(z.null()).or(z.literal('')),
  width: z.number().positive('Width must be positive').min(0.5, 'Minimum width is 0.5 inches').max(50, 'Maximum width is 50 inches'),
  height: z.number().positive('Height must be positive').min(0.5, 'Minimum height is 0.5 inches').max(50, 'Maximum height is 50 inches'),
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().regex(/^[\d\s\-()+ ]+$/, 'Invalid phone number format').optional().or(z.literal('')),
  }),
  shippingAddress: z.string().optional(),
  deliveryOption: z.enum(['rush', 'standard', 'economy']),
  rushDate: z.string().optional().or(z.null()),
  discount: z.string().optional().or(z.null()),
  artworkUrl: z.string().url({ message: 'Invalid URL' }).optional().or(z.null()).or(z.literal('')),
  addons: z.array(z.string()).optional().or(z.null()),
  specialInstructions: z.string().optional().or(z.null()),
  paymentMethod: z.enum(['card', 'cashapp', 'afterpay', 'applepay', 'klarna']).optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validationResult = CheckoutSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const {
      productName,
      price: clientPrice,
      quantity,
      backing,
      color,
      width,
      height,
      customer,
      shippingAddress,
      deliveryOption,
      rushDate,
      artworkUrl,
      addons,
      specialInstructions,
      paymentMethod = 'card'
    } = validationResult.data;

    // SECURITY: Calculate price server-side to prevent manipulation
    const priceResult = calculatePatchPrice(productName, width, height, quantity);

    if (priceResult.error) {
      return NextResponse.json(
        { error: priceResult.error },
        { status: 400 }
      );
    }

    // Apply economy discount if applicable (10% off)
    const finalPrice = applyEconomyDiscount(priceResult.totalPrice, deliveryOption);

    // Validate origin to prevent open redirect attacks
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    const baseUrl = resolveBaseUrl(origin);

    // Build instructions field combining all order details for portal visibility
    const instructionsParts = [
      specialInstructions || null,
      addons?.length ? `Add-ons: ${addons.join(', ')}` : null,
      color ? `Color/Border: ${color}` : null,
      deliveryOption === 'rush' && rushDate ? `Rush Date: ${rushDate}` : null,
      deliveryOption === 'economy' ? 'Economy Delivery (16-18 business days, 10% discount)' : null,
    ].filter(Boolean);

    // === MATCHING YOUR PORTAL CRM SCHEMA ===
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        // Customer Info
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: shippingAddress,

        // Order Details — mapped to exact portal column names
        design_name: productName,
        patches_type: productName,
        patches_quantity: quantity,
        design_backing: backing || null,
        design_size: `${width}" x ${height}"`,

        // Customer artwork → portal's customer_attachment_urls (array)
        customer_attachment_urls: artworkUrl ? [artworkUrl] : null,

        // Instructions = special instructions + addons + color + delivery info
        instructions: instructionsParts.length > 0 ? instructionsParts.join(' | ') : null,

        // New columns (add via SQL migration below)
        delivery_option: deliveryOption,
        rush_date: rushDate || null,
        website_addons: addons || null,

        // Financials
        order_amount: finalPrice,
        amount_paid: 0,

        // Status & tracking
        status: 'WEBSITE_CHECKOUT',
        payment_status: 'pending',
        lead_source: 'WEBSITE',
        sales_agent: 'WEBSITE_BOT',
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
        { status: 500 }
      );
    }

    // B. Determine Stripe payment method types based on selection
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [];
    if (paymentMethod === 'card' || paymentMethod === 'applepay') {
      // Apple Pay is automatically offered by Stripe when 'card' is enabled on supported devices
      paymentMethodTypes.push('card');
    } else if (paymentMethod === 'cashapp') {
      paymentMethodTypes.push('cashapp');
    } else if (paymentMethod === 'afterpay') {
      paymentMethodTypes.push('afterpay_clearpay');
    } else if (paymentMethod === 'klarna') {
      paymentMethodTypes.push('klarna');
    } else {
      paymentMethodTypes.push('card');
    }

    // C. Create Stripe Checkout Session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${productName} (${width}" x ${height}")`,
              description: `${backing ? `Backing: ${backing} | ` : ''}Qty: ${quantity}`,
            },
            unit_amount: Math.round((finalPrice / quantity) * 100),
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/error-payment`,
      metadata: {
        order_id: order.id,
      },
    };

    // Add customer email for better UX
    if (customer.email) {
      sessionConfig.customer_email = customer.email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // D. Update Supabase with Session ID
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({ url: session.url });

  } catch (error: unknown) {
    // Log detailed error server-side
    console.error('Checkout Error:', error);

    // Return generic error to client (don't expose internal details)
    return NextResponse.json(
      {
        error: 'Payment processing failed',
        message: 'We encountered an error processing your payment. Please try again or contact support.'
      },
      { status: 500 }
    );
  }
}
