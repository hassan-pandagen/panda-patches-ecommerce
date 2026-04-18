'use client';
import dynamic from 'next/dynamic';

// Reserve space matching ReviewsSection's rendered height so client-side hydration
// doesn't shift layout. Measured on prod mobile ~640px, desktop ~560px.
const ReviewsPlaceholder = () => (
  <div aria-hidden="true" className="w-full min-h-[640px] md:min-h-[560px]" />
);

const ReviewsSection = dynamic(() => import('./ReviewsSection'), {
  ssr: false,
  loading: ReviewsPlaceholder,
});

export default function LazyReviewsSection() {
  return <ReviewsSection />;
}
