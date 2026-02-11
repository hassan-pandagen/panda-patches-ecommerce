"use client";

import { useState, memo } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// Memoized thumbnail to prevent unnecessary re-renders - Mobile Responsive
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
        relative w-[90px] h-[90px] md:w-[120px] md:h-[120px] flex-shrink-0 rounded-[12px] md:rounded-[16px] cursor-pointer border transition-all duration-200
        ${isActive
          ? 'border-panda-green ring-2 ring-panda-green/20 shadow-md scale-105 z-10 bg-gradient-to-br from-gray-50 to-white'
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      <Image
        src={urlFor(img).width(200).quality(85).fit('max').url()}
        alt="Thumbnail"
        fill
        className="object-contain p-2"
        quality={85}
        sizes="(max-width: 768px) 90px, 120px"
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

  // Prepare slides for lightbox - load full resolution without forced dimensions
  const slides = images.map((img: any) => ({
    src: urlFor(img).width(2000).quality(90).fit('max').url(),
    alt: "Product Image"
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">

      {/*
         MAIN IMAGE - Industry Standard Square Container
         - Uses aspect-square to maintain proper image proportions
         - object-contain ensures full image is always visible
         - No fixed heights that could crop images
      */}
      <div
        onClick={() => openLightbox(images.indexOf(activeImage))}
        className="relative w-full aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-[16px] md:rounded-[24px] border border-gray-200 shadow-md hover:shadow-lg cursor-zoom-in group transition-all duration-300"
      >
        {activeImage && (
          <Image
            src={urlFor(activeImage).width(1200).quality(95).fit('max').url()}
            alt="Main Product"
            fill
            className="object-contain p-4 md:p-6 group-hover:scale-[1.02] transition-transform duration-500"
            quality={95}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
            priority
          />
        )}
      </div>

      {/* THUMBNAILS - Mobile Responsive Scroll */}
      <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-2 justify-start md:justify-center px-2 md:px-0">
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
