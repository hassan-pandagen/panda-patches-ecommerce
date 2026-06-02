'use client';

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";

const reviews = [
  {
    name: "Billy Bob J.",
    location: "US",
    date: "Feb 21, 2026",
    title: "They're legit!!",
    body: "They're legit!!! I saw the reviews and asked ChatGPT before ordering. My patches arrived on time and a few were messed up. I sent 1 email with pictures and they mailed me more than I said were unusable. I'll be back for more! Good quality!",
    initials: "BB",
    color: "bg-yellow-400",
  },
  {
    name: "Selena P.",
    location: "US",
    date: "Feb 16, 2026",
    title: "Excellent experience ordering",
    body: "The quality is outstanding, durable, vibrant, and exactly what I envisioned. From my very first message, the team was friendly, responsive, and incredibly helpful. They checked in to make sure I was satisfied, and their customer service didn't stop after delivery. I highly recommend them!",
    initials: "SP",
    color: "bg-green-500",
  },
  {
    name: "Taye S.",
    location: "US",
    date: "Nov 28, 2025",
    title: "On time and great quality",
    body: "My experience was quite positive. They were impressively on time with both delivery and service. The quality of the material was excellent. It felt sturdy yet flexible, which is essential for long-lasting wear. I would recommend Panda Patches for anyone looking for reliable service.",
    initials: "TS",
    color: "bg-teal-500",
  },
  {
    name: "Javier P.",
    location: "US",
    date: "Jul 10, 2025",
    title: "My Panda Patches Experience",
    body: "I have nothing but great things to say about this company, they make the greatest patch work I've seen. They are trust worthy and I have not once messaged them that they haven't messaged me back that same day or early the next. This is how every company should treat its customers.",
    initials: "JP",
    color: "bg-orange-400",
  },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      <h3 className="text-[14px] font-bold text-panda-dark mb-2 leading-snug">
        {review.title}
      </h3>
      <p className="text-[13px] text-gray-500 leading-[1.7] flex-1">
        {review.body}
      </p>
      <div className="flex items-center gap-2.5 pt-4 mt-4 border-t border-gray-100">
        <div className={`w-8 h-8 rounded-full ${review.color} flex items-center justify-center flex-shrink-0`}>
          <span className="text-gray-900 text-[11px] font-bold">{review.initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-panda-dark leading-tight truncate">{review.name}</p>
          <p className="text-[11px] text-gray-600">{review.location} · {review.date}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="w-full py-8 md:py-12 bg-panda-light overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[24px] md:text-[36px] font-black text-panda-dark uppercase tracking-tight mb-3">
            What Our Customers Say
          </h2>
          <p className="text-[14px] md:text-[16px] text-gray-500 font-medium max-w-[500px] mx-auto">
            Real orders. Real people. See why customers keep coming back.
          </p>
        </div>

        {/* Mobile: Swiper (1 card at a time) - only after mount to avoid hydration mismatch from loop */}
        <div className="md:hidden">
          {mounted ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={16}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: true }}
              loop={true}
              className="!pb-10 [&_.swiper-button-next]:!hidden [&_.swiper-button-prev]:!hidden"
            >
              {reviews.map((review, idx) => (
                <SwiperSlide key={idx} className="h-auto">
                  <ReviewCard review={review} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <ReviewCard review={reviews[0]} />
          )}
        </div>

        {/* Desktop: all 4 in one row */}
        <div className="hidden md:grid md:grid-cols-4 gap-5">
          {reviews.map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
        </div>

        {/* See all link */}
        <div className="text-center mt-6 md:mt-8">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-panda-dark hover:text-panda-green transition-colors"
          >
            Read all customer reviews
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>

      {/* Swiper pagination dot styling */}
      <style>{`
        .swiper-pagination-bullet { background: #051C05; opacity: 0.25; }
        .swiper-pagination-bullet-active { background: #051C05; opacity: 1; }
      `}</style>
    </section>
  );
}
