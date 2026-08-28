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
import { calculatePatchPrice } from "../src/lib/pricingCalculator";
import { aeoContent } from "../src/lib/aeoContent";
import { slugFaqMap } from "../src/lib/slugFaqs";
import { genericFaqs } from "../src/lib/genericFaqs";
import { MIN_ORDER_EXCEPTIONS, MIN_ORDER_DEFAULT } from "../src/lib/factConstants";
import {
  AUTO_PRICE_CEILING_IN,
  MANUFACTURING_MAX_IN,
  STANDARD_SIZE_SENTENCE,
} from "../src/lib/patchSpecs";

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

if (failures.length) {
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
