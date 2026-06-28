/**
 * Client-side helpers to capture Meta/Google attribution at first visit
 * and retrieve it when a form is submitted. Runs in browser only.
 *
 * Strategy: on every page load read cookies + URL params, merge with any
 * previously-stored attribution, and stash in localStorage. Forms and
 * chat widgets call `getStoredAttribution()` to include it in payloads.
 */

const STORAGE_KEY = 'pp_attribution_v1';

export interface ClientAttribution {
  fbp?: string;
  fbc?: string;
  gclid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  msclkid?: string;
  ttclid?: string;
  page_url?: string;
  referrer?: string;
  first_seen_at?: string;
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const parts = document.cookie.split(';');
  for (const raw of parts) {
    const p = raw.trim();
    if (p.startsWith(name + '=')) {
      return decodeURIComponent(p.slice(name.length + 1));
    }
  }
  return undefined;
}

export function captureAttribution(): ClientAttribution {
  if (typeof window === 'undefined') return {};

  let existing: ClientAttribution = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) existing = JSON.parse(raw) as ClientAttribution;
  } catch {
    // ignore
  }

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid') || undefined;
  const gclid = params.get('gclid') || undefined;
  const msclkid = params.get('msclkid') || undefined;
  const ttclid = params.get('ttclid') || undefined;
  const utm_source = params.get('utm_source') || undefined;
  const utm_medium = params.get('utm_medium') || undefined;
  const utm_campaign = params.get('utm_campaign') || undefined;
  const utm_term = params.get('utm_term') || undefined;
  const utm_content = params.get('utm_content') || undefined;

  const fbp = readCookie('_fbp');
  const fbc = readCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  // First-touch wins (existing values kept) so the utm tags + click IDs survive
  // if the customer browses other pages before they submit.
  const merged: ClientAttribution = {
    first_seen_at: existing.first_seen_at || new Date().toISOString(),
    fbp: fbp || existing.fbp,
    fbc: fbc || existing.fbc,
    fbclid: fbclid || existing.fbclid,
    gclid: gclid || existing.gclid,
    msclkid: msclkid || existing.msclkid,
    ttclid: ttclid || existing.ttclid,
    utm_source: utm_source || existing.utm_source,
    utm_medium: utm_medium || existing.utm_medium,
    utm_campaign: utm_campaign || existing.utm_campaign,
    utm_term: utm_term || existing.utm_term,
    utm_content: utm_content || existing.utm_content,
    page_url: existing.page_url || window.location.href,
    referrer: existing.referrer || document.referrer || undefined,
  };

  for (const k of Object.keys(merged) as (keyof ClientAttribution)[]) {
    if (merged[k] === undefined) delete merged[k];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
  return merged;
}

export function getStoredAttribution(): ClientAttribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ClientAttribution;
  } catch {
    // ignore
  }
  return captureAttribution();
}

export function generateEventId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${rand}`;
}
