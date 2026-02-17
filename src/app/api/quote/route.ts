import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Regular quote schema (from homepage form)
const QuoteSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().regex(/^[\d\s\-()+ ]+$/, 'Invalid phone number format').optional().or(z.literal('')),
  }),
  details: z.object({
    width: z.number().positive().min(0.5).max(50),
    height: z.number().positive().min(0.5).max(50),
    quantity: z.number().int().min(1).max(100000),
    backing: z.string().min(1).max(50),
    placement: z.string().max(200).optional().or(z.literal('')),
    instructions: z.string().max(2000).optional().or(z.literal('')),
    patchType: z.string().max(100).optional().or(z.literal('')),
  }),
  artworkUrl: z.string().url().optional().or(z.null()),
  isBulkOrder: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validationResult = QuoteSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('Quote validation failed:', validationResult.error.issues);
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

    const { customer, details, artworkUrl, isBulkOrder } = validationResult.data;

    // Map Website Form Data -> CRM 'quotes' Table Columns
    const { error } = await supabase
      .from('quotes')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,

        patches_type: details.patchType || 'Custom Patch',
        design_backing: details.backing,
        patches_quantity: details.quantity,
        design_size: `${details.width}" x ${details.height}"`,
        artwork_url: artworkUrl,
        special_instructions: details.instructions || details.placement || '',

        // Required CRM fields
        sales_agent: 'WEBSITE_BOT',
        lead_source: isBulkOrder ? 'BULK_ORDER_FORM' : 'WEBSITE_FORM',
      });

    if (error) {
        console.error("Supabase Quote Error:", error);
        return NextResponse.json(
          { error: 'Failed to submit quote request. Please try again.' },
          { status: 500 }
        );
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('Quote Submission Error:', error);

    return NextResponse.json(
      {
        error: 'Quote submission failed',
        message: 'We encountered an error submitting your quote. Please try again or contact support.'
      },
      { status: 500 }
    );
  }
}
