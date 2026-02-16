"use client";

import { useState } from "react";

const patchTypes = ["Embroidered", "PVC", "Woven", "Chenille", "Leather"] as const;

type PatchType = (typeof patchTypes)[number];

// Pricing data: starting prices for 3-inch patches
const pricingData: Record<PatchType, Record<string, string>> = {
  Embroidered: {
    "50-99":    "$3.50",
    "100-299":  "$2.75",
    "300-499":  "$2.25",
    "500-999":  "$1.75",
    "1,000-4,999": "$1.25",
    "5,000+":   "$0.85",
  },
  PVC: {
    "50-99":    "$4.50",
    "100-299":  "$3.50",
    "300-499":  "$2.75",
    "500-999":  "$2.25",
    "1,000-4,999": "$1.50",
    "5,000+":   "$1.00",
  },
  Woven: {
    "50-99":    "$3.75",
    "100-299":  "$3.00",
    "300-499":  "$2.50",
    "500-999":  "$2.00",
    "1,000-4,999": "$1.40",
    "5,000+":   "$0.95",
  },
  Chenille: {
    "50-99":    "$5.50",
    "100-299":  "$4.50",
    "300-499":  "$3.75",
    "500-999":  "$3.00",
    "1,000-4,999": "$2.25",
    "5,000+":   "$1.75",
  },
  Leather: {
    "50-99":    "$5.00",
    "100-299":  "$4.00",
    "300-499":  "$3.25",
    "500-999":  "$2.75",
    "1,000-4,999": "$2.00",
    "5,000+":   "$1.50",
  },
};

const quantities = ["50-99", "100-299", "300-499", "500-999", "1,000-4,999", "5,000+"];

export default function BulkPricingTable() {
  const [activeType, setActiveType] = useState<PatchType>("Embroidered");

  return (
    <section className="w-full py-16 md:py-24 bg-panda-light">
      <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[24px] md:text-[36px] font-black text-panda-dark uppercase tracking-tight mb-4">
            Volume Pricing — Save More, Order More
          </h2>
          <p className="text-[14px] md:text-[16px] text-gray-500 font-medium max-w-[600px] mx-auto">
            Transparent pricing. No hidden fees, no setup costs. Prices shown are starting rates for 3-inch patches.
          </p>
        </div>

        {/* Patch Type Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
          {patchTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 md:px-6 py-2.5 rounded-full text-[12px] md:text-[14px] font-bold uppercase tracking-wide transition-all duration-200 ${
                activeType === type
                  ? "bg-panda-dark text-panda-yellow shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-panda-green"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Pricing Grid - Desktop */}
        <div className="hidden md:block overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-panda-dark text-panda-yellow">
                <th className="text-left py-4 px-6 text-[14px] font-bold uppercase tracking-wide">Quantity</th>
                <th className="text-center py-4 px-6 text-[14px] font-bold uppercase tracking-wide">Price Per Patch</th>
                <th className="text-center py-4 px-6 text-[14px] font-bold uppercase tracking-wide">Savings</th>
                <th className="text-right py-4 px-6 text-[14px] font-bold uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody>
              {quantities.map((qty, idx) => {
                const price = pricingData[activeType][qty];
                const basePrice = parseFloat(pricingData[activeType]["50-99"].replace("$", ""));
                const currentPrice = parseFloat(price.replace("$", ""));
                const savings = Math.round(((basePrice - currentPrice) / basePrice) * 100);

                return (
                  <tr
                    key={qty}
                    className={`border-t border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-panda-light/50 transition-colors`}
                  >
                    <td className="py-4 px-6">
                      <span className="text-[16px] font-bold text-panda-dark">{qty} pieces</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-[20px] font-black text-panda-green">{price}</span>
                      <span className="text-[13px] text-gray-400 ml-1">/ patch</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {savings > 0 ? (
                        <span className="inline-block bg-green-100 text-green-700 text-[12px] font-bold px-3 py-1 rounded-full">
                          Save {savings}%
                        </span>
                      ) : (
                        <span className="text-[12px] text-gray-400">Base Price</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href="#bulk-quote"
                        className="text-[13px] font-bold text-panda-green hover:underline"
                      >
                        Get Quote →
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pricing Grid - Mobile (Cards) */}
        <div className="md:hidden space-y-3">
          {quantities.map((qty) => {
            const price = pricingData[activeType][qty];
            const basePrice = parseFloat(pricingData[activeType]["50-99"].replace("$", ""));
            const currentPrice = parseFloat(price.replace("$", ""));
            const savings = Math.round(((basePrice - currentPrice) / basePrice) * 100);

            return (
              <div key={qty} className="bg-white rounded-[12px] border border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[14px] font-bold text-panda-dark block">{qty} pcs</span>
                  {savings > 0 && (
                    <span className="text-[11px] font-bold text-green-600">Save {savings}%</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[20px] font-black text-panda-green">{price}</span>
                  <span className="text-[11px] text-gray-400 block">per patch</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[12px] text-gray-400 mt-6 font-medium">
          * Pricing varies by size, color count, and backing type. Table shows starting prices for standard 3-inch patches.
          Contact us for exact quote.
        </p>

      </div>
    </section>
  );
}
