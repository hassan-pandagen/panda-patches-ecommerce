/**
 * Transactional order emails for paid website orders: an internal new-order
 * notification to the team and a branded customer confirmation.
 *
 * Extracted so the Square webhook sends exactly what the Stripe webhook sends.
 * Provider-agnostic: callers pass the order fields as a flat `meta` map plus the
 * amount paid and a payment reference (Stripe session id, Square payment id, etc).
 */
import { SendMailClient } from 'zeptomail';

function esc(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendOrderEmails(
  meta: Record<string, string>,
  amountPaid: number,
  paymentRef: string,
) {
  const token = process.env.ZEPTOMAIL_TOKEN;
  if (!token) return;

  const name = meta.customer_name || 'Customer';
  const email = meta.customer_email || '';
  const product = meta.product_name || 'Custom Patch';
  const qty = meta.quantity || '1';
  const backing = meta.backing || 'Not specified';
  const size = meta.design_size || 'Not specified';
  const delivery = meta.delivery_option || 'standard';
  const addons = meta.website_addons || '';
  const instructions = meta.instructions || '';
  const shipping = meta.shipping_address || '';
  const source = meta.order_source || 'WEBSITE';
  const orderNo = meta.order_number || paymentRef;

  const deliveryLabel =
    delivery === 'economy'
      ? 'Economy (16-18 business days)'
      : delivery === 'rush'
        ? 'Rush'
        : 'Standard (7-14 business days)';

  const mail = new SendMailClient({ url: 'https://api.zeptomail.com/v1.1/email', token });

  const LOGO =
    'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/213c03ef-699b-4ff5-b568-76cbe38d40d7/1190x571.png';
  const IG_BANNER =
    'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/4f0fe337-478e-473c-b6aa-baa8b6c94def/1600x406.jpg';
  const FONT = "'lucida sans unicode','lucida grande',sans-serif";

  // Internal notification to lance
  try {
    await mail.sendMail({
      from: { address: 'hello@pandapatches.com', name: 'Panda Patches Website' },
      to: [{ email_address: { address: 'lance@pandapatches.com', name: 'Lance' } }],
      subject: `[NEW ORDER] ${product} - ${qty} pcs - $${amountPaid.toFixed(2)} - ${source}`,
      htmlbody: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:640px;margin:0 auto;font-family:${FONT};">
  <div style="background:#000;padding:20px 32px;text-align:center;">
    <img src="${LOGO}" alt="Panda Patches" width="200" style="display:block;margin:0 auto;">
    <p style="color:#aaa;margin:10px 0 0;font-size:13px;letter-spacing:2px;">NEW ORDER RECEIVED</p>
  </div>
  <div style="background:#fff;padding:28px 32px;">
    <p style="font-size:15px;color:#333;margin-top:0;">A new order has been placed on the website. Details below:</p>
    <div style="background:#000;padding:12px 18px;border-radius:4px 4px 0 0;margin-top:20px;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Customer Information</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:9px 14px;color:#666;width:140px;background:#fafafa;">Name</td><td style="padding:9px 14px;font-weight:600;color:#fb6e1d;">${esc(name)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Email</td><td style="padding:9px 14px;"><a href="mailto:${esc(email)}" style="color:#333;">${esc(email)}</a></td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Phone</td><td style="padding:9px 14px;">${esc(meta.customer_phone || 'Not provided')}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Ship To</td><td style="padding:9px 14px;">${esc(shipping) || 'Not provided'}</td></tr>
    </table>
    <div style="background:#000;padding:12px 18px;border-radius:4px 4px 0 0;margin-top:20px;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Order Details</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:9px 14px;color:#666;width:140px;background:#fafafa;">Product</td><td style="padding:9px 14px;font-weight:600;">${esc(product)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Quantity</td><td style="padding:9px 14px;font-weight:600;">${esc(qty)} pcs</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Size</td><td style="padding:9px 14px;">${esc(size)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Backing</td><td style="padding:9px 14px;">${esc(backing)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Delivery</td><td style="padding:9px 14px;">${esc(deliveryLabel)}</td></tr>
      ${addons ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Upgrades</td><td style="padding:9px 14px;">${esc(addons)}</td></tr>` : ''}
      ${instructions ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;vertical-align:top;">Instructions</td><td style="padding:9px 14px;white-space:pre-wrap;">${esc(instructions)}</td></tr>` : ''}
      ${meta.artwork_url ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;">Artwork</td><td style="padding:9px 14px;"><a href="${esc(meta.artwork_url)}" style="color:#fb6e1d;font-weight:600;">View File</a></td></tr>` : ''}
      <tr style="background:#000;"><td style="padding:12px 14px;color:#aaa;font-size:13px;">Amount Paid</td><td style="padding:12px 14px;color:#dcff70;font-size:22px;font-weight:900;">$${amountPaid.toFixed(2)}</td></tr>
    </table>
    <p style="font-size:12px;color:#aaa;margin-top:16px;">Payment Ref: ${esc(paymentRef)}</p>
  </div>
  <div style="background:#000;padding:14px 32px;text-align:center;">
    <hr style="border:none;border-top:1px solid #b8975a;margin:0 0 12px;">
    <p style="color:#aaa;font-size:12px;margin:0;">Panda Patches | pandapatches.com | (302) 250-4340</p>
    <p style="color:#555;font-size:11px;margin:6px 0 0;">Quail Feather Ct, Missouri City, TX 77489</p>
  </div>
</div>
</body></html>`,
    });
  } catch (e) {
    console.error('Internal order email error:', e);
  }

  // Customer confirmation
  if (!email) return;
  try {
    await mail.sendMail({
      from: { address: 'hello@pandapatches.com', name: 'Panda Patches' },
      to: [{ email_address: { address: email, name: name } }],
      subject: 'Order Confirmation - Panda Patches',
      htmlbody: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:620px;margin:0 auto;font-family:${FONT};">
  <div style="background:#000000;padding:24px 32px;text-align:center;">
    <img src="${LOGO}" alt="Panda Patches" width="220" style="display:block;margin:0 auto;">
  </div>
  <div style="background:#ffffff;padding:32px 32px 24px;">
    <p style="font-size:15px;color:#333333;margin-top:0;line-height:1.6;">
      Hello <strong style="color:#fb6e1d;">${esc(name)}</strong>,
    </p>
    <p style="font-size:15px;color:#333333;line-height:1.6;">
      Thank you for your order! Your payment has been confirmed and we are excited to get started on your custom patches. Our design team will send you a digital mockup within <strong>24 hours</strong> for your review and approval.
    </p>
    <p style="font-size:14px;color:#555555;line-height:1.6;">
      Production begins only after you approve the mockup. You can request unlimited revisions at no extra charge. If we cannot get it right, we offer a full money-back guarantee.
    </p>

    <div style="background:#000000;padding:12px 20px;margin-top:28px;border-radius:4px 4px 0 0;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">Order Information</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:10px 16px;color:#666666;width:130px;background:#f9f9f9;">Order No.</td><td style="padding:10px 16px;font-weight:700;color:#fb6e1d;">${esc(String(orderNo).substring(0, 18).toUpperCase())}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Product</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(product)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Quantity</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(qty)} pieces</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Size</td><td style="padding:10px 16px;color:#222222;">${esc(size)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Backing</td><td style="padding:10px 16px;color:#222222;">${esc(backing)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Delivery</td><td style="padding:10px 16px;color:#222222;">${esc(deliveryLabel)}</td></tr>
      ${addons ? `<tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Upgrades</td><td style="padding:10px 16px;color:#222222;">${esc(addons)}</td></tr>` : ''}
      ${shipping ? `<tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Ship To</td><td style="padding:10px 16px;color:#222222;">${esc(shipping)}</td></tr>` : ''}
      <tr style="background:#000000;"><td style="padding:12px 16px;color:#aaaaaa;font-size:13px;">Amount Paid</td><td style="padding:12px 16px;color:#dcff70;font-size:22px;font-weight:900;">$${amountPaid.toFixed(2)}</td></tr>
    </table>

    <div style="margin-top:28px;padding:20px 24px;background:#f9f9f9;border-left:4px solid #fb6e1d;border-radius:0 4px 4px 0;">
      <p style="margin:0 0 10px;font-weight:bold;color:#222222;font-size:14px;">What happens next?</p>
      <p style="margin:0;color:#444444;font-size:14px;line-height:1.8;">
        1. Our design team creates your mockup within 24 hours.<br>
        2. We email the mockup to <strong>${esc(email)}</strong>.<br>
        3. You review and request any changes - all free, no limits.<br>
        4. You approve - production starts immediately.<br>
        5. Your patches ship with full tracking to your door.
      </p>
    </div>

    <p style="color:#555555;font-size:14px;margin-top:24px;line-height:1.6;">
      Questions? Simply reply to this email or call us at <a href="tel:+13022504340" style="color:#fb6e1d;font-weight:bold;">(302) 250-4340</a>. We are happy to help.
    </p>
    <p style="color:#555555;font-size:14px;line-height:1.6;">
      Thank you for choosing Panda Patches. We look forward to delivering something you will love!
    </p>
    <p style="color:#333333;font-size:14px;margin-bottom:0;">
      Warm regards,<br>
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
    <p style="color:#555555;font-size:10px;margin:12px 0 0;">This is a transactional email confirming your order with Panda Patches.</p>
  </div>
</div>
</body></html>`,
    });
  } catch (e) {
    console.error('Customer confirmation email error:', e);
  }
}
