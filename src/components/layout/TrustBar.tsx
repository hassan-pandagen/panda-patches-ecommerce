import { Star, CheckCircle } from "lucide-react";

export default function TrustBar() {
  const items = [
    { label: "4.8/5 on Trustpilot", Icon: Star },
    { label: "1,000,000+ Patches Delivered", Icon: CheckCircle },
    { label: "Free Mockup in 24 Hours", Icon: CheckCircle },
    { label: "No Minimum Orders", Icon: CheckCircle },
  ];

  return (
    <div className="w-full bg-panda-green/8 border-b border-panda-green/15 py-2 px-4">
      <div className="container mx-auto flex items-center justify-center flex-wrap gap-x-6 gap-y-1">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[12px] font-semibold text-panda-dark whitespace-nowrap">
            <item.Icon className="text-panda-green w-[13px] h-[13px]" fill="currentColor" stroke="none" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
