/**
 * Shared hreflang cluster for the international country landing pages
 * (PA005D): UK, Australia, Canada, plus the US/default custom-patches page.
 *
 * The same object is passed to buildPageMetadata's `alternates.languages` on
 * every page in the cluster (the three country pages AND /custom-patches), so
 * the annotations are reciprocal: each page points at all the others and a
 * single x-default. en-US and x-default both resolve to /custom-patches, the
 * general (US-default) custom patches page these are localized variants of.
 */
export const COUNTRY_HREFLANG = {
  "en-GB": "https://www.pandapatches.com/custom-patches-uk",
  "en-AU": "https://www.pandapatches.com/custom-patches-australia",
  "en-CA": "https://www.pandapatches.com/custom-patches-canada",
  "en-US": "https://www.pandapatches.com/custom-patches",
  "x-default": "https://www.pandapatches.com/custom-patches",
} as const;
