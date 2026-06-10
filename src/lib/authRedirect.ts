import "server-only";

import { resolveBaseUrl } from "./checkoutConfig";

const ALLOWED_AUTH_ORIGINS = new Set<string>([
  "https://www.pandapatches.com",
  "https://pandapatches.com",
]);

/**
 * Pick the base URL we want Supabase to redirect back to after a magic-link /
 * password-reset / signup-confirm link is clicked.
 *
 * Inputs (in priority order):
 *   1. clientOrigin (sent by the form in the JSON body, e.g. window.location.origin)
 *   2. originHeader (req.headers.get("origin"), unreliable on cross-origin POSTs)
 *
 * Acceptance rules:
 *   - localhost / 127.0.0.1 are always accepted in non-production builds
 *   - https://www.pandapatches.com / https://pandapatches.com always accepted
 *   - Anything else is rejected and we fall back to the canonical resolver
 *     (defence against open-redirect: attacker can't request a magic link
 *     pointed at their own domain).
 */
export function resolveAuthBaseUrl(
  clientOrigin?: string | null,
  originHeader?: string | null
): string {
  const candidates = [clientOrigin, originHeader].filter(
    (v): v is string => typeof v === "string" && v.length > 0
  );

  for (const candidate of candidates) {
    try {
      const url = new URL(candidate);
      const host = url.hostname;

      // Dev allow-list
      if (
        process.env.NODE_ENV !== "production" &&
        (host === "localhost" || host === "127.0.0.1")
      ) {
        return `${url.protocol}//${url.host}`;
      }

      // Production allow-list
      const normalized = `${url.protocol}//${url.host}`.toLowerCase();
      if (ALLOWED_AUTH_ORIGINS.has(normalized)) {
        return normalized;
      }
    } catch {
      // malformed — skip
    }
  }

  // Nothing matched — fall back to the canonical resolver. In prod that returns
  // https://www.pandapatches.com. In dev it honours APP_URL or also returns
  // the canonical domain (which is wrong for localhost — but only matters
  // when origin detection failed entirely, which itself is an error case).
  return resolveBaseUrl(null);
}
