import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";

async function getData() {
  try {
    const query = `*[_type == "industry"][0]`;
    const data = await client.fetch(query);
    return data || null;
  } catch (error) {
    console.error("Error fetching industry data:", error);
    return null;
  }
}

export default async function IndustrySection() {
  const data = await getData();

  // Fallback Data (Matches your Figma Screenshot)
  const heading = data?.heading || "CUSTOMIZED IRON ON PATCHES FOR VARIOUS INDUSTRIES";
  const desc = data?.description || "Customized patches are a versatile and cost-effective way to promote and identify businesses and organizations across various industries. These patches can be tailored to the specific needs of a company or organization and can be used for branding, employee recognition, and more. They can be made in a variety of shapes, sizes, and colors and can include text, logos, and other designs. Customized patches are a popular choice for industries such as apparel, scout group, biker patches, military, and sports teams.";
  
  const cards = data?.cards || [
    {
      title: "Sports Patches",
      text: "A custom-made sports patch is the perfect representation of team spirit. Achieve a winning design with a wide range of special options available to choose from.",
      image: "/assets/patch-sports.png",
      list: ["Football Teams", "Baseball Leagues", "Soccer Clubs"]
    },
    {
      title: "Military Patches & Pins",
      text: "Every custom-made military patch is crafted with the utmost respect and appreciation for our service members. Regardless of which branch of the military you belong to.",
      image: "/assets/patch-military.png",
      list: ["Military organizations", "Motorcycle clubs", "Scout troops", "Law enforcement"]
    },
    {
      title: "Biker Patches",
      text: "Riding a Harley Davidson isn't complete without a custom motorcycle patch. Browse a vast range of options to design a unique custom patch that's fit for the road.",
      image: "/assets/patch-biker.png",
      list: ["Motorcycle Clubs", "Riding Groups", "Leather Jackets"]
    }
  ];

  return (
    // SECTION BACKGROUND: #F6F6F6 (Grey)
    <section className="w-full py-24 bg-[#F6F6F6]">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* === HEADER === */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-[24px] md:text-[40px] font-black text-panda-dark uppercase tracking-tight max-w-4xl mx-auto leading-tight">
            {heading}
          </h2>
          <p className="text-[16px] text-gray-500 font-medium max-w-4xl mx-auto leading-[1.8]">
            {desc}
          </p>
          <p className="text-[20px] md:text-[24px] lg:text-[30px] font-bold text-panda-dark mt-4">
            Explore a few of our most popular patch categories:
          </p>
        </div>

        {/* === CARDS GRID === */}
        <div className="flex flex-wrap justify-center gap-8">
          {cards.map((card: any, idx: number) => (
            // CARD CONTAINER: W 405px, H 524px (White)
            <div 
              key={idx} 
              className="
                w-[405px] min-h-[524px] 
                bg-white 
                p-8 
                flex flex-col items-center 
                shadow-sm hover:shadow-xl transition-all duration-300
              "
            >
              
              {/* Title */}
              <h3 className="text-[18px] md:text-[24px] font-bold text-panda-dark mb-6">
                {card.title}
              </h3>

              {/* IMAGE: W 252px, H 238px */}
              <div className="relative w-[252px] h-[238px] mb-6">
                {card.image && (
                  <Image
                     src={card.image.asset ? urlFor(card.image).url() : card.image}
                     alt={card.title}
                     fill
                     className="object-contain hover:scale-105 transition-transform duration-500"
                     sizes="252px"
                     quality={85}
                  />
                )}
              </div>

              {/* Text */}
              <p className="text-[13px] text-gray-500 text-center leading-[1.6] mb-8">
                {card.text}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 w-full mt-auto">
                <button className="flex-1 bg-black text-panda-yellow py-3 text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                  Learn More
                </button>
                <button className="flex-1 border border-gray-300 text-black py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                  Get Quote Now
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
