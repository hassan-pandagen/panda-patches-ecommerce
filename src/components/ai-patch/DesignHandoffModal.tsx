"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Sparkles, ArrowRight, CheckCircle, FileText, Zap } from "lucide-react";
import { getStoredAttribution, generateEventId } from "@/lib/clientAttribution";
import { trackAiGen } from "@/lib/aiGenAnalytics";

/**
 * WEBSIT_4.MD G6 — Conversion funnel modal.
 *
 * Opens when a visitor clicks "Use this design" on a generated patch.
 * Two intents:
 *   - "Get a free quote"  -> classic quote pipeline, mockup in 12-24h
 *   - "I'm ready to order" -> same lead, flagged READY TO ORDER for sales
 *     priority, and the success screen deep-links to the matching product
 *     page with the live calculator.
 *
 * Submit flow (2 calls):
 *   1. POST /api/ai-patch/prepare-handoff -> copies the clean PNG into the
 *      permanent customer-artwork bucket, returns the URL + patch type.
 *   2. POST /api/quote with that artworkUrl -> reuses the existing pipeline
 *      (internal email, quotes insert, Meta CAPI Lead, attribution).
 */

type Intent = "quote" | "order";

export type HandoffDesign = {
  generationId: string;
  imageUrl: string; // watermarked preview for display
  prompt: string;
  style: string;
  shape: string;
  border: string;
};

export default function DesignHandoffModal({
  design,
  generationCount,
  onClose,
}: {
  design: HandoffDesign;
  generationCount: number;
  onClose: () => void;
}) {
  const [intent, setIntent] = useState<Intent>("quote");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("50");
  const [notes, setNotes] = useState("");
  const [hearAbout, setHearAbout] = useState("");
  const [hearAboutOther, setHearAboutOther] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ productPath: string } | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const qty = Math.max(5, parseInt(quantity, 10) || 0);
    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email so we can send your mockup.");
      return;
    }

    // G9: both events fire together at form submit — handoff_submit is the
    // funnel step, email_captured is the email acquisition signal.
    trackAiGen("ai_handoff_submit", {
      style: design.style,
      shape: design.shape,
      gated: false,
      generation_count: generationCount,
      intent,
    });
    trackAiGen("email_captured", {
      style: design.style,
      shape: design.shape,
      gated: false,
      generation_count: generationCount,
    });
    setSubmitting(true);
    try {
      // Step 1: move the clean design into the permanent artwork bucket.
      const prepRes = await fetch("/api/ai-patch/prepare-handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId: design.generationId, email }),
      });
      const prep = (await prepRes.json()) as
        | { ok: true; cleanUrl: string; patchType: string; productPath: string }
        | { ok: false; error: string };
      if (!prep.ok) {
        setError(prep.error || "Could not prepare your design. Try again.");
        return;
      }

      // Step 2: submit through the standard quote pipeline.
      const instructions = [
        "Designed with Panda AI.",
        intent === "order" ? "INTENT: READY TO ORDER NOW." : "INTENT: quote first.",
        `AI prompt: "${design.prompt}"`,
        `Style: ${design.style} | Shape: ${design.shape} | Border: ${design.border}`,
        notes.trim() ? `Customer notes: ${notes.trim()}` : "",
        hearAbout ? `Source: ${hearAbout === "Other" ? (hearAboutOther.trim() || "Other") : hearAbout}` : "",
      ]
        .filter(Boolean)
        .join(" ")
        .slice(0, 2000);

      const quoteRes = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: name.trim(), email, phone },
          details: {
            width: 3,
            height: 3,
            quantity: qty,
            backing: "Iron-On",
            placement: "",
            instructions,
            patchType: prep.patchType,
          },
          artworkUrl: prep.cleanUrl,
          pageUrl:
            typeof window !== "undefined"
              ? window.location.href
              : "https://www.pandapatches.com/ai-patch-generator",
          attribution: getStoredAttribution(),
          eventId: generateEventId("lead"),
        }),
      });
      const quote = (await quoteRes.json()) as { success?: boolean; error?: string };
      if (!quoteRes.ok || quote.error) {
        setError(quote.error || "Could not send your request. Try again.");
        return;
      }

      // G9: handoff_convert — fires on successful quote submission before the
      // user is redirected or sees the success screen.
      trackAiGen("ai_handoff_convert", {
        style: design.style,
        shape: design.shape,
        gated: false,
        generation_count: generationCount,
        intent,
      });

      if (intent === "order") {
        // Ready to order: skip the success screen, go straight to the
        // product calculator. The quote email already went to the team
        // so they have the design + lead — no mockup wait needed.
        setRedirecting(true);
        router.push(`${prep.productPath}?qty=${qty}&from=ai`);
      } else {
        setSuccess({ productPath: prep.productPath });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-[10px] text-[14px] focus:border-panda-green focus:ring-2 focus:ring-panda-green/10 outline-none";
  const labelCls =
    "block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-panda-dark/60 backdrop-blur-[2px]"
      />

      <div className="relative w-full sm:max-w-[760px] bg-white rounded-t-[24px] sm:rounded-[24px] shadow-2xl max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors z-10"
        >
          <X size={17} />
        </button>

        {success ? (
          /* ============ SUCCESS ============ */
          <div className="px-6 py-12 md:px-12 text-center">
            <CheckCircle className="text-panda-green mx-auto mb-4" size={48} strokeWidth={2} />
            <h3 className="text-[24px] md:text-[28px] font-black text-panda-dark mb-2">
              Design sent to our team!
            </h3>
            <p className="text-[14px] text-gray-500 leading-[1.65] max-w-[440px] mx-auto mb-7">
              Your design is with our team. You will receive your quote
              within 24 hours.
            </p>
            {intent === "order" ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={success.productPath}
                  className="inline-flex items-center gap-2 bg-panda-dark text-panda-yellow font-black text-[13px] uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-black transition-colors"
                >
                  <Zap size={15} />
                  Order now with the live calculator
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[13px] font-bold text-gray-400 hover:text-panda-dark transition-colors"
                >
                  I will wait for the mockup
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-panda-dark text-panda-yellow font-black text-[13px] uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-black transition-colors"
              >
                Keep designing
              </button>
            )}
          </div>
        ) : (
          /* ============ FORM ============ */
          <div className="grid sm:grid-cols-[240px_1fr]">
            {/* Design preview rail */}
            <div className="hidden sm:flex flex-col bg-[#F4F6F0] p-5">
              <div className="rounded-[14px] overflow-hidden border border-gray-200 bg-white mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={design.imageUrl}
                  alt="Your AI patch design"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-[11px] text-gray-500 leading-[1.5] line-clamp-3 mb-1.5">
                {design.prompt}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-panda-green">
                {design.style} . {design.shape} . {design.border}
              </p>
              <p className="mt-auto pt-4 text-[10px] text-gray-400 leading-[1.5]">
                The clean, watermark-free file goes straight to our design team.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="text-panda-green" size={16} />
                <h3 className="text-[19px] font-black text-panda-dark leading-tight">
                  Love it? Make it real.
                </h3>
              </div>
              <p className="text-[12.5px] text-gray-500 leading-[1.55] mb-5">
                From 5 pieces. Quote within 24 hours. No setup fees.
              </p>

              {/* Intent switch */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => setIntent("quote")}
                  aria-pressed={intent === "quote"}
                  className={`flex items-start gap-2.5 text-left border-2 rounded-[14px] px-3.5 py-3 transition-all ${
                    intent === "quote"
                      ? "border-panda-green bg-panda-green/8"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FileText size={17} className="text-panda-green mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="block text-[13px] font-black text-panda-dark leading-tight">
                      Get a free quote
                    </span>
                    <span className="block text-[11px] text-gray-400 leading-[1.4] mt-0.5">
                      Price + mockup by email
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIntent("order")}
                  aria-pressed={intent === "order"}
                  className={`flex items-start gap-2.5 text-left border-2 rounded-[14px] px-3.5 py-3 transition-all ${
                    intent === "order"
                      ? "border-panda-green bg-panda-green/8"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Zap size={17} className="text-panda-green mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="block text-[13px] font-black text-panda-dark leading-tight">
                      I am ready to order
                    </span>
                    <span className="block text-[11px] text-gray-400 leading-[1.4] mt-0.5">
                      Go straight to the order form
                    </span>
                  </span>
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[12.5px] font-semibold rounded-[10px] px-3.5 py-2.5 mb-4">
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3.5 mb-3.5">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={inputCls}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={inputCls}
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className={labelCls}>Quantity (min 5) *</label>
                  <input
                    type="number"
                    min={5}
                    max={100000}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="mb-3.5">
                <label className={labelCls}>Special instructions (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="e.g. make the border gold, match Pantone 286C blue"
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="mb-5">
                <label className={labelCls}>How did you hear about us? (optional)</label>
                <select
                  value={hearAbout}
                  onChange={(e) => { setHearAbout(e.target.value); if (e.target.value !== "Other") setHearAboutOther(""); }}
                  className={inputCls}
                >
                  <option value="">Select one</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook / Instagram">Facebook / Instagram</option>
                  <option value="ChatGPT / Claude">ChatGPT / Claude</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Reddit">Reddit</option>
                  <option value="Friend / Word of mouth">Friend / Word of mouth</option>
                  <option value="Returning customer">Returning customer</option>
                  <option value="Other">Other</option>
                </select>
                {hearAbout === "Other" && (
                  <input
                    type="text"
                    value={hearAboutOther}
                    onChange={(e) => setHearAboutOther(e.target.value)}
                    placeholder="Please tell us where you heard about us"
                    className={`${inputCls} mt-2`}
                    autoFocus
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || redirecting}
                className="w-full bg-panda-dark text-panda-yellow font-black text-[14px] py-3.5 rounded-[12px] uppercase tracking-[0.08em] hover:bg-black disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                {redirecting ? (
                  "Taking you to the order form..."
                ) : submitting ? (
                  "Saving your design..."
                ) : intent === "order" ? (
                  <>
                    Start my order now <ArrowRight size={15} />
                  </>
                ) : (
                  <>
                    Send design + get my quote <ArrowRight size={15} />
                  </>
                )}
              </button>
              <p className="text-[10.5px] text-gray-400 text-center mt-2.5 leading-[1.5]">
                {intent === "order"
                  ? "Your design goes straight to the order form. No waiting."
                  : "Quote in 24 hours. No setup fees. Money-back guarantee."}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
