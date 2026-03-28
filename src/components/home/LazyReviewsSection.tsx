'use client';
import dynamic from 'next/dynamic';

const ReviewsSection = dynamic(() => import('./ReviewsSection'), { ssr: false });

export default function LazyReviewsSection() {
  return <ReviewsSection />;
}
