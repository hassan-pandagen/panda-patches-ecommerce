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
  artworkUrl2: z.string().url().optional().or(z.null()),
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

    const { customer, details, artworkUrl, artworkUrl2, isBulkOrder, pageUrl, basePrice } = validationResult.data;

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

        const LOGO = 'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/213c03ef-699b-4ff5-b568-76cbe38d40d7/1190x571.png';
        const IG_BANNER = 'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/4f0fe337-478e-473c-b6aa-baa8b6c94def/1600x406.jpg';
        const FONT = "'lucida sans unicode','lucida grande',sans-serif";

        await mailClient.sendMail({
          from: { address: 'hello@pandapatches.com', name: 'Panda Patches Website' },
          to: [{ email_address: { address: 'lance@pandapatches.com', name: 'Lance' } }],
          reply_to: [{ address: customer.email, name: customer.name }],
          subject,
          htmlbody: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:640px;margin:0 auto;font-family:${FONT};">
  <div style="background:#000;padding:20px 32px;text-align:center;">
    <img src="${LOGO}" alt="Panda Patches" width="200" style="display:block;margin:0 auto;">
    <p style="color:#aaa;margin:10px 0 0;font-size:13px;letter-spacing:2px;">${isBulkOrder ? 'BULK QUOTE REQUEST' : 'NEW QUOTE REQUEST'}</p>
  </div>
  <div style="background:#fff;padding:28px 32px;">
    <div style="background:#000;padding:12px 18px;border-radius:4px 4px 0 0;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Customer Information</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:9px 14px;color:#666;width:140px;background:#fafafa;">Name</td><td style="padding:9px 14px;font-weight:600;color:#fb6e1d;">${esc(customer.name)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Email</td><td style="padding:9px 14px;"><a href="mailto:${esc(customer.email)}" style="color:#333;">${esc(customer.email)}</a></td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Phone</td><td style="padding:9px 14px;">${esc(customer.phone || 'Not provided')}</td></tr>
    </table>
    <div style="background:#000;padding:12px 18px;border-radius:4px 4px 0 0;margin-top:20px;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Quote Details</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:9px 14px;color:#666;width:140px;background:#fafafa;">Patch Type</td><td style="padding:9px 14px;font-weight:600;">${esc(details.patchType || 'Not specified')}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Size</td><td style="padding:9px 14px;">${esc(sizeLabel)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Quantity</td><td style="padding:9px 14px;font-weight:600;">${details.quantity} pcs</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Backing</td><td style="padding:9px 14px;">${esc(details.backing)}</td></tr>
      ${details.instructions ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;vertical-align:top;">Instructions</td><td style="padding:9px 14px;white-space:pre-wrap;">${esc(details.instructions)}</td></tr>` : ''}
      ${artworkUrl ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Artwork 1</td><td style="padding:9px 14px;"><a href="${artworkUrl}" style="color:#fb6e1d;font-weight:600;">View File</a></td></tr>` : ''}
      ${artworkUrl2 ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Artwork 2</td><td style="padding:9px 14px;"><a href="${artworkUrl2}" style="color:#fb6e1d;font-weight:600;">View File</a></td></tr>` : ''}
      ${pageUrl ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Page</td><td style="padding:9px 14px;"><a href="${esc(pageUrl)}" style="color:#333;">${esc(pageUrl)}</a></td></tr>` : ''}
      ${basePrice != null ? `<tr style="background:#000;"><td style="padding:12px 14px;color:#aaa;font-size:13px;">Est. Price</td><td style="padding:12px 14px;color:#dcff70;font-size:22px;font-weight:900;">$${basePrice.toFixed(2)}</td></tr>` : ''}
    </table>
  </div>
  <div style="background:#000;padding:14px 32px;text-align:center;">
    <hr style="border:none;border-top:1px solid #b8975a;margin:0 0 12px;">
    <p style="color:#aaa;font-size:12px;margin:0;">Panda Patches | pandapatches.com | (302) 250-4340</p>
  </div>
</div>
</body></html>`,
        });

        // Customer confirmation — always send so every lead gets a branded reply
        try {
          await mailClient.sendMail({
            from: { address: 'hello@pandapatches.com', name: 'Panda Patches' },
            to: [{ email_address: { address: customer.email, name: customer.name } }],
            subject: basePrice != null ? `Your Price Quote — Panda Patches` : 'We received your quote request - Panda Patches',
            htmlbody: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:620px;margin:0 auto;font-family:${FONT};">
  <div style="background:#000000;padding:24px 32px;text-align:center;">
    <img src="${LOGO}" alt="Panda Patches" width="220" style="display:block;margin:0 auto;">
  </div>
  <div style="background:#ffffff;padding:32px 32px 24px;">
    <p style="font-size:15px;color:#333333;margin-top:0;line-height:1.6;">
      Hello <strong style="color:#fb6e1d;">${esc(customer.name)}</strong>,
    </p>
    <p style="font-size:15px;color:#333333;line-height:1.6;">
      ${basePrice != null
        ? `Here is your price quote for your custom patches order. Ready to place your order? Simply reply to this email or visit our website to complete checkout.`
        : `Thank you for reaching out! We have received your quote request and our team will get back to you within <strong>2 hours</strong> with the best price.`
      }
    </p>

    <div style="background:#000000;padding:12px 20px;margin-top:28px;border-radius:4px 4px 0 0;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">Your Quote Summary</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:10px 16px;color:#666666;width:130px;background:#f9f9f9;">Patch Type</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(details.patchType || 'Custom Patch')}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Size</td><td style="padding:10px 16px;color:#222222;">${esc(sizeLabel)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Quantity</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${details.quantity} pieces</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Backing</td><td style="padding:10px 16px;color:#222222;">${esc(details.backing)}</td></tr>
      ${basePrice != null ? `<tr style="background:#000000;"><td style="padding:12px 16px;color:#aaaaaa;font-size:13px;">Est. Price</td><td style="padding:12px 16px;color:#dcff70;font-size:22px;font-weight:900;">$${basePrice.toFixed(2)}</td></tr>` : ''}
    </table>

    <div style="margin-top:28px;padding:20px 24px;background:#f9f9f9;border-left:4px solid #fb6e1d;border-radius:0 4px 4px 0;">
      <p style="margin:0 0 10px;font-weight:bold;color:#222222;font-size:14px;">What happens next?</p>
      <p style="margin:0;color:#444444;font-size:14px;line-height:1.8;">
        ${basePrice != null
          ? `1. Reply to this email or call us to confirm your order.<br>
        2. Our design team sends your digital mockup within 24 hours.<br>
        3. You approve it — free unlimited changes until you're happy.<br>
        4. Your patches ship with full tracking to your door.`
          : `1. Our team reviews your request within 2 hours.<br>
        2. We send you a detailed quote at <strong>${esc(customer.email)}</strong>.<br>
        3. You approve and we begin production.<br>
        4. Your patches ship with full tracking to your door.`
        }
      </p>
    </div>

    <p style="color:#555555;font-size:14px;margin-top:24px;line-height:1.6;">
      Questions? Simply reply to this email or call us at <a href="tel:+13022504340" style="color:#fb6e1d;font-weight:bold;">(302) 250-4340</a>.
    </p>
    <p style="color:#333333;font-size:14px;margin-bottom:0;">
      Warm regards,<br>
      <strong>The Panda Patches Team</strong>
    </p>
  </div>

  <div style="background:#ffffff;padding:0 32px 24px;">
    <a href="https://www.instagram.com/pandapatches/" target="_blank">
      <img src="${IG_BANNER}" alt="Follow Panda Patches on Instagram" width="556" style="display:block;width:100%;border-radius:4px;">
    </a>
  </div>

  <div style="background:#000000;padding:20px 32px;text-align:center;">
    <hr style="border:none;border-top:1px solid #b8975a;margin:0 0 16px;">
    <p style="color:#ffffff;font-size:12px;margin:0 0 6px;letter-spacing:1px;">PANDA PATCHES</p>
    <p style="color:#aaaaaa;font-size:11px;margin:0;">1914 Quail Feather Ct, Missouri City, TX 77489</p>
    <p style="color:#aaaaaa;font-size:11px;margin:4px 0 0;">(302) 250-4340 | <a href="https://pandapatches.com" style="color:#aaaaaa;">pandapatches.com</a></p>
  </div>
</div>
</body></html>`,
          });
        } catch (custEmailErr) {
          console.error('Customer quote confirmation email error:', custEmailErr);
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
        customer_attachment_urls: [artworkUrl, artworkUrl2].filter(Boolean) as string[],
        sales_agent: 'WEBSITE_BOT',
        lead_source: isBulkOrder ? 'BULK_ORDER_FORM' : 'WEBSITE_FORM',
        page_url: pageUrl || null,
        quote_amount: basePrice ?? null,
        email_sent_at: token ? new Date().toISOString() : null,
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
