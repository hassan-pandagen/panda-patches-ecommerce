"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { sanitizeString, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";

export default function SampleBoxForm() {
  const { register, handleSubmit } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/sample-box', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: sanitizeString(data.fullName),
          email: sanitizeEmail(data.email),
          contactNumber: sanitizePhone(data.contactNumber),
          shippingAddress: sanitizeString(data.shippingAddress || ''),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit order');
      }

      // Redirect to Stripe Checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to submit order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-[3px] border-gray-200 rounded-[20px] px-8 py-8 shadow-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[24px] font-black text-panda-dark uppercase">Price</h3>
          <p className="text-[32px] font-black text-panda-dark">$45.00</p>
        </div>
        <p className="text-[14px] text-gray-600">
          This price includes all the setup and shipping charges.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <div className="p-4 rounded-lg text-sm font-semibold bg-red-100 text-red-800 border border-red-300">
            {errorMessage}
          </div>
        )}

        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            {...register("fullName", { required: true })}
            placeholder="Full Name"
            className="form-input"
            required
          />
          <input
            {...register("email", { required: true })}
            placeholder="Email Address"
            type="email"
            className="form-input"
            required
          />
        </div>

        {/* Row 2: Contact Number */}
        <input
          {...register("contactNumber", { required: true })}
          placeholder="Contact Number"
          type="tel"
          className="form-input"
          required
        />

        {/* Shipping Address */}
        <textarea
          {...register("shippingAddress")}
          placeholder="Shipping Address"
          className="form-input h-[80px] resize-none"
        />

        {/* Payment Note */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-panda-green">✓</span>
            Secure payment powered by Stripe
          </p>
          <p className="text-xs text-gray-500">
            You will be redirected to Stripe to complete your payment securely.
          </p>
        </div>

        {/* Submit Button */}
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
            shadow-xl
            mt-4
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? 'Redirecting to Payment...' : 'Order Sample Box — $45'}
        </button>
      </form>

      <style jsx global>{`
        .form-input {
          width: 100%;
          background-color: #F2F4EF;
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 14px;
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
