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
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6 max-w-[1300px]">
        
        <h2 className="text-[40px] font-black text-center text-panda-dark mb-24 uppercase tracking-tight">
          {locationName 
            ? `Types of Custom Patches in ${locationName}` 
            : "Explore Our Patch Types"
          }
        </h2>

        <div className="flex flex-col gap-32">
          {products.map((product: any, idx: number) => {
            const isReverse = idx % 2 !== 0;
            
            // DYNAMIC TITLE: Add location suffix if provided
            const displayTitle = locationName 
              ? `${product.title} in ${locationName}` 
              : product.title;

            return (
              <div 
                key={product._id} 
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${isReverse ? 'lg:flex-row-reverse' : ''}`}
              >
                
                {/* IMAGE */}
                <div className="flex-1 w-full relative h-[450px] bg-[#F9FAF5] rounded-[24px] overflow-hidden group border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  {product.gallery && product.gallery[0] && (
                    <Image 
                      src={urlFor(product.gallery[0]).url()} 
                      alt={displayTitle}
                      fill
                      className="object-contain p-10 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* TEXT */}
                <div className="flex-1 space-y-8">
                  <h3 className="text-[24px] md:text-[30px] lg:text-[36px] font-black text-panda-dark uppercase leading-none">
                    {displayTitle}
                  </h3>
                  
                  <p className="text-[17px] text-gray-600 leading-[1.8] font-medium">
                    {product.description ? 
                      product.description.substring(0, 150) + "..." : 
                      "Create high-quality custom patches designed to your exact specifications with our expert team."
                    }
                  </p>

                  <div className="pt-2">
                   <Link href={`/custom-patches/${product.slug.current}`}>
                     <button className="bg-black text-panda-yellow px-10 py-4 rounded-[12px] font-black uppercase tracking-widest text-[13px] flex items-center gap-3 hover:scale-105 transition-transform shadow-xl">
                       Start Customizing <ArrowRight size={18} />
                     </button>
                   </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
