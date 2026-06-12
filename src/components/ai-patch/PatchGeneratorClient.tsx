"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  RotateCw,
  Pencil,
  Download,
  Sparkles,
  Trash2,
  ZoomIn,
  X,
} from "lucide-react";
import DesignHandoffModal, {
  type HandoffDesign,
} from "@/components/ai-patch/DesignHandoffModal";
import { trackAiGen } from "@/lib/aiGenAnalytics";

/**
 * WEBSIT_4.MD G4 — AI Patch Generator UI, v3 layout.
 *
 * Layout follows the Ideogram / Midjourney-web pattern instead of a chat
 * thread: one "command center" card at the top (prompt + design options
 * together), starter chips under it, and a results GRID that only renders
 * once at least one generation exists. This kills the three dead-space
 * problems the chat layout had: the empty 440px thread box, the empty
 * "Recent" sidebar, and the options bar stranded at the bottom.
 *
 * All generation logic is unchanged: localStorage session id, refine /
 * regenerate lineage via parentGenerationId, 30-item persistence cap.
 *
 * Still deferred (later slices): G5 email gate + budget caps, G8 account merge.
 * G6 conversion funnel: done. G9 GA4 funnel events: done.
 */

type Shape = "square" | "circle" | "shield" | "oval" | "rectangle" | "die-cut";
type Border = "merrowed" | "satin" | "none" | "raised";
type Style = "embroidered" | "chenille" | "pvc" | "woven";
type ColorBudget = "<=4" | "<=7" | "unlimited";

type Presets = {
  shape: Shape;
  border: Border;
  style: Style;
  colors: ColorBudget;
};

type Design = {
  id: string;
  prompt: string;
  presets: Presets;
  status: "loading" | "done" | "error";
  generationId?: string;
  imageUrl?: string;
  error?: string;
  parentGenerationId?: string;
  createdAt: number;
};

const DEFAULT_PRESETS: Presets = {
  shape: "circle",
  border: "merrowed",
  style: "embroidered",
  colors: "<=7",
};

const STARTERS: Array<{ label: string; prompt: string; presets: Partial<Presets> }> = [
  {
    label: "🐺 MC club wolf",
    prompt: "snarling wolf head for a motorcycle club, red and black, fierce",
    presets: { shape: "circle", style: "embroidered" },
  },
  {
    label: "🛡 Police shield",
    prompt: "police department shield with an eagle and city name banner",
    presets: { shape: "shield", style: "embroidered" },
  },
  {
    label: "🏓 Pickleball badge",
    prompt: "vintage pickleball club badge, retro 70s colors, crossed paddles",
    presets: { shape: "circle", style: "embroidered" },
  },
  {
    label: "🐼 Panda mascot",
    prompt: "cartoon panda mascot wearing sunglasses, bold and friendly",
    presets: { shape: "die-cut", style: "embroidered" },
  },
  {
    label: "💀 Tactical morale",
    prompt: "tactical morale patch, skull with crossed rifles, subdued green and tan",
    presets: { shape: "rectangle", style: "pvc" },
  },
  {
    label: "⛰ Scout patrol",
    prompt: "scout troop patrol patch, mountain peak and pine trees, outdoorsy",
    presets: { shape: "circle", style: "embroidered" },
  },
];

const SHAPES: Shape[] = ["circle", "square", "shield", "oval", "rectangle", "die-cut"];

const STYLES: Array<{ id: Style; label: string; hint: string }> = [
  { id: "embroidered", label: "Embroidered", hint: "Classic stitched thread" },
  { id: "chenille", label: "Chenille", hint: "Fuzzy varsity texture" },
  { id: "pvc", label: "PVC", hint: "Glossy 3D rubber" },
  { id: "woven", label: "Woven", hint: "Fine flat detail" },
];

const BORDERS_THREAD: Array<{ id: Border; label: string }> = [
  { id: "merrowed", label: "Merrowed" },
  { id: "satin", label: "Satin" },
  { id: "none", label: "None" },
];

const BORDERS_PVC: Array<{ id: Border; label: string }> = [
  { id: "raised", label: "Raised edge" },
  { id: "none", label: "None" },
];

const COLORS: Array<{ id: ColorBudget; label: string }> = [
  { id: "<=4", label: "Up to 4" },
  { id: "<=7", label: "Up to 7" },
  { id: "unlimited", label: "Full color" },
];

const LOADING_TIPS = [
  "Bold simple shapes embroider best.",
  "Fewer than 7 thread colors keeps stitches clean.",
  "Round shapes minimize border waste.",
  "Mention the use case (jacket, hat, vest) for better results.",
  "Thick merrowed borders give the classic patch look.",
];

const STORAGE_KEY_SESSION = "ai_patch_session_id_v1";
const STORAGE_KEY_DESIGNS = "ai_patch_designs_v2";

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

function loadSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const existing = window.localStorage.getItem(STORAGE_KEY_SESSION);
  if (existing) return existing;
  const fresh = `s_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  window.localStorage.setItem(STORAGE_KEY_SESSION, fresh);
  return fresh;
}

function loadDesigns(): Design[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_DESIGNS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Only completed designs survive a refresh; in-flight ones are gone anyway.
    return parsed.filter((d: Design) => d.status === "done" && d.imageUrl);
  } catch {
    return [];
  }
}

function saveDesigns(designs: Design[]): void {
  if (typeof window === "undefined") return;
  const done = designs.filter((d) => d.status === "done").slice(0, 30);
  try {
    window.localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify(done));
  } catch {
    // Quota hit — drop the oldest half and try once more.
    try {
      window.localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify(done.slice(0, 12)));
    } catch {
      // Give up silently; refresh starts fresh.
    }
  }
}

export default function PatchGeneratorClient() {
  const [sessionId, setSessionId] = useState<string>("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [input, setInput] = useState("");
  const [presets, setPresets] = useState<Presets>(DEFAULT_PRESETS);
  const [tipIndex, setTipIndex] = useState(0);
  const [handoff, setHandoff] = useState<HandoffDesign | null>(null);
  const [lightbox, setLightbox] = useState<Design | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  // Ref mirror of sessionId so the mount-time auto-run below can call
  // runGeneration before the state value has propagated.
  const sessionIdRef = useRef<string>("");
  const autoRanRef = useRef(false);

  const isGenerating = useMemo(
    () => designs.some((d) => d.status === "loading"),
    [designs]
  );

  useEffect(() => {
    const sid = loadSessionId();
    sessionIdRef.current = sid;
    setSessionId(sid);
    setDesigns(loadDesigns());

    // Teaser handoff: other pages link here as /ai-patch-generator?prompt=...
    // If present, fire the generation immediately so the visitor lands on a
    // result already in flight (the magic-moment funnel), then strip the
    // param so refresh / share does not re-trigger it.
    if (!autoRanRef.current && typeof window !== "undefined") {
      const fromQuery = new URLSearchParams(window.location.search).get("prompt");
      const prompt = (fromQuery || "").trim().slice(0, 600);
      if (prompt) {
        autoRanRef.current = true;
        window.history.replaceState({}, "", window.location.pathname);
        void runGeneration({ prompt, presets: DEFAULT_PRESETS });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveDesigns(designs);
  }, [designs]);

  useEffect(() => {
    if (!isGenerating) return;
    const id = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % LOADING_TIPS.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [isGenerating]);

  const canSubmit = input.trim().length > 0 && !isGenerating && sessionId.length > 0;

  async function runGeneration(opts: {
    prompt: string;
    presets: Presets;
    parentGenerationId?: string;
  }): Promise<void> {
    const designId = uid("d");
    const doneAtStart = designs.filter((d) => d.status === "done").length;
    // G9: funnel start — fires before the API call so we capture intent even if
    // the network request fails or the user closes the tab mid-generation.
    trackAiGen("ai_generate_start", {
      style: opts.presets.style,
      shape: opts.presets.shape,
      gated: false,
      generation_count: doneAtStart,
    });
    const pending: Design = {
      id: designId,
      prompt: opts.prompt,
      presets: opts.presets,
      status: "loading",
      parentGenerationId: opts.parentGenerationId,
      createdAt: Date.now(),
    };
    // Newest first so the loading card appears at the top of the grid.
    setDesigns((prev) => [pending, ...prev]);

    // Bring the new loading card into view right after it mounts.
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 60);

    try {
      const res = await fetch("/api/ai-patch/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Ref first: mount-time auto-run fires before state propagates.
          sessionId: sessionIdRef.current || sessionId,
          prompt: opts.prompt,
          presets: opts.presets,
          parentGenerationId: opts.parentGenerationId,
        }),
      });
      const data = (await res.json()) as
        | { ok: true; generationId: string; imageUrl: string }
        | { ok: false; error: string };

      if (data.ok) {
        // G9: successful generation
        trackAiGen("ai_generate_complete", {
          style: opts.presets.style,
          shape: opts.presets.shape,
          gated: false,
          generation_count: doneAtStart + 1,
        });
      } else if (res.status === 422) {
        // G9: blocklist rejection — fires only for the guardrail 422, not
        // general server errors, so the metric accurately tracks policy blocks.
        trackAiGen("ai_generate_blocked", {
          style: opts.presets.style,
          shape: opts.presets.shape,
          gated: false,
          generation_count: doneAtStart,
          blocked_reason: data.error,
        });
      }

      setDesigns((prev) =>
        prev.map((d) =>
          d.id !== designId
            ? d
            : data.ok
              ? {
                  ...d,
                  status: "done",
                  generationId: data.generationId,
                  imageUrl: data.imageUrl,
                }
              : {
                  ...d,
                  status: "error",
                  error: data.error || "Generation failed. Try a different prompt.",
                }
        )
      );
    } catch (err) {
      setDesigns((prev) =>
        prev.map((d) =>
          d.id !== designId
            ? d
            : {
                ...d,
                status: "error",
                error: err instanceof Error ? err.message : "Network error. Try again.",
              }
        )
      );
    }
  }

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSubmit) return;
    const prompt = input.trim();
    setInput("");
    void runGeneration({ prompt, presets });
  }

  function onStarter(s: (typeof STARTERS)[number]) {
    if (isGenerating) return;
    const merged: Presets = { ...presets, ...s.presets };
    setPresets(merged);
    void runGeneration({ prompt: s.prompt, presets: merged });
  }

  function onRegenerate(design: Design) {
    if (isGenerating) return;
    void runGeneration({
      prompt: design.prompt,
      presets: design.presets,
      parentGenerationId: design.generationId,
    });
  }

  function onRefine(design: Design) {
    setInput(design.prompt);
    setPresets(design.presets);
    textareaRef.current?.focus();
    textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function onRetry(design: Design) {
    if (isGenerating) return;
    setDesigns((prev) => prev.filter((d) => d.id !== design.id));
    void runGeneration({ prompt: design.prompt, presets: design.presets });
  }

  function onClearAll() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY_DESIGNS);
    }
    setDesigns([]);
  }

  const doneCount = designs.filter((d) => d.status === "done").length;

  return (
    <div className="max-w-[880px] mx-auto">
      {/* ============ COMMAND CENTER: prompt + options in ONE card ============ */}
      <form
        onSubmit={onSubmit}
        className="bg-white border-2 border-gray-200 focus-within:border-panda-green rounded-[22px] shadow-[0_10px_40px_rgba(5,28,5,0.07)] transition-colors overflow-hidden"
      >
        {/* Prompt row */}
        <div className="flex items-end gap-3 px-5 pt-4 pb-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="Describe your patch. e.g. snarling wolf head for a motorcycle club, red and black"
            rows={2}
            className="flex-1 resize-none bg-transparent text-[15px] leading-[1.5] outline-none placeholder:text-gray-400 pt-1"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 bg-panda-dark text-panda-yellow font-black text-[13px] px-5 py-3 rounded-[12px] uppercase tracking-wider hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Sparkles size={15} />
            Generate
          </button>
        </div>

        {/* Options row — attached, not a floating bar */}
        <div className="border-t border-gray-100 bg-[#FBFCF8] px-5 py-3.5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {/* Shape */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[1.2px]">
                Shape
              </span>
              <div className="flex gap-1">
                {SHAPES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPresets({ ...presets, shape: s })}
                    title={s}
                    aria-label={`${s} shape`}
                    aria-pressed={presets.shape === s}
                    className={`w-9 h-9 rounded-[9px] border flex items-center justify-center transition-all ${
                      presets.shape === s
                        ? "border-panda-green bg-panda-green/12"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <ShapeIcon shape={s} active={presets.shape === s} />
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[1.2px]">
                Style
              </span>
              <Segmented
                options={STYLES.map((st) => ({ id: st.id, label: st.label, title: st.hint }))}
                value={presets.style}
                onChange={(v) => {
                  const newStyle = v as Style;
                  // Auto-fix border when switching to/from PVC.
                  let newBorder = presets.border;
                  if (newStyle === "pvc" && (newBorder === "merrowed" || newBorder === "satin")) {
                    newBorder = "raised";
                  } else if (newStyle !== "pvc" && newBorder === "raised") {
                    newBorder = "merrowed";
                  }
                  setPresets({ ...presets, style: newStyle, border: newBorder });
                }}
              />
            </div>

            {/* Border */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[1.2px]">
                Border
              </span>
              <Segmented
                options={presets.style === "pvc" ? BORDERS_PVC : BORDERS_THREAD}
                value={presets.border}
                onChange={(v) => setPresets({ ...presets, border: v as Border })}
              />
            </div>

            {/* Colors */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[1.2px]">
                Colors
              </span>
              <Segmented
                options={COLORS}
                value={presets.colors}
                onChange={(v) => setPresets({ ...presets, colors: v as ColorBudget })}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Starter chips — one tidy row under the composer */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span className="text-[11px] font-black text-gray-400 uppercase tracking-[1.5px] mr-1">
          Try:
        </span>
        {STARTERS.map((s) => (
          <button
            key={s.label}
            type="button"
            disabled={isGenerating}
            onClick={() => onStarter(s)}
            title={s.prompt}
            className="text-[12px] font-bold text-panda-dark bg-white border border-gray-200 rounded-full px-3.5 py-1.5 hover:border-panda-green hover:bg-panda-green/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mt-3 text-center leading-[1.5]">
        AI concept preview. Our designers refine your final patch and send a production mockup for approval before anything is made.
      </p>

      {/* ===================== RESULTS GRID (only when content exists) ===================== */}
      {designs.length > 0 && (
        <div ref={resultsRef} className="mt-10 scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-black text-panda-dark uppercase tracking-wider">
              Your designs{doneCount > 0 ? ` (${doneCount})` : ""}
            </h2>
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={13} />
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {designs.map((d) =>
              d.status === "loading" ? (
                <LoadingCard key={d.id} prompt={d.prompt} tip={LOADING_TIPS[tipIndex]} />
              ) : d.status === "error" ? (
                <ErrorCard key={d.id} design={d} onRetry={() => onRetry(d)} />
              ) : (
                <DesignCard
                  key={d.id}
                  design={d}
                  busy={isGenerating}
                  onRefine={() => onRefine(d)}
                  onRegenerate={() => onRegenerate(d)}
                  onZoom={() => setLightbox(d)}
                  onUseDesign={() => {
                    trackAiGen("ai_handoff_open", {
                      style: d.presets.style,
                      shape: d.presets.shape,
                      gated: false,
                      generation_count: doneCount,
                    });
                    setHandoff({
                      generationId: d.generationId!,
                      imageUrl: d.imageUrl!,
                      prompt: d.prompt,
                      style: d.presets.style,
                      shape: d.presets.shape,
                      border: d.presets.border,
                    });
                  }}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* G6 conversion funnel: order-now / quote-first modal */}
      {handoff && (
        <DesignHandoffModal
          design={handoff}
          generationCount={doneCount}
          onClose={() => setHandoff(null)}
        />
      )}

      {/* Lightbox — full-size image preview */}
      {lightbox && (
        <Lightbox
          design={lightbox}
          onClose={() => setLightbox(null)}
          onUseDesign={() => {
            trackAiGen("ai_handoff_open", {
              style: lightbox.presets.style,
              shape: lightbox.presets.shape,
              gated: false,
              generation_count: doneCount,
            });
            setLightbox(null);
            setHandoff({
              generationId: lightbox.generationId!,
              imageUrl: lightbox.imageUrl!,
              prompt: lightbox.prompt,
              style: lightbox.presets.style,
              shape: lightbox.presets.shape,
              border: lightbox.presets.border,
            });
          }}
        />
      )}
    </div>
  );
}

/* ============================== CONTROLS ============================== */

function Segmented({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: string; label: string; title?: string }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex bg-white border border-gray-200 rounded-[10px] p-0.5 gap-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          title={o.title}
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`text-[11.5px] font-bold px-2.5 py-1.5 rounded-[8px] whitespace-nowrap transition-colors ${
            value === o.id
              ? "bg-panda-dark text-panda-yellow"
              : "text-gray-500 hover:text-panda-dark hover:bg-gray-50"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ShapeIcon({ shape, active }: { shape: Shape; active: boolean }) {
  const stroke = active ? "#3B7E00" : "#6B7280";
  const fill = active ? "#3B7E0022" : "none";
  const props = { stroke, fill, strokeWidth: 2 };
  switch (shape) {
    case "circle":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" {...props} />
        </svg>
      );
    case "square":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" {...props} />
        </svg>
      );
    case "shield":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" {...props} />
        </svg>
      );
    case "oval":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <ellipse cx="12" cy="12" rx="9" ry="6.5" {...props} />
        </svg>
      );
    case "rectangle":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <rect x="3" y="7" width="18" height="10" rx="2" {...props} />
        </svg>
      );
    case "die-cut":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M12 3l2.2 4.6 5 .7-3.6 3.6.9 5L12 14.6 7.5 17l.9-5L4.8 8.3l5-.7z"
            {...props}
          />
        </svg>
      );
  }
}

/* ============================== CARDS ============================== */

function DesignCard({
  design,
  busy,
  onRefine,
  onRegenerate,
  onZoom,
  onUseDesign,
}: {
  design: Design;
  busy: boolean;
  onRefine: () => void;
  onRegenerate: () => void;
  onZoom: () => void;
  onUseDesign: () => void;
}) {
  return (
    <article className="bg-white border border-gray-200 rounded-[18px] overflow-hidden hover:shadow-[0_8px_28px_rgba(5,28,5,0.08)] transition-shadow">
      <button
        type="button"
        onClick={onZoom}
        className="group relative w-full aspect-square bg-[#F4F6F0] block overflow-hidden"
        aria-label="View full size"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={design.imageUrl}
          alt={`AI patch concept: ${design.prompt.slice(0, 60)}`}
          width={512}
          height={512}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/50 backdrop-blur-[2px] text-white rounded-full p-3">
            <ZoomIn size={20} />
          </span>
        </span>
      </button>
      <div className="p-3.5">
        <p className="text-[12.5px] text-gray-700 leading-[1.45] line-clamp-2 mb-1.5">
          {design.prompt}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-panda-green mb-3">
          {design.presets.style} . {design.presets.shape} . {design.presets.border}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <IconAction onClick={onRefine} icon={<Pencil size={12} />} label="Refine" />
          <IconAction
            onClick={onRegenerate}
            icon={<RotateCw size={12} />}
            label="Redo"
            disabled={busy}
          />
          <a
            href={design.imageUrl}
            download
            title="Download preview"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-panda-dark hover:border-panda-green transition-colors"
          >
            <Download size={13} />
          </a>
          <button
            type="button"
            onClick={onUseDesign}
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-black text-panda-dark uppercase tracking-wider px-3 py-2 rounded-full bg-panda-yellow hover:bg-yellow-300 transition-colors"
          >
            Use this design <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </article>
  );
}

function IconAction({
  onClick,
  icon,
  label,
  disabled,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="inline-flex items-center gap-1 text-[11px] font-bold text-panda-dark px-2.5 py-2 rounded-full bg-white border border-gray-200 hover:border-panda-green disabled:opacity-40 transition-colors"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function LoadingCard({ prompt, tip }: { prompt: string; tip: string }) {
  return (
    <article className="bg-white border border-gray-200 rounded-[18px] overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-[#F4F6F0] to-[#E9EFE2] flex flex-col items-center justify-center px-6 text-center">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-panda-green animate-bounce" />
          <span
            className="h-2.5 w-2.5 rounded-full bg-panda-green animate-bounce"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full bg-panda-green animate-bounce"
            style={{ animationDelay: "240ms" }}
          />
        </div>
        <p className="text-[13px] font-black text-panda-dark mb-1">
          Designing your patch...
        </p>
        <p className="text-[11px] text-gray-500 leading-[1.5]">Tip: {tip}</p>
      </div>
      <div className="p-3.5">
        <p className="text-[12.5px] text-gray-400 leading-[1.45] line-clamp-2">{prompt}</p>
      </div>
    </article>
  );
}

function Lightbox({
  design,
  onClose,
  onUseDesign,
}: {
  design: Design;
  onClose: () => void;
  onUseDesign: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Design preview"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-[4px]"
      />

      <div className="relative max-w-[640px] w-full">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div className="rounded-[20px] overflow-hidden shadow-2xl bg-[#F4F6F0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={design.imageUrl}
            alt={`AI patch concept: ${design.prompt.slice(0, 80)}`}
            width={1024}
            height={1024}
            className="w-full h-auto"
          />
        </div>

        {/* Info strip */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-white/90 leading-[1.45] line-clamp-2">
              {design.prompt}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-panda-yellow/80 mt-0.5">
              {design.presets.style} . {design.presets.shape} . {design.presets.border}
            </p>
          </div>
          <button
            type="button"
            onClick={onUseDesign}
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-panda-yellow text-panda-dark font-black text-[12px] uppercase tracking-wider px-4 py-2.5 rounded-full hover:bg-yellow-300 transition-colors"
          >
            Use this design <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ design, onRetry }: { design: Design; onRetry: () => void }) {
  return (
    <article className="bg-white border border-red-200 rounded-[18px] overflow-hidden">
      <div className="aspect-square bg-red-50/60 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[13px] font-black text-red-700 mb-1.5">Generation failed</p>
        <p className="text-[11px] text-red-600/80 leading-[1.5] mb-4 line-clamp-3">
          {design.error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 text-[11px] font-black text-white uppercase tracking-wider px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
        >
          <RotateCw size={12} /> Try again
        </button>
      </div>
      <div className="p-3.5">
        <p className="text-[12.5px] text-gray-400 leading-[1.45] line-clamp-2">
          {design.prompt}
        </p>
      </div>
    </article>
  );
}
