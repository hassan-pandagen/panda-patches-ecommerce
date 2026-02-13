"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PatchTypes({ types }: { types: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback Data if Sanity is empty
  const slides = types?.length > 0 ? types : [
    {
      _id: "1",
      title: "Custom Embroidered Patches",
      description: "This classic patch type is a best-seller for good reason. Made with fabric backing and textured threading, it has a high-quality look and feel. These thick patches can support designs with 9 or more colors.",
      idealFor: ["Military organizations", "Motorcycle clubs", "Scout troops", "Fashion brands", "Law enforcement"],
      image: null
    }
  ];

  const currentSlide = slides[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 max-w-[1350px]">
        
        {/* HEADING - Mobile Optimized */}
        <h2 className="text-[24px] md:text-[32px] lg:text-[40px] font-black text-center text-panda-dark uppercase tracking-tight mb-8 md:mb-12 lg:mb-16">
          TYPES OF CUSTOM PATCHES
        </h2>

        {/* === SLIDER CONTAINER (Exact Width 1322px) === */}
        <div className="relative w-full max-w-[1322px] mx-auto min-h-[584px] bg-white shadow-xl overflow-hidden">
          
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* LEFT: IMAGE (Width 660px, White Background - Full Size) */}
            <div className="w-full lg:w-[660px] bg-white flex items-center justify-center min-h-[400px] lg:min-h-full relative">
              {currentSlide.image ? (
                <Image
                  src={urlFor(currentSlide.image).url()}
                  alt={currentSlide.title}
                  fill
                  className="object-contain p-8"
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 660px"
                  priority
                />
              ) : (
                // Placeholder Patch
                <div className="flex items-center justify-center text-gray-500 font-bold text-center p-4">
                  Upload Image in Sanity
                </div>
              )}
            </div>

            {/* RIGHT: CONTENT (White Background) */}
            <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center">
              
              <h3 className="text-[22px] md:text-[28px] lg:text-[32px] font-bold text-panda-dark mb-4 md:mb-5 lg:mb-6">
                {currentSlide.title}
              </h3>
              
              <p className="text-[16px] text-gray-600 leading-[1.8] mb-8 max-w-[500px]">
                {currentSlide.description}
              </p>

              {/* List */}
              <div className="mb-10">
                <h4 className="text-base font-bold text-black mb-4">Ideal for:</h4>
                <ul className="space-y-2">
                  {currentSlide.idealFor?.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 text-base text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button className="bg-black text-panda-yellow px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-panda-yellow hover:text-black transition-all duration-300">
                  Learn More
                </button>
                <button className="bg-black text-panda-yellow px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-panda-yellow hover:text-black transition-all duration-300">
                  Get Quote Now
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* === CONTROLS (Arrows & Dots) === */}
        <div className="flex items-center justify-center gap-8 mt-12">
          
          {/* Prev Arrow */}
          <button 
            onClick={prevSlide}
            className="p-2 rounded-full bg-black text-white hover:bg-panda-yellow hover:text-black hover:shadow-lg transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>

          {/* Dots */}
          <div className="flex gap-3">
            {slides.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300 cursor-pointer
                  ${currentIndex === idx ? 'bg-black w-4' : 'bg-gray-300'}
                `}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full bg-black text-white hover:bg-panda-yellow hover:text-black hover:shadow-lg transition-all"
            aria-label="Next"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>

        </div>

      </div>
    </section>
  );
}
