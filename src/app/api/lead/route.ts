import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { calculatePatchPrice } from '@/lib/pricingCalculator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LeadSchema = z.object({
  productName: z.string().min(1).max(100),
  quantity: z.number().int().min(1).max(10000),
  backing: z.string().max(100).optional().or(z.literal('')),
  color: z.string().max(100).optional().or(z.null()).or(z.literal('')),
  width: z.number().positive().min(0.5).max(50),
  height: z.number().positive().min(0.5).max(50),
  shape: z.string().max(50).optional().or(z.null()),
  customer: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().optional().or(z.literal('')),
  }),
  shippingAddress: z.string().optional().or(z.literal('')),
  artworkUrl: z.string().url().optional().or(z.null()).or(z.literal('')),
  patchIdea: z.string().max(500).optional().or(z.null()).or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = LeadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const { productName, quantity, backing, color, width, height, shape, customer, shippingAddress, artworkUrl, patchIdea } = result.data;

    const instructionsParts = [
      shippingAddress ? `Shipping: ${shippingAddress}` : null,
      color ? `Color/Border: ${color}` : null,
      shape ? `Shape: ${shape}` : null,
      patchIdea ? `Patch Idea: ${patchIdea}` : null,
    ].filter(Boolean);

    // Insert into quotes table (shows in Quotes section of portal)
    const { error: dbError } = await supabase
      .from('quotes')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || '',
        patches_type: productName,
        design_backing: backing || 'Not specified',
        patches_quantity: quantity,
        design_size: `${width}" x ${height}"`,
        instructions: instructionsParts.length > 0 ? instructionsParts.join(' | ') : '',
        customer_attachment_urls: artworkUrl ? [artworkUrl] : [],
        sales_agent: 'WEBSITE_BOT',
        lead_source: 'WEBSITE_LEAD',
      });

    if (dbError) {
      console.error('Lead creation error:', dbError);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE: Remove quote when customer proceeds to checkout (avoids duplicate)
export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false }, { status: 400 });

    // Delete the most recent WEBSITE_LEAD quote for this email
    await supabase
      .from('quotes')
      .delete()
      .eq('customer_email', email)
      .eq('lead_source', 'WEBSITE_LEAD')
      .order('created_at', { ascending: false })
      .limit(1);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
