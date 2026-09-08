/**
 * Every FAQPage question must appear in the page's visible text.
 *
 * Google's FAQ structured-data policy is explicit: the question and answer must
 * be present on the page for the user to see. Markup that is not on the page is
 * ineligible at best, and a manual-action risk at worst.
 *
 * We had been failing that on the homepage without knowing. Eight hand-written
 * questions were in the JSON-LD — "What is Panda Patches?", "Does Panda Patches
 * have a minimum order?" — while the accordion rendered ten completely
 * different ones from genericFaqs. Nobody noticed because both halves were
 * individually fine; only the comparison was wrong, and nothing compared them.
 *
 * The divergence carried a second cost that matters more than the eligibility.
 * The copy that drifts is always the copy nothing renders: the visible answers
 * had been corrected to 5% economy and the customer-choice remedy, and the
 * schema — the half machines actually read — still carried the old ones.
 *
 * WHY THIS IS A SEPARATE SCRIPT: it reads built HTML, so it needs `npm run
 * build` first and cannot live inside verify:canon, which is source-only.
 * Run it after a build, before a deploy.
 *
 *   npm run build && npx tsx scripts/audit-faq-visibility.ts
 *
 * Dynamic routes render no HTML at build time, so they are not covered here.
 * That is a real gap and worth remembering: /custom-patches/[slug] and the
 * other ƒ routes need a live check against the deployed page.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), ".next", "server", "app");

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/** Decode the entities that matter for prose comparison. */
function decode(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Visible text: scripts and styles dropped, tags stripped, then normalised the
 * SAME way the needles are — punctuation collapsed to spaces.
 *
 * That last step is not cosmetic. Without it the haystack keeps "what's your
 * design approval process?" while the needle has become "what s your design
 * approval process", and every question containing an apostrophe reports as
 * missing while sitting in plain view on the page. Both sides must run through
 * the same normalisation or the comparison is meaningless — which is how this
 * check first reported 80 failures for 48 real ones.
 */
function visibleText(html: string): string {
  const stripped = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decode(stripped)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function jsonLdBlocks(html: string): any[] {
  const out: any[] = [];
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      out.push(JSON.parse(decode(m[1])));
    } catch {
      /* a block we cannot parse is not this script's problem */
    }
  }
  return out;
}

function faqNodes(node: any, acc: any[] = []): any[] {
  if (!node || typeof node !== "object") return acc;
  if (Array.isArray(node)) {
    node.forEach((n) => faqNodes(n, acc));
    return acc;
  }
  if (node["@type"] === "FAQPage") acc.push(node);
  if (Array.isArray(node["@graph"])) faqNodes(node["@graph"], acc);
  return acc;
}

/**
 * Is this Q&A actually on the page?
 *
 * Deliberately not a verbatim question match. An accordion legitimately renders
 * a heading that differs slightly from the schema's question — /ai-info wraps
 * one answer under "How do I apply AND CARE FOR iron-on patches?" — and failing
 * that produces noise, which is how a guard gets ignored. What Google requires
 * is that the CONTENT be visible, not that the heading be identical.
 *
 * So it passes if either half is present: a run of the question's words, or a
 * run from the middle of its answer. The answer window is the stronger signal,
 * because answers are long and specific enough that a matching ten-word run
 * cannot be coincidence. The homepage failure this was written for fails both —
 * its eight questions AND their answers appeared nowhere on the page.
 */
function words(s: string): string[] {
  return decode(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** A contiguous run of n words from the middle, where prose is most distinctive. */
function midRun(s: string, n: number): string | null {
  const w = words(s);
  if (w.length < n) return w.length ? w.join(" ") : null;
  const start = Math.max(0, Math.floor((w.length - n) / 2));
  return w.slice(start, start + n).join(" ");
}

function isVisible(question: string, answer: string, text: string): boolean {
  const q = words(question).slice(0, 6).join(" ");
  if (q && text.includes(q)) return true;
  const mid = midRun(answer ?? "", 10);
  if (mid && text.includes(mid)) return true;
  const head = words(answer ?? "").slice(0, 10).join(" ");
  return Boolean(head) && text.includes(head);
}

const files = walk(ROOT);
if (!files.length) {
  console.error("No built HTML found. Run `npm run build` first.");
  process.exit(1);
}

let pagesWithFaq = 0;
let questionsChecked = 0;
const failures: string[] = [];

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const faqs = jsonLdBlocks(html).flatMap((b) => faqNodes(b));
  if (!faqs.length) continue;
  pagesWithFaq++;

  const text = visibleText(html);
  const route = "/" + path.relative(ROOT, file).replace(/\\/g, "/").replace(/\.html$/, "");

  for (const faq of faqs) {
    for (const q of faq.mainEntity ?? []) {
      const name = q?.name;
      if (typeof name !== "string") continue;
      questionsChecked++;
      const answer: string = q?.acceptedAnswer?.text ?? "";
      if (!isVisible(name, answer, text)) {
        failures.push(`${route}\n      not visible: "${name.slice(0, 90)}"`);
      }
    }
  }
}

console.log(
  `Checked ${questionsChecked} FAQ question(s) across ${pagesWithFaq} built page(s).`,
);

if (failures.length) {
  console.error(`\nFAQ VISIBILITY CHECK FAILED — ${failures.length} question(s) marked up but not on the page\n`);
  failures.forEach((f) => console.error("  x " + f));
  console.error(
    "\nGoogle requires FAQ markup to be visible to the user. Either render the\n" +
      "question on the page, or generate the schema from whatever the page does\n" +
      "render — the second is nearly always the right fix, because the half\n" +
      "nothing renders is the half that goes stale.\n",
  );
  process.exit(1);
}

console.log("Every FAQ question in structured data is visible on its page.");
