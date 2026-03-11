import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { SendMailClient } from 'zeptomail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const QuoteSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().regex(/^[\d\s\-()+ ]+$/, 'Invalid phone number format').optional().or(z.literal('')),
  }),
  details: z.object({
    width: z.number().min(0).max(50),
    height: z.number().min(0).max(50),
    quantity: z.number().int().min(1).max(100000),
    backing: z.string().min(1).max(50),
    placement: z.string().max(200).optional().or(z.literal('')),
    instructions: z.string().max(2000).optional().or(z.literal('')),
    patchType: z.string().max(100).optional().or(z.literal('')),
  }),
  artworkUrl: z.string().url().optional().or(z.null()),
  isBulkOrder: z.boolean().optional(),
  pageUrl: z.string().max(500).optional().or(z.literal('')),
  basePrice: z.number().min(0).optional(),
});

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot check — bots fill this, real users don't
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const validationResult = QuoteSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('Quote validation failed:', validationResult.error.issues);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { customer, details, artworkUrl, isBulkOrder, pageUrl, basePrice } = validationResult.data;

    const sizeLabel = details.width > 0 ? `${details.width}" x ${details.height}"` : 'Custom / See instructions';
    const subject = isBulkOrder
      ? `New Bulk Quote Request from ${customer.name}`
      : `New Quote Request from ${customer.name}`;

    // Send email via ZeptoMail (primary delivery)
    const token = process.env.ZEPTOMAIL_TOKEN;
    if (token) {
      try {
        const mailClient = new SendMailClient({
          url: 'https://api.zeptomail.com/v1.1/email',
          token,
        });

        await mailClient.sendMail({
          from: { address: 'hello@pandapatches.com', name: 'Panda Patches Website' },
          to: [{ email_address: { address: 'lance@pandapatches.com', name: 'Lance' } }],
          reply_to: [{ address: customer.email, name: customer.name }],
          subject,
          htmlbody: `
            <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
              <h2 style="color: #1a1a1a; border-bottom: 3px solid #f5c518; padding-bottom: 10px;">
                ${isBulkOrder ? 'Bulk Quote Request' : 'Quote Request'} — Panda Patches
              </h2>
              <table style="width:100%; border-collapse:collapse; font-size:14px;">
                <tr><td style="padding:8px 0; font-weight:bold; color:#555; width:140px;">Name:</td><td style="padding:8px 0;">${esc(customer.name)}</td></tr>
                <tr><td style="padding:8px 0; font-weight:bold; color:#555;">Email:</td><td style="padding:8px 0;"><a href="mailto:${esc(customer.email)}">${esc(customer.email)}</a></td></tr>
                <tr><td style="padding:8px 0; font-weight:bold; color:#555;">Phone:</td><td style="padding:8px 0;">${esc(customer.phone || 'Not provided')}</td></tr>
                <tr><td colspan="2" style="padding:16px 0 4px; font-weight:bold; color:#1a1a1a; font-size:15px; border-top:1px solid #eee;">Order Details</td></tr>
                <tr><td style="padding:8px 0; font-weight:bold; color:#555;">Patch Type:</td><td style="padding:8px 0;">${esc(details.patchType || 'Not specified')}</td></tr>
                <tr><td style="padding:8px 0; font-weight:bold; color:#555;">Size:</td><td style="padding:8px 0;">${esc(sizeLabel)}</td></tr>
                <tr><td style="padding:8px 0; font-weight:bold; color:#555;">Quantity:</td><td style="padding:8px 0;">${details.quantity} pcs</td></tr>
                <tr><td style="padding:8px 0; font-weight:bold; color:#555;">Backing:</td><td style="padding:8px 0;">${esc(details.backing)}</td></tr>
                ${details.instructions ? `<tr><td style="padding:8px 0; font-weight:bold; color:#555; vertical-align:top;">Instructions:</td><td style="padding:8px 0; white-space:pre-wrap;">${esc(details.instructions)}</td></tr>` : ''}
                ${artworkUrl ? `<tr><td style="padding:8px 0; font-weight:bold; color:#555;">Artwork:</td><td style="padding:8px 0;"><a href="${artworkUrl}">View Uploaded Artwork</a></td></tr>` : ''}
                ${pageUrl ? `<tr><td style="padding:8px 0; font-weight:bold; color:#555;">Page:</td><td style="padding:8px 0;"><a href="${esc(pageUrl)}">${esc(pageUrl)}</a></td></tr>` : ''}
                <tr><td style="padding:8px 0; font-weight:bold; color:#555;">Source:</td><td style="padding:8px 0;">${isBulkOrder ? 'Bulk Order Form' : 'Website Quote Form'}</td></tr>
              </table>
            </div>
          `,
        });
        // Customer confirmation email — only send if we have a price (ComplexCalculator quotes)
        // Home page / bulk form quotes stay in portal for team to price manually before emailing customer
        if (basePrice != null) try {
          await mailClient.sendMail({
            from: { address: 'hello@pandapatches.com', name: 'Panda Patches' },
            to: [{ email_address: { address: customer.email, name: customer.name } }],
            subject: 'Your Quote Request - Panda Patches',
            htmlbody: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
                <div style="background: #000; padding: 28px 32px; text-align: center;">
                  <h1 style="color: #f5c518; margin: 0; font-size: 24px; letter-spacing: 2px;">PANDA PATCHES</h1>
                </div>
                <div style="padding: 32px;">
                  <h2 style="color: #1a1a1a; margin-top: 0;">We received your quote request!</h2>
                  <p style="color: #555; font-size: 15px; line-height: 1.6;">
                    Hi ${esc(customer.name)}, thanks for reaching out. Our team will review your request and get back to you within <strong>2 hours</strong> with the best price.
                  </p>

                  <div style="background: #f9f9f9; border: 1px solid #eee; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0 0 12px; font-weight: bold; color: #1a1a1a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Quote Summary</p>
                    <table style="width:100%; border-collapse:collapse; font-size:14px;">
                      <tr><td style="padding:6px 0; color:#888; width:130px;">Patch Type:</td><td style="padding:6px 0; font-weight:600; color:#1a1a1a;">${esc(details.patchType || 'Custom Patch')}</td></tr>
                      <tr><td style="padding:6px 0; color:#888;">Size:</td><td style="padding:6px 0; font-weight:600; color:#1a1a1a;">${esc(sizeLabel)}</td></tr>
                      <tr><td style="padding:6px 0; color:#888;">Quantity:</td><td style="padding:6px 0; font-weight:600; color:#1a1a1a;">${details.quantity} pcs</td></tr>
                      <tr><td style="padding:6px 0; color:#888;">Backing:</td><td style="padding:6px 0; font-weight:600; color:#1a1a1a;">${esc(details.backing)}</td></tr>
                      ${basePrice != null ? `<tr><td style="padding:6px 0; color:#888;">Est. Price:</td><td style="padding:6px 0; font-weight:800; color:#1a1a1a; font-size:16px;">$${basePrice.toFixed(2)}</td></tr>` : ''}
                    </table>
                  </div>

                  <p style="color:#555; font-size:14px; line-height:1.6;">
                    Have a question? Just reply to this email or call us at <a href="tel:+13022504340" style="color:#000; font-weight:bold;">(302) 250-4340</a>.
                  </p>

                  <div style="text-align:center; margin-top:28px;">
                    <a href="https://pandapatches.com" style="background:#000; color:#f5c518; text-decoration:none; padding:14px 32px; border-radius:8px; font-weight:bold; font-size:14px; letter-spacing:1px; display:inline-block;">VISIT PANDA PATCHES</a>
                  </div>
                </div>
                <div style="background:#f5f5f5; padding:16px 32px; text-align:center; font-size:12px; color:#aaa;">
                  Panda Patches | pandapatches.com | (302) 250-4340
                </div>
              </div>
            `,
          });
        } catch (custEmailErr) {
          console.error('Customer confirmation email error:', custEmailErr);
        }
      } catch (emailErr) {
        console.error('ZeptoMail send error:', emailErr);
        // Fall through — still try Supabase below
      }
    }

    // Try Supabase insert (non-blocking — log if fails, never block the response)
    const { error: dbError } = await supabase
      .from('quotes')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        patches_type: details.patchType || 'Custom Patch',
        design_backing: details.backing,
        patches_quantity: details.quantity,
        design_size: sizeLabel,
        instructions: details.instructions || details.placement || '',
        customer_attachment_urls: artworkUrl ? [artworkUrl] : [],
        sales_agent: 'WEBSITE_BOT',
        lead_source: isBulkOrder ? 'BULK_ORDER_FORM' : 'WEBSITE_FORM',
        page_url: pageUrl || null,
        quote_amount: basePrice ?? null,
        email_sent_at: (token && basePrice != null) ? new Date().toISOString() : null,
      });

    if (dbError) {
      console.error('Supabase quotes insert error (non-blocking):', dbError);
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Quote submission failed. Please try again or call us at (302) 250-4340.' },
      { status: 500 }
    );
  }
}
