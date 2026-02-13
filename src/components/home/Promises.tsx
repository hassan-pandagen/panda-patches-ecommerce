"use client";

import Image from "next/image";

const promises = [
  { icon: "/assets/icon-money.svg", title: "Money Back Guarantee", desc: "Your satisfaction owns the patch; our promise ensures it's truly yours!" },
  { icon: "/assets/icon-check.svg", title: "Low Minimums", desc: "Witness the magic of custom patches with no minimums. Craft your distinct style with just 5 patches!" },
  { icon: "/assets/icon-mail.svg", title: "Quick Turnaround", desc: "Need it tomorrow? Get it today! Skip the wait with the fast turnaround – 7-14 days, delivered." },
  { icon: "/assets/icon-clock.svg", title: "24/7 Chat Support", desc: "Our 24/7 chat ensures prompt and reliable support, day or night!" },
];

// === THIS IS THE FIX: Add bgColor prop ===
export default function Promises({ bgColor = "bg-[#F7F7F7]" }: { bgColor?: string }) {
  return (
    <section className={`w-full pb-8 md:pb-24 pt-10 ${bgColor}`}>
      <div className="container mx-auto px-6 flex flex-col items-center">
        
        <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-black text-center text-panda-dark uppercase tracking-wide mb-8 md:mb-12 lg:mb-16">
          Panda Promises
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-[50px] max-w-[1055px] w-full">
          {promises.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-[70px] h-[70px] md:w-[84px] md:h-[84px] bg-black rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                <div className="relative w-[32px] h-[32px] md:w-[38px] md:h-[38px]">
                  <Image src={item.icon} alt={item.title} fill className="object-contain" sizes="38px" quality={90} />
                </div>
              </div>
              <h3 className="text-[13px] md:text-[18px] font-extrabold text-panda-dark mb-2 md:mb-3 leading-tight">{item.title}</h3>
              <p className="text-[13px] md:text-[15px] text-gray-500 leading-[1.6] max-w-[180px] md:max-w-[220px] font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
