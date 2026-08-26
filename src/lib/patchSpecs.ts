/**
 * Patch manufacturability canon — THE single source for production limits.
 *
 * These figures were previously declared inline in
 * `src/app/patch-manufacturability-specs/page.tsx`. They moved here so the
 * product pages can render the same numbers by importing them rather than by
 * copying them (CLB408_1 §5).
 *
 * WHY THIS FILE EXISTS, in one sentence: the specs page's own header warns that
 * "correcting a figure here does NOT correct it anywhere else" — v1.1 changed
 * the embroidery minimum text height 5 mm -> 4 mm and the stale value survived
 * for weeks on three other surfaces. The same failure mode shipped a live
 * pricing contradiction in Aug 2026, when the woven minimum was 10 in the
 * calculator and 5 in the FAQ schema. One source, imported everywhere, is the
 * only fix that holds.
 *
 * Every figure traces to `panda-patches-confirmed-specs_1.md` (owner-confirmed).
 * Do NOT edit a number here without bumping SPEC_VERSION and running the grep
 * sweep for the OLD value across src/, public/llms.txt AND Sanity content. A
 * changelog entry without sweep evidence is not done.
 */

// v1.5 (2026-08-14): adds the leather application row. See the specs page
// header for the full changelog rationale.
export const SPEC_VERSION = "v1.5";
export const SPEC_DATE = "2026-08-14";
export const SPEC_DATE_LABEL = "August 2026";

/** Column key per patch type. Only these four have confirmed spec canon. */
export const SPEC_COLUMN = {
  embroidered: "emb",
  woven: "woven",
  pvc: "pvc",
  leather: "leather",
} as const;

export type SpecSlug = keyof typeof SPEC_COLUMN;

export interface SpecRow {
  spec: string;
  emb: string;
  woven: string;
  pvc: string;
  leather: string;
}

/** Quick-reference matrix. Rendered whole on the specs page, sliced per type on product pages. */
export const specMatrix: SpecRow[] = [
  {
    spec: "Min text height",
    emb: "4 mm sans · 8 mm serif · 10 mm decorative",
    woven: "1.5 mm sans / 2 mm serif",
    pvc: "~3 mm",
    leather: "~2 mm engraved",
  },
  { spec: "Min line / stroke weight", emb: "~1 mm", woven: "~0.5 mm", pvc: "~1 mm", leather: "~0.3 mm (laser)" },
  {
    spec: "Max colors",
    emb: "~12 included, more with surcharge",
    woven: "4 included (+surcharge above)",
    pvc: "~8 Pantone-matched (+surcharge)",
    leather: "1 tone engraved · full color via UV print",
  },
  {
    spec: "Gradients",
    emb: "No (simulated blends)",
    woven: "Limited (thread blending)",
    pvc: "Limited (solid zones)",
    leather: "No engraved · Yes via UV print",
  },
  { spec: "Min patch size", emb: "0.5 in", woven: "0.5 in", pvc: "0.5 in", leather: "0.5 in" },
  { spec: "Max patch size", emb: "20 in", woven: "8 in", pvc: "8 in", leather: "8 in" },
];

/** What actually reproduces at a given finished size. */
export const sizeGuide = [
  { size: "2 in", holds: "Icon plus main wordmark read clearly; taglines and fine print drop. Keep it to logo and name." },
  { size: "2.5 in", holds: "Wordmark plus a short tagline hold; very fine secondary text is risky." },
  { size: "3 in", holds: "Main wordmark crisp, secondary tagline works; tiny fine print may drop." },
  { size: "4 in", holds: "Most text including taglines holds; small icons and finer detail survive." },
  { size: "5 in", holds: "Full detail — multiple text lines, small print, and fine elements all reproduce." },
];

/**
 * How each type is actually made — condensed from the specs page's "By patch
 * type" section. Construction drives every limit in the matrix above, so the
 * product page leads with it and then shows the numbers.
 */
export const construction: Record<SpecSlug, string> = {
  embroidered:
    "Thread laid down by machine onto a twill backing, so detail is bounded by thread thickness. Our standard thread is 40wt, which lays a line roughly 1 mm wide; for small lettering and fine detail we switch to a finer 75wt thread — finer than most shops run — which is how we hold smaller text than the typical embroiderer. Bold, simple shapes always reproduce better than dense fine detail.",
  woven:
    "Woven on a loom using threads much finer than embroidery, and laid flat rather than stacked. That construction reproduces detail roughly 2 to 4 times finer than embroidery, which is the whole reason to choose it — small lettering and thin line work survive at sizes where embroidery would blur them. The trade-off is a flat surface with no raised stitched texture.",
  pvc:
    "Moulded soft rubber built in layers from a 2.5 mm base, with raised elements added in 0.5 mm layers up to a maximum of five — so a full 3D PVC patch reaches about 5 mm total thickness with roughly 2.5 mm of stacked relief. A 2D mould uses flat stepped levels and holds thinner, sharper lines; a 3D mould uses rounded slopes, so fine elements narrow toward the top and need to be broader. On a hybrid design, keep small text in 2D and reserve 3D for larger logos, faces, and mascots.",
  leather:
    "One material, two very different processes. Laser engraving burns a single tone into the hide — timeless and very fine, down to about 0.3 mm line detail, but tonal only with no color or gradient. UV printing puts full color onto the leather surface, including true gradients and photographic artwork. Both genuine and premium synthetic leather take either process, and every leather patch gets a protective coating for durability and water resistance.",
};

/** Rows for one type, as label/value pairs. Returns [] for types with no confirmed canon. */
export function getSpecsForSlug(slug: string): { spec: string; value: string }[] {
  const col = SPEC_COLUMN[slug as SpecSlug];
  if (!col) return [];
  return specMatrix.map((row) => ({ spec: row.spec, value: row[col] }));
}

/** True when this slug has confirmed manufacturability canon to publish. */
export function hasSpecCanon(slug: string): slug is SpecSlug {
  return slug in SPEC_COLUMN;
}
