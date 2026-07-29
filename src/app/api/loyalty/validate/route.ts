import { NextResponse } from "next/server";
import { z } from "zod";
import { validateLoyaltyCode, REASON_COPY } from "@/lib/loyalty";

export const runtime = "nodejs";

/**
 * Website-side validate endpoint (loyalty Task 1). The browser calls THIS; it
 * holds no secret and never reaches the CRM function directly. Rate-limited per
 * (IP + email) so a member code can't be brute-forced. This is only a preview —
 * checkout-square re-validates authoritatively before the Square link is made,
 * so a tampered client response can't change the charged amount.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function isLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

const Schema = z.object({
  code: z.string().min(1).max(64),
  email: z.string().email(),
  pricingSource: z.enum(["calculator", "custom_quote"]).optional(),
});

export async function POST(req: Request) {
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { valid: false, reason: "server_error", message: REASON_COPY.server_error },
      { status: 400 },
    );
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { valid: false, reason: "server_error", message: "Enter your code and email first." },
      { status: 400 },
    );
  }
  const { code, email, pricingSource } = parsed.data;

  if (isLimited(`${ip}|${email.toLowerCase()}`)) {
    return NextResponse.json(
      { valid: false, reason: "server_error", message: "Too many attempts — please wait a few minutes." },
      { status: 429 },
    );
  }

  const result = await validateLoyaltyCode(code, email, pricingSource || "calculator");
  return NextResponse.json({
    valid: result.valid,
    tier: result.tier,
    percent: result.percent,
    reason: result.reason,
    message: REASON_COPY[result.reason] || REASON_COPY.server_error,
  });
}
