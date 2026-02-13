"use client";

import { useForm } from "react-hook-form";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeInteger, sanitizeNumber } from "@/lib/sanitize";

// Initialize Supabase client (with fallback if keys missing)
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  : null;

export default function HeroForm() {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Check if Supabase is configured
      if (!supabase) {
        throw new Error('Supabase not configured. Please contact support.');
      }

      let artworkUrl = null;

      // Upload artwork file if provided
      if (data.file && data.file[0]) {
        const file = data.file[0];
        // Sanitize file extension to prevent path traversal
        const fileExt = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `artwork/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('patches')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Failed to upload artwork');
        }

        const { data: publicUrlData } = supabase.storage
           .from('patches')
           .getPublicUrl(filePath);

         artworkUrl = publicUrlData?.publicUrl || null;
      }

      // Submit quote to API (with sanitized inputs)
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
            backing: 'iron',
            instructions: sanitizeString(data.instructions || ''),
            patchType: sanitizeString(data.type || ''),
          },
          artworkUrl: artworkUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote');
      }

      setMessage({ type: 'success', text: 'Quote submitted successfully! We\'ll contact you soon.' });
      reset();
    } catch (error) {
      console.error('Quote submission error:', error);
      setMessage({ type: 'error', text: 'Failed to submit quote. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Reduced padding slightly to make it fit nicely
    <div className="bg-[#1E4000]/5 backdrop-blur-md border-[3px] border-[#676767]/30 rounded-[20px] px-8 py-8 shadow-2xl">
      
      <div className="text-center mb-6">
        <h3 className="text-[24px] leading-tight font-black text-panda-dark uppercase tracking-tight">
          Get Your Free Quote & <br/> Design Mockup
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-lg text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-3">
          <input {...register("name")} placeholder="Name" className="form-input" />
          <input {...register("email")} placeholder="Email" className="form-input" />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-3">
          <input {...register("phone")} placeholder="Phone Number" className="form-input" />
          <input {...register("quantity")} placeholder="Quantity" type="number" className="form-input" />
        </div>

        {/* Row 3 */}
         <div className="grid grid-cols-2 gap-3">
           <div className="relative">
             <select {...register("size")} className="form-input appearance-none text-gray-500 cursor-pointer pr-10">
               <option>Size or Placement</option>
               <option value="2.5">Cap (2.25 - 2.5 inches)</option>
               <option value="3.5">Left Chest (3 - 4 inches)</option>
               <option value="2.5">Hat / Beanie (2.5 inches)</option>
               <option value="3.5">Sleeve (3.5 - 4 inches)</option>
               <option value="11">Across Chest (10 - 12 inches)</option>
               <option value="13">Jacket Back (12 - 14 inches)</option>
               <option value="custom">Custom Size</option>
             </select>
             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
           </div>

           <div className="relative">
             <select {...register("type")} className="form-input appearance-none text-gray-500 cursor-pointer pr-10">
               <option>Patch Type</option>
               <option value="embroidered">Embroidered</option>
               <option value="chenille">Chenille</option>
               <option value="woven">Woven</option>
               <option value="pvc">PVC</option>
               <option value="rubber">Rubber</option>
               <option value="leather">Leather</option>
               <option value="sequin">Sequin</option>
               <option value="metallic">Metallic</option>
               <option value="velvet">Velvet</option>
             </select>
             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
           </div>
         </div>

        {/* Instructions */}
        <textarea 
          {...register("instructions")}
          placeholder="Instructions: Text 'Panda Patches' White background..."
          className="form-input h-[80px] resize-none leading-relaxed pt-3"
        />

        {/* File Upload - Reduced Height */}
        <label htmlFor="file-upload" className="
          border-2 border-dashed border-[#676767]/30
          rounded-[12px]
          h-[100px]
          flex flex-col items-center justify-center
          bg-[#F9FAF5]/50 hover:bg-white
          transition-all duration-300 cursor-pointer
          group
        ">
           <UploadCloud className="text-gray-400 group-hover:text-panda-green transition-colors mb-1" size={24} />
           <p className="text-[12px] text-gray-500 font-bold mb-1">Drop files here or</p>
           <span className="bg-white border border-gray-200 px-4 py-1.5 rounded-md text-[12px] font-black text-panda-dark shadow-sm">
             SELECT FILES
           </span>
           <input
             id="file-upload"
             type="file"
             className="hidden"
             accept="image/*,.pdf"
             {...register("file")}
           />
        </label>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
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

      <style jsx global>{`
        .form-input {
          width: 100%;
          background-color: #F2F4EF;
          padding: 14px 16px; /* Optimized Padding */
          border-radius: 10px;
          font-size: 13px;
          color: #1a1a1a;
          outline: none;
          font-weight: 500;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .form-input:focus {
          background-color: #ffffff;
          border-color: #3B7E00;
        }
      `}</style>
    </div>
  );
}
