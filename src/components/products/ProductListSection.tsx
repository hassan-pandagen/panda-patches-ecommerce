import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

async function getCustomProducts() {
  const query = `*[_type == "customProduct" && slug.current in [
    "lapel-pins",
    "challenge-coin",
    "keychains",
    "pvc-shoe-charms"
  ]]`;
  const data = await client.fetch(query);
  return data;
}

export default async function ProductListSection() {
  const products = await getCustomProducts();

  return (
    <section className="w-full py-24 bg-white">
      <div className="container mx-auto px-6 max-w-[1300px]">
        
        <h2 className="text-[40px] font-black text-center text-panda-dark mb-24 uppercase tracking-tight">
          Customized Products for Various Industries
        </h2>

        <div className="flex flex-col gap-32">
          {products.map((product: any, idx: number) => {
            const isReverse = idx % 2 !== 0; 
            return (
              <div key={product._id} className={`flex flex-col lg:flex-row items-start gap-16 lg:gap-24 ${isReverse ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* IMAGE */}
                <div className="flex-1 w-full relative h-[450px] bg-[#F9FAF5] rounded-[24px] overflow-hidden group border border-gray-100 shadow-sm">
                  {product.gallery && product.gallery[0] && (
                    <Image 
                      src={urlFor(product.gallery[0]).url()} 
                      alt={product.title}
                      fill
                      className="object-contain p-10 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* TEXT */}
                <div className="flex-1 space-y-6">
                  <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-black text-panda-dark uppercase leading-tight">
                    {product.title}
                  </h3>
                  
                  <p className="text-[16px] text-gray-600 leading-[1.8]">
                    {product.description || "Create high-quality custom products designed to your exact specifications."}
                  </p>

                  {/* IDEAL FOR LIST */}
                  {product.idealFor && product.idealFor.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-panda-dark mb-4 uppercase tracking-wide">Ideal For:</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.idealFor.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 size={16} className="text-panda-green flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4">
                    <Link href={`/custom-products/${product.slug.current}`}>
                      <button className="bg-black text-panda-yellow px-8 py-4 rounded-[10px] font-black uppercase tracking-widest text-[13px] flex items-center gap-3 hover:scale-105 transition-transform shadow-xl">
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
