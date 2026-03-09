import Image from "next/image";
import { urlFor } from "@/lib/sanity";

interface TrustBadgesProps {
  badges: any[];
  layout?: "grid" | "row";
}

function getBadgeSrc(badge: any): string {
  // 1. Raw URL string (from ProductHero: trustBadges[].asset->url)
  if (typeof badge === 'string') return badge;
  // 2. Object with .url property (from specialty pages: {url, alt})
  if (badge?.url) return badge.url;
  // 3. Sanity image reference (from Hero: {ref, alt})
  if (badge?.ref) return urlFor(badge.ref).width(200).format('webp').quality(80).url();
  // 4. Direct Sanity asset (from AboutContent: raw trustBadges[] items)
  return urlFor(badge).width(200).format('webp').quality(80).url();
}

function getBadgeAlt(badge: any, idx: number): string {
  if (typeof badge === 'string') return `Trust badge ${idx + 1}`;
  return badge?.alt || `Trust badge ${idx + 1}`;
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
            src={getBadgeSrc(badge)}
            alt={getBadgeAlt(badge, idx)}
            fill
            className="object-contain"
            sizes="96px"
          />
        </div>
      ))}
    </div>
  );
}
