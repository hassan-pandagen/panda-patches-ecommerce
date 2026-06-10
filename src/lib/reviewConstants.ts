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
 * Source of truth as of 2026-06-10 (verified live against the Trustpilot
 * profile widget): rating 4.8, count 69.
 *
 * Trustpilot free plan constraints (do not violate):
 *   - No widgets, no Trustpilot logo, no star imagery that mimics theirs
 *   - Plain text + plain link to the profile is allowed
 */

export const TRUSTPILOT_RATING = "4.8";
export const TRUSTPILOT_REVIEW_COUNT = 69;
export const TRUSTPILOT_REVIEW_COUNT_STR = String(TRUSTPILOT_REVIEW_COUNT);
export const TRUSTPILOT_PROFILE_URL =
  "https://www.trustpilot.com/review/pandapatches.com";

/**
 * Ready-to-render copy variants for in-page use. Keep these plain text so
 * Trustpilot's free-tier guidelines stay satisfied (no widget-looking UI).
 */
export const TRUSTPILOT_LINE_LONG =
  `Rated ${TRUSTPILOT_RATING}/5 by ${TRUSTPILOT_REVIEW_COUNT_STR}+ customers on Trustpilot`;

export const TRUSTPILOT_LINE_SHORT =
  `${TRUSTPILOT_RATING}/5 on Trustpilot. ${TRUSTPILOT_REVIEW_COUNT_STR}+ reviews`;
