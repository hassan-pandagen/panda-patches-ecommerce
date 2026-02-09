import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import HeroForm from "./HeroForm";

async function getHeroData() {
  try {
    const query = `*[_type == "hero"][0] {
      title,
      subtitle,
      "heroImage": heroImage.asset->url,
      "trustBadges": trustBadges[].asset->url
    }`;
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Hero fetch error:", error);
    return null;
  }
}

export default async function Hero() {
  const data = await getHeroData();

  return (
    // Reduced height slightly to keep brands visible
    <section className="relative w-full min-h-[850px] bg-white overflow-hidden flex flex-col justify-center">
      
      {/* 
         FIX 1: GREEN BLOB (Exact Dimensions Logic)
         - width: ~46% of screen (matches the 888px visual on a 1920 screen)
         - height: 85% (leaves white space at bottom for brands)
      */}
      <div className="absolute top-0 right-0 h-[88%] w-[48%] z-0 pointer-events-none">
         <Image 
            src="/assets/hero-bg.svg" 
            alt="Background" 
            fill 
            className="object-cover object-left-bottom" 
            priority 
         />
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center flex-grow pt-12">
        
        {/* === LEFT SIDE (Text & Patches) === */}
        <div className="flex flex-col justify-center h-full">
          
          {/* 
             FIX 2: EXACT TYPOGRAPHY 
             - Font Size: 40px
             - Weight: SemiBold (600)
             - Color: Dark (No Yellow)
          */}
          <h1 className="text-[40px] leading-[1.2] font-semibold text-panda-dark tracking-tight mb-4 max-w-[550px]">
            {data?.title || "Custom Iron On Patches: No Minimums, Quick Delivery!"}
          </h1>
          
          {/* 
             FIX 3: SUBHEADING 
             - Font Size: 20px
             - Width constrained to force 3 lines
          */}
          <p className="text-[20px] text-gray-600 font-medium leading-[1.5] max-w-[520px] mb-6">
            {data?.subtitle || "Welcome to Panda Patches, where brand stories are stitched into reality! From company logos to promotional swag, let your brand speak loud and clear with our iron on patches. Crafted with care, delivered with precision."}
          </p>

          {/* Badges */}
          <div className="flex flex-nowrap items-center justify-start gap-5 mb-8">
             {data?.trustBadges && data.trustBadges.map((badge: any, idx: number) => (
               <div key={idx} className="relative h-8 w-24 flex-shrink-0">
                 <Image src={urlFor(badge).url()} alt="Trust Badge" fill className="object-contain object-left" />
               </div>
             ))}
          </div>

          {/* 
             FIX 4: IMAGE SIZE 
             - Width: 630px
             - Height: 379px (Aspect Ratio preserved)
          */}
          <div className="relative w-[630px] h-[379px] -ml-4 mt-2">
             {data?.heroImage && (
               <Image
                 src={urlFor(data.heroImage).url()}
                 alt="Custom Patches"
                 fill
                 className="object-contain object-left hover:scale-[1.02] transition-transform duration-700"
                 priority
               />
             )}

             {/* 1 Million Badge */}
             <div className="absolute bottom-16 right-20 bg-white shadow-xl rounded-xl p-3 flex items-center gap-3 animate-bounce-slow border border-gray-100">
                <div className="bg-[#E4EFE0] rounded-full p-2">✅</div>
                <div>
                  <p className="text-[12px] text-gray-400 uppercase font-bold tracking-wider">Patches Delivered</p>
                  <p className="font-black text-panda-dark text-lg">1 Million +</p>
                </div>
             </div>
          </div>
        </div>

        {/* 
           === RIGHT SIDE (Form) ===
           - Centered layout for the right column to place form deep in green
        */}
        <div className="w-full flex justify-center lg:justify-end items-center h-full pl-10">
           <div className="w-full max-w-[620px]">
              <HeroForm />
           </div>
        </div>

      </div>

      {/* === GLOBAL BRANDS (On White Background) === */}
      <div className="relative z-20 w-full pb-10 -mt-8 bg-transparent">
        <div className="container mx-auto px-6 text-center">
          
          <p className="text-[12px] font-black text-black uppercase tracking-[0.2em] mb-8 opacity-100">
            Trusted By Global Brands
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 grayscale hover:grayscale-0 transition-all duration-500">
             <Image src="/assets/logo-google.svg" alt="Google" width={100} height={35} className="object-contain" />
             <Image src="/assets/logo-microsoft.svg" alt="Microsoft" width={120} height={35} className="object-contain" />
             <Image src="/assets/logo-cocacola.svg" alt="CocaCola" width={110} height={35} className="object-contain" />
             <Image src="/assets/logo-nissan.svg" alt="Nissan" width={90} height={35} className="object-contain" />
          </div>
        </div>
      </div>

    </section>
  );
}
