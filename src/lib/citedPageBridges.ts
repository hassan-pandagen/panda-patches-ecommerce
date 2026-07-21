/**
 * Commercial bridge blocks for the top AI-cited blog pages (CL9F69 Workstream A).
 *
 * The Bing AI Performance export shows ~17K citations, ~98% informational. These
 * bridges give the highest-cited informational posts one contextual commercial
 * exit each — matched to the reader's intent — without touching the copy that
 * earns the citations (the bridge is injected by BlogPostLayout between content
 * sections, NOT stored in the Sanity body).
 *
 * Rules (CL9F69): one per page, server-rendered, plain link, modest bordered
 * aside placed after the first section. Coins + enamel-pin pages get NO bridge
 * (owner decision: patches only). The boy-scout bridge is intentionally absent
 * until /custom-scout-patches (Workstream C.1) exists; the OCP page is held until
 * its own military-claims review (SE4767 §D) is complete.
 */
export interface BridgeConfig {
  /** The offer line — bold, the reason to click. */
  offer: string;
  /** Link text. */
  ctaLabel: string;
  /** Commercial target (must be a live page). */
  href: string;
}

export const CITED_PAGE_BRIDGES: Record<string, BridgeConfig> = {
  "how-to-make-your-own-iron-on-patches": {
    offer:
      "Skip the DIY: professional embroidered iron-on patches from $0.91/pc, backing included.",
    ctaLabel: "Shop custom iron-on patches",
    href: "/custom-iron-on-patches",
  },
  "the-complete-guide-to-iron-on-patches-care-application-and-longevity": {
    offer:
      "Skip the DIY: professional embroidered iron-on patches from $0.91/pc, backing included.",
    ctaLabel: "Shop custom iron-on patches",
    href: "/custom-iron-on-patches",
  },
  "custom-university-athletic-patches-guide-2026": {
    offer:
      "NCAA-compliant team patches, bulk pricing, and a dedicated account manager.",
    ctaLabel: "Get bulk team pricing",
    href: "/bulk-custom-patches",
  },
};
