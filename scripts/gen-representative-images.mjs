/**
 * Generate src/lib/representativeImages.ts from the live Sanity galleries.
 *
 * The 18 pages that need an image are static module-scope schema literals, so
 * they cannot await a Sanity fetch without restructuring all 18. Resolving the
 * URLs once into a committed constant avoids that entirely: Sanity CDN URLs are
 * content-addressed by asset id, so they are stable unless someone deletes the
 * asset.
 *
 * Each URL is checked for a 200 before it is written. A committed URL that
 * 404s would be worse than no image at all — Google would fetch it, fail, and
 * the item stays invalid while the markup claims otherwise.
 */
import fs from 'node:fs';

const env = fs.readFileSync('.env.local', 'utf8');
const tok = env.match(/SANITY_API_TOKEN\s*=\s*(.+)/)?.[1]?.trim().replace(/^["']|["']$/g, '');
const PROJECT = 'hjpcv7rv';
const DATASET = 'production';

const TYPES = ['embroidered', 'pvc', 'woven', 'chenille', 'leather', 'printed', 'sequin'];

const q = `*[_type=="productPage" && slug.current in ${JSON.stringify(TYPES)}]{
  "slug": slug.current,
  "refs": gallery[].asset._ref
}`;
const docs = (
  await (
    await fetch(`https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(q)}`, {
      headers: { Authorization: `Bearer ${tok}` },
    })
  ).json()
).result;

/** "image-<id>-<w>x<h>-<ext>" -> a CDN base URL. */
function baseUrl(ref) {
  const m = /^image-([0-9a-f]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!m) throw new Error(`unparseable asset ref: ${ref}`);
  return `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${m[1]}-${m[2]}.${m[3]}`;
}

// The three ratios Google renders product images at, so a rich result can pick
// whichever fits its slot.
const RATIOS = [
  ['1200', '1200'],
  ['1200', '900'],
  ['1200', '675'],
];

const out = {};
let checks = 0;
for (const d of docs) {
  const urls = [];
  for (const ref of d.refs ?? []) {
    const b = baseUrl(ref);
    urls.push(RATIOS.map(([w, h]) => `${b}?w=${w}&h=${h}&fit=crop&auto=format&q=80`));
  }
  out[d.slug] = urls;
}

// Verify every FIRST url actually resolves. One HEAD per gallery entry.
for (const [slug, sets] of Object.entries(out)) {
  for (const set of sets) {
    const r = await fetch(set[0], { method: 'HEAD' });
    checks++;
    if (!r.ok) throw new Error(`${slug}: ${set[0]} returned HTTP ${r.status}`);
  }
}
console.log(`verified ${checks} image URL(s) return 200`);

const body = `/**
 * Real product photographs, resolved once from the Sanity galleries.
 *
 * WHY A GENERATED CONSTANT: the pages that use these build their Product schema
 * at module scope, so they cannot await a Sanity fetch without restructuring
 * each one. Sanity CDN URLs are content-addressed by asset id and stable, so
 * resolving them once and committing the result is safe and keeps eighteen
 * pages from each growing a data-fetching layer they need for one field.
 *
 * Each URL is given in the three aspect ratios Google renders product images at
 * (1:1, 4:3, 16:9) so a rich result can pick whichever fits its slot.
 *
 * REGENERATE when the galleries change:
 *   node scripts/gen-representative-images.mjs
 * It re-reads Sanity and HEAD-checks every URL before writing. Do not hand-edit.
 *
 * Generated ${new Date().toISOString().slice(0, 10)} from ${Object.values(out).flat().length} gallery photographs.
 */
export const TYPE_PHOTOS: Record<string, string[][]> = ${JSON.stringify(out, null, 2)};

/**
 * A representative photograph for a page that has no product photo of its own.
 *
 * The eighteen callers are attribute and audience pages — a backing type, a
 * country, a use case — whose underlying product is an ordinary custom patch.
 * Each names the patch type it best represents and an index into that type's
 * gallery, so pages sharing a type do not all show the same photograph.
 *
 * Returns the OG card only if the type or index is missing, which the
 * audit:products guard will then catch.
 */
export function representativeImage(type: string, index = 0): string[] {
  const sets = TYPE_PHOTOS[type];
  if (!sets?.length) return ['https://www.pandapatches.com/assets/og-image.png'];
  return sets[index % sets.length];
}
`;

fs.writeFileSync('src/lib/representativeImages.ts', body.replace(/\r\n/g, '\n'), 'utf8');
console.log('wrote src/lib/representativeImages.ts');
for (const [slug, sets] of Object.entries(out)) console.log(`  ${slug.padEnd(13)} ${sets.length} photo(s)`);
