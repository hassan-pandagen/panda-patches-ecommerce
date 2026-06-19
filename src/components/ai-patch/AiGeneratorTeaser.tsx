"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

/**
 * Compact inline teaser for the AI Patch Generator. Dropped onto commercial
 * pages (homepage, bulk, partners, etc.) as a one-line embed:
 *
 *   <AiGeneratorTeaser />
 *
 * Visitor types an idea here, we forward them to /ai-patch-generator with
 * the prompt in the query string, and the generator auto-runs it on arrival.
 * Empty submit just opens the tool. Deliberately lightweight: no generation
 * happens on the host page, so commercial pages stay fast.
 */
export default function AiGeneratorTeaser() {
  const [idea, setIdea] = useState("");
  const router = useRouter();

  function go(e?: React.FormEvent) {
    e?.preventDefault();
    const q = idea.trim();
    router.push(
      q
        ? `/ai-patch-generator?prompt=${encodeURIComponent(q.slice(0, 300))}`
        : "/ai-patch-generator"
    );
  }

  return (
    <section className="w-full py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-6 max-w-[1100px]">
        <div className="relative overflow-hidden bg-panda-dark rounded-[24px] px-6 py-8 md:px-10 md:py-10">
          {/* soft glow accent */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-panda-yellow/10 blur-3xl pointer-events-none"
          />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
            {/* Copy */}
            <div className="lg:flex-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[2px] text-panda-yellow bg-white/10 px-3 py-1.5 rounded-full mb-3">
                ✨ New: Panda AI
              </span>
              <h2 className="text-[26px] md:text-[34px] font-black text-white leading-[1.05] tracking-tight mb-2">
                Dream it. <span className="text-panda-yellow">Patch it.</span>
              </h2>
              <p className="text-[13px] md:text-[15px] text-gray-300 leading-[1.6] max-w-[440px]">
                Type your patch idea and watch Panda AI sketch it in seconds.
                Free to try, no signup needed.
              </p>
            </div>

            {/* Mini composer */}
            <form onSubmit={go} className="lg:w-[440px] flex-shrink-0">
              <div className="flex items-center gap-2 bg-white rounded-[14px] p-2 shadow-xl">
                <input
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g. eagle scout ceremony patch, gold border"
                  maxLength={300}
                  className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-[14px] text-panda-dark outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  aria-label="Generate patch concept"
                  className="inline-flex items-center gap-1.5 bg-panda-dark text-panda-yellow font-black text-[12px] px-4 py-3 rounded-[10px] uppercase tracking-wider hover:bg-black transition-colors flex-shrink-0"
                >
                  <Sparkles size={14} />
                  <span className="hidden sm:inline">Generate</span>
                </button>
              </div>
              <Link
                href="/ai-patch-generator"
                className="inline-flex items-center gap-1 text-[12px] font-bold text-panda-yellow/90 hover:text-panda-yellow mt-2.5 transition-colors"
              >
                Or open the full AI Patch Generator <ArrowRight size={12} />
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
