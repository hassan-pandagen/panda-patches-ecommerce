import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SendMailClient } from 'zeptomail';
import { sendMetaEvent } from '@/lib/metaCapi';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ABANDON_DELAY_MIN = 30;          // First email after 30 min
const FOLLOW_UP_DELAY_HOURS = 24;      // Second email 24 hours later
const EXPIRE_AFTER_DAYS = 7;           // Stop trying after a week
const RECOVERY_DISCOUNT_CODE = 'PANDA10';

const LOGO = 'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/213c03ef-699b-4ff5-b568-76cbe38d40d7/1190x571.png';
const IG_BANNER = 'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/4f0fe337-478e-473c-b6aa-baa8b6c94def/1600x406.jpg';
const FONT = "'lucida sans unicode','lucida grande',sans-serif";

interface CheckoutAttempt {
  id: string;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  product_name: string | null;
  quantity: number | null;
  design_size: string | null;
  backing: string | null;
  delivery_option: string | null;
  cart_value: number;
  artwork_url: string | null;
  payment_provider: 'stripe' | 'paypal' | null;
  provider_session_id: string | null;
  return_url: string | null;
  fbp: string | null;
  fbc: string | null;
  attribution: Record<string, string> | null;
  status: string;
  initiated_at: string;
  email_sent_at: string | null;
}

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function firstNameOf(full: string | null): string {
  if (!full) return 'there';
  const trimmed = full.trim().split(/\s+/)[0];
  return trimmed || 'there';
}

function deliveryLabel(opt: string | null): string {
  if (opt === 'economy') return 'Economy (16-18 business days)';
  if (opt === 'rush') return 'Rush';
  return 'Standard (7-14 business days)';
}

/**
 * Vercel Cron handler — runs every 15 minutes.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically
 * when CRON_SECRET is set as an env var. We reject requests without it.
 *
 * Steps:
 * 1. Send first email to PENDING rows older than 30 minutes
 * 2. Send follow-up to EMAIL_SENT rows older than 24 hours
 * 3. Mark anything older than 7 days as EXPIRED
 */
export async function GET(req: Request) {
  // Auth check
  const authHeader = req.headers.get('authorization') || '';
  const expected = `Bearer ${process.env.CRON_SECRET || ''}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const firstEmailCutoff = new Date(now.getTime() - ABANDON_DELAY_MIN * 60_000).toISOString();
  const secondEmailCutoff = new Date(now.getTime() - FOLLOW_UP_DELAY_HOURS * 3_600_000).toISOString();
  const expireCutoff = new Date(now.getTime() - EXPIRE_AFTER_DAYS * 86_400_000).toISOString();

  // 1) First email — PENDING rows older than 30 minutes
  const { data: firstBatch } = await supabase
    .from('checkout_attempts')
    .select('*')
    .eq('status', 'PENDING')
    .lt('initiated_at', firstEmailCutoff)
    .limit(50);

  const firstResults = await Promise.allSettled(
    (firstBatch ?? []).map((row) => sendFirstEmail(row as CheckoutAttempt))
  );

  // 2) Follow-up email — EMAIL_SENT rows where email_sent_at is older than 24 hours
  const { data: secondBatch } = await supabase
    .from('checkout_attempts')
    .select('*')
    .eq('status', 'EMAIL_SENT')
    .lt('email_sent_at', secondEmailCutoff)
    .limit(50);

  const secondResults = await Promise.allSettled(
    (secondBatch ?? []).map((row) => sendSecondEmail(row as CheckoutAttempt))
  );

  // 3) Expire stale rows after 7 days so we don't email forever
  await supabase
    .from('checkout_attempts')
    .update({ status: 'EXPIRED' })
    .in('status', ['PENDING', 'EMAIL_SENT', 'EMAIL_2_SENT'])
    .lt('initiated_at', expireCutoff);

  const firstSent = firstResults.filter((r) => r.status === 'fulfilled').length;
  const firstFailed = firstResults.length - firstSent;
  const secondSent = secondResults.filter((r) => r.status === 'fulfilled').length;
  const secondFailed = secondResults.length - secondSent;

  console.log('[abandoned-cart cron]', { firstSent, firstFailed, secondSent, secondFailed });

  return NextResponse.json({
    firstSent,
    firstFailed,
    secondSent,
    secondFailed,
    timestamp: now.toISOString(),
  });
}

async function sendFirstEmail(row: CheckoutAttempt) {
  const token = process.env.ZEPTOMAIL_TOKEN;
  if (!token) throw new Error('ZEPTOMAIL_TOKEN not set');
  if (!row.customer_email) throw new Error('No email');

  const mail = new SendMailClient({ url: 'https://api.zeptomail.com/v1.1/email', token });
  const fname = firstNameOf(row.customer_name);

  await mail.sendMail({
    from: { address: 'hello@pandapatches.com', name: 'Panda Patches' },
    to: [{ email_address: { address: row.customer_email, name: row.customer_name || '' } }],
    subject: `${fname}, your custom patches are waiting`,
    htmlbody: buildFirstEmailHtml(row, fname),
  });

  await supabase
    .from('checkout_attempts')
    .update({
      status: 'EMAIL_SENT',
      email_sent_at: new Date().toISOString(),
    })
    .eq('id', row.id);

  // Fire Meta CAPI Lead event so this contact joins lookalike audiences
  // (Optional but recommended — can comment out if not desired)
  sendMetaEvent({
    eventName: 'Lead',
    eventId: `abandon_email_1_${row.id}`,
    actionSource: 'email',
    eventSourceUrl: row.return_url || 'https://www.pandapatches.com/',
    email: row.customer_email,
    phone: row.customer_phone,
    firstName: fname !== 'there' ? fname : null,
    attribution: row.attribution || undefined,
    value: row.cart_value,
    currency: 'USD',
    contentName: 'Abandoned Cart Email 1',
    contentCategory: 'Custom Patches',
  }).catch(() => { /* non-blocking */ });
}

async function sendSecondEmail(row: CheckoutAttempt) {
  const token = process.env.ZEPTOMAIL_TOKEN;
  if (!token) throw new Error('ZEPTOMAIL_TOKEN not set');
  if (!row.customer_email) throw new Error('No email');

  const mail = new SendMailClient({ url: 'https://api.zeptomail.com/v1.1/email', token });
  const fname = firstNameOf(row.customer_name);

  await mail.sendMail({
    from: { address: 'hello@pandapatches.com', name: 'Panda Patches' },
    to: [{ email_address: { address: row.customer_email, name: row.customer_name || '' } }],
    subject: `${fname}, 10% off if you finish your order today`,
    htmlbody: buildSecondEmailHtml(row, fname),
  });

  await supabase
    .from('checkout_attempts')
    .update({
      status: 'EMAIL_2_SENT',
      email_2_sent_at: new Date().toISOString(),
    })
    .eq('id', row.id);
}

function buildFirstEmailHtml(row: CheckoutAttempt, fname: string): string {
  const product = row.product_name || 'Custom Patches';
  const qty = row.quantity || 1;
  const size = row.design_size || '';
  const backing = row.backing || '';
  const delivery = deliveryLabel(row.delivery_option);
  const value = `$${Number(row.cart_value || 0).toFixed(2)}`;
  const ctaUrl = row.return_url || 'https://www.pandapatches.com/custom-patches';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:620px;margin:0 auto;font-family:${FONT};">
  <div style="background:#000000;padding:24px 32px;text-align:center;">
    <img src="${LOGO}" alt="Panda Patches" width="220" style="display:block;margin:0 auto;">
  </div>
  <div style="background:#ffffff;padding:32px 32px 24px;">
    <p style="font-size:15px;color:#333333;margin-top:0;line-height:1.6;">
      Hey <strong style="color:#fb6e1d;">${esc(fname)}</strong>,
    </p>
    <p style="font-size:15px;color:#333333;line-height:1.6;">
      Looks like you got pulled away mid-order. Your custom patches are still waiting and ready to go. We saved everything so you can pick up exactly where you left off.
    </p>

    <div style="background:#000000;padding:12px 20px;margin-top:28px;border-radius:4px 4px 0 0;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">Your Cart</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:10px 16px;color:#666666;width:130px;background:#f9f9f9;">Product</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(product)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Quantity</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(qty)} pieces</td></tr>
      ${size ? `<tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Size</td><td style="padding:10px 16px;color:#222222;">${esc(size)}</td></tr>` : ''}
      ${backing ? `<tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Backing</td><td style="padding:10px 16px;color:#222222;">${esc(backing)}</td></tr>` : ''}
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Delivery</td><td style="padding:10px 16px;color:#222222;">${esc(delivery)}</td></tr>
      <tr style="background:#000000;"><td style="padding:12px 16px;color:#aaaaaa;font-size:13px;">Cart Total</td><td style="padding:12px 16px;color:#dcff70;font-size:22px;font-weight:900;">${esc(value)}</td></tr>
    </table>

    <div style="text-align:center;margin:32px 0 24px;">
      <a href="${esc(ctaUrl)}" style="display:inline-block;background:#dcff70;color:#000000;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:900;font-size:16px;letter-spacing:1px;text-transform:uppercase;">Finish My Order →</a>
    </div>

    <div style="margin-top:8px;padding:20px 24px;background:#f9f9f9;border-left:4px solid #fb6e1d;border-radius:0 4px 4px 0;">
      <p style="margin:0 0 10px;font-weight:bold;color:#222222;font-size:14px;">Why customers choose Panda Patches:</p>
      <p style="margin:0;color:#444444;font-size:14px;line-height:1.8;">
        ✓ Free digital mockup within 24 hours<br>
        ✓ Unlimited free revisions until you approve<br>
        ✓ No setup fees, no digitizing fees, no minimums<br>
        ✓ Money-back guarantee if you don't love it
      </p>
    </div>

    <p style="color:#555555;font-size:14px;margin-top:24px;line-height:1.6;">
      Questions before you finish? Reply to this email or call <a href="tel:+13022504340" style="color:#fb6e1d;font-weight:bold;">(302) 250-4340</a>. We will help you wrap it up in two minutes.
    </p>
    <p style="color:#333333;font-size:14px;margin-bottom:0;">
      Thank you,<br>
      <strong>The Panda Patches Team</strong>
    </p>
  </div>

  <div style="background:#ffffff;padding:0 32px 24px;">
    <a href="https://www.instagram.com/pandapatchesofficial/" target="_blank">
      <img src="${IG_BANNER}" alt="Follow Panda Patches on Instagram" width="556" style="display:block;width:100%;border-radius:4px;">
    </a>
  </div>

  <div style="background:#000000;padding:20px 32px;text-align:center;">
    <hr style="border:none;border-top:1px solid #b8975a;margin:0 0 16px;">
    <p style="color:#ffffff;font-size:12px;margin:0 0 6px;letter-spacing:1px;">PANDA PATCHES</p>
    <p style="color:#aaaaaa;font-size:11px;margin:0;">Quail Feather Ct, Missouri City, TX 77489</p>
    <p style="color:#aaaaaa;font-size:11px;margin:4px 0 0;">(302) 250-4340 | <a href="https://www.pandapatches.com" style="color:#aaaaaa;">pandapatches.com</a></p>
    <p style="color:#555555;font-size:10px;margin:12px 0 0;">You started a custom patch order at pandapatches.com. <a href="mailto:hello@pandapatches.com?subject=Unsubscribe" style="color:#777777;">Unsubscribe</a></p>
  </div>
</div>
</body></html>`;
}

function buildSecondEmailHtml(row: CheckoutAttempt, fname: string): string {
  const product = row.product_name || 'Custom Patches';
  const qty = row.quantity || 1;
  const value = `$${Number(row.cart_value || 0).toFixed(2)}`;
  const baseReturn = row.return_url || 'https://www.pandapatches.com/custom-patches';
  const sep = baseReturn.includes('?') ? '&' : '?';
  const ctaUrl = `${baseReturn}${sep}promo=${RECOVERY_DISCOUNT_CODE}`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:620px;margin:0 auto;font-family:${FONT};">
  <div style="background:#000000;padding:24px 32px;text-align:center;">
    <img src="${LOGO}" alt="Panda Patches" width="220" style="display:block;margin:0 auto;">
  </div>
  <div style="background:#ffffff;padding:32px 32px 24px;">
    <p style="font-size:15px;color:#333333;margin-top:0;line-height:1.6;">
      Hey <strong style="color:#fb6e1d;">${esc(fname)}</strong>,
    </p>
    <p style="font-size:16px;color:#333333;line-height:1.6;">
      Last reminder before your cart expires. To say thanks for sticking around, here is <strong>10% off your full order</strong> if you finish today.
    </p>

    <div style="background:#dcff70;border:2px dashed #000000;padding:24px 28px;text-align:center;border-radius:8px;margin:24px 0;">
      <p style="margin:0;font-size:13px;color:#333333;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">Your Code</p>
      <p style="margin:8px 0 4px;font-size:32px;font-weight:900;letter-spacing:4px;color:#000000;">${RECOVERY_DISCOUNT_CODE}</p>
      <p style="margin:0;font-size:12px;color:#555555;">10% off any order — expires in 24 hours</p>
    </div>

    <div style="background:#000000;padding:12px 20px;margin-top:28px;border-radius:4px 4px 0 0;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">Your Cart</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:10px 16px;color:#666666;width:130px;background:#f9f9f9;">Product</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(product)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Quantity</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(qty)} pieces</td></tr>
      <tr style="background:#000000;"><td style="padding:12px 16px;color:#aaaaaa;font-size:13px;">Cart Total</td><td style="padding:12px 16px;color:#dcff70;font-size:22px;font-weight:900;">${esc(value)}</td></tr>
    </table>

    <div style="text-align:center;margin:32px 0 24px;">
      <a href="${esc(ctaUrl)}" style="display:inline-block;background:#000000;color:#dcff70;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:900;font-size:16px;letter-spacing:1px;text-transform:uppercase;">Claim 10% Off Now →</a>
    </div>

    <p style="color:#555555;font-size:13px;margin-top:24px;line-height:1.6;text-align:center;">
      Questions? Just reply. We are here to help.
    </p>
  </div>

  <div style="background:#000000;padding:20px 32px;text-align:center;">
    <hr style="border:none;border-top:1px solid #b8975a;margin:0 0 16px;">
    <p style="color:#ffffff;font-size:12px;margin:0 0 6px;letter-spacing:1px;">PANDA PATCHES</p>
    <p style="color:#aaaaaa;font-size:11px;margin:0;">Quail Feather Ct, Missouri City, TX 77489</p>
    <p style="color:#aaaaaa;font-size:11px;margin:4px 0 0;">(302) 250-4340 | <a href="https://www.pandapatches.com" style="color:#aaaaaa;">pandapatches.com</a></p>
    <p style="color:#555555;font-size:10px;margin:12px 0 0;"><a href="mailto:hello@pandapatches.com?subject=Unsubscribe" style="color:#777777;">Unsubscribe from these reminders</a></p>
  </div>
</div>
</body></html>`;
}
