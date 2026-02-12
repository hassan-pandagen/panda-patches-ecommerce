import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";

async function getCTAData() {
  const query = `*[_type == "cta"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function CTASection() {
  const data = await getCTAData();

  // Fallback Data
  const heading = data?.heading || "Get started with your design today!";
  const sub = data?.subheading || "Why wait? Select your options, share your artwork, and we'll get you started on your custom products.";
  const btnText = data?.buttonText || "Get Quote";
  
  // Use Sanity Image or Fallback to local
  const bgImage = data?.backgroundImage ? urlFor(data.backgroundImage).url() : "/assets/cta-bg.png";

  return (
    <section className="relative w-full h-[450px] bg-white overflow-hidden flex items-center justify-center">
      
      {/* 1. BACKGROUND IMAGE - 100% VISIBLE */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage} 
          alt="Patches Background" 
          fill 
          className="object-cover object-center"
          priority
        />
      </div>

      {/* 
         2. CENTER CONTENT (Exact Figma Dimensions)
         - max-w-[460px]: Forces the text to wrap exactly like your screenshot.
      */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center text-center">
        
        <div className="max-w-[380px] flex flex-col items-center gap-6">
          
          {/* Heading */}
          <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-black leading-[1.3] tracking-tight">
            {heading}
          </h2>

          {/* Subtext */}
          <p className="text-[14px] text-gray-900 font-medium leading-[1.5]">
            {sub}
          </p>

          {/* Button */}
          <button className="
            bg-black text-panda-yellow 
            font-bold text-[16px] 
            px-10 py-3 
            rounded-[6px] 
            hover:scale-105 transition-transform duration-300 shadow-xl
            mt-2
          ">
            {btnText}
          </button>

        </div>

      </div>
    </section>
  );
}
