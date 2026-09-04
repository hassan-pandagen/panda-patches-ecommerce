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

// v1.8 (2026-09-04): NO FIGURE CHANGED — the published page was corrected to
// match figures v1.7 already set, and that is exactly why the version moves.
//
// Between v1.7 shipping and 2026-09-01 the specs page carried SEVEN stale size
// values while the imported matrix beside them was correct: the FAQ and three
// JSON-LD entries said embroidered 20 in / chenille 14 in / printed-sequin
// 12 in, and the per-type prose repeated the same three. So a citation of "v1.7"
// taken before 1 September disagrees with one taken after it, on the same
// version string. A versioned standard whose published numbers move without the
// version moving is not a standard, so this bump exists to make those two
// citations distinguishable.
//
// The fix was structural rather than numeric: every maximum-size figure on the
// page is now DERIVED from MANUFACTURING_MAX_IN through a MAX() helper, and
// verify:canon section 9 fails the build if any of them is retyped as a literal.
//
// v1.7 (2026-08-27): separates MANUFACTURING maximum from AUTO-PRICE ceiling
// (CL5E74). Embroidered/chenille manufacturing max raised to 25 in; printed and
// sequin corrected 12 -> 14 in; "Larger custom sizes: Available by quote" now
// confirmed for all seven types; new "Instant pricing up to" row. The canonical
// size sentence changed — the old chenille/printed/sequin wording is superseded.
// v1.6 (2026-08-27): adds chenille, printed and sequin — the three types that
// had no published canon — confirmed by the shop floor / digitizing team
// (CL260A_1). Also renames the size row to "Maximum standard size": these are
// standard limits, not absolute caps, and larger is available by quote.
// v1.5 (2026-08-14): adds the leather application row.
export const SPEC_VERSION = "v1.8";
export const SPEC_DATE = "2026-09-04";
export const SPEC_DATE_LABEL = "September 2026";

/** Column key per patch type. All seven now have confirmed spec canon. */
export const SPEC_COLUMN = {
  embroidered: "emb",
  woven: "woven",
  pvc: "pvc",
  leather: "leather",
  chenille: "chenille",
  printed: "printed",
  sequin: "sequin",
} as const;

export type SpecSlug = keyof typeof SPEC_COLUMN;

export interface SpecRow {
  spec: string;
  emb: string;
  woven: string;
  pvc: string;
  leather: string;
  chenille: string;
  printed: string;
  sequin: string;
}

/**
 * TWO DIFFERENT CEILINGS — do not conflate them (CL5E74 §1).
 *
 *  MANUFACTURING_MAX_IN  what the factory can physically produce. Published on
 *                        the specs page. Larger than the price table on purpose.
 *  AUTO_PRICE_CEILING_IN the largest size the calculator may price BY ITSELF.
 *                        Above it the answer is a quote, never a number.
 *
 * They are allowed to differ and the site must never imply they are the same.
 * The CEO's reasoning for embroidered/chenille: a 25-inch piece can be a million
 * stitches, and complexity — not area — drives that cost, so it cannot be
 * derived from a size row. Printed, woven, PVC and leather scale with size
 * normally and are priced from the table up to their ceiling.
 */
export const MANUFACTURING_MAX_IN: Record<SpecSlug, number> = {
  embroidered: 25, // 20 routine, 25 possible
  chenille: 25,
  woven: 8,
  leather: 8,
  pvc: 8,
  printed: 14,
  sequin: 14,
};

/**
 * All seven now sit at their CL5E74 target.
 *
 * HOW THEY GOT THERE MATTERS. woven@8, leather@7-8 and printed@13-14 previously
 * had no genuine price data — woven's size-8 row was a byte-copy of size 7,
 * leather's 7 and 8 were copies of 6, and printed's table stopped at 12. Those
 * duplicates are what billed a 12-inch leather patch at the 6-inch rate.
 *
 * Those rows are now CEO-DERIVED (Sept 2026), not factory-quoted: each continues
 * the percentage step between the last two GENUINE sizes at every quantity break.
 * They are marked as such in pricingCalculator.ts and should be replaced the
 * moment real factory numbers arrive.
 *
 * (printed was NOT in the original leak report. verify:canon's duplicate-top-row
 * assertion found it on first run, which is the case for having the check.)
 *
 * Embroidered and chenille stay at 14 against a 25-inch manufacturing max BY
 * DESIGN, not for want of data: a 25-inch piece can be a million stitches, and
 * complexity rather than area drives that cost, so it cannot come from a size row.
 */
export const AUTO_PRICE_CEILING_IN: Record<SpecSlug, number> = {
  embroidered: 14,
  chenille: 14,
  woven: 8, // rows to 8in derived (CEO method, Sept 2026)
  leather: 8, // rows to 8in derived (CEO method, Sept 2026)
  pvc: 8,
  printed: 14, // rows to 14in derived (CEO method, Sept 2026)
  sequin: 14,
};

/**
 * Quick-reference matrix. Rendered whole on the specs page, sliced per type on
 * product pages. An EMPTY STRING means "no confirmed figure for this type" and
 * is dropped from that type's table rather than rendered as a blank row — never
 * fill one in just to make the grid look complete.
 */
export const specMatrix: SpecRow[] = [
  {
    spec: "Min text height",
    emb: "4 mm sans · 8 mm serif · 10 mm decorative",
    woven: "1.5 mm sans / 2 mm serif",
    pvc: "~3 mm",
    leather: "~2 mm engraved",
    chenille: "12 mm",
    printed: "2 mm",
    sequin: "12 mm",
  },
  {
    spec: "Min line / stroke weight",
    emb: "~1 mm",
    woven: "~0.5 mm",
    pvc: "~1 mm",
    leather: "~0.3 mm (laser)",
    chenille: "3 mm",
    printed: "0.3 mm",
    sequin: "3 mm",
  },
  {
    spec: "Recommended line weight",
    emb: "",
    woven: "",
    pvc: "",
    leather: "",
    chenille: "3–4 mm",
    printed: "0.5 mm",
    sequin: "6 mm (filled areas)",
  },
  {
    spec: "Max colors",
    emb: "~12 included, more with surcharge",
    woven: "4 included (+surcharge above)",
    pvc: "~8 Pantone-matched (+surcharge)",
    leather: "1 tone engraved · full color via UV print",
    chenille: "3 yarn colors + base",
    printed: "Full color, no fixed limit",
    sequin: "4 sequin colors/types",
  },
  {
    spec: "Gradients",
    emb: "No (simulated blends)",
    woven: "Limited (thread blending)",
    pvc: "Limited (solid zones)",
    leather: "No engraved · Yes via UV print",
    chenille: "No",
    printed: "Yes",
    sequin: "No",
  },
  {
    spec: "Min patch size",
    emb: "0.5 in",
    woven: "0.5 in",
    pvc: "0.5 in",
    leather: "0.5 in",
    chenille: "",
    printed: "",
    sequin: "",
  },
  {
    // MANUFACTURING maximum — what the factory can make (CL5E74 §1). This is a
    // bigger number than the calculator will price for embroidered and chenille,
    // and that gap is intentional: see AUTO_PRICE_CEILING_IN.
    spec: "Maximum standard size",
    emb: "25 in",
    woven: "8 in",
    pvc: "8 in",
    leather: "8 in",
    chenille: "25 in",
    printed: "14 in",
    sequin: "14 in",
  },
  {
    // Confirmed for ALL SEVEN types (CL5E74 §2.3). Previously blank for
    // embroidered/woven/PVC/leather because it had not been confirmed.
    spec: "Larger custom sizes",
    emb: "Available by quote",
    woven: "Available by quote",
    pvc: "Available by quote",
    leather: "Available by quote",
    chenille: "Available by quote",
    printed: "Available by quote",
    sequin: "Available by quote",
  },
  {
    // DERIVED, never hand-typed. This row is the difference between what we can
    // make and what the site will price on the spot, and three of these ceilings
    // currently sit below their target because the top price rows are duplicates
    // (see AUTO_PRICE_CEILING_IN). Typing these by hand would republish exactly
    // the mismatch this row exists to expose.
    spec: "Instant pricing up to",
    emb: `${AUTO_PRICE_CEILING_IN.embroidered} in`,
    woven: `${AUTO_PRICE_CEILING_IN.woven} in`,
    pvc: `${AUTO_PRICE_CEILING_IN.pvc} in`,
    leather: `${AUTO_PRICE_CEILING_IN.leather} in`,
    chenille: `${AUTO_PRICE_CEILING_IN.chenille} in`,
    printed: `${AUTO_PRICE_CEILING_IN.printed} in`,
    sequin: `${AUTO_PRICE_CEILING_IN.sequin} in`,
  },
];

/**
 * THE global size sentence — DELIBERATELY CARRIES NO NUMBERS (CEO, 2026-08-28).
 *
 * Two earlier versions of this string both went stale within a week, because a
 * single global sentence cannot describe seven ceilings that differ per type and
 * move as price rows land. "Instant pricing up to 14 inches (8 for woven,
 * leather and PVC)" was already untrue on the day it was written: the real
 * ceilings were 14/14/7/6/8/12/14.
 *
 * So the numbers live per-type in `instantPricingLine()`, derived from
 * AUTO_PRICE_CEILING_IN, and this string states only what is true everywhere.
 * It self-heals when the floor's rows arrive, and no page can over-promise.
 *
 * DO NOT put a number back in here.
 */
export const STANDARD_SIZE_SENTENCE =
  "Larger custom sizes are available by quote.";

/**
 * Per-type instant-pricing statement, derived — never typed. Renders as
 * "Instant pricing up to 7 inches — larger sizes by quote."
 */
export function instantPricingLine(slug: string): string | null {
  const ceiling = AUTO_PRICE_CEILING_IN[slug as SpecSlug];
  if (!ceiling) return null;
  return `Instant pricing up to ${ceiling} inches — larger sizes by quote.`;
}

/** The largest size the calculator will price for a type; 0 for unknown slugs. */
export function getAutoPriceCeiling(slug: string): number {
  return AUTO_PRICE_CEILING_IN[slug as SpecSlug] ?? 0;
}

/**
 * Resolve a product name to its spec slug. THE one implementation — the pricing
 * calculator and the UI must agree on which type a product is, or the UI offers
 * a size the pricing function refuses.
 *
 * Order matters and mirrors getPricingTable: "chenille" appears inside
 * "Chenille TPU", so the more specific match has to win first, exactly as it
 * does when the price table is chosen.
 */
export function specSlugForProductName(productName: string): SpecSlug | null {
  const name = productName.toLowerCase();
  if (name.includes("tpu") || name.includes("glitter")) return "chenille";
  if (name.includes("chenille")) return "chenille";
  if (name.includes("3d embroid")) return "embroidered";
  if (name.includes("pvc")) return "pvc";
  if (name.includes("woven")) return "woven";
  if (name.includes("leather")) return "leather";
  if (name.includes("silicone")) return null; // labels, own size range
  if (name.includes("sublim") || name.includes("print")) return "printed";
  if (name.includes("sequin")) return "sequin";
  if (name.includes("embroid")) return "embroidered";
  return null;
}

/**
 * Type-specific limits that do not belong in the shared matrix because they
 * apply to one construction only. Rendered as bullets beneath that type's spec
 * table and in the specs page's by-type section.
 */
export const specNotes: Partial<Record<SpecSlug, string[]>> = {
  chenille: [
    "Minimum standalone letter size: 2 in (50.8 mm) tall — 3 in or larger recommended.",
    "A twill border is NOT included by default. Included as standard: the structural felt/twill base and a standard finished edge.",
    "Optional extras: contrasting layered felt or twill, and a satin-stitched or merrowed border.",
  ],
  sequin: [
    "Sequins are 3 mm in diameter, which is what sets every limit below.",
    "Absolute minimum feature or tip width: 3 mm. Recommended filled line width: 6 mm.",
    "Recommended minimum corner radius: 3 mm; recommended minimum point angle about 60 degrees.",
    "Narrower or sharper points must be rounded, shortened, or finished with embroidery. A 90-degree corner is producible but reads slightly rounded, because the sequins themselves are circular.",
  ],
};

/** What actually reproduces at a given finished size. */
export const sizeGuide = [
  { size: "2 in", holds: "Icon plus main wordmark read clearly; taglines and fine print drop. Keep it to logo and name." },
  { size: "2.5 in", holds: "Wordmark plus a short tagline hold; very fine secondary text is risky." },
  { size: "3 in", holds: "Main wordmark crisp, secondary tagline works; tiny fine print may drop." },
  { size: "4 in", holds: "Most text including taglines holds; small icons and finer detail survive." },
  { size: "5 in", holds: "Full detail — multiple text lines, small print, and fine elements all reproduce." },
];

/**
 * How each type is actually made — construction drives every limit in the
 * matrix above, so the product page leads with it and then shows the numbers.
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
  chenille:
    "Looped pile yarn laid onto a structural felt or twill base — the same construction as a varsity letter, which is why it reads as one. The yarn loop is thick, and that thickness sets every limit: text needs 12 mm to stay legible and lines need 3 mm to hold their shape, roughly three times what embroidery requires. It is a bold-shapes medium, not a fine-detail one. A standalone letter should be at least 2 inches tall, and 3 inches or larger is where it looks right on a letterman jacket.",
  printed:
    "Dye-sublimation puts the artwork directly into the fabric rather than building it from thread or moulded rubber. Because it is printed, it is the only patch type with no practical colour limit and true gradient support — photographic images, soft shading and unlimited colours all reproduce. It is also the finest-detail option we make: text holds down to 2 mm and lines to 0.3 mm. The trade-off is surface texture: printed patches are completely flat, with none of the raised feel of embroidery or chenille.",
  sequin:
    "Individual 3 mm sequins placed across the patch face, which makes the sequin diameter the unit every limit is measured in. Nothing can be finer than a single sequin, so features and tips bottom out at 3 mm and filled lines want 6 mm to read cleanly. Because sequins are circular, sharp corners and narrow points soften — a 90-degree corner is producible but will read slightly rounded, and anything sharper should be rounded off, shortened, or finished with embroidery. It is a high-impact, low-detail medium built for stage, dance and spirit wear.",
};

/**
 * Rows for one type, as label/value pairs. Blank values are dropped, so a type
 * shows only the specs actually confirmed for it. Returns [] for an unknown slug.
 */
export function getSpecsForSlug(slug: string): { spec: string; value: string }[] {
  const col = SPEC_COLUMN[slug as SpecSlug];
  if (!col) return [];
  return specMatrix
    .map((row) => ({ spec: row.spec, value: row[col] }))
    .filter((r) => r.value.trim() !== "");
}

/** Type-specific bullets for a slug, or [] when there are none. */
export function getSpecNotesForSlug(slug: string): string[] {
  return specNotes[slug as SpecSlug] ?? [];
}

/** True when this slug has confirmed manufacturability canon to publish. */
export function hasSpecCanon(slug: string): slug is SpecSlug {
  return slug in SPEC_COLUMN;
}
