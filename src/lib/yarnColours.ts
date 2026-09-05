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
 * WHERE THE HEX VALUES COME FROM. Both the codes and the hex values are read
 * from the CEO's supplier chart (`public/assets/yarn-chart.jpeg`): the codes
 * transcribed, the colours SAMPLED from the image pixels on 2026-09-06 by
 * `scripts/sample-yarn-chart.ts`. Each value is the median of the middle half of
 * its swatch — median, not mean, because the swatches carry a fabric texture
 * whose highlights drag a mean lighter than the yarn.
 *
 * They replaced a set of values eyeballed from the same image, and the
 * correction was worth making: the median entry moved 28 points of summed RGB
 * and the worst moved 126, all of them in exactly the range where guessing is
 * hardest — the browns, olives and greys, where a dozen cones sit close together
 * and an estimate can put them in the wrong order.
 *
 * STILL AN APPROXIMATION, AND THAT IS FINE. A sampled JPEG is not a colorimetric
 * reading: the chart was photographed or scanned under one light, compressed,
 * and is now being rendered on a monitor nobody has profiled. The swatch is a
 * navigation aid. THE CODE IS THE PROMISE — it names one cone, it is what the
 * order stores, and it is what the floor pulls. If the supplier ever publishes a
 * digital hex list, prefer it and set HEX_PROVENANCE to "supplier".
 */

/** How the hex values in this file were obtained. Drives the on-page wording. */
export const HEX_PROVENANCE: "estimated" | "sampled" | "supplier" = "sampled";

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
{ code: "10001", hex: "#E8EBF7", family: "white" },
  { code: "10008", hex: "#F9F9F7", family: "white" },
  { code: "10006", hex: "#FAF5DA", family: "white" },
  { code: "10004", hex: "#F9F8B5", family: "yellow" },
  { code: "10007", hex: "#FAF8B1", family: "yellow" },
  { code: "10005", hex: "#F7E86A", family: "yellow" },
  { code: "10002", hex: "#FAA632", family: "orange" },
  { code: "10052", hex: "#F0E19C", family: "tan" },
  { code: "10056", hex: "#D7B782", family: "tan" },
  { code: "10057", hex: "#D7B47E", family: "tan" },
  { code: "10003", hex: "#A07830", family: "brown" },
  { code: "10351", hex: "#C68141", family: "tan" },
  { code: "10051", hex: "#B7652B", family: "orange" },
  { code: "10027", hex: "#A69C3F", family: "olive" },
  { code: "10060", hex: "#F0C696", family: "tan" },
  { code: "10044", hex: "#F8DFBC", family: "white" },
  { code: "10034", hex: "#F78178", family: "pink" },
  { code: "10048", hex: "#F7B265", family: "orange" },
  { code: "10042", hex: "#F67F40", family: "orange" },
  { code: "10045", hex: "#F66A3F", family: "orange" },
  { code: "10041", hex: "#DC4F37", family: "red" },
  { code: "10018", hex: "#F73C40", family: "red" },
  { code: "10014", hex: "#CD121F", family: "red" },
  { code: "10012", hex: "#B13A3B", family: "red" },
  { code: "10019", hex: "#9F4547", family: "pink" },
  { code: "10033", hex: "#F78096", family: "pink" },
  { code: "10031", hex: "#F14483", family: "pink" },
  { code: "10032", hex: "#BD0176", family: "pink" },
  { code: "10013", hex: "#C0444C", family: "red" },
  { code: "10011", hex: "#A63B43", family: "red" },
  { code: "10080", hex: "#660049", family: "purple" },
  { code: "10072", hex: "#4A3F45", family: "grey" },
  { code: "10081", hex: "#343A77", family: "blue" },
  { code: "10071", hex: "#35006A", family: "purple" },
  { code: "10064", hex: "#9BF1FA", family: "teal" },

  // ── chart column 2 ────────────────────────────────────────────────────────
  { code: "10082", hex: "#687AC0", family: "blue" },
  { code: "10061", hex: "#01B7AD", family: "teal" },
  { code: "10062", hex: "#018FB5", family: "blue" },
  { code: "10063", hex: "#82DCB5", family: "green" },
  { code: "10030", hex: "#AFD279", family: "green" },
  { code: "10021", hex: "#006455", family: "teal" },
  { code: "10022", hex: "#B9BF7F", family: "olive" },
  { code: "10024", hex: "#808C3F", family: "olive" },
  { code: "10029", hex: "#1FBD05", family: "green" },
  { code: "10026", hex: "#059C48", family: "green" },
  { code: "10028", hex: "#6C7750", family: "olive" },
  { code: "10023", hex: "#4C522F", family: "olive" },
  { code: "10204", hex: "#3F4831", family: "olive" },
  { code: "10353", hex: "#CEB88E", family: "tan" },
  { code: "10043", hex: "#F7B588", family: "tan" },
  { code: "10354", hex: "#E8CB88", family: "tan" },
  { code: "10010", hex: "#F8AA28", family: "orange" },
  { code: "10047", hex: "#F6A455", family: "orange" },
  { code: "10103", hex: "#F8FA51", family: "yellow" },
  { code: "10050", hex: "#EC8681", family: "pink" },
  { code: "10036", hex: "#F7BFCD", family: "pink" },
  { code: "10040", hex: "#F8A991", family: "pink" },
  { code: "10251", hex: "#F7ADCD", family: "pink" },
  { code: "10020", hex: "#783C3B", family: "brown" },
  { code: "10038", hex: "#F75161", family: "red" },
  { code: "10039", hex: "#C15C6B", family: "pink" },
  { code: "10074", hex: "#A4727D", family: "purple" },
  { code: "10202", hex: "#01A594", family: "teal" },
  { code: "10068", hex: "#74C1D8", family: "blue" },
  { code: "10201", hex: "#008577", family: "teal" },
  { code: "10203", hex: "#BDCB8E", family: "olive" },
  { code: "10352", hex: "#977D41", family: "brown" },
  { code: "10358", hex: "#836A52", family: "brown" },
  { code: "10053", hex: "#6C472E", family: "brown" },
  { code: "10359", hex: "#584738", family: "brown" },

  // ── chart column 3 ────────────────────────────────────────────────────────
  { code: "10104", hex: "#2B2B2B", family: "black" },
  { code: "10085", hex: "#3D4552", family: "grey" },
  { code: "10101", hex: "#FAF790", family: "yellow" },
  { code: "10361", hex: "#DEC997", family: "tan" },
  { code: "10102", hex: "#F8D836", family: "yellow" },
  { code: "10106", hex: "#E59D46", family: "orange" },
  { code: "10107", hex: "#F79E20", family: "orange" },
  { code: "10049", hex: "#FA8537", family: "orange" },
  { code: "10059", hex: "#A89A75", family: "grey" },
  { code: "10375", hex: "#D3BA84", family: "tan" },
  { code: "10376", hex: "#C1AD88", family: "tan" },
  { code: "10372", hex: "#BE9F76", family: "tan" },
  { code: "10357", hex: "#A85437", family: "brown" },
  { code: "10368", hex: "#7F5430", family: "brown" },
  { code: "10362", hex: "#937456", family: "brown" },
  { code: "10153", hex: "#6C3331", family: "red" },
  { code: "10152", hex: "#793739", family: "red" },
  { code: "10155", hex: "#523A34", family: "brown" },
  { code: "10151", hex: "#5B3C3E", family: "brown" },
  { code: "10305", hex: "#F8D9C4", family: "tan" },
  { code: "10260", hex: "#F59798", family: "pink" },
  { code: "10037", hex: "#F697B2", family: "pink" },
  { code: "10303", hex: "#F66D74", family: "pink" },
  { code: "10259", hex: "#F75079", family: "pink" },
  { code: "10218", hex: "#ABC05C", family: "green" },
  { code: "10220", hex: "#01564E", family: "teal" },
  { code: "10208", hex: "#50B7A5", family: "teal" },
  { code: "10405", hex: "#CEF3DC", family: "white" },
  { code: "10223", hex: "#84C5BB", family: "green" },
  { code: "10403", hex: "#76E5C2", family: "teal" },
  { code: "10214", hex: "#B0C29C", family: "olive" },
  { code: "10217", hex: "#5A9863", family: "green" },
  { code: "10070", hex: "#4CA597", family: "teal" },
  { code: "10206", hex: "#75A193", family: "teal" },
  { code: "10025", hex: "#3B4B44", family: "green" },

  // ── chart column 4 ────────────────────────────────────────────────────────
  { code: "10066", hex: "#5CC8C2", family: "teal" },
  { code: "10067", hex: "#9AECEF", family: "teal" },
  { code: "10404", hex: "#C6E5FA", family: "blue" },
  { code: "10090", hex: "#373F4D", family: "grey" },
  { code: "10501", hex: "#41465D", family: "blue" },
  { code: "10087", hex: "#333B4F", family: "grey" },
  { code: "10083", hex: "#2A2D32", family: "black" },
  { code: "10093", hex: "#B2AAA4", family: "grey" },
  { code: "10552", hex: "#827970", family: "grey" },
  { code: "10091", hex: "#626A6C", family: "grey" },
  { code: "10551", hex: "#6A6D5F", family: "grey" },
  { code: "10084", hex: "#375166", family: "blue" },
  { code: "10000", hex: "#373C36", family: "black" },
  { code: "10077", hex: "#783E53", family: "purple" },
  { code: "10076", hex: "#503946", family: "purple" },
  { code: "10079", hex: "#43393A", family: "purple" },
  { code: "10078", hex: "#553A5A", family: "purple" },
  { code: "10369", hex: "#413930", family: "brown" },
  { code: "10016", hex: "#443435", family: "brown" },
  { code: "10058", hex: "#453F38", family: "grey" },
  { code: "10097", hex: "#42453B", family: "olive" },
  { code: "10379", hex: "#8B8265", family: "brown" },
  { code: "10096", hex: "#787468", family: "grey" },
  { code: "10213", hex: "#6D6D4C", family: "olive" },
  { code: "10095", hex: "#ACB4A0", family: "grey" },
  { code: "10381", hex: "#716146", family: "brown" },
  { code: "10054", hex: "#595338", family: "brown" },
  { code: "10055", hex: "#655D4B", family: "brown" },
  { code: "10356", hex: "#705B38", family: "brown" },
  { code: "10360", hex: "#7A6646", family: "brown" },
  { code: "10367", hex: "#6C5C4C", family: "brown" },
  { code: "10100", hex: "#64574C", family: "brown" },
  { code: "10205", hex: "#464A40", family: "olive" },
  { code: "10363", hex: "#846A43", family: "tan" },
  { code: "10207", hex: "#6C821D", family: "green" },
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
