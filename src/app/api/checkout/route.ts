import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { calculatePatchPrice } from '@/lib/pricingCalculator';
import { resolveBaseUrl, applyEconomyDiscount, applyVelcroPricing, getRushSurcharge } from '@/lib/checkoutConfig';
import { sendMetaEvent } from '@/lib/metaCapi';

// 1. Init Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
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
  paymentMethod: z.enum(['card', 'cashapp', 'afterpay', 'applepay', 'klarna']).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  initiateCheckoutEventId: z.string().max(120).optional(),
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
      paymentMethod = 'card',
      attribution,
      initiateCheckoutEventId,
    } = validationResult.data;

    // SECURITY: Calculate price server-side to prevent manipulation
    const priceResult = calculatePatchPrice(productName, width, height, quantity);

    if (priceResult.error) {
      return NextResponse.json(
        { error: priceResult.error },
        { status: 400 }
      );
    }

    // Apply velcro pricing ($0.25/pc), then economy discount (5% off),
    // then add rush surcharge as a separate line item below.
    const velcroAdjusted = applyVelcroPricing(priceResult.totalPrice, backing, quantity);
    const patchSubtotal = applyEconomyDiscount(velcroAdjusted, deliveryOption);
    const rushSurcharge = deliveryOption === 'rush' ? getRushSurcharge(quantity) : 0;
    const finalPrice = Math.round((patchSubtotal + rushSurcharge) * 100) / 100;

    // Validate origin to prevent open redirect attacks
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    const baseUrl = resolveBaseUrl(origin);

    // Build instructions field combining all order details for portal visibility
    const instructionsParts = [
      specialInstructions || null,
      addons?.length ? `Add-ons: ${addons.join(', ')}` : null,
      color ? `Color/Border: ${color}` : null,
      deliveryOption === 'rush' && rushDate ? `Rush Date: ${rushDate}` : null,
      deliveryOption === 'economy' ? 'Economy Delivery (16-18 business days, 5% discount)' : null,
    ].filter(Boolean);

    // Determine Stripe payment method types based on selection
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
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${productName} (${width}" x ${height}")`,
            description: `${backing ? `Backing: ${backing} | ` : ''}Qty: ${quantity}`,
          },
          unit_amount: Math.round((patchSubtotal / quantity) * 100),
        },
        quantity: quantity,
      },
    ];

    if (rushSurcharge > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Rush Production',
            description: rushDate ? `Requested by ${rushDate}` : 'Expedited turnaround',
          },
          unit_amount: Math.round(rushSurcharge * 100),
        },
        quantity: 1,
      });
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&value=${finalPrice}`,
      cancel_url: `${baseUrl}/error-payment`,
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || '',
        shipping_address: (shippingAddress || '').substring(0, 500),
        product_name: productName,
        quantity: String(quantity),
        backing: backing || '',
        design_size: `${width}" x ${height}"`,
        artwork_url: artworkUrl || '',
        instructions: (instructionsParts.length > 0 ? instructionsParts.join(' | ') : '').substring(0, 500),
        delivery_option: deliveryOption,
        rush_date: rushDate || '',
        website_addons: addons?.length ? addons.join(', ') : '',
        order_amount: String(finalPrice),
        // Attribution for Meta CAPI (serialized — trimmed to fit Stripe's 500 char metadata limit)
        attribution: attribution ? JSON.stringify(attribution).substring(0, 500) : '',
        // Server-side signals stored as separate metadata keys (not in attribution JSON)
        // so they don't eat into the 500-char attribution limit.
        // The Stripe webhook merges these into orders.attribution before writing to Supabase.
        meta_client_ip: ((req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
          || req.headers.get('x-real-ip')
          || '').substring(0, 50),
        meta_client_ua: (req.headers.get('user-agent') || '').substring(0, 250),
        meta_event_source_url: (req.headers.get('referer') || `https://www.pandapatches.com`).substring(0, 200),
      },
    };

    // Add customer email for better UX
    if (customer.email) {
      sessionConfig.customer_email = customer.email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Track abandoned cart — upsert checkout_attempts row so the cron can email
    // the customer if no Purchase webhook arrives within 30 minutes.
    await supabase
      .from('checkout_attempts')
      .upsert({
        customer_email: customer.email,
        customer_name: customer.name,
        customer_phone: customer.phone || null,
        product_name: productName,
        quantity,
        design_size: `${width}" x ${height}"`,
        backing: backing || null,
        delivery_option: deliveryOption,
        cart_value: finalPrice,
        artwork_url: artworkUrl || null,
        payment_provider: 'stripe',
        provider_session_id: session.id,
        return_url: `${baseUrl}/custom-patches`,
        fbp: attribution?.fbp || null,
        fbc: attribution?.fbc || null,
        attribution: attribution || null,
        status: 'PENDING',
        initiated_at: new Date().toISOString(),
      }, { onConflict: 'provider_session_id' })
      .then(({ error }) => {
        if (error) console.error('checkout_attempts upsert (stripe):', error);
      });

    // Fire server CAPI InitiateCheckout (mirrors browser fbq with same eventId for dedup)
    if (initiateCheckoutEventId) {
      const ipHeader = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || undefined;
      const ua = req.headers.get('user-agent') || undefined;
      const refererUrl = req.headers.get('referer') || undefined;
      const [icFirstName, ...icLastParts] = (customer.name || '').trim().split(/\s+/);

      sendMetaEvent({
        eventName: 'InitiateCheckout',
        eventId: initiateCheckoutEventId,
        actionSource: 'website',
        eventSourceUrl: refererUrl,
        email: customer.email,
        phone: customer.phone || null,
        firstName: icFirstName,
        lastName: icLastParts.join(' ') || null,
        attribution: {
          ...(attribution || {}),
          client_ip: ipHeader,
          client_ua: ua,
        },
        value: finalPrice,
        currency: 'USD',
        contentName: productName,
        contentCategory: 'Custom Patches',
        numItems: quantity,
        orderId: session.id,
      }).catch((err) => console.error('[META CAPI] InitiateCheckout (Stripe) send failed:', err));
    }

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
