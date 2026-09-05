import { MetadataRoute } from 'next';
import { AI_INFO_UPDATED } from "@/lib/aiInfoDates";
import { liveEntries as glossaryLiveEntries } from './glossary/entries';
import { client } from '@/lib/sanity';
import { getPublishedCaseStudies } from '@/lib/caseStudies';

// Revalidate hourly so newly published Sanity content (blogs, products,
// location pages) appears in the sitemap without waiting for a redeploy.
// Without this the sitemap is generated once at build time and goes stale,
// which is how the 250th-anniversary post landed with inSitemap:false even
// though the query already includes it. Hourly matches /[slug] and the
// homepage so a fresh deadline page is discoverable fast.
export const revalidate = 3600;

interface SanitySlugItem {
  slug: string;
  _updatedAt: string;
}

// Slugs that 301 away in next.config.mjs but may still exist as published Sanity
// docs. Excluded so the sitemap never lists a redirecting URL as canonical
// (audit P2-3). Keep this in sync with the redirects() block in next.config.mjs.
const REDIRECTED_SLUGS = new Set([
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.pandapatches.com';

  // Fetch all dynamic content from Sanity
  const query = `{
    "products": *[_type == "productPage" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "customProducts": *[_type == "customProductPage" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "blogs": *[_type == "blog" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "locations": *[_type == "locationPage" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "patchStyles": *[_type == "patchStyle" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "assets": *[_type == "assetResource" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "ironOn": *[_type == "ironOn" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt },
    "categoryPages": *[_type == "categoryPage" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt }
  }`;

  const data = await client.fetch(query);

  // Static pages with highest priority
  // Note: lastModified uses fixed dates (not new Date()) so Google doesn't think pages
  // change on every deploy — only update these when you actually update the page content.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-08-19'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/custom-patches-germany`,
      // Finished 2026-09-01 — was 3 sections against its siblings' 8, and the
      // only one of the four not indexed. Now at parity, so priority matches
      // UK/CA/AU rather than flagging it as the lesser page.
      lastModified: new Date('2026-09-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-leather-hat-patches`,
      lastModified: new Date('2026-08-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/custom-back-patches`,
      lastModified: new Date('2026-08-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/event-patches`,
      lastModified: new Date('2026-08-16'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-info`,
      lastModified: new Date(AI_INFO_UPDATED.hub),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date('2026-04-30'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/rewards`,
      lastModified: new Date('2026-07-29'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/imran-raza`,
      lastModified: new Date('2026-07-29'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/digitizing-team`,
      lastModified: new Date('2026-07-29'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/how-to-vet-a-custom-patch-supplier`,
      lastModified: new Date('2026-07-29'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date('2026-04-16'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/custom-patches`,
      lastModified: new Date('2026-02-15'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bulk-custom-patches`,
      lastModified: new Date('2026-02-15'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/custom-products`,
      lastModified: new Date('2026-02-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/custom-police-patches`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-sports-patches`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-corporate-patches`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-fire-department-patches`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      // Commercial capture page for the scout-cited audience (CL9F69 Workstream C.1).
      url: `${baseUrl}/custom-scout-patches`,
      lastModified: new Date('2026-07-21'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Locations hub added June 2026 (WEBSIT_1.MD T23). Links to every
    // location page so crawlers find them faster than depending on the
    // footer alone.
    {
      // Pinned date (was `new Date()`, which churns the lastModified on every
      // hourly ISR regeneration — a false freshness signal Google learns to
      // ignore; audit P2-3). Bump this manually when the hub page content changes.
      url: `${baseUrl}/locations`,
      lastModified: new Date('2026-06-20'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sample-box`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Glossary hub + production-data anchor asset (Batch 0, CL2051, 2026-07-18).
    // Bump lastModified when entries publish or a new data edition ships.
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date('2026-07-18'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Published glossary entries (registry-gated: photo + human review).
    ...glossaryLiveEntries().map((entry) => ({
      url: `${baseUrl}/glossary/${entry.slug}`,
      lastModified: new Date(entry.dateModified ?? entry.datePublished ?? '2026-07-18'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/custom-patch-production-data-2026`,
      lastModified: new Date('2026-07-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Named standard (CL9F69 Workstream D). Bump lastModified only on a spec
    // version bump — the page's value is that citations stay traceable.
    //
    // The rule was right and was not followed. SPEC_VERSION reached v1.7 on
    // 2026-08-28 (CL5E74 size ceilings) while this date stayed at 2026-07-20 —
    // one day BEFORE the page's own first commit. A page advertising a
    // six-week-old modification date, never crawled since discovery, sorts to
    // the bottom of the crawl queue, which is where GSC found it: "Discovered –
    // currently not indexed", last crawled N/A.
    {
      url: `${baseUrl}/patch-manufacturability-specs`,
      lastModified: new Date('2026-09-04'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/how-much-do-custom-patches-cost-full-pricing-breakdown`,
      lastModified: new Date('2026-04-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/panda-patches-vs-monterey-company`,
      lastModified: new Date('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/panda-patches-vs-signature-patches`,
      lastModified: new Date('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/panda-patches-vs-everlighten`,
      lastModified: new Date('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // AI Info cluster pages (topic-cluster architecture)
    {
      url: `${baseUrl}/ai-info/pricing`,
      lastModified: new Date(AI_INFO_UPDATED["pricing"]),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-info/products`,
      lastModified: new Date(AI_INFO_UPDATED["products"]),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-info/guarantees`,
      lastModified: new Date(AI_INFO_UPDATED["guarantees"]),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-info/wholesale`,
      lastModified: new Date(AI_INFO_UPDATED["wholesale"]),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-info/competitor-comparison`,
      lastModified: new Date(AI_INFO_UPDATED["competitor-comparison"]),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-info/company`,
      lastModified: new Date(AI_INFO_UPDATED["company"]),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-info/specs-and-care`,
      lastModified: new Date(AI_INFO_UPDATED["specs-and-care"]),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Commercial landing pages (high-priority head terms + design services)
    {
      url: `${baseUrl}/custom-iron-on-patches`,
      lastModified: new Date('2026-06-06'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/embroidery-digitizing`,
      lastModified: new Date('2026-06-06'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/raster-to-vector-conversion`,
      lastModified: new Date('2026-06-06'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Rush landing page (PANDAP_1 §5) — target of the Rush search campaign.
    {
      url: `${baseUrl}/rush-custom-patches`,
      lastModified: new Date('2026-09-06'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Free AI Patch Generator tool. Re-added to the sitemap June 2026 after it
    // was pulled while the route ran on the mock provider; now live + indexable.
    {
      url: `${baseUrl}/ai-patch-generator`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // SEO cluster pages (PAC949 Part 1): backing options hub + spokes, borders,
    // threads/twills, and niche audience pages. Added June 2026.
    {
      url: `${baseUrl}/custom-patches/backing-options`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sew-on-patches`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/adhesive-patches`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/magnetic-patches`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/button-loop-patches`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/patch-borders`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/patch-threads-and-twills`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/patch-types-compared`,
      lastModified: new Date('2026-06-27'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/custom-airsoft-patches`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-martial-arts-patches`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-ems-patches`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-letterman-patches`,
      lastModified: new Date('2026-06-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // International country landing pages (PA005D), added June 2026.
    {
      url: `${baseUrl}/custom-patches-uk`,
      lastModified: new Date('2026-06-19'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-patches-australia`,
      lastModified: new Date('2026-06-19'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-patches-canada`,
      lastModified: new Date('2026-06-19'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Case study detail pages (code-driven via src/lib/caseStudies.ts)
  const caseStudyPages: MetadataRoute.Sitemap = getPublishedCaseStudies().map((cs) => ({
    url: `${baseUrl}/case-studies/${cs.slug}`,
    lastModified: new Date(cs.isoDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Product pages (highest priority for SEO) — exclude the self-canonical duplicate
  // /custom-patches/custom-patches (a productPage with slug "custom-patches" that
  // duplicates the /custom-patches commercial page); it 301s away in next.config.mjs
  // (glossary Batch 0, 2026-07-18), so the sitemap must not list the redirecting URL.
  const productPages: MetadataRoute.Sitemap = (data.products || [])
    .filter((product: SanitySlugItem) => product.slug !== 'custom-patches')
    .map((product: SanitySlugItem) => ({
      url: `${baseUrl}/custom-patches/${product.slug}`,
      lastModified: new Date(product._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  // Custom product pages (coins, pins, keychains)
  const customProductPages: MetadataRoute.Sitemap = (data.customProducts || []).map((product: SanitySlugItem) => ({
    url: `${baseUrl}/custom-products/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Blog posts (good for SEO) — excludes slugs that 301 away in next.config.mjs
  // (audit P2-3): if the old Sanity doc is still published, the sitemap would
  // otherwise hand Google a URL that immediately redirects instead of the
  // canonical target.
  const blogPages: MetadataRoute.Sitemap = (data.blogs || [])
    .filter((blog: SanitySlugItem) => !REDIRECTED_SLUGS.has(blog.slug))
    .map((blog: SanitySlugItem) => ({
      url: `${baseUrl}/${blog.slug}`,
      lastModified: new Date(blog._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Location pages (local SEO) — excludes slugs that 301 away in next.config.mjs
  // (location consolidation, July 2026, CLAUDE_4.MD).
  const locationPages: MetadataRoute.Sitemap = (data.locations || [])
    .filter((location: SanitySlugItem) => !REDIRECTED_SLUGS.has(location.slug))
    .map((location: SanitySlugItem) => ({
      url: `${baseUrl}/${location.slug}`,
      lastModified: new Date(location._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  // Patch style pages (category SEO)
  const patchStylePages: MetadataRoute.Sitemap = (data.patchStyles || []).map((style: SanitySlugItem) => ({
    url: `${baseUrl}/${style.slug}`,
    lastModified: new Date(style._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Asset pages (thread charts, iron-on instructions)
  const assetPages: MetadataRoute.Sitemap = (data.assets || []).map((asset: SanitySlugItem) => ({
    url: `${baseUrl}/assets/${asset.slug}`,
    lastModified: new Date(asset._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const ironOnPages: MetadataRoute.Sitemap = (data.ironOn || []).map((iron: SanitySlugItem) => ({
    url: `${baseUrl}/assets/${iron.slug}`,
    lastModified: new Date(iron._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const categoryPages: MetadataRoute.Sitemap = (data.categoryPages || []).map((cat: SanitySlugItem) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(cat._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Combine all pages
  return [
    ...staticPages,
    ...caseStudyPages,
    ...productPages,
    ...customProductPages,
    ...blogPages,
    ...locationPages,
    ...patchStylePages,
    ...assetPages,
    ...ironOnPages,
    ...categoryPages,
  ];
}
