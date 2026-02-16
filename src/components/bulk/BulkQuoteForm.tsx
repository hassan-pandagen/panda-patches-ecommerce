"use client";

import { useForm } from "react-hook-form";
import { UploadCloud, CheckCircle, Phone, Clock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { sanitizeString, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  : null;

export default function BulkQuoteForm() {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!supabase) {
        throw new Error("Supabase not configured.");
      }

      let artworkUrl = null;

      if (data.file && data.file[0]) {
        const file = data.file[0];
        const fileExt = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `artwork/bulk/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("patches")
          .upload(filePath, file);

        if (uploadError) throw new Error("Failed to upload artwork");

        const { data: publicUrlData } = supabase.storage
          .from("patches")
          .getPublicUrl(filePath);

        artworkUrl = publicUrlData?.publicUrl || null;
      }

      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: sanitizeString(data.name),
            email: sanitizeEmail(data.email),
            phone: sanitizePhone(data.phone || ""),
          },
          details: {
            quantity: parseInt(data.quantityRange?.split("-")[0] || "100"),
            width: 3,
            height: 3,
            backing: sanitizeString(data.backing || "iron"),
            instructions: sanitizeString(
              `[BULK ORDER] Company: ${data.company || "N/A"} | Qty Range: ${data.quantityRange || "N/A"} | Patch Type: ${data.patchType || "N/A"} | Size: ${data.size || "N/A"} | Timeline: ${data.timeline || "Standard"} | Notes: ${data.notes || "None"}`
            ),
            patchType: sanitizeString(data.patchType || ""),
          },
          artworkUrl: artworkUrl,
          isBulkOrder: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit quote");

      setMessage({ type: "success", text: "Quote submitted! We'll respond within 2 business hours with your free mockup." });
      setUploadedName(null);
      reset();
    } catch (error) {
      console.error("Bulk quote error:", error);
      setMessage({ type: "error", text: "Failed to submit. Please try again or call us at (302) 250-4340." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="bulk-quote" className="bg-white border-[3px] border-gray-200 rounded-[20px] px-6 md:px-8 py-7 md:py-8 shadow-2xl">

      {/* Header */}
      <div className="text-center mb-5">
        <h3 className="text-[22px] md:text-[24px] font-black text-panda-dark uppercase tracking-tight leading-tight">
          Get Your Free Bulk Quote
        </h3>
        <p className="text-[12px] md:text-[13px] text-gray-500 font-medium mt-1.5">
          Free mockup included — we respond within 2 hours.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        {/* Success/Error */}
        {message && (
          <div className={`p-3 rounded-[10px] text-[13px] font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.type === "success" && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
            {message.text}
          </div>
        )}

        {/* Row 1: Name + Company */}
        <div className="grid grid-cols-2 gap-2.5">
          <input
            {...register("name", { required: true })}
            placeholder="Your Name *"
            className="bulk-field"
            required
          />
          <input
            {...register("company")}
            placeholder="Company Name"
            className="bulk-field"
          />
        </div>

        {/* Row 2: Email + Phone */}
        <div className="grid grid-cols-2 gap-2.5">
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email Address *"
            className="bulk-field"
            required
          />
          <input
            {...register("phone")}
            placeholder="Phone Number"
            className="bulk-field"
          />
        </div>

        {/* Row 3: Patch Type + Quantity */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <select {...register("patchType")} className="bulk-field appearance-none cursor-pointer pr-8 text-gray-500">
              <option value="">Patch Type</option>
              <option value="embroidered">Embroidered</option>
              <option value="pvc">PVC / Rubber</option>
              <option value="woven">Woven</option>
              <option value="chenille">Chenille</option>
              <option value="leather">Leather</option>
              <option value="not-sure">Not Sure — Recommend</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">&#9660;</div>
          </div>

          <div className="relative">
            <select {...register("quantityRange")} className="bulk-field appearance-none cursor-pointer pr-8 text-gray-500">
              <option value="">Quantity Range</option>
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
          <div className="relative">
            <select {...register("size")} className="bulk-field appearance-none cursor-pointer pr-8 text-gray-500">
              <option value="">Size</option>
              <option value="2">2 inch</option>
              <option value="2.5">2.5 inch (Caps)</option>
              <option value="3">3 inch (Standard)</option>
              <option value="3.5">3.5 inch (Chest)</option>
              <option value="4">4 inch</option>
              <option value="5+">5+ inch (Large)</option>
              <option value="custom">Custom Size</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">&#9660;</div>
          </div>

          <div className="relative">
            <select {...register("backing")} className="bulk-field appearance-none cursor-pointer pr-8 text-gray-500">
              <option value="">Backing Type</option>
              <option value="iron">Iron-On</option>
              <option value="velcro">Velcro (Hook & Loop)</option>
              <option value="sew">Sew-On</option>
              <option value="adhesive">Adhesive / Sticker</option>
              <option value="pin">Pin Back</option>
              <option value="not-sure">Not Sure</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">&#9660;</div>
          </div>
        </div>

        {/* Row 5: Timeline */}
        <div className="relative">
          <select {...register("timeline")} className="bulk-field appearance-none cursor-pointer pr-8 text-gray-500">
            <option value="">Timeline</option>
            <option value="standard">Standard (2 weeks)</option>
            <option value="rush">Rush (7 days)</option>
            <option value="flexible">Flexible — No rush</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">&#9660;</div>
        </div>

        {/* Notes */}
        <textarea
          {...register("notes")}
          placeholder="Design details, color requirements, special instructions..."
          className="bulk-field h-[80px] resize-none pt-3"
        />

        {/* File Upload */}
        <label htmlFor="bulk-file-upload" className="
          border-2 border-dashed border-gray-200
          rounded-[10px] h-[70px]
          flex items-center justify-center gap-3
          bg-[#F9FAF5]/50 hover:bg-white hover:border-panda-green/40
          transition-all duration-300 cursor-pointer group px-4
        ">
          <UploadCloud className="text-gray-400 group-hover:text-panda-green transition-colors flex-shrink-0" size={20} />
          {uploadedName ? (
            <p className="text-[12px] text-panda-green font-bold truncate">{uploadedName}</p>
          ) : (
            <p className="text-[12px] text-gray-500 font-bold">
              Upload artwork <span className="text-gray-400 font-medium">(AI, EPS, PDF, PNG, JPG)</span>
            </p>
          )}
          <input
            id="bulk-file-upload"
            type="file"
            className="hidden"
            accept="image/*,.pdf,.ai,.eps,.svg"
            {...register("file", {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files?.[0]) setUploadedName(e.target.files[0].name);
              }
            })}
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
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

      <style jsx global>{`
        .bulk-field {
          width: 100%;
          background-color: #F2F4EF;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13px;
          color: #1a1a1a;
          outline: none;
          font-weight: 500;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .bulk-field::placeholder {
          color: #9ca3af;
        }
        .bulk-field:focus {
          background-color: #ffffff;
          border-color: #3B7E00;
        }
      `}</style>
    </div>
  );
}
