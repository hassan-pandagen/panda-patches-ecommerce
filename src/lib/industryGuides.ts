/**
 * Which long-form guide each industry page should point at (CL3A9B A3.4).
 *
 * THE REVERSE HALF OF THE CLUSTER. Type pages already feed their guides through
 * GoingDeeperBlock. The industry pages were the other direction and mostly did
 * not: sports, corporate and police linked to no guide at all, and fire linked
 * to one. Those are the pages a buyer lands on with a job in mind, and the
 * guide that answers their next question was invisible from them.
 *
 * MATCHED, NOT SPRAYED. Each entry is the guide that actually answers what
 * someone on that page is about to ask — the soccer and hockey guides from the
 * sports page, the OCP placement guide from police and fire. A generic list of
 * "popular articles" would link more and mean less.
 *
 * Slugs are Sanity blog documents served from /[slug]. verify:canon section 19
 * checks the app-route half; the blog slugs were verified by hand against the
 * dataset on 2026-09-07.
 */

export interface IndustryGuide {
  slug: string;
  label: string;
}

export interface IndustryGuideSet {
  /** Sentence opener, so each page reads like itself rather than a template. */
  lead: string;
  guides: IndustryGuide[];
}

export const INDUSTRY_GUIDES: Record<string, IndustryGuideSet> = {
  "custom-sports-patches": {
    lead: "Sizing and pricing by sport, written up in full:",
    guides: [
      { slug: "custom-soccer-patches-guide", label: "soccer crests and club badges" },
      { slug: "custom-hockey-patches-sizing-guide-2026", label: "hockey crest sizing and pricing" },
      {
        slug: "custom-university-athletic-patches-guide-2026",
        label: "university athletic programs and NCAA rules",
      },
    ],
  },
  "custom-corporate-patches": {
    lead: "If you are building a brand programme rather than a one-off order:",
    guides: [
      {
        slug: "the-growing-popularity-of-patches-in-corporate-branding",
        label: "why corporate teams are using patches",
      },
      {
        slug: "how-to-choose-the-perfect-patch-for-your-brand",
        label: "choosing the right patch type for a brand",
      },
      {
        slug: "get-your-clothing-line-started-with-custom-patches",
        label: "a founder's guide to patches on a clothing line",
      },
    ],
  },
  "custom-police-patches": {
    lead: "Placement and construction for law enforcement:",
    guides: [
      {
        slug: "the-role-of-patches-in-military-and-law-enforcement",
        label: "how patches are used in policing and the military",
      },
      {
        slug: "tactical-and-military-ocp-patch-placement-options",
        label: "OCP uniform patch placement",
      },
      { slug: "custom-tactical-patches-guide", label: "tactical, morale and unit patches" },
    ],
  },
  "custom-fire-department-patches": {
    lead: "Related reading for departments:",
    guides: [
      {
        slug: "the-role-of-patches-in-military-and-law-enforcement",
        label: "how patches are used across the emergency services",
      },
      { slug: "custom-tactical-patches-guide", label: "tactical, morale and unit patches" },
      {
        slug: "custom-embroidered-patches-cost-and-specs-2026",
        label: "embroidered cost and specs for 2026",
      },
    ],
  },
};
