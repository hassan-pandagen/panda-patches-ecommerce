"use client";

import { useForm } from "react-hook-form";
import { UploadCloud, Check } from "lucide-react";
import { useState, useRef } from "react";
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeInteger, sanitizeNumber } from "@/lib/sanitize";

export default function HeroForm({ productSlug }: { productSlug?: string }) {
  const isKeychains = productSlug === 'keychains';
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const partialSaved = useRef(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

      const fileExt = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const timestamp = Date.now();
      const fileName = `artwork-${randomId}-${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('order-attachments')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('order-attachments')
          .getPublicUrl(fileName);
        setUploadedFiles(prev => [...prev, { name: file.name, url: publicUrlData?.publicUrl || '' }]);
      } else {
        console.error('Artwork upload failed:', uploadError);
      }
    } catch (uploadErr) {
      console.error('Artwork upload exception:', uploadErr);
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
      body: JSON.stringify({ email, phone, name, source: 'HERO_FORM_PARTIAL' }),
    }).catch(() => {});
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: sanitizeString(data.name),
            email: sanitizeEmail(data.email),
            phone: sanitizePhone(data.phone || ''),
          },
          details: {
            quantity: sanitizeInteger(data.quantity),
            width: sanitizeNumber(data.size),
            height: sanitizeNumber(data.size),
            backing: sanitizeString(data.backing || 'iron'),
            instructions: sanitizeString(data.instructions || ''),
            patchType: sanitizeString(data.type || ''),
          },
          artworkUrl: uploadedFiles[0]?.url || null,
          artworkUrl2: uploadedFiles[1]?.url || null,
          pageUrl: window.location.href,
        }),
      });

      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        const minutes = data.retryAfter ? Math.ceil(data.retryAfter / 60) : 60;
        throw new Error(`Too many requests. Please try again in ${minutes} minutes.`);
      }

      if (response.status === 400) {
        const data = await response.json().catch(() => ({}));
        const fieldLabels: Record<string, string> = {
          'customer.name': 'Name',
          'customer.email': 'Email address',
          'customer.phone': 'Phone number',
          'details.quantity': 'Quantity',
          'details.width': 'Size',
          'details.height': 'Size',
          'details.backing': 'Backing type',
        };
        const firstIssue = data.details?.[0];
        const label = firstIssue ? (fieldLabels[firstIssue.field] || firstIssue.field) : null;
        throw new Error(label ? `Please fill in: ${label}` : 'Please fill in all required fields.');
      }

      if (!response.ok) {
        throw new Error('Failed to submit quote');
      }

      // Google Ads — Quote Form Lead conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-11221237770/qTWjCNnZ3oEcEIqA2uYp',
          value: 50.0,
          currency: 'USD',
        });
      }
      // Facebook Pixel — Lead event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', { value: 50.0, currency: 'USD' });
      }

      setMessage({ type: 'success', text: 'Quote submitted successfully! We\'ll contact you soon.' });
      reset();
      setUploadedFiles([]);
    } catch (error: any) {
      console.error('Quote submission error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to submit quote. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 border-[3px] border-[#676767]/30 rounded-[20px] px-8 py-8 shadow-2xl">

      {message?.type === 'success' ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
          </div>
          <h3 className="text-[22px] font-black text-panda-dark mb-2">Quote Request Sent!</h3>
          <p className="text-gray-500 font-medium text-[14px] mb-6">
            Thank you! Our team will contact you soon with your free design mockup.
          </p>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="bg-panda-dark text-panda-yellow font-bold px-8 py-3 rounded-[10px] hover:scale-105 transition-transform uppercase tracking-wider text-[14px]"
          >
            Submit Another Quote
          </button>
        </div>
      ) : (
      <>

      <div className="text-center mb-6">
        <h2 className="text-[24px] leading-tight font-black text-panda-dark uppercase tracking-tight">
          Get Your Free Quote & <br/> Design Mockup
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        {/* Error Message */}
        {message?.type === 'error' && (
          <div className="p-4 rounded-lg text-sm font-semibold bg-red-100 text-red-800 border border-red-300">
            {message.text}
          </div>
        )}

        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Name *"
              className={`form-input ${errors.name ? 'border-red-400 bg-red-50' : ''}`}
              autoComplete="name"
            />
            {errors.name && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.name.message)}</p>}
          </div>
          <div>
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Email *"
              type="email"
              className={`form-input ${errors.email ? 'border-red-400 bg-red-50' : ''}`}
              autoComplete="email"
              onBlur={handleEmailBlur}
            />
            {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.email.message)}</p>}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register("phone", { required: "Phone is required" })}
              placeholder="Phone Number *"
              type="tel"
              className={`form-input ${errors.phone ? 'border-red-400 bg-red-50' : ''}`}
              autoComplete="tel"
            />
            {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.phone.message)}</p>}
          </div>
          <div>
            <input
              {...register("quantity", { required: "Quantity is required", min: { value: 1, message: "Min 1" } })}
              placeholder="Quantity *"
              type="number"
              min="1"
              className={`form-input ${errors.quantity ? 'border-red-400 bg-red-50' : ''}`}
            />
            {errors.quantity && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.quantity.message)}</p>}
          </div>
        </div>

        {/* Row 3 */}
         <div className="grid grid-cols-2 gap-3">
           <div className="relative">
             {isKeychains ? (
               <select {...register("size", { required: "Please select a side" })} defaultValue="" aria-label="Select single or double side" className={`form-input appearance-none text-gray-500 cursor-pointer pr-10 ${errors.size ? 'border-red-400 bg-red-50' : ''}`}>
                 <option value="" disabled hidden>Single or Double Side?</option>
                 <option value="single-side">Single Side</option>
                 <option value="double-side">Double Side</option>
               </select>
             ) : (
               <select {...register("size", { required: "Please select a size" })} defaultValue="" aria-label="Select patch size or placement" className={`form-input appearance-none text-gray-500 cursor-pointer pr-10 ${errors.size ? 'border-red-400 bg-red-50' : ''}`}>
                 <option value="" disabled hidden>Size or Placement *</option>
                 <option value="2.5">Cap (2.25 - 2.5 inches)</option>
                 <option value="3.5">Left Chest (3 - 4 inches)</option>
                 <option value="2.5">Hat / Beanie (2.5 inches)</option>
                 <option value="3.5">Sleeve (3.5 - 4 inches)</option>
                 <option value="12">Across Chest (12 x 12 inches)</option>
                 <option value="14">Jacket Back (14 x 14 inches)</option>
               </select>
             )}
             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
             {errors.size && <p className="text-red-500 text-[11px] mt-1 font-semibold">⚠ {String(errors.size.message)}</p>}
           </div>

           <div className="relative">
             {isKeychains ? (
               <select {...register("type")} defaultValue="" aria-label="Select keychain type" className="form-input appearance-none text-gray-500 cursor-pointer pr-10">
                 <option value="" disabled hidden>Keychain Type</option>
                 <option value="chenille-keychain">Chenille Keychain</option>
                 <option value="embroidered-keychain">Embroidered Keychain</option>
                 <option value="leather-keychain">Leather Keychain</option>
                 <option value="pvc-keychain">PVC Keychain</option>
               </select>
             ) : (
               <select {...register("type")} defaultValue="" aria-label="Select patch type" className="form-input appearance-none text-gray-500 cursor-pointer pr-10">
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
             )}
             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
           </div>
         </div>

        {/* Row 4 - Backing */}
        {!isKeychains && (
          <div className="relative">
            <select {...register("backing")} defaultValue="" aria-label="Select backing type" className="form-input appearance-none text-gray-500 cursor-pointer pr-10">
              <option value="" disabled hidden>Select Backing</option>
              <option value="iron">Iron-On</option>
              <option value="sew">Sew-On</option>
              <option value="velcro">Velcro (Hook & Loop)</option>
              <option value="sticker">Sticker</option>
              <option value="pin">Pin Back</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
          </div>
        )}

        {/* Instructions */}
        <textarea
          {...register("instructions")}
          placeholder="Instructions: Text 'Panda Patches' White background..."
          className="form-input h-[80px] resize-none leading-relaxed pt-3"
        />

        {/* File Upload — up to 2 files with delete */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-green-50 border border-green-300 rounded-[10px]">
                <Check className="text-green-600 flex-shrink-0" size={16} strokeWidth={3} />
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
          <label htmlFor="file-upload" className="
            border-2 border-dashed border-[#676767]/30
            rounded-[12px]
            h-[90px]
            flex flex-col items-center justify-center
            bg-[#F9FAF5]/50 hover:bg-white
            transition-all duration-300 cursor-pointer
            group
          ">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-panda-green mb-2" />
                <p className="text-[12px] text-gray-500 font-bold">Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud className="text-gray-400 group-hover:text-panda-green transition-colors mb-1" size={24} />
                <p className="text-[12px] text-gray-500 font-bold mb-1">
                  {uploadedFiles.length === 1 ? 'Add a 2nd file (optional)' : 'Drop files here or'}
                </p>
                {uploadedFiles.length === 0 && (
                  <span className="bg-white border border-gray-200 px-4 py-1.5 rounded-md text-[12px] font-black text-panda-dark shadow-sm">
                    SELECT FILES
                  </span>
                )}
              </>
            )}
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </label>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="
            w-full
            bg-panda-dark text-panda-yellow
            font-black text-[18px]
            py-4
            rounded-[12px]
            hover:bg-black hover:scale-[1.01]
            transition-all duration-300
            uppercase tracking-[0.1em]
            shadow-xl shadow-panda-green/10
            mt-4
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? 'Submitting...' : 'Get Started'}
        </button>
      </form>

      </>
      )}

    </div>
  );
}
