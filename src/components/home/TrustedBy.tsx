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
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h3 className="text-xs md:text-sm font-black text-black uppercase tracking-[0.15em] md:tracking-[0.2em] mb-8 md:mb-12 opacity-100">
          Trusted By Global Brands
        </h3>
        
        {/* Mobile: 2x2 Grid | Desktop: 4 in 1 row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
          {brands.map((brand) => (
            <div 
              key={brand.name} 
              className="flex items-center justify-center h-12 md:h-16"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={brand.width}
                height={50}
                className="object-contain brightness-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
