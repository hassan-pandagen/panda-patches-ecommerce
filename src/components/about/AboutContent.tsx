import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";

async function getData() {
  // 1. Fetch About Page Text
  // 2. Fetch Trust Badges from HERO (Reusing them!)
  const query = `
    {
      "about": *[_type == "about"][0],
      "hero": *[_type == "hero"][0]
    }
  `;
  const data = await client.fetch(query);
  return data;
}

export default async function AboutContent() {
  const { about, hero } = await getData();

  // Fallback Data for Text
  const title = about?.mainHeading || "About Us";
  const sections = about?.textSections || [
    {
      heading: "More Than Just Patches, We're Patch Partners!",
      description: "Welcome to Panda Patches, where we are more than just patch makers – we are your patch partners. For over 8 years, we have woven brand stories into the hearts of customers worldwide. Trusted by businesses, teams, and organizations, we craft top-quality custom patches that leave a lasting impression."
    },
    {
      heading: "Rooted in Expertise, Stitched with Dedication",
      description: "We proudly stand as a division of MC Patches LLC, a powerhouse in the patch industry. This legacy ensures unmatched expertise and craftsmanship in every patch we create. Our skilled artisans infuse passion into every stitch, transforming your patches into more than just fabric – they become symbols of quality and dedication."
    },
    {
      heading: "Your Brand Story Sewn to Perfection",
      description: "We're all about telling your brand's story with style! Imagine your logo or design stitched onto a patch – it's like a mini billboard that speaks volumes about your brand wherever it goes. Whether you're a business, team, or organization, our patches are the perfect way to showcase your unique identity and leave a lasting impression. Let's stitch your story together!"
    },
    {
      heading: "Fast and Flawless Patch-Making Process",
      description: "We turn your patch ideas into reality with speed and precision. From the initial design concept to the final product, our top-notch patch making services ensure your vision shines through in every stitch. Our advanced production facilities, coupled with a dedication to quality, result in patches that are second to none."
    },
    {
      heading: "Customer Satisfaction Is Our Badge Of Honor",
      description: "Customer satisfaction isn't just a goal; it's our badge of honor. We're not just in the business of creating patches; we're in the business of building relationships. From the initial inquiry to the final delivery, our friendly and knowledgeable team is dedicated to guiding you through every step of the process. Your satisfaction is our top priority, and we're here to ensure a seamless experience from start to finish."
    }
  ];

  return (
    <section className="w-full pt-16 pb-24 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center">
        
        {/* === MAIN PAGE TITLE === */}
        <h1 className="text-[32px] md:text-[70px] font-semibold text-panda-dark uppercase mb-10 tracking-tight">
          {title}
        </h1>

        {/* 
           === TRUST BADGES (REUSED FROM HERO) === 
           Now automatically pulls what you uploaded for the Home Page
        */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-20">
           {hero?.trustBadges && hero.trustBadges.map((badge: any, idx: number) => (
             <div key={idx} className="relative h-10 w-28">
               <Image 
                 src={urlFor(badge).url()} 
                 alt="Trust Badge" 
                 fill 
                 className="object-contain" 
               />
             </div>
           ))}
        </div>

        {/* === CONTENT BOX === */}
        <div className="flex flex-col gap-[50px] max-w-[1328px] text-center">
          
          {sections.map((section: any, idx: number) => (
            <div key={idx} className="space-y-4">
              
              {/* HEADING */}
              <h2 className="text-[24px] md:text-[40px] font-semibold text-panda-dark leading-tight">
                {section.heading}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-[16px] md:text-[20px] font-normal text-gray-600 leading-[1.4] max-w-[1250px] mx-auto">
                {section.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
