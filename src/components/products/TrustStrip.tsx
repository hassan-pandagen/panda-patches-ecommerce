import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";

async function getBadges() {
  // Fetch the Trust Badges from the Home Page Hero
  const query = `*[_type == "hero"][0].trustBadges`;
  const data = await client.fetch(query);
  return data;
}

export default async function TrustStrip() {
  const badges = await getBadges();

  if (!badges) return null;

  return (
    <section className="w-full py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">
        
        {/* HEADING */}
        <h2 className="text-[28px] lg:text-[32px] font-black text-black uppercase tracking-[0.15em] mb-12">
          PANDA IS 5 STAR RATED
        </h2>
        
        {/* BADGES ROW (Fetched from Sanity) */}
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20">
          {badges.map((badge: any, idx: number) => (
            <div key={idx} className="relative h-[50px] w-[120px]">
              <Image 
                src={urlFor(badge).url()} 
                alt="Trust Badge" 
                fill 
                className="object-contain" 
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
