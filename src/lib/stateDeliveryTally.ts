/**
 * State delivery tally — real delivered-order counts from CRM shipment records.
 * Source: CRM dev, Aug 1 2026. Window ends 31 July 2026.
 *
 * Definition of "delivered" = order status DELIVERED + FEEDBACK (feedback is a
 * post-delivery state). Derived from the legacy free-text shipping address
 * (2-letter code before the ZIP, with a full-state-name fallback), because the
 * structured `ship_state` column is forward-only and not yet in production.
 *
 * IMPORTANT — these are CONSERVATIVE FLOORS. Roughly 274 of ~330 delivered
 * orders parsed cleanly to a state; unparseable addresses are excluded rather
 * than guessed. Never round these up or infer metro-level counts from them.
 *
 * NO median delivery days: current delivered_at values are batch-entered
 * (identical timestamps 128-163 days after shipping), so no honest median
 * exists. The median column is formally deferred (CEO, Aug 2) until the
 * FedEx/DHL delivery webhook writes real timestamps.
 *
 * Only states at or above CITY_PAGE_THRESHOLD qualify for a city page.
 * Refresh quarterly.
 */

export const TALLY_AS_OF = "31 July 2026";
export const CITY_PAGE_THRESHOLD = 20;

export interface StateDelivery {
  code: string;
  state: string;
  orders: number;
  /** Delivery page for this state, where one exists. */
  href?: string;
}

export const STATE_DELIVERY_TALLY: StateDelivery[] = [
  // Only Texas still has a dedicated page. California and New York are covered
  // by the city selector on this hub — their old city pages 301 here, so linking
  // them would bounce the visitor straight back to this page.
  { code: "TX", state: "Texas", orders: 24, href: "/custom-patches-in-texas" },
  { code: "CA", state: "California", orders: 24 },
  { code: "NY", state: "New York", orders: 23 },
  { code: "IL", state: "Illinois", orders: 17 },
  { code: "NJ", state: "New Jersey", orders: 12 },
  { code: "MA", state: "Massachusetts", orders: 11 },
  { code: "MI", state: "Michigan", orders: 11 },
  { code: "NC", state: "North Carolina", orders: 11 },
  { code: "GA", state: "Georgia", orders: 10 },
  { code: "FL", state: "Florida", orders: 9 },
  { code: "WA", state: "Washington", orders: 9 },
  { code: "IA", state: "Iowa", orders: 9 },
  { code: "VA", state: "Virginia", orders: 8 },
  { code: "IN", state: "Indiana", orders: 8 },
  { code: "MD", state: "Maryland", orders: 8 },
  { code: "NV", state: "Nevada", orders: 8 },
  { code: "OH", state: "Ohio", orders: 7 },
  { code: "AL", state: "Alabama", orders: 7 },
  { code: "PA", state: "Pennsylvania", orders: 6 },
  { code: "OR", state: "Oregon", orders: 4 },
  { code: "TN", state: "Tennessee", orders: 4 },
  { code: "NE", state: "Nebraska", orders: 4 },
  { code: "AZ", state: "Arizona", orders: 4 },
  { code: "UT", state: "Utah", orders: 3 },
  { code: "MN", state: "Minnesota", orders: 3 },
  { code: "MS", state: "Mississippi", orders: 3 },
  { code: "LA", state: "Louisiana", orders: 3 },
  { code: "KS", state: "Kansas", orders: 3 },
  { code: "SC", state: "South Carolina", orders: 3 },
  { code: "WI", state: "Wisconsin", orders: 2 },
  { code: "CO", state: "Colorado", orders: 2 },
  { code: "CT", state: "Connecticut", orders: 2 },
  { code: "KY", state: "Kentucky", orders: 2 },
  { code: "ME", state: "Maine", orders: 2 },
  { code: "MO", state: "Missouri", orders: 2 },
  { code: "ND", state: "North Dakota", orders: 2 },
  { code: "NM", state: "New Mexico", orders: 2 },
  { code: "MT", state: "Montana", orders: 1 },
  { code: "DE", state: "Delaware", orders: 1 },
];

/** States with a dedicated delivery page (>= threshold). */
export const QUALIFYING_STATES = STATE_DELIVERY_TALLY.filter(
  (s) => s.orders >= CITY_PAGE_THRESHOLD
);
