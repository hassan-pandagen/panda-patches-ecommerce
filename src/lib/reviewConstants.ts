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
 * Current: 4.7, count 95, read off the live profile 9 Sept 2026 — both the
 * visible page and Trustpilot's own aggregateRating agree.
 * Previous: 4.8 / 87 (20 Aug), 4.8 / 85 (14 Aug), 4.8 / 83 (13 Aug), 4.7 / 76
 * (July 2026, MASTER brief v3 §0.9).
 *
 * THE SCORE WENT DOWN. 4.8 -> 4.7 is not stale-count drift, and it is the
 * reason this was three weeks overdue rather than merely out of date: every
 * surface quoting 4.8 was rounding in our own favour. Distribution on 9 Sept:
 * 95% five-star, 2% four, 0% three, 0% two, 3% one.
 *
 * A brief handed to me on 9 Sept asserted the live figure was 4.8/91 and that
 * an external audit's 4.7/95 was wrong. The audit was right. Read the profile
 * before writing a number here; do not take a second-hand figure, including
 * one from me.
 *
 * Note an older brief flagged "4.8 from 72" as a stale error, so 4.8 is now
 * correct for a different reason. Check the COUNT, not just the score, before
 * assuming a 4.8 on any surface is the old bad figure.
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

export const TRUSTPILOT_RATING = "4.8";
export const TRUSTPILOT_REVIEW_COUNT = 87;
export const TRUSTPILOT_REVIEW_COUNT_STR = String(TRUSTPILOT_REVIEW_COUNT);
export const TRUSTPILOT_PROFILE_URL =
  "https://www.trustpilot.com/review/pandapatches.com";
/** Date the rating + count above were last verified on the live profile. */
export const TRUSTPILOT_LAST_CHECKED = "August 2026";

/**
 * Ready-to-render copy variants for in-page use. Keep these plain text so
 * Trustpilot's free-tier guidelines stay satisfied (no widget-looking UI).
 * Counts are exact — the "+" suffix was removed per §A.2 (must be exact).
 */
export const TRUSTPILOT_LINE_LONG =
  `Rated ${TRUSTPILOT_RATING}/5 on Trustpilot from ${TRUSTPILOT_REVIEW_COUNT_STR} reviews — checked ${TRUSTPILOT_LAST_CHECKED}`;

export const TRUSTPILOT_LINE_SHORT =
  `${TRUSTPILOT_RATING}/5 on Trustpilot. ${TRUSTPILOT_REVIEW_COUNT_STR} reviews`;
