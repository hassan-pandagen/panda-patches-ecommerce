/**
 * Trustpilot rating constants - single source of truth.
 *
 * These MUST match the displayed numbers on the live Trustpilot widget at
 * https://www.trustpilot.com/review/pandapatches.com so the visible site
 * rating and any future schema markup stay legally accurate.
 *
 * Update path:
 *   1. Open the Trustpilot profile, read the TrustScore + total review count
 *   2. Update both constants below
 *   3. Update TRUSTPILOT_REVIEWS.md "last updated" date
 *   4. Ship the change
 *
 * Owner canon July 2026 (MASTER brief v3 §0.9): TrustScore 4.7, count 76.
 * Full per-review log lives in TRUSTPILOT_REVIEWS.md — update both together.
 *
 * SEDAA3_1 §A.2 rules (do not violate):
 *   - These figures are THIRD-PARTY sourced: they may NOT feed an
 *     Organization/LocalBusiness aggregateRating (ineligible under Google's
 *     Review Snippet guidelines). Product aggregateRating only for
 *     product-specific reviews that are visible on that page.
 *   - On-page use must be EXACT (no "75+"), DATED, and LINKED to the profile.
 *   - Refresh monthly; bump TRUSTPILOT_LAST_CHECKED in the same commit.
 *
 * Trustpilot free plan constraints (do not violate):
 *   - No widgets, no Trustpilot logo, no star imagery that mimics theirs
 *   - Plain text + plain link to the profile is allowed
 */

export const TRUSTPILOT_RATING = "4.7";
export const TRUSTPILOT_REVIEW_COUNT = 76;
export const TRUSTPILOT_REVIEW_COUNT_STR = String(TRUSTPILOT_REVIEW_COUNT);
export const TRUSTPILOT_PROFILE_URL =
  "https://www.trustpilot.com/review/pandapatches.com";
/** Date the rating + count above were last verified on the live profile. */
export const TRUSTPILOT_LAST_CHECKED = "July 2026";

/**
 * Ready-to-render copy variants for in-page use. Keep these plain text so
 * Trustpilot's free-tier guidelines stay satisfied (no widget-looking UI).
 * Counts are exact — the "+" suffix was removed per §A.2 (must be exact).
 */
export const TRUSTPILOT_LINE_LONG =
  `Rated ${TRUSTPILOT_RATING}/5 on Trustpilot from ${TRUSTPILOT_REVIEW_COUNT_STR} reviews — checked ${TRUSTPILOT_LAST_CHECKED}`;

export const TRUSTPILOT_LINE_SHORT =
  `${TRUSTPILOT_RATING}/5 on Trustpilot. ${TRUSTPILOT_REVIEW_COUNT_STR} reviews`;
