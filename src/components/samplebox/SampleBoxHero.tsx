import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";

async function getCtaImage() {
  const data = await client.fetch(`*[_type == "cta"][0]{ backgroundImage }`);
  return data?.backgroundImage
    ? urlFor(data.backgroundImage).width(1400).quality(80).auto('format').url()
    : null;
}

export default async function SampleBoxHero() {
  const ctaImageUrl = await getCtaImage();

  return (
    <section className="relative w-full min-h-[380px] md:min-h-[460px] flex items-center justify-center overflow-hidden">

      {/* Patches collage as full background */}
      {ctaImageUrl && (
        <Image
          src={ctaImageUrl}
          alt="Custom patches collection"
          fill
          className="object-cover object-center"
          priority
        />
      )}


      {/* Text centered on top of the image */}
      <div className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto">
        <h1 className="text-[42px] md:text-[60px] font-black uppercase tracking-tight mb-4 text-panda-dark">
          Order a Sample Box
        </h1>
        <p className="text-[17px] md:text-[20px] text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
          Order our sample box and experience the high quality of our custom products.
        </p>
        <p className="text-[22px] md:text-[24px] font-black text-panda-green mt-5">
          Get 1 Sample of Each Category • Only $45
        </p>
      </div>

    </section>
  );
}
