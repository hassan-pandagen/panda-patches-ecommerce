#!/usr/bin/env node
/**
 * SINGLE SOURCE OF TRUTH: pull the volatile business facts out of Sanity and
 * write them into the code + llms.txt, so no number is ever maintained by hand
 * in two places.
 *
 * WHY THIS EXISTS
 * ---------------
 * These figures refresh every week or two (Trustpilot score and count, the
 * median order, the published order-dataset size). They used to live in three
 * places at once — the Sanity `companyFacts` singleton, a hardcoded fallback in
 * src/lib/reviewConstants.ts, and literal numbers typed into public/llms.txt —
 * with nothing keeping them in agreement. Every one of them drifted:
 *
 *   - The homepage read "4.7/5 from 76 reviews" for weeks. The code said 4.8/85.
 *     Sanity said 4.7/76 and Sanity wins at runtime, so every code fix was
 *     invisible.
 *   - orderDatasetCount: 896 in Sanity, 963 in code.
 *   - medianOrderPieces: 20 in Sanity, 25 in code.
 *   - llms.txt said "83 reviews" in four places. It is a static file, so no
 *     constant could ever reach it.
 *
 * THE RULE NOW
 * ------------
 * Edit the numbers in Sanity Studio. Nowhere else. Run this script (it also
 * runs automatically before every build) and it rewrites the code fallback and
 * llms.txt to match. If you edit a number in a source file by hand, the next
 * build overwrites it — that is the point.
 *
 * It FAILS LOUDLY rather than silently skipping: if a sentence in llms.txt no
 * longer matches the expected shape, the script exits non-zero and names it, so
 * a reworded file can never quietly stop being updated.
 *
 * Usage:  node scripts/sync-company-facts.mjs [--check]
 *         --check reports drift and exits 1 without writing (for CI).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK_ONLY = process.argv.includes("--check");

// ── read env without pulling in a dotenv dependency ────────────────────────
function readEnv() {
  const out = { ...process.env };
  for (const f of [".env.local", ".env"]) {
    try {
      for (const line of readFileSync(resolve(ROOT, f), "utf8").split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !out[m[1]]) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    } catch { /* file absent is fine */ }
  }
  return out;
}

const env = readEnv();
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
if (!projectId) {
  console.error("[facts] NEXT_PUBLIC_SANITY_PROJECT_ID missing — cannot sync.");
  process.exit(1);
}

// ── fetch the singleton (published perspective, no token needed) ───────────
const query = encodeURIComponent(
  `*[_id == "companyFacts"][0]{trustpilotRating,trustpilotReviewCount,reviewLastChecked,trustpilotProfileUrl,medianOrderPieces,orderDatasetCount}`
);
const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;

let facts;
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  facts = (await res.json()).result;
} catch (err) {
  console.error(`[facts] Sanity fetch failed: ${err.message}`);
  console.error("[facts] Leaving existing values untouched — build continues on the last known good numbers.");
  process.exit(0); // never block a build on a transient CMS outage
}

if (!facts) {
  console.error("[facts] No companyFacts document found. Nothing to sync.");
  process.exit(0);
}

const required = ["trustpilotRating", "trustpilotReviewCount", "reviewLastChecked", "medianOrderPieces", "orderDatasetCount"];
const missing = required.filter((k) => facts[k] === null || facts[k] === undefined);
if (missing.length) {
  console.error(`[facts] companyFacts is missing: ${missing.join(", ")}. Fill them in Sanity Studio.`);
  process.exit(1);
}

const rating = String(facts.trustpilotRating);
const count = Number(facts.trustpilotReviewCount);
const checked = String(facts.reviewLastChecked);
const median = Number(facts.medianOrderPieces);
const dataset_n = Number(facts.orderDatasetCount);

console.log(`[facts] Sanity: ${rating}/5 · ${count} reviews · checked ${checked} · median ${median} · dataset ${dataset_n}`);

const edits = [];

/** Replace via regex, recording drift. Throws if the pattern is gone. */
function apply(file, label, pattern, replacer) {
  const path = resolve(ROOT, file);
  const before = readFileSync(path, "utf8");
  if (!pattern.test(before)) {
    console.error(`[facts] PATTERN NOT FOUND — ${file}: ${label}`);
    console.error("[facts] The file was reworded. Fix the pattern in this script; do not hand-edit the number.");
    process.exitCode = 1;
    return;
  }
  const after = before.replace(pattern, replacer);
  if (after !== before) {
    edits.push(`${file} — ${label}`);
    if (!CHECK_ONLY) writeFileSync(path, after);
  }
}

// ── 1. the code fallback ───────────────────────────────────────────────────
apply("src/lib/reviewConstants.ts", "TRUSTPILOT_RATING",
  /export const TRUSTPILOT_RATING = "[^"]*";/, `export const TRUSTPILOT_RATING = "${rating}";`);
apply("src/lib/reviewConstants.ts", "TRUSTPILOT_REVIEW_COUNT",
  /export const TRUSTPILOT_REVIEW_COUNT = \d+;/, `export const TRUSTPILOT_REVIEW_COUNT = ${count};`);
apply("src/lib/reviewConstants.ts", "TRUSTPILOT_LAST_CHECKED",
  /export const TRUSTPILOT_LAST_CHECKED = "[^"]*";/, `export const TRUSTPILOT_LAST_CHECKED = "${checked}";`);
apply("src/lib/companyFacts.ts", "medianOrderPieces fallback",
  /medianOrderPieces: \d+,/, `medianOrderPieces: ${median},`);
apply("src/lib/companyFacts.ts", "orderDatasetCount fallback",
  /orderDatasetCount: \d+,/, `orderDatasetCount: ${dataset_n},`);

// ── 2. llms.txt — the static file that no constant can reach ───────────────
apply("public/llms.txt", "rating + count (all occurrences)",
  /\b\d\.\d(\/5|\s+out of 5)([^\n]*?)\b\d+(\s+(?:customer\s+)?reviews)/g,
  // 3 capture groups, so the callback args are (match, g1, g2, g3). An earlier
  // version took a 4th name, which silently bound to `offset` and appended the
  // match position into the sentence. --check caught it by reporting drift on
  // values that already agreed.
  (_m, per5, mid, tail) => `${rating}${per5}${mid}${count}${tail}`);
apply("public/llms.txt", "Reviews key-page link label",
  /\[Reviews \(\d\.\d\/5 on Trustpilot, \d+ reviews\)\]/,
  `[Reviews (${rating}/5 on Trustpilot, ${count} reviews)]`);
apply("public/llms.txt", "reviewLastChecked date",
  /checked [A-Z][a-z]+ \d{4}/g, `checked ${checked}`);
apply("public/llms.txt", "median custom-patch order",
  /Median custom-patch order is \d+ pieces\./, `Median custom-patch order is ${median} pieces.`);

// ── 3. the glossary stat line (the other hand-typed median) ───────────────
// NOTE: glossary/entries.ts also says "median of 20 pieces", but that is the
// 3D-PUFF median (verified 20 against the orders table, 93 orders) — a
// different figure that happens to share a number. It is deliberately NOT
// synced here. Do not "fix" it.
apply("src/app/glossary/page.tsx", "median order stat",
  /median order is \d+ pieces/, `median order is ${median} pieces`);

// ── report ─────────────────────────────────────────────────────────────────
if (process.exitCode === 1) {
  console.error("[facts] Sync incomplete — see PATTERN NOT FOUND above.");
} else if (!edits.length) {
  console.log("[facts] Already in sync. Nothing to write.");
} else if (CHECK_ONLY) {
  console.error(`[facts] DRIFT DETECTED in ${edits.length} place(s):`);
  edits.forEach((e) => console.error(`         - ${e}`));
  console.error("[facts] Run `npm run facts:sync` to bring them in line with Sanity.");
  process.exitCode = 1;
} else {
  console.log(`[facts] Updated ${edits.length} place(s):`);
  edits.forEach((e) => console.log(`         - ${e}`));
}
