'use client';

import Link from "next/link";
import { useRef, useState } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const last = reviews.length - 1;

  // Map horizontal scroll progress (0 → max) onto the dot index. Robust to the
  // container's edge padding and inter-card gaps. Desktop is a grid (no overflow),
  // so this no-ops there and the dots are hidden via md:hidden.
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    setActive(Math.round((el.scrollLeft / max) * last));
  };

  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (i / last) * max, behavior: "smooth" });
  };

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

        {/* Reviews — rendered ONCE. Mobile: native CSS scroll-snap row (swipeable,
            no Swiper library, no duplicate DOM) with dot indicators below. Desktop:
            4-column grid. */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex md:grid md:grid-cols-4 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((review, idx) => (
            <div key={idx} className="snap-center shrink-0 w-[85%] sm:w-[55%] md:w-auto">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        {/* Mobile dot indicators — tap to jump, active dot elongates */}
        <div className="flex md:hidden justify-center items-center gap-2 mt-5">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to review ${i + 1} of ${reviews.length}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-panda-dark" : "w-2 bg-gray-300"}`}
            />
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
    </section>
  );
}
