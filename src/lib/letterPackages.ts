/**
 * Chenille letter and number packages (CLDB68, Sept 2026). CEO-set prices, final.
 *
 * These are FIXED-PRICE products in the offerPackages family. They deliberately
 * do NOT touch `chenillePricing`, the calculator, or the monotonicity guard
 * (CLDB68 §5, confirmed 2026-09-03). A set of 26 or 10 pieces is well above the
 * 5-piece custom minimum, so no canon conflict arises either.
 *
 * WHY A SEPARATE MODULE RATHER THAN AN OfferCategory. An OfferPack is
 * {name, qty, price, perPiece} — one price for one quantity. A letter set has a
 * customer-selected size, an optional glitter background, and a free-text colour
 * that gates production. None of that fits OfferPack without widening the shape
 * for every other pack on the offers page, so it lives here and reuses the same
 * fee helpers.
 *
 * NO MOCKUP CYCLE. These are standard glyphs, so there is no artwork to approve.
 * The single approval touchpoint is the COLOUR MATCH — see letterColourGate().
 */
import { VELCRO_PER_PIECE_FEE } from "@/lib/checkoutConfig";
import { roundMoney } from "@/lib/pricingCalculator";

export interface LetterPackage {
  id: "chenille-alphabet" | "chenille-numbers";
  name: string;
  /** Glyphs in the set — drives per-piece fees such as Velcro. */
  pieces: number;
  price: number;
  glitterFee: number;
  /** Selectable finished heights, inches. */
  sizes: number[];
  blurb: string;
  href: string;
}

export const LETTER_PACKAGES: LetterPackage[] = [
  {
    id: "chenille-alphabet",
    name: "Chenille Alphabet Package (A–Z)",
    pieces: 26,
    price: 150,
    glitterFee: 50,
    sizes: [2, 2.5, 3, 3.5, 4],
    blurb:
      "All 26 letters in one set, one size, one colour. Classic varsity block font on a standard twill and felt base.",
    href: "/chenille-letters",
  },
  {
    id: "chenille-numbers",
    name: "Chenille Numbers Package (0–9)",
    pieces: 10,
    price: 120,
    glitterFee: 30,
    sizes: [2, 2.5, 3, 3.5, 4, 4.5, 5],
    blurb:
      "All ten numerals in one set, one size, one colour. Same construction as the alphabet package.",
    href: "/chenille-letters",
  },
];

/** Glitter background colours offered at launch. */
export const GLITTER_OPTIONS = ["gold", "silver", "red"] as const;
export type GlitterOption = (typeof GLITTER_OPTIONS)[number];

/**
 * Per-letter figure used in marketing copy. Derived, never typed: $150/26 and
 * $120/10 must stay in step with `price` if the CEO changes it.
 */
export function perGlyphPrice(pkg: LetterPackage): number {
  return roundMoney(pkg.price / pkg.pieces);
}

export function getLetterPackage(id: string): LetterPackage | undefined {
  return LETTER_PACKAGES.find((p) => p.id === id);
}

/**
 * Total for a configured set.
 *
 * Velcro follows the SITEWIDE per-piece rule (CEO, 2026-09-03), and a set is
 * priced by its glyph count: 26 x $0.35 = $9.10 on the alphabet, 10 x $0.35 =
 * $3.50 on the numbers. It is charged as a visible line item rather than folded
 * into the headline price, because the headline price is the CEO-set figure.
 */
export function calculateLetterPackageTotal(input: {
  packageId: string;
  glitter?: GlitterOption | null;
  backing: string;
}): { base: number; glitter: number; velcro: number; total: number; pieces: number } | null {
  const pkg = getLetterPackage(input.packageId);
  if (!pkg) return null;

  const glitter = input.glitter ? pkg.glitterFee : 0;
  const velcro = /velcro/i.test(input.backing)
    ? roundMoney(VELCRO_PER_PIECE_FEE * pkg.pieces)
    : 0;

  return {
    base: pkg.price,
    glitter,
    velcro,
    pieces: pkg.pieces,
    total: roundMoney(pkg.price + glitter + velcro),
  };
}

// ---------------------------------------------------------------------------
// COLOUR MATCH — a production gate, not a courtesy email (CEO, 2026-09-03).
// ---------------------------------------------------------------------------
/**
 * Colours the floor stocks and can match on sight. A submission matching this
 * list needs a one-click supervisor confirmation and no customer email;
 * anything else needs the customer to confirm the closest match first.
 *
 * PROVISIONAL — the floor supplies the authoritative list (CLDB68 §3). Treat a
 * miss here as "needs customer confirmation", which is the safe direction: the
 * cost of an unnecessary email is one email, the cost of a wrong assumption is
 * a 26-piece set remade.
 */
export const STANDARD_YARN_COLOURS = [
  "white", "black", "red", "navy", "royal blue", "columbia blue", "gold",
  "silver", "grey", "gray", "kelly green", "forest green", "maroon", "orange",
  "purple", "pink", "yellow", "brown", "cream", "vegas gold",
] as const;

export type ColourMatchPath = "standard" | "needs-customer-confirmation";

/**
 * Customer-facing helper text for the colour input.
 *
 * States the counterintuitive part plainly, flagged by the CRM dev 2026-09-04: a
 * PRECISE input is SLOWER than a vague one. "Royal blue" is a stocked yarn, so a
 * supervisor confirms it and the set goes straight to production. "#1E3A8A" or
 * "PMS 186 C" is exact but is not a yarn we hold, so someone has to pick the
 * nearest and YOU have to approve it before we start.
 *
 * That is the right way round — we would rather wait than guess a $150 set — but
 * a customer who types a Pantone code expecting speed should not be surprised by
 * the wait, so the page says so before they type.
 */
export const COLOUR_INPUT_HELP =
  "Enter a Pantone code, a colour name, or a hex code. If you name a yarn we stock " +
  "(white, black, red, navy, royal blue and the rest), we match it and go straight to " +
  "production. Anything else is exact but not a yarn we hold, so we will email you the " +
  "closest match to approve first — precise codes take a little longer, not less.";

export interface ColourGateResult {
  /** Exactly what the customer typed. Never normalised away. */
  raw: string;
  /** Six-digit hex if the input parses as one, else null. */
  hex: string | null;
  /** Matched standard colour name, else null. */
  standard: string | null;
  path: ColourMatchPath;
}

/**
 * Classify a colour submission. Does NOT decide the yarn — a person does that.
 * This only decides which confirmation path the order takes.
 */
export function letterColourGate(rawInput: string): ColourGateResult {
  const raw = rawInput.trim();
  const lowered = raw.toLowerCase();

  const hexMatch = lowered.match(/^#?([0-9a-f]{6}|[0-9a-f]{3})$/);
  const hex = hexMatch
    ? "#" +
      (hexMatch[1].length === 3
        ? hexMatch[1].split("").map((c) => c + c).join("")
        : hexMatch[1])
    : null;

  const standard =
    STANDARD_YARN_COLOURS.find((c) => c === lowered) ??
    STANDARD_YARN_COLOURS.find((c) => lowered === `${c} chenille` || lowered === `${c} yarn`) ??
    null;

  return {
    raw,
    hex,
    standard: standard ?? null,
    // A hex or a Pantone code is NOT a standard match: it still needs a human to
    // pick the nearest yarn and the customer to accept it.
    path: standard ? "standard" : "needs-customer-confirmation",
  };
}

/**
 * The line written onto the order record. Deliberately verbose and unmissable:
 * production must not start until a supervisor records the matched yarn, and
 * this string is what tells them so.
 */
export function colourGateOrderNote(gate: ColourGateResult): string {
  const parts = [
    `COLOUR MATCH REQUIRED — customer entered: "${gate.raw}"`,
    gate.hex ? `parsed hex ${gate.hex}` : null,
    gate.standard
      ? `matches standard yarn "${gate.standard}" — supervisor confirm, no customer email needed`
      : `NOT a standard yarn colour — email closest match to customer and get confirmation before production`,
    "DO NOT START PRODUCTION until the matched yarn is recorded on this order.",
  ].filter(Boolean);
  return parts.join(" | ");
}
