/**
 * What each patch type's page should link out to (CL3A9B A3.1).
 *
 * THE PROBLEM THIS SOLVES. A crawl on 7 September found 99 pages with two or
 * fewer contextual inbound links, and the worst of them are our longest work:
 * a 3,919-word manufacturers review with zero, a 3,230-word PVC guide with two,
 * a 2,782-word no-minimum page with two. Google reaches them through the
 * sitemap, which is enough to be indexed and not enough to be believed —
 * nothing on the site says they matter.
 *
 * The type pages are where the authority already is (embroidered has 58
 * contextual inbound links, PVC 39, chenille 29), so pointing them at their own
 * cluster moves weight from the pages that have it to the pages that earned it
 * and cannot get it.
 *
 * PROSE, NOT A GRID. The crawl counted links inside <p>, <li> and <td> only,
 * because that is roughly what carries weight and what a reader actually
 * follows. A card grid of related links would have looked like a fix and
 * counted for nothing, so the block below is a paragraph.
 *
 * Slugs are Sanity blog documents served from /[slug], and glossary entries are
 * checked against the live entries list. Both are verified by verify:canon
 * rather than trusted: a renamed document would otherwise leave a dead link on
 * a money page, and leather and printed have no glossary entry yet, which is
 * why they carry none here rather than a guessed one.
 */

export interface TypeCluster {
  /** Long-form guide for this type, if one exists. */
  guide?: { slug: string; label: string };
  /** The 2026 cost-and-specs post, if one exists. */
  costSpecs?: { slug: string; label: string };
  /** Glossary entry slug, under /glossary. */
  glossary?: string;
  /** Anchor text for the /offers link — carries the real pack price. */
  offersAnchor: string;
  /** Anything else worth pointing at from this type. */
  extra?: { href: string; label: string }[];
}

export const TYPE_CLUSTERS: Record<string, TypeCluster> = {
  embroidered: {
    costSpecs: {
      slug: "custom-embroidered-patches-cost-and-specs-2026",
      label: "embroidered cost and specs for 2026",
    },
    glossary: "embroidered-patch",
    offersAnchor: "embroidered packs from $180 for 50",
  },
  pvc: {
    guide: { slug: "custom-pvc-patches-guide", label: "the complete PVC patch guide" },
    glossary: "pvc-patch",
    offersAnchor: "PVC packs from $230 for 50",
    extra: [
      {
        href: "/custom-pvc-varsity-jacket-patches-colleges-2026",
        label: "PVC varsity jacket patches for colleges",
      },
    ],
  },
  woven: {
    costSpecs: {
      slug: "custom-woven-patches-cost-and-specs-2026",
      label: "woven cost and specs for 2026",
    },
    glossary: "woven-patch",
    offersAnchor: "woven packs from $220 for 50",
  },
  chenille: {
    guide: { slug: "custom-chenille-patches-guide", label: "the complete chenille patch guide" },
    costSpecs: {
      slug: "custom-chenille-patches-cost-and-specs-2026",
      label: "chenille cost and specs for 2026",
    },
    glossary: "chenille-patch",
    offersAnchor: "chenille packs from $175 for 25",
    extra: [
      { href: "/chenille-letters", label: "chenille alphabet and number sets" },
      {
        href: "/letterman-jacket-patch-placement-guide",
        label: "where patches go on a letterman jacket",
      },
    ],
  },
  leather: {
    costSpecs: {
      slug: "custom-leather-patches-cost-and-specs-2026",
      label: "leather cost and specs for 2026",
    },
    offersAnchor: "leather packs from $220 for 50",
    extra: [{ href: "/custom-leather-hat-patches", label: "leather hat patches" }],
  },
  printed: {
    guide: {
      slug: "custom-printed-patches-when-to-choose-print-over-embroidery",
      label: "when to choose printed over embroidered",
    },
    offersAnchor: "fixed-price packs on /offers",
  },
  sequin: {
    guide: { slug: "custom-sequin-patches-guide", label: "the complete sequin patch guide" },
    offersAnchor: "fixed-price packs on /offers",
  },
};
