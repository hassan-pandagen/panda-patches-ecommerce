import { client } from "@/lib/sanity";
import {
  TRUSTPILOT_RATING,
  TRUSTPILOT_REVIEW_COUNT,
  TRUSTPILOT_LAST_CHECKED,
  TRUSTPILOT_PROFILE_URL,
} from "@/lib/reviewConstants";

/**
 * CompanyFacts reader (CRM↔Website handoff, MASTER v3 Item 1 & 3).
 *
 * The moving numbers (Trustpilot rating/count, shipping countries, dataset
 * stats) live in the Sanity `companyFacts` singleton so the CRM can update them
 * without a code deploy. This reads them at build (revalidate daily) and falls
 * back to reviewConstants if the fetch fails, so the rating never blanks.
 *
 * The rating/count are Trustpilot's VERIFIED numbers only — used for the
 * visible, dated, linked review line, NOT an Organization aggregateRating.
 */
export interface CompanyFacts {
  trustpilotRating: string;
  trustpilotReviewCount: number;
  reviewLastChecked: string;
  trustpilotProfileUrl: string;
  shippingCountries: string[];
  medianOrderPieces: number | null;
  orderDatasetCount: number | null;
}

const FALLBACK: CompanyFacts = {
  trustpilotRating: TRUSTPILOT_RATING,
  trustpilotReviewCount: TRUSTPILOT_REVIEW_COUNT,
  reviewLastChecked: TRUSTPILOT_LAST_CHECKED,
  trustpilotProfileUrl: TRUSTPILOT_PROFILE_URL,
  shippingCountries: ["US", "CA", "GB", "AU"],
  medianOrderPieces: 20,
  orderDatasetCount: 896,
};

export async function getCompanyFacts(): Promise<CompanyFacts> {
  try {
    const data = await client.fetch(
      `*[_id == "companyFacts"][0]{
        trustpilotRating, trustpilotReviewCount, reviewLastChecked,
        shippingCountries, medianOrderPieces, orderDatasetCount
      }`,
      {},
      { next: { revalidate: 86400 } },
    );
    if (!data) return FALLBACK;
    return {
      trustpilotRating: typeof data.trustpilotRating === "string" ? data.trustpilotRating : FALLBACK.trustpilotRating,
      trustpilotReviewCount:
        typeof data.trustpilotReviewCount === "number" ? data.trustpilotReviewCount : FALLBACK.trustpilotReviewCount,
      reviewLastChecked:
        typeof data.reviewLastChecked === "string" ? data.reviewLastChecked : FALLBACK.reviewLastChecked,
      trustpilotProfileUrl: TRUSTPILOT_PROFILE_URL,
      shippingCountries:
        Array.isArray(data.shippingCountries) && data.shippingCountries.length
          ? data.shippingCountries.filter((c: unknown): c is string => typeof c === "string")
          : FALLBACK.shippingCountries,
      medianOrderPieces: typeof data.medianOrderPieces === "number" ? data.medianOrderPieces : FALLBACK.medianOrderPieces,
      orderDatasetCount: typeof data.orderDatasetCount === "number" ? data.orderDatasetCount : FALLBACK.orderDatasetCount,
    };
  } catch {
    return FALLBACK;
  }
}
