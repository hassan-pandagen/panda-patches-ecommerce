"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { motion } from "framer-motion";

export default function ProcessInteractive({ data }: { data: any }) {
  const [activeStep, setActiveStep] = useState(0);

  // Helper to get line width
  const getLineWidth = () => {
    if (activeStep === 1) return "33%";
    if (activeStep === 2) return "66%";
    if (activeStep === 3) return "100%";
    return "0%";
  };

  return (
    <div className="relative">
      
      {/* 
         THE CONNECTING LINE 
         - bg-gray-300: Visible grey track
         - Positioned to pass through center of number circles
      */}
      <div className="absolute top-[52px] left-[20%] right-[20%] h-[4px] bg-gray-300 z-0 hidden lg:block rounded-full">
        {/* 
           FIX 1: ANIMATED LINE IS NOW BLACK
           - bg-black: Sharp contrast on light grey
        */}
        <motion.div 
          className="h-full bg-black origin-left rounded-full"
          animate={{ width: getLineWidth() }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* === THE 3 STEPS === */}
      <div className="flex flex-wrap justify-center gap-8 lg:gap-16 relative z-10">
        {data?.steps?.map((step: any, index: number) => {
          const stepNum = index + 1;
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center group cursor-pointer"
              onMouseEnter={() => setActiveStep(stepNum)}
              onMouseLeave={() => setActiveStep(0)}
            >
              
              {/* Step Number */}
              <div className="flex flex-col items-center mb-10">
                <span className="text-[18px] font-bold text-panda-dark mb-2">
                  Step
                </span>
                {/* 
                   NUMBER CIRCLE
                   - Active: Black Background, Yellow Text (High Contrast)
                   - Inactive: White Background, Black Text
                */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-[#F9FAF5] transition-colors duration-300
                  ${activeStep >= stepNum ? 'bg-black text-panda-yellow' : 'bg-white text-black'}
                `}>
                  {stepNum}
                </div>
              </div>

              {/* IMAGE CONTAINER */}
              <div className="
                relative 
                w-[350px] h-[350px] lg:w-[416px] lg:h-[416px] 
                rounded-[24px] 
                overflow-hidden 
                transition-transform duration-500
                group-hover:-translate-y-2
              ">
                
                {/* Image */}
                {step.image && (
                  <Image 
                    src={urlFor(step.image).url()} 
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                )}

                {/* 
                   FIX 2: FLOATING PILL LABEL 
                   - w-[70%]: Not full width
                   - left-1/2 -translate-x-1/2: Perfectly Centered
                   - bottom-6: Floating up from edge
                   - rounded-full: Pill shape
                */}
                <div className="
                  absolute bottom-6 left-1/2 -translate-x-1/2 w-[70%]
                  bg-panda-yellow/85 backdrop-blur-[2px]
                  py-3 text-center
                  rounded-full
                  shadow-lg
                  transition-all duration-300
                  group-hover:scale-105
                ">
                  <span className="text-black font-black uppercase tracking-[0.15em] text-sm">
                    {step.title}
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
