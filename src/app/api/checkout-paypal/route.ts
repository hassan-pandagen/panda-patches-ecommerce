import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { calculatePatchPrice } from '@/lib/pricingCalculator';
import { PayPalClient } from '@/lib/paypal';
import { resolveBaseUrl, applyEconomyDiscount, applyVelcroPricing, getRushSurcharge } from '@/lib/checkoutConfig';
import { sendMetaEvent } from '@/lib/metaCapi';

// Init Supabase — use service role key server-side to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Define Validation Schema (same as Stripe checkout)
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
  paymentMethod: z.string().optional(),
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
    // then add rush surcharge.
    const velcroAdjusted = applyVelcroPricing(priceResult.totalPrice, backing, quantity);
    const patchSubtotal = applyEconomyDiscount(velcroAdjusted, deliveryOption);
    const rushSurcharge = deliveryOption === 'rush' ? getRushSurcharge(quantity) : 0;
    const finalPrice = Math.round((patchSubtotal + rushSurcharge) * 100) / 100;

    // Validate origin to prevent open redirect attacks
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    const baseUrl = resolveBaseUrl(origin);

    // Build instructions field — same as Stripe route
    const instructionsParts = [
      specialInstructions || null,
      addons?.length ? `Add-ons: ${addons.join(', ')}` : null,
      color ? `Color/Border: ${color}` : null,
      deliveryOption === 'rush' && rushDate ? `Rush Date: ${rushDate}` : null,
      deliveryOption === 'economy' ? 'Economy Delivery (16-18 business days, 5% discount)' : null,
    ].filter(Boolean);

    // Build order data to pass through to capture route (no Supabase insert yet)
    const orderData = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      shipping_address: shippingAddress || '',
      product_name: productName,
      quantity,
      backing: backing || '',
      design_size: `${width}" x ${height}"`,
      artwork_url: artworkUrl || '',
      instructions: instructionsParts.length > 0 ? instructionsParts.join(' | ') : '',
      delivery_option: deliveryOption,
      rush_date: rushDate || '',
      website_addons: addons || null,
      order_amount: finalPrice,
    };

    // Create PayPal Order (no Supabase order created yet)
    const paypalClient = new PayPalClient();
    const paypalOrder = await paypalClient.createOrder({
      amount: finalPrice.toFixed(2),
      currency: 'USD',
      description: `${productName} (${width}" x ${height}") - Qty: ${quantity}`,
      orderId: 'pending',
      returnUrl: `${baseUrl}/success-paypal`,
      cancelUrl: `${baseUrl}/error-payment`
    });

    // Return approval URL for redirect
    // PayPal returns 'payer-action' (newer paymentSource API) or 'approve' (older applicationContext API)
    const approvalUrl = paypalOrder.links?.find(
      (link: any) => link.rel === 'payer-action' || link.rel === 'approve'
    )?.href;

    if (!approvalUrl) {
      console.error('PayPal order missing approval URL. Full order:', JSON.stringify(paypalOrder));
      return NextResponse.json(
        { error: 'Failed to get PayPal approval URL' },
        { status: 500 }
      );
    }

    // Enrich attribution with server-side signals before persisting
    const serverIp = ((req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
      || req.headers.get('x-real-ip') || '') || undefined;
    const serverUa = req.headers.get('user-agent') || undefined;
    const serverUrl = req.headers.get('referer') || 'https://www.pandapatches.com';
    const enrichedAttribution = {
      ...(attribution || {}),
      ...(serverIp ? { client_ip: serverIp } : {}),
      ...(serverUa ? { client_ua: serverUa } : {}),
      page_url: (attribution as any)?.page_url || serverUrl,
    };

    // Store orderData server-side so capture works even if localStorage is cleared (e.g. mobile Safari, different device)
    await supabase
      .from('paypal_pending_orders')
      .upsert({
        paypal_order_id: paypalOrder.id,
        order_data: { ...orderData, attribution: enrichedAttribution },
      }, { onConflict: 'paypal_order_id' });

    // Track abandoned cart — upsert checkout_attempts row so the cron can email
    // the customer if no Purchase capture arrives within 30 minutes.
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
        payment_provider: 'paypal',
        provider_session_id: paypalOrder.id,
        return_url: `${baseUrl}/custom-patches`,
        fbp: attribution?.fbp || null,
        fbc: attribution?.fbc || null,
        attribution: attribution || null,
        status: 'PENDING',
        initiated_at: new Date().toISOString(),
      }, { onConflict: 'provider_session_id' })
      .then(({ error }) => {
        if (error) console.error('checkout_attempts upsert (paypal):', error);
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
        attribution: enrichedAttribution,
        value: finalPrice,
        currency: 'USD',
        contentName: productName,
        contentCategory: 'Custom Patches',
        numItems: quantity,
        orderId: paypalOrder.id,
      }).catch((err) => console.error('[META CAPI] InitiateCheckout (PayPal) send failed:', err));
    }

    return NextResponse.json({ url: approvalUrl, paypalOrderId: paypalOrder.id, orderData });

  } catch (error: unknown) {
    console.error('PayPal Checkout Error:', error);
    return NextResponse.json(
      {
        error: 'Payment processing failed',
        message: 'We encountered an error processing your PayPal payment. Please try again or contact support.'
      },
      { status: 500 }
    );
  }
}
