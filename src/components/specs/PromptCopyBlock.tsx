"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface PromptCopyBlockProps {
  /** Patch type this prompt targets, e.g. "Embroidered". */
  label: string;
  /** The prompt text a customer pastes into ChatGPT/Midjourney. */
  prompt: string;
}

/**
 * Copy-paste AI prompt block (CL9F69 Workstream D). The prompt text is rendered
 * server-side so it is crawlable and citable; only the copy affordance is client
 * JS. Falls back to plain selectable text if clipboard access is unavailable.
 */
export default function PromptCopyBlock({ label, prompt }: PromptCopyBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — the text
      // stays selectable, so the user can copy manually.
    }
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="text-[11px] font-black uppercase tracking-wider text-panda-green">{label}</p>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy the ${label.toLowerCase()} design prompt`}
          className="flex items-center gap-1.5 text-[12px] font-bold text-panda-dark border border-gray-300 rounded-full px-3 py-1.5 hover:border-panda-green hover:text-panda-green transition-colors flex-shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-[13px] md:text-[14px] text-gray-700 leading-[1.7] font-medium">{prompt}</p>
    </div>
  );
}
