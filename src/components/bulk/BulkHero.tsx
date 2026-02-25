import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { Shield, Clock, Gift, Award } from "lucide-react";
import BulkQuoteForm from "./BulkQuoteForm";

interface BulkHeroProps {
  heroImage?: string | null;
  trustBadges?: Array<{ url: string; alt: string }>;
  customHeading?: string;
  customSubheading?: string;
  customDescription?: string;
}

export default function BulkHero({
  heroImage,
  trustBadges = [],
  customHeading,
  customSubheading,
  customDescription
}: BulkHeroProps) {
  return (
    <section className="w-full pt-8 md:pt-12 pb-12 md:pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* LEFT - Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* H1 */}
            <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-black text-panda-dark leading-[1.1] tracking-tight mb-4">
              {customHeading || (
                <>
                  Custom Patches at Scale{" "}
                  <span className="text-panda-green">From 50 to 50,000 Pieces</span>
                </>
              )}
            </h1>

            {/* Subheadline */}
            {customSubheading && (
              <p className="text-[16px] md:text-[19px] font-bold text-panda-dark leading-[1.3] mb-3 max-w-[560px] mx-auto lg:mx-0">
                {customSubheading}
              </p>
            )}

            {/* Description */}
            <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.6] font-medium mb-5 max-w-[560px] mx-auto lg:mx-0">
              {customDescription || "Trusted by brands, sports teams, fire departments, and Fortune 500 companies. 2-week turnaround, no setup fees, free mockups included."}
            </p>

            {/* Trust Bar - Compact */}
            <div className="grid grid-cols-4 gap-2 max-w-[480px] mx-auto lg:mx-0 mb-6">
              {[
                { icon: Award, label: "4,000+", sub: "Bulk Orders" },
                { icon: Shield, label: "ASI", sub: "Verified" },
                { icon: Gift, label: "Free Sample", sub: "500+ Orders" },
                { icon: Clock, label: "2-Week", sub: "Turnaround" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center bg-panda-light rounded-[10px] py-2.5 px-2 border border-gray-100"
                >
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-panda-green mb-1" strokeWidth={2.5} />
                  <span className="text-[11px] md:text-[13px] font-bold text-panda-dark leading-tight">{item.label}</span>
                  <span className="text-[9px] md:text-[11px] text-gray-500 font-medium">{item.sub}</span>
                </div>
              ))}
            </div>

            {/* Trust Badge Strip */}
            {trustBadges.length > 0 && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 max-w-[480px] mx-auto lg:mx-0 mb-6">
                {trustBadges.filter((badge) => badge?.url).map((badge, idx) => (
                  <div key={idx} className="relative h-[44px] w-[96px] flex-shrink-0">
                    <Image
                      src={urlFor(badge.url).url()}
                      alt={badge.alt || "Trust badge | Panda Patches"}
                      fill
                      className="object-contain"
                      sizes="96px"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Hero Patch Image */}
            {heroImage && (
              <div className="relative w-full max-w-[520px] h-[200px] md:h-[320px] mx-auto lg:mx-0">
                <Image
                  src={urlFor(heroImage).width(1040).height(640).quality(85).auto('format').url()}
                  alt="Custom Patches Bulk Order"
                  fill
                  className="object-contain object-center lg:object-left"
                  priority
                  sizes="(max-width: 768px) 100vw, 520px"
                />
                {/* 1 Million Badge */}
                <div className="hidden md:flex absolute bottom-6 right-6 bg-white shadow-xl rounded-xl p-2.5 items-center gap-2.5 border border-gray-100">
                  <div className="bg-[#E4EFE0] rounded-full p-1.5">✅</div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Patches Delivered</p>
                    <p className="font-black text-panda-dark text-base">1 Million +</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - Full Quote Form */}
          <div className="w-full lg:w-[520px] flex-shrink-0">
            <BulkQuoteForm />
          </div>

        </div>

      </div>
    </section>
  );
}
