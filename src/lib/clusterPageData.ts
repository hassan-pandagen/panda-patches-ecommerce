import "server-only";
import { cache } from "react";
import { client } from "@/lib/sanity";

/**
 * Shared Sanity fetch for the SEO cluster landing pages (PAC949 Part 1):
 * backing options, borders, threads/twills, and the niche audience pages.
 *
 * Returns the hero trust badges plus a category work-sample gallery so each
 * page can reuse the BulkHero / WorkGallery scaffold without duplicating the
 * fetch. Wrapped in try/catch so a Sanity blip during static export never
 * fails the build; the page just renders with empty arrays.
 *
 * @param slug a categoryPage OR productPage slug whose workSamples gallery to
 *   reuse for the WorkGallery band. Each cluster page passes a different one so
 *   the galleries rotate instead of repeating (e.g. chenille -> letterman,
 *   custom-military-patches -> EMS / airsoft, pvc -> airsoft).
 */
/**
 * Fetch one representative image per topic slug, for the country-page use-case
 * cards (PA005D). Each card maps to the matching page (military, soccer,
 * motorcycle, school, hockey, fire, logo, etc.) so every card shows a relevant
 * patch photo pulled from that page's own gallery. Handles categoryPage and
 * productPage (workSamples) plus patchStyle (gallery). Returns a slug -> image
 * map; never throws (a Sanity blip just yields an empty map and text-only
 * cards).
 */
export const getUseCaseImages = cache(async (slugs: string[]) => {
  const out: Record<string, unknown> = {};
  try {
    const data = await client.fetch(
      `{
        "bySlug": *[slug.current in $slugs && _type in ["categoryPage","productPage","patchStyle"]]{
          "slug": slug.current,
          "img": coalesce(workSamples[0], gallery[0])
        },
        "industrySports": *[_type == "industry"][0].cards[title match "Sports*"][0].image
      }`,
      { slugs },
    );
    for (const r of data?.bySlug || []) {
      if (r?.slug && r?.img && !out[r.slug]) out[r.slug] = r.img;
    }
    // "industry-sports": the football "Sports Patches" product image from the
    // industry singleton, used by the football/rugby use-case card so it shows
    // an actual sports patch instead of a generic soccer-gallery entry.
    if (data?.industrySports) out["industry-sports"] = data.industrySports;
  } catch (error) {
    console.error("Use-case image fetch error:", error);
  }
  return out;
});

export const getClusterPageData = cache(
  async (slug: string = "custom-school-patches") => {
    try {
      const query = `{
        "samples": coalesce(
          *[_type == "categoryPage" && slug.current == $slug][0].workSamples[]{ "image": @, "alt": alt },
          *[_type == "productPage" && slug.current == $slug][0].workSamples[]{ "image": @, "alt": alt }
        ),
        "hero": *[_type == "hero"][0] {
          "trustBadges": trustBadges[] { "url": image.asset->url, "alt": alt }
        }
      }`;
      const data = await client.fetch(query, { slug });
      return {
        workSamples: data?.samples || [],
        trustBadges: data?.hero?.trustBadges || [],
      };
    } catch (error) {
      console.error("Cluster page data fetch error:", error);
      return { workSamples: [], trustBadges: [] };
    }
  },
);
