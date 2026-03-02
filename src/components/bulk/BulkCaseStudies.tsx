import Image from "next/image";
import { Flame, Shield, Trophy, Building2, Shirt, Music } from "lucide-react";
import { client, urlFor } from "@/lib/sanity";

// Hardcoded fallback (used when no Sanity data exists)
const fallbackStudies = [
  { icon: Flame,     title: "Fire Department Patches",  quantity: "800 pieces",   patchType: "Embroidered", turnaround: "10 days",       description: "Custom shoulder patches for a regional fire department. Included velcro backing for easy uniform swaps." },
  { icon: Trophy,    title: "College Sports Team",       quantity: "1,200 pieces", patchType: "Chenille",    turnaround: "12 days",       description: "Letterman jacket patches for a university athletics program. Chenille with felt backing for classic varsity look." },
  { icon: Building2, title: "Corporate Branding",        quantity: "2,500 pieces", patchType: "PVC",         turnaround: "14 days",       description: "Branded patches for a Fortune 500 employee uniform program. Durable PVC with velcro for outdoor teams." },
  { icon: Shield,    title: "Law Enforcement",           quantity: "500 pieces",   patchType: "Embroidered", turnaround: "7 days (rush)", description: "Custom badge patches for a police department. Merrowed border with iron-on backing for professional look." },
  { icon: Shirt,     title: "Apparel Brand Launch",      quantity: "3,000 pieces", patchType: "Woven",       turnaround: "14 days",       description: "Small woven labels and patches for a streetwear brand launch. High-detail logo with custom die-cut shape." },
  { icon: Music,     title: "Band Merchandise",          quantity: "1,500 pieces", patchType: "Embroidered", turnaround: "10 days",       description: "Tour merchandise patches for a national band. Iron-on patches sold at 25 concert venues." },
];

async function getCaseStudies() {
  try {
    const query = `*[_type == "bulkCaseStudy"] | order(order asc) {
      _id, title, description, quantity, patchType, turnaround,
      "image": image.asset->url
    }`;
    const data = await client.fetch(query);
    return data?.length > 0 ? data : null;
  } catch {
    return null;
  }
}

export default async function BulkCaseStudies() {
  const sanityStudies = await getCaseStudies();
  const usingSanity = !!sanityStudies;

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[24px] md:text-[36px] font-black text-panda-dark uppercase tracking-tight mb-4">
            Trusted by Brands & Organizations
          </h2>
          <p className="text-[14px] md:text-[16px] text-gray-500 font-medium max-w-[600px] mx-auto">
            From 500-piece fire department orders to 3,000-piece brand launches, we deliver quality at any scale.
          </p>
        </div>

        {/* Case Study Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

          {usingSanity ? (
            // SANITY DATA — show image if present
            sanityStudies.map((study: any) => (
              <div
                key={study._id}
                className="bg-panda-light rounded-[16px] overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image (if uploaded) */}
                {study.image && (
                  <div className="relative w-full h-[220px] bg-white flex items-center justify-center overflow-hidden">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 370px"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-[16px] md:text-[18px] font-bold text-panda-dark leading-tight mb-3">
                    {study.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-gray-500 leading-[1.6] mb-4">
                    {study.description}
                  </p>
                  <div className="flex flex-nowrap gap-2">
                    {study.quantity && (
                      <span className="bg-white text-[12px] md:text-[13px] font-bold text-panda-dark px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                        {study.quantity}
                      </span>
                    )}
                    {study.patchType && (
                      <span className="bg-white text-[12px] md:text-[13px] font-bold text-panda-green px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                        {study.patchType}
                      </span>
                    )}
                    {study.turnaround && (
                      <span className="bg-white text-[12px] md:text-[13px] font-bold text-gray-500 px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                        {study.turnaround}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // HARDCODED FALLBACK — icon-based cards
            fallbackStudies.map((study, idx) => (
              <div
                key={idx}
                className="bg-panda-light rounded-[16px] p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-panda-dark rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <study.icon className="w-5 h-5 text-panda-yellow" />
                  </div>
                  <h3 className="text-[16px] md:text-[18px] font-bold text-panda-dark leading-tight">{study.title}</h3>
                </div>
                <p className="text-[14px] md:text-[15px] text-gray-500 leading-[1.6] mb-4">{study.description}</p>
                <div className="flex flex-nowrap gap-2">
                  <span className="bg-white text-[12px] md:text-[13px] font-bold text-panda-dark px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                    {study.quantity}
                  </span>
                  <span className="bg-white text-[12px] md:text-[13px] font-bold text-panda-green px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                    {study.patchType}
                  </span>
                  <span className="bg-white text-[12px] md:text-[13px] font-bold text-gray-500 px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap">
                    {study.turnaround}
                  </span>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </section>
  );
}
