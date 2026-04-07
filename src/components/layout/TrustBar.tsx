export default function TrustBar() {
  const items = [
    { label: "4.8/5 on Trustpilot", icon: "★" },
    { label: "1,000,000+ Patches Delivered", icon: "✓" },
    { label: "Free Mockup in 24 Hours", icon: "✓" },
    { label: "No Minimum Orders", icon: "✓" },
  ];

  return (
    <div className="w-full bg-panda-green/8 border-b border-panda-green/15 py-2 px-4">
      <div className="container mx-auto flex items-center justify-center flex-wrap gap-x-6 gap-y-1">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[12px] font-semibold text-panda-dark whitespace-nowrap">
            <span className="text-panda-green text-[13px]">{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
