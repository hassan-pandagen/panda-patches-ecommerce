"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "announcement_dismissed_v4";

// Collapse threshold (px). When the user scrolls past this, the announcement
// bar shrinks to ~0 height with overflow-hidden so the sticky header trims
// down to navbar plus trust bar only (~120px instead of ~165px). Fixes the
// excessive sticky header height called out in WEBSIT_1.MD T9.
const COLLAPSE_THRESHOLD_PX = 120;

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setCollapsed(window.scrollY > COLLAPSE_THRESHOLD_PX);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial state for users who land mid-page (anchor links, refresh after scroll).
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={`w-full bg-panda-dark text-white text-[13px] font-semibold px-4 flex items-center justify-center gap-3 relative overflow-hidden transition-all duration-300 ease-out ${
        collapsed ? "max-h-0 py-0 opacity-0" : "max-h-[60px] py-2 opacity-100"
      }`}
      aria-hidden={collapsed}
    >
      <span className="text-panda-yellow font-black">🛡 Money-Back Guarantee.</span>
      <span className="hidden sm:inline">Save More on Bulk Orders. Free Worldwide Shipping.</span>
      <Link href="/offers" className="underline font-black text-panda-yellow hover:opacity-80 whitespace-nowrap">
        Get a Free Quote
      </Link>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        tabIndex={collapsed ? -1 : 0}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
