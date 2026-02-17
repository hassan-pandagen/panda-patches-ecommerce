import { client } from "@/lib/sanity";
import ProcessInteractive from "./ProcessInteractive";

async function getProcessData() {
  const query = `*[_type == "process"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function ProcessSection() {
  const data = await getProcessData();

  if (!data) return null; // Don't crash if no data

  return (
    <section className="w-full py-24 bg-[#F9FAF5]">
      <div className="container mx-auto px-4 text-center">
        
        {/* HEADINGS */}
        <div className="mb-16 space-y-6">
          <h2 className="text-[26px] md:text-[40px] font-black text-panda-dark uppercase tracking-tight leading-tight">
            {data.heading}
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            {data.subheading}
          </p>
        </div>

        {/* INTERACTIVE COMPONENT */}
        <ProcessInteractive data={data} />

      </div>
    </section>
  );
}
