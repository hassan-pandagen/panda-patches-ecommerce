"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "announcement_dismissed_v4";

// This bar no longer collapses on scroll. It used to, to keep the sticky header
// short (WEBSIT_1.MD T9) — but it was inside the sticky header at the time, so
// collapsing resized a sticky element mid-scroll and shunted the page up by
// 55px every time it fired. It now renders OUTSIDE the sticky header (see
// Navbar) and simply scrolls away, which meets T9 without anything moving.

export default function AnnouncementBar() {
  // Rendered VISIBLE by default so the bar ships in the server HTML and occupies
  // its height from first paint — no post-hydration insert, no layout shift.
  // (Previously this was dynamic ssr:false + visible:false→true on mount, which
  // shoved the whole page down once JS ran. Invisible on fast lab loads, but a
  // large after-paint CLS on slow mobile — the field 0.4 vs lab 0.043 gap.)
  // Returning users who dismissed it are hidden PRE-PAINT by the no-flash script
  // in layout.tsx (html.ann-dismissed #announcement-bar{display:none}); we mirror
  // that into state on mount so the scroll listener and unmount stay consistent.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("ann-dismissed")) {
      setDismissed(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode / storage disabled — bar simply re-shows next load */
    }
    // Hide via the same CSS hook the no-flash script uses, then unmount. The
    // dismiss is a user click (hadRecentInput), so its shift is excluded from CLS.
    document.documentElement.classList.add("ann-dismissed");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      id="announcement-bar"
      className={`w-full bg-panda-dark text-white text-[0.8125rem] font-semibold px-4 flex items-center justify-center gap-3 relative overflow-hidden transition-all duration-300 ease-out ${
        "py-2"
      }`}
    >
      <span className="text-panda-yellow font-black">🛡 10-Day Money-Back Guarantee.</span>
      <span className="hidden sm:inline">Save More on Bulk Orders. Free Worldwide Shipping.</span>
      {/* Relabeled: this pointed to /offers (fixed-price packages) under the label
          "Get a Free Quote", which has no quote form — mismatched destination
          (audit P3). The bar no longer collapses, so its links are always
          visible and always keyboard-focusable (WCAG 4.1.2/1.3.2). */}
      <Link
        href="/offers"
        tabIndex={0}
        className="underline font-black text-panda-yellow hover:opacity-80 whitespace-nowrap"
      >
        See Fixed-Price Offers
      </Link>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        tabIndex={0}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
