import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";

async function getData() {
  const query = `*[_type == "about"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function SocialReviews() {
  const data = await getData();

  // 1. Get Image from Sanity OR use Fallback
  const imageSrc = data?.socialImage 
    ? urlFor(data.socialImage).url() 
    : "/assets/social-reviews.png"; // Fallback if you haven&apos;t uploaded yet

  return (
    <section className="w-full pt-20 pb-10 bg-[#F6F6F6]">
      <div className="container mx-auto px-4 flex flex-col items-center">
        
        {/* HEADING */}
        <h2 className="text-[40px] font-black text-panda-dark uppercase tracking-tight mb-16">
          SOCIAL REVIEWS
        </h2>

        {/* IMAGE CONTAINER */}
        <div className="relative w-full max-w-[1458px] aspect-[1458/538]">
          <Image 
            src={imageSrc} 
            alt="Social Media Reviews"
            fill
            className="object-contain"
          />
        </div>

      </div>
    </section>
  );
}
