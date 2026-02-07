"use client";

import { useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WorkSamplesCarousel({ images }: { images: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Scroll one card width
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  if (images.length === 0) return <div className="text-center text-gray-400">Upload Work Samples in Sanity</div>;

  return (
    <div className="relative group px-12">
      
      {/* LEFT ARROW */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all bg-white z-10"
      >
        <ChevronLeft size={20} />
      </button>

      {/* RIGHT ARROW */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all bg-white z-10"
      >
        <ChevronRight size={20} />
      </button>

      {/* IMAGES TRACK */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        {images.map((img: any, idx: number) => (
          <div 
            key={idx} 
            className="
              min-w-[300px] h-[300px] lg:min-w-[320px] lg:h-[320px] 
              relative rounded-[16px] overflow-hidden 
              snap-start shadow-md hover:shadow-xl transition-shadow
            "
          >
            <Image 
              src={urlFor(img).url()} 
              alt="Work Sample" 
              fill 
              className="object-cover hover:scale-110 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

    </div>
  );
}
