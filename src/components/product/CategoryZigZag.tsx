import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getAllProducts() {
  // FILTER: Get all pages BUT NOT 'custom-patches', and only published documents
  const query = `*[_type == "productPage" && slug.current != "custom-patches" && !(_id in path("drafts.**"))] | order(_createdAt asc)`;
  const data = await client.fetch(query);
  return data;
}

interface CategoryZigZagProps {
  locationName?: string;
}

export default async function CategoryZigZag({ locationName }: CategoryZigZagProps) {
  const products = await getAllProducts();

  // Safety check: If no products found, hide section
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full py-10 md:py-14 bg-white">
      <div className="container mx-auto px-6 max-w-[1300px]">
        
        <h2 className="text-[28px] md:text-[40px] font-black text-center text-panda-dark mb-12 lg:mb-24 uppercase tracking-tight">
          {locationName 
            ? `Types of Custom Patches in ${locationName}` 
            : "Explore Our Patch Types"
          }
        </h2>

        <div className="flex flex-col gap-3 lg:gap-32">
          {products.map((product: any, idx: number) => {
            const isReverse = idx % 2 !== 0;
            
            // DYNAMIC TITLE: Add location suffix if provided
            const displayTitle = locationName 
              ? `${product.title} in ${locationName}` 
              : product.title;

            return (
              <Link
                key={product._id}
                href={`/custom-patches/${product.slug.current}`}
                className="group"
              >
                {/* MOBILE: Compact horizontal card */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-gray-100 shadow-sm group-hover:shadow-md transition-all lg:hidden">
                  <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-[#F9FAF5] rounded-[12px] overflow-hidden">
                    {product.gallery && product.gallery[0] && (
                      <Image
                        src={urlFor(product.gallery[0]).width(300).format('webp').quality(70).url()}
                        alt={displayTitle}
                        fill
                        className="object-contain p-2"
                        sizes="100px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-black text-panda-dark uppercase leading-tight mb-1.5">
                      {displayTitle}
                    </h3>
                    <p className="text-[12px] text-gray-500 leading-[1.5] line-clamp-2 mb-2">
                      {product.description ?
                        product.description.substring(0, 80) + "..." :
                        "Custom patches designed to your specifications."
                      }
                    </p>
                    <span className="text-[11px] font-bold text-panda-green uppercase tracking-wide inline-flex items-center gap-1">
                      Customize <ArrowRight size={12} />
                    </span>
                  </div>
                </div>

                {/* DESKTOP: Full zig-zag layout */}
                <div className={`hidden lg:flex items-center gap-24 ${isReverse ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1 w-full relative h-[450px] bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                    {product.gallery && product.gallery[0] && (
                      <Image
                        src={urlFor(product.gallery[0]).width(800).format('webp').quality(70).url()}
                        alt={displayTitle}
                        fill
                        className="object-contain p-10 group-hover:scale-105 transition-transform duration-500"
                        sizes="50vw"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-8">
                    <h3 className="text-[30px] lg:text-[36px] font-black text-panda-dark uppercase leading-none">
                      {displayTitle}
                    </h3>
                    <p className="text-[17px] text-gray-600 leading-[1.8] font-medium">
                      {product.description ?
                        product.description.substring(0, 150) + "..." :
                        "Create high-quality custom patches designed to your exact specifications with our expert team."
                      }
                    </p>
                    <div className="pt-2">
                       <span className="bg-black text-panda-yellow px-10 py-4 rounded-[12px] font-black uppercase tracking-widest text-[13px] inline-flex items-center gap-3 group-hover:scale-105 transition-transform shadow-xl">
                         Start Customizing <ArrowRight size={18} />
                       </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
