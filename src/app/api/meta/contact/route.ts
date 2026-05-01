import { NextRequest, NextResponse } from 'next/server';
import { sendMetaEvent, type Attribution } from '@/lib/metaCapi';

/**
 * Meta CAPI mirror for Tawk.to chat events (and other Contact triggers).
 *
 * Browser fires `fbq('track', 'Contact', {...}, { eventID })` at the same
 * time it POSTs here with the same eventId — Meta dedupes the pair and
 * uses whichever has the higher match-quality signal (server-side wins
 * because it adds client_ip, client_ua, and any known email/phone).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { eventId, fbp, fbc, source, email, phone, firstName } = body || {};

    if (!eventId || typeof eventId !== 'string') {
      return NextResponse.json({ error: 'eventId required' }, { status: 400 });
    }

    const ua = req.headers.get('user-agent') || undefined;
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || undefined;
    const referer = req.headers.get('referer') || 'https://www.pandapatches.com/';

    const attribution: Attribution = {
      fbp: typeof fbp === 'string' ? fbp : undefined,
      fbc: typeof fbc === 'string' ? fbc : undefined,
      client_ip: ip,
      client_ua: ua,
      page_url: referer,
    };

    sendMetaEvent({
      eventName: 'Contact',
      eventId,
      actionSource: 'chat',
      eventSourceUrl: referer,
      email: typeof email === 'string' ? email : null,
      phone: typeof phone === 'string' ? phone : null,
      firstName: typeof firstName === 'string' ? firstName : null,
      attribution,
      contentName: 'Tawk Chat Started',
      contentCategory: typeof source === 'string' ? source : 'tawk',
    }).catch((err) => console.error('[META CAPI] Contact send failed:', err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
