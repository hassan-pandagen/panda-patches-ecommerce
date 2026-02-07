"use client";

import { useState, memo } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// Memoized thumbnail to prevent unnecessary re-renders
const Thumbnail = memo(({
  img,
  isActive,
  onClick
}: {
  img: any;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-[100px] h-[100px] flex-shrink-0 rounded-[16px] cursor-pointer overflow-hidden border transition-all duration-200
        ${isActive
          ? 'border-panda-green ring-2 ring-panda-green/20 shadow-md scale-105 z-10'
          : 'bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      <Image
        src={urlFor(img).width(150).height(150).quality(75).url()}
        alt="Thumbnail"
        fill
        className="object-contain p-2"
        quality={75}
        sizes="100px"
      />
    </div>
  );
});

Thumbnail.displayName = 'Thumbnail';

export default function ProductGallery({ images }: { images: any[] }) {
  const [activeImage, setActiveImage] = useState(images ? images[0] : null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return <div className="w-full h-[400px] bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">No Images</div>;

  // Prepare slides for lightbox (optimize for web viewing)
  const slides = images.map((img: any) => ({
    src: urlFor(img).width(1200).height(1200).quality(85).url(),
    alt: "Product Image"
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/*
         FIX 3: REMOVE DEAD SPACE
         - h-[450px]: Reduced from 550px.
         - Tighter, cleaner look.
      */}
      <div
        onClick={() => openLightbox(images.indexOf(activeImage))}
        className="relative w-full h-[450px] flex items-center justify-center bg-white rounded-[24px] border border-gray-100 shadow-sm cursor-zoom-in group"
      >
        {activeImage && (
          <Image
            src={urlFor(activeImage).width(800).height(800).quality(85).url()}
            alt="Main Product"
            fill
            className="object-contain p-6 group-hover:scale-[1.02] transition-transform duration-500"
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            priority
          />
        )}
        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
          Click to Zoom
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 justify-center px-2">
        {images.map((img: any, idx: number) => (
          <Thumbnail
            key={idx}
            img={img}
            isActive={activeImage === img}
            onClick={() => {
              setActiveImage(img);
              openLightbox(idx);
            }}
          />
        ))}
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
  );
}
