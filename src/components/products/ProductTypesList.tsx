import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export default function ProductTypesList({ types, heading }: { types: any[], heading: string }) {
  if (!types || types.length === 0) return null;

  return (
    <section className="w-full py-24 bg-white">
      <div className="container mx-auto px-6 max-w-[1200px]">
        
        {/* DYNAMIC HEADING */}
        <h2 className="text-[40px] font-black text-center text-panda-dark uppercase mb-24 tracking-tight">
          {heading}
        </h2>

        <div className="flex flex-col gap-32">
          {types.map((item: any, idx: number) => {
            const isReverse = idx % 2 !== 0;

            return (
              <div key={idx} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${isReverse ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* IMAGE */}
                <div className="flex-1 w-full relative h-[400px] bg-[#F9FAF5] rounded-[24px] overflow-hidden group border border-gray-100 shadow-sm">
                  {item.image && (
                    <Image
                      src={urlFor(item.image).url()}
                      alt={item.title}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      quality={85}
                    />
                  )}
                </div>

                {/* TEXT */}
                <div className="flex-1 space-y-6 text-center lg:text-left">
                  <h3 className="text-[32px] font-bold text-panda-dark uppercase leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[17px] text-gray-600 leading-[1.8]">
                    {item.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
