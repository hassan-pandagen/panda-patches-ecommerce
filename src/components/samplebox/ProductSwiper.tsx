"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { client, urlFor } from "@/lib/sanity";

interface Product {
  _id: string;
  title: string;
  image: any;
}

// Fallback products if Sanity fetch fails
const fallbackProducts = [
  {
    title: "CHENILLE PATCHES",
    url: "/custom-patches/chenille",
  },
  {
    title: "PVC PATCHES",
    url: "/custom-patches/pvc",
  },
  {
    title: "LEATHER PATCHES",
    url: "/custom-patches/leather",
  },
  {
    title: "EMBROIDERED PATCHES",
    url: "/custom-patches/embroidered",
  },
  {
    title: "WOVEN PATCHES",
    url: "/custom-patches/woven",
  },
  {
    title: "PRINTED PATCHES",
    url: "/custom-patches/printed",
  },
];

// Map product titles to URLs
function getProductUrl(title: string): string {
  const urlMap: { [key: string]: string } = {
    'Custom Embroidered Patches': '/custom-patches/embroidered',
    'Custom PVC Patches': '/custom-patches/pvc',
    'Custom Chenille Patches': '/custom-patches/chenille',
    'Custom Woven Patches': '/custom-patches/woven',
    'Custom Leather Patches': '/custom-patches/leather',
    'Custom Printed Patches': '/custom-patches/printed',
    'Custom No Background 3D Embroidery': '/custom-patches/3d-embroidered-transfers',
    'Custom Sequin Patches': '/custom-patches/sequin',
  };
  return urlMap[title] || '#';
}

export default function ProductSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const itemsPerView = 3;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const query = `*[_type == "product" && category == "main"] | order(_createdAt asc) [0...6] {
          _id,
          title,
          image
        }`;
        const data = await client.fetch(query);
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }
    fetchProducts();
  }, []);

  const displayItems = products.length > 0 ? products : fallbackProducts;
  const maxIndex = Math.max(0, displayItems.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="relative w-full">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-black text-white rounded-full p-2 shadow-lg hover:bg-panda-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex >= maxIndex}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-black text-white rounded-full p-2 shadow-lg hover:bg-panda-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={24} />
      </button>

      {/* Swiper Container */}
      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {displayItems.map((item: any, index: number) => {
            const url = '_id' in item ? getProductUrl(item.title) : item.url;
            const hasImage = '_id' in item && item.image;

            return (
              <Link
                key={index}
                href={url}
                className="flex-shrink-0 w-[calc(33.333%-11px)] group"
              >
                <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative w-full aspect-square">
                    {hasImage ? (
                      <Image
                        src={urlFor(item.image).url()}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-panda-green/20 to-panda-yellow/20 flex items-center justify-center">
                        <span className="text-4xl">🎨</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white text-center">
                    <h4 className="text-[12px] font-black text-panda-dark uppercase tracking-wide">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              currentIndex === index ? 'w-8 bg-panda-dark' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
