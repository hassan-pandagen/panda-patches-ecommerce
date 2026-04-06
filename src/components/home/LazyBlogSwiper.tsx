'use client';
import dynamic from 'next/dynamic';

const BlogSwiper = dynamic(() => import('./BlogSwiper'), { ssr: false });

export default function LazyBlogSwiper({ blogs }: { blogs: any[] }) {
  return <BlogSwiper blogs={blogs} />;
}
