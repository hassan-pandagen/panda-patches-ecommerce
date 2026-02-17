'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client, urlFor } from "@/lib/sanity";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface PatchCard {
  image?: any;
  label: string;
  link?: string;
}

async function getData() {
  const query = `*[_type == "about"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default function PickPatch() {
  const [data, setData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getData().then(setData);
  }, []);

  if (!mounted || !data) {
    return null;
  }

  const title = data?.pickPatchHeading || "PICK YOUR PATCH!";
  const patches: PatchCard[] = data?.patchCards || [];

  return (
    <section className="w-full pb-24 pt-10 bg-white">
      <div className="container mx-auto px-4 text-center">

        {/* HEADING */}
        <h2 className="text-[22px] md:text-[32px] font-black text-panda-dark uppercase tracking-tight mb-12">
          {title}
        </h2>

        {patches.length > 0 ? (
          <>
            {/* DESKTOP: Grid Layout (hidden on mobile) */}
            <div className="hidden md:flex flex-wrap justify-center gap-6">
              {patches.map((patch, idx) => (
                <PatchCardComponent key={idx} patch={patch} />
              ))}
            </div>

            {/* MOBILE: Swiper (hidden on desktop) */}
            <div className="block md:hidden">
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
                  480: {
                    slidesPerView: 1.5,
                  },
                  640: {
                    slidesPerView: 2,
                  },
                }}
                className="!pb-12"
              >
                {patches.map((patch, idx) => (
                  <SwiperSlide key={idx}>
                    <PatchCardComponent patch={patch} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        ) : (
          <p className="text-gray-400">
            Please add patch cards in Sanity Studio (About → Patch Cards)
          </p>
        )}

      </div>
    </section>
  );
}

// === SINGLE CARD COMPONENT ===
function PatchCardComponent({ patch }: { patch: PatchCard }) {
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

      {/* Image Area */}
      <div className="relative w-full h-[200px] flex items-center justify-center">
        {patch.image && (
          <Image
            src={urlFor(patch.image).url()}
            alt={patch.label}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-500"
          />
        )}
      </div>

      {/* Label Area */}
      <div className="mt-4 text-center">
        <h3 className="text-[18px] font-bold text-panda-dark leading-tight">
          {patch.label}
        </h3>
      </div>

    </div>
  );

  // If link exists, wrap in Link component
  if (patch.link) {
    return (
      <Link href={patch.link} className="inline-block">
        {cardContent}
      </Link>
    );
  }

  // Otherwise, just return the card
  return cardContent;
}
