import { NextResponse } from 'next/server';

const TRUSTPILOT_URL = 'https://www.trustpilot.com/review/pandapatches.com';
const FALLBACK_RATING = '4.8';
const FALLBACK_COUNT = 64;

interface TrustpilotData {
  rating: string;
  reviewCount: number;
  source: 'live' | 'fallback';
}

let cached: { data: TrustpilotData; timestamp: number } | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function fetchTrustpilotData(): Promise<TrustpilotData> {
  // Return cache if fresh
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(TRUSTPILOT_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PandaPatches/1.0)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    // Extract rating from JSON-LD schema on the page
    const jsonLdMatch = html.match(/"ratingValue"\s*:\s*"?([\d.]+)"?/);
    const countMatch = html.match(/"reviewCount"\s*:\s*"?(\d+)"?/);

    if (jsonLdMatch && countMatch) {
      const data: TrustpilotData = {
        rating: jsonLdMatch[1],
        reviewCount: parseInt(countMatch[1], 10),
        source: 'live',
      };
      cached = { data, timestamp: Date.now() };
      return data;
    }

    throw new Error('Could not parse rating data from page');
  } catch {
    // Return cached data if available, otherwise fallback
    if (cached) return cached.data;
    return { rating: FALLBACK_RATING, reviewCount: FALLBACK_COUNT, source: 'fallback' };
  }
}

// Revalidate once per day via Next.js ISR
export const revalidate = 86400;

export async function GET() {
  const data = await fetchTrustpilotData();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
    },
  });
}
