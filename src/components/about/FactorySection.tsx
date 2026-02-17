import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";

async function getData() {
  const query = `*[_type == "about"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function FactorySection() {
  const data = await getData();

  const title = data?.factoryHeading || "PANDA PATCHES FACTORY";
  const desc = data?.factoryDescription || "Our Factory in Pakistan isn&apos;t just a production line...";
  // Fallback if no image uploaded
  const image = data?.factoryImage ? urlFor(data.factoryImage).url() : null;

  return (
    <section className="w-full py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* LEFT: TEXT */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h2 className="text-[20px] md:text-[32px] font-black text-panda-dark uppercase tracking-tight">
            {title}
          </h2>
          <p className="text-[16px] text-gray-600 leading-[1.8] font-medium">
            {desc}
          </p>
        </div>

        {/* RIGHT: IMAGE (Exact Dimensions from Figma) */}
        <div className="relative w-full max-w-[590px] h-[275px] rounded-[20px] overflow-hidden shadow-lg">
          {image ? (
            <Image 
              src={image} 
              alt="Factory" 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              Upload Factory Image
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
