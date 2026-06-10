import {
  TRUSTPILOT_RATING,
  TRUSTPILOT_REVIEW_COUNT_STR,
  TRUSTPILOT_PROFILE_URL,
} from "@/lib/reviewConstants";

/**
 * Plain-text Trustpilot rating line. No logo, no fake star imagery, no
 * widget-shaped chrome. Trustpilot's free plan only permits plain text and a
 * normal link to the profile, so the rendering stays strictly typographic and
 * styled in our brand only.
 *
 * Drop this in the hero, the homepage band, the reviews page hero, or any
 * other trust-building slot. Numbers come from src/lib/reviewConstants.ts
 * so future updates land in one place.
 */
type Variant = "default" | "compact" | "dark";

export default function TrustpilotRatingLine({
  variant = "default",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const baseColor =
    variant === "dark" ? "text-white" : "text-panda-dark";
  const linkColor =
    variant === "dark"
      ? "text-panda-yellow hover:text-white"
      : "text-panda-green hover:text-panda-dark";

  if (variant === "compact") {
    return (
      <p className={`text-[12px] font-bold ${baseColor} ${className}`}>
        <span className="font-black">{TRUSTPILOT_RATING}/5</span>{" "}
        <span className="font-semibold text-gray-500">
          on Trustpilot. {TRUSTPILOT_REVIEW_COUNT_STR}+ reviews.
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
    <p className={`text-[13px] md:text-[14px] font-semibold leading-[1.5] ${baseColor} ${className}`}>
      Rated{" "}
      <span className="font-black">{TRUSTPILOT_RATING}/5</span>{" "}
      by{" "}
      <span className="font-black">{TRUSTPILOT_REVIEW_COUNT_STR}+</span>{" "}
      customers on{" "}
      <a
        href={TRUSTPILOT_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline underline-offset-2 font-bold ${linkColor}`}
      >
        Trustpilot
      </a>
    </p>
  );
}
