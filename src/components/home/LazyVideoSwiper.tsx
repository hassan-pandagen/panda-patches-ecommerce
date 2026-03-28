'use client';
import dynamic from 'next/dynamic';

const VideoSwiper = dynamic(() => import('./VideoSwiper'), { ssr: false });

export default function LazyVideoSwiper({ videos }: { videos: any[] }) {
  return <VideoSwiper videos={videos} />;
}
