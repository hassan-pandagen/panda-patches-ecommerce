"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import './product-gallery.css';

export default function ProductGallery({ images }: { images: any[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

      {/* MAIN SWIPER - Swipeable Gallery */}
      <div className="gallery-main-wrapper">
        {/* Swiper container with rounded corners */}
        <div className="gallery-swiper-container w-full h-full rounded-[16px] md:rounded-[24px] border border-gray-200 shadow-md overflow-hidden">
          {mounted ? (
            <Swiper
              modules={[Pagination, Thumbs]}
              spaceBetween={10}
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              loop={true}
              className="w-full h-full product-gallery-swiper"
              onSwiper={(s) => { swiperRef.current = s; }}
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
          ) : (
            <div className="relative w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
              <Image
                src={urlFor(images[0].image || images[0]).width(1000).quality(75).auto('format').fit('max').url()}
                alt={images[0].alt || 'Custom patch product showcase 1 | Panda Patches'}
                fill
                className="object-contain p-4 md:p-6"
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
                priority
              />
            </div>
          )}
        </div>

        {/* Prev / Next arrows - OUTSIDE overflow-hidden, on own compositing layer */}
        {mounted && (
          <>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="gallery-nav-arrow gallery-nav-prev"
              aria-label="Previous slide"
            >
              <svg width="8" height="14" viewBox="0 0 11 20" fill="none" style={{ transform: 'rotate(180deg)' }}><path d="M0.383 20.076a.496.496 0 010-.982L9.198 10.28.383 1.465a.496.496 0 01.982-.982l9.069 9.069a.743.743 0 010 1.455L1.365 20.076a.496.496 0 01-.982 0z" fill="white"/></svg>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="gallery-nav-arrow gallery-nav-next"
              aria-label="Next slide"
            >
              <svg width="8" height="14" viewBox="0 0 11 20" fill="none"><path d="M0.383 20.076a.496.496 0 010-.982L9.198 10.28.383 1.465a.496.496 0 01.982-.982l9.069 9.069a.743.743 0 010 1.455L1.365 20.076a.496.496 0 01-.982 0z" fill="white"/></svg>
            </button>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {mounted && (
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
            backgroundColor: "#ffffff",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            minWidth: "48px",
            minHeight: "48px",
            color: "#111111",
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
          },
          navigationNext: {
            backgroundColor: "#ffffff",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            minWidth: "48px",
            minHeight: "48px",
            color: "#111111",
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
          },
          button: {
            filter: "none",
            color: "#111111",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          },
          icon: {
            color: "#111111",
            filter: "none",
            width: "20px",
            height: "20px",
          }
        }}
      />


    </div>
  );
}
