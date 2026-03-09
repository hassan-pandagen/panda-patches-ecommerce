"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

interface QuoteModalProps {
  show: boolean;
  onClose: () => void;
  productType: string;
  width: number;
  height: number;
  quantity: number;
  backingName: string;
  basePrice: number;
  priceError?: string;
}

export default function QuoteModal({
  show,
  onClose,
  productType,
  width,
  height,
  quantity,
  backingName,
  basePrice,
  priceError,
}: QuoteModalProps) {
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [hp, setHp] = useState("");

  // Reset success state each time modal opens so form shows fresh
  useEffect(() => {
    if (show) setQuoteSubmitted(false);
  }, [show]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quoteEmail) {
      alert("Please enter your email address");
      return;
    }

    setQuoteSubmitting(true);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: hp,
          customer: {
            name: quoteEmail,
            email: quoteEmail,
            phone: quotePhone || "",
          },
          details: {
            width,
            height,
            quantity,
            backing: backingName || "Not specified",
            instructions: quoteMessage || "",
            patchType: productType,
          },
          artworkUrl: null,
          isBulkOrder: false,
          pageUrl: window.location.href,
        }),
      });

      if (response.ok) {
        setQuoteSubmitted(true);
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-11221237770/qTWjCNnZ3oEcEIqA2uYp',
            value: 50.0,
            currency: 'USD',
          });
        }
      } else {
        const data = await response.json();
        alert("Failed to send quote: " + (data.error || "Please try again"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-[24px] sm:rounded-[24px] shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-wide">Get Free Quote</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">We&apos;ll get back to you within 2 hours</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {quoteSubmitted ? (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" strokeWidth={3} />
            </div>
            <h3 className="text-xl font-black text-black mb-2">Quote Request Sent!</h3>
            <p className="text-gray-500 font-medium text-sm mb-6">
              We&apos;ve received your quote request. Our team will email you within 2 hours with the best price.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-[52px] bg-black text-panda-yellow rounded-[12px] font-black text-sm uppercase tracking-widest"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Honeypot — hidden from humans, bots fill it */}
            <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
            </div>

            {/* Patch Summary */}
            <div className="bg-gray-50 rounded-[12px] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{productType}</p>
                <p className="text-sm font-black text-black">
                  {width}&quot; × {height}&quot; · {quantity} pcs
                  {backingName ? ` · ${backingName}` : ""}
                </p>
              </div>
              {!priceError && (
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium">Est. Price</p>
                  <p className="text-lg font-black text-black">${basePrice.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-black text-black uppercase tracking-wide mb-1.5 block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={quoteEmail}
                onChange={(e) => setQuoteEmail(e.target.value)}
                className="w-full h-[52px] border-2 border-gray-300 rounded-[12px] px-4 font-bold text-base text-black outline-none focus:border-black transition-all"
                required
                autoFocus
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-black text-black uppercase tracking-wide mb-1.5 block">
                Phone Number <span className="text-gray-400 font-medium normal-case">(Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={quotePhone}
                onChange={(e) => setQuotePhone(e.target.value)}
                className="w-full h-[52px] border-2 border-gray-300 rounded-[12px] px-4 font-bold text-base text-black outline-none focus:border-black transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-black text-black uppercase tracking-wide mb-1.5 block">
                What are you making? <span className="text-gray-400 font-medium normal-case">(Optional)</span>
              </label>
              <textarea
                placeholder="e.g. Patches for our school sports team, company uniforms, custom gifts..."
                value={quoteMessage}
                onChange={(e) => setQuoteMessage(e.target.value)}
                rows={3}
                className="w-full border-2 border-gray-300 rounded-[12px] px-4 py-3 font-medium text-base text-black outline-none focus:border-black transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={quoteSubmitting}
              className="w-full h-[60px] bg-black text-panda-yellow rounded-[14px] font-black text-[15px] uppercase tracking-widest hover:scale-[1.01] transition-transform shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {quoteSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-panda-yellow"></div>
                  Sending...
                </span>
              ) : (
                "Send Quote Request"
              )}
            </button>

            <p className="text-center text-xs text-gray-400 font-medium pb-1">
              No spam. We&apos;ll only contact you about your quote.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
