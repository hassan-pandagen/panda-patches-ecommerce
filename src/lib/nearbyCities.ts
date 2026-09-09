/**
 * Nearby-cities cross-links for the location pages.
 *
 * Lived in `src/app/locations/page.tsx` until 9 Sept 2026, exported from there.
 * A Next page module may only export a fixed set of names, so that export failed
 * the type check — invisibly, because the Turbopack build skips it and the
 * webpack build is the one that runs it.
 *
 * Its original comment said it was "exported so LocationLayout can call it
 * without duplicating the NEARBY map". LocationLayout exists and has never
 * imported it. Here it can be.
 */

// Nearby-cities cross-link map. Only the 4 live pages remain, so cross-links
// point solely to other live pages (Austin <-> Texas). LA and New York have no
// surviving in-region neighbor, so they render no nearby module rather than
// link to a redirected slug.
const NEARBY: Record<string, string[]> = {
  // Texas is the only surviving location page, so it has no neighbour to
  // cross-link to. Every other slug 301s away; linking one would be a dead hop.
  "custom-patches-in-texas": [],
};

/** Nearby live location pages for `slug`, ready to render as cross-links. */
export function getNearbyCities(slug: string): Array<{ slug: string; name: string }> {
  const nearbySlugs = NEARBY[slug] || [];
  return nearbySlugs.map((s) => ({
    slug: s,
    name: humanizeLocationName(s),
  }));
}

export function humanizeLocationName(slug: string): string {
  // Strip "custom-" prefix, "-patches" suffix, "-patches-in" infix
  const cleaned = slug
    .replace(/^custom-/, "")
    .replace(/-patches$/, "")
    .replace(/^patches-in-/, "")
    .replace(/^patches-/, "")
    .replace(/-state$/, "");
  return cleaned
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
