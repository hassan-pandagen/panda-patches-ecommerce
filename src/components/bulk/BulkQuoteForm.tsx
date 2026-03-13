"use client";

import { useForm } from "react-hook-form";
import { UploadCloud, CheckCircle, Phone, Clock, ShieldCheck, Check } from "lucide-react";
import { useState, useRef } from "react";
import { sanitizeString, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";

export default function BulkQuoteForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const partialSaved = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Artwork upload state — up to 2 files
  const [uploadedFiles, setUploadedFiles] = useState<{name: string; url: string}[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (uploadedFiles.length >= 2) return;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;

    setUploading(true);

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const fileExt = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const timestamp = Date.now();
      const fileName = `artwork-${randomId}-${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("order-attachments")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("order-attachments")
          .getPublicUrl(fileName);
        setUploadedFiles(prev => [...prev, { name: file.name, url: publicUrlData?.publicUrl || "" }]);
      } else {
        console.error("Artwork upload failed:", uploadError);
      }
    } catch (uploadErr) {
      console.error("Artwork upload exception:", uploadErr);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    if (partialSaved.current || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    partialSaved.current = true;
    const name = (document.querySelector('input[name="name"]') as HTMLInputElement)?.value || '';
    const phone = (document.querySelector('input[name="phone"]') as HTMLInputElement)?.value || '';
    fetch('/api/partial-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, name, source: 'BULK_FORM_PARTIAL' }),
    }).catch(() => {});
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: data.website || '',
          customer: {
            name: sanitizeString(data.name),
            email: sanitizeEmail(data.email),
            phone: sanitizePhone(data.phone || ""),
          },
          details: {
            quantity: parseInt(data.quantityRange?.split("-")[0] || "100"),
            width: parseFloat(data.size?.toLowerCase().split(/\s*x\s*/i)[0]) || 3,
            height: parseFloat(data.size?.toLowerCase().split(/\s*x\s*/i)[1]) || 3,
            backing: sanitizeString(data.backing || "iron"),
            instructions: sanitizeString(
              `[BULK ORDER] Company: ${data.company || "N/A"} | Qty Range: ${data.quantityRange || "N/A"} | Patch Type: ${data.patchType || "N/A"} | Size: ${data.size || "N/A"} | Needed By: ${data.neededBy || "N/A"} | Budget: ${data.budget || "N/A"} | Notes: ${data.notes || "None"}`
            ),
            patchType: sanitizeString(data.patchType || ""),
          },
          artworkUrl: uploadedFiles[0]?.url || null,
          artworkUrl2: uploadedFiles[1]?.url || null,
          isBulkOrder: true,
          pageUrl: window.location.href,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit quote");

      // Google Ads conversion already fires below via existing gtag call
      // Facebook Pixel — Lead event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", { value: 50.0, currency: "USD" });
      }

      setMessage({ type: "success", text: "Quote submitted! We'll respond within 2 business hours with your free mockup." });
      setUploadedFiles([]);
      reset();

      // Fire Google Ads quote form conversion
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-11221237770/qTWjCNnZ3oEcEIqA2uYp",
        });
      }
    } catch (error) {
      console.error("Bulk quote error:", error);
      setMessage({ type: "error", text: "Failed to submit. Please try again or call us at (302) 250-4340." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="bulk-quote" className="bg-white border-[3px] border-gray-200 rounded-[20px] px-6 md:px-8 py-7 md:py-8 shadow-2xl">

      {message?.type === "success" ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-[22px] font-black text-panda-dark mb-2">Quote Request Sent!</h3>
          <p className="text-gray-500 font-medium text-[14px] mb-6">
            We&apos;ve received your bulk quote request. Our team will respond within 2 business hours with your free mockup.
          </p>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="bg-panda-dark text-panda-yellow font-bold px-8 py-3 rounded-[10px] hover:scale-105 transition-transform uppercase tracking-wider text-[14px]"
          >
            Submit Another Quote
          </button>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Phone className="w-3.5 h-3.5 text-panda-green" />
            <span className="text-[12px] text-gray-500 font-medium">Need it faster? Call (302) 250-4340</span>
          </div>
        </div>
      ) : (
      <>

      {/* Honeypot — hidden from humans, bots fill it */}
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input type="text" {...register("website")} tabIndex={-1} autoComplete="off" />
      </div>

      {/* Header */}
      <div className="text-center mb-5">
        <h3 className="text-[22px] md:text-[24px] font-black text-panda-dark uppercase tracking-tight leading-tight">
          Get Your Free Bulk Quote
        </h3>
        <p className="text-[12px] md:text-[13px] text-gray-500 font-medium mt-1.5">
          Free mockup included. We respond within 2 hours.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>

        {/* Error */}
        {message?.type === "error" && (
          <div className="p-3 rounded-[10px] text-[13px] font-semibold flex items-center gap-2 bg-red-50 text-red-700 border border-red-200">
            {message.text}
          </div>
        )}

        {/* Row 1: Name + Company */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Your Name *"
              className={`bulk-field ${errors.name ? 'border-red-400 bg-red-50' : ''}`}
              autoComplete="name"
            />
            {errors.name && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.name.message)}</p>}
          </div>
          <input
            {...register("company")}
            placeholder="Company Name"
            className="bulk-field"
            autoComplete="organization"
          />
        </div>

        {/* Row 2: Email + Phone */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email Address *"
              className={`bulk-field ${errors.email ? 'border-red-400 bg-red-50' : ''}`}
              autoComplete="email"
              onBlur={handleEmailBlur}
            />
            {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.email.message)}</p>}
          </div>
          <div>
            <input
              {...register("phone", { required: "Phone is required" })}
              placeholder="Phone Number *"
              className={`bulk-field ${errors.phone ? 'border-red-400 bg-red-50' : ''}`}
              autoComplete="tel"
            />
            {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.phone.message)}</p>}
          </div>
        </div>

        {/* Row 3: Patch Type + Quantity */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <select {...register("patchType")} defaultValue="" className="bulk-field appearance-none cursor-pointer pr-8 text-gray-500">
              <option value="" disabled hidden>Patch Type</option>
              <option value="embroidered">Embroidered</option>
              <option value="3d-embroidered">3D Embroidered Transfers</option>
              <option value="chenille">Chenille</option>
              <option value="printed">Printed</option>
              <option value="pvc">PVC</option>
              <option value="woven">Woven</option>
              <option value="leather">Leather</option>
              <option value="silicone">Silicone Labels</option>
              <option value="sequin">Sequin</option>
              <option value="chenille-tpu">Chenille TPU</option>
              <option value="chenille-glitter">Chenille Glitter</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">&#9660;</div>
          </div>

          <div className="relative">
            <select {...register("quantityRange")} defaultValue="" className="bulk-field appearance-none cursor-pointer pr-8 text-gray-500">
              <option value="" disabled hidden>Quantity Range</option>
              <option value="50-99">50 - 99 pieces</option>
              <option value="100-299">100 - 299 pieces</option>
              <option value="300-499">300 - 499 pieces</option>
              <option value="500-999">500 - 999 pieces</option>
              <option value="1000-4999">1,000 - 4,999 pieces</option>
              <option value="5000+">5,000+ pieces</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">&#9660;</div>
          </div>
        </div>

        {/* Row 4: Size + Backing */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <input
              {...register("size", { required: "Size is required" })}
              placeholder="Size (e.g. 4 x 3 inches) *"
              className={`bulk-field ${errors.size ? 'border-red-400 bg-red-50' : ''}`}
            />
            {errors.size && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.size.message)}</p>}
          </div>

          <div className="relative">
            <select {...register("backing")} defaultValue="" className="bulk-field appearance-none cursor-pointer pr-8 text-gray-500">
              <option value="" disabled hidden>Backing Type</option>
              <option value="iron">Iron-On</option>
              <option value="velcro">Velcro (Hook & Loop)</option>
              <option value="sew">Sew-On</option>
              <option value="sticker">Sticker</option>
              <option value="pin">Pin Back</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">&#9660;</div>
          </div>
        </div>

        {/* Row 5: Needed By (date) + Budget (text) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <p className="text-[11px] text-gray-700 font-semibold mb-1 pl-1">Needed By</p>
            <input
              {...register("neededBy")}
              type="date"
              className="bulk-field"
            />
          </div>
          <div>
            <p className="text-[11px] text-gray-700 font-semibold mb-1 pl-1">Your Budget</p>
            <input
              {...register("budget")}
              placeholder="e.g. $2,000"
              className="bulk-field"
            />
          </div>
        </div>

        {/* Notes */}
        <textarea
          {...register("notes")}
          placeholder="Design details, color requirements, special instructions..."
          className="bulk-field h-[80px] resize-none pt-3"
        />

        {/* File Upload — up to 2 files with delete */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-green-50 border border-green-300 rounded-[10px]">
                <Check className="text-green-600 flex-shrink-0" size={15} strokeWidth={3} />
                <span className="text-[12px] text-green-700 font-bold truncate flex-1">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeUploadedFile(i)}
                  className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors font-black text-[10px]"
                  aria-label="Remove file"
                >✕</button>
              </div>
            ))}
          </div>
        )}

        {uploadedFiles.length < 2 && (
          <label htmlFor="bulk-file-upload" className="
            border-2 border-dashed border-gray-200
            rounded-[10px] h-[62px]
            flex items-center justify-center gap-3
            bg-[#F9FAF5]/50 hover:bg-white hover:border-panda-green/40
            transition-all duration-300 cursor-pointer group px-4
          ">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-panda-green flex-shrink-0" />
                <p className="text-[12px] text-gray-500 font-bold">Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud className="text-gray-400 group-hover:text-panda-green transition-colors flex-shrink-0" size={20} />
                <p className="text-[12px] text-gray-500 font-bold">
                  {uploadedFiles.length === 1
                    ? 'Add a 2nd file (optional)'
                    : <><span>Upload artwork </span><span className="text-gray-400 font-medium">(AI, EPS, PDF, PNG, JPG)</span></>
                  }
                </p>
              </>
            )}
            <input
              id="bulk-file-upload"
              type="file"
              className="hidden"
              accept="image/*,.pdf,.ai,.eps,.svg"
              onChange={handleFileChange}
            />
          </label>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="
            w-full bg-panda-dark text-panda-yellow
            font-black text-[16px] md:text-[18px]
            py-4 rounded-[12px]
            hover:bg-black hover:scale-[1.01]
            transition-all duration-300
            uppercase tracking-[0.1em]
            shadow-xl shadow-panda-green/10
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? "Submitting..." : "Get My Bulk Quote →"}
        </button>
      </form>

      {/* Trust Signals */}
      <div className="flex items-center justify-center gap-4 md:gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-panda-green" />
          <span className="text-[11px] text-gray-500 font-medium">2-Hour Response</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-panda-green" />
          <span className="text-[11px] text-gray-500 font-medium">No Obligation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-panda-green" />
          <span className="text-[11px] text-gray-500 font-medium">(302) 250-4340</span>
        </div>
      </div>

      </>
      )}

    </div>
  );
}
