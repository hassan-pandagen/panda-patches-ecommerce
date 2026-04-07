"use client";

import { useState, useEffect } from "react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approx 600px)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <a
        href="#quote-form"
        className="flex items-center justify-center w-full bg-panda-green text-white font-black text-[16px] py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] active:opacity-90"
      >
        Get a Free Quote
      </a>
    </div>
  );
}
