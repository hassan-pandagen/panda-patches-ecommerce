'use client';
import dynamic from 'next/dynamic';

// Reserve the swiper's rendered height while the chunk loads (audit P2 / PANDAP_1
// §1): ssr:false with no placeholder mounted at height 0 and expanded on
// hydration — a real layout shift on scroll. Blog cards are 603px tall plus
// pagination (~660px both breakpoints).
const BlogPlaceholder = () => (
  <div aria-hidden="true" className="w-full min-h-[660px]" />
);

const BlogSwiper = dynamic(() => import('./BlogSwiper'), {
  ssr: false,
  loading: BlogPlaceholder,
});

export default function LazyBlogSwiper({ blogs }: { blogs: any[] }) {
  return <BlogSwiper blogs={blogs} />;
}
