/**
 * Internal new-order notification for paid website orders.
 *
 * Ownership split (owner decision, 2026-07-21): sales@ owns PRE-sale, hello@ (the
 * CRM) owns POST-sale. The customer-facing order confirmation was REMOVED from the
 * website — the CRM already sends the authoritative payment confirmation from
 * hello@ off the same verified Square payment webhook, covering all three payment
 * flows (Buy-Now checkout, payment-form links, quote payments), so a website
 * confirmation would double-email every customer. Square is the only live gateway
 * (PayPal has zero orders), so nothing falls through.
 *
 * DO NOT re-add any post-payment CUSTOMER email here without checking the CRM
 * first. This function now sends only the INTERNAL team heads-up (to sales@,
 * cc lance@) — no customer email.
 *
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

  const deliveryLabel =
    delivery === 'economy'
      ? 'Economy (16-18 business days)'
      : delivery === 'rush'
        ? 'Rush'
        : 'Standard (7-14 business days)';

  const mail = new SendMailClient({ url: 'https://api.zeptomail.com/v1.1/email', token });

  const LOGO =
    'http://cdn.mcauto-images-production.sendgrid.net/cbe49576e8597a6a/213c03ef-699b-4ff5-b568-76cbe38d40d7/1190x571.png';
  const FONT = "'lucida sans unicode','lucida grande',sans-serif";

  // Internal notification to lance
  try {
    await mail.sendMail({
      from: { address: 'sales@pandapatches.com', name: 'Panda Patches Website' },
      // Leads go to the shared sales inbox; Lance stays copied so nothing that
      // used to reach him stops reaching him.
      to: [{ email_address: { address: 'sales@pandapatches.com', name: 'Panda Patches Sales' } }],
      cc: [{ email_address: { address: 'lance@pandapatches.com', name: 'Lance' } }],
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
    <p style="color:#555;font-size:11px;margin:6px 0 0;">701 Tillery St Ste 12, Austin, TX 78702</p>
  </div>
</div>
</body></html>`,
    });
  } catch (e) {
    console.error('Internal order email error:', e);
  }

  // NO customer order-confirmation email here — the CRM sends the authoritative
  // payment confirmation from hello@ on the same Square webhook (owner decision
  // 2026-07-21). Adding one back would double-email every customer.
}
