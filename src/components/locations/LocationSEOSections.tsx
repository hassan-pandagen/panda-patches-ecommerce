import Link from "next/link";
import { ReactNode } from "react";

interface SEOSection {
  heading: string;
  content: ReactNode;
}

export default function LocationSEOSections({ slug }: { slug: string }) {
  const sectionsBySlug: Record<string, SEOSection[]> = {
    "alabama-patches": [
      {
        heading: "Get the Best Custom Patches in Alabama",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Gear up your style with premium custom patches Alabama from{" "}
            <Link href="/" className="text-purple-600 hover:underline font-medium">Panda Patches</Link>
            ! Perfect for teams, brands, or personal projects, our patches are crafted with high-quality materials and attention-grabbing designs to meet the demands of the bustling custom patches Alabama lifestyle. Choose from{" "}
            <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">embroidered</Link>
            ,{" "}
            <Link href="/custom-patches/woven" className="text-purple-600 hover:underline font-medium">woven</Link>
            , or{" "}
            <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">PVC</Link>
            {" "}options to suit your vision. Whether for jackets,{" "}
            <Link href="/patches-for-hats" className="text-purple-600 hover:underline font-medium">hats</Link>
            , or bags, our Alabama patches are designed to stand out. Let us help you create something truly unique and unforgettable!
          </p>
        )
      },
      {
        heading: "Why Choose Us As Your Custom Patch Maker in Alabama?",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Our USP is customization. With us, you can order a single patch or a 1000 customizable iron on patches and we will deliver it as per your requirements. Whether you want{" "}
            <Link href="/custom-products/keychains" className="text-purple-600 hover:underline font-medium">Custom Keychains</Link>
            , or{" "}
            <Link href="/custom-products/pvc-shoe-charms" className="text-purple-600 hover:underline font-medium">Custom PVC Shoe Charms</Link>
            , from custom woven patch to custom printed patch, we have everything that you need.
          </p>
        )
      },
      {
        heading: "Ordering Customizable Iron On Patches in Alabama Made Easy!",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Show off your Alabama pride with our premium custom patches that truly capture the spirit of the South! Featuring the iconic Alabama State Flag Patch and bold Alabama crimson tide patches, these Alabama Patches are crafted for those who demand quality and style. Perfect for customizing apparel, gear, or accessories, they let you wear your heritage with confidence. Enjoy unbeatable quality and fast shipping when you order today. Embrace true Southern pride and make your statement now. Shop now online.
          </p>
        )
      }
    ]
  };

  const sections = sectionsBySlug[slug];
  if (!sections || sections.length === 0) return null;

  return (
    <section className="py-8 md:py-10 bg-[#F9FAF5] border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-[860px] flex flex-col gap-12">
        {sections.map((section, idx) => (
          <div key={idx}>
            <div className="w-10 h-1 bg-panda-yellow mb-6 rounded-full" />
            <h2 className="text-3xl font-black text-panda-dark mb-6 leading-tight">{section.heading}</h2>
            {section.content}
          </div>
        ))}
      </div>
    </section>
  );
}
