import { Shield, Clock, Star, Award } from "lucide-react";
import BulkQuoteForm from "./BulkQuoteForm";

export default function BulkHero() {
  return (
    <section className="w-full pt-10 md:pt-16 pb-16 md:pb-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* LEFT - Content */}
          <div className="flex-1 text-center lg:text-left lg:pt-8">
            {/* H1 */}
            <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-black text-panda-dark leading-[1.1] tracking-tight mb-6">
              Custom Patches at Scale{" "}
              <span className="text-panda-green">From 50 to 50,000 Pieces</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[15px] md:text-[18px] text-gray-600 leading-[1.7] font-medium mb-8 max-w-[600px] mx-auto lg:mx-0">
              Trusted by brands, sports teams, fire departments, and Fortune 500 companies.
              2-week turnaround, no setup fees, free mockups included.
            </p>

            {/* Trust Bar */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-[500px] mx-auto lg:mx-0">
              {[
                { icon: Award, label: "4,000+ Bulk Orders", sub: "Delivered" },
                { icon: Shield, label: "ASI Verified", sub: "Supplier" },
                { icon: Star, label: "4.9★ Trustpilot", sub: "Rating" },
                { icon: Clock, label: "2-Week", sub: "Turnaround" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center bg-panda-light rounded-[12px] py-4 px-3 border border-gray-100"
                >
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-panda-green mb-1.5" strokeWidth={2.5} />
                  <span className="text-[12px] md:text-[14px] font-bold text-panda-dark leading-tight">{item.label}</span>
                  <span className="text-[10px] md:text-[12px] text-gray-500 font-medium">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Full Quote Form */}
          <div className="w-full lg:w-[520px] flex-shrink-0">
            <BulkQuoteForm />
          </div>

        </div>

      </div>
    </section>
  );
}
