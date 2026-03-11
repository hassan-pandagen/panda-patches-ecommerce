import Image from "next/image";
import ProductGalleryWrapper from "./ProductGalleryWrapper";
import ComplexCalculator from "./ComplexCalculator";
import HeroForm from "@/components/home/HeroForm";
import AutoLinker from "@/components/seo/AutoLinker";
import { client } from "@/lib/sanity";

interface Props {
  productData: any;
  isMainPage?: boolean;
}

async function getTrustBadges() {
  try {
    const query = `*[_type == "hero"][0] {
      "trustBadges": trustBadges[].asset->url
    }`;
    const data = await client.fetch(query);
    return data?.trustBadges || [];
  } catch (error) {
    console.error("Trust badges fetch error:", error);
    return [];
  }
}

export default async function ProductHero({ productData, isMainPage = false }: Props) {

  const title = productData?.title || "Custom Patches";
  const desc = productData?.description || "Level up your brand's appearance with us. Mini billboards stitched into jackets, bags, and more!";
  const gallery = productData?.gallery || [];
  const trustBadges = await getTrustBadges();

  return (
    <section className="w-full pt-2 md:pt-4 pb-8 md:pb-14 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">

        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-20 items-start">

          {/* === LEFT COLUMN - Mobile Responsive === */}
          <div className="flex-1 w-full">

            {/*
               TITLE - Mobile Responsive
               - Smaller font sizes for better balance with form
               - Single line on all screen sizes
               - Optimized for mobile and desktop
            */}
            <h1 className="text-[20px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[34px] font-extrabold text-panda-dark leading-tight mb-4 md:mb-6 w-full tracking-tight text-center md:text-left whitespace-nowrap overflow-hidden">
              {title}
            </h1>

            {/* Description - Mobile Responsive */}
            <p className="text-[14px] md:text-[16px] text-gray-600 leading-[1.6] md:leading-[1.7] font-medium mb-6 md:mb-10 max-w-[600px] text-center md:text-left mx-auto md:mx-0">
              <AutoLinker text={desc} />
            </p>

            {/* Gallery */}
            <ProductGalleryWrapper images={gallery} />

          </div>

          {/* === RIGHT COLUMN — sticky on desktop so it stays visible while scrolling gallery === */}
          <div className={`
             w-full max-w-[600px] lg:sticky lg:top-24 lg:h-fit
             ${isMainPage ? 'mt-4 md:mt-8 lg:mt-16' : 'mt-0'}
          `}>
             {isMainPage ? (
               <div className="mt-2">
                 {/* Trust Badges */}
                 {trustBadges && trustBadges.length > 0 && (
                   <div className="mb-6 pb-6 border-b border-gray-200">
                     <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 place-items-center">
                       {trustBadges.map((badge: any, idx: number) => (
                         <div
                           key={idx}
                           className="relative h-8 md:h-10 w-20 md:w-24 flex items-center justify-center"
                         >
                           <Image
                             src={badge}
                             alt="Trust Badge"
                             fill
                             className="object-contain"
                             sizes="(max-width: 768px) 80px, 96px"
                           />
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
                 <HeroForm productSlug={productData?.slug?.current} />
               </div>
             ) : (
               <ComplexCalculator
                 backingOptions={productData?.backingOptions || []}
                 borderOptions={productData?.borderOptions || []}
                 borderSectionLabel={productData?.borderSectionLabel || ""}
                 upgradeOptions={productData?.upgradeOptions || []}
                 productType={productData?.title || "Custom Patch"}
                 trustBadges={trustBadges}
               />
             )}
          </div>

        </div>
      </div>
    </section>
  );
}
