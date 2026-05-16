import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SendMailClient } from 'zeptomail';

const PartnerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  businessEmail: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().regex(/^[\d\s\-()+ ]+$/, 'Invalid phone number format').min(7, 'Phone too short').max(30, 'Phone too long'),
  businessName: z.string().min(2, 'Business name required').max(150, 'Business name too long'),
  businessWebsite: z.string().max(200).optional().or(z.literal('')),
  productsInterest: z.string().max(1000).optional().or(z.literal('')),
  monthlyVolume: z.string().max(50).optional().or(z.literal('')),
  hearAboutUs: z.string().max(50).optional().or(z.literal('')),
  website: z.string().max(200).optional().or(z.literal('')), // honeypot
  pageUrl: z.string().max(500).optional().or(z.literal('')),
});

function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot — bots fill this, real users don't
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const validation = PartnerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
        { status: 400 }
      );
    }

    const {
      fullName,
      businessEmail,
      phone,
      businessName,
      businessWebsite,
      productsInterest,
      monthlyVolume,
      hearAboutUs,
      pageUrl,
    } = validation.data;

    const token = process.env.ZEPTOMAIL_TOKEN;
    if (!token) {
      console.error('Partner route: ZEPTOMAIL_TOKEN missing');
      return NextResponse.json({ error: 'Email service unavailable' }, { status: 500 });
    }

    const mailClient = new SendMailClient({
      url: 'https://api.zeptomail.com/v1.1/email',
      token,
    });

    const LOGO = 'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/213c03ef-699b-4ff5-b568-76cbe38d40d7/1190x571.png';
    const FONT = "'lucida sans unicode','lucida grande',sans-serif";

    await mailClient.sendMail({
      from: { address: 'hello@pandapatches.com', name: 'Panda Patches Partner Program' },
      to: [{ email_address: { address: 'lance@pandapatches.com', name: 'Lance' } }],
      reply_to: [{ address: businessEmail, name: fullName }],
      subject: `[PARTNER APPLICATION] ${businessName} - ${fullName}`,
      htmlbody: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:640px;margin:0 auto;font-family:${FONT};">
  <div style="background:#000;padding:20px 32px;text-align:center;">
    <img src="${LOGO}" alt="Panda Patches" width="200" style="display:block;margin:0 auto;">
    <p style="color:#dcff70;margin:10px 0 0;font-size:13px;letter-spacing:2px;font-weight:bold;">NEW PARTNER APPLICATION</p>
  </div>
  <div style="background:#fff;padding:28px 32px;">
    <p style="font-size:15px;color:#333;margin-top:0;line-height:1.6;">
      A new partner application has been submitted via <strong>pandapatches.com/partners</strong>. Reach out within 24 hours per program SLA.
    </p>
    <div style="background:#000;padding:12px 18px;border-radius:4px 4px 0 0;margin-top:20px;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Applicant Information</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:9px 14px;color:#666;width:160px;background:#fafafa;">Full Name</td><td style="padding:9px 14px;font-weight:600;color:#fb6e1d;">${esc(fullName)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Business Email</td><td style="padding:9px 14px;"><a href="mailto:${esc(businessEmail)}" style="color:#333;">${esc(businessEmail)}</a></td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Phone</td><td style="padding:9px 14px;"><a href="tel:${esc(phone)}" style="color:#333;">${esc(phone)}</a></td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Business Name</td><td style="padding:9px 14px;font-weight:600;">${esc(businessName)}</td></tr>
      ${businessWebsite ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Business Website</td><td style="padding:9px 14px;"><a href="${esc(businessWebsite)}" target="_blank" style="color:#0a7d2a;">${esc(businessWebsite)}</a></td></tr>` : ''}
      ${monthlyVolume ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Expected Monthly Volume</td><td style="padding:9px 14px;font-weight:600;color:#0a7d2a;">${esc(monthlyVolume)} pieces/month</td></tr>` : ''}
      ${hearAboutUs ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Heard About Us From</td><td style="padding:9px 14px;">${esc(hearAboutUs)}</td></tr>` : ''}
    </table>
    ${productsInterest ? `
    <div style="background:#000;padding:12px 18px;border-radius:4px 4px 0 0;margin-top:20px;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Products of Interest</span>
    </div>
    <div style="padding:14px;border:1px solid #e0e0e0;border-top:none;font-size:14px;color:#333;white-space:pre-wrap;line-height:1.6;">${esc(productsInterest)}</div>
    ` : ''}
    ${pageUrl ? `<p style="font-size:12px;color:#999;margin-top:20px;">Submitted from: <a href="${esc(pageUrl)}" style="color:#999;">${esc(pageUrl)}</a></p>` : ''}
    <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-left:4px solid #dcff70;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">
        <strong style="color:#222;">Next steps:</strong> Reply directly to this email (the applicant's address is set as reply-to) or call them within 24 hours. Reference the Partner Program tier they qualify for based on their projected monthly volume.
      </p>
    </div>
  </div>
  <div style="background:#000;padding:14px 32px;text-align:center;">
    <p style="color:#aaa;font-size:12px;margin:0;">Panda Patches Partner Program | pandapatches.com/partners</p>
  </div>
</div>
</body></html>`,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Partner application error:', error);
    return NextResponse.json(
      { error: 'Submission failed. Please email design@pandapatches.com directly or call (302) 250-4340.' },
      { status: 500 }
    );
  }
}
