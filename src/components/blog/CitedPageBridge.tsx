"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BridgeConfig } from "@/lib/citedPageBridges";

/**
 * One contextual commercial bridge inside a cited blog post (CL9F69 Workstream A).
 * The <a> is server-rendered and works with JS off (crawlable, no JS-only link);
 * the onClick only adds a dataLayer `bridge_click` event for GA4 auto-collection
 * later — no GTM tag needed now.
 */
export default function CitedPageBridge({
  config,
  fromPage,
}: {
  config: BridgeConfig;
  fromPage: string;
}) {
  function track() {
    try {
      const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: "bridge_click", from_page: fromPage, to_page: config.href });
    } catch {
      // dataLayer unavailable — navigation still proceeds via the href.
    }
  }

  return (
    <aside className="my-10 rounded-2xl border-2 border-panda-green/30 bg-[#F9FAF5] px-6 py-5 md:px-8 md:py-6">
      <p className="text-[0.6875rem] font-black uppercase tracking-widest text-panda-green mb-2">
        From Panda Patches
      </p>
      <p className="text-[1.0625rem] md:text-[1.1875rem] font-bold text-panda-dark leading-snug mb-3">
        {config.offer}
      </p>
      <Link
        href={config.href}
        prefetch={false}
        onClick={track}
        className="inline-flex items-center gap-1.5 text-[0.9375rem] font-black text-panda-dark hover:text-panda-green transition-colors"
      >
        {config.ctaLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </aside>
  );
}
