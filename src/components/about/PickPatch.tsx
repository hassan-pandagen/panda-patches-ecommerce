import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";

async function getData() {
  const query = `*[_type == "about"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function PickPatch() {
  const data = await getData();
  const title = data?.pickPatchHeading || "PICK YOUR PATCH!";
  const patches = data?.patchCards || []; // Will come from Sanity

  return (
    <section className="w-full pb-24 pt-10 bg-white">
      <div className="container mx-auto px-4 text-center">
        
        {/* HEADING */}
        <h2 className="text-[32px] font-black text-panda-dark uppercase tracking-tight mb-12">
          {title}
        </h2>

        {/* 
           GRID: 5 Columns 
           - Justified Center
           - Gap 4
        */}
        <div className="flex flex-wrap justify-center gap-6">
          {patches.length > 0 ? (
            patches.map((patch: any, idx: number) => (
              <PatchCard key={idx} patch={patch} />
            ))
          ) : (
            <p className="text-gray-400">Please add 5 patches in Sanity Studio</p>
          )}
        </div>

      </div>
    </section>
  );
}

// === SINGLE CARD COMPONENT ===
function PatchCard({ patch }: { patch: any }) {
  return (
    // EXACT DIMENSIONS: 248px width, 326px height
    <div className="
      group
      flex flex-col items-center justify-between
      w-[248px] h-[326px] 
      bg-[#F9FAF5] 
      rounded-[16px] 
      p-6
      hover:shadow-xl transition-all duration-300 cursor-pointer
    ">
      
      {/* Image Area */}
      <div className="relative w-full h-[200px] flex items-center justify-center">
        {patch.image && (
          <Image 
            src={urlFor(patch.image).url()} 
            alt={patch.label} 
            fill 
            className="object-contain group-hover:scale-110 transition-transform duration-500" 
          />
        )}
      </div>

      {/* Label Area */}
      <div className="mt-4 text-center">
        <h3 className="text-[18px] font-bold text-panda-dark leading-tight">
          {patch.label}
        </h3>
      </div>

    </div>
  );
}
