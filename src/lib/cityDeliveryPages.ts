/**
 * Wave-1 city delivery pages — approved content (CEO sign-off Aug 2, 2026).
 *
 * Source of truth for the three Wave-1 city pages. Deliberately held in code,
 * not Sanity: CMS edits publish instantly, and CL051B requires content sign-off
 * BEFORE deploy. Keeping it here makes every change reviewable in a PR/preview
 * and revertible with git.
 *
 * Rules this file enforces (FINAL brief, Jul 31 + CL051B):
 *  - Honesty frame is VERBATIM from the brief. Do not paraphrase.
 *  - State stats are COUNT-ONLY. The door-to-door median clause is formally
 *    deferred (CEO, Aug 2) until the FedEx/DHL delivery webhook writes real
 *    timestamps — current delivered_at values are batch-entered and unusable.
 *  - NO organization-type claims (the CRM join returned zero orgs for NY/CA/TX).
 *  - NO invented local colour, landmarks, neighbourhoods, or filler.
 *  - Never "ships same day"; the cutoff governs when production STARTS.
 *
 * Counts are re-locked at publish time. Refresh quarterly with the state tally
 * (delivered = DELIVERED + FEEDBACK, derived from shipping address).
 */

export const CITY_STATS_AS_OF = "31 July 2026";

export interface CityDeliveryPage {
  /** Stable key used by the selector. */
  id: string;
  /** City name as it appears in the honesty frame and transit line. */
  city: string;
  /** State the delivery stat is reported for. */
  state: string;
  /** Delivered-order count for the state. Count only — no median. */
  stateOrders: number;
  /** FedEx transit for this metro from our ship-from origin, in business days. */
  transit: string;
  /** Transit expressed in whole business days, for the order-by date maths. */
  transitDays: number;
  /** The 5:00 PM ET cutoff translated into this metro's local time. */
  cutoffLocal: string;
}

export const CITY_DELIVERY: CityDeliveryPage[] = [
  {
    id: "nyc",
    city: "New York City",
    state: "New York",
    stateOrders: 23,
    transit: "3 business days",
    transitDays: 3,
    cutoffLocal: "5:00 PM ET",
  },
  {
    id: "la",
    city: "Los Angeles",
    state: "California",
    stateOrders: 24,
    transit: "3–4 business days",
    transitDays: 4,
    cutoffLocal: "2:00 PM PT",
  },
  {
    id: "austin",
    city: "Austin",
    state: "Texas",
    stateOrders: 24,
    transit: "3 business days",
    transitDays: 3,
    cutoffLocal: "4:00 PM CT",
  },
];

/**
 * Owning the facility puts production ahead of US clock time, so an order
 * approved during the US afternoon is picked up at the start of the next
 * production day rather than waiting a full cycle.
 */
export const TIMEZONE_ADVANTAGE =
  "Your afternoon is our next morning — orders approved during the US working day go into production before you're back at your desk.";

/** VERBATIM from the FINAL brief. Only {City} is substituted. */
export function honestyFrame(city: string): string {
  return `We're not based in ${city} — and you don't need us to be. We produce every patch at our own facility and deliver to ${city} addresses in as soon as 5 business days with rush service — large or complex rush orders split-ship: first batch in 5 business days, remainder in 8–11 (standard orders: 7–14 business days) — with free tracked delivery.`;
}

/** Count-only. The median clause is deferred until real delivery timestamps exist. */
export function stateDeliveryStat(p: CityDeliveryPage): string {
  return `We've delivered ${p.stateOrders} orders across ${p.state}.`;
}

export function transitLine(p: CityDeliveryPage): string {
  return `Typical transit to ${p.city}: ${p.transit}.`;
}

/**
 * Rush cutoff guidance. Deliberately describes when production STARTS —
 * never "ships same day", which the brief bans.
 */
export const RUSH_CUTOFF =
  "Approve your mockup before 5:00 PM ET and rush production starts the same business day.";

/**
 * City-specific delivery FAQs built from the real numbers above. FAQPage schema
 * is emitted only because these are rendered visibly on the page.
 */
export function cityDeliveryFaqs(p: CityDeliveryPage) {
  return [
    {
      question: `How long does delivery to ${p.city} take?`,
      answer: `Standard production is 7–14 business days after you approve your mockup. Once your order ships, typical transit to ${p.city} is ${p.transit}, with free tracked delivery. Approve your mockup before ${p.cutoffLocal} and rush production starts the same business day.`,
    },
    {
      question: `Can I get rush patches delivered to ${p.city}?`,
      answer: `Yes. Rush service puts patches in hand in as soon as 5 business days. Large or complex rush orders split-ship: the first batch arrives in 5 business days and the remainder follows in 8–11 business days, so your most time-critical pieces still make the deadline.`,
    },
    {
      question: `How many orders have you delivered to ${p.state}?`,
      answer: `We've delivered ${p.stateOrders} orders across ${p.state} as of ${CITY_STATS_AS_OF}. We publish the real number from our shipment records rather than an estimate, and refresh it quarterly.`,
    },
  ];
}
