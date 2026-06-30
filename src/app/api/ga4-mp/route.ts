import { NextResponse } from "next/server";

/**
 * GA4 Measurement Protocol relay.
 *
 * The browser (src/lib/ga4.ts) reads the visitor's GA4 client_id + session_id from
 * the `_ga` cookies and POSTs the conversion here; this route forwards it to GA4
 * using the server-only GA4_MP_API_SECRET. GA4 runs through GTM on this site with
 * no tag for our custom events, so this is how `generate_lead` / `purchase` actually
 * reach GA4 (and attribute to the right channel, e.g. Paid Social / Meta).
 *
 * Requires env GA4_MP_API_SECRET. Measurement ID is public, safe to ship.
 */

const MEASUREMENT_ID = "G-Y391W132NR";
const ALLOWED_EVENTS = new Set(["generate_lead", "purchase"]);

export async function POST(req: Request) {
  try {
    const secret = process.env.GA4_MP_API_SECRET;
    // Not configured (e.g. env var missing) — accept silently so the client beacon
    // never errors; nothing is sent until the secret is set in the environment.
    if (!secret) return NextResponse.json({ ok: false }, { status: 200 });

    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name : "";
    const client_id = typeof body?.client_id === "string" ? body.client_id : "";
    const params =
      body && typeof body.params === "object" && body.params
        ? (body.params as Record<string, unknown>)
        : {};

    // Only forward our known conversion events, and only with a real client_id —
    // keeps the public endpoint from being used to inject arbitrary GA4 events.
    if (!ALLOWED_EVENTS.has(name) || !client_id) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const payload = {
      client_id,
      // engagement_time_msec makes GA4 treat this as an engaged-session event so it
      // counts; session_id (passed through in params when available) lands it in the
      // visitor's current session for correct channel attribution.
      events: [{ name, params: { engagement_time_msec: 1, ...params } }],
    };

    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${encodeURIComponent(
        secret
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // Never surface tracking failures.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
