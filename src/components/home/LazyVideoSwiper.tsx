'use client';
import dynamic from 'next/dynamic';

// Reserve the swiper's rendered height while the chunk loads (audit P2 / PANDAP_1
// §1): ssr:false with no placeholder mounted at height 0 and expanded on
// hydration — a real layout shift for anyone scrolling on a slow connection.
// Mobile: 400px video card + pagination (~460px). Desktop: 341px cards (~400px).
const VideoPlaceholder = () => (
  <div aria-hidden="true" className="w-full min-h-[460px] lg:min-h-[400px]" />
);

const VideoSwiper = dynamic(() => import('./VideoSwiper'), {
  ssr: false,
  loading: VideoPlaceholder,
});

export default function LazyVideoSwiper({ videos }: { videos: any[] }) {
  return <VideoSwiper videos={videos} />;
}
