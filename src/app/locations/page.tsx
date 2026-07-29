import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { client } from "@/lib/sanity";
import { buildPageMetadata } from "@/lib/seo";
import {
  generateSchemaScript,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
} from "@/lib/schemas";
import { MapPin, ArrowRight } from "lucide-react";

const CANONICAL = "https://www.pandapatches.com/locations";

// ISR: locations rarely change. Sanity webhook handles immediate refresh on
// add/edit so this only rebuilds once a day as a safety net.
export const revalidate = 86400;

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Patches by Location | US Cities and States | Panda Patches",
  description:
    "Custom patches shipped to every US city and state. Crawlable directory of every Panda Patches location page. Free worldwide shipping, 5-piece minimum, mockup in 12-24 hours.",
  url: CANONICAL,
  ogType: "website",
  ogTitle: "Custom Patches by City and State - Locations Directory",
  ogDescription:
    "Crawlable directory of every Panda Patches city and state page. 20+ US locations served. Free worldwide shipping, 5-piece minimum, mockup in 12-24 hours.",
  robots: { index: true, follow: true },
});

// Groups locations into State vs City buckets. Determined by slug pattern:
// state pages use "/{state}-patches" or "/custom-{state}-patches" or
// "/custom-patches-in-{state}" with a US state name, city pages are anything
// pointing at a metro. We classify by hard list so the boundary is explicit.
const STATE_NAMES = new Set([
  "Alabama",
  "California",
  "Colorado",
  "Florida",
  "Kentucky",
  "Ohio",
  "Texas",
  "Utah",
  "Washington",
]);

// LIVE location pages. July 2026 consolidation (CLAUDE_4.MD) 301'd 16 thin
// location pages to /custom-patches (or the Texas hub for Dallas/Houston) via
// next.config.mjs, keeping only these 4: the HQ (Austin), the state hub (Texas),
// and the two metros with real GSC separation (New York, Los Angeles). The other
// 16 locationPage docs are STILL published in Sanity, so the hub must filter to
// this allowlist or it links to pages that immediately redirect. If a city page
// is ever rebuilt, remove its redirect in next.config.mjs and add its slug here.
const LIVE_LOCATION_SLUGS = new Set([
  "custom-austin-patches",
  "custom-patches-in-texas",
  "custom-patches-in-new-york",
  "custom-patches-los-angeles",
]);

// Nearby-cities cross-link map. Only the 4 live pages remain, so cross-links
// point solely to other live pages (Austin <-> Texas). LA and New York have no
// surviving in-region neighbor, so they render no nearby module rather than
// link to a redirected slug.
const NEARBY: Record<string, string[]> = {
  "custom-austin-patches": ["custom-patches-in-texas"],
  "custom-patches-in-texas": ["custom-austin-patches"],
  "custom-patches-los-angeles": [],
  "custom-patches-in-new-york": [],
};

interface LocationDoc {
  _id: string;
  slug: string;
  locationName: string;
}

async function getLocations(): Promise<LocationDoc[]> {
  const query = `*[_type == "locationPage" && !(_id in path("drafts.**"))]{
    _id,
    "slug": slug.current,
    locationName
  } | order(locationName asc)`;
  try {
    return await client.fetch(query);
  } catch (err) {
    console.error("Locations hub fetch failed:", err);
    return [];
  }
}

export default async function LocationsHubPage() {
  const allLocations = await getLocations();
  // Only surface pages that actually serve dedicated content. The other 16
  // locationPage docs are still published in Sanity but 301 elsewhere, so
  // listing them would send visitors to links that immediately redirect.
  const locations = allLocations.filter((l) => LIVE_LOCATION_SLUGS.has(l.slug));

  const states = locations.filter((l) => STATE_NAMES.has(l.locationName));
  const cities = locations.filter((l) => !STATE_NAMES.has(l.locationName));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.pandapatches.com" },
    { name: "Locations", url: CANONICAL },
  ]);

  const collectionSchema = generateCollectionPageSchema(
    locations.map((l) => ({
      title: `Custom Patches in ${l.locationName}`,
      url: `https://www.pandapatches.com/${l.slug}`,
    }))
  );

  return (
    <main className="min-h-screen bg-[#F9FAF5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(collectionSchema)} />

      <Navbar />

      <Breadcrumbs items={[]} currentPage="Locations" />

      {/* Hero */}
      <section className="w-full pt-10 md:pt-14 pb-8 md:pb-12 bg-white">
        <div className="container mx-auto px-6 max-w-[57.5rem] text-center">
          <p className="text-[0.75rem] font-black uppercase tracking-[2px] text-panda-green mb-3">
            Panda Patches . Locations
          </p>
          <h1 className="text-[2rem] md:text-[3rem] font-black text-panda-dark leading-[1.05] tracking-tight mb-4">
            Custom Patches Shipped to Every US City and State
          </h1>
          <p className="text-[0.9375rem] md:text-[1.125rem] text-gray-600 leading-[1.6] max-w-[42.5rem] mx-auto">
            We ship custom patches to every US zip code with free worldwide delivery. {locations.length} cities and states currently have their own dedicated page with local pricing notes, common use cases, and team-order examples. Pick your area below to see what we have shipped there.
          </p>
        </div>
      </section>

      {/* States grid */}
      {states.length > 0 && (
        <section className="w-full py-10 md:py-14 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-[68.75rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-2">
              Custom Patches by State
            </h2>
            <p className="text-[0.875rem] text-gray-500 mb-7">
              Statewide pages cover bulk and team orders from anywhere within the state.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {states.map((s) => (
                <li key={s._id}>
                  <Link
                    href={`/${s.slug}`}
                    className="flex items-center justify-between gap-3 px-5 py-4 bg-[#F9FAF5] border border-gray-200 rounded-[14px] hover:bg-white hover:border-panda-green transition-all group"
                  >
                    <span className="flex items-center gap-2.5 text-[0.875rem] font-bold text-panda-dark">
                      <MapPin size={16} className="text-panda-green flex-shrink-0" />
                      Custom Patches in {s.locationName}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-gray-400 group-hover:text-panda-green group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Cities grid */}
      {cities.length > 0 && (
        <section className="w-full py-10 md:py-14 bg-[#F9FAF5] border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-[68.75rem]">
            <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-2">
              Custom Patches by City
            </h2>
            <p className="text-[0.875rem] text-gray-500 mb-7">
              City pages include local use cases and turnaround examples for that metro.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {cities.map((c) => (
                <li key={c._id}>
                  <Link
                    href={`/${c.slug}`}
                    className="flex items-center justify-between gap-3 px-5 py-4 bg-white border border-gray-200 rounded-[14px] hover:border-panda-green transition-all group"
                  >
                    <span className="flex items-center gap-2.5 text-[0.875rem] font-bold text-panda-dark">
                      <MapPin size={16} className="text-panda-green flex-shrink-0" />
                      Custom Patches in {c.locationName}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-gray-400 group-hover:text-panda-green group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="w-full py-12 md:py-16 bg-panda-dark text-white">
        <div className="container mx-auto px-6 max-w-[51.25rem] text-center">
          <h2 className="text-[1.625rem] md:text-[2.25rem] font-black text-panda-yellow leading-[1.1] mb-3">
            Do not see your city?
          </h2>
          <p className="text-[0.875rem] md:text-[1rem] text-gray-300 mb-6 max-w-[560px] mx-auto leading-[1.6]">
            Every order ships free worldwide. Use the main quote form or chat with us. We have shipped to all 50 states and 40+ countries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-panda-yellow text-panda-dark font-black text-[0.875rem] uppercase tracking-wider px-6 py-3 rounded-full hover:scale-[1.03] transition-transform"
            >
              Get a Free Quote
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/custom-patches"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-black text-[0.875rem] uppercase tracking-wider px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
            >
              Browse Patches
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/**
 * Helper used by individual location pages to render their nearby-cities
 * cross-link module. Exported so LocationLayout can call it without
 * duplicating the NEARBY map.
 */
export function getNearbyCities(slug: string): Array<{ slug: string; name: string }> {
  const nearbySlugs = NEARBY[slug] || [];
  return nearbySlugs.map((s) => ({
    slug: s,
    name: humanizeLocationName(s),
  }));
}

function humanizeLocationName(slug: string): string {
  // Strip "custom-" prefix, "-patches" suffix, "-patches-in" infix
  const cleaned = slug
    .replace(/^custom-/, "")
    .replace(/-patches$/, "")
    .replace(/^patches-in-/, "")
    .replace(/^patches-/, "")
    .replace(/-state$/, "");
  return cleaned
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
