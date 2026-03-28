import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { lookupOfferPrice, calculateOfferTotal, OFFER_CATEGORIES } from '@/lib/offerPackages';
import { resolveBaseUrl } from '@/lib/checkoutConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const Schema = z.object({
  categoryId: z.string().min(1).max(50),
  packName: z.string().min(1).max(50),
  backing: z.string().min(1).max(50),
  delivery: z.enum(['economy', 'standard', 'rush']),
  upgrades: z.array(z.string().max(50)).optional().default([]),
  customer: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[\d\s\-()+]+$/).optional().or(z.literal('')),
  }),
  shippingAddress: z.string().max(500).optional().or(z.literal('')),
  width: z.number().min(0.5).max(50).optional().default(3),
  height: z.number().min(0.5).max(50).optional().default(3),
  artworkUrl: z.string().url().optional().or(z.null()).or(z.literal('')),
  designDescription: z.string().max(2000).optional().or(z.literal('')),
  specialInstructions: z.string().max(500).optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  paymentMethod: z.enum(['card', 'applepay', 'afterpay', 'klarna', 'cashapp']).optional().default('card'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = Schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 });
    }

    const {
      categoryId, packName, backing, delivery, upgrades,
      customer, shippingAddress, width, height,
      artworkUrl, designDescription, specialInstructions, company, paymentMethod
    } = result.data;

    // Server-side price lookup prevents manipulation
    const offer = lookupOfferPrice(categoryId, packName);
    if (!offer) {
      return NextResponse.json({ error: 'Invalid offer selection' }, { status: 400 });
    }

    const { basePrice, qty, categoryType } = offer;
    const finalPrice = calculateOfferTotal(basePrice, qty, backing, delivery, upgrades ?? []);

    const cat = OFFER_CATEGORIES.find(c => c.id === categoryId);
    const productName = `${cat?.type ?? categoryType} — ${packName} Pack (${qty} pcs)`;

    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    const baseUrl = resolveBaseUrl(origin);

    const instructionsParts = [
      designDescription ? `Design: ${designDescription}` : null,
      specialInstructions ? `Instructions: ${specialInstructions}` : null,
      company ? `Company: ${company}` : null,
      upgrades?.length ? `Upgrades: ${upgrades.join(', ')}` : null,
      delivery === 'economy' ? 'Economy Delivery (16-18 business days, 10% discount)' : null,
      delivery === 'rush' ? 'Rush Delivery requested' : null,
    ].filter(Boolean);

    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
      paymentMethod === 'cashapp' ? ['cashapp']
      : paymentMethod === 'afterpay' ? ['afterpay_clearpay']
      : paymentMethod === 'klarna' ? ['klarna']
      : ['card'];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: `Backing: ${backing} | Delivery: ${delivery} | Size: ${width}" x ${height}"`,
          },
          unit_amount: Math.round(finalPrice * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&value=${finalPrice.toFixed(2)}`,
      cancel_url: `${baseUrl}/offers`,
      customer_email: customer.email,
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || '',
        shipping_address: (shippingAddress || '').substring(0, 500),
        product_name: productName,
        quantity: String(qty),
        backing,
        design_size: `${width}" x ${height}"`,
        artwork_url: artworkUrl || '',
        instructions: instructionsParts.join(' | ').substring(0, 500),
        delivery_option: delivery,
        website_addons: upgrades?.join(', ') || '',
        order_amount: String(finalPrice),
        order_source: 'OFFERS_PAGE',
      },
    });

    // Save order to Supabase (non-blocking)
    supabase.from('orders').insert({
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      shipping_address: shippingAddress || '',
      design_name: productName,
      patches_type: cat?.type ?? categoryType,
      patches_quantity: qty,
      design_backing: backing,
      design_size: `${width}" x ${height}"`,
      customer_attachment_urls: artworkUrl ? [artworkUrl] : [],
      instructions: instructionsParts.join(' | '),
      delivery_option: delivery,
      website_addons: upgrades || null,
      order_amount: finalPrice,
      status: 'PENDING',
      payment_status: 'pending',
      lead_source: 'OFFERS_PAGE',
      sales_agent: 'WEBSITE_BOT',
      stripe_session_id: session.id,
    }).then(({ error }) => {
      if (error) console.error('Supabase insert error (non-blocking):', error);
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Offers checkout error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
