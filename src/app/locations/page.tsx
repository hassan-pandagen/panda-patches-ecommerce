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
  generateFAQSchema,
} from "@/lib/schemas";
import { MapPin, ArrowRight } from "lucide-react";
import CityDeliverySelector from "@/components/locations/CityDeliverySelector";
import { CITY_DELIVERY, honestyFrame, cityDeliveryFaqs } from "@/lib/cityDeliveryPages";
import { addBusinessDays, formatShortDate } from "@/lib/businessDays";
import {
  STATE_DELIVERY_TALLY,
  TALLY_AS_OF,
  CITY_PAGE_THRESHOLD,
} from "@/lib/stateDeliveryTally";

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
// CL051B Path B (2026-08-03): the three remaining city pages now 301 to THIS
// hub, so they must not be listed here — linking to them would bounce the
// visitor straight back to this page. Only the Texas state page still serves
// its own content. Per-city delivery data moves into a selector on this hub.
const LIVE_LOCATION_SLUGS = new Set([
  "custom-patches-in-texas",
]);

// Nearby-cities cross-link map. Only the 4 live pages remain, so cross-links
// point solely to other live pages (Austin <-> Texas). LA and New York have no
// surviving in-region neighbor, so they render no nearby module rather than
// link to a redirected slug.
const NEARBY: Record<string, string[]> = {
  // Texas is the only surviving location page, so it has no neighbour to
  // cross-link to. Every other slug 301s away; linking one would be a dead hop.
  "custom-patches-in-texas": [],
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

  // Order-by dates are computed here, on the server, so the selector renders the
  // same value the client hydrates with. Standard is the conservative end:
  // 14 business days production PLUS this metro's transit, matching how the
  // iron-on/delivery canon describes it (production, then shipping) rather than
  // quoting the optimistic 7-day figure.
  const today = new Date();
  const selectorCities = CITY_DELIVERY.map((c) => ({
    id: c.id,
    city: c.city,
    state: c.state,
    stateOrders: c.stateOrders,
    transit: c.transit,
    cutoffLocal: c.cutoffLocal,
    honestyFrame: honestyFrame(c.city),
    rushDate: formatShortDate(addBusinessDays(today, 5)),
    standardDate: formatShortDate(addBusinessDays(today, 14 + c.transitDays)),
  }));

  // FAQPage schema only because these FAQs are rendered visibly below.
  const deliveryFaqs = CITY_DELIVERY.flatMap((c) => cityDeliveryFaqs(c));
  const faqSchema = generateFAQSchema(deliveryFaqs);

  return (
    <main className="min-h-screen bg-[#F9FAF5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(collectionSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={generateSchemaScript(faqSchema)} />

      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }]} currentPage="Delivery" />

      {/* Hero */}
      <section className="w-full pt-10 md:pt-14 pb-8 md:pb-12 bg-white">
        <div className="container mx-auto px-6 max-w-[57.5rem] text-center">
          <p className="text-[0.75rem] font-black uppercase tracking-[2px] text-panda-green mb-3">
            Panda Patches . Locations
          </p>
          <h1 className="text-[2rem] md:text-[3rem] font-black text-panda-dark leading-[1.05] tracking-tight mb-4">
            Custom Patch Delivery Coverage
          </h1>
          <p className="text-[0.9375rem] md:text-[1.125rem] text-gray-600 leading-[1.6] max-w-[42.5rem] mx-auto">
            We produce every patch at our own facility and deliver anywhere in the US with free tracked shipping &mdash; rush service puts patches in hand in as soon as 5 business days.
          </p>
        </div>
      </section>

      {/* CITY SELECTOR — replaces the three standalone city pages (CL051B Path B).
          One URL, real per-city data, no doorway pattern. */}
      <CityDeliverySelector cities={selectorCities} />

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

      {/* DELIVERY COVERAGE — real state-level delivery record. Count only:
          delivered_at timestamps are batch-entered, so no honest median exists
          yet; the median column returns once the carrier webhook writes real
          delivery times. Never infer metro-level counts from these. */}
      <section className="w-full py-10 md:py-14 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-[68.75rem]">
          <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-2">
            Delivery Coverage by State
          </h2>
          <p className="text-[0.875rem] text-gray-500 mb-7 max-w-[42.5rem] leading-[1.6]">
            Orders we have actually delivered, by state, as of {TALLY_AS_OF}. States with{" "}
            {CITY_PAGE_THRESHOLD}+ delivered orders get their own entry in the city selector above.
            Refreshed quarterly.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-[0.875rem] md:text-[0.9375rem] border-collapse bg-white">
              <thead>
                <tr className="bg-panda-dark text-white text-left">
                  <th className="py-3 px-4 font-black uppercase tracking-wider text-[0.6875rem]">State</th>
                  <th className="py-3 px-4 font-black uppercase tracking-wider text-[0.6875rem]">Orders delivered</th>
                  <th className="py-3 px-4 font-black uppercase tracking-wider text-[0.6875rem]">Dedicated page</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-medium">
                {STATE_DELIVERY_TALLY.map((s) => (
                  <tr key={s.code} className="border-t border-gray-100">
                    <td className="py-3 px-4 font-semibold text-panda-dark">{s.state}</td>
                    <td className="py-3 px-4 font-bold">{s.orders}</td>
                    <td className="py-3 px-4">
                      {s.href ? (
                        <Link href={s.href} className="text-panda-green font-semibold underline underline-offset-2">
                          View page
                        </Link>
                      ) : (
                        <span className="text-gray-400">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[0.75rem] text-gray-400 mt-3 leading-[1.6] max-w-[46rem]">
            Counts come from our own shipment records (orders marked delivered). Addresses that could not be
            resolved to a state are excluded rather than estimated, so every figure is a conservative floor.
            Door-to-door delivery times are not published yet &mdash; we will add them once carrier tracking
            supplies verified delivery timestamps.
          </p>
        </div>
      </section>

      {/* DELIVERY FAQs — rendered visibly because the page emits FAQPage schema
          for them. Built from the same real numbers as the selector. */}
      <section className="w-full py-10 md:py-14 bg-[#F9FAF5] border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-[53.75rem]">
          <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-6">
            Delivery questions
          </h2>
          <div className="space-y-6">
            {deliveryFaqs.map((f) => (
              <div key={f.question}>
                <h3 className="text-[1rem] md:text-[1.0625rem] font-bold text-panda-dark mb-1">{f.question}</h3>
                <p className="text-[0.9375rem] text-gray-700 leading-[1.8]">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-16 bg-panda-dark text-white">
        <div className="container mx-auto px-6 max-w-[51.25rem] text-center">
          <h2 className="text-[1.625rem] md:text-[2.25rem] font-black text-panda-yellow leading-[1.1] mb-3">
            Do not see your city?
          </h2>
          <p className="text-[0.875rem] md:text-[1rem] text-gray-300 mb-6 max-w-[560px] mx-auto leading-[1.6]">
            Every order ships free worldwide, Duty-Paid with no VAT or customs on arrival — including{" "}
            <Link href="/custom-patches-germany" className="underline hover:text-panda-yellow transition-colors">Germany</Link>. Use the main quote form or chat with us. We have shipped to all 50 states and 40+ countries.
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
