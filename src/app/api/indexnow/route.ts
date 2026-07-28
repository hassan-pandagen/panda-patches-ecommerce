import { NextResponse } from 'next/server';

/**
 * IndexNow submission endpoint (Appendix B2 automation).
 *
 * Pings api.indexnow.org for ONLY the URLs it is given — never the whole site —
 * so it is safe to call on every publish/update without the repeated-full-list
 * flooding that risks a Bing blacklist (the caveat noted in indexnow-ping.mjs).
 *
 * Wire it up (owner, one-time): create a Sanity webhook that fires on publish of
 * page/blog documents, with an HTTP target of POST {SITE}/api/indexnow, a header
 * `x-indexnow-secret: <INDEXNOW_SECRET>`, and a projection body that resolves the
 * changed document to its absolute URL(s), e.g. `{ "urls": [ $baseUrl + "/" + slug.current ] }`.
 * Set INDEXNOW_SECRET in the deployment env. Without it configured, this route
 * refuses every request, so it cannot be abused to spam IndexNow.
 */

const KEY = '691f8f86a172454aa3696b3d2407ff46';
const HOST = 'www.pandapatches.com';
const ORIGIN = `https://${HOST}`;

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const secret = process.env.INDEXNOW_SECRET;
  if (!secret || req.headers.get('x-indexnow-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const raw = (body as { urls?: unknown })?.urls;
  const urls = Array.isArray(raw) ? raw.filter((u): u is string => typeof u === 'string') : [];
  // Same-host only, de-duped, capped — a webhook should send 1-2 changed URLs,
  // never a bulk list. The cap is a floor-flooding backstop.
  const clean = [...new Set(urls)].filter((u) => u.startsWith(`${ORIGIN}/`)).slice(0, 50);

  if (!clean.length) {
    return NextResponse.json({ error: 'no valid same-host urls' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: clean }),
    });
    return NextResponse.json(
      { submitted: clean.length, indexnowStatus: res.status },
      { status: res.ok || res.status === 202 ? 200 : 502 },
    );
  } catch (err) {
    return NextResponse.json({ error: 'indexnow request failed', detail: String(err) }, { status: 502 });
  }
}
