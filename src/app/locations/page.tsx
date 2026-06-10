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

// Nearby-cities cross-link map. Each metro lists 2 to 4 other metros in the
// same region so visitors who land on Houston can see Dallas and Austin
// without needing to dig back through the hub.
const NEARBY: Record<string, string[]> = {
  "custom-patches-houston": ["custom-patches-dallas", "custom-austin-patches", "custom-patches-in-texas"],
  "custom-patches-dallas": ["custom-patches-houston", "custom-austin-patches", "custom-patches-in-texas"],
  "custom-austin-patches": ["custom-patches-houston", "custom-patches-dallas", "custom-patches-in-texas"],
  "custom-patches-in-texas": ["custom-patches-houston", "custom-patches-dallas", "custom-austin-patches"],
  "custom-patches-los-angeles": ["custom-patches-in-san-francisco", "custom-california-patches"],
  "custom-patches-in-san-francisco": ["custom-patches-los-angeles", "custom-california-patches"],
  "custom-california-patches": ["custom-patches-los-angeles", "custom-patches-in-san-francisco"],
  "custom-patches-in-new-york": ["custom-patches-in-boston"],
  "custom-patches-in-boston": ["custom-patches-in-new-york"],
  "custom-patches-in-chicago": ["custom-ohio-state-patches"],
  "custom-patches-in-florida": ["custom-miami-patches"],
  "custom-miami-patches": ["custom-patches-in-florida"],
  "custom-denver-patches": ["custom-patches-colorado", "custom-utah-patches"],
  "custom-patches-colorado": ["custom-denver-patches", "custom-utah-patches"],
  "custom-utah-patches": ["custom-denver-patches", "custom-patches-colorado"],
  "custom-patches-portland": ["custom-patches-in-washington"],
  "custom-patches-in-washington": ["custom-patches-portland"],
  "alabama-patches": [],
  "kentucky-patches": ["custom-ohio-state-patches"],
  "custom-ohio-state-patches": ["custom-patches-in-chicago", "kentucky-patches"],
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
  const locations = await getLocations();

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
        <div className="container mx-auto px-6 max-w-[920px] text-center">
          <p className="text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-3">
            Panda Patches . Locations
          </p>
          <h1 className="text-[32px] md:text-[48px] font-black text-panda-dark leading-[1.05] tracking-tight mb-4">
            Custom Patches Shipped to Every US City and State
          </h1>
          <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.6] max-w-[680px] mx-auto">
            We ship custom patches to every US zip code with free worldwide delivery. {locations.length} cities and states currently have their own dedicated page with local pricing notes, common use cases, and team-order examples. Pick your area below to see what we have shipped there.
          </p>
        </div>
      </section>

      {/* States grid */}
      {states.length > 0 && (
        <section className="w-full py-10 md:py-14 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-[1100px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-2">
              Custom Patches by State
            </h2>
            <p className="text-[14px] text-gray-500 mb-7">
              Statewide pages cover bulk and team orders from anywhere within the state.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {states.map((s) => (
                <li key={s._id}>
                  <Link
                    href={`/${s.slug}`}
                    className="flex items-center justify-between gap-3 px-5 py-4 bg-[#F9FAF5] border border-gray-200 rounded-[14px] hover:bg-white hover:border-panda-green transition-all group"
                  >
                    <span className="flex items-center gap-2.5 text-[14px] font-bold text-panda-dark">
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
          <div className="container mx-auto px-6 max-w-[1100px]">
            <h2 className="text-[22px] md:text-[28px] font-black text-panda-dark mb-2">
              Custom Patches by City
            </h2>
            <p className="text-[14px] text-gray-500 mb-7">
              City pages include local use cases and turnaround examples for that metro.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {cities.map((c) => (
                <li key={c._id}>
                  <Link
                    href={`/${c.slug}`}
                    className="flex items-center justify-between gap-3 px-5 py-4 bg-white border border-gray-200 rounded-[14px] hover:border-panda-green transition-all group"
                  >
                    <span className="flex items-center gap-2.5 text-[14px] font-bold text-panda-dark">
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
        <div className="container mx-auto px-6 max-w-[820px] text-center">
          <h2 className="text-[26px] md:text-[36px] font-black text-panda-yellow leading-[1.1] mb-3">
            Do not see your city?
          </h2>
          <p className="text-[14px] md:text-[16px] text-gray-300 mb-6 max-w-[560px] mx-auto leading-[1.6]">
            Every order ships free worldwide. Use the main quote form or chat with us. We have shipped to all 50 states and 40+ countries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-panda-yellow text-panda-dark font-black text-[14px] uppercase tracking-wider px-6 py-3 rounded-full hover:scale-[1.03] transition-transform"
            >
              Get a Free Quote
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/custom-patches"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-black text-[14px] uppercase tracking-wider px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
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
