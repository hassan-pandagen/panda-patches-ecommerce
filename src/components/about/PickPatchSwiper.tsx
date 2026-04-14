'use client'

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface PatchCard {
  image?: any;
  label: string;
  href: string | null;
}

export default function PickPatchSwiper({ patches }: { patches: PatchCard[] }) {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1.2}
      centeredSlides={true}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        480: { slidesPerView: 1.5 },
        640: { slidesPerView: 2 },
      }}
      className="!pb-12"
    >
      {patches.map((patch, idx) => (
        <SwiperSlide key={idx}>
          <PatchCard patch={patch} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function PatchCard({ patch }: { patch: PatchCard }) {
  const cardContent = (
    <div className="
      group
      flex flex-col items-center justify-between
      w-[248px] h-[326px]
      bg-[#F9FAF5]
      rounded-[16px]
      p-6
      hover:shadow-xl transition-all duration-300 cursor-pointer
    ">
      <div className="relative w-full h-[200px] flex items-center justify-center">
        {patch.image && (
          <Image
            src={urlFor(patch.image).width(500).format('webp').quality(80).url()}
            alt={patch.label}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 248px"
          />
        )}
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-[18px] font-bold text-panda-dark leading-tight">
          {patch.label}
        </h3>
      </div>
    </div>
  );

  if (patch.href) {
    return <Link href={patch.href} className="inline-block">{cardContent}</Link>;
  }
  return cardContent;
}
