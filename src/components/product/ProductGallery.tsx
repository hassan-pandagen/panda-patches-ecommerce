"use client";

import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
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
  const [mounted, setMounted] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[600px]">

      {!mounted ? (
        // SSR Placeholder - prevents hydration errors
        <div className="w-full aspect-square rounded-[16px] md:rounded-[24px] border border-gray-200 shadow-md bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
          <div className="animate-pulse w-full h-full flex items-center justify-center p-4 md:p-6">
            {images[0] && (
              <div className="relative w-full h-full">
                <Image
                  src={urlFor(images[0]).width(1200).quality(95).fit('max').url()}
                  alt="Product"
                  fill
                  className="object-contain"
                  quality={95}
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
                src={urlFor(img).width(1200).quality(95).fit('max').url()}
                alt={`Product Image ${idx + 1}`}
                fill
                className="object-contain p-4 md:p-6 group-hover:scale-[1.02] transition-transform duration-500"
                quality={95}
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
                  src={urlFor(img).width(200).quality(85).fit('max').url()}
                  alt={`Thumbnail ${idx + 1}`}
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
                src={urlFor(img).width(200).quality(85).fit('max').url()}
                alt={`Thumbnail ${idx + 1}`}
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

      <style jsx global>{`
        /* Reset all Swiper button defaults */
        .product-gallery-swiper .swiper-button-next,
        .product-gallery-swiper .swiper-button-prev {
          background: #000 !important;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          padding: 0 !important;
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #fff !important;
          overflow: hidden !important;
        }
        .product-gallery-swiper .swiper-button-next:hover,
        .product-gallery-swiper .swiper-button-prev:hover {
          background: #B4D92D !important;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
          color: #000 !important;
        }
        .product-gallery-swiper .swiper-button-next:after,
        .product-gallery-swiper .swiper-button-prev:after {
          font-size: 10px !important;
          color: inherit !important;
          font-weight: 900 !important;
          transition: all 0.3s ease !important;
          position: static !important;
          transform: none !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1 !important;
        }
        .product-gallery-swiper .swiper-button-disabled {
          opacity: 0.5 !important;
        }
        .product-gallery-swiper .swiper-pagination-bullet {
          background: #000;
          opacity: 0.3;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .product-gallery-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
        .product-thumbs-swiper .swiper-slide-thumb-active > div {
          border-color: #10B981 !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        /* Lightbox Navigation Arrows */
        .yarl__navigation_prev,
        .yarl__navigation_next {
          background: #000 !important;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .yarl__navigation_prev:hover,
        .yarl__navigation_next:hover {
          background: #B4D92D !important;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
        }
        .yarl__navigation_prev svg,
        .yarl__navigation_next svg {
          color: #fff;
          transition: all 0.3s ease;
        }
        .yarl__navigation_prev:hover svg,
        .yarl__navigation_next:hover svg {
          color: #000;
        }
      `}</style>

    </div>
  );
}
