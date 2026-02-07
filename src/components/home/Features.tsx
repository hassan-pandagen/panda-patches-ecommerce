"use client";

import { PencilRuler, Truck, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: PencilRuler,
    title: "Free Design & Setup",
    desc: "You'll receive a free mockup showcasing your design before production.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "We commit to delivering on time, every time. Rush options available.",
    color: "bg-green-50 text-panda-green",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed Satisfaction",
    desc: "100% satisfaction on every order. We resolve it promptly or refund.",
    color: "bg-purple-50 text-purple-600",
  },
];

export default function Features() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group p-8 rounded-[30px] border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-xl font-bold text-panda-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}