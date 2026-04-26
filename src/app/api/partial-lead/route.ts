import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMetaEvent } from '@/lib/metaCapi';
import { getAttributionFromRequest } from '@/lib/attribution';
import type { Attribution } from '@/lib/metaCapi';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, name, source, attribution: bodyAttribution, eventId: clientEventId } = body as {
      email?: string;
      phone?: string;
      name?: string;
      source?: string;
      attribution?: Partial<Attribution>;
      eventId?: string;
    };

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const attribution = getAttributionFromRequest(req, bodyAttribution);

    await supabase.from('quotes').insert({
      customer_name:  name  || 'Unknown',
      customer_email: email,
      customer_phone: phone || '',
      patches_type:   'Unknown',
      design_backing: 'unknown',
      patches_quantity: 0,
      design_size:    'Unknown',
      instructions:   '[PARTIAL LEAD - left before submitting]',
      sales_agent:    'WEBSITE_BOT',
      lead_source:    source || 'PARTIAL_LEAD',
      attribution,
    });

    // Fire Meta CAPI Contact event. Using Contact (not Lead) so completed
    // quotes don't double-count — Lead fires from /api/quote when the form
    // is fully submitted.
    const eventId = clientEventId || `contact_${Date.now()}_${email.slice(0, 8)}`;
    const [firstName, ...lastParts] = (name || '').trim().split(/\s+/);
    const lastName = lastParts.join(' ') || undefined;
    sendMetaEvent({
      eventName: 'Contact',
      eventId,
      actionSource: 'website',
      email,
      phone: phone || null,
      firstName: firstName || undefined,
      lastName,
      attribution,
      eventSourceUrl: attribution.page_url,
      contentName: 'Partial Quote Form',
      contentCategory: source || 'PARTIAL_LEAD',
    }).catch((err) => console.error('[META CAPI] Contact send failed (non-blocking):', err));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
