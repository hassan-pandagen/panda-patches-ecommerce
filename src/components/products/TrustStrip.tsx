import Image from "next/image";

export default function TrustStrip() {
  return (
    <section className="w-full py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">

        {/* HEADING */}
        <h2 className="text-[20px] md:text-[28px] lg:text-[32px] font-black text-black uppercase tracking-[0.1em] md:tracking-[0.15em] mb-8">
          Trusted By Global Brands
        </h2>

        {/* Brand Logos - 2x2 on Mobile, Single Row on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-14 md:h-16">
            <Image src="/assets/logo-google.svg" alt="Google" width={110} height={50} className="object-contain brightness-0" />
          </div>
          <div className="flex items-center justify-center h-14 md:h-16">
            <Image src="/assets/logo-microsoft.svg" alt="Microsoft" width={130} height={50} className="object-contain brightness-0" />
          </div>
          <div className="flex items-center justify-center h-14 md:h-16">
            <Image src="/assets/logo-cocacola.svg" alt="CocaCola" width={120} height={50} className="object-contain brightness-0" />
          </div>
          <div className="flex items-center justify-center h-14 md:h-16">
            <Image src="/assets/logo-nissan.svg" alt="Nissan" width={100} height={50} className="object-contain brightness-0" />
          </div>
        </div>

      </div>
    </section>
  );
}
