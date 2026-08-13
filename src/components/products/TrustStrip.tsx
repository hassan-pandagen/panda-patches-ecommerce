import { BRAND_ATTRIBUTION_HEADING, BRAND_LOGOS } from "@/lib/factConstants";

export default function TrustStrip() {
  return (
    <section className="w-full py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">

        {/* HEADING */}
        <h2 className="text-[1.25rem] md:text-[1.75rem] lg:text-[2rem] font-black text-black uppercase tracking-[0.1em] md:tracking-[0.15em] mb-8">
          {BRAND_ATTRIBUTION_HEADING}
        </h2>

        {/* Mobile: 3 per row, 2 rows. Desktop: all 6 in one row. */}
        <style>{`
          .panda-trust-grid-products { display: grid; grid-template-columns: repeat(6, 1fr); column-gap: 1.5rem; row-gap: 1.5rem; }
          .panda-trust-grid-products > div { height: 3.5rem; grid-column: span 2; }
          @media (min-width: 768px) {
            .panda-trust-grid-products { column-gap: 2rem; row-gap: 2rem; }
            .panda-trust-grid-products > div { height: 4rem; grid-column: span 1; }
          }
        `}</style>
        <div className="panda-trust-grid-products w-full max-w-5xl mx-auto">
          {BRAND_LOGOS.map((logo) => (
            <div key={logo.alt} className="flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'brightness(0)' }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
