import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { lookupOfferPrice, calculateOfferTotal, OFFER_CATEGORIES } from '@/lib/offerPackages';
import { PayPalClient } from '@/lib/paypal';
import { resolveBaseUrl } from '@/lib/checkoutConfig';

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
      artworkUrl, designDescription, specialInstructions, company
    } = result.data;

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

    const orderData = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      shipping_address: shippingAddress || '',
      product_name: productName,
      quantity: qty,
      backing,
      design_size: `${width}" x ${height}"`,
      artwork_url: artworkUrl || '',
      instructions: instructionsParts.join(' | '),
      delivery_option: delivery,
      website_addons: upgrades || null,
      order_amount: finalPrice,
    };

    const paypalClient = new PayPalClient();
    const paypalOrder = await paypalClient.createOrder({
      amount: finalPrice.toFixed(2),
      currency: 'USD',
      description: productName,
      orderId: 'pending',
      returnUrl: `${baseUrl}/success-paypal`,
      cancelUrl: `${baseUrl}/offers`,
    });

    const approvalUrl = paypalOrder.links?.find(
      (link: any) => link.rel === 'payer-action' || link.rel === 'approve'
    )?.href;

    if (!approvalUrl) {
      return NextResponse.json({ error: 'Failed to get PayPal approval URL' }, { status: 500 });
    }

    await supabase
      .from('paypal_pending_orders')
      .upsert({ paypal_order_id: paypalOrder.id, order_data: orderData }, { onConflict: 'paypal_order_id' });

    return NextResponse.json({ url: approvalUrl, paypalOrderId: paypalOrder.id, orderData });
  } catch (error) {
    console.error('Offers PayPal checkout error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
