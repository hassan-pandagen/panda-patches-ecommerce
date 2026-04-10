import { Star, CheckCircle } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="w-full bg-panda-green/8 border-b border-panda-green/15 py-2 px-4">
      <div className="container mx-auto flex items-center justify-center flex-wrap gap-x-6 gap-y-1">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-panda-dark whitespace-nowrap">
          <Star className="text-panda-green w-[13px] h-[13px]" fill="currentColor" stroke="none" />
          4.8/5 on Trustpilot
        </span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-panda-dark whitespace-nowrap">
          <CheckCircle className="text-panda-green w-[13px] h-[13px]" fill="currentColor" stroke="none" />
          1,000,000+ Patches Delivered
        </span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-panda-dark whitespace-nowrap">
          <CheckCircle className="text-panda-green w-[13px] h-[13px]" fill="currentColor" stroke="none" />
          Free Mockup in 24 Hours
        </span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-panda-dark whitespace-nowrap">
          <CheckCircle className="text-panda-green w-[13px] h-[13px]" fill="currentColor" stroke="none" />
          No Minimum Orders
        </span>
      </div>
    </div>
  );
}
