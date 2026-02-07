"use client";

import Image from "next/image";

const promises = [
  { icon: "/assets/icon-money.svg", title: "Money Back Guarantee", desc: "Your satisfaction owns the patch!" },
  { icon: "/assets/icon-check.svg", title: "Low Minimums", desc: "Witness the magic of custom patches." },
  { icon: "/assets/icon-mail.svg", title: "Quick Turnaround", desc: "Get it fast! Skip the long wait." },
  { icon: "/assets/icon-clock.svg", title: "24/7 Chat Support", desc: "Our 24/7 chat ensures prompt support." },
];

// === THIS IS THE FIX: Add bgColor prop ===
export default function Promises({ bgColor = "bg-[#F7F7F7]" }: { bgColor?: string }) {
  return (
    <section className={`w-full pb-24 pt-10 ${bgColor}`}>
      <div className="container mx-auto px-6 flex flex-col items-center">
        
        <h2 className="text-[32px] font-black text-center text-panda-dark uppercase tracking-wide mb-16">
          Panda Promises
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[50px] max-w-[1055px] w-full">
          {promises.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-[84px] h-[84px] bg-black rounded-full flex items-center justify-center mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                <div className="relative w-[38px] h-[38px]">
                  <Image src={item.icon} alt={item.title} fill className="object-contain" sizes="38px" quality={90} />
                </div>
              </div>
              <h3 className="text-[20px] font-extrabold text-panda-dark mb-3 leading-tight">{item.title}</h3>
              <p className="text-[15px] text-gray-500 leading-[1.6] max-w-[220px] font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
