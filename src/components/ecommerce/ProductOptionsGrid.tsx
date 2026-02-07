import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export default function ProductOptionsGrid({ productData }: { productData: any }) {
  const options = [
    { key: "backingOptions", title: "Backing Options" },
    { key: "finishOptions", title: "Material & Finish" },
    { key: "typeOptions", title: "Product Types" },
  ];

  // Filter out empty option arrays
  const activeOptions = options.filter(opt =>
    productData[opt.key] && productData[opt.key].length > 0
  );

  if (activeOptions.length === 0) return null;

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6 max-w-[1300px]">

        {activeOptions.map((option) => (
          <div key={option.key} className="mb-20 last:mb-0">
            <h2 className="text-[36px] font-black text-panda-dark text-center mb-12 uppercase">
              {option.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productData[option.key].map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-[#F9FAF5] rounded-[16px] p-6 border border-gray-100 hover:shadow-lg transition-all"
                >
                  {item.image && (
                    <div className="relative w-full h-[200px] mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={urlFor(item.image).url()}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-black text-[20px] text-panda-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-[15px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Size Options (if available) */}
        {productData.sizeOptions && productData.sizeOptions.length > 0 && (
          <div className="mt-20">
            <h2 className="text-[36px] font-black text-panda-dark text-center mb-12 uppercase">
              Size & Pricing
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[900px] mx-auto">
              {productData.sizeOptions.map((size: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-panda-dark text-white rounded-[12px] p-6 text-center"
                >
                  <p className="font-black text-[24px] mb-2">{size.label}</p>
                  <p className="text-panda-yellow text-[20px] font-bold">
                    ${size.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
