"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface WorkGalleryProps {
  samples: Array<{ image: any; alt: string }>;
}

export default function WorkGallery({ samples }: WorkGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!samples || samples.length === 0) return null;

  const validSamples = samples.filter((img: any) => img?.image || img);

  const slides = validSamples.map((img: any) => ({
    src: urlFor(img.image || img).url(),
    alt: img.alt || "Custom patch work sample | Panda Patches",
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="w-full py-16 md:py-24 bg-panda-light">
      <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">

        {/* Heading */}
        <h2 className="text-[24px] md:text-[36px] font-black text-center text-panda-dark uppercase tracking-tight mb-10 md:mb-14">
          Our Work Samples
        </h2>

        {/* Gallery Grid - 2x3 on mobile, 3x2 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {validSamples.slice(0, 6).map((img: any, idx: number) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="relative w-full aspect-square rounded-[12px] overflow-hidden border-2 border-white shadow-md hover:shadow-2xl transition-all duration-300 cursor-zoom-in group"
            >
              <Image
                src={urlFor(img.image || img).width(500).height(500).url()}
                alt={img.alt || `Custom patch work sample ${idx + 1} | Panda Patches`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="bg-white/90 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to Zoom
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
            scrollToZoom: true,
          }}
          carousel={{
            finite: false,
            preload: 2,
          }}
          animation={{
            fade: 250,
            swipe: 250,
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
          }}
        />

      </div>
    </section>
  );
}
