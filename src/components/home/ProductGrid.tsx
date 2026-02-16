import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";

async function getProducts() {
  try {
    const query = `
      {
        "main": *[_type == "product" && category == "main"] | order(_createdAt asc) {
          _id,
          title,
          image,
          tag,
          description
        },
        "other": *[_type == "product" && category == "other"] | order(_createdAt asc) {
          _id,
          title,
          image,
          tag,
          description
        }
      }
    `;
    const data = await client.fetch(query);
    return data || { main: [], other: [] };
  } catch (error) {
    console.error("ProductGrid fetch error:", error);
    return { main: [], other: [] };
  }
}

// Map product titles to their existing page URLs
function getProductUrl(title: string): string {
  const urlMap: { [key: string]: string } = {
    'Custom Embroidered Patches': '/custom-patches/embroidered',
    'Custom PVC Patches': '/custom-patches/pvc',
    'Custom Chenille Patches': '/custom-patches/chenille',
    'Custom Woven Patches': '/custom-patches/woven',
    'Custom Leather Patches': '/custom-patches/leather',
    'Custom Printed Patches': '/custom-patches/printed',
    'Custom No Background 3D Embroidery': '/custom-patches/3d-embroidered-transfers',
    'Custom Sequin Patches': '/custom-patches/sequin',
  };

  return urlMap[title] || '#';
}

// Map product titles to their starting prices
function getProductPrice(title: string): string {
  const priceMap: { [key: string]: string } = {
    'Custom Embroidered Patches': '0.85',
    'Custom PVC Patches': '0.50',
    'Custom Chenille Patches': '2.50',
    'Custom Woven Patches': '1.20',
    'Custom Leather Patches': '1.50',
    'Custom Printed Patches': '0.75',
    'Custom No Background 3D Embroidery': '1.00',
    'Custom Sequin Patches': '2.00',
  };

  return priceMap[title] || '0.99';
}

export default async function ProductGrid() {
  const { main, other } = await getProducts();

  return (
    <section className="w-full pt-8 md:pt-10 pb-8 md:pb-24 bg-white">
      <div className="container mx-auto px-4 max-w-[1350px]">
        
        {/* HEADER TEXT */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-[26px] md:text-[40px] font-semibold text-panda-dark uppercase leading-tight tracking-tight">
            INFUSE YOUR STYLE WITH <br />
            EXCLUSIVE BESPOKE PATCH DESIGNS
          </h2>
          <p className="text-[17px] text-gray-800 leading-[1.8] max-w-[1020px] mx-auto font-medium">
            From personalized logo patches, to <Link href="/custom-name-patches" className="underline decoration-panda-dark underline-offset-4 hover:text-panda-dark font-semibold">personalized name patch</Link>, from <Link href="/custom-tactical-patches" className="underline decoration-panda-dark underline-offset-4 hover:text-panda-dark font-semibold">military patches</Link>, to <Link href="/custom-jacket-patches" className="underline decoration-panda-dark underline-offset-4 hover:text-panda-dark font-semibold">personalized patches for jackets</Link>, and custom <Link href="/custom-velcro-patches" className="underline decoration-panda-dark underline-offset-4 hover:text-panda-dark font-semibold">Velcro patches</Link>,
            our tailored selection ensures a lasting impression, showcasing your unique style. At Panda Patches, we&apos;re dedicated to providing personalized iron on
            patches in the US, that bring brand vision to life and take your product to the next level.
          </p>
        </div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 place-items-center mb-28">
          {main.map((item: any) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>

        {/* OTHER PRODUCTS HEADING */}
        <div className="text-center mb-16">
           <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-gray-800 uppercase tracking-wide">
             OTHER CUSTOM PRODUCTS THAT WILL AMAZE YOU!
           </h3>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 place-items-center">
          {other.map((item: any) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}

// === CUSTOM "3 BOXES + PLUS" ICON ===
function CustomGridPlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="3" y="3" width="7" height="7" rx="1" /> {/* Top Left */}
      <rect x="14" y="3" width="7" height="7" rx="1" /> {/* Top Right */}
      <rect x="3" y="14" width="7" height="7" rx="1" /> {/* Bottom Left */}
      <path d="M14 17.5h7m-3.5-3.5v7" /> {/* Plus Sign Bottom Right */}
    </svg>
  );
}

// === PRODUCT CARD ===
function ProductCard({ item }: { item: any }) {
  const href = getProductUrl(item.title);
  const price = getProductPrice(item.title);

  return (
    <Link href={href} className="
      group relative
      w-[296px] h-[484px]
      bg-white
      shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
      transition-all duration-500
      flex flex-col
      cursor-pointer
      overflow-hidden
      block
    ">
      {/* IMAGE AREA */}
      <div className="relative w-full h-[296px] bg-[#F9FAF5] flex items-center justify-center p-6 transition-colors duration-500 group-hover:bg-white">

        {/* Discount Tag (Fixed to Black Box - Premium Look) */}
        <div className="absolute top-0 right-0 bg-black text-white text-[12px] font-bold px-3 py-1.5 uppercase z-10 tracking-widest">
          {item.tag || "25% Off"}
        </div>

        {/* Image */}
        <div className="relative w-full h-full">
           {item.image ? (
             <Image
               src={urlFor(item.image).url()}
               alt={item.title}
               fill
               className="object-contain group-hover:scale-110 transition-transform duration-500"
               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 296px"
               quality={85}
             />
           ) : (
             <div className="w-full h-full bg-gray-200/50 animate-pulse rounded-lg" />
           )}
        </div>
      </div>

      {/* TEXT AREA */}
      <div className="flex-grow p-6 text-center flex flex-col items-center justify-center">
        <h3 className="text-[18px] font-black text-panda-dark uppercase mb-3 leading-tight min-h-[48px] max-w-[180px] mx-auto">
          {item.title}
        </h3>
        <p className="text-[15px] text-gray-500 leading-relaxed line-clamp-3 mb-3">
          {item.description}
        </p>

        {/* Pricing */}
        <p className="text-[16px] font-bold text-panda-dark">
          From ${price}/piece
        </p>
      </div>

      {/* 
         === THE MAGIC FOOTER BUTTON === 
         - Flex container with relative positioning.
         - Text is absolute centered.
         - Icons pushed to edges.
      */}
      <div className="relative w-full h-[55px] bg-black overflow-hidden flex items-center px-6">
        
        {/* Yellow Wipe Background */}
        <div className="absolute top-0 left-0 h-full w-0 bg-panda-yellow transition-all duration-500 ease-out group-hover:w-full z-0"></div>

        {/* 1. LEFT ICON (Custom) */}
        <div className="relative z-10 group-hover:text-black text-white transition-colors duration-500">
          <CustomGridPlusIcon />
        </div>

        {/* 2. CENTER TEXT (Absolute Center) */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="text-[14px] font-black uppercase tracking-[0.15em] group-hover:text-black text-white transition-colors duration-500">
            Learn More
          </span>
        </div>
        
        {/* 3. RIGHT ARROW (Pushed Right) */}
        <div className="relative z-10 ml-auto group-hover:text-black text-white transition-colors duration-500">
          <ArrowRight size={20} strokeWidth={2.5} />
        </div>

      </div>
    </Link>
  );
}
