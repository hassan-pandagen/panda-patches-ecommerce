import { NextResponse, after } from 'next/server';
import { addBusinessDays, formatShortDate } from '@/lib/businessDays';
import { z } from 'zod';
import { SendMailClient } from 'zeptomail';
import { sendMetaEvent } from '@/lib/metaCapi';
import { getAttributionFromRequest } from '@/lib/attribution';
import { deriveLeadSource, deriveTrafficSource } from '@/lib/leadSource';
import { canonicalPatchType, canonicalBacking, canonicalBorder, extractBorderFromText } from '@/lib/canonicalFields';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const supabase = createSupabaseAdminClient();

const QuoteSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().regex(/^[\d\s\-()+ ]+$/, 'Invalid phone number format').optional().or(z.literal('')),
  }),
  details: z.object({
    width: z.number().min(0).max(50),
    height: z.number().min(0).max(50),
    // Base sanity check only — the real 5-piece minimum is enforced below via
    // superRefine, skipped when `serviceOnly` is set (digitizing/vector-conversion
    // quotes aren't a patch-quantity order at all).
    quantity: z.number().int().min(1).max(100000),
    backing: z.string().min(1).max(50),
    placement: z.string().max(200).optional().or(z.literal('')),
    instructions: z.string().max(2000).optional().or(z.literal('')),
    patchType: z.string().max(100).optional().or(z.literal('')),
    border: z.string().max(60).optional().or(z.literal('')),
    country: z.string().max(80).optional().or(z.literal('')),
    // Rush landing page's "when do you need them in hand?" field (RUSH-C_1.MD).
    // ISO date string (yyyy-mm-dd) from a native <input type="date">.
    deadline: z.string().max(20).optional().or(z.literal('')),
  }),
  artworkUrl: z.string().url().optional().or(z.null()),
  artworkUrl2: z.string().url().optional().or(z.null()),
  isBulkOrder: z.boolean().optional(),
  /** True ONLY from /rush-custom-patches. A date on any other form is a
   *  deadline to plan around, not a request for paid rush service. */
  isRushRequest: z.boolean().optional(),
  pageUrl: z.string().max(500).optional().or(z.literal('')),
  basePrice: z.number().min(0).optional(),
  attribution: z.object({
    fbp: z.string().optional(),
    fbc: z.string().optional(),
    gclid: z.string().optional(),
    // Google click ids + capture time for the CRM's google-ads-conversions
    // function. Without these in the schema, Zod strips them before the DB insert.
    wbraid: z.string().optional(),
    gbraid: z.string().optional(),
    gclid_captured_at: z.string().optional(),
    fbclid: z.string().optional(),
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
    msclkid: z.string().optional(),
    ttclid: z.string().optional(),
    page_url: z.string().optional(),
    referrer: z.string().max(500).optional(),
    first_seen_at: z.string().optional(),
  }).optional(),
  eventId: z.string().max(100).optional(),
  internalOnly: z.boolean().optional(),
  // Client-side bot-speed heuristic. Suspicious leads are FLAGGED, never dropped (P0-4).
  botSignal: z.boolean().optional(),
  // Design-service quotes (embroidery digitizing, raster-to-vector conversion) are
  // priced per job, not per patch — set true to skip the 5-piece minimum below.
  serviceOnly: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (!data.serviceOnly && data.details.quantity < 5) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Minimum order is 5 pieces',
      path: ['details', 'quantity'],
    });
  }
});

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// deriveLeadSource + deriveTrafficSource live in @/lib/leadSource so the tracked
// email link (TrackedEmailLink) labels direct-email quotes the same way.

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot check — bots fill this, real users don't
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    // Gibberish detection — catches bot-generated random strings
    const looksGibberish = (str: string) => {
      if (!str || str.length < 6) return false;
      const word = str.trim().split(/\s+/)[0];
      if (word.length < 6) return false;
      // Count consonant clusters of 4+ in a row (extremely rare in real names/words)
      const consonantCluster = /[bcdfghjklmnpqrstvwxyz]{4,}/i;
      // Mixed case within a single word with no spaces (e.g. "esjkfKEaWfcbywlg")
      const mixedCaseNoSpace = /^[^\s]+$/.test(word) && /[a-z]/.test(word) && /[A-Z]/.test(word.slice(1));
      return consonantCluster.test(word) && mixedCaseNoSpace;
    };

    const name = body.customer?.name || '';

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

    const { customer, details, artworkUrl, artworkUrl2, isBulkOrder, isRushRequest, pageUrl, basePrice, attribution: bodyAttribution, eventId: clientEventId, internalOnly, botSignal } = validationResult.data;

    // Audit P0-4: gibberish names (real surnames like VanSchyndel trip the heuristic)
    // and fast submits (autofill users) used to be silently DROPPED with a fake
    // success. Now they are inserted + emailed with a [SUSPECTED BOT] flag so the
    // sales team can triage; only the customer auto-reply and Meta CAPI are skipped.
    const suspectedBot = looksGibberish(name) || botSignal === true;

    const attribution = getAttributionFromRequest(req, bodyAttribution);

    const sizeLabel = details.width > 0 ? `${details.width}" x ${details.height}"` : 'Custom / See instructions';

    // Extract "How did you hear about us?" from the instructions string.
    // Forms append it as "Source: X" or "| Source: X" at the end.
    // We pull it out so it renders as its own email row, not buried in instructions.
    const rawInstructions = details.instructions || '';
    const sourceMatch = rawInstructions.match(/Source:\s*(.+?)(?:\s*$)/m);
    const hearAboutUs = sourceMatch ? sourceMatch[1].trim() : null;
    const cleanInstructions = rawInstructions
      .replace(/\s*\|\s*Source:[^\n]*/g, '')
      .replace(/\s*Source:[^\n]*/g, '')
      .trim();

    const flaggedInstructions = suspectedBot
      ? `[SUSPECTED BOT] ${cleanInstructions}`.trim()
      : cleanInstructions;

    const leadSource = deriveLeadSource(pageUrl, isBulkOrder, basePrice != null);
    const trafficSource = deriveTrafficSource(attribution as any);

    // Canonical product fields for the CRM (discrete values, not free-form).
    const patchesType = canonicalPatchType(details.patchType) || 'Custom Patch';
    const designBacking = canonicalBacking(details.backing);
    const borderType = (details.border && canonicalBorder(details.border)) || extractBorderFromText(rawInstructions);
    const country = (details.country && details.country.trim()) || null;

    // The CRM derives lead_source from `attribution`, so the form/page name never
    // goes in lead_source. We carry the website-resolved channel + the form name +
    // the canonical border/country as metadata inside the attribution jsonb until
    // border_type/country get their own columns on the quotes table.
    const enrichedAttribution = {
      ...attribution,
      traffic_source: trafficSource,
      form_name: leadSource,
      // "How did you hear about us?" — persisted for the CRM's traffic × heard_about
      // matrix. Pulled from the "Source: X" tag every quote form appends to the
      // instructions string (extracted above). For the "Other" option this holds
      // the customer's free-text answer, not the literal word "Other".
      heard_about: hearAboutUs || undefined,
      border_type: borderType || undefined,
      country: country || undefined,
    };
    // Rush landing page's deadline field, when present, gets its own triage-friendly
    // subject line so rush requests jump out in the inbox (RUSH-C_1.MD).
    //
    // A date column rejects anything that is not a real date, and this arrives as a
    // loose string, so it is validated before it is written. An unparseable value
    // loses the structured flag but must NEVER fail the lead: a quote that dies
    // because someone typed a bad date is a lost customer.
    const rushDateIso = (() => {
      const raw = (details.deadline || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
      const d = new Date(raw + 'T00:00:00');
      return Number.isNaN(d.getTime()) ? null : raw;
    })();
    const deadlineLabel = details.deadline
      ? new Date(details.deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : null;

    /**
     * What standard turnaround actually delivers, if the mockup were approved
     * today, and whether the customer's date fits inside it.
     *
     * Built from the SLOW end of canon on purpose — 14 business days production
     * plus 5 transit. An agent who quotes the optimistic end is how a customer
     * ends up believing "about 10 days", which is the expectation problem that
     * produced our worst review of the quarter.
     *
     * The point is to make rush an OFFER when standard misses the date, rather
     * than an assumption triggered by the customer mentioning a date at all.
     */
    const standardEstimate = (() => {
      if (!rushDateIso) return null;
      const today = new Date();
      const earliest = addBusinessDays(today, 7 + 3);
      const latest = addBusinessDays(today, 14 + 5);
      const wanted = new Date(rushDateIso + 'T00:00:00');
      const verdict =
        wanted >= latest
          ? 'Standard makes this comfortably.'
          : wanted >= earliest
            ? 'Tight — standard may miss it. Confirm with production before promising.'
            : 'Standard cannot make this date. Offer rush.';
      return { earliest: formatShortDate(earliest), latest: formatShortDate(latest), verdict };
    })();
    // RUSH belongs only on an actual rush request. Until 9 Sept 2026 ANY deadline
    // produced a RUSH subject, which was correct when only the rush page could
    // send one and wrong the moment the main form gained the field: agents saw
    // RUSH, replied as rush, and added 25% to customers who had merely told us
    // their date.
    const subject = `${suspectedBot ? '[SUSPECTED BOT] ' : ''}${
      deadlineLabel && isRushRequest
        ? `RUSH quote — ${customer.name} — in hand by ${deadlineLabel}`
        : deadlineLabel
          ? `Quote request — ${customer.name} — needs by ${deadlineLabel}`
          : isBulkOrder
          ? `New Bulk Quote Request from ${customer.name}`
          : `New Quote Request from ${customer.name}`
    }`;

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
          from: { address: 'sales@pandapatches.com', name: 'Panda Patches Website' },
          to: [{ email_address: { address: 'sales@pandapatches.com', name: 'Panda Patches Sales' } }],
          cc: [{ email_address: { address: 'lance@pandapatches.com', name: 'Lance' } }],
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
      <tr><td style="padding:9px 14px;color:#666;width:140px;background:#fafafa;">Source</td><td style="padding:9px 14px;font-weight:600;color:#0a7d2a;">${esc(leadSource)}</td></tr>
      <tr><td style="padding:9px 14px;color:#666;width:140px;background:#fafafa;">Traffic</td><td style="padding:9px 14px;font-weight:600;color:#1a73e8;">${esc(trafficSource)}</td></tr>
      ${hearAboutUs ? `<tr><td style="padding:9px 14px;color:#666;width:140px;background:#fafafa;">Heard about us</td><td style="padding:9px 14px;font-weight:600;color:#7c3aed;">${esc(hearAboutUs)}</td></tr>` : ''}
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
      ${deadlineLabel ? `<tr style="background:${isRushRequest ? '#ffe0e0' : '#fff3e0'};"><td style="padding:9px 14px;color:#9a5b00;font-weight:600;">${isRushRequest ? 'RUSH REQUESTED' : 'Needed by'}</td><td style="padding:9px 14px;font-weight:700;color:#9a5b00;">${esc(deadlineLabel)}${country ? ` — ${esc(country)}` : ''}</td></tr>` : ''}
      ${standardEstimate ? `<tr style="background:#fafafa;"><td style="padding:9px 14px;color:#666;vertical-align:top;">Standard estimate</td><td style="padding:9px 14px;color:#333;">In hand <strong>${esc(standardEstimate.earliest)}&ndash;${esc(standardEstimate.latest)}</strong> if approved today.<br><span style="color:#9a5b00;font-weight:600;">${esc(standardEstimate.verdict)}</span>${isRushRequest ? '' : '<br><span style="color:#666;font-size:12px;">This customer gave a date, they did not ask for rush. Quote standard; offer rush only if standard misses.</span>'}</td></tr>` : ''}
      ${flaggedInstructions ? `<tr><td style="padding:9px 14px;color:#666;background:#fafafa;vertical-align:top;">Instructions</td><td style="padding:9px 14px;white-space:pre-wrap;">${esc(flaggedInstructions)}</td></tr>` : ''}
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

        // Customer email: skipped entirely if internalOnly flag set
        // (used by ComplexCalculator's "Check Best Prices" auto-capture
        // to record the lead without prematurely emailing the price).
        if (internalOnly || suspectedBot) {
          // skip customer email (internal capture, or flagged as suspected bot)
        } else if (basePrice != null) {
          // ComplexCalculator quote (has price) — send full branded quote with price
          try {
            await mailClient.sendMail({
              from: { address: 'sales@pandapatches.com', name: 'Panda Patches' },
              to: [{ email_address: { address: customer.email, name: customer.name } }],
              subject: `Your Price Quote - Panda Patches`,
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
      Here is your price quote for your custom patches order. Ready to place your order? Simply reply to this email or visit our website to complete checkout.
    </p>

    <div style="background:#000000;padding:12px 20px;margin-top:28px;border-radius:4px 4px 0 0;">
      <span style="color:#dcff70;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">Your Quote Summary</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e0e0e0;border-top:none;">
      <tr><td style="padding:10px 16px;color:#666666;width:130px;background:#f9f9f9;">Patch Type</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${esc(details.patchType || 'Custom Patch')}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Size</td><td style="padding:10px 16px;color:#222222;">${esc(sizeLabel)}</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Quantity</td><td style="padding:10px 16px;font-weight:600;color:#222222;">${details.quantity} pieces</td></tr>
      <tr><td style="padding:10px 16px;color:#666666;background:#f9f9f9;">Backing</td><td style="padding:10px 16px;color:#222222;">${esc(details.backing)}</td></tr>
      <tr style="background:#000000;"><td style="padding:12px 16px;color:#aaaaaa;font-size:13px;">Est. Price</td><td style="padding:12px 16px;color:#dcff70;font-size:22px;font-weight:900;">$${basePrice.toFixed(2)}</td></tr>
    </table>

    <div style="margin-top:28px;padding:20px 24px;background:#f9f9f9;border-left:4px solid #fb6e1d;border-radius:0 4px 4px 0;">
      <p style="margin:0 0 10px;font-weight:bold;color:#222222;font-size:14px;">What happens next?</p>
      <p style="margin:0;color:#444444;font-size:14px;line-height:1.8;">
        1. Reply to this email or call us to confirm your order.<br>
        2. Our design team sends your digital mockup within 24 hours.<br>
        3. You approve it. Free unlimited changes until you're happy.<br>
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
    <a href="https://www.instagram.com/pandapatchesofficial/" target="_blank">
      <img src="${IG_BANNER}" alt="Follow Panda Patches on Instagram" width="556" style="display:block;width:100%;border-radius:4px;">
    </a>
  </div>

  <div style="background:#000000;padding:20px 32px;text-align:center;">
    <hr style="border:none;border-top:1px solid #b8975a;margin:0 0 16px;">
    <p style="color:#ffffff;font-size:12px;margin:0 0 6px;letter-spacing:1px;">PANDA PATCHES</p>
    <p style="color:#aaaaaa;font-size:11px;margin:0;">701 Tillery St Ste 12, Austin, TX 78702</p>
    <p style="color:#aaaaaa;font-size:11px;margin:4px 0 0;">(302) 250-4340 | <a href="https://www.pandapatches.com" style="color:#aaaaaa;">pandapatches.com</a></p>
  </div>
</div>
</body></html>`,
            });
          } catch (custEmailErr) {
            console.error('Customer quote email error:', custEmailErr);
          }
        } else {
          // Home/Bulk form (no price) — simple acknowledgment only
          try {
            await mailClient.sendMail({
              from: { address: 'sales@pandapatches.com', name: 'Panda Patches' },
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
      Thank you for reaching out! We have received your quote request and our team will get back to you within <strong>2 hours</strong> with the best price for your custom patches.
    </p>
    <p style="color:#555555;font-size:14px;margin-top:24px;line-height:1.6;">
      Questions? Reply to this email or call us at <a href="tel:+13022504340" style="color:#fb6e1d;font-weight:bold;">(302) 250-4340</a>.
    </p>
    <p style="color:#333333;font-size:14px;margin-bottom:0;">
      Warm regards,<br>
      <strong>The Panda Patches Team</strong>
    </p>
  </div>
  <div style="background:#000000;padding:20px 32px;text-align:center;">
    <hr style="border:none;border-top:1px solid #b8975a;margin:0 0 16px;">
    <p style="color:#ffffff;font-size:12px;margin:0 0 6px;letter-spacing:1px;">PANDA PATCHES</p>
    <p style="color:#aaaaaa;font-size:11px;margin:0;">(302) 250-4340 | <a href="https://www.pandapatches.com" style="color:#aaaaaa;">pandapatches.com</a></p>
  </div>
</div>
</body></html>`,
            });
          } catch (custEmailErr) {
            console.error('Customer acknowledgment email error:', custEmailErr);
          }
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
        patches_type: patchesType,
        design_backing: designBacking,
        patches_quantity: details.quantity,
        design_size: sizeLabel,
        instructions: [
          deadlineLabel ? `[NEEDED BY: ${deadlineLabel}${country ? `, ${country}` : ''}]` : '',
          flaggedInstructions || details.placement || '',
        ].filter(Boolean).join(' ').trim(),
        // TWO FIELDS, TWO MEANINGS (CEO, 9 Sept 2026). Same date, and which column
        // it lands in decides whether the customer gets charged 25% more.
        //
        //   rush_date      — they asked for rush, via /rush-custom-patches.
        //   needed_by_date — they told us when they need it. Plan around it.
        //                    No fee implied, and it must NEVER set is_urgent.
        //
        // Getting this wrong is not academic: for two days every main-form date
        // produced a RUSH-flagged email and agents quoted the rush rate to people
        // who had simply answered the question we asked them.
        //
        // Both columns were added and confirmed present before anything wrote to
        // them — the 30-hour outage on 7 Sept came from doing that in the other
        // order, and `npm run audit:db` now checks every column written here
        // against the live schema.
        rush_date: isRushRequest ? rushDateIso : null,
        needed_by_date: isRushRequest ? null : rushDateIso,
        customer_attachment_urls: [artworkUrl, artworkUrl2].filter(Boolean) as string[],
        sales_agent: 'WEBSITE_BOT',
        // Real marketing channel, NOT the form/page name (deriveLeadSource was the
        // bug). The CRM can also re-derive this from `attribution`.
        lead_source: trafficSource,
        page_url: pageUrl || null,
        quote_amount: basePrice ?? null,
        email_sent_at: (token && basePrice != null && !internalOnly) ? new Date().toISOString() : null,
        attribution: enrichedAttribution,
      });

    if (dbError) {
      console.error('Supabase quotes insert error (non-blocking):', dbError);
    }

    // Fire Meta CAPI Lead event (non-blocking, but kept alive via after() — a bare
    // fire-and-forget fetch races Next.js returning the response below, and Vercel
    // can freeze/tear down the function mid-flight, which surfaces as a network-level
    // "fetch failed" / SocketError rather than an actual Meta-side failure (seen
    // recurring in production logs, 2026-08-24). after() defers this until the
    // response has been sent WITHOUT blocking it, but keeps the function alive so the
    // request actually completes instead of getting cut off.
    // Uses the client-supplied event_id if present so browser pixel + server dedupe.
    const leadEventId = clientEventId || `lead_${Date.now()}_${customer.email.slice(0, 8)}`;
    const [firstName, ...lastParts] = customer.name.trim().split(/\s+/);
    const lastName = lastParts.join(' ') || undefined;
    // Suspected bots never reach Meta — protects ad-optimization signal quality.
    if (!suspectedBot) after(() =>
      sendMetaEvent({
        eventName: 'Lead',
        eventId: leadEventId,
        actionSource: 'website',
        email: customer.email,
        phone: customer.phone || null,
        firstName,
        lastName,
        externalId: customer.email,
        attribution,
        eventSourceUrl: pageUrl || attribution.page_url,
        // Always send value AND currency together. Meta rejects partial pairs (48% of Lead events were failing this).
        // Only send a value when the calculator actually priced this lead.
        // Unpriced forms (home form, bulk form) send NO value — this route is the
        // highest-volume Lead source on the site and sending 0 for every unpriced
        // form is what produced Events Manager's "57% of price data from website
        // Lead events has formatting issues or missing values" (CL4DE6 §3).
        // metaCapi drops a non-positive value and its currency; passing it
        // explicitly here keeps the intent readable at the call site.
        value: basePrice && basePrice > 0 ? basePrice : undefined,
        currency: 'USD',
        numItems: details.quantity,
        contentName: isBulkOrder ? 'Bulk Quote Request' : 'Quote Request',
        contentCategory: details.patchType || 'Custom Patches',
      }).catch((err) => console.error('[META CAPI] Lead send failed (non-blocking):', err))
    );

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Quote submission failed. Please try again or call us at (302) 250-4340.' },
      { status: 500 }
    );
  }
}
