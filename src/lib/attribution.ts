import type { Attribution } from './metaCapi';

/**
 * Extract Meta/Google attribution fields from a Next.js Request.
 *
 * Reads fbp/fbc from cookies, fbclid/gclid/utm_* from a client-supplied
 * `attribution` field in the body (browser captures these on first visit).
 * Falls back to URL query params if present.
 */
export function getAttributionFromRequest(
  req: Request,
  bodyAttribution?: Partial<Attribution> | null
): Attribution {
  const headers = req.headers;
  const cookieHeader = headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);

  const forwardedFor = headers.get('x-forwarded-for') || '';
  const realIp = headers.get('x-real-ip') || '';
  const ip = (forwardedFor.split(',')[0] || realIp || '').trim() || undefined;

  const ua = headers.get('user-agent') || undefined;
  const referer = headers.get('referer') || undefined;

  let url: URL | null = null;
  try {
    url = new URL(req.url);
  } catch {
    // ignore
  }

  const fbclidFromUrl = url?.searchParams.get('fbclid') || undefined;
  const gclidFromUrl = url?.searchParams.get('gclid') || undefined;

  const attr: Attribution = {
    fbp: bodyAttribution?.fbp || cookies['_fbp'] || undefined,
    fbc: bodyAttribution?.fbc || cookies['_fbc'] || fbclidToFbc(bodyAttribution?.fbclid || fbclidFromUrl),
    gclid: bodyAttribution?.gclid || gclidFromUrl || undefined,
    fbclid: bodyAttribution?.fbclid || fbclidFromUrl || undefined,
    client_ip: ip,
    client_ua: ua,
    page_url: bodyAttribution?.page_url || referer,
    referrer: bodyAttribution?.referrer,
    utm_source: bodyAttribution?.utm_source,
    utm_medium: bodyAttribution?.utm_medium,
    utm_campaign: bodyAttribution?.utm_campaign,
  };

  for (const k of Object.keys(attr) as (keyof Attribution)[]) {
    if (attr[k] === undefined || attr[k] === '') delete attr[k];
  }
  return attr;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    const v = decodeURIComponent(part.slice(idx + 1).trim());
    if (k) out[k] = v;
  }
  return out;
}

/**
 * Synthesize an _fbc cookie value from a raw fbclid URL param.
 * Format: fb.1.<timestamp_ms>.<fbclid>
 */
function fbclidToFbc(fbclid: string | undefined): string | undefined {
  if (!fbclid) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
}

/**
 * Derive a marketing-friendly `lead_source` label from an Attribution blob.
 *
 * Matches the resolver the CRM dev deployed on the Square + payment-form side
 * (June 2026 handoff). Used by the website's Stripe + PayPal webhooks so every
 * order written from the website lands in the CRM with the right channel tag
 * instead of a generic "Checkout".
 *
 * Resolution order:
 *   1. UTM source (utm_source), mapped through a known-vendor table
 *   2. Referrer / page URL, matched against a regex rule list
 *   3. Title-cased utm_source as a last-resort label
 *   4. "Checkout" if nothing matched (preserves the legacy value)
 *
 * Order-write callers should set `sales_agent: 'WEB_CHECKOUT'` separately;
 * sales_agent and lead_source are different axes (who closed the sale vs
 * which channel produced the lead).
 */
export function resolveLeadSource(
  attribution: Partial<Attribution> | null | undefined
): string {
  const utm = (attribution?.utm_source || '').toLowerCase();
  const utmMap: Record<string, string> = {
    facebook: 'Facebook',
    fb: 'Facebook',
    instagram: 'Instagram',
    ig: 'Instagram',
    google: 'Google',
    bing: 'Bing',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    'chatgpt.com': 'ChatGPT',
    chatgpt: 'ChatGPT',
    perplexity: 'Perplexity',
    gemini: 'Gemini',
  };
  if (utm && utmMap[utm]) return utmMap[utm];

  const ref = attribution?.referrer || attribution?.page_url || '';
  const rules: Array<[RegExp, string]> = [
    [/chatgpt|openai/i, 'ChatGPT'],
    [/perplexity\.ai/i, 'Perplexity'],
    [/claude\.ai|anthropic/i, 'Claude'],
    [/gemini\.google|bard\.google/i, 'Gemini'],
    [/meta\.ai/i, 'Meta AI'],
    [/deepseek\.com/i, 'DeepSeek'],
    [/facebook\.com|fb\.com|m\.facebook/i, 'Facebook'],
    [/instagram\.com/i, 'Instagram'],
    [/tiktok\.com/i, 'TikTok'],
    [/youtube\.com|youtu\.be/i, 'YouTube'],
    [/linkedin\.com/i, 'LinkedIn'],
    [/reddit\.com/i, 'Reddit'],
    [/google\.[a-z.]+/i, 'Google'],
    [/bing\.com/i, 'Bing'],
  ];
  for (const [re, label] of rules) {
    if (re.test(ref)) return label;
  }

  if (utm) return utm.charAt(0).toUpperCase() + utm.slice(1);
  return 'Checkout';
}
