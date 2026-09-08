/**
 * Slugs that 301 away in next.config.mjs but may still exist as published
 * Sanity documents.
 *
 * Anything that lists content by slug must filter through this, or it hands a
 * reader — or Google — a URL that redirects the moment it is used. Two surfaces
 * consume it today: the sitemap, which would otherwise advertise a redirecting
 * URL as canonical, and the /blogs listing, which was rendering a card for the
 * duplicate soccer guide that bounced elsewhere on click.
 *
 * Lifted out of sitemap.ts on 9 Sept 2026. It had been private to that route,
 * which is why the listing never got the memo.
 *
 * KEEP IN SYNC with the redirects() block in next.config.mjs. This list has now
 * caught three separate out-of-sync bugs, so the sync is worth doing by hand at
 * the time rather than trusting to memory.
 */
export const REDIRECTED_SLUGS = new Set<string>([
  // 301'd 2026-09-03 to /varsity-jacket-patches-2026-27 (next.config.mjs) but
  // never excluded here, so the sitemap was advertising a redirecting URL as
  // canonical for four days. Found by the Sanity orphan check on 7 Sept: the
  // post read as an orphan because nothing links to it, correctly, since it
  // 301s. That is the second thing this list has caught by being out of sync.
  'varsity-jacket-patches-winter-trend-2024',
  'custom-patches-no-minimum-5-pieces-2026',
  'custom-patches-no-minimum-order-5-pieces',
  'custom-soccer-patches-guide-2026',
  'custom-velcro-patches-styles-uses-and-how-to-order',
  // Glossary Batch 0 (2026-07-18, CL2051_2) — cluster losers 301'd in next.config.mjs;
  // their Sanity docs stay live until deleted post-deploy, so exclude here.
  'know-your-patch-types-which-is-best-for-you',
  'how-to-iron-a-patch-on-a-shirt',
  'embroidery-vs-woven-patches-what-to-choose',
  // Location page consolidation (July 2026, CLAUDE_4.MD) — kept only Austin,
  // Texas, New York, Los Angeles. These 16 301 away in next.config.mjs.
  'alabama-patches',
  'custom-patches-in-boston',
  'custom-california-patches',
  'custom-patches-in-chicago',
  'custom-patches-colorado',
  'custom-patches-dallas',
  'custom-denver-patches',
  'custom-patches-in-florida',
  'custom-patches-houston',
  'kentucky-patches',
  'custom-miami-patches',
  'custom-ohio-state-patches',
  'custom-patches-portland',
  'custom-patches-in-san-francisco',
  'custom-utah-patches',
  'custom-patches-in-washington',
  // CL051B Path B (2026-08-03, CEO approved) — the last 3 standalone city pages
  // 301 to /locations. Measured 51% byte-identical with city-token substitution
  // (Google's textbook doorway pattern); consolidated into the delivery hub with
  // a city selector instead. No standalone city pages going forward.
  'custom-patches-in-new-york',
  'custom-patches-los-angeles',
  'custom-austin-patches',
]);
