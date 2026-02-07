import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export default function WorkSamplesEcommerce({ samples }: { samples: any[] }) {
  if (!samples || samples.length === 0) return null;

  return (
    <section className="w-full py-20 bg-[#F9FAF5]">
      <div className="container mx-auto px-6 max-w-[1300px]">
        <h2 className="text-[40px] font-black text-center text-panda-dark mb-16 uppercase tracking-tight">
          Our Work Samples
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {samples.map((sample, idx) => (
            <div
              key={idx}
              className="relative aspect-square bg-white rounded-[16px] overflow-hidden shadow-md hover:shadow-xl transition-all group"
            >
              <Image
                src={urlFor(sample).url()}
                alt={`Work sample ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
