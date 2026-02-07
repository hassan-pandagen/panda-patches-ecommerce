"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export default function ProductHeroEcommerce({ productData }: { productData: any }) {
  const [quantity, setQuantity] = useState(100);

  return (
    <section className="w-full py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-[1300px]">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* LEFT: Product Image */}
          <div className="flex-1 relative h-[500px] bg-white rounded-[24px] overflow-hidden shadow-lg border border-gray-200">
            {productData.heroImage && (
              <Image
                src={urlFor(productData.heroImage).url()}
                alt={productData.title}
                fill
                className="object-contain p-10"
                priority
              />
            )}
          </div>

          {/* RIGHT: Product Info & Add to Cart */}
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-[48px] font-black text-panda-dark leading-tight mb-4">
                {productData.title}
              </h1>
              {productData.basePrice && (
                <p className="text-[32px] font-bold text-panda-green">
                  Starting at ${productData.basePrice}
                </p>
              )}
            </div>

            <p className="text-[18px] text-gray-600 leading-relaxed">
              {productData.description}
            </p>

            {/* Ideal For */}
            {productData.idealFor && productData.idealFor.length > 0 && (
              <div>
                <h3 className="font-bold text-lg text-panda-dark mb-3">Ideal for:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {productData.idealFor.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-t border-gray-200 pt-8">
              <label className="block font-bold text-lg text-panda-dark mb-3">
                Quantity
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:border-panda-green outline-none"
              />
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-panda-green text-black font-black text-[16px] py-5 rounded-[12px] hover:scale-105 transition-transform shadow-xl uppercase tracking-wider">
              Configure & Order
            </button>

            <p className="text-sm text-gray-500 text-center">
              Customize your order and checkout with Stripe
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
