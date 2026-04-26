/**
 * Trustpilot review data.
 * Fallback values used if live fetch fails.
 * Live data fetched from /api/trustpilot-rating (cached 24h).
 */

// Fallback defaults (updated manually as a safety net)
// Verified against the Trustpilot widget on 2026-04-24: 4.8 rating, 65 reviews.
// Schema must match the widget exactly — Google cross-checks via sameAs URL.
// When new reviews arrive, update the count here AND the archive in TRUSTPILOT_REVIEWS.md.
export const TRUSTPILOT_RATING = "4.8";
export const TRUSTPILOT_REVIEW_COUNT = 65;
export const TRUSTPILOT_REVIEW_COUNT_STR = "65";
export const TRUSTPILOT_URL = "https://www.trustpilot.com/review/pandapatches.com";

interface TrustpilotData {
  rating: string;
  reviewCount: number;
  source: 'live' | 'fallback';
}

/**
 * Fetch live Trustpilot data (server-side).
 * Uses Next.js fetch cache with 24h revalidation.
 * Falls back to constants if fetch fails.
 */
export async function getTrustpilotData(): Promise<TrustpilotData> {
  try {
    const baseUrl = process.env.APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/trustpilot-rating`, {
      next: { revalidate: 86400 }, // 24 hours
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall through to defaults
  }

  return {
    rating: TRUSTPILOT_RATING,
    reviewCount: TRUSTPILOT_REVIEW_COUNT,
    source: 'fallback',
  };
}
