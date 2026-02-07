"use client";

import Image from "next/image";

const brands = [
  { name: "Google", src: "/assets/logo-google.svg", width: 110 },
  { name: "Microsoft", src: "/assets/logo-microsoft.svg", width: 130 },
  { name: "CocaCola", src: "/assets/logo-cocacola.svg", width: 120 },
  { name: "Nissan", src: "/assets/logo-nissan.svg", width: 100 },
];

export default function TrustedBy() {
  return (
    // Reduced padding to bring section closer
    <section className="w-full pb-12 pt-0 bg-white">
      <div className="container mx-auto px-6 text-center">
        <p className="text-[13px] font-bold text-black uppercase tracking-[0.2em] mb-10">
          Trusted By Global Brands
        </p>
        
        <div className="flex flex-wrap justify-center items-end gap-12 lg:gap-24 opacity-80">
          {brands.map((brand) => (
            <div key={brand.name} className="relative h-10 flex items-center justify-center">
               <Image 
                 src={brand.src} 
                 alt={brand.name} 
                 width={brand.width} 
                 height={40} 
                 className="object-contain grayscale brightness-0 hover:grayscale-0 hover:brightness-100 transition-all duration-300"
               />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
