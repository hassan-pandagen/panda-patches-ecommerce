/**
 * Chenille yarn colour chart (CEO, 2026-09-06).
 *
 * WHAT THIS REPLACED, and why it matters. Until today the colour gate held a
 * list of twenty colour NAMES ("royal blue", "kelly green"). A name is not a
 * yarn: two people reading "royal blue" picture different blues, so every order
 * needed a human to decide which cone that meant, and a wrong entry on that list
 * skipped customer confirmation entirely and could ship a $150 set in the wrong
 * shade. That list is deleted. The supplier's chart is the canon now, and a CODE
 * is unambiguous: 10029 is one specific cone on one specific shelf.
 *
 * THE CODE IS THE YARN. When a customer picks a code, there is nothing left to
 * match — the order goes straight to production with `matched_yarn` already set.
 * Free text (a Pantone code, a colour name, a hex) still takes the confirmation
 * path, because it still needs a person to choose the nearest cone and the
 * customer to accept it. See letterColourGate().
 *
 * ⚠ THE HEX VALUES ARE APPROXIMATE AND NOT YET FINAL.
 * The codes below are transcribed from the CEO's supplier chart and are exact.
 * The hex values are eyeballed from that chart image and are NOT sampled — they
 * are close on hue for the saturated colours and least reliable across the
 * browns, taupes and greys, where several sit within a few points of each other
 * on the real chart and my estimates may not preserve the order. Replace them
 * before this ships publicly, by either:
 *   1. the supplier's own digital hex list (asked for 2026-09-06 — preferred), or
 *   2. `npx tsx scripts/sample-yarn-chart.ts <path-to-chart-image>`, which reads
 *      the real pixels out of the chart and prints this table ready to paste.
 * Until one of those runs, `HEX_PROVENANCE` below stays "estimated", and the
 * published chart carries the CEO's own image beside the picker so a customer
 * always has an authoritative visual to check against.
 */

/** How the hex values in this file were obtained. Drives the on-page wording. */
export const HEX_PROVENANCE: "estimated" | "sampled" | "supplier" = "estimated";

export type YarnFamily =
  | "white"
  | "yellow"
  | "orange"
  | "red"
  | "pink"
  | "purple"
  | "blue"
  | "teal"
  | "green"
  | "olive"
  | "brown"
  | "tan"
  | "grey"
  | "black";

export interface YarnColour {
  /** Supplier code. THIS is what we match and what the order record stores. */
  code: string;
  /** Approximate screen rendering. Never authoritative — see the header. */
  hex: string;
  family: YarnFamily;
}

/**
 * In the supplier chart's own order, column by column. Kept in chart order on
 * purpose: a customer holding the printed chart, or looking at the image we
 * publish beside this, can follow the same sequence down the page.
 */
export const YARN_COLOURS: YarnColour[] = [
  // ── chart column 1 ────────────────────────────────────────────────────────
  { code: "10001", hex: "#EDEEF5", family: "white" },
  { code: "10008", hex: "#FBFAF5", family: "white" },
  { code: "10006", hex: "#F5EEDC", family: "white" },
  { code: "10004", hex: "#F7F0C0", family: "yellow" },
  { code: "10007", hex: "#F7EFA8", family: "yellow" },
  { code: "10005", hex: "#F7E96B", family: "yellow" },
  { code: "10002", hex: "#F5A623", family: "orange" },
  { code: "10052", hex: "#EDE0B0", family: "tan" },
  { code: "10056", hex: "#D9BE93", family: "tan" },
  { code: "10057", hex: "#DCC49B", family: "tan" },
  { code: "10003", hex: "#A8813C", family: "brown" },
  { code: "10351", hex: "#C99A5F", family: "tan" },
  { code: "10051", hex: "#C97F42", family: "orange" },
  { code: "10027", hex: "#B5A94E", family: "olive" },
  { code: "10060", hex: "#F0DDC0", family: "tan" },
  { code: "10044", hex: "#F5E8D5", family: "white" },
  { code: "10034", hex: "#F58C7D", family: "pink" },
  { code: "10048", hex: "#F5B96B", family: "orange" },
  { code: "10042", hex: "#F5883C", family: "orange" },
  { code: "10045", hex: "#F4602F", family: "orange" },
  { code: "10041", hex: "#E14A2A", family: "red" },
  { code: "10018", hex: "#F04141", family: "red" },
  { code: "10014", hex: "#D30F1E", family: "red" },
  { code: "10012", hex: "#B3453F", family: "red" },
  { code: "10019", hex: "#A9736E", family: "pink" },
  { code: "10033", hex: "#F58BA8", family: "pink" },
  { code: "10031", hex: "#EC3E86", family: "pink" },
  { code: "10032", hex: "#D4127E", family: "pink" },
  { code: "10013", hex: "#C1445C", family: "red" },
  { code: "10011", hex: "#B34A48", family: "red" },
  { code: "10080", hex: "#6B0A3C", family: "purple" },
  { code: "10072", hex: "#4A3F41", family: "grey" },
  { code: "10081", hex: "#2E3A7A", family: "blue" },
  { code: "10071", hex: "#3B0A7A", family: "purple" },
  { code: "10064", hex: "#A8EEF2", family: "teal" },

  // ── chart column 2 ────────────────────────────────────────────────────────
  { code: "10082", hex: "#6B79D6", family: "blue" },
  { code: "10061", hex: "#14B5A8", family: "teal" },
  { code: "10062", hex: "#0B7FBF", family: "blue" },
  { code: "10063", hex: "#7FCBA8", family: "green" },
  { code: "10030", hex: "#A8C97F", family: "green" },
  { code: "10021", hex: "#0E5C4F", family: "teal" },
  { code: "10022", hex: "#B5B58C", family: "olive" },
  { code: "10024", hex: "#7A8452", family: "olive" },
  { code: "10029", hex: "#3FCC14", family: "green" },
  { code: "10026", hex: "#17A94E", family: "green" },
  { code: "10028", hex: "#6B7A5C", family: "olive" },
  { code: "10023", hex: "#4A4F2E", family: "olive" },
  { code: "10204", hex: "#2E3323", family: "olive" },
  { code: "10353", hex: "#C9BE96", family: "tan" },
  { code: "10043", hex: "#F5B896", family: "tan" },
  { code: "10354", hex: "#EDE0BE", family: "tan" },
  { code: "10010", hex: "#F5A21E", family: "orange" },
  { code: "10047", hex: "#F5A85C", family: "orange" },
  { code: "10103", hex: "#F5F014", family: "yellow" },
  { code: "10050", hex: "#E8807F", family: "pink" },
  { code: "10036", hex: "#F5B6CE", family: "pink" },
  { code: "10040", hex: "#F0A88C", family: "pink" },
  { code: "10251", hex: "#F09ABE", family: "pink" },
  { code: "10020", hex: "#6B4F4A", family: "brown" },
  { code: "10038", hex: "#F53C5C", family: "red" },
  { code: "10039", hex: "#C1526B", family: "pink" },
  { code: "10074", hex: "#96707A", family: "purple" },
  { code: "10202", hex: "#14A89A", family: "teal" },
  { code: "10068", hex: "#6BC4E8", family: "blue" },
  { code: "10201", hex: "#0E8C7A", family: "teal" },
  { code: "10203", hex: "#C9CBA0", family: "olive" },
  { code: "10352", hex: "#B58C4A", family: "brown" },
  { code: "10358", hex: "#96705C", family: "brown" },
  { code: "10053", hex: "#6B4A2E", family: "brown" },
  { code: "10359", hex: "#5C3F2E", family: "brown" },

  // ── chart column 3 ────────────────────────────────────────────────────────
  { code: "10104", hex: "#26262B", family: "black" },
  { code: "10085", hex: "#3B404F", family: "grey" },
  { code: "10101", hex: "#F5EE7A", family: "yellow" },
  { code: "10361", hex: "#D6BE96", family: "tan" },
  { code: "10102", hex: "#F5D414", family: "yellow" },
  { code: "10106", hex: "#F0B22E", family: "orange" },
  { code: "10107", hex: "#F59E14", family: "orange" },
  { code: "10049", hex: "#F5702E", family: "orange" },
  { code: "10059", hex: "#A89A8C", family: "grey" },
  { code: "10375", hex: "#D6C4A0", family: "tan" },
  { code: "10376", hex: "#DCCBA8", family: "tan" },
  { code: "10372", hex: "#C9B596", family: "tan" },
  { code: "10357", hex: "#B35C3C", family: "brown" },
  { code: "10368", hex: "#96806B", family: "brown" },
  { code: "10362", hex: "#A88C70", family: "brown" },
  { code: "10153", hex: "#8C2E3C", family: "red" },
  { code: "10152", hex: "#96343C", family: "red" },
  { code: "10155", hex: "#5C3F3C", family: "brown" },
  { code: "10151", hex: "#4F3338", family: "brown" },
  { code: "10305", hex: "#F5DCC4", family: "tan" },
  { code: "10260", hex: "#F0899A", family: "pink" },
  { code: "10037", hex: "#F07AB5", family: "pink" },
  { code: "10303", hex: "#F5606B", family: "pink" },
  { code: "10259", hex: "#F0407A", family: "pink" },
  { code: "10218", hex: "#B5CC5C", family: "green" },
  { code: "10220", hex: "#0E5C52", family: "teal" },
  { code: "10208", hex: "#3FBFA8", family: "teal" },
  { code: "10405", hex: "#DCF5E0", family: "white" },
  { code: "10223", hex: "#B5CBA0", family: "green" },
  { code: "10403", hex: "#7FF0CE", family: "teal" },
  { code: "10214", hex: "#C4C4A0", family: "olive" },
  { code: "10217", hex: "#7A9A7A", family: "green" },
  { code: "10070", hex: "#3FB5A8", family: "teal" },
  { code: "10206", hex: "#9ABAB5", family: "teal" },
  { code: "10025", hex: "#2E4238", family: "green" },

  // ── chart column 4 ────────────────────────────────────────────────────────
  { code: "10066", hex: "#3FBFB5", family: "teal" },
  { code: "10067", hex: "#8CEEF0", family: "teal" },
  { code: "10404", hex: "#B5D9F5", family: "blue" },
  { code: "10090", hex: "#3B4252", family: "grey" },
  { code: "10501", hex: "#333B52", family: "blue" },
  { code: "10087", hex: "#4A5266", family: "grey" },
  { code: "10083", hex: "#26282E", family: "black" },
  { code: "10093", hex: "#B5ADA5", family: "grey" },
  { code: "10552", hex: "#8C8880", family: "grey" },
  { code: "10091", hex: "#7A8280", family: "grey" },
  { code: "10551", hex: "#6B7A75", family: "grey" },
  { code: "10084", hex: "#3B5C7A", family: "blue" },
  { code: "10000", hex: "#1A1A1A", family: "black" },
  { code: "10077", hex: "#6B2E4F", family: "purple" },
  { code: "10076", hex: "#4F3B4A", family: "purple" },
  { code: "10079", hex: "#4A2E4A", family: "purple" },
  { code: "10078", hex: "#6B4A70", family: "purple" },
  { code: "10369", hex: "#4A2E2E", family: "brown" },
  { code: "10016", hex: "#3B2E2E", family: "brown" },
  { code: "10058", hex: "#3B3833", family: "grey" },
  { code: "10097", hex: "#424238", family: "olive" },
  { code: "10379", hex: "#8C8070", family: "brown" },
  { code: "10096", hex: "#96968C", family: "grey" },
  { code: "10213", hex: "#7A7A5C", family: "olive" },
  { code: "10095", hex: "#B5BAAD", family: "grey" },
  { code: "10381", hex: "#4F4233", family: "brown" },
  { code: "10054", hex: "#6B5C42", family: "brown" },
  { code: "10055", hex: "#7A6B52", family: "brown" },
  { code: "10356", hex: "#6B5C4A", family: "brown" },
  { code: "10360", hex: "#857055", family: "brown" },
  { code: "10367", hex: "#8C7A5C", family: "brown" },
  { code: "10100", hex: "#5C5142", family: "brown" },
  { code: "10205", hex: "#4A4F42", family: "olive" },
  { code: "10363", hex: "#A8906B", family: "tan" },
  { code: "10207", hex: "#8CA83C", family: "green" },
];

/** Family filter order for the picker. Light to dark, warm to cool. */
export const YARN_FAMILIES: { id: YarnFamily; label: string }[] = [
  { id: "white", label: "White & cream" },
  { id: "yellow", label: "Yellow" },
  { id: "orange", label: "Orange" },
  { id: "red", label: "Red" },
  { id: "pink", label: "Pink" },
  { id: "purple", label: "Purple" },
  { id: "blue", label: "Blue" },
  { id: "teal", label: "Teal" },
  { id: "green", label: "Green" },
  { id: "olive", label: "Olive" },
  { id: "tan", label: "Tan & beige" },
  { id: "brown", label: "Brown" },
  { id: "grey", label: "Grey" },
  { id: "black", label: "Black" },
];

const BY_CODE = new Map(YARN_COLOURS.map((c) => [c.code, c]));

/** A code we actually stock, or null. Tolerates whitespace and a stray "#". */
export function findYarnColour(input: string): YarnColour | null {
  return BY_CODE.get(input.trim().replace(/^#/, "")) ?? null;
}

export function isYarnCode(input: string): boolean {
  return findYarnColour(input) !== null;
}

/**
 * The disclaimer. Required wording (CEO 2026-09-06): screen colours are
 * approximate and the CODE is what we match. Worth saying plainly rather than
 * burying — a customer who believes the swatch is exact is a customer who is
 * disappointed on delivery, and unlike a mockup there is no proof step here to
 * catch it.
 */
export const YARN_CHART_DISCLAIMER =
  "Screens vary, and these swatches are a guide rather than an exact reproduction. " +
  "The code is what we match: we pull the cone with that number, so 10029 is the same " +
  "yarn whatever your monitor shows. If the exact shade is critical, tell us and we " +
  "will send a photograph of the cone before production starts.";

/** Used where a picked code needs describing on the order and in the UI. */
export function yarnCodeLabel(code: string): string {
  return `Yarn code ${code}`;
}
