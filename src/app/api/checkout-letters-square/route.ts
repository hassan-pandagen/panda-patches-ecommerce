/**
 * Chenille letter/number package checkout (CLDB68).
 *
 * A separate route from checkout-offers-square rather than an extension of it.
 * The two share Square plumbing but nothing else: an OfferPack is priced by
 * (categoryId, packName) lookup, while a letter set is priced by package +
 * glitter + per-glyph Velcro, carries a customer-selected size, and — the part
 * that matters — carries a COLOUR MATCH that gates production. Widening the
 * offers schema with five optional fields that only ever apply to two products
 * would put that gate one forgotten `if` away from being skipped.
 *
 * NO MOCKUP CYCLE. These are standard glyphs, so there is no artwork to approve.
 * The single approval touchpoint is the colour match.
 *
 * THE GATE IS ENFORCED IN THE CRM, NOT HERE (CEO, 2026-09-03). This route's job
 * is to make the requirement unmissable and machine-readable:
 *   - colour_match_required: true      <- the flag the webhook reads
 *   - colour_match_status              <- which confirmation path applies
 *   - customer_colour_input (verbatim) <- never normalised away
 *   - customer_colour_hex              <- parsed when parseable
 *   - instructions                     <- human-readable DO NOT START text
 * The CRM sets COLOUR_MATCH_PENDING from the flag and blocks the transition to
 * IN_PRODUCTION while matched_yarn is empty. See the CRM brief for that half.
 */
import { NextResponse, after } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import {
  getLetterPackage,
  calculateLetterPackageTotal,
  letterColourGate,
  colourGateOrderNote,
  GLITTER_OPTIONS,
} from '@/lib/letterPackages';
import { resolveBaseUrl } from '@/lib/checkoutConfig';
import { SELECTABLE_BACKINGS } from '@/lib/factConstants';
import { createSquarePaymentLink } from '@/lib/square';
import { sendMetaEvent } from '@/lib/metaCapi';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const supabase = createSupabaseAdminClient();

const Schema = z.object({
  packageId: z.enum(['chenille-alphabet', 'chenille-numbers']),
  size: z.number().min(2).max(5),
  /** Verbatim customer input. Deliberately permissive — a Pantone code, a colour
   *  name and a hex are all valid, and rejecting an unrecognised string here
   *  would be the website guessing, which is exactly what the gate prevents. */
  letterColour: z.string().min(1).max(60),
  glitter: z.enum(GLITTER_OPTIONS).nullable().optional(),
  backing: z.string().min(1).max(50),
  customer: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[\d\s\-()+]+$/).optional().or(z.literal('')),
  }),
  shippingAddress: z.string().max(500).optional().or(z.literal('')),
  specialInstructions: z.string().max(500).optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  attribution: z.any().optional(),
  initiateCheckoutEventId: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const {
      packageId, size, letterColour, glitter, backing, customer,
      shippingAddress, specialInstructions, company, attribution,
      initiateCheckoutEventId,
    } = parsed.data;

    const pkg = getLetterPackage(packageId);
    if (!pkg) return NextResponse.json({ error: 'Invalid package' }, { status: 400 });

    // Size must be one the package actually offers — not merely inside the range.
    if (!pkg.sizes.includes(size)) {
      return NextResponse.json({ error: 'Invalid size for this package' }, { status: 400 });
    }
    if (!SELECTABLE_BACKINGS.some((b) => b.label.toLowerCase() === backing.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid backing' }, { status: 400 });
    }

    // SECURITY: priced server-side from canon. The client never supplies a total.
    const price = calculateLetterPackageTotal({ packageId, glitter: glitter ?? null, backing });
    if (!price) return NextResponse.json({ error: 'Pricing failed' }, { status: 500 });

    const gate = letterColourGate(letterColour);

    const productName =
      `${pkg.name} — ${size}" ${gate.raw}` + (glitter ? ` + ${glitter} glitter` : '');

    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    const baseUrl = resolveBaseUrl(origin);

    const instructionsParts = [
      colourGateOrderNote(gate),
      `Set: ${pkg.pieces} pieces at ${size} inches`,
      glitter ? `Glitter background: ${glitter} (+$${pkg.glitterFee})` : null,
      price.velcro > 0 ? `Velcro backing: ${pkg.pieces} x $0.35 = $${price.velcro.toFixed(2)}` : null,
      'NO MOCKUP CYCLE — standard glyphs. Colour match is the only approval step.',
      specialInstructions ? `Instructions: ${specialInstructions}` : null,
      company ? `Company: ${company}` : null,
    ].filter(Boolean);

    const clientIp =
      (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      req.headers.get('x-real-ip') || '';
    const ua = req.headers.get('user-agent') || '';
    const pageUrl = req.headers.get('referer') || `${baseUrl}/chenille-letters`;
    const mergedAttribution = {
      ...(attribution || {}),
      ...(clientIp ? { client_ip: clientIp } : {}),
      ...(ua ? { client_ua: ua } : {}),
      ...(attribution?.page_url ? {} : { page_url: pageUrl }),
    };

    const token = randomUUID();
    const orderData = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      shipping_address: (shippingAddress || '').substring(0, 500),
      product_name: productName,
      quantity: pkg.pieces,
      backing,
      design_size: `${size}" tall`,
      artwork_url: '',
      instructions: instructionsParts.join(' | '),
      delivery_option: 'standard',
      rush_date: '',
      website_addons: glitter ? [`${glitter} glitter background`] : null,
      order_amount: price.total,
      attribution: mergedAttribution,
      user_id: '',
      lead_source: 'CHENILLE_LETTER_PACKAGE',
      sales_agent: 'WEBSITE_BOT',
      order_source: 'CHENILLE_LETTER_PACKAGE',

      // --- the colour-match contract with the CRM ---------------------------
      // These five are what the CRM reads. Renaming any of them is a breaking
      // change to the gate; coordinate with the CRM repo before touching them.
      colour_match_required: true,
      colour_match_status: gate.path, // 'standard' | 'needs-customer-confirmation'
      customer_colour_input: gate.raw,
      customer_colour_hex: gate.hex,
      matched_yarn: null, // a supervisor fills this; production is blocked until they do
    };

    const { error: pendingErr } = await supabase
      .from('square_pending_orders')
      .insert({ token, order_data: orderData });
    if (pendingErr) {
      console.error('[checkout-letters-square] pending insert failed:', pendingErr);
      return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 });
    }

    const redirectUrl = `${baseUrl}/success?provider=square&ref=${token}&value=${price.total.toFixed(2)}`;

    const { url } = await createSquarePaymentLink({
      token,
      itemName: productName.substring(0, 255),
      amount: price.total,
      buyerEmail: customer.email,
      redirectUrl,
      metadata: { pkg: packageId, size: String(size), glitter: glitter ?? 'none' },
    });

    await supabase
      .from('checkout_attempts')
      .upsert(
        {
          customer_email: customer.email,
          customer_name: customer.name,
          customer_phone: customer.phone || null,
          product_name: productName,
          quantity: pkg.pieces,
          design_size: `${size}" tall`,
          backing: backing || null,
          delivery_option: 'standard',
          cart_value: price.total,
          payment_provider: 'square',
          provider_session_id: token,
          return_url: pageUrl.startsWith(baseUrl) ? pageUrl : `${baseUrl}/chenille-letters`,
          fbp: attribution?.fbp || null,
          fbc: attribution?.fbc || null,
          attribution: attribution || null,
          status: 'PENDING',
          initiated_at: new Date().toISOString(),
        },
        { onConflict: 'provider_session_id' },
      )
      .then(({ error }) => {
        if (error) console.error('checkout_attempts upsert (letters):', error);
      });

    if (initiateCheckoutEventId) {
      const [icFirst, ...icLast] = (customer.name || '').trim().split(/\s+/);
      after(() =>
        sendMetaEvent({
          eventName: 'InitiateCheckout',
          eventId: initiateCheckoutEventId,
          actionSource: 'website',
          eventSourceUrl: pageUrl,
          email: customer.email,
          phone: customer.phone || null,
          firstName: icFirst,
          lastName: icLast.join(' ') || null,
          externalId: customer.email,
          attribution: { ...(attribution || {}), client_ip: clientIp || undefined, client_ua: ua || undefined },
          value: price.total,
          currency: 'USD',
          contentName: productName,
          contentCategory: 'Chenille Letters',
          numItems: pkg.pieces,
          orderId: token,
        }).catch((err) =>
          console.error('[META CAPI] InitiateCheckout (letters) failed:', err),
        ),
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Letter package checkout error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
