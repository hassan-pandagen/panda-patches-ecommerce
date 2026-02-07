"use client";

import { motion } from "framer-motion";

export default function PandaLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-panda-light">
      
      {/* 1. The Sewing Animation Container */}
      <div className="relative w-32 h-32 mb-8">
        
        {/* The Thread (SVG Line) */}
        <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#E3FF15" strokeWidth="4" fill="none" strokeDasharray="20 10" />
        </svg>

        {/* The Panda (Center) */}
        <div className="absolute inset-0 flex items-center justify-center">
             {/* eventually replace this text with <Image src="/panda-sewing.gif" /> */}
             <span className="text-6xl animate-bounce">🐼</span>
        </div>

        {/* The Needle (Orbiting) */}
        <motion.div 
          className="absolute top-0 left-1/2 w-1 h-1/2 origin-bottom"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-1 h-8 bg-gray-400 rounded-full absolute top-0" /> {/* Needle body */}
          <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -left-0.5" /> {/* Needle eye */}
        </motion.div>
      </div>

      {/* 2. The Text Animation */}
      <h2 className="text-2xl font-black text-panda-dark tracking-widest flex gap-1">
        STITCHING
        <span className="animate-pulse text-panda-green">...</span>
      </h2>
      <p className="text-sm text-gray-500 mt-2 font-medium">Preparing your design experience</p>
    </div>
  );
}
