import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

async function getContentData() {
  try {
    const query = `*[_type == "content"][0]`;
    const data = await client.fetch(query, {}, { next: { revalidate: 3600 } });
    return data;
  } catch (error) {
    console.error("Error fetching content data:", error);
    return null;
  }
}

export default async function ContentSection() {
  const data = await getContentData();

  // Fallback Data — single short section (no `content` doc exists in Sanity,
  // so this is what actually renders). Replaces the legacy 2023-style triple
  // keyword-filler section; routes the topical equity to the dedicated page
  // instead of repeating it here. No new factual claims.
  const sections = data?.sections || [
    {
      heading: "Custom Iron-On Patches",
      body: [
        {
          _type: "block",
          children: [
            { _type: "span", text: "Iron-on backing is available on embroidered, woven, printed and leather patches. PVC is moulded rubber and cannot take the heat press, so it ships sew-on or Velcro instead. See sizing, pricing, and application details on our dedicated ", marks: [] },
            { _type: "span", text: "custom iron-on patches page", marks: ["ironOnLink"] },
            { _type: "span", text: ".", marks: [] }
          ],
          markDefs: [
            { _key: "ironOnLink", _type: "link", href: "/custom-iron-on-patches" }
          ]
        }
      ]
    }
  ];

  return (
    <section className="w-full py-10 md:py-14 bg-white">
      <div className="container mx-auto px-4 max-w-[73.125rem]">
        
        <div className="flex flex-col gap-16 text-center">
          {sections.map((section: any, idx: number) => (
            <div key={idx} className="flex flex-col gap-6">
              
              {/* 
                 HEADING 
                 - Font: Outfit (inherited)
                 - Size: 40px
                 - Weight: Medium (500)
              */}
              <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-medium text-panda-dark leading-tight">
                {section.heading}
              </h2>

              {/* 
                 BODY TEXT
                 - Size: 16px
                 - Weight: Regular (400)
                 - Color: Gray 600
                 - Leading: Relaxed for readability
              */}
              <div className="text-[1rem] font-normal text-gray-600 leading-relaxed max-w-[68.75rem] mx-auto space-y-4">
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
