import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/home/CTASection";
import IronOnLayout from "@/components/assets/IronOnLayout"; 

// 1. FETCH LOGIC: Look for BOTH types
async function getData(slug: string) {
  // Validate slug format to prevent injection (alphanumeric, hyphens, and underscores only)
  if (!/^[a-z0-9-_]+$/i.test(slug)) {
    return null;
  }

  // Use parameterized query to prevent GROQ injection
  const query = `
    {
      "chart": *[_type == "assetResource" && slug.current == $slug][0],
      "iron": *[_type == "ironOn" && slug.current == $slug][0]
    }
  `;
  const data = await client.fetch(query, { slug });

  // Return whichever one was found
  return data.chart || data.iron;
}

export default async function AssetPage({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug);

  // 2. SAFETY CHECK: If nothing found
  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-black text-panda-dark">Asset Not Found</h1>
          <p className="text-gray-500">
            Looking for slug: <span className="font-mono bg-gray-100 px-2 py-1">{params.slug}</span>
          </p>
          <p className="text-sm text-gray-400">
            Make sure the Slug in Sanity matches the URL exactly.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* 3. CONDITIONAL RENDERING */}
      {data._type === 'ironOn' ? (
        
        // TYPE A: Iron On Instructions (The Zig-Zag List)
        <IronOnLayout data={data} />
      
      ) : (
        
        // TYPE B: Thread Color Chart (The Giant Image)
        <section className="w-full py-16">
          <div className="container mx-auto px-4 flex flex-col items-center">
            
            {/* Title */}
            <h1 className="text-[40px] font-black text-panda-dark uppercase mb-12 text-center tracking-tight">
              {data.title}
            </h1>

            {/* The Giant Image */}
            <div className="relative w-full max-w-[1323px] shadow-2xl rounded-[30px] overflow-hidden border border-gray-100">
              {data.image ? (
                <Image
                  src={urlFor(data.image).url()}
                  alt={data.title}
                  width={1323}
                  height={2560}
                  className="w-full h-auto object-contain"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 1323px"
                  priority
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No Image Uploaded</div>
              )}
            </div>
          </div>
        </section>

      )}

      <CTASection />
      <Footer />
    </main>
  );
}
