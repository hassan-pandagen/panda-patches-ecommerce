import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email, phone, name, source } = await req.json();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

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
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
