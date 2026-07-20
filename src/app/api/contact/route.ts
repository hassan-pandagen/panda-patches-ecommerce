import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SendMailClient } from 'zeptomail';
import { createClient } from '@supabase/supabase-js';
import { getAttributionFromRequest } from '@/lib/attribution';
import { deriveTrafficSource, attributionSummary } from '@/lib/leadSource';
import { sendMetaEvent } from '@/lib/metaCapi';

// Service-role client — contact leads are persisted to the CRM (audit P0-5:
// previously email-only, so a ZeptoMail failure destroyed the lead permanently).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check — bots fill this, real users don't
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;
    const pageUrl = typeof body.pageUrl === 'string' ? body.pageUrl.slice(0, 500) : '';
    // Fast-submit heuristic from the client — flag, never drop (audit P0-4).
    const suspectedBot = body.botSignal === true;

    // Lead attribution — surface the resolved channel + raw signals so the team
    // (and the CRM inbox) can see where this contact came from.
    const attribution = getAttributionFromRequest(request, body.attribution);
    const channel = deriveTrafficSource(attribution as any);
    const attrSummary = attributionSummary(attribution);

    // Persist to the CRM FIRST so the lead survives any email failure (P0-5).
    const { error: dbError } = await supabase.from('quotes').insert({
      customer_name: name,
      customer_email: email,
      customer_phone: null,
      patches_type: 'Custom Patch',
      instructions: `${suspectedBot ? '[SUSPECTED BOT] ' : ''}[CONTACT FORM] ${message}`.slice(0, 4000),
      sales_agent: 'WEBSITE_BOT',
      lead_source: channel,
      page_url: pageUrl || null,
      attribution: { ...attribution, traffic_source: channel, form_name: 'CONTACT_FORM' },
    });
    if (dbError) {
      console.error('Contact form: quotes insert failed (non-blocking):', dbError);
    }

    // Meta CAPI Lead — contact-form leads are often bulk buyers; give the ads
    // platform the signal (P0-5). Suspected bots are excluded to protect signal quality.
    if (!suspectedBot) {
      const [firstName, ...lastParts] = name.trim().split(/\s+/);
      sendMetaEvent({
        eventName: 'Lead',
        eventId: `contact_${Date.now()}_${email.slice(0, 8)}`,
        actionSource: 'website',
        email,
        firstName,
        lastName: lastParts.join(' ') || undefined,
        externalId: email,
        attribution,
        eventSourceUrl: pageUrl || attribution.page_url,
        value: 0,
        currency: 'USD',
        contentName: 'Contact Form',
        contentCategory: 'Custom Patches',
      }).catch((err) => console.error('[META CAPI] Contact Lead send failed (non-blocking):', err));
    }

    // Escape HTML to prevent injection in email body
    const esc = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    const safeName = esc(name);
    const safeEmail = esc(email);
    const safeMessage = esc(message);

    // Notification email — a failure here no longer loses the lead (it is already
    // in the CRM); only if BOTH the DB insert and the email fail do we surface an error.
    let emailFailed = false;
    try {
      const token = process.env.ZEPTOMAIL_TOKEN;
      if (!token) throw new Error('ZEPTOMAIL_TOKEN not set');

      const client = new SendMailClient({
        url: 'https://api.zeptomail.com/v1.1/email',
        token,
      });

      await client.sendMail({
        from: {
          address: 'sales@pandapatches.com',
          name: 'Panda Patches Website',
        },
        to: [
          {
            email_address: {
              address: 'sales@pandapatches.com',
              name: 'Panda Patches Sales',
            },
          },
        ],
        cc: [
          {
            email_address: {
              address: 'lance@pandapatches.com',
              name: 'Lance',
            },
          },
        ],
        reply_to: [{ address: email, name }],
        subject: `${suspectedBot ? '[SUSPECTED BOT] ' : ''}New Contact Form Submission from ${safeName}`,
        htmlbody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #f5c518; padding-bottom: 12px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; width: 100px;">Name:</td>
              <td style="padding: 10px 0; color: #1a1a1a;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0;"><a href="mailto:${safeEmail}" style="color: #2563eb;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
              <td style="padding: 10px 0; color: #1a1a1a; white-space: pre-wrap;">${safeMessage}</td>
            </tr>
            ${pageUrl ? `<tr><td style="padding: 10px 0; font-weight: bold; color: #555;">Page:</td><td style="padding: 10px 0;"><a href="${esc(pageUrl)}" style="color: #2563eb;">${esc(pageUrl)}</a></td></tr>` : ''}
            <tr><td style="padding: 10px 0; font-weight: bold; color: #555;">Source:</td><td style="padding: 10px 0; color: #1a1a1a;">${esc(channel)}${attrSummary ? ` <span style="color:#999;font-size:12px;">(${esc(attrSummary)})</span>` : ''}</td></tr>
          </table>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Sent from pandapatches.com contact form. Reply directly to this email to respond to ${safeName}.
          </p>
        </div>
      `,
      });
    } catch (emailErr) {
      emailFailed = true;
      console.error('Contact form email failed:', emailErr);
    }

    if (emailFailed && dbError) {
      // Both capture paths failed — tell the user so they can retry.
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
