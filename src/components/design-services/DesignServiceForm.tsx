"use client";

import { useForm } from "react-hook-form";
import { UploadCloud, CheckCircle, Phone, Clock, ShieldCheck, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { sanitizeString, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import FormFeedback from "@/components/feedback/FormFeedback";
import { getStoredAttribution, generateEventId } from "@/lib/clientAttribution";

type ServiceType = "digitizing" | "vector";

interface DesignServiceFormProps {
  serviceType: ServiceType;
}

const COPY = {
  digitizing: {
    heading: "Get Your Free Digitizing Quote",
    subheading: "Free trial. We respond within 2 hours.",
    formatLabel: "Format Required",
    formatPlaceholder: "Format Required (e.g. DST, PES, JEF)",
    submitLabel: "Get My Digitizing Quote",
    successText: "Quote request received. Our design team will respond within 2 business hours.",
    sourceTag: "DIGITIZING_QUOTE_FORM",
    pixelEventName: "Digitizing Quote Request",
    patchTypeTag: "Embroidery Digitizing Service",
  },
  vector: {
    heading: "Get Your Free Vector Quote",
    subheading: "Free trial. We respond within 2 hours.",
    formatLabel: "Format Required",
    formatPlaceholder: "Format Required (e.g. AI, EPS, SVG, PDF)",
    submitLabel: "Get My Vector Quote",
    successText: "Quote request received. Our design team will respond within 2 business hours.",
    sourceTag: "VECTOR_QUOTE_FORM",
    pixelEventName: "Vector Conversion Quote Request",
    patchTypeTag: "Raster to Vector Conversion Service",
  },
} as const;

export default function DesignServiceForm({ serviceType }: DesignServiceFormProps) {
  const copy = COPY[serviceType];
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const partialSaved = useRef(false);
  const formLoadedAt = useRef(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

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
        setUploadedFiles((prev) => [...prev, { name: file.name, url: publicUrlData?.publicUrl || "" }]);
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
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    if (partialSaved.current || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    partialSaved.current = true;
    const name = (document.querySelector('input[name="name"]') as HTMLInputElement)?.value || "";
    const phone = (document.querySelector('input[name="phone"]') as HTMLInputElement)?.value || "";
    const attribution = getStoredAttribution();
    const eventId = generateEventId("contact");
    fetch("/api/partial-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, name, source: `${copy.sourceTag}_PARTIAL`, attribution, eventId }),
    }).catch(() => {});
  };

  const onSubmit = async (data: any) => {
    if (Date.now() - formLoadedAt.current < 3000) {
      setMessage({ type: "success", text: copy.successText });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const attribution = getStoredAttribution();
    const eventId = generateEventId("lead");

    try {
      if (typeof (window as any).fbq === "function") {
        (window as any).fbq(
          "track",
          "Lead",
          {
            content_name: copy.pixelEventName,
            content_category: "Design Services",
            value: 0,
            currency: "USD",
          },
          { eventID: eventId }
        );
      }
    } catch {
      /* noop */
    }

    try {
      const sizeRaw = (data.size || "").toString();
      const sizeParts = sizeRaw.toLowerCase().split(/\s*x\s*/i);
      const parsedW = parseFloat(sizeParts[0]);
      const parsedH = parseFloat(sizeParts[1]);

      const instructions = sanitizeString(
        `[${copy.sourceTag}] Size: ${sizeRaw || "N/A"} | Format Required: ${data.formatRequired || "N/A"}`
      );

      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: data.website || "",
          customer: {
            name: sanitizeString(data.name),
            email: sanitizeEmail(data.email),
            phone: sanitizePhone(data.phone || ""),
          },
          details: {
            quantity: 1,
            width: Math.min(isNaN(parsedW) ? 3 : parsedW, 50),
            height: Math.min(isNaN(parsedH) ? 3 : parsedH, 50),
            backing: "n/a",
            instructions,
            patchType: copy.patchTypeTag,
          },
          artworkUrl: uploadedFiles[0]?.url || null,
          artworkUrl2: uploadedFiles[1]?.url || null,
          isBulkOrder: true,
          pageUrl: window.location.href,
          attribution,
          eventId,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit quote");

      if (typeof window !== "undefined" && (window as any).Tawk_API?.setAttributes) {
        (window as any).Tawk_API.setAttributes(
          {
            "lead-status": `${copy.sourceTag} Submitted`,
            "form-page": window.location.pathname,
          },
          function () {}
        );
      }

      setMessage({ type: "success", text: copy.successText });
      setUploadedFiles([]);
      reset();

      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-11221237770/qTWjCNnZ3oEcEIqA2uYp",
        });
      }
    } catch (error) {
      console.error("Design service quote error:", error);
      setMessage({ type: "error", text: "Failed to submit. Please try again or call us at (302) 250-4340." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-[3px] border-gray-200 rounded-[20px] px-6 md:px-8 py-7 md:py-8 shadow-2xl">
      {message?.type === "success" ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-[22px] font-black text-panda-dark mb-2">Quote Request Sent!</h3>
          <p className="text-gray-500 font-medium text-[14px] mb-6">{message.text}</p>
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
          <FormFeedback formType="bulk_quote" />
        </div>
      ) : (
        <>
          {/* Honeypot */}
          <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
            <input type="text" {...register("website")} tabIndex={-1} autoComplete="off" />
          </div>

          {/* Header */}
          <div className="text-center mb-5">
            <h3 className="text-[22px] md:text-[24px] font-black text-panda-dark uppercase tracking-tight leading-tight">
              {copy.heading}
            </h3>
            <p className="text-[12px] md:text-[13px] text-gray-500 font-medium mt-1.5">{copy.subheading}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            {/* Error */}
            {message?.type === "error" && (
              <div className="p-3 rounded-[10px] text-[13px] font-semibold flex items-center gap-2 bg-red-50 text-red-700 border border-red-200">
                {message.text}
              </div>
            )}

            {/* Name */}
            <div>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Your Name *"
                className={`bulk-field ${errors.name ? "border-red-400 bg-red-50" : ""}`}
                autoComplete="name"
              />
              {errors.name && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.name.message)}</p>}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="Email Address *"
                  className={`bulk-field ${errors.email ? "border-red-400 bg-red-50" : ""}`}
                  autoComplete="email"
                  onBlur={handleEmailBlur}
                />
                {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.email.message)}</p>}
              </div>
              <div>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  placeholder="Phone Number *"
                  className={`bulk-field ${errors.phone ? "border-red-400 bg-red-50" : ""}`}
                  autoComplete="tel"
                />
                {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.phone.message)}</p>}
              </div>
            </div>

            {/* Size + Format Required */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <input
                  {...register("size", { required: "Size is required" })}
                  placeholder="Size (e.g. 4 x 3 inches) *"
                  className={`bulk-field ${errors.size ? "border-red-400 bg-red-50" : ""}`}
                />
                {errors.size && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.size.message)}</p>}
              </div>
              <div>
                <input
                  {...register("formatRequired", { required: "Format is required" })}
                  placeholder={`${copy.formatPlaceholder} *`}
                  className={`bulk-field ${errors.formatRequired ? "border-red-400 bg-red-50" : ""}`}
                />
                {errors.formatRequired && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.formatRequired.message)}</p>}
              </div>
            </div>

            {/* File Upload */}
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
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadedFiles.length < 2 && (
              <label
                htmlFor="design-service-file-upload"
                className="
                  border-2 border-dashed border-gray-200
                  rounded-[10px] h-[62px]
                  flex items-center justify-center gap-3
                  bg-[#F9FAF5]/50 hover:bg-white hover:border-panda-green/40
                  transition-all duration-300 cursor-pointer group px-4
                "
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-panda-green flex-shrink-0" />
                    <p className="text-[12px] text-gray-500 font-bold">Uploading...</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="text-gray-400 group-hover:text-panda-green transition-colors flex-shrink-0" size={20} />
                    <p className="text-[12px] text-gray-500 font-bold">
                      {uploadedFiles.length === 1 ? (
                        "Add a 2nd file (optional)"
                      ) : (
                        <>
                          <span>Upload artwork </span>
                          <span className="text-gray-400 font-medium">(any common image format)</span>
                        </>
                      )}
                    </p>
                  </>
                )}
                <input
                  id="design-service-file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.ai,.eps,.svg,.tiff,.tif,.bmp,.gif"
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
              {isSubmitting ? "Submitting..." : `${copy.submitLabel} →`}
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
