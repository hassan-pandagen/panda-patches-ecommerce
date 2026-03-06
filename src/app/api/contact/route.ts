import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SendMailClient } from 'zeptomail';

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

    const token = process.env.ZEPTOMAIL_TOKEN;
    if (!token) {
      console.error('ZEPTOMAIL_TOKEN not set');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const client = new SendMailClient({
      url: 'https://api.zeptomail.com/v1.1/email',
      token,
    });

    await client.sendMail({
      from: {
        address: 'hello@pandapatches.com',
        name: 'Panda Patches Website',
      },
      to: [
        {
          email_address: {
            address: 'lance@pandapatches.com',
            name: 'Lance',
          },
        },
      ],
      reply_to: [{ address: email, name }],
      subject: `New Contact Form Submission from ${safeName}`,
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
          </table>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Sent from pandapatches.com contact form. Reply directly to this email to respond to ${safeName}.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
