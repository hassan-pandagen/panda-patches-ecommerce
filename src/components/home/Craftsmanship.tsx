import { client } from "@/lib/sanity";
import { Instagram } from "lucide-react";
import Link from "next/link";
import LazyVideoSwiper from "./LazyVideoSwiper";

async function getData() {
  const query = `*[_type == "craftsmanship"][0] {
    heading,
    videos[] {
      "videoUrl": videoFile.asset->url,
      "thumbnailUrl": thumbnail.asset->url,
      thumbnail,
      link,
      videoName,
      videoDescription,
      uploadDate,
      duration
    }
  }`;

  const data = await client.fetch(query, {}, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  return data;
}

export default async function Craftsmanship() {
  const data = await getData();
  const heading = data?.heading || "REAL ORDERS FROM REAL CUSTOMERS";
  const videos = data?.videos || [];

  // NOTE: VideoObject schema intentionally NOT emitted. These are decorative
  // Instagram-loop videos shown across 17 commercial pages, not dedicated "watch
  // pages." Emitting VideoObject triggered 30 "Video isn't on a watch page"
  // warnings in GSC because the videos failed Google's watch-page bar (large
  // player + descriptive content about the video as primary content).
  // Pages themselves remain fully indexed. Re-introduce schema only if a future
  // page is built as a dedicated video watch experience.

  return (
    <>
    <section className="w-full pt-8 pb-6 bg-[#F7F7F7]">
      <div className="container mx-auto px-6 text-center">
        
        {/* HEADING - Mobile Optimized */}
        <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-black text-panda-dark uppercase tracking-wide mb-6 md:mb-8 lg:mb-10">
          {heading}
        </h2>

        {/* WHITE BOX CONTAINER */}
        <div className="bg-white rounded-[40px] px-4 py-8 lg:px-8 lg:py-12 shadow-sm max-w-[1460px] mx-auto">

          {/* VIDEO SWIPER */}
          {videos.length === 0 ? (
            <div className="text-gray-400 py-10 mb-10">Upload MP4 Videos in Sanity Studio</div>
          ) : (
            <LazyVideoSwiper videos={videos} />
          )}

          {/* FOLLOW BUTTON */}
           <div className="flex items-center justify-center">
             <Link 
               href="https://www.instagram.com/pandapatchesofficial/" 
               target="_blank"
               className="px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-panda-dark text-white text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-black hover:shadow-lg transition-all"
             >
               <Instagram size={16} className="text-panda-yellow flex-shrink-0" />
               <span>Follow on Instagram</span>
             </Link>
           </div>

        </div>

      </div>
    </section>
    </>
  );
}
