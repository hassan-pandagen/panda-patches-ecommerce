"use client";

import { useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OptionCard {
  _id?: string | number;
  title: string;
  description: string;
  image?: any; // Sanity image type
}

interface Props {
  options: OptionCard[];
  title?: string;
  subtitle?: string;
  layout?: "left" | "right";
}

export default function ProductInfoCarousel({ 
  options, 
  title = "Patch Backing Options", 
  subtitle = "Patch Embroidered Options",
  layout = "left" 
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; 
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const cards: OptionCard[] = options?.length > 0 ? options : [
    { _id: 1, title: "Patch Material", description: "Choose which base material will form the foundation of your patch." },
    { _id: 2, title: "Embroidery Coverage", description: "Add just the right amount of embroidery to give your design a pop of texture. Choose from 50-100% coverage." },
    { _id: 3, title: "Other Patch Upgrades", description: "Take your patches to the next level with optional upgrades like button loops, rhinestones, reflective details, and more." },
    { _id: 4, title: "Backing Options", description: "Select from Iron-on, Velcro, or Peel & Stick for easy application." },
    { _id: 5, title: "Border Options", description: "Merrowed borders for a classic look, or hot cut for intricate shapes." },
  ];

  // Hide swiper arrows if 3 or fewer options
  const showArrows = cards.length > 3;

  // The Title Card Component - Responsive
  const TitleCard = () => (
    <div className="
      flex-shrink-0
      w-[240px] md:w-[280px]
      flex flex-col items-center justify-center
      bg-white
      px-4
      py-8
    ">
       <div className="w-[100px] md:w-[120px] h-[40px] md:h-[50px] relative mb-4">
         <Image src="/assets/logo-panda.svg" alt="Panda" fill className="object-contain" sizes="120px" quality={90} />
       </div>
       <h3 className="text-[22px] md:text-[26px] font-black text-panda-dark text-center leading-tight">
         {title}
       </h3>
       <p className="text-[13px] md:text-[14px] text-gray-400 mt-2 font-medium tracking-wide text-center">
         {subtitle}
       </p>
    </div>
  );

  return (
    <section className="w-full py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-[1400px]">

        {/* MOBILE HEADING - Show only on mobile */}
        <div className="md:hidden text-center mb-8">
          <div className="w-[100px] h-[40px] relative mx-auto mb-4">
            <Image src="/assets/logo-panda.svg" alt="Panda" fill className="object-contain" sizes="100px" quality={90} />
          </div>
          <h3 className="text-[24px] font-black text-panda-dark uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-[13px] text-gray-500 mt-2 font-medium">
            {subtitle}
          </p>
        </div>

        <div className="relative group">

          {/* ARROWS - Only show if more than 3 options */}
          {showArrows && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full bg-black text-white hover:bg-panda-yellow hover:text-black hover:shadow-lg transition-all z-10"
                aria-label="Previous"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>

              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full bg-black text-white hover:bg-panda-yellow hover:text-black hover:shadow-lg transition-all z-10"
                aria-label="Next"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </>
          )}

          {/* TRACK - Responsive */}
          <div
            ref={scrollRef}
            className={`
              flex flex-nowrap items-center gap-3 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-4 pl-1
              ${layout === 'right' ? 'flex-row-reverse' : 'flex-row'}
            `}
          >

            {/* TITLE CARD - Hide on mobile, show on desktop */}
            <div className="hidden md:block">
              <TitleCard />
            </div>

            {/* DYNAMIC CARDS */}
            {cards.map((card: OptionCard, idx: number) => (
              <div
                key={idx}
                className="
                  flex-shrink-0
                  w-[240px] md:w-[280px]
                  bg-white
                  rounded-[12px]
                  overflow-hidden
                  flex flex-col
                  shadow-md hover:shadow-xl transition-all duration-300
                  border border-gray-100
                "
              >
                {/* Image Area with Background - Industry Standard: Square aspect ratio */}
                <div className="aspect-square relative w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
                  {card.image ? (
                     <Image
                       src={urlFor(card.image).width(400).quality(90).fit('max').url()}
                       alt={card.title}
                       fill
                       className="object-contain p-3"
                       sizes="(max-width: 768px) 240px, 280px"
                       quality={90}
                     />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[12px]">Image</div>
                  )}
                </div>

                {/* Text Area - Responsive */}
                <div className="flex-1 flex flex-col items-center text-center justify-center p-3 md:p-4">
                   <h4 className="text-[16px] md:text-[18px] font-bold text-panda-dark mb-2 leading-tight">
                     {card.title}
                   </h4>
                   <p className="text-[13px] md:text-[14px] leading-[18px] md:leading-[20px] font-normal text-gray-600 line-clamp-3">
                     {card.description}
                   </p>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
