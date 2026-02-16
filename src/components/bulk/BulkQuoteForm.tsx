"use client";

import { useForm } from "react-hook-form";
import { UploadCloud, CheckCircle } from "lucide-react";
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

      setMessage({ type: "success", text: "Bulk quote submitted! We'll respond within 2 business hours with your free mockup." });
      reset();
    } catch (error) {
      console.error("Bulk quote error:", error);
      setMessage({ type: "error", text: "Failed to submit. Please try again or call us at (302) 250-4340." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="bulk-quote" className="w-full py-16 md:py-24 bg-panda-dark">
      <div className="container mx-auto px-4 md:px-6 max-w-[800px]">

        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-[24px] md:text-[36px] font-black text-panda-yellow uppercase tracking-tight mb-3">
            Get Your Bulk Quote
          </h2>
          <p className="text-[14px] md:text-[16px] text-gray-300 font-medium max-w-[500px] mx-auto">
            We respond to all bulk inquiries within 2 business hours. Free mockup included with every quote.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-6 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Success/Error */}
            {message && (
              <div className={`p-4 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-900/50 text-green-300 border border-green-600/30"
                  : "bg-red-900/50 text-red-300 border border-red-600/30"
              }`}>
                {message.type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                {message.text}
              </div>
            )}

            {/* Row 1: Name + Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                {...register("name", { required: true })}
                placeholder="Your Name *"
                className="bulk-input"
              />
              <input
                {...register("company")}
                placeholder="Business / Organization Name"
                className="bulk-input"
              />
            </div>

            {/* Row 2: Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Email Address *"
                className="bulk-input"
              />
              <input
                {...register("phone")}
                placeholder="Phone Number"
                className="bulk-input"
              />
            </div>

            {/* Row 3: Patch Type + Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <select {...register("patchType")} className="bulk-input appearance-none cursor-pointer pr-10 text-gray-400">
                  <option value="">Patch Type</option>
                  <option value="embroidered">Embroidered</option>
                  <option value="pvc">PVC / Rubber</option>
                  <option value="woven">Woven</option>
                  <option value="chenille">Chenille</option>
                  <option value="leather">Leather</option>
                  <option value="not-sure">Not Sure — Recommend</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
              </div>

              <div className="relative">
                <select {...register("quantityRange")} className="bulk-input appearance-none cursor-pointer pr-10 text-gray-400">
                  <option value="">Quantity Range</option>
                  <option value="50-99">50 - 99 pieces</option>
                  <option value="100-299">100 - 299 pieces</option>
                  <option value="300-499">300 - 499 pieces</option>
                  <option value="500-999">500 - 999 pieces</option>
                  <option value="1000-4999">1,000 - 4,999 pieces</option>
                  <option value="5000+">5,000+ pieces</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
              </div>
            </div>

            {/* Row 4: Size + Backing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <select {...register("size")} className="bulk-input appearance-none cursor-pointer pr-10 text-gray-400">
                  <option value="">Size / Placement</option>
                  <option value="2">2 inch</option>
                  <option value="2.5">2.5 inch (Caps)</option>
                  <option value="3">3 inch (Standard)</option>
                  <option value="3.5">3.5 inch (Chest/Sleeve)</option>
                  <option value="4">4 inch</option>
                  <option value="5+">5+ inch (Large)</option>
                  <option value="custom">Custom Size</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
              </div>

              <div className="relative">
                <select {...register("backing")} className="bulk-input appearance-none cursor-pointer pr-10 text-gray-400">
                  <option value="">Backing Type</option>
                  <option value="iron">Iron-On</option>
                  <option value="velcro">Velcro (Hook & Loop)</option>
                  <option value="sew">Sew-On</option>
                  <option value="adhesive">Adhesive / Sticker</option>
                  <option value="pin">Pin Back</option>
                  <option value="not-sure">Not Sure</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
              </div>
            </div>

            {/* Row 5: Timeline */}
            <div className="relative">
              <select {...register("timeline")} className="bulk-input appearance-none cursor-pointer pr-10 text-gray-400">
                <option value="">Timeline</option>
                <option value="standard">Standard (2 weeks)</option>
                <option value="rush">Rush (7 days)</option>
                <option value="flexible">Flexible — No rush</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
            </div>

            {/* Notes */}
            <textarea
              {...register("notes")}
              placeholder="Additional details: design description, color requirements, special instructions..."
              className="bulk-input h-[100px] resize-none pt-3"
            />

            {/* File Upload */}
            <label htmlFor="bulk-file-upload" className="
              border-2 border-dashed border-white/20
              rounded-[12px] h-[90px]
              flex flex-col items-center justify-center
              bg-white/5 hover:bg-white/10
              transition-all duration-300 cursor-pointer group
            ">
              <UploadCloud className="text-gray-400 group-hover:text-panda-yellow transition-colors mb-1" size={22} />
              <p className="text-[12px] text-gray-400 font-medium">Upload artwork (AI, EPS, PDF, PNG, JPG, or sketch)</p>
              <input
                id="bulk-file-upload"
                type="file"
                className="hidden"
                accept="image/*,.pdf,.ai,.eps,.svg"
                {...register("file")}
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full bg-panda-yellow text-panda-dark
                font-black text-[16px] md:text-[18px]
                py-4 md:py-5 rounded-[12px]
                hover:scale-[1.01] transition-all duration-300
                uppercase tracking-widest shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? "Submitting..." : "GET MY BULK QUOTE →"}
            </button>

            {/* Response Promise */}
            <p className="text-center text-[12px] text-gray-400 mt-2">
              We respond within 2 business hours. Free mockup included. No obligation.
            </p>
          </form>
        </div>

      </div>

      <style jsx global>{`
        .bulk-input {
          width: 100%;
          background-color: rgba(255, 255, 255, 0.08);
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 14px;
          color: #ffffff;
          outline: none;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 0.2s;
        }
        .bulk-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .bulk-input:focus {
          background-color: rgba(255, 255, 255, 0.12);
          border-color: #E3FF15;
        }
        .bulk-input option {
          background-color: #001400;
          color: #ffffff;
        }
      `}</style>
    </section>
  );
}
