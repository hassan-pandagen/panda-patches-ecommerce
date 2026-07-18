// Glossary entry registry (CL2051). Every entry ships the full contract — quotable
// definition, one verified production-data fact, real floor photo, honest trade-offs —
// or it does not publish. `published` flips only after human review AND a photo exists;
// the [slug] route and sitemap render published entries only.
//
// Facts come exclusively from GSC/glossary-facts-bank-*.md or the production-data page
// (both verified against the orders table). Never invent or reuse plan-document examples.

export type GlossaryCategory =
  | "Patch Types"
  | "Backings"
  | "Borders & Edges"
  | "Materials"
  | "Production Terms";

export interface GlossaryEntry {
  slug: string;
  term: string;
  category: GlossaryCategory;
  /** Mode A = stub routing to an existing deep page; Mode B = full entry (no existing coverage). */
  mode: "stub" | "full";
  /** 40-60 words, quotable, must survive out of context — this is what LLMs lift. */
  definition: string;
  /** One verified fact competitors don't publish. Source noted in factNote (not rendered). */
  fact: string;
  factNote?: string;
  /** 2-4 honest trade-off sentences. Rendered as short paragraphs. */
  whenToChoose: string[];
  /** Real production-floor photo. Required to publish. Alt text defaults to the term. */
  photo?: { src: string; alt?: string };
  /** Mode A entries: the existing deep page this stub routes to. */
  fullGuide?: { href: string; label: string };
  /** 3-4 internal links, including one product page with natural anchor. */
  related: { href: string; label: string }[];
  published: boolean;
  datePublished?: string;
  dateModified?: string;
}

/** An entry may only go live with a photo — the hub, route, and sitemap all use this gate. */
export function isLive(entry: GlossaryEntry): boolean {
  return entry.published && Boolean(entry.photo);
}

export const glossaryEntries: GlossaryEntry[] = [
  // ── DRAFTS (published: false) — awaiting floor photos + human review ──────────
  {
    slug: "woven-patch",
    term: "Woven patch",
    category: "Patch Types",
    mode: "stub",
    definition:
      "A woven patch is made by interlacing fine polyester threads on a loom rather than stitching them onto a base fabric, producing a flat, tightly woven face that holds far smaller text and finer line detail than embroidery. Designs with lettering under about a quarter inch usually need woven construction to stay legible.",
    fact:
      "Woven is just 4.4% of the orders we produce — but at a median of 50 pieces per order, it is the largest typical run of any patch type we make. It is the format brands pick when they buy detail-heavy labels in bulk.",
    factNote: "facts bank 2026-07-19: type share n≈892; median qty n=39",
    whenToChoose: [
      "Choose woven when your design has small text, thin lines, or tight detail that embroidery thread would swallow — logos with fine print are the classic case.",
      "Skip it when you want dimension and texture: a woven face is flat by nature, so bold chest or jacket designs usually read richer as embroidered or 3D puff. For heavy outdoor abrasion, PVC outlasts both.",
    ],
    fullGuide: { href: "/custom-patches/woven", label: "Custom Woven Patches" },
    related: [
      { href: "/woven-vs-embroidered-patches-which-is-right-for-you", label: "Woven vs embroidered — full comparison" },
      { href: "/custom-patches/embroidered", label: "Custom embroidered patches" },
      { href: "/patch-types-compared", label: "All patch types compared" },
    ],
    published: false,
  },
  {
    slug: "chenille-patch",
    term: "Chenille patch",
    category: "Patch Types",
    mode: "stub",
    definition:
      "A chenille patch is built from loops of soft, fuzzy yarn stitched onto a felt base — the raised, plush texture of the classic varsity letter. Chenille gives bold shapes and big lettering a three-dimensional pile that embroidery cannot match, but it cannot hold fine detail; designs read best at about 3 inches and larger.",
    fact:
      "The median chenille order we produce is just 10 pieces — the smallest of any major patch type — because chenille is bought for individual jackets, not uniform runs. It is still our second-most-ordered type, at 16.3% of all orders.",
    factNote: "facts bank 2026-07-19: median qty n=146; type share n≈892",
    whenToChoose: [
      "Choose chenille for letterman jackets, varsity letters, and any design where a big, soft, retro-textured shape is the whole point.",
      "Skip it for logos with small text, thin outlines, or color gradients — embroidered, woven, or printed patches reproduce those; chenille pile physically cannot.",
    ],
    fullGuide: { href: "/custom-patches/chenille", label: "Custom Chenille Patches" },
    related: [
      { href: "/custom-letterman-patches", label: "Custom letterman patches" },
      { href: "/custom-chenille-patches-guide", label: "Chenille patch ordering guide" },
      { href: "/patch-types-compared", label: "All patch types compared" },
    ],
    published: false,
  },
  {
    slug: "velcro-backing",
    term: "Velcro (hook-and-loop) backing",
    category: "Backings",
    mode: "stub",
    definition:
      "A Velcro (hook-and-loop) backing is a two-part fastener: the hook side is sewn to the back of the patch, and the mating loop side attaches to the garment or gear, so the patch can be removed and swapped in seconds. It is the standard backing for military uniforms, tactical gear, and morale patches.",
    fact:
      "8.5% of the orders we produce choose Velcro backing — a distant second to iron-on's 81.6% — and they cluster heavily in tactical, unit, and morale designs where one patch rotates between uniforms and rigs.",
    factNote: "production-data page: backing mix n=858",
    whenToChoose: [
      "Choose Velcro when patches need to rotate — between uniforms, plate carriers, or bags — or must come off before heavy washing.",
      "Skip it for one-time permanent placement: iron-on or sew-on sits flatter, costs less, and cannot fall off with the hook field. Note most tactical gear ships with the loop side built in; garments usually need the loop panel sewn on first.",
    ],
    fullGuide: { href: "/custom-velcro-patches", label: "Custom Velcro Patches" },
    related: [
      { href: "/custom-morale-patches", label: "Custom morale patches" },
      { href: "/custom-patches/backing-options", label: "All backing options compared" },
      { href: "/custom-tactical-patches", label: "Custom tactical patches" },
    ],
    published: false,
  },
];

export function getEntry(slug: string): GlossaryEntry | undefined {
  return glossaryEntries.find((e) => e.slug === slug);
}

export function liveEntries(): GlossaryEntry[] {
  return glossaryEntries.filter(isLive);
}
