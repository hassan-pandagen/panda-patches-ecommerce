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
