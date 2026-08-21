import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Real-user Core Web Vitals beacon (2026-08-21, field-CLS-vs-lab-CLS investigation).
 *
 * PSI's lab run never scrolls/clicks/moves the mouse, so it never exercises
 * interaction-gated code (e.g. Tawk's loader) and only ever sees a single short
 * session — real users differ on both counts. This endpoint captures the
 * `web-vitals/attribution` build's culprit-element data from actual visitors so
 * the CLS source can be found from data instead of guessed from priors.
 *
 * Anonymous, no PII, no user/session linkage. Diagnostic — consider dropping
 * `web_vitals_log` (or down-sampling calls) once the culprit is identified.
 */

const supabase = createSupabaseAdminClient();

const ALLOWED_METRICS = new Set(["CLS", "LCP", "INP", "FCP", "TTFB"]);
const ALLOWED_RATINGS = new Set(["good", "needs-improvement", "poor"]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const metric_name = typeof body.name === "string" ? body.name : "";
    if (!ALLOWED_METRICS.has(metric_name)) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const metric_value = Number(body.value);
    if (!Number.isFinite(metric_value) || metric_value < 0 || metric_value > 1_000_000) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const metric_rating = ALLOWED_RATINGS.has(body.rating) ? body.rating : null;
    const metric_id = typeof body.id === "string" ? body.id.slice(0, 100) : null;
    const attribution = typeof body.attribution === "string" ? body.attribution.slice(0, 500) : null;
    const load_state = typeof body.loadState === "string" ? body.loadState.slice(0, 50) : null;
    const page_path = typeof body.path === "string" ? body.path.slice(0, 300) : null;
    const viewport_width = Number.isFinite(Number(body.viewportWidth)) ? Math.round(Number(body.viewportWidth)) : null;
    const connection_type = typeof body.connectionType === "string" ? body.connectionType.slice(0, 50) : null;
    const user_agent = req.headers.get("user-agent")?.slice(0, 300) || null;

    const { error } = await supabase.from("web_vitals_log").insert({
      metric_name,
      metric_value,
      metric_rating,
      metric_id,
      attribution,
      load_state,
      page_path,
      viewport_width,
      connection_type,
      user_agent,
    });

    if (error) {
      console.error("web-vitals insert error:", error);
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // Never let telemetry failures surface to the client.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
