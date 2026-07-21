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
  // ── LIVE — all 10 Tier-1 entries published 2026-07-21 (photos wired + owner-reviewed).
  //    isLive() = published && photo; both satisfied. ──
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
    photo: {
      src: "/assets/glossary/woven-patch.webp",
      alt: "Shield-shaped woven patch holding fine detail — individual insect legs and a thin keyline that embroidery thread could not reproduce at this size",
    },
    fullGuide: { href: "/custom-patches/woven", label: "Custom Woven Patches" },
    related: [
      { href: "/woven-vs-embroidered-patches-which-is-right-for-you", label: "Woven vs embroidered — full comparison" },
      { href: "/custom-patches/embroidered", label: "Custom embroidered patches" },
      { href: "/patch-types-compared", label: "All patch types compared" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
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
    photo: {
      src: "/assets/glossary/chenille-patch.webp",
      alt: "Chenille patch with raised looped yarn pile in blue, green and orange, showing the plush varsity-style texture",
    },
    fullGuide: { href: "/custom-patches/chenille", label: "Custom Chenille Patches" },
    related: [
      { href: "/custom-letterman-patches", label: "Custom letterman patches" },
      { href: "/custom-chenille-patches-guide", label: "Chenille patch ordering guide" },
      { href: "/patch-types-compared", label: "All patch types compared" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
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
    photo: {
      src: "/assets/glossary/velcro-backing.webp",
      alt: "Embroidered bear patch shown front and back beside a close-up of the black hook-side Velcro backing",
    },
    fullGuide: { href: "/custom-velcro-patches", label: "Custom Velcro Patches" },
    related: [
      { href: "/custom-morale-patches", label: "Custom morale patches" },
      { href: "/custom-patches/backing-options", label: "All backing options compared" },
      { href: "/custom-tactical-patches", label: "Custom tactical patches" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
  },
  {
    slug: "iron-on-patch",
    term: "Iron-on patch",
    category: "Backings",
    mode: "stub",
    definition:
      "An iron-on patch has a heat-activated adhesive film bonded to its back. Pressing it with an iron or heat press melts that film into the fabric's fibres, fixing the patch without stitching. The bond is permanent under normal wear but weakens with repeated washing, so heavy-use garments are often stitched down as well.",
    fact:
      "Iron-on is not just the most popular backing we produce — it is 81.6% of every order, nearly ten times the share of Velcro, the runner-up. Four in five customers never consider another option.",
    factNote: "production-data page: backing mix n=858",
    whenToChoose: [
      "Choose iron-on for jackets, shirts, bags, and hats that get normal wear — it is fast to apply at home, sits flat, and costs nothing extra.",
      "Skip it on nylon, waterproof shells, and heavily textured or stretchy fabrics, which either cannot take the heat or will not hold the bond. Choose sew-on for workwear washed weekly, and Velcro when the patch has to come off.",
    ],
    photo: {
      src: "/assets/glossary/iron-on-patch.webp",
      alt: "Iron-on patch shown front and back, with a close-up of the white heat-seal adhesive layer on the reverse",
    },
    fullGuide: { href: "/custom-iron-on-patches", label: "Custom Iron-On Patches" },
    related: [
      { href: "/the-complete-guide-to-iron-on-patches-care-application-and-longevity", label: "Iron-on application and care guide" },
      { href: "/custom-patches/backing-options", label: "All backing options compared" },
      { href: "/sew-on-patches", label: "Sew-on patches" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
  },
  {
    slug: "embroidered-patch",
    term: "Embroidered patch",
    category: "Patch Types",
    mode: "stub",
    definition:
      "An embroidered patch is made by stitching dense thread onto a twill backing fabric, building the design in raised, textured stitches. It is the traditional patch format — durable, dimensional, and the reference point most people picture when they hear the word patch. Fine detail is limited by thread thickness rather than by print resolution.",
    fact:
      "Embroidered patches are 36.2% of everything we produce — more than the next two patch types combined — at a median order of 25 pieces.",
    factNote: "facts bank 2026-07-19: type share n≈892, median qty n=323",
    whenToChoose: [
      "Choose embroidery when you want the classic look and feel: logos, crests, team names, and anything where visible thread texture is part of the appeal.",
      "Skip it when your artwork carries tiny lettering or photographic gradients — woven handles fine detail, printed and sublimated handle full-colour imagery. Very high stitch counts on small patches also stiffen the finished piece.",
    ],
    photo: {
      src: "/assets/glossary/embroidered-patch.webp",
      alt: "Round embroidered patch with dense stitched detail and a gold merrowed border, showing visible thread direction",
    },
    fullGuide: { href: "/custom-patches/embroidered", label: "Custom Embroidered Patches" },
    related: [
      { href: "/woven-vs-embroidered-patches-which-is-right-for-you", label: "Woven vs embroidered" },
      { href: "/patch-threads-and-twills", label: "Threads and twills" },
      { href: "/patch-types-compared", label: "All patch types compared" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
  },
  {
    slug: "morale-patch",
    term: "Morale patch",
    category: "Patch Types",
    mode: "stub",
    definition:
      "A morale patch is a small, usually humorous or symbolic patch worn on tactical gear, uniforms, and packs to signal identity, unit affiliation, or attitude rather than rank. Almost always Velcro-backed so it can be swapped freely, it is a cultural format rather than a manufacturing method — morale patches are made in embroidery, PVC, or woven.",
    fact:
      "More than half of the Velcro-backed orders we produce — 55% — are PVC rather than embroidered. Moulded rubber has quietly overtaken thread as the default morale-patch material.",
    factNote: "facts bank 2026-07-19: velcro×type crosstab n=73",
    whenToChoose: [
      "Choose PVC for morale patches that live outdoors on plate carriers and packs: it shrugs off rain, mud, and abrasion, and holds crisp small detail.",
      "Choose embroidery instead when you want the traditional textured look, or when the design is a straightforward logo. Either way, specify Velcro backing — a sewn-down morale patch defeats the point of the format.",
    ],
    photo: {
      src: "/assets/glossary/morale-patch.webp",
      alt: "Round embroidered morale patch reading \"No Luck, All Discipline\" with a helmeted skull and crossed knives, finished with a merrowed border",
    },
    fullGuide: { href: "/custom-morale-patches", label: "Custom Morale Patches" },
    related: [
      { href: "/custom-patches/pvc", label: "Custom PVC patches" },
      { href: "/custom-tactical-patches", label: "Custom tactical patches" },
      { href: "/custom-velcro-patches", label: "Velcro patch backing" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
  },
  {
    slug: "pvc-patch",
    term: "PVC patch",
    category: "Patch Types",
    mode: "stub",
    definition:
      "A PVC patch is moulded from soft, flexible rubber rather than stitched or woven from thread. Colour is built up in layers inside a custom mould, producing a waterproof, dimensional patch that holds sharp edges and small detail. Unlike thread, PVC does not fray, absorb water, or fade under sun and abrasion.",
    fact:
      "The median PVC order we produce is 40 pieces — four times the chenille median and well above the 20-piece all-type median. PVC is bought by teams and units, rarely by individuals.",
    factNote: "facts bank 2026-07-19: median qty n=98",
    whenToChoose: [
      "Choose PVC for gear that gets wet, dirty, or abraded: tactical kit, outdoor packs, marine and industrial use, plus any design with fine detail that thread would blur.",
      "Skip it when you want a traditional textile look or a soft hand on clothing — PVC reads modern and feels rubbery, and it is the wrong choice for formal or heritage-style apparel.",
    ],
    photo: {
      src: "/assets/glossary/pvc-patch.webp",
      alt: "Triangular moulded PVC patch in black and cream, showing the raised rubber layers and crisp fine lettering",
    },
    fullGuide: { href: "/custom-patches/pvc", label: "Custom PVC Patches" },
    related: [
      { href: "/custom-pvc-patches-guide", label: "PVC patch ordering guide" },
      { href: "/custom-morale-patches", label: "Custom morale patches" },
      { href: "/patch-types-compared", label: "All patch types compared" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
  },
  {
    slug: "3d-puff-embroidery",
    term: "3D / puff embroidery",
    category: "Patch Types",
    mode: "stub",
    definition:
      "3D or puff embroidery stitches thread over a foam underlay, so the design rises off the surface in a rounded, sculpted relief instead of lying flat. It is the raised lettering seen on structured caps and letterman jackets. Bold, simple shapes and thick lettering work; thin lines and small text collapse.",
    fact:
      "Nearly one in ten orders we produce — 9.3% — is 3D puff embroidery, at a median of 20 pieces. It is now a larger share of our production than woven patches.",
    factNote: "facts bank 2026-07-19: type share n≈892, median qty n=83",
    whenToChoose: [
      "Choose puff for cap fronts, bold monogram lettering, and anywhere physical height makes a design read from a distance.",
      "Skip it for detailed logos, thin script, or small text — the foam needs a wide stitch path to stay covered, and fine elements either flatten or split. Flat embroidery reproduces those cleanly.",
    ],
    photo: {
      src: "/assets/glossary/3d-puff-embroidery.webp",
      alt: "3D puff embroidered lettering in copper thread, the foam underlay raising each letter into a rounded relief",
    },
    fullGuide: { href: "/custom-patches/custom-3d-embroidered-transfers", label: "Custom 3D Embroidered Transfers" },
    related: [
      { href: "/custom-patches/embroidered", label: "Custom embroidered patches" },
      { href: "/patches-for-hats", label: "Patches for hats" },
      { href: "/patch-types-compared", label: "All patch types compared" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
  },
  {
    slug: "patch-backing",
    term: "Patch backing overview",
    category: "Backings",
    mode: "stub",
    definition:
      "A patch backing is the layer applied to the reverse of a finished patch that determines how it attaches: iron-on adhesive film, hook-and-loop (Velcro), plain sew-on, or peel-and-stick adhesive. The patch face is unaffected — backing is an attachment decision about permanence, washing, and whether the patch needs to be removable.",
    fact:
      "Across the orders we produce, backing choice is lopsided: iron-on 81.6%, Velcro 8.5%, sew-on 7.1%, and adhesive 2.8%. Most buyers never weigh the four options — they take the default.",
    factNote: "production-data page: backing mix n=858",
    whenToChoose: [
      "Match the backing to the garment's life: iron-on for normal wear, sew-on for workwear and uniforms washed constantly, Velcro when the patch must be swapped or removed, adhesive for temporary event and display use.",
      "When unsure, iron-on plus a few stitches around the edge is the most durable combination — heat bonds it flat, thread keeps it there through years of washing.",
    ],
    photo: {
      src: "/assets/glossary/patch-backing.webp",
      alt: "One embroidered patch shown with five backing options side by side: iron-on, sew-on, Velcro, sticker and pin back",
    },
    fullGuide: { href: "/custom-patches/backing-options", label: "All Backing Options" },
    related: [
      { href: "/sew-on-patches", label: "Sew-on patches" },
      { href: "/adhesive-patches", label: "Adhesive patches" },
      { href: "/patch-backings-101-iron-on-vs-sew-on-vs-velcro", label: "Backings 101 guide" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
  },
  {
    slug: "embroidery-digitizing",
    term: "Embroidery digitizing",
    category: "Production Terms",
    mode: "stub",
    definition:
      "Embroidery digitizing is the conversion of artwork into a stitch file — a machine-readable map of every stitch's type, direction, sequence, and density. It is not an automatic image conversion: a digitizer makes judgement calls about underlay, pull compensation, and stitch angle that decide whether the finished patch lies flat or puckers.",
    fact:
      "We charge nothing for digitizing, on any order — an industry outlier, since setup and digitizing fees of $20 to $100 per design are standard elsewhere and are the most common hidden cost on a first patch order.",
    factNote: "verified against site pricing policy (no setup/digitizing/mould/art fees)",
    whenToChoose: [
      "Every embroidered patch needs digitizing — the question is only who does it and what they charge. Supply vector artwork (AI, EPS, PDF, SVG) where possible; it digitizes cleaner than a low-resolution raster.",
      "Expect a proof before production. A design digitized well at one size does not automatically scale — resizing a stitch file significantly usually means redigitizing it.",
    ],
    photo: {
      src: "/assets/glossary/embroidery-digitizing.webp",
      alt: "Digitized embroidery proof on a measurement grid, showing stitch paths and the finished patch dimensions in inches",
    },
    fullGuide: { href: "/embroidery-digitizing", label: "Embroidery Digitizing" },
    related: [
      { href: "/custom-patches/embroidered", label: "Custom embroidered patches" },
      { href: "/custom-patch-hidden-fees", label: "Hidden fees to watch for" },
      { href: "/how-much-do-custom-patches-cost-full-pricing-breakdown", label: "Full pricing breakdown" },
    ],
    published: true,
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
  },
];

export function getEntry(slug: string): GlossaryEntry | undefined {
  return glossaryEntries.find((e) => e.slug === slug);
}

export function liveEntries(): GlossaryEntry[] {
  return glossaryEntries.filter(isLive);
}
