export default function TrustStrip() {
  return (
    <section className="w-full py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">

        {/* HEADING */}
        <h2 className="text-[20px] md:text-[28px] lg:text-[32px] font-black text-black uppercase tracking-[0.1em] md:tracking-[0.15em] mb-8">
          Patches Made For Teams At
        </h2>

        {/* Brand Logos - Mobile: row 1 = Google + Microsoft, row 2 = Coca + Nissan + Wise | Desktop: 5 in 1 row */}
        <style>{`
          .panda-trust-grid-products { display: grid; grid-template-columns: repeat(6, 1fr); column-gap: 1.5rem; row-gap: 1.5rem; }
          .panda-trust-grid-products > div { height: 3.5rem; }
          .panda-trust-grid-products > div:nth-child(1), .panda-trust-grid-products > div:nth-child(2) { grid-column: span 3; }
          .panda-trust-grid-products > div:nth-child(3), .panda-trust-grid-products > div:nth-child(4), .panda-trust-grid-products > div:nth-child(5) { grid-column: span 2; }
          @media (min-width: 768px) {
            .panda-trust-grid-products { grid-template-columns: repeat(5, 1fr); column-gap: 2rem; row-gap: 2rem; }
            .panda-trust-grid-products > div { height: 4rem; }
            .panda-trust-grid-products > div:nth-child(n) { grid-column: span 1; }
          }
        `}</style>
        <div className="panda-trust-grid-products w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-center">
            <img src="/assets/logo-google.svg" alt="Google" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'brightness(0)' }} />
          </div>
          <div className="flex items-center justify-center">
            <img src="/assets/logo-microsoft.svg" alt="Microsoft" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'brightness(0)' }} />
          </div>
          <div className="flex items-center justify-center">
            <img src="/assets/logo-cocacola.svg" alt="CocaCola" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'brightness(0)' }} />
          </div>
          <div className="flex items-center justify-center">
            <img src="/assets/logo-nissan.svg" alt="Nissan" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'brightness(0)' }} />
          </div>
          <div className="flex items-center justify-center">
            <img src="/assets/logo-wise.svg" alt="Wise" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'brightness(0)' }} />
          </div>
        </div>

      </div>
    </section>
  );
}
