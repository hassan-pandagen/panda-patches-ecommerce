/**
 * WEBSIT_4.MD G9 — GA4 funnel events for the AI Patch Generator.
 *
 * All AI generator events go through this module so:
 *   - Event names are defined once (rename here, updates everywhere)
 *   - Param shape is typed (TypeScript catches missing dimensions)
 *   - Tracking never throws into the UI (every call is try/caught)
 *
 * Events fire via window.gtag, which GTM-KQQQ674D already loads on
 * every page. No extra script tag needed.
 *
 * Consistent dimensions on every event (match GA4 custom dimensions):
 *   style            — embroidered | chenille | pvc | woven
 *   shape            — circle | square | shield | oval | rectangle | die-cut
 *   gated            — true once G5 email gate is live, false until then
 *   generation_count — completed generations so far this session
 *
 * Gate events (email_gate_shown, email_captured) are stubs until G5
 * ships — the calls are already placed in the right spots in
 * PatchGeneratorClient so they fire the moment the gate UI exists.
 */

export type AiGenEventName =
  | "ai_generate_start"
  | "ai_generate_complete"
  | "ai_generate_blocked"
  | "ai_handoff_open"
  | "ai_handoff_submit"
  | "ai_handoff_convert"
  | "email_gate_shown"
  | "email_captured";

export interface AiGenEventParams {
  style?: string;
  shape?: string;
  /** false until G5 email gate ships */
  gated?: boolean;
  /** number of completed generations in this browser session */
  generation_count?: number;
  /** "quote" | "order" — only on handoff events */
  intent?: string;
  /** human-readable reason — only on ai_generate_blocked */
  blocked_reason?: string;
}

export function trackAiGen(name: AiGenEventName, params: AiGenEventParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    const gtag = (window as any).gtag;
    if (typeof gtag !== "function") return;
    gtag("event", name, {
      event_category: "ai_patch_generator",
      gated: false, // default; G5 will override per call
      ...params,
    });
  } catch {
    // never let tracking throw into the UI
  }
}
