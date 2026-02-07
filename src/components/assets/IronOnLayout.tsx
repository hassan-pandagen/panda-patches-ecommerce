import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

export default function IronOnLayout({ data }: { data: any }) {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6 max-w-[1350px]">
        
        {/* MAIN PAGE HEADING */}
        <h1 className="text-[42px] font-black text-panda-dark uppercase mb-24 text-center tracking-tight">
          {data.title}
        </h1>

        <div className="flex flex-col gap-24">
          {data.instructions?.map((item: any, idx: number) => {
            
            // Alternating Layout (Zig Zag)
            const isReverse = idx % 2 !== 0;

            return (
              <div 
                key={idx} 
                className={`
                  flex flex-col lg:flex-row items-start gap-12 lg:gap-20
                  ${isReverse ? 'lg:flex-row-reverse' : ''} 
                `}
              >
                
                {/* 
                   IMAGE COLUMN 
                   - No grey background, sits directly on white
                   - Size: ~660px width to match Figma
                */}
                <div className="w-full lg:w-[600px] xl:w-[660px] flex-shrink-0">
                  {item.image && (
                    <div className="relative w-full h-[400px]">
                      <Image 
                        src={urlFor(item.image).url()} 
                        alt={item.patchType} 
                        fill 
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* TEXT COLUMN */}
                <div className="flex-1 pt-4">
                  {/* Title */}
                  <h3 className="text-[32px] font-bold text-panda-dark mb-6">
                    {item.patchType}
                  </h3>
                  
                  {/* 
                     BULLET POINTS (Steps Only)
                     - Industry standard: 18-20px for instructional content
                  */}
                  <div className="mt-4 text-[18px] text-gray-700 leading-[1.8]">
                    <PortableText 
                      value={item.steps} 
                      components={{
                        list: {
                          bullet: ({children}) => (
                            <ul className="list-disc pl-5 space-y-3 marker:text-black">
                              {children}
                            </ul>
                          ),
                        },
                        listItem: {
                          bullet: ({children}) => <li className="text-[18px] text-gray-700">{children}</li>,
                        }
                      }}
                    />
                  </div>

                  {/* 
                     TEMPERATURE NOTE (Not a Bullet)
                     - Displayed as regular text below bullets
                  */}
                  {item.tableData && item.tableData.length > 0 && (
                    <div className="mt-6">
                      {item.tableData.map((row: any, i: number) => (
                        <p key={i} className="text-[17px] text-gray-700">
                          Note: {row.value}
                        </p>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
