import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { resolveBaseUrl } from '@/lib/checkoutConfig';
import { createSquarePaymentLink } from '@/lib/square';

export const runtime = 'nodejs';

// Service-role client for the square_pending_orders insert (RLS, server-only).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const sampleBoxSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }).max(200),
  email: z.string().email({ message: 'Invalid email address' }),
  contactNumber: z.string().min(1, { message: 'Contact number is required' }).max(30),
  shippingAddress: z.string().optional(),
});

const SAMPLE_BOX_PRICE = 45.0;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot — bots fill this, real users don't.
    if (body.website) {
      return NextResponse.json({ success: true, checkoutUrl: null });
    }

    const validationResult = sampleBoxSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }
    const data = validationResult.data;

    // Gibberish-name guard (same heuristic as /api/quote and signup).
    const word = data.fullName.trim().split(/\s+/)[0];
    if (
      word.length >= 6 &&
      /[bcdfghjklmnpqrstvwxyz]{4,}/i.test(word) &&
      /[a-z]/.test(word) &&
      /[A-Z]/.test(word.slice(1))
    ) {
      return NextResponse.json({ success: true, checkoutUrl: null });
    }

    const baseUrl = resolveBaseUrl(request.headers.get('origin'));

    // The sample box becomes a regular Square order tagged SAMPLE_BOX. The shared
    // Square webhook creates it on payment (in orders) and labels it via order_source.
    const token = randomUUID();
    const orderData = {
      customer_name: data.fullName,
      customer_email: data.email,
      customer_phone: data.contactNumber,
      shipping_address: (data.shippingAddress || '').substring(0, 500),
      product_name: 'Sample Box',
      quantity: 1,
      backing: '',
      design_size: 'N/A',
      artwork_url: '',
      instructions: 'Custom patch sample box (setup + shipping included)',
      delivery_option: 'standard',
      rush_date: '',
      website_addons: null,
      order_amount: SAMPLE_BOX_PRICE,
      attribution: { source: 'sample_box' },
      user_id: '',
      lead_source: 'SAMPLE_BOX',
      sales_agent: 'WEBSITE_BOT',
      order_source: 'SAMPLE_BOX',
    };

    const { error: pendingErr } = await supabase
      .from('square_pending_orders')
      .insert({ token, order_data: orderData });
    if (pendingErr) {
      console.error('[sample-box] square_pending_orders insert failed:', pendingErr);
      return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 });
    }

    const { url } = await createSquarePaymentLink({
      token,
      itemName: 'Sample Box - Custom Patch Samples',
      amount: SAMPLE_BOX_PRICE,
      buyerEmail: data.email,
      redirectUrl: `${baseUrl}/success?provider=square&ref=${token}&value=${SAMPLE_BOX_PRICE}`,
      metadata: { type: 'sample_box' },
    });

    return NextResponse.json({ success: true, checkoutUrl: url });
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
