import { getCompanyFacts } from "@/lib/companyFacts";

/**
 * Plain-text Trustpilot rating line. No logo, no fake star imagery, no
 * widget-shaped chrome. Trustpilot's free plan only permits plain text and a
 * normal link to the profile, so the rendering stays strictly typographic and
 * styled in our brand only.
 *
 * Numbers come from the CMS `companyFacts` singleton via getCompanyFacts()
 * (CRM-writable, so the rating can move without a code deploy), with
 * reviewConstants as the build-time fallback. Async server component — both
 * current call sites (Hero, /reviews) are server components.
 */
type Variant = "default" | "compact" | "dark";

export default async function TrustpilotRatingLine({
  variant = "default",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const facts = await getCompanyFacts();
  const TRUSTPILOT_RATING = facts.trustpilotRating;
  const TRUSTPILOT_REVIEW_COUNT_STR = String(facts.trustpilotReviewCount);
  const TRUSTPILOT_PROFILE_URL = facts.trustpilotProfileUrl;
  const reviewLastChecked = facts.reviewLastChecked;

  const baseColor =
    variant === "dark" ? "text-white" : "text-panda-dark";
  const linkColor =
    variant === "dark"
      ? "text-panda-yellow hover:text-white"
      : "text-panda-green hover:text-panda-dark";

  if (variant === "compact") {
    return (
      <p className={`text-[0.75rem] font-bold ${baseColor} ${className}`}>
        <span className="font-black">{TRUSTPILOT_RATING}/5</span>{" "}
        <span className="font-semibold text-gray-500">
          on Trustpilot from {TRUSTPILOT_REVIEW_COUNT_STR} reviews (checked {reviewLastChecked}).
        </span>{" "}
        <a
          href={TRUSTPILOT_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 font-bold ${linkColor}`}
        >
          Read reviews
        </a>
      </p>
    );
  }

  return (
    <p className={`text-[0.8125rem] md:text-[0.875rem] font-semibold leading-[1.5] ${baseColor} ${className}`}>
      Rated{" "}
      <span className="font-black">{TRUSTPILOT_RATING}/5</span>{" "}
      on{" "}
      <a
        href={TRUSTPILOT_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline underline-offset-2 font-bold ${linkColor}`}
      >
        Trustpilot
      </a>{" "}
      from <span className="font-black">{TRUSTPILOT_REVIEW_COUNT_STR}</span> reviews &mdash; checked {reviewLastChecked}
    </p>
  );
}
