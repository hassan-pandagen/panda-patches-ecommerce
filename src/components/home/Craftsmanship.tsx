import { client } from "@/lib/sanity";
import { Instagram } from "lucide-react";
import Link from "next/link";
import VideoSwiper from "./VideoSwiper";

async function getData() {
  const query = `*[_type == "craftsmanship"][0] {
    heading,
    videos[] {
      "videoUrl": videoFile.asset->url,
      thumbnail,
      link
    }
  }`;

  const data = await client.fetch(query, {}, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  console.log('Craftsmanship data:', data); // Debug log
  console.log('Videos:', data?.videos); // Debug log

  return data;
}

export default async function Craftsmanship() {
  const data = await getData();
  const heading = data?.heading || "SEE OUR CRAFTSMANSHIP";
  const videos = data?.videos || [];

  console.log('Rendering videos count:', videos.length); // Debug log

  return (
    <section className="w-full pt-16 pb-8 bg-[#F7F7F7]">
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
            <VideoSwiper videos={videos} />
          )}

          {/* BUTTONS */}
          <div className="flex items-center justify-center gap-4">
            <button className="px-8 py-3 rounded-full border border-gray-300 text-sm font-bold text-gray-600 hover:border-black hover:text-black transition-all">
              Load more
            </button>
            <Link 
              href="https://www.instagram.com/pandapatchesofficial/" 
              target="_blank"
              className="px-8 py-3 rounded-full bg-panda-dark text-white text-sm font-bold flex items-center gap-2 hover:bg-black hover:scale-105 transition-all shadow-lg"
            >
              <span>Follow on Instagram</span>
              <Instagram size={16} className="text-panda-yellow" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
