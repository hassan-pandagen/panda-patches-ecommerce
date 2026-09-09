/**
 * Every Product in the built HTML must carry an image.
 *
 * Google treats a Product without `image` as INVALID for merchant listings, not
 * merely incomplete: "Items with this issue are invalid. Invalid items are not
 * eligible for Google Search's rich results." `description` is recommended
 * rather than required, so it is reported but does not fail.
 *
 * Written after shipping the exact bug it catches. On 9 Sept 2026 I replaced the
 * single bogus Product on /custom-patches with a CollectionPage + ItemList, and
 * gave each ListItem a nested Product carrying name, url, brand and offers —
 * but no image. Google reads a Product inside an ItemList as a merchant listing,
 * so the page went from one wrong Product to seven invalid ones, and it failed
 * the Merchant listings validation that was already running for another fix.
 *
 * The fix there was to stop embedding Products at all — a page that links to
 * detail pages uses the summary ItemList form, url only — but the general
 * lesson is that a hand-written Product literal is easy to ship incomplete and
 * nothing checked.
 *
 *   npm run build && npm run audit:products
 *
 * KNOWN_MISSING is now empty. It briefly held eighteen routes whose Product
 * schema omitted `image`; all eighteen were given real photographs the same
 * day. An entry here means shipping a knowingly invalid merchant listing, so
 * add one only with a reason and a date to remove it.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), ".next", "server", "app");

/** Routes allowed to ship a Product with no image. Should be empty. */
const KNOWN_MISSING = new Set<string>([
  // EMPTY, and it should stay that way.
  //
  // Eighteen routes sat here for a few hours on 2026-09-09 — attribute, audience
  // and country pages whose hand-written Product schema omitted `image`. All
  // eighteen now carry a real photograph from the Sanity product galleries,
  // chosen per page for the patch type that page actually sells.
  //
  // Adding an entry here means shipping a knowingly invalid merchant listing.
  // Do it only with a reason written beside it and a date to remove it.
]);

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/** Every Product node at any depth — an ItemList can bury one several levels down. */
function products(node: any, acc: any[] = []): any[] {
  if (!node || typeof node !== "object") return acc;
  if (Array.isArray(node)) {
    node.forEach((n) => products(n, acc));
    return acc;
  }
  if (node["@type"] === "Product") acc.push(node);
  for (const v of Object.values(node)) products(v, acc);
  return acc;
}

const files = walk(ROOT);
if (!files.length) {
  console.error("No built HTML found. Run `npm run build` first.");
  process.exit(1);
}

let checked = 0;
const newFailures: string[] = [];
const known: string[] = [];
const noDescription: string[] = [];

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const route = "/" + path.relative(ROOT, file).split(path.sep).join("/").replace(/\.html$/, "");
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    let json: any;
    try {
      json = JSON.parse(m[1].replace(/&quot;/g, '"'));
    } catch {
      continue;
    }
    for (const p of products(json)) {
      checked++;
      const name = p.name ?? "(unnamed)";
      if (!p.image) {
        (KNOWN_MISSING.has(route) ? known : newFailures).push(`${route} — "${name}"`);
      }
      if (!p.description) noDescription.push(`${route} — "${name}"`);
    }
  }
}

console.log(`Checked ${checked} Product node(s) across ${files.length} built page(s).`);

if (noDescription.length) {
  console.log(`\n⚠ ${noDescription.length} Product(s) with no description (recommended, not required):`);
  noDescription.slice(0, 10).forEach((d) => console.log("     " + d));
  if (noDescription.length > 10) console.log(`     …and ${noDescription.length - 10} more`);
}

if (known.length) {
  console.log(
    `\n⚠ ${known.length} known Product(s) still missing an image — invalid merchant listings, grandfathered 2026-09-09.`,
  );
  console.log("   Each needs a representative photograph. Shrink this list; do not add to it.");
}

if (newFailures.length) {
  console.error(`\nPRODUCT IMAGE CHECK FAILED — ${newFailures.length} NEW Product(s) with no image\n`);
  newFailures.forEach((f) => console.error("  x " + f));
  console.error(
    "\nA Product without `image` is INVALID for merchant listings and ineligible for\n" +
      "rich results — the whole item, not just the field. Either give it a real product\n" +
      "photograph, or do not emit a Product there at all: a page that links to detail\n" +
      "pages should use the summary ItemList form, which carries `url` and nothing else.\n",
  );
  process.exit(1);
}

console.log("\nNo new Product nodes without an image.");
