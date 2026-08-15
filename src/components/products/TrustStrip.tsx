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
          .panda-trust-grid-products { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; column-gap: 1.5rem; row-gap: 1.25rem; }
            /* Cells HUG their logo (flex: 0 1 auto) rather than sharing equal
               widths. With equal cells a narrow badge like Nissan floats in a wide
               box and pools extra air on both sides, so the optical gaps came out
               56/86/86/56 even though the CSS gap was uniform. Hugging makes the
               gap between INK equal to the CSS gap for every pair. */
            .panda-trust-grid-products > div { height: 3.5rem; flex: 0 1 auto; }
            .panda-trust-grid-products img { height: 100%; width: auto; max-width: 5.5rem; object-fit: contain; }
            @media (min-width: 768px) {
              .panda-trust-grid-products { column-gap: 3rem; row-gap: 1.5rem; }
              .panda-trust-grid-products > div { height: 4rem; }
              .panda-trust-grid-products img { max-width: 10rem; }
            }
          `}</style>
        <div className="panda-trust-grid-products w-full max-w-5xl mx-auto">
          {BRAND_LOGOS.map((logo) => (
            <div key={logo.alt} className="flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  filter: 'brightness(0)',
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
