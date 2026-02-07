import Image from "next/image";
import Link from "next/link";

const matches = [
  { name: "Lapel Pins", img: "/assets/match-pins.png", link: "/custom-products/lapel-pins" },
  { name: "Challenge Coins", img: "/assets/match-coins.png", link: "/custom-products/challenge-coin" },
  { name: "Custom Keychains", img: "/assets/match-keychains.png", link: "/custom-products/keychains" },
  { name: "PVC Shoe Charms", img: "/assets/match-charms.png", link: "/custom-products/pvc-shoe-charms" },
];

export default function PickMatch() {
  return (
    <section className="w-full pb-24 pt-10 bg-white">
      <div className="container mx-auto px-4 text-center">
        
        <h2 className="text-[32px] font-black text-panda-dark uppercase tracking-tight mb-12">
          Pick Your Match!
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {matches.map((item, idx) => (
            <Link key={idx} href={item.link}>
              <div className="
                group
                flex flex-col items-center justify-between
                w-[248px] h-[326px] 
                bg-[#F9FAF5] 
                rounded-[16px] 
                p-6
                hover:shadow-xl transition-all duration-300 cursor-pointer
                border border-transparent hover:border-panda-green/20
              ">
                <div className="relative w-full h-[200px] flex items-center justify-center">
                  <Image 
                    src={item.img} 
                    alt={item.name} 
                    fill 
                    className="object-contain group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-[18px] font-bold text-panda-dark leading-tight">
                    {item.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
