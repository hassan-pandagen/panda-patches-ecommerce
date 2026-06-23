import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { calculatePatchPrice } from '@/lib/pricingCalculator';
import {
  resolveBaseUrl,
  applyEconomyDiscount,
  applyVelcroPricing,
  getRushSurcharge,
} from '@/lib/checkoutConfig';
import { createSquarePaymentLink } from '@/lib/square';
import { sendMetaEvent } from '@/lib/metaCapi';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Mirrors the Stripe checkout schema so the two routes validate identically.
const CheckoutSchema = z.object({
  productName: z.string().min(1).max(100),
  price: z.number().positive().max(100000),
  quantity: z.number().int().min(5).max(10000),
  backing: z.string().max(100).optional().or(z.literal('')),
  color: z.string().max(100).optional().or(z.null()).or(z.literal('')),
  width: z.number().positive().min(0.5).max(50),
  height: z.number().positive().min(0.5).max(50),
  customer: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[\d\s\-()+ ]+$/).optional().or(z.literal('')),
  }),
  shippingAddress: z.string().optional(),
  deliveryOption: z.enum(['rush', 'standard', 'economy']),
  rushDate: z.string().optional().or(z.null()),
  discount: z.string().optional().or(z.null()),
  artworkUrl: z.string().url().optional().or(z.null()).or(z.literal('')),
  addons: z.array(z.string()).optional().or(z.null()),
  specialInstructions: z.string().optional().or(z.null()),
  attribution: z.record(z.string(), z.string()).optional(),
  initiateCheckoutEventId: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
        { status: 400 },
      );
    }

    const {
      productName,
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
    } = parsed.data;

    // Tag the order with the signed-in user if there is one (guest checkout works
    // unchanged). The webhook copies this into orders.user_id.
    let userId: string | null = null;
    try {
      const authClient = await createSupabaseServerClient();
      const {
        data: { user },
      } = await authClient.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // guest checkout
    }

    // SECURITY: recompute price server-side, identical to the Stripe route.
    const priceResult = calculatePatchPrice(productName, width, height, quantity);
    if (priceResult.error) {
      return NextResponse.json({ error: priceResult.error }, { status: 400 });
    }
    const velcroAdjusted = applyVelcroPricing(priceResult.totalPrice, backing, quantity);
    const patchSubtotal = applyEconomyDiscount(velcroAdjusted, deliveryOption);
    const rushSurcharge = deliveryOption === 'rush' ? getRushSurcharge(quantity) : 0;
    const finalPrice = Math.round((patchSubtotal + rushSurcharge) * 100) / 100;

    const origin =
      req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    const baseUrl = resolveBaseUrl(origin);

    const instructionsParts = [
      specialInstructions || null,
      addons?.length ? `Add-ons: ${addons.join(', ')}` : null,
      color ? `Color/Border: ${color}` : null,
      deliveryOption === 'rush' && rushDate ? `Rush Date: ${rushDate}` : null,
      deliveryOption === 'economy' ? 'Economy Delivery (16-18 business days, 5% discount)' : null,
    ].filter(Boolean);

    // Server-side attribution signals, merged into the stored attribution. The
    // webhook reads these straight from order_data (no Stripe-style 500-char limit).
    const clientIp =
      (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '';
    const ua = req.headers.get('user-agent') || '';
    const pageUrl = req.headers.get('referer') || 'https://www.pandapatches.com';
    const mergedAttribution = {
      ...(attribution || {}),
      ...(clientIp ? { client_ip: clientIp } : {}),
      ...(ua ? { client_ua: ua } : {}),
      ...(attribution?.page_url ? {} : { page_url: pageUrl }),
    };

    // Full order payload, read back by the Square webhook to create the paid order.
    const token = randomUUID();
    const orderData = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      shipping_address: (shippingAddress || '').substring(0, 500),
      product_name: productName,
      quantity,
      backing: backing || '',
      design_size: `${width}" x ${height}"`,
      artwork_url: artworkUrl || '',
      instructions: instructionsParts.length > 0 ? instructionsParts.join(' | ') : '',
      delivery_option: deliveryOption,
      rush_date: rushDate || '',
      website_addons: addons?.length ? addons : null,
      order_amount: finalPrice,
      attribution: mergedAttribution,
      user_id: userId || '',
    };

    const { error: pendingErr } = await supabase
      .from('square_pending_orders')
      .insert({ token, order_data: orderData });
    if (pendingErr) {
      console.error('[checkout-square] square_pending_orders insert failed:', pendingErr);
      return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 });
    }

    const itemName =
      `${productName} (${width}" x ${height}") - ${quantity} pcs`.substring(0, 255);
    const redirectUrl = `${baseUrl}/success?provider=square&ref=${token}&value=${finalPrice}`;

    const { url } = await createSquarePaymentLink({
      token,
      itemName,
      amount: finalPrice,
      buyerEmail: customer.email,
      redirectUrl,
      metadata: { qty: String(quantity), product: productName.substring(0, 60) },
    });

    // Abandoned-cart tracking — mirror the Stripe route. provider_session_id = token.
    await supabase
      .from('checkout_attempts')
      .upsert(
        {
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
          payment_provider: 'square',
          provider_session_id: token,
          return_url: `${baseUrl}/custom-patches`,
          fbp: attribution?.fbp || null,
          fbc: attribution?.fbc || null,
          attribution: attribution || null,
          status: 'PENDING',
          initiated_at: new Date().toISOString(),
        },
        { onConflict: 'provider_session_id' },
      )
      .then(({ error }) => {
        if (error) console.error('checkout_attempts upsert (square):', error);
      });

    // Server CAPI InitiateCheckout (mirrors browser fbq via shared eventId).
    if (initiateCheckoutEventId) {
      const [icFirstName, ...icLastParts] = (customer.name || '').trim().split(/\s+/);
      sendMetaEvent({
        eventName: 'InitiateCheckout',
        eventId: initiateCheckoutEventId,
        actionSource: 'website',
        eventSourceUrl: pageUrl,
        email: customer.email,
        phone: customer.phone || null,
        firstName: icFirstName,
        lastName: icLastParts.join(' ') || null,
        attribution: { ...(attribution || {}), client_ip: clientIp || undefined, client_ua: ua || undefined },
        value: finalPrice,
        currency: 'USD',
        contentName: productName,
        contentCategory: 'Custom Patches',
        numItems: quantity,
        orderId: token,
      }).catch((err) => console.error('[META CAPI] InitiateCheckout (Square) send failed:', err));
    }

    return NextResponse.json({ url });
  } catch (error: unknown) {
    console.error('Square Checkout Error:', error);
    return NextResponse.json(
      {
        error: 'Payment processing failed',
        message:
          'We encountered an error processing your payment. Please try again or contact support.',
      },
      { status: 500 },
    );
  }
}
