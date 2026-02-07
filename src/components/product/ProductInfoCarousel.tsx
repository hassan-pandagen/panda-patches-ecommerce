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

  // The Title Card Component
  const TitleCard = () => (
    <div className="
      flex-shrink-0 
      w-[280px] h-[277px] 
      flex flex-col items-center justify-center 
      bg-white 
    ">
       <div className="w-[120px] h-[50px] relative mb-4">
         <Image src="/assets/logo-panda.svg" alt="Panda" fill className="object-contain" sizes="120px" quality={90} />
       </div>
       <h3 className="text-[26px] font-black text-panda-dark text-center leading-tight">
         {title}
       </h3>
       <p className="text-[14px] text-gray-400 mt-2 font-medium tracking-wide text-center">
         {subtitle}
       </p>
    </div>
  );

  return (
    <section className="w-full py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        <div className="relative group">
          
          {/* ARROWS */}
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:bg-black hover:text-white transition-all -ml-4 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>

          <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:bg-black hover:text-white transition-all -mr-4 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          {/* TRACK */}
          <div 
            ref={scrollRef}
            className={`
              flex flex-nowrap items-center gap-5 overflow-x-auto no-scrollbar scroll-smooth py-4 pl-1
              ${layout === 'right' ? 'flex-row-reverse' : 'flex-row'}
            `}
          >
            
            {/* TITLE CARD */}
            <TitleCard />

            {/* DYNAMIC CARDS */}
            {cards.map((card: OptionCard, idx: number) => (
              <div 
                key={idx}
                className="
                  flex-shrink-0 
                  w-[280px] h-[277px] 
                  bg-[#F9FAF5] 
                  rounded-[8px] 
                  overflow-hidden 
                  flex flex-col
                  shadow-sm hover:shadow-md transition-shadow
                "
              >
                {/* Image Area */}
                <div className="h-[160px] relative w-full bg-gray-200">
                  {card.image ? (
                     <Image
                       src={urlFor(card.image).url()}
                       alt={card.title}
                       fill
                       className="object-cover"
                       sizes="280px"
                       quality={85}
                     />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[12px]">Image</div>
                  )}
                </div>

                {/* Text Area */}
<div className="flex-1 flex flex-col items-center text-center justify-center p-4">
                   <h4 className="text-[18px] font-bold text-panda-dark mb-2">
                     {card.title}
                   </h4>
                   <p className="text-[14px] leading-[20px] font-normal text-gray-600 max-w-[245px]">
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
