"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "announcement_dismissed_v3";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="w-full bg-panda-dark text-white text-[13px] font-semibold py-2 px-4 flex items-center justify-center gap-3 relative">
      <span className="text-panda-yellow font-black">🛡 Money-Back Guarantee.</span>
      <span className="hidden sm:inline">Not happy? Full refund. Zero risk.</span>
      <Link href="/offers" className="underline font-black text-panda-yellow hover:opacity-80 whitespace-nowrap">
        Get a Free Quote
      </Link>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
