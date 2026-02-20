"use client";

import { useRef, useState, memo } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// Memoized image card to prevent unnecessary re-renders
const WorkSampleCard = memo(({ img, onClick }: { img: any; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="
        min-w-[280px] h-[280px] lg:min-w-[320px] lg:h-[320px]
        relative flex-shrink-0
        rounded-[4px] overflow-hidden
        snap-start shadow-sm hover:shadow-xl transition-all duration-500
        border-4 border-white
        cursor-zoom-in group/sample
      "
    >
      <Image
        src={urlFor(img.image || img).url()}
        alt={img.alt || "Custom patch work sample showcasing detailed embroidery craftsmanship | Panda Patches"}
        fill
        className="object-cover group-hover/sample:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-black/0 group-hover/sample:bg-black/20 transition-colors flex items-center justify-center">
        <div className="bg-white/90 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide opacity-0 group-hover/sample:opacity-100 transition-opacity">
          Click to Zoom
        </div>
      </div>
    </div>
  );
});

WorkSampleCard.displayName = 'WorkSampleCard';

export default function WorkSamples({ samples }: { samples: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // If no images uploaded for this specific product, hide the section
  if (!samples || samples.length === 0) return null;

  // Prepare slides for lightbox
  const slides = samples.map((img: any, idx: number) => ({
    src: urlFor(img.image || img).url(),
    alt: img.alt || `Custom patch work sample ${idx + 1} | Panda Patches`
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Card width + gap
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full py-24 bg-[#F9FAF5]">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* HEADING - Mobile Optimized */}
        <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-black text-center text-panda-dark uppercase tracking-tight mb-8 md:mb-12 lg:mb-16">
          WORK SAMPLE
        </h2>

        {/* CAROUSEL WRAPPER */}
        <div className="relative group px-4 lg:px-12">
          
          {/* LEFT ARROW */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-md hover:bg-black hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>

          {/* RIGHT ARROW */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-md hover:bg-black hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>

          {/* IMAGES TRACK */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4"
          >
            {samples.map((img: any, index: number) => (
              <WorkSampleCard
                key={index}
                img={img}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>

          {/* DOTS INDICATOR */}
          <div className="flex justify-center gap-3 mt-8">
             {samples.slice(0, 5).map((_, index) => (
               <div key={index} className="w-2 h-2 rounded-full bg-gray-300 first:bg-panda-green first:w-6 transition-all" />
             ))}
          </div>

        </div>

        {/* LIGHTBOX */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 50,
            wheelZoomDistanceFactor: 100,
            pinchZoomDistanceFactor: 100,
            scrollToZoom: true
          }}
          carousel={{
            finite: false,
            preload: 2
          }}
          animation={{
            fade: 250,
            swipe: 250
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, 0.95)" }
          }}
        />

      </div>
    </div>
  );
}
