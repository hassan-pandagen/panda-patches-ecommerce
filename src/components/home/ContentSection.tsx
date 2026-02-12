import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

async function getContentData() {
  try {
    const query = `*[_type == "content"][0]`;
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Error fetching content data:", error);
    return null;
  }
}

export default async function ContentSection() {
  const data = await getContentData();

  // Fallback Data (Matches your Figma Screenshot)
  const sections = data?.sections || [
    {
      heading: "Delivering Personalized Iron On Patches Around the US",
      body: [
        {
          _type: "block",
          children: [
            { _type: "span", text: "If you are looking for Personalized Iron On Patches of top notch quality in the US, then you are at the right place. At Panda Patches, quality is our USP, and customer satisfaction has been our top priority from the beginning. As we say \"a happy customer is worth every Patch\"." }
          ]
        },
        {
          _type: "block",
          children: [
            { _type: "span", text: "From guiding our customers to delivering the top notch product at your door step, Panda Patches has got you covered. Whether it is a Custom Embroidered Patch, a Custom PVC Patch, or personalized patches for jackets, we ensure the best quality patches in the US." }
          ]
        }
      ]
    },
    {
      heading: "Get Your Favorite Iron On Patches In The US",
      body: [
        {
          _type: "block",
          children: [
            { _type: "span", text: "Panda Patches is a leading provider of high-quality, personalized iron on patches in the United States. Known for our craftsmanship and attention to detail, we specialize in creating bespoke iron on patches that add a unique touch to any garment or accessory." }
          ]
        }
      ]
    },
    {
      heading: "Looking For Iron On Patches In The US?",
      body: [
        {
          _type: "block",
          children: [
            { _type: "span", text: "We pride ourselves on offering the best iron on patches in the US that are tailor made to your specifications. Our design team works closely with clients to bring their visions to life, creating unique pieces that stand out." }
          ]
        }
      ]
    }
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 max-w-[1170px]">
        
        <div className="flex flex-col gap-16 text-center">
          {sections.map((section: any, idx: number) => (
            <div key={idx} className="flex flex-col gap-6">
              
              {/* 
                 HEADING 
                 - Font: Outfit (inherited)
                 - Size: 40px
                 - Weight: Medium (500)
              */}
              <h2 className="text-[24px] md:text-[32px] lg:text-[40px] font-medium text-panda-dark leading-tight">
                {section.heading}
              </h2>

              {/* 
                 BODY TEXT
                 - Size: 16px
                 - Weight: Regular (400)
                 - Color: Gray 600
                 - Leading: Relaxed for readability
              */}
              <div className="text-[16px] font-normal text-gray-600 leading-relaxed max-w-[1100px] mx-auto space-y-4">
                {/* PortableText handles paragraphs and links automatically */}
                <PortableText 
                  value={section.body} 
                  components={{
                    marks: {
                      link: ({children, value}: any) => (
                        <a 
                          href={value.href} 
                          className="text-blue-600 underline hover:text-blue-800 transition-colors"
                          target={value.blank ? "_blank" : undefined}
                          rel={value.blank ? "noopener noreferrer" : undefined}
                        >
                          {children}
                        </a>
                      )
                    }
                  }}
                />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
