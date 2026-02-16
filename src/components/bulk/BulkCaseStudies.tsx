import { Flame, Shield, Trophy, Building2, Shirt, Music } from "lucide-react";

const caseStudies = [
  {
    icon: Flame,
    title: "Fire Department Patches",
    quantity: "800 pieces",
    type: "Embroidered",
    turnaround: "10 days",
    description: "Custom shoulder patches for a regional fire department. Included velcro backing for easy uniform swaps.",
  },
  {
    icon: Trophy,
    title: "College Sports Team",
    quantity: "1,200 pieces",
    type: "Chenille",
    turnaround: "12 days",
    description: "Letterman jacket patches for a university athletics program. Chenille with felt backing for classic varsity look.",
  },
  {
    icon: Building2,
    title: "Corporate Branding",
    quantity: "2,500 pieces",
    type: "PVC",
    turnaround: "14 days",
    description: "Branded patches for a Fortune 500 employee uniform program. Durable PVC with velcro for outdoor teams.",
  },
  {
    icon: Shield,
    title: "Law Enforcement",
    quantity: "500 pieces",
    type: "Embroidered",
    turnaround: "7 days (rush)",
    description: "Custom badge patches for a police department. Merrowed border with iron-on backing for professional look.",
  },
  {
    icon: Shirt,
    title: "Apparel Brand Launch",
    quantity: "3,000 pieces",
    type: "Woven",
    turnaround: "14 days",
    description: "Small woven labels and patches for a streetwear brand launch. High-detail logo with custom die-cut shape.",
  },
  {
    icon: Music,
    title: "Band Merchandise",
    quantity: "1,500 pieces",
    type: "Embroidered",
    turnaround: "10 days",
    description: "Tour merchandise patches for a national band. Iron-on patches sold at 25 concert venues.",
  },
];

export default function BulkCaseStudies() {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[24px] md:text-[36px] font-black text-panda-dark uppercase tracking-tight mb-4">
            Trusted by Brands & Organizations
          </h2>
          <p className="text-[14px] md:text-[16px] text-gray-500 font-medium max-w-[600px] mx-auto">
            From 500-piece fire department orders to 3,000-piece brand launches — we deliver quality at any scale.
          </p>
        </div>

        {/* Case Study Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="bg-panda-light rounded-[16px] p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-panda-dark rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <study.icon className="w-5 h-5 text-panda-yellow" />
                </div>
                <h3 className="text-[16px] font-bold text-panda-dark leading-tight">{study.title}</h3>
              </div>

              {/* Description */}
              <p className="text-[13px] text-gray-500 leading-[1.6] mb-4">{study.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-white text-[11px] font-bold text-panda-dark px-3 py-1 rounded-full border border-gray-200">
                  {study.quantity}
                </span>
                <span className="bg-white text-[11px] font-bold text-panda-green px-3 py-1 rounded-full border border-gray-200">
                  {study.type}
                </span>
                <span className="bg-white text-[11px] font-bold text-gray-500 px-3 py-1 rounded-full border border-gray-200">
                  {study.turnaround}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
