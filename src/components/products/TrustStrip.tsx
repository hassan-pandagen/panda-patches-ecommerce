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
    <section className="w-full py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">

        {/* HEADING */}
        <h2 className="text-[20px] md:text-[28px] lg:text-[32px] font-black text-black uppercase tracking-[0.1em] md:tracking-[0.15em] mb-8">
          PANDA IS 5 STAR RATED
        </h2>

        {/* BADGES - 2x2 on Mobile, Single Row on Desktop */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 max-w-[900px] mx-auto place-items-center">
          {badges.map((badge: any, idx: number) => (
            <div key={idx} className="relative h-8 md:h-10 w-20 md:w-24 flex items-center justify-center">
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
