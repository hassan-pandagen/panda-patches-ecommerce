import Image from "next/image";
import ProductGallery from "./ProductGallery";
import ComplexCalculator from "./ComplexCalculator";
import HeroForm from "@/components/home/HeroForm";

interface Props {
  productData: any;
  isMainPage?: boolean;
}

export default function ProductHero({ productData, isMainPage = false }: Props) {
  
  const title = productData?.title || "Custom Patches";
  const desc = productData?.description || "Level up your brand's appearance with us. Mini billboards stitched into jackets, bags, and more!";
  const gallery = productData?.gallery || [];

  return (
    <section className="w-full pt-12 pb-24 bg-white">
      <div className="container mx-auto px-6 max-w-[1400px]">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          
          {/* === LEFT COLUMN === */}
          <div className="flex-1 lg:sticky lg:top-24 lg:h-fit w-full">
            
            {/* 
               TITLE
               - text-[38px] lg:text-[42px]: Smaller to fit "Custom Anime Embroidery Patches" on 1 line
               - tracking-tight: Keeps it compact
            */}
            <h1 className="text-[38px] lg:text-[42px] font-extrabold text-panda-dark leading-tight mb-6 w-full tracking-tight">
              {title}
            </h1>

            {/* Description */}
            <p className="text-[16px] text-gray-600 leading-[1.7] font-medium mb-10 max-w-[600px]">
              {desc}
            </p>

            {/* Gallery */}
            <ProductGallery images={gallery} />
          
          </div>

          {/* === RIGHT COLUMN === */}
          <div className={`
             w-full max-w-[600px]
             ${isMainPage ? 'mt-8 lg:mt-16' : 'mt-0'}
          `}>
             {isMainPage ? (
               <div className="mt-2">
                 <HeroForm />
               </div>
             ) : (
               <ComplexCalculator
                 backingOptions={productData?.backingOptions || []}
                 upgradeOptions={productData?.upgradeOptions || []}
                 productType={productData?.title || "Custom Patch"}
               />
             )}
          </div>

        </div>
      </div>
    </section>
  );
}
