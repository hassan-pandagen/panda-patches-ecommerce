/**
 * Canon guard — fails the build if published copy contradicts what checkout enforces.
 *
 * Run: `npm run verify:canon`
 *
 * WHY THIS EXISTS. In August 2026 the site carried two live, opposite pricing
 * contradictions at the same time:
 *   - /custom-patches/woven promised a 5-piece minimum in visible copy AND in
 *     its FAQPage schema, while the calculator rejected anything under 10. A
 *     buyer only discovered it after designing.
 *   - PVC, printed and sequin advertised a 10-piece minimum the calculator did
 *     not enforce, turning away orders we would happily have taken.
 * Both had been live for months. Nothing caught them because the numbers were
 * hand-typed prose in half a dozen files, and prose does not fail a build.
 *
 * This script makes the calculator the single arbiter: every minimum stated in
 * customer-facing copy must equal the quantity the calculator actually accepts.
 *
 * It deliberately reads the SAME modules the pages render from, so it verifies
 * shipped strings — not a duplicate list of expectations.
 */
import fs from "node:fs";
import path from "node:path";
import { calculatePatchPrice, getFromPrice } from "../src/lib/pricingCalculator";
import { aeoContent } from "../src/lib/aeoContent";
import { slugFaqMap } from "../src/lib/slugFaqs";
import { genericFaqs } from "../src/lib/genericFaqs";
import { MIN_ORDER_EXCEPTIONS, MIN_ORDER_DEFAULT } from "../src/lib/factConstants";
import {
  AUTO_PRICE_CEILING_IN,
  MANUFACTURING_MAX_IN,
  STANDARD_SIZE_SENTENCE,
} from "../src/lib/patchSpecs";

const fromPriceIssues: string[] = [];

const PRODUCTS: Record<string, string> = {
  embroidered: "Custom Embroidered Patches",
  pvc: "Custom PVC Patches",
  woven: "Custom Woven Patches",
  chenille: "Custom Chenille Patches",
  leather: "Custom Leather Patches",
  printed: "Custom Printed Patches",
  sequin: "Custom Sequin Patches",
};

/** Lowest quantity the calculator will actually price, at a given size. */
function enforcedMinimum(productName: string, size = 2): number {
  for (let q = 1; q <= 100; q++) {
    if (!calculatePatchPrice(productName, size, size, q).error) return q;
  }
  return -1;
}

/**
 * Pull every minimum-order figure a piece of copy asserts ABOUT US.
 * The competitor-comparison clause is stripped first: "far below the
 * 50-to-100-piece minimum most patch manufacturers require" describes other
 * suppliers, not our floor, and must not be read as a claim about us.
 */
function statedMinimums(text: string): number[] {
  const t = text.replace(/50-to-100-piece minimum most patch manufacturers require/gi, "");
  const found = new Set<number>();
  const patterns = [
    /minimum(?: order)?(?: for [^.]{0,40})? (?:at Panda Patches )?is (?:just )?(\d{1,3}) pieces/gi,
    /\b(\d{1,3})-piece minimum/gi,
    /Minimum order: (\d{1,3}) pieces/gi,
    /minimum order (?:for [^.]{0,40} )?is (\d{1,3}) pieces/gi,
  ];
  for (const re of patterns) {
    for (const m of t.matchAll(re)) found.add(Number(m[1]));
  }
  return [...found];
}

const failures: string[] = [];

// 1. Per-type copy must match the calculator.
for (const [slug, productName] of Object.entries(PRODUCTS)) {
  const enforced = enforcedMinimum(productName);
  const surfaces: { where: string; text: string }[] = [];

  const aeo = aeoContent[slug];
  if (aeo) {
    surfaces.push({ where: `aeoContent.${slug}.answer`, text: aeo.answer });
    aeo.keyFacts.forEach((k, i) =>
      surfaces.push({ where: `aeoContent.${slug}.keyFacts[${i}]`, text: `${k.label}: ${k.value}` })
    );
    aeo.faqs.forEach((f, i) =>
      surfaces.push({ where: `aeoContent.${slug}.faqs[${i}]`, text: f.a })
    );
  }
  (slugFaqMap[slug] ?? []).forEach((f, i) =>
    surfaces.push({ where: `slugFaqs.${slug}[${i}]`, text: f.answer })
  );

  for (const s of surfaces) {
    for (const claim of statedMinimums(s.text)) {
      if (claim !== enforced) {
        failures.push(
          `${s.where}: states ${claim}-piece minimum, calculator enforces ${enforced}`
        );
      }
    }
  }
}

// 2. Shared generic copy must match the default (it is type-agnostic).
genericFaqs.forEach((f, i) => {
  for (const claim of statedMinimums(f.answer)) {
    if (claim !== MIN_ORDER_DEFAULT) {
      failures.push(
        `genericFaqs[${i}]: states ${claim}-piece minimum, canon default is ${MIN_ORDER_DEFAULT}`
      );
    }
  }
});

// 3. Every declared exception must be real — an exception the calculator does
//    not actually enforce is drift in the constant itself.
for (const [productName, declared] of Object.entries(MIN_ORDER_EXCEPTIONS)) {
  const enforced = enforcedMinimum(productName);
  if (enforced !== declared) {
    failures.push(
      `MIN_ORDER_EXCEPTIONS["${productName}"] = ${declared}, calculator enforces ${enforced}`
    );
  }
}

// 4. The minimum must not vary by SIZE. Canon is 5 at every size (production
//    floor, 2026-08-27), and a size-conditional floor is exactly how an
//    unadvertised minimum crept in before. Sample across the full size range so
//    a reintroduced oversize rule fails the build instead of silently turning
//    away large-format orders.
for (const [slug, productName] of Object.entries(PRODUCTS)) {
  const base = enforcedMinimum(productName, 2);
  const ceil4 = AUTO_PRICE_CEILING_IN[slug as keyof typeof AUTO_PRICE_CEILING_IN];
  for (const size of [4, 8, 12, 14]) {
    // Above the auto-price ceiling nothing is priced at any quantity, so the
    // minimum is undefined there rather than different. Only sample where a
    // price actually exists, or this reports every quote-only size as drift.
    if (size > ceil4) continue;
    const atSize = enforcedMinimum(productName, size);
    if (atSize !== base) {
      failures.push(
        `${slug}: minimum varies by size — ${base} at 2in but ${atSize} at ${size}in. ` +
          `Canon is one minimum at every size.`
      );
    }
  }
}

// 5. Extra types that are not product pages but still take orders.
for (const name of ["Custom 3D Embroidered Transfer", "Custom Chenille TPU Patches", "Custom Chenille Glitter Patches"]) {
  const m = enforcedMinimum(name);
  if (m !== MIN_ORDER_DEFAULT) {
    failures.push(`${name}: enforces ${m}, canon default is ${MIN_ORDER_DEFAULT}`);
  }
}


// ---------------------------------------------------------------------------
// 6. SIZE CEILINGS (CL5E74 §3).
//
// 6a. THE ASSERTION THAT WOULD HAVE CAUGHT THE LEAK. The largest auto-priced
//     size must cost strictly MORE than the size below it. Woven's size-8 row was
//     a byte-copy of size 7 and leather's size-7/8 were copies of size 6, so the
//     table looked complete while a 12-inch leather patch billed at the 6-inch
//     rate. A duplicated top row is indistinguishable from a real one by eye —
//     only this check sees it.
//
//     Deliberately compares only the TOP of the range: small sizes (1 vs 2 in)
//     legitimately share a price on several tables.
// 6b. A type must never auto-price a size it cannot manufacture.
// ---------------------------------------------------------------------------
for (const [slug, productName] of Object.entries(PRODUCTS)) {
  const ceiling = AUTO_PRICE_CEILING_IN[slug as keyof typeof AUTO_PRICE_CEILING_IN];
  const mfg = MANUFACTURING_MAX_IN[slug as keyof typeof MANUFACTURING_MAX_IN];

  if (ceiling > mfg) {
    failures.push(
      `${slug}: auto-price ceiling ${ceiling}in exceeds manufacturing max ${mfg}in — ` +
        `we would quote a size we cannot make.`
    );
  }

  const atCeiling = calculatePatchPrice(productName, ceiling, ceiling, 100);
  const below = calculatePatchPrice(productName, ceiling - 1, ceiling - 1, 100);

  if (atCeiling.error) {
    failures.push(
      `${slug}: ceiling is ${ceiling}in but the calculator will not price ${ceiling}in ` +
        `(${atCeiling.error}). Every selectable size must have a price row.`
    );
  } else if (below.error) {
    // nothing to compare against; the ceiling row exists, which is the main point
  } else if (atCeiling.unitPrice <= below.unitPrice) {
    failures.push(
      `${slug}: ${ceiling}in costs $${atCeiling.unitPrice.toFixed(2)} but ${ceiling - 1}in ` +
        `costs $${below.unitPrice.toFixed(2)} — the top price row is a DUPLICATE of the one ` +
        `below it, so oversize orders are underpriced. Add real price data or lower the ceiling.`
    );
  }

  // One inch above the ceiling must be quote-only, never a number.
  const above = calculatePatchPrice(productName, ceiling + 1, ceiling + 1, 100);
  if (!above.error) {
    failures.push(
      `${slug}: ${ceiling + 1}in returned a price ($${above.unitPrice.toFixed(2)}) but the ` +
        `auto-price ceiling is ${ceiling}in. Above the ceiling must be quote-only.`
    );
  }
}

// ---------------------------------------------------------------------------
// 6c. MONOTONICITY — price must never DECREASE as a patch gets bigger.
//
// NOW ENFORCED. Shipped as an advisory for one build, then flipped once the table
// was clean (CEO, 2026-08-28: correct by derivation rather than wait for the
// factory). The advisory found the live leather qty-200 inversion; enforcing it
// means this class cannot regress silently.
//
// Two axes, both required:
//   size     bigger patch must never cost LESS per piece
//   quantity bigger order must never cost MORE per piece
// The second was added after the narrower qty-200 derivation fixed the size axis
// by breaking the quantity one. A table can satisfy either alone and still be
// incoherent.
//
// Where this sits among the three checks:
//   duplicate-top-row  catches FABRICATED data (a row copied from its neighbour)
//   ceiling            catches UNPRICEABLE data (a selectable size with no row)
//   monotonicity       catches INCOHERENT data (bigger patch, smaller price)
// The class none of them catch is data that is distinct, priceable, coherent —
// and simply wrong. Only the floor confirming a number covers that, or the
// "CEO-DERIVED, NOT factory-quoted" label saying it never was confirmed.
// ---------------------------------------------------------------------------
const MONOTONICITY_ENFORCED = true;

/** Sampling every real tier break; calculatePatchPrice snaps to the tier itself. */
const QTY_BREAKS = [5, 10, 25, 50, 100, 200, 500, 1000, 5000];

const inversions: string[] = [];

for (const [slug, productName] of Object.entries(PRODUCTS)) {
  const ceiling = AUTO_PRICE_CEILING_IN[slug as keyof typeof AUTO_PRICE_CEILING_IN];
  for (const qty of QTY_BREAKS) {
    let prevPrice = -1;
    let prevSize = 0;
    for (let size = 1; size <= ceiling; size++) {
      const r = calculatePatchPrice(productName, size, size, qty);
      if (r.error) continue;
      if (prevPrice >= 0 && r.unitPrice < prevPrice - 0.001) {
        inversions.push(
          `${slug} @ qty ${qty}: ${prevSize}in $${prevPrice.toFixed(2)} -> ${size}in $${r.unitPrice.toFixed(2)}`
        );
      }
      prevPrice = r.unitPrice;
      prevSize = size;
    }
  }
}

// The OTHER axis: per-piece price must never RISE as quantity rises. Added after
// correcting the qty-200 leather column, where the narrower derivation would have
// fixed the size axis by breaking this one (8in@200 $4.37 vs 8in@500 $4.60 — pay
// more per piece for ordering more). A table can be monotonic in size and still
// be incoherent in quantity; both need asserting or a fix on one axis can quietly
// damage the other.
for (const [slug, productName] of Object.entries(PRODUCTS)) {
  const ceiling = AUTO_PRICE_CEILING_IN[slug as keyof typeof AUTO_PRICE_CEILING_IN];
  for (let size = 1; size <= ceiling; size++) {
    let prevPrice = Number.POSITIVE_INFINITY;
    let prevQty = 0;
    for (const qty of QTY_BREAKS) {
      const r = calculatePatchPrice(productName, size, size, qty);
      if (r.error) continue;
      if (r.unitPrice > prevPrice + 0.001) {
        inversions.push(
          `${slug} @ ${size}in: qty ${prevQty} $${prevPrice.toFixed(2)} -> qty ${qty} $${r.unitPrice.toFixed(2)} (per-piece RISES with volume)`
        );
      }
      prevPrice = r.unitPrice;
      prevQty = qty;
    }
  }
}

if (inversions.length && MONOTONICITY_ENFORCED) {
  inversions.forEach((i) => failures.push(`price incoherence — ${i}`));
}

// ---------------------------------------------------------------------------
// 7. PROSE SWEEP — every minimum claim in shipped copy, not just the FAQ modules.
//
// Sections 1-5 only see values that flow through aeoContent/slugFaqs/genericFaqs.
// Three separate stragglers escaped that in one week — a stale "10-piece minimum"
// on the 3D-transfer row, "rush from roughly 10 to 10,000 patches" in two places,
// and a "minimum order ... is 25 pieces" line in the chenille guide. Each was
// hand-typed prose in a page component, and prose does not fail a build.
//
// So this walks the actual source and flags any numeric minimum claim that is not
// MIN_ORDER_DEFAULT. Known-fine phrasings must be WAIVED EXPLICITLY below, with a
// reason — waiving is a deliberate act, not a silent regex tweak.
// ---------------------------------------------------------------------------

const SCAN_ROOTS = ["src", "public/llms.txt"];
const SCAN_EXT = new Set([".ts", ".tsx", ".txt", ".md"]);

/** Claim shapes that assert OUR minimum. */
const CLAIM_PATTERNS: RegExp[] = [
  /\b(\d{1,3})[- ]piece minimum\b/gi,
  /\bminimum(?:\s+order)?(?:\s+quantity)?(?:\s+for\s+[^.]{0,45}?)?(?:\s+at\s+Panda\s+Patches)?\s+is\s+(?:just\s+|only\s+)?(\d{1,3})\s+pieces?\b/gi,
  /\bminimum\s+order[^.]{0,45}?\b(\d{1,3})\s+pieces?\b/gi,
  /\bfrom\s+as\s+few\s+as\s+(\d{1,3})\s+pieces?\b/gi,
  /\baccepts?\s+orders?\s+from\s+(\d{1,3})\s+pieces?\b/gi,
];

/**
 * Sentences that legitimately contain a non-5 piece number. Each needs a reason;
 * if you are adding one to make the build pass, stop and check the copy first.
 */
const WAIVERS: { re: RegExp; why: string }[] = [
  { re: /most patch manufacturers require/i, why: "describes competitors, not us" },
  { re: /competitors?\b/i, why: "competitor comparison" },
  { re: /other patch (makers|shops|manufacturers)/i, why: "competitor comparison" },
  { re: /(Monterey|Signature Patches|EverLighten|ShipBob|Wikipedia|IBISWorld|PPAI)/i, why: "third-party cited source" },
  { re: /starter pack|fixed-price pack|offer pack|packs? (begin|start)/i, why: "fixed-price packs, not the order minimum" },
  { re: /median|average order|% of orders|share of orders/i, why: "production statistic, not a minimum" },
  { re: /their (own )?MOQs|fine print|hidden minimum|walk-in shop/i, why: "describes other vendors" },
  { re: /low minimum of \d+\s*-\s*\d+ pieces/i, why: "generic buying advice about the industry" },
  { re: /their/i, why: "sentence is about another vendor" },
  { re: /suppliers (often|typically|usually)/i, why: "describes the supplier market, not us" },
  { re: /industry (average|averages|norms?|standard)/i, why: "industry benchmark, not our floor" },
];

/**
 * Whole files that exist to describe OTHER vendors. Every piece-count in a
 * head-to-head page is a competitor's, so scanning them produces only noise.
 * Keep this list tight — a page that also states OUR minimum should not be here.
 */
const WAIVED_PATHS: RegExp[] = [
  /panda-patches-vs-/i,
  // Windows and POSIX separators both — path.join gives backslashes here.
  /ai-info[\\/]competitor-comparison/i,
];

interface ProseHit { file: string; line: number; claimed: number; sentence: string }

function walk(target: string, out: string[]) {
  const stat = fs.existsSync(target) ? fs.statSync(target) : null;
  if (!stat) return;
  if (stat.isFile()) {
    if (SCAN_EXT.has(path.extname(target))) out.push(target);
    return;
  }
  for (const entry of fs.readdirSync(target)) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    walk(path.join(target, entry), out);
  }
}

/**
 * Tight sentence, for the human-readable failure message.
 *
 * Note this is deliberately NOT what waivers are tested against. In a .tsx file
 * the nearest "." is often inside code (`robots: { index: true }`), which yields
 * a window with none of the surrounding prose — that is how a plainly-competitor
 * sentence slipped past the waivers on the first run of this check.
 */
function sentenceAround(text: string, idx: number): string {
  const start = Math.max(0, text.lastIndexOf(".", idx - 1) + 1);
  let end = text.indexOf(".", idx);
  if (end === -1) end = Math.min(text.length, idx + 200);
  return text.slice(start, end + 1).replace(/\s+/g, " ").trim();
}

/**
 * Blank out comments before scanning. Comments are NOT shipped copy, and they
 * legitimately quote old/wrong values — the changelog notes in patchSpecs and
 * pricingCalculator cite superseded minimums on purpose, and the note atop
 * locationFaqs quotes the exact "50 pieces" line this guard was written to catch.
 * Without this the guard flags its own documentation.
 *
 * Only whole lines whose trimmed form starts a comment are removed, so a URL
 * like "https://…" sitting inside a string is never touched. Offsets are
 * preserved (comments become spaces) so reported line numbers stay accurate.
 */
function stripComments(text: string, file: string): string {
  if (!/\.tsx?$/.test(file)) return text;
  const out = text.split("\n").map((line) => {
    const t = line.trim();
    return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("*/")
      ? " ".repeat(line.length)
      : line;
  });
  return out.join("\n");
}

/**
 * Wider fixed window used for WAIVER matching. Sentence boundaries are
 * unreliable in source files, so context wins over precision here: a missed
 * waiver is a false alarm that trains people to ignore the guard.
 */
function contextAround(text: string, idx: number): string {
  const start = Math.max(0, idx - 320);
  const end = Math.min(text.length, idx + 320);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

const proseHits: ProseHit[] = [];
const files: string[] = [];
SCAN_ROOTS.forEach((r) => walk(r, files));

for (const file of files) {
  // The guard defines these patterns itself; scanning it would self-trip.
  if (path.resolve(file) === path.resolve("scripts/verify-canon.ts")) continue;
  if (WAIVED_PATHS.some((r) => r.test(file))) continue;
  const text = stripComments(fs.readFileSync(file, "utf8"), file);
  for (const re of CLAIM_PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const claimed = Number(m[1]);
      if (claimed === MIN_ORDER_DEFAULT) continue;
      // Captured before the closure below: TS cannot narrow `m` inside a callback.
      const at = m.index;
      const sentence = sentenceAround(text, at);
      const context = contextAround(text, at);
      if (WAIVERS.some((w) => w.re.test(context))) continue;
      proseHits.push({
        file,
        line: text.slice(0, m.index).split("\n").length,
        claimed,
        sentence: sentence.length > 190 ? sentence.slice(0, 190) + "…" : sentence,
      });
    }
  }
}

for (const h of proseHits) {
  failures.push(
    `${h.file}:${h.line}: prose claims a ${h.claimed}-piece minimum (canon is ${MIN_ORDER_DEFAULT})\n      "${h.sentence}"`
  );
}

// ---------------------------------------------------------------------------
// 8. PROSE SIZE CLAIMS (CL5E74 §3.3).
//
// A global sentence cannot state an instant-pricing ceiling, because there are
// seven of them and they move as price rows land. Two versions of that sentence
// shipped and went stale within a day of each other — "up to 14 inches (8 for
// woven, leather and PVC)" was untrue when written, since the real ceilings were
// 14/14/7/6/8/12/14.
//
// So: no prose anywhere may state a blanket instant-pricing figure. Per-type
// numbers come from instantPricingLine(), derived from AUTO_PRICE_CEILING_IN.
// Manufacturing maximums ARE quotable, because they are stable and per-type.
// ---------------------------------------------------------------------------
const BLANKET_PRICING_CLAIM = [
  /instant(?:\s+on-site)?\s+pricing[^.]{0,40}\bup to\s+\d+\s*(?:in\b|inch)/gi,
  /pric(?:es|ing|ed)\s+instantly[^.]{0,30}\bup to\s+\d+\s*(?:in\b|inch)/gi,
];

for (const file of files) {
  if (path.resolve(file) === path.resolve("scripts/verify-canon.ts")) continue;
  const text = stripComments(fs.readFileSync(file, "utf8"), file);
  for (const re of BLANKET_PRICING_CLAIM) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const at = m.index;
      failures.push(
        `${file}:${text.slice(0, at).split("\n").length}: prose states a blanket instant-pricing ` +
          `ceiling — "${m[0].replace(/\s+/g, " ")}". There are seven different ceilings ` +
          `(${Object.entries(AUTO_PRICE_CEILING_IN).map(([k, v]) => `${k} ${v}in`).join(", ")}) ` +
          `and they change as price rows land. Use instantPricingLine(slug) per type instead.`
      );
    }
  }
}

// The global size sentence must stay numberless — that is the whole point of it.
if (/\d/.test(STANDARD_SIZE_SENTENCE)) {
  failures.push(
    `STANDARD_SIZE_SENTENCE contains a digit ("${STANDARD_SIZE_SENTENCE}"). It is global ` +
      `copy and must carry no numbers; per-type figures belong in instantPricingLine().`
  );
}

const summary = Object.entries(PRODUCTS)
  .map(([slug, n]) => `${slug}=${enforcedMinimum(n)}`)
  .join("  ") +
  `  |  3D-transfer=${enforcedMinimum("Custom 3D Embroidered Transfer")}` +
  `  chenille@12in=${enforcedMinimum("Custom Chenille Patches", 12)}`;

/** Advisories print on BOTH the pass and fail paths — a warning nobody sees is not a warning. */
function printAdvisories() {
  if (inversions.length && !MONOTONICITY_ENFORCED) {
    console.log("\n⚠ Price DECREASES as size increases — a bigger patch costs less per piece:");
    inversions.forEach((i) => console.log(`   ${i}`));
    console.log(
      `   ${inversions.length} inversion(s). Advisory only until the floor confirms the correct\n` +
        "   figures; set MONOTONICITY_ENFORCED = true to make this fail the build."
    );
  }
}

// ---------------------------------------------------------------------------
// 9. The specs page may not restate a maximum size as a literal.
//
// WHY THIS EXISTS. /patch-manufacturability-specs is the published, versioned
// standard — its whole value is that a citation stays traceable. On 2026-09-01
// it carried SEVEN stale size figures: the FAQ and three JSON-LD entries said
// embroidered 20in / chenille 14in / printed-sequin 12in, and the per-type prose
// repeated the same three. The quick-reference matrix was correct the whole time
// because it renders `specMatrix` by import.
//
// So the page stated two different maxima for the same patch type, and the WRONG
// one sat in the Dataset block — the half written to be machine-read and quoted.
// A human comparing table to prose would catch it; nothing else would.
//
// Sections 6-8 check that CANON agrees with the CALCULATOR. None of them look at
// whether a PAGE agrees with canon, which is why this survived a passing build.
// The fix in the page was to delete the second copy: every figure is now derived
// through a MAX() helper reading MANUFACTURING_MAX_IN. This assertion keeps it
// that way — retyping a number is the defect, not getting it wrong.
const SPECS_PAGE = path.join(process.cwd(), "src/app/patch-manufacturability-specs/page.tsx");

if (fs.existsSync(SPECS_PAGE)) {
  const raw = stripComments(fs.readFileSync(SPECS_PAGE, "utf8"), SPECS_PAGE);

  // Only the inch values that ARE maximum-size claims. Minimum text height,
  // letter minimums (2in / 3in chenille), merrow minimums (0.8in) and mm
  // conversions are legitimate literals and must not trip this.
  const MAX_CLAIM =
    /(maximum(?:\s+standard)?(?:\s+patch)?\s+size[^.<>{}]{0,40}?|(?:go|goes|reach(?:es)?|up)\s+to\s+)(\d+(?:\.\d+)?)\s*(?:in\b|inch|inches)/gi;

  const canonInches = new Set(Object.values(MANUFACTURING_MAX_IN).map(String));
  const offenders: string[] = [];

  for (const m of raw.matchAll(MAX_CLAIM)) {
    const line = raw.slice(0, m.index ?? 0).split("\n").length;
    offenders.push(
      `patch-manufacturability-specs/page.tsx:${line}: maximum size written as the literal ` +
        `"${m[2]} in". Derive it — MAX("<type>") reads MANUFACTURING_MAX_IN. ` +
        (canonInches.has(m[2])
          ? "It happens to be correct today; it will not survive the next version bump."
          : `Canon has no type with a ${m[2]}in maximum, so this figure is already wrong.`)
    );
  }

  if (offenders.length) failures.push(...offenders);

  // The derivation must actually be wired up, or the check above passes on a
  // page that simply stopped mentioning sizes.
  if (!raw.includes("MANUFACTURING_MAX_IN")) {
    failures.push(
      "patch-manufacturability-specs/page.tsx: does not import MANUFACTURING_MAX_IN. " +
        "Every maximum-size figure on the published standard must be derived from canon."
    );
  }
}

// ---------------------------------------------------------------------------
// 10. No ADJACENT size rows may be byte-identical above the small-size floor.
//
// Section 6a checks only the TOP row of each table, and says why: sizes 1 and 2
// legitimately share a price on several tables. That exclusion is correct --
// 6 of 9 tables share size-1/size-2 pricing (embroidery, chenille, TPU, 3D
// transfer, PVC, sublimated), because both sit at the small-piece production
// floor.
//
// But "only the top" leaves the whole middle unchecked. Woven's size-8 row was
// a copy of size 7 and leather's 7 and 8 were copies of 6; had either landed one
// row lower, section 6a would have passed and a 12-inch patch would still be
// billing at a smaller size's rate. This closes that gap: from size 3 upward,
// no two adjacent rows may be identical.
//
// Reads the source text rather than the exported tables, because the defect is
// a literal copy-paste of a row and that is what has to be visible.
const PRICING_SRC = path.join(process.cwd(), "src/lib/pricingCalculator.ts");
const SMALL_SIZE_FLOOR = 3; // sizes 1-2 may legitimately share a price

if (fs.existsSync(PRICING_SRC)) {
  const src = fs.readFileSync(PRICING_SRC, "utf8");
  const tables = src.matchAll(/const (\w*[Pp]ricing)\s*=\s*\{([\s\S]*?)\n\};/g);

  for (const t of tables) {
    const [, tableName, body] = t;
    const rows = new Map<number, string>();
    for (const r of body.matchAll(/^\s*(\d+):\s*\[([^\]]+)\]/gm)) {
      rows.set(Number(r[1]), r[2].replace(/\s+/g, ""));
    }
    const sizes = [...rows.keys()].sort((a, b) => a - b);
    for (let i = 1; i < sizes.length; i++) {
      const prev = sizes[i - 1];
      const cur = sizes[i];
      if (cur < SMALL_SIZE_FLOOR) continue;
      if (rows.get(prev) === rows.get(cur)) {
        failures.push(
          `pricingCalculator.ts: ${tableName} size ${cur} is a byte-identical copy of ` +
            `size ${prev}. A duplicated row prices the larger size at the smaller one's ` +
            `rate — the defect that billed a 12-inch leather patch at the 6-inch price. ` +
            `Derive the row or mark it CEO-DERIVED with the method.`
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 11. FROM-PRICES: SINGLE-TYPE LINES MUST MATCH THE CALCULATOR (CL0852 P0-1).
//
// The 31 Aug audit found /custom-patches/chenille quoting THREE from-prices on
// one page: $1.31 in the hero table, $1.47 in the comparison table, and $0.91 in
// the cost FAQ -- which is EMBROIDERED's price, with embroidered pack prices
// quoted under it as though they were chenille's.
//
// DELIBERATELY NARROW, and it took two rewrites to get here. A +/-90 character
// window flagged 19 correct lines. Attributing each price to its NEAREST type
// name still flagged 11, because in a list like "embroidered $0.91, PVC $1.40,
// woven $1.54" the types and prices interleave and "nearest" stops meaning
// anything.
//
// So: only lines naming EXACTLY ONE patch type and quoting EXACTLY ONE per-piece
// price are checked. There the attribution is unambiguous. Multi-type lines are
// skipped entirely -- real coverage lost, in exchange for zero false positives,
// which is the right trade for a check that fails the build. A guard that cries
// wolf gets switched off, and then it protects nothing at all.
//
// This still catches the bug that prompted it: a chenille FAQ answer quoting
// embroidered's price is a single-type line.
const FROM_PRICE_TYPES: Record<string, string> = {
  embroidered: "Custom Embroidered Patches",
  pvc: "Custom PVC Patches",
  woven: "Custom Woven Patches",
  chenille: "Custom Chenille Patches",
  leather: "Custom Leather Patches",
  printed: "Custom Printed Patches",
  sequin: "Custom Sequin Patches",
};

{
  const realFrom = new Map<string, number>();
  for (const [slug, product] of Object.entries(FROM_PRICE_TYPES)) {
    realFrom.set(slug, Number(getFromPrice(product).toFixed(2)));
  }
  const priceOwner = new Map<number, string>();
  for (const [slug, v] of realFrom) priceOwner.set(v, slug);

  // A partner-discounted or pack figure is SUPPOSED to differ from the retail
  // from-price, so those lines are not from-price claims at all.
  // NARROW ON PURPOSE. The first version also skipped lines containing "pack",
  // "starter", "team", "business", "club" — pack NAMES — which silently disabled
  // the check across most product copy: the chenille answer says "schools, teams,
  // and retro fashion brands", so "team" matched and the line was never examined.
  // A skip list built from ordinary marketing vocabulary turns a guard off
  // without anyone noticing. Only genuine non-retail pricing contexts belong here.
  const SKIP = /wholesale|partner tier|% off|discount/i;


  for (const file of files) {
    const text = stripComments(fs.readFileSync(file, "utf8"), file);
    const lines = text.split("\n");

    lines.forEach((line, idx) => {
      if (SKIP.test(line)) return;
      // Only prices that are actually CLAIMED as a starting price, and the cue
      // has to sit immediately before the figure. Without this the check reports
      // every legitimate per-piece figure on the site: $3.92/pc is the 50-piece
      // embroidered rate, $0.35/pc is the Velcro fee, $6.00/pc a small-quantity
      // price. A line-wide cue test is not enough either — "costs $3.92 per
      // piece at 50 ... free worldwide shipping" would still pass it.
      const FROM_CUE = /\b(?:from|start(?:s|ing)?(?:\s+at)?|as low as)\s*$/i;
      // A price qualified by a quantity is a tier rate, not a from-price.
      const QTY_QUALIFIED = /^\s*at\s+[\d,]+/i;
      // Compound product names that CONTAIN a base type name but are priced from
      // their own table: "3D Embroidered Transfers" is not "embroidered", and
      // "Chenille TPU"/"Chenille Glitter" are not "chenille". Without this the
      // check reports four correct 3D-transfer lines as embroidered drift.
      if (/\b3d\s+embroider|chenille\s+(?:tpu|glitter)/i.test(line)) return;

      // String.raw, not a plain template literal: inside `...`, \b is the
      // BACKSPACE escape (U+0008), not a regex word boundary. Written as
      // `\b${slug}\b` this matched a literal backspace, found nothing, and the
      // whole check passed silently on every file — which is the worst way for a
      // guard to fail, because it looks exactly like "no problems found".
      const typesOnLine = [...realFrom.keys()].filter((slug) =>
        new RegExp(String.raw`\b` + slug + String.raw`\b`, "i").test(line),
      );
      if (typesOnLine.length !== 1) return;

      const prices = [...line.matchAll(/\$(\d+\.\d{2})\s*(?:\/\s*(?:pc|piece)|per piece)/gi)];
      if (prices.length !== 1) return;

      const at = prices[0].index ?? 0;
      const before = line.slice(Math.max(0, at - 40), at);
      const after = line.slice(at + prices[0][0].length, at + prices[0][0].length + 20);
      if (!FROM_CUE.test(before)) return;
      if (QTY_QUALIFIED.test(after)) return;

      const slug = typesOnLine[0];
      const expected = realFrom.get(slug)!;
      const found = Number(Number(prices[0][1]).toFixed(2));
      if (Math.abs(found - expected) < 0.005) return;

      const owner = priceOwner.get(found);
      fromPriceIssues.push(
        `${file}:${idx + 1}: "$${prices[0][1]}/pc" on a ${slug}-only line, but ` +
          (owner && owner !== slug
            ? `that is ${owner.toUpperCase()}'s from-price. `
            : `${slug} starts at $${expected.toFixed(2)}. `) +
          `Derive it with getFromPriceLabel("${FROM_PRICE_TYPES[slug]}").`,
      );
    });
  }
}

if (fromPriceIssues.length) failures.push(...[...new Set(fromPriceIssues)]);

if (failures.length) {
  printAdvisories();
  console.error("\nCANON CHECK FAILED\n");
  failures.forEach((f) => console.error("  x " + f));
  console.error(`\nEnforced minimums: ${summary}`);
  console.error(
    "\nFix the COPY to match the calculator, or change the calculator deliberately\n" +
      "and sweep every surface. Do not silence this check.\n"
  );
  process.exit(1);
}

console.log(`Canon check passed — every stated minimum matches the calculator.`);
console.log(`Enforced minimums: ${summary}`);

// Advisory, NOT a failure. These ceilings are correct-but-lower-than-intended:
// the target from CL5E74 is unreachable until real price rows exist. Printing it
// on every build keeps the gap visible instead of letting a "temporary" ceiling
// quietly become permanent — which is how the duplicated rows survived in the
// first place.
const CEILING_TARGETS: Record<string, number> = { woven: 8, leather: 8, printed: 14 };
const blocked = Object.entries(CEILING_TARGETS).filter(
  ([slug, target]) => AUTO_PRICE_CEILING_IN[slug as keyof typeof AUTO_PRICE_CEILING_IN] < target
);
if (blocked.length) {
  console.log("\n⚠ Auto-price ceilings below their CL5E74 target — awaiting real price rows:");
  for (const [slug, target] of blocked) {
    const now = AUTO_PRICE_CEILING_IN[slug as keyof typeof AUTO_PRICE_CEILING_IN];
    console.log(`   ${slug.padEnd(9)} at ${now}in, target ${target}in — sizes ${now + 1}-${target}in are quote-only`);
  }
  console.log("   Raise each ceiling only after replacing the duplicated top price rows.");
}
console.log(`Prose sweep: ${files.length} files scanned, 0 unwaived minimum claims.`);
printAdvisories();
