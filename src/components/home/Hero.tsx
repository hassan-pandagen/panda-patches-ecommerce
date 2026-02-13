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
    // Mobile and desktop responsive heights
    <section className="relative w-full min-h-screen md:min-h-[850px] bg-white overflow-hidden flex flex-col justify-start md:justify-center">

      {/*
         FIX 1: GREEN BLOB (Exact Dimensions Logic)
         - width: ~46% of screen (matches the 888px visual on a 1920 screen)
         - height: 85% (leaves white space at bottom for brands)
         - Hidden on mobile for cleaner look
      */}
      <div className="hidden lg:block absolute top-0 right-0 h-[88%] w-[48%] z-0 pointer-events-none">
         <Image
            src="/assets/hero-bg.svg"
            alt="Background"
            fill
            className="object-cover object-left-bottom"
            priority
         />
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center flex-grow pt-0 md:pt-8 lg:justify-items-start justify-items-center">
        
        {/* === LEFT SIDE (Text & Patches) === */}
        <div className="flex flex-col justify-center h-full text-center lg:text-left w-full lg:w-auto">
          
          {/*
             FIX 2: EXACT TYPOGRAPHY
             - Desktop: Font Size 40px
             - Mobile: Font Size 28px
             - Weight: SemiBold (600)
             - Color: Dark (No Yellow)
          */}
          <h1 className="text-[28px] md:text-[40px] leading-[1.2] font-semibold text-panda-dark tracking-tight mb-2 md:mb-4 max-w-full md:max-w-[550px]">
            {data?.title || "Custom Iron On Patches: No Minimums, Quick Delivery!"}
          </h1>

          {/*
             FIX 3: SUBHEADING
             - Desktop: Font Size 20px
             - Mobile: Font Size 16px
             - Width constrained to force 3 lines
          */}
          <p className="text-[16px] md:text-[20px] text-gray-600 font-medium leading-[1.5] max-w-full md:max-w-[520px] mb-3 md:mb-6">
            {data?.subtitle || "Welcome to Panda Patches, where brand stories are stitched into reality! From company logos to promotional swag, let your brand speak loud and clear with our iron on patches. Crafted with care, delivered with precision."}
          </p>

          {/* Badges - 2x2 Grid on mobile, Single row on desktop */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:items-center md:justify-center lg:justify-start gap-3 md:gap-5 mb-8 md:mb-8 w-full mx-auto md:mx-0 max-w-[280px] md:max-w-full place-items-center">
             {data?.trustBadges && data.trustBadges.map((badge: any, idx: number) => (
               <div key={idx} className="relative h-12 md:h-8 w-24 md:w-24 flex-shrink-0 flex items-center justify-center">
                 <Image src={urlFor(badge).url()} alt="Trust Badge" fill className="object-contain object-center" />
               </div>
             ))}
          </div>

          {/*
             FIX 4: IMAGE SIZE
             - Desktop: Width 630px, Height 379px
             - Mobile: Responsive with full width
          */}
          <div className="relative w-full max-w-full md:max-w-[630px] h-[250px] md:h-[379px] -mt-8 md:-mt-10 mx-auto md:mx-0">
             {data?.heroImage && (
               <Image
                 src={urlFor(data.heroImage).url()}
                 alt="Custom Patches"
                 fill
                 className="object-contain object-center md:object-left hover:scale-[1.02] transition-transform duration-700"
                 priority
               />
             )}

             {/* 1 Million Badge - Hidden on mobile */}
             <div className="hidden md:flex absolute bottom-16 right-20 bg-white shadow-xl rounded-xl p-3 items-center gap-3 animate-bounce-slow border border-gray-100">
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
           - Responsive padding for mobile
        */}
        <div className="w-full flex justify-center lg:justify-end items-center h-full pl-0 lg:pl-10">
           <div className="w-full max-w-[620px]">
              <HeroForm />
           </div>
        </div>

      </div>

      {/* === GLOBAL BRANDS (On Hero Background) === */}
      <div className="relative z-20 w-full pb-6 md:pb-8 pt-4 md:pt-6 bg-transparent">
        <div className="container mx-auto px-4 md:px-6 text-center">

          <p className="text-[11px] md:text-[13px] font-black text-black text-center uppercase tracking-[0.15em] md:tracking-[0.2em] mb-5 md:mb-7 opacity-100">
            Trusted By Global Brands
          </p>

          {/* Mobile: 2x2 Grid | Desktop: 4 in 1 row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-5xl mx-auto">
             <div className="flex items-center justify-center h-12 md:h-16">
               <Image src="/assets/logo-google.svg" alt="Google" width={110} height={50} className="object-contain brightness-0" />
             </div>
             <div className="flex items-center justify-center h-12 md:h-16">
               <Image src="/assets/logo-microsoft.svg" alt="Microsoft" width={130} height={50} className="object-contain brightness-0" />
             </div>
             <div className="flex items-center justify-center h-12 md:h-16">
               <Image src="/assets/logo-cocacola.svg" alt="CocaCola" width={120} height={50} className="object-contain brightness-0" />
             </div>
             <div className="flex items-center justify-center h-12 md:h-16">
               <Image src="/assets/logo-nissan.svg" alt="Nissan" width={100} height={50} className="object-contain brightness-0" />
             </div>
          </div>
        </div>
      </div>

    </section>
  );
}
