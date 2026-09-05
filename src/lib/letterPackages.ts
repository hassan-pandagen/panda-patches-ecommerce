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
import { findYarnColour } from "@/lib/yarnColours";

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
export type ColourMatchPath = "yarn-code" | "needs-customer-confirmation";

/**
 * Customer-facing helper text for the colour step.
 *
 * WHAT CHANGED, 2026-09-06. This used to explain a genuinely confusing rule: a
 * PRECISE input (a hex, a Pantone code) was SLOWER than a vague one, because a
 * colour NAME could be matched to one of twenty stocked yarns while an exact
 * code could not. The supplier chart removes the confusion at the source. Pick a
 * code and there is nothing to interpret; the cone is chosen. Type anything else
 * and a person still has to choose the nearest cone and you still have to
 * approve it. Fast is now the same thing as precise, which is what a customer
 * expected all along.
 */
export const COLOUR_INPUT_HELP =
  "Pick a yarn code from the chart and we go straight to production — the code is the " +
  "cone, so there is nothing to confirm. If the colour you need is not on the chart, " +
  "type a Pantone code, a colour name or a hex instead and we will email you the closest " +
  "yarn to approve before we start.";

export interface ColourGateResult {
  /** Exactly what the customer submitted. Never normalised away. */
  raw: string;
  /** Six-digit hex if the input parses as one, else null. */
  hex: string | null;
  /** The stocked yarn code, when one was chosen. Null on the free-text path. */
  yarnCode: string | null;
  path: ColourMatchPath;
}

/**
 * Decide which path a colour submission takes.
 *
 * A CODE ENDS THE QUESTION. If the input is a code from the supplier chart, the
 * yarn is already chosen — no email, no supervisor decision, no gate. Anything
 * else (a Pantone reference, "royal blue", a hex) is exact about intent but says
 * nothing about which cone we hold, so it keeps the confirmation path.
 *
 * Free text is checked against the chart too, deliberately: a customer who types
 * "10029" into the fallback box has picked a code, whatever box they used.
 */
export function letterColourGate(rawInput: string): ColourGateResult {
  const raw = rawInput.trim();
  const lowered = raw.toLowerCase();

  const yarn = findYarnColour(raw);
  if (yarn) {
    return { raw, hex: yarn.hex, yarnCode: yarn.code, path: "yarn-code" };
  }

  const hexMatch = lowered.match(/^#?([0-9a-f]{6}|[0-9a-f]{3})$/);
  const hex = hexMatch
    ? "#" +
      (hexMatch[1].length === 3
        ? hexMatch[1].split("").map((c) => c + c).join("")
        : hexMatch[1])
    : null;

  return { raw, hex, yarnCode: null, path: "needs-customer-confirmation" };
}

/**
 * The line written onto the order record.
 *
 * Two different jobs depending on the path. On the code path it is a receipt:
 * this is the cone, start work. On the free-text path it is still the unmissable
 * DO NOT START notice it always was, because that order genuinely cannot be
 * produced until someone picks a yarn and the customer accepts it.
 */
export function colourGateOrderNote(gate: ColourGateResult): string {
  if (gate.yarnCode) {
    return [
      `YARN CODE SELECTED BY CUSTOMER: ${gate.yarnCode}`,
      "No colour match needed — the code is the yarn. Cleared for production.",
    ].join(" | ");
  }
  return [
    `COLOUR MATCH REQUIRED — customer entered: "${gate.raw}"`,
    gate.hex ? `parsed hex ${gate.hex}` : null,
    "NOT a chart yarn code — email the closest yarn to the customer and get confirmation before production",
    "DO NOT START PRODUCTION until the matched yarn is recorded on this order.",
  ]
    .filter(Boolean)
    .join(" | ");
}

