"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

interface SampleBoxMediaProps {
  images: Array<{ url: string; alt: string; caption?: string }>;
  video?: { url: string; thumbnail?: string; title?: string };
}

export default function SampleBoxMedia({ images, video }: SampleBoxMediaProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Image/Video Display */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-panda-green/10 to-panda-yellow/10 border-4 border-panda-green/20">
        {showVideo && video ? (
          /* Video Player */
          <div className="w-full h-full bg-black">
            <video
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              poster={video?.thumbnail}
            >
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-panda-dark px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg"
            >
              View Photos
            </button>
          </div>
        ) : (
          /* Image Gallery */
          <>
            <div className="relative w-full h-full">
              <Image
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].alt}
                fill
                className="object-cover"
                priority={selectedImageIndex === 0}
              />

              {/* Image Caption */}
              {images[selectedImageIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white font-bold text-center">
                    {images[selectedImageIndex].caption}
                  </p>
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-panda-dark w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} strokeWidth={3} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-panda-dark w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} strokeWidth={3} />
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Gallery & Video Button */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {/* Image Thumbnails */}
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedImageIndex(idx);
              setShowVideo(false);
            }}
            className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-3 transition-all hover:scale-105 ${
              !showVideo && selectedImageIndex === idx
                ? "border-panda-green shadow-lg ring-2 ring-panda-green"
                : "border-gray-200 hover:border-panda-green/50"
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}

        {/* Video Thumbnail Button */}
        {video && (
          <button
            onClick={() => setShowVideo(true)}
            className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-3 transition-all hover:scale-105 bg-black ${
              showVideo
                ? "border-panda-green shadow-lg ring-2 ring-panda-green"
                : "border-gray-200 hover:border-panda-green/50"
            }`}
          >
            <Image
              src={video.thumbnail || images[0].url}
              alt={video.title || "Video"}
              fill
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-panda-yellow rounded-full p-2 shadow-lg">
                <Play size={20} className="text-panda-dark fill-panda-dark" />
              </div>
            </div>
            <div className="absolute bottom-1 left-1 right-1">
              <p className="text-white text-[10px] font-bold text-center bg-black/50 rounded px-1">
                Video
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Image Counter */}
      {!showVideo && images.length > 1 && (
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">
            Image {selectedImageIndex + 1} of {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
