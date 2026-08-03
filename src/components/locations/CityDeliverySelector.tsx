"use client";

import { useState } from "react";
import { CITY_STATS_AS_OF, TIMEZONE_ADVANTAGE } from "@/lib/cityDeliveryPages";

/**
 * City delivery selector for the /locations hub (CL051B Path B, CEO approved).
 *
 * Replaces the three standalone city pages, which measured 51% byte-identical
 * with city-token substitution — the pattern Google names as a doorway. All the
 * per-city delivery data now lives on ONE URL behind this selector, which is
 * Google's stated remedy for a business with no physical presence in the metro.
 *
 * Dates are computed on the server and passed in: computing them here would
 * produce a hydration mismatch, and the "order by" date is the whole point.
 */
export interface SelectorCity {
  id: string;
  city: string;
  state: string;
  stateOrders: number;
  transit: string;
  cutoffLocal: string;
  honestyFrame: string;
  /** In-hand date if a rush order is approved today. */
  rushDate: string;
  /** In-hand date range for a standard order approved today. */
  standardDate: string;
}

export default function CityDeliverySelector({ cities }: { cities: SelectorCity[] }) {
  const [activeId, setActiveId] = useState(cities[0]?.id);
  const active = cities.find((c) => c.id === activeId) ?? cities[0];

  if (!active) return null;

  return (
    <section className="w-full py-10 md:py-14 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-[62.5rem]">
        <h2 className="text-[1.375rem] md:text-[1.75rem] font-black text-panda-dark mb-2">
          Delivery to your city
        </h2>
        <p className="text-[0.875rem] text-gray-500 mb-6 max-w-[42.5rem] leading-[1.6]">
          Pick a metro for its real transit time, rush cutoff in local time, and the date patches
          would be in hand if you approved a mockup today.
        </p>

        {/* City tabs */}
        <div role="tablist" aria-label="Select a city" className="flex flex-wrap gap-2 mb-6">
          {cities.map((c) => {
            const isActive = c.id === active.id;
            return (
              <button
                key={c.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActiveId(c.id)}
                className={`px-5 py-3 rounded-full text-[0.875rem] font-black transition-colors border-2 ${
                  isActive
                    ? "bg-panda-dark text-white border-panda-dark"
                    : "bg-white text-panda-dark border-gray-200 hover:border-panda-green"
                }`}
              >
                {c.city}
              </button>
            );
          })}
        </div>

        {/* Honesty frame — verbatim from the approved brief */}
        <div className="rounded-2xl border-2 border-panda-dark bg-[#F9FAF5] p-6 md:p-7 mb-5">
          <p className="text-[1rem] md:text-[1.0625rem] leading-[1.8] text-panda-dark font-medium">
            {active.honestyFrame}
          </p>
        </div>

        {/* Real per-city data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="rounded-[14px] border border-gray-200 bg-white p-5">
            <p className="text-[0.6875rem] font-black uppercase tracking-[1.5px] text-panda-green mb-2">
              Delivered to {active.state}
            </p>
            <p className="text-[1.75rem] font-black text-panda-dark leading-none mb-2">
              {active.stateOrders} orders
            </p>
            <p className="text-[0.8125rem] text-gray-500 leading-[1.6]">
              From our shipment records as of {CITY_STATS_AS_OF}, refreshed quarterly.
            </p>
          </div>

          <div className="rounded-[14px] border border-gray-200 bg-white p-5">
            <p className="text-[0.6875rem] font-black uppercase tracking-[1.5px] text-panda-green mb-2">
              Transit to {active.city}
            </p>
            <p className="text-[1.75rem] font-black text-panda-dark leading-none mb-2">
              {active.transit.replace(" business days", "")}
              <span className="text-[0.875rem] font-bold text-gray-500"> business days</span>
            </p>
            <p className="text-[0.8125rem] text-gray-500 leading-[1.6]">
              Free tracked delivery once production is complete.
            </p>
          </div>

          <div className="rounded-[14px] border border-gray-200 bg-white p-5">
            <p className="text-[0.6875rem] font-black uppercase tracking-[1.5px] text-panda-green mb-2">
              Rush cutoff
            </p>
            <p className="text-[1.75rem] font-black text-panda-dark leading-none mb-2">
              {active.cutoffLocal}
            </p>
            <p className="text-[0.8125rem] text-gray-500 leading-[1.6]">
              Approve your mockup before this and rush production starts the same business day.
            </p>
          </div>
        </div>

        {/* Order-by maths — the utility a static city page never had */}
        <div className="rounded-2xl bg-panda-dark text-white p-6 md:p-7">
          <p className="text-[0.6875rem] font-black uppercase tracking-[2px] text-panda-yellow mb-3">
            If you approve a mockup today
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-[0.8125rem] font-bold text-gray-300 mb-1">Rush service</p>
              <p className="text-[1.25rem] md:text-[1.5rem] font-black text-panda-yellow leading-tight">
                In hand by {active.rushDate}
              </p>
              <p className="text-[0.75rem] text-gray-400 mt-1 leading-[1.6]">
                Large or complex rush orders split-ship: first batch in 5 business days, remainder in
                8&ndash;11.
              </p>
            </div>
            <div>
              <p className="text-[0.8125rem] font-bold text-gray-300 mb-1">Standard production</p>
              <p className="text-[1.25rem] md:text-[1.5rem] font-black text-white leading-tight">
                In hand by {active.standardDate}
              </p>
              <p className="text-[0.75rem] text-gray-400 mt-1 leading-[1.6]">
                7&ndash;14 business days production, then {active.transit} in transit.
              </p>
            </div>
          </div>
          <p className="text-[0.8125rem] text-gray-300 mt-5 pt-4 border-t border-white/15 leading-[1.7]">
            {TIMEZONE_ADVANTAGE}
          </p>
        </div>
      </div>
    </section>
  );
}
