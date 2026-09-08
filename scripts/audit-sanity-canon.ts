/**
 * Check Sanity content against canon.
 *
 *   npx tsx scripts/audit-sanity-canon.ts
 *
 * WHY THIS IS SEPARATE FROM verify:canon. That guard reads the repo, and it is
 * thorough about it — 300-odd files swept on every build. But roughly half our
 * published words live in Sanity, and it has never seen any of them. On
 * 2026-09-07 that blind spot was measured for the first time and it was not
 * theoretical:
 *
 *   - /custom-patches-no-minimum-order, the hub page for every "no minimum"
 *     query we chase, told buyers in its FAQ schema that "PVC, woven, and
 *     leather patches start at 50 pieces. Chenille starts at 25 pieces."
 *   - The chenille and sequin guides each claimed a 25-piece minimum.
 *   - Two more documents claimed a 10-piece woven floor, retired in August.
 *   - One offered "no minimum — order as few as 1", a phrase the claims
 *     register bans outright.
 *   - Nine documents promised "free US shipping" where canon is worldwide.
 *
 * All of it was live, in FAQPage structured data, on the exact pages meant to
 * win the exact queries those claims contradict.
 *
 * IT IS NOT PART OF THE BUILD, deliberately. It needs a network call and an API
 * token, and a build guard that fails when a CMS is unreachable fails for the
 * wrong reason. Run it after editing content in Sanity, and before a content
 * push.
 */
import fs from "node:fs";
import path from "node:path";
import { MIN_ORDER_DEFAULT, MIN_ORDER_EXCEPTIONS } from "../src/lib/factConstants";

const PROJECT = "hjpcv7rv";
const DATASET = "production";

function readToken(): string {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) throw new Error("No .env.local — SANITY_API_TOKEN is required.");
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    if (line.startsWith("SANITY_API_TOKEN")) {
      return line.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");
    }
  }
  throw new Error("SANITY_API_TOKEN not found in .env.local");
}

interface Finding {
  slug: string;
  where: string;
  rule: string;
  text: string;
}

/**
 * Each rule is deliberately narrow and skips sentences that are plainly ABOUT
 * SOMEONE ELSE — "most manufacturers require 50 pieces" is true and must not be
 * reported. The comparison clause is stripped before the claim is tested, the
 * same approach verify:canon takes for the "50-to-100-piece minimum most patch
 * manufacturers require" line.
 */
const ABOUT_OTHERS =
  /most (?:manufacturers|suppliers|shops|competitors|patch)|other suppliers|elsewhere|industry (?:standard|norm)|competitors (?:charge|require)|their (?:minimum|fine print)|typically require|those shops|tests well|if you searched|things to ask|prices (?:not |partially )?published|turnaround:|trustpilot:|reviews\.io:/i;

/**
 * Documents whose SUBJECT is other suppliers. Every minimum in the top-10
 * review is a competitor's, correctly reported; running the canon rules over it
 * produced eight findings and no information. Exempting a whole document is a
 * blunt instrument, so the list stays short and each entry says why.
 */
const DOC_EXEMPT = new Set([
  // A supplier-by-supplier review. Every "Minimum: N pieces" in it is theirs.
  "top-10-custom-patch-manufacturers-in-the-usa-2026-honest-review",
  // 301s to the hub in next.config.mjs; the document survives only until it is
  // deleted. Its remaining "no minimum" uses describe what other shops
  // advertise, which is the point the page is making.
  "custom-patches-no-minimum-order-5-pieces",
]);

const RULES: { name: string; test: RegExp; note: string }[] = [
  {
    name: "minimum-contradicts-canon",
    test: new RegExp(
      String.raw`\b(?:our |panda patches |the )?minimum(?: order)?(?: for [^.]{0,40})?(?: at panda patches)?\s*(?:is|of|:)?\s*(?:just )?(\d{1,3})\s*(?:pieces|pcs)`,
      "i",
    ),
    note: `canon is ${MIN_ORDER_DEFAULT} pieces per design, no per-type exceptions`,
  },
  {
    name: "banned-no-minimum-phrasing",
    // Only when we say it about OURSELVES, and not inside quotation marks. The
    // phrase appears legitimately when quoting a search query or describing what
    // other shops advertise, and flagging those taught nothing.
    test: /(?:\bwe\b|\bour\b|panda patches)[^."“”]{0,70}\b(?:no minimums?\b|as few as (?:1|one)\b)/i,
    note: 'the register bans "no minimum" as a claim about us — canon is "from 5 pieces"',
  },
  {
    name: "us-only-shipping",
    test: /free (?:US|U\.S\.) (?:shipping|delivery)/i,
    note: "canon is free WORLDWIDE shipping",
  },
  {
    name: "minimum-stated-per-order",
    test: /\bminimum[^.]{0,40}\bper\s+order\b/i,
    note: "the minimum is per DESIGN, not per order",
  },
  // CLD073 — the five facts the 8 Sept 2026 external audit caught drifting.
  // Mirrors verify:canon section 20, which cannot see Sanity.
  {
    name: "economy-discount-wrong",
    test: /\beconomy\b[^.]{0,90}?\b(?:10|15|20)\s*(?:%|percent)|\b(?:10|15|20)\s*(?:%|percent)[^.]{0,60}?\beconomy\b/i,
    note: "economy is a flat 5% on every path (ECONOMY_DISCOUNT_PERCENT); 'up to 10%' is a pre-Aug-2026 ghost",
  },
  {
    name: "rush-fee-shape-wrong",
    test: /\brush\b[^.]{0,140}?(?:flat (?:add-?on |additional )?fee|fee that scales|scaled by quantity|scales with quantity)/i,
    note: "rush is 25% of the order total with a $50 minimum, refunded if the date is missed (RUSH_FEE_STATEMENT)",
  },
  {
    name: "duties-on-customer",
    test: /\b(?:customs\s+)?dut(?:y|ies)\b[^.]{0,80}?(?:paid|payable|borne)\s+by\s+(?:the\s+)?(?:recipient|customer|buyer|importer)|\bmay\s+incur\b[^.]{0,60}?\bdut(?:y|ies)\b/i,
    note: "we ship delivered duty paid — nothing is owed on arrival (SHIPPING_STATEMENT)",
  },
  {
    name: "sample-box-called-free",
    test: /\bfree\s+(?:physical\s+|worldwide\s+)?sample\s+box\b|\bsample\s+box\b[^.]{0,40}?\bat no charge\b/i,
    note: "the sample box is $45 and SHIPS free — a different claim; the free routes are the mockup, the first-order pack, and the 500+ pre-production sample",
  },
  {
    name: "defect-remedy-narrowed",
    test: /re-?produces?\s+the\s+order\s+at\s+no\s+charge|re-?production\s+is\s+not\s+feasible/i,
    note: "the CUSTOMER chooses remake or full refund within 10 days — this phrasing takes away a choice the Terms grant",
  },
];


/**
 * Posts nothing links to.
 *
 * On 7 September a crawl found 23 live posts with no inbound contextual link
 * from anywhere — not another post, not the codebase. Several were our longest
 * work: a 3,900-word manufacturers review, a 3,200-word PVC guide. The sitemap
 * got them indexed, and nothing on the site said they mattered. All 23 were
 * given inbound links the same day.
 *
 * This exists so the next one is caught in a week rather than a year. A new
 * post starts life as an orphan by definition, so it is a report rather than a
 * failure — the point is that somebody sees it.
 *
 * Repo links count: a post linked from a type page's cluster block is not an
 * orphan even if no other post mentions it.
 */
function reportOrphans(docs: any[]) {
  const blogs = docs.filter((d) => d.type === "blog" && d.slug);
  const slugs = new Set<string>(blogs.map((b) => b.slug));

  // Slugs that 301 elsewhere are not supposed to be linked.
  const redirected = new Set<string>();
  const sitemapPath = path.join(process.cwd(), "src", "app", "sitemap.ts");
  if (fs.existsSync(sitemapPath)) {
    for (const m of fs.readFileSync(sitemapPath, "utf8").matchAll(/'([a-z0-9-]{6,})'/g)) {
      redirected.add(m[1]);
    }
  }

  const inbound = new Map<string, number>();
  for (const s of slugs) inbound.set(s, 0);
  for (const b of blogs) {
    for (const href of (b.hrefs ?? []) as string[]) {
      if (typeof href !== "string") continue;
      const target = href.replace(/^\//, "").split("#")[0].split("?")[0];
      if (slugs.has(target) && target !== b.slug) {
        inbound.set(target, (inbound.get(target) ?? 0) + 1);
      }
    }
  }

  // Anything named anywhere in the codebase is reachable.
  let source = "";
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(e.name)) source += fs.readFileSync(full, "utf8");
    }
  };
  const srcDir = path.join(process.cwd(), "src");
  if (fs.existsSync(srcDir)) walk(srcDir);

  const orphans = [...slugs]
    .filter((s) => !redirected.has(s))
    .filter((s) => (inbound.get(s) ?? 0) === 0 && !source.includes(s))
    .sort();

  const live = [...slugs].filter((s) => !redirected.has(s)).length;
  if (orphans.length === 0) {
    console.log(`Inbound links: all ${live} live posts are linked from somewhere.\n`);
    return;
  }
  console.log(`⚠ ${orphans.length} of ${live} live posts have NO inbound link (post or code):`);
  for (const o of orphans) console.log(`     ${o}`);
  console.log("");
}

async function main() {
  const token = readToken();
  const query = `*[_type in ["blog","productPage","patchStyle"]]{"slug": slug.current, "type": _type, faqItems, content, "hrefs": content[].markDefs[].href}`;
  const url = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status} ${res.statusText}`);
  const docs = (await res.json()).result as any[];

  const findings: Finding[] = [];
  const check = (slug: string, where: string, text: string) => {
    if (!text || ABOUT_OTHERS.test(text)) return;
    for (const rule of RULES) {
      const m = text.match(rule.test);
      if (!m) continue;
      // The minimum rule only fires when the stated number is not canon.
      if (rule.name === "minimum-contradicts-canon") {
        const stated = Number(m[1]);
        if (stated === MIN_ORDER_DEFAULT) continue;
        if (Object.values(MIN_ORDER_EXCEPTIONS).includes(stated)) continue;
      }
      findings.push({
        slug,
        where,
        rule: `${rule.name} — ${rule.note}`,
        text: text.slice(Math.max(0, (m.index ?? 0) - 70), (m.index ?? 0) + 140).replace(/\s+/g, " "),
      });
    }
  };

  for (const doc of docs) {
    const slug = doc.slug ?? "(no slug)";
    if (DOC_EXEMPT.has(slug)) continue;
    for (const f of doc.faqItems ?? []) {
      check(slug, "faqItems.question", f?.question);
      check(slug, "faqItems.answer", f?.answer);
    }
    for (const block of doc.content ?? []) {
      for (const child of block?.children ?? []) {
        if (child?._type === "span") check(slug, "content", child.text);
      }
    }
  }

  reportOrphans(docs);

  console.log(`Scanned ${docs.length} Sanity documents.\n`);
  if (findings.length === 0) {
    console.log("No contradictions with canon found.");
    return;
  }
  const bySlug = new Map<string, Finding[]>();
  for (const f of findings) bySlug.set(f.slug, [...(bySlug.get(f.slug) ?? []), f]);
  for (const [slug, list] of bySlug) {
    console.log(`## ${slug}`);
    for (const f of list) {
      console.log(`   [${f.where}] ${f.rule}`);
      console.log(`      ...${f.text}...`);
    }
    console.log("");
  }
  console.log(`${findings.length} finding(s) across ${bySlug.size} document(s).`);
  process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
