import Image from "next/image";

interface PromiseItem {
  icon: string;
  title: string;
  desc: string;
}

const defaultPromises: PromiseItem[] = [
  { icon: "/assets/icon-money.svg", title: "Money Back Guarantee", desc: "Your satisfaction owns the patch; our promise ensures it's truly yours!" },
  { icon: "/assets/icon-check.svg", title: "Low Minimums", desc: "Craft your distinct style starting from just 5 patches. Low minimums, maximum creativity!" },
  { icon: "/assets/icon-mail.svg", title: "Quick Turnaround", desc: "Standard 7-14 business days — rush in hand in as fast as 5 business days on qualifying orders." },
  { icon: "/assets/icon-check.svg", title: "Free Sample First", desc: "For orders 500+, get a free physical sample. Verify quality, color, and sizing before full production." },
];

export default function Promises({ bgColor = "bg-[#F7F7F7]", items }: { bgColor?: string; items?: PromiseItem[] }) {
  const promises = items ?? defaultPromises;
  return (
    <section className={`w-full pb-6 md:pb-12 pt-8 ${bgColor}`}>
      <div className="container mx-auto px-6 flex flex-col items-center">
        
        <h2 className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-black text-center text-panda-dark uppercase tracking-wide mb-8 md:mb-12 lg:mb-16">
          4 Things Every Order Gets. All Free.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-[50px] max-w-[65.9375rem] w-full">
          {promises.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-[70px] h-[70px] md:w-[84px] md:h-[84px] bg-black rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                <div className="relative w-[32px] h-[32px] md:w-[38px] md:h-[38px]">
                  <Image src={item.icon} alt={`${item.title} icon - Panda Patches guarantee`} fill className="object-contain" sizes="38px" quality={90} />
                </div>
              </div>
              <h3 className="text-[0.9375rem] md:text-[1.125rem] font-extrabold text-panda-dark mb-2 md:mb-3 leading-tight">{item.title}</h3>
              <p className="text-[0.8125rem] md:text-[0.9375rem] text-gray-500 leading-[1.6] max-w-[180px] md:max-w-[220px] font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
