import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { calculatePatchPrice } from '@/lib/pricingCalculator';
import { SendMailClient } from 'zeptomail';

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

    // Send branded confirmation email to customer (non-blocking)
    const zeptoToken = process.env.ZEPTOMAIL_TOKEN;
    if (zeptoToken && customer.email) {
      const LOGO = 'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/213c03ef-699b-4ff5-b568-76cbe38d40d7/1190x571.png';
      const IG_BANNER = 'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/4f0fe337-478e-473c-b6aa-baa8b6c94def/1600x406.jpg';
      const FONT = "'lucida sans unicode','lucida grande',sans-serif";
      const esc = (s: string) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const sizeLabel = `${width}" x ${height}"`;

      const mailClient = new SendMailClient({ url: 'https://api.zeptomail.com/v1.1/email', token: zeptoToken });
      mailClient.sendMail({
        from: { address: 'hello@pandapatches.com', name: 'Panda Patches' },
        to: [{ email_address: { address: customer.email, name: customer.name } }],
        subject: 'We received your quote request - Panda Patches',
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
      Thank you for reaching out to Panda Patches! We have received your quote request and our team will get back to you within <strong>2 hours</strong> with the best price.
    </p>

    <div style="background:#000000;padding:12px 20px;margin-top:28px;border-radius:4px 4px 0 0;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">Your Quote Summary</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:10px 16px;color:#666666;width:130px;background:#f9f9f9;">Patch Type</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(productName)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Size</td><td style="padding:10px 16px;color:#222222;">${esc(sizeLabel)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Quantity</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${quantity} pieces</td></tr>
      ${backing ? `<tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Backing</td><td style="padding:10px 16px;color:#222222;">${esc(backing)}</td></tr>` : ''}
    </table>

    <div style="margin-top:28px;padding:20px 24px;background:#f9f9f9;border-left:4px solid #fb6e1d;border-radius:0 4px 4px 0;">
      <p style="margin:0 0 10px;font-weight:bold;color:#222222;font-size:14px;">What happens next?</p>
      <p style="margin:0;color:#444444;font-size:14px;line-height:1.8;">
        1. Our team reviews your request within 2 hours.<br>
        2. We send you a detailed quote at <strong>${esc(customer.email)}</strong>.<br>
        3. You approve and we create your free design mockup.<br>
        4. Your patches ship with full tracking to your door.
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
      }).catch(e => console.error('Lead confirmation email error:', e));
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
