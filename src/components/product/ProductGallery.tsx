"use client";

import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

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
        src={urlFor(img.image || img).width(200).quality(85).fit('max').url()}
        alt={img.alt || "Custom patch thumbnail"}
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
  const [mounted, setMounted] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!images || images.length === 0) return <div className="w-full h-[400px] bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">No Images</div>;

  // Prepare slides for lightbox - load full resolution without forced dimensions
  const slides = images.map((img: any, idx: number) => ({
    src: urlFor(img.image || img).width(1600).quality(80).auto('format').fit('max').url(),
    alt: img.alt || `Custom patch product image ${idx + 1} | Panda Patches`
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[600px]">

      {!mounted ? (
        // SSR Placeholder - prevents hydration errors
        <div className="w-full aspect-square rounded-[16px] md:rounded-[24px] border border-gray-200 shadow-md bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
          <div className="animate-pulse w-full h-full flex items-center justify-center p-4 md:p-6">
            {images[0] && (
              <div className="relative w-full h-full">
                <Image
                  src={urlFor(images[0].image || images[0]).width(800).quality(75).auto('format').fit('max').url()}
                  alt={images[0].alt || "Custom embroidered patch product display | Panda Patches"}
                  fill
                  className="object-contain"
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MAIN SWIPER - Swipeable Gallery */
        <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        spaceBetween={10}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        loop={true}
        className="w-full aspect-square rounded-[16px] md:rounded-[24px] border border-gray-200 shadow-md product-gallery-swiper"
        onSlideChange={(swiper) => setLightboxIndex(swiper.activeIndex)}
      >
        {images.map((img: any, idx: number) => (
          <SwiperSlide key={idx}>
            <div
              onClick={() => openLightbox(idx)}
              className="relative w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 cursor-zoom-in group"
            >
              <Image
                 src={urlFor(img.image || img).width(1000).quality(75).auto('format').fit('max').url()}
                 alt={img.alt || `Custom patch product showcase ${idx + 1} | Panda Patches`}
                 fill
                 className="object-contain p-4 md:p-6 group-hover:scale-[1.02] transition-transform duration-500"
                 quality={75}
                 sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
                 priority={idx === 0}
               />
            </div>
          </SwiperSlide>
        ))}
        </Swiper>
      )}

      {/* THUMBNAILS - Show after mounted */}
      {mounted ? (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView="auto"
          watchSlidesProgress
          className="w-full product-thumbs-swiper"
        >
          {images.map((img: any, idx: number) => (
            <SwiperSlide key={idx} className="!w-[90px] md:!w-[120px]">
              <div className="relative w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-[12px] md:rounded-[16px] cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                <Image
                   src={urlFor(img.image || img).width(200).quality(70).auto('format').fit('max').url()}
                   alt={img.alt || `Patch thumbnail ${idx + 1}`}
                  fill
                  className="object-contain p-2"
                  quality={85}
                  sizes="120px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        /* SSR Thumbnail Placeholder */
        <div className="flex gap-2 md:gap-4 overflow-x-hidden pb-2 justify-start md:justify-center">
          {images.slice(0, 4).map((img: any, idx: number) => (
            <div key={idx} className="relative w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-[12px] md:rounded-[16px] border-2 border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-white flex-shrink-0">
              <Image
                src={urlFor(img.image || img).width(200).quality(85).fit('max').url()}
                alt={img.alt || `Patch thumbnail ${idx + 1}`}
                fill
                className="object-contain p-2"
                quality={85}
                sizes="120px"
              />
            </div>
          ))}
        </div>
      )}

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
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
          navigationPrev: {
            backgroundColor: "#000",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            transition: "all 0.3s ease"
          },
          navigationNext: {
            backgroundColor: "#000",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            transition: "all 0.3s ease"
          }
        }}
      />


    </div>
  );
}
