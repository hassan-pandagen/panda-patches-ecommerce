"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Play } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { urlFor } from '@/lib/sanity';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface VideoSwiperProps {
  videos: any[];
}

export default function VideoSwiper({ videos }: VideoSwiperProps) {
  return (
    <>
      {/* Mobile: Swiper */}
      <div className="block lg:hidden mb-10">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={true}
          pagination={{
            clickable: true,
          }}
          className="craftsmanship-swiper !pb-12"
        >
          {videos.map((item: any, idx: number) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-[400px] bg-gradient-to-br from-gray-800 to-black rounded-[20px] overflow-hidden shadow-md mx-auto max-w-[280px]">
                {item.videoUrl ? (
                  <VideoPlayer
                    videoUrl={item.videoUrl}
                    thumbnail={item.thumbnail ? urlFor(item.thumbnail).url() : undefined}
                    instagramLink={item.link || "https://www.instagram.com/pandapatchesofficial/"}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center flex-col gap-2">
                    <Play className="text-gray-400" size={32} />
                    <span className="text-xs text-gray-500">No video uploaded</span>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop: Original Grid */}
      <div className="hidden lg:flex flex-wrap justify-center gap-6 mb-10">
        {videos.map((item: any, idx: number) => (
          <div
            key={idx}
            className="relative w-[255px] h-[341px] bg-gradient-to-br from-gray-800 to-black rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            {item.videoUrl ? (
              <VideoPlayer
                videoUrl={item.videoUrl}
                thumbnail={item.thumbnail ? urlFor(item.thumbnail).url() : undefined}
                instagramLink={item.link || "https://www.instagram.com/pandapatchesofficial/"}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center flex-col gap-2">
                <Play className="text-gray-400" size={32} />
                <span className="text-xs text-gray-500">No video uploaded</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
