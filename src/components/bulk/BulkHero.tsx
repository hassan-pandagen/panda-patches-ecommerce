import { Shield, Clock, Star, Award } from "lucide-react";

export default function BulkHero() {
  return (
    <section className="w-full pt-10 md:pt-16 pb-16 md:pb-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">

        {/* Main Content */}
        <div className="text-center max-w-[900px] mx-auto">

          {/* H1 */}
          <h1 className="text-[28px] md:text-[42px] lg:text-[52px] font-black text-panda-dark leading-[1.1] tracking-tight mb-6">
            Custom Patches at Scale —{" "}
            <span className="text-panda-green">From 50 to 50,000 Pieces</span>
          </h1>

          {/* Subheadline */}
          <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.7] font-medium mb-8 max-w-[700px] mx-auto">
            Trusted by brands, sports teams, fire departments, and Fortune 500 companies.
            2-week turnaround, no setup fees, free mockups included.
          </p>

          {/* CTA Button */}
          <a
            href="#bulk-quote"
            className="inline-block bg-panda-dark text-panda-yellow font-black text-[16px] md:text-[18px] px-10 md:px-14 py-4 md:py-5 rounded-[12px] hover:scale-[1.02] transition-transform duration-300 shadow-xl uppercase tracking-widest"
          >
            GET BULK QUOTE →
          </a>
        </div>

        {/* Trust Bar */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-[900px] mx-auto">
          {[
            { icon: Award, label: "4,000+ Bulk Orders", sub: "Delivered" },
            { icon: Shield, label: "ASI Verified", sub: "Supplier" },
            { icon: Star, label: "4.9★ Trustpilot", sub: "Rating" },
            { icon: Clock, label: "2-Week", sub: "Turnaround" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center bg-panda-light rounded-[12px] py-5 px-3 border border-gray-100"
            >
              <item.icon className="w-6 h-6 md:w-7 md:h-7 text-panda-green mb-2" strokeWidth={2.5} />
              <span className="text-[13px] md:text-[15px] font-bold text-panda-dark leading-tight">{item.label}</span>
              <span className="text-[11px] md:text-[13px] text-gray-500 font-medium">{item.sub}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
