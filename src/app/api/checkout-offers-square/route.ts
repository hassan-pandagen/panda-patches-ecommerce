import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { lookupOfferPrice, calculateOfferTotal, OFFER_CATEGORIES } from '@/lib/offerPackages';
import { resolveBaseUrl } from '@/lib/checkoutConfig';
import { createSquarePaymentLink } from '@/lib/square';
import { sendMetaEvent } from '@/lib/metaCapi';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Mirrors the Stripe offers schema.
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
  attribution: z.any().optional(),
  initiateCheckoutEventId: z.string().max(120).optional(),
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
      artworkUrl, designDescription, specialInstructions, company,
      attribution, initiateCheckoutEventId,
    } = result.data;

    // SECURITY: server-side price lookup prevents manipulation.
    const offer = lookupOfferPrice(categoryId, packName);
    if (!offer) {
      return NextResponse.json({ error: 'Invalid offer selection' }, { status: 400 });
    }
    const { basePrice, qty, categoryType } = offer;
    let finalPrice = calculateOfferTotal(basePrice, qty, backing, delivery, upgrades ?? []);

    // TEMP (Square go-live test) — REMOVE after the live test order is confirmed.
    // Same $5 test-email override as checkout-square. Grep SQUARE_TEST_EMAILS.
    const SQUARE_TEST_EMAILS = ['hassanjamal5004@gmail.com'];
    if (SQUARE_TEST_EMAILS.includes(customer.email.trim().toLowerCase())) {
      finalPrice = 5.0;
    }

    const cat = OFFER_CATEGORIES.find((c) => c.id === categoryId);
    const productName = `${cat?.type ?? categoryType} - ${packName} Pack (${qty} pcs)`;

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

    const clientIp =
      (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '';
    const ua = req.headers.get('user-agent') || '';
    const pageUrl = req.headers.get('referer') || 'https://www.pandapatches.com/offers';
    const mergedAttribution = {
      ...(attribution || {}),
      ...(clientIp ? { client_ip: clientIp } : {}),
      ...(ua ? { client_ua: ua } : {}),
      ...(attribution?.page_url ? {} : { page_url: pageUrl }),
    };

    // Offers-tagged order payload. The shared Square webhook reads lead_source /
    // sales_agent / order_source from here so an offers order is labelled correctly.
    const token = randomUUID();
    const orderData = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      shipping_address: (shippingAddress || '').substring(0, 500),
      product_name: productName,
      quantity: qty,
      backing,
      design_size: `${width}" x ${height}"`,
      artwork_url: artworkUrl || '',
      instructions: instructionsParts.length > 0 ? instructionsParts.join(' | ') : '',
      delivery_option: delivery,
      rush_date: '',
      website_addons: upgrades?.length ? upgrades : null,
      order_amount: finalPrice,
      attribution: mergedAttribution,
      user_id: '',
      lead_source: 'OFFERS_PAGE',
      sales_agent: 'WEBSITE_BOT',
      order_source: 'OFFERS_PAGE',
    };

    const { error: pendingErr } = await supabase
      .from('square_pending_orders')
      .insert({ token, order_data: orderData });
    if (pendingErr) {
      console.error('[checkout-offers-square] square_pending_orders insert failed:', pendingErr);
      return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 });
    }

    const redirectUrl = `${baseUrl}/success?provider=square&ref=${token}&value=${finalPrice.toFixed(2)}`;

    const { url } = await createSquarePaymentLink({
      token,
      itemName: productName.substring(0, 255),
      amount: finalPrice,
      buyerEmail: customer.email,
      redirectUrl,
      metadata: { offer: categoryId.substring(0, 40), pack: packName.substring(0, 30) },
    });

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
        numItems: qty,
        orderId: token,
      }).catch((err) => console.error('[META CAPI] InitiateCheckout (Offers Square) send failed:', err));
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Offers Square checkout error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
