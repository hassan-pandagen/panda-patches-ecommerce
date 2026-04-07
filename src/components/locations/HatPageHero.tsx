import Image from "next/image";
import BulkQuoteForm from "@/components/bulk/BulkQuoteForm";
import { CheckCircle } from "lucide-react";
import { urlFor } from "@/lib/sanity";

interface Props {
  title: string;
  description: string;
  gallery?: any[];
}

const TRUST_POINTS = [
  "Embroidered, woven, leather and PVC options for any hat style",
  "Structured caps, snapbacks, truckers, dad hats and beanies",
  "Free mockup within 24 hours. Production only after your approval.",
  "Free US shipping on every order. No setup fees.",
  "Low minimums — starting from 50 pieces",
];

export default function HatPageHero({ title, description, gallery = [] }: Props) {

  // Pick up to 4 gallery images for the grid
  const gridImages = gallery.slice(0, 4);
  const hasImages = gridImages.length > 0;

  return (
    <section id="quote-form" className="w-full pt-4 pb-10 md:pb-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">

          {/* LEFT — Title, description, trust points, image grid */}
          <div className="flex-1 w-full pt-2 md:pt-6">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-panda-green/10 text-panda-green text-[12px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-panda-green animate-pulse" />
              Hat Patches Specialist
            </div>

            {/* Title */}
            <h1 className="text-[26px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-extrabold text-panda-dark leading-tight mb-4 tracking-tight">
              {title}
            </h1>

            {/* Price anchor — visible before intro paragraph */}
            <div className="flex flex-wrap gap-3 mb-4">
              {["Starting from $0.71/patch", "Free Design & Mockup", "Ships in 7-14 Days"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 bg-panda-green/10 text-panda-green text-[13px] font-bold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-panda-green" />
                  {item}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.7] font-medium mb-6 max-w-[560px]">
              {description}
            </p>

            {/* Trust points */}
            <ul className="space-y-3 mb-6">
              {TRUST_POINTS.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-panda-green flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-[14px] md:text-[15px] text-gray-700 font-medium">{point}</span>
                </li>
              ))}
            </ul>

            {/* Image grid — Sanity gallery if available, fallback to single hero image */}
            {hasImages ? (
              <div className="grid grid-cols-2 gap-3 mb-6 max-w-[560px]">
                {gridImages.map((img: any, i: number) => {
                  const src = img?.asset
                    ? urlFor(img).width(280).height(200).format("webp").quality(80).url()
                    : null;
                  if (!src) return null;
                  return (
                    <div key={i} className="relative h-[160px] md:h-[190px] rounded-[14px] overflow-hidden shadow-sm">
                      <Image
                        src={src}
                        alt={`Custom hat patch sample ${i + 1}`}
                        fill
                        sizes="280px"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative w-full max-w-[560px] h-[220px] md:h-[260px] rounded-[16px] overflow-hidden mb-6 shadow-sm">
                <picture>
                  <source media="(min-width: 768px)" srcSet="/assets/hero-product.webp" />
                  <img
                    src="/assets/hero-product-mobile.webp"
                    alt="Custom hat patches — embroidered, woven, leather and PVC patches for caps and hats"
                    width={560}
                    height={260}
                    fetchPriority="high"
                    decoding="auto"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  />
                </picture>
              </div>
            )}

            {/* Social proof bar */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-[22px] font-black text-panda-dark">1M+</p>
                <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Patches Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-[22px] font-black text-panda-dark">4.8★</p>
                <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Trustpilot Rating</p>
              </div>
              <div className="text-center">
                <p className="text-[22px] font-black text-panda-dark">24h</p>
                <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Free Mockup</p>
              </div>
              <div className="text-center">
                <p className="text-[22px] font-black text-panda-dark">7-14</p>
                <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Day Delivery</p>
              </div>
            </div>

          </div>

          {/* RIGHT — Bulk Quote Form */}
          <div className="w-full max-w-[580px] lg:sticky lg:top-24 lg:h-fit mt-4 lg:mt-0">
            <BulkQuoteForm />
          </div>

        </div>
      </div>
    </section>
  );
}
