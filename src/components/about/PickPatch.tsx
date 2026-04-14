import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import PickPatchSwiper from "./PickPatchSwiper";

interface PatchCard {
  image?: any;
  label: string;
  link?: string;
}

async function getData() {
  try {
    const query = `*[_type == "about"][0]{ pickPatchHeading, patchCards }`;
    const data = await client.fetch(query, {}, { next: { revalidate: 3600 } });
    return data;
  } catch {
    return null;
  }
}

// Map patch label keywords to their product page slugs
const SLUG_KEYWORDS: [string, string][] = [
  ['embroidered', '/custom-patches/embroidered'],
  ['chenille', '/custom-patches/chenille'],
  ['pvc', '/custom-patches/pvc'],
  ['woven', '/custom-patches/woven'],
  ['leather', '/custom-patches/leather'],
  ['printed', '/custom-patches/printed'],
];

function getAutoLink(label: string): string | null {
  const normalized = label.toLowerCase().trim();
  const match = SLUG_KEYWORDS.find(([keyword]) => normalized.includes(keyword));
  return match ? match[1] : null;
}

export default async function PickPatch() {
  const data = await getData();

  if (!data) return null;

  const title = data?.pickPatchHeading || "PICK YOUR PATCH!";
  const patches: PatchCard[] = data?.patchCards || [];

  if (patches.length === 0) return null;

  // Pre-resolve links for client component
  const patchesWithLinks = patches.map((p) => ({
    image: p.image,
    label: p.label,
    href: p.link || getAutoLink(p.label),
  }));

  return (
    <section className="w-full pb-14 pt-6 bg-white">
      <div className="container mx-auto px-4 text-center">

        {/* HEADING */}
        <h2 className="text-[22px] md:text-[32px] font-black text-panda-dark uppercase tracking-tight mb-12">
          {title}
        </h2>

        {/* DESKTOP: Grid Layout */}
        <div className="hidden md:flex flex-wrap justify-center gap-6">
          {patchesWithLinks.map((patch, idx) => (
            <PatchCardComponent key={idx} patch={patch} />
          ))}
        </div>

        {/* MOBILE: Swiper */}
        <div className="block md:hidden">
          <PickPatchSwiper patches={patchesWithLinks} />
        </div>

      </div>
    </section>
  );
}

function PatchCardComponent({ patch }: { patch: { image?: any; label: string; href: string | null } }) {
  const cardContent = (
    <div className="
      group
      flex flex-col items-center justify-between
      w-[248px] h-[326px]
      bg-[#F9FAF5]
      rounded-[16px]
      p-6
      hover:shadow-xl transition-all duration-300 cursor-pointer
    ">
      <div className="relative w-full h-[200px] flex items-center justify-center">
        {patch.image && (
          <Image
            src={urlFor(patch.image).width(500).format('webp').quality(80).url()}
            alt={patch.label}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 248px"
          />
        )}
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-[18px] font-bold text-panda-dark leading-tight">
          {patch.label}
        </h3>
      </div>
    </div>
  );

  if (patch.href) {
    return <Link href={patch.href} className="inline-block">{cardContent}</Link>;
  }
  return cardContent;
}
