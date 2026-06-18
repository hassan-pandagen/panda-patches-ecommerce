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
