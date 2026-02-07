import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Request Size Limit Configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Prevent DoS via large payloads
    },
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define Validation Schema
const QuoteSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^[\d\s\-()+ ]+$/, 'Invalid phone number format').optional().or(z.literal('')),
  }),
  details: z.object({
    width: z.number().positive('Width must be positive').min(0.5, 'Minimum width is 0.5 inches').max(50, 'Maximum width is 50 inches'),
    height: z.number().positive('Height must be positive').min(0.5, 'Minimum height is 0.5 inches').max(50, 'Maximum height is 50 inches'),
    quantity: z.number().int('Quantity must be an integer').min(1, 'Minimum quantity is 1').max(10000, 'Quantity too high'),
    backing: z.enum(['iron', 'sew', 'velcro', 'peel'], {
      errorMap: () => ({ message: 'Invalid backing type' })
    }),
    placement: z.string().min(1, 'Placement is required').max(200, 'Placement description too long')
  }),
  artworkUrl: z.string().url().optional().or(z.null())
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validationResult = QuoteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    const { customer, details, artworkUrl } = validationResult.data;

    // Map Website Form Data -> CRM 'quotes' Table Columns
    const { error } = await supabase
      .from('quotes')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,

        // Combine details into description or mapped fields
        patches_type: 'Custom Patch',        // Patch type from website
        design_backing: details.backing,
        patches_quantity: details.quantity,
        design_size: `${details.width}" x ${details.height}"`,
        artwork_url: artworkUrl,

        // Required CRM fields
        sales_agent: 'WEBSITE_BOT',
        lead_source: 'WEBSITE_FORM'
      });

    if (error) {
        console.error("Supabase Quote Error:", error);
        return NextResponse.json(
          { error: 'Failed to submit quote request. Please try again.' },
          { status: 500 }
        );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    // Log detailed error server-side
    console.error('Quote Submission Error:', error);

    // Return generic error to client (don't expose internal details)
    return NextResponse.json(
      {
        error: 'Quote submission failed',
        message: 'We encountered an error submitting your quote. Please try again or contact support.'
      },
      { status: 500 }
    );
  }
}
