import Image from "next/image";
import { urlFor } from "@/lib/sanity";

interface TrustBadgesProps {
  badges: any[];
  layout?: "grid" | "row";
}

export default function TrustBadges({ badges, layout = "grid" }: TrustBadgesProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 place-items-center">
      {badges.map((badge: any, idx: number) => (
        <div
          key={idx}
          className="relative h-8 md:h-10 w-20 md:w-24 flex items-center justify-center"
        >
          <Image
            src={urlFor(badge).url()}
            alt="Trust Badge"
            fill
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}
