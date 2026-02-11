"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeInteger } from "@/lib/sanitize";

export default function SampleBoxForm() {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Submit sample box order to API
      const response = await fetch('/api/sample-box', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: sanitizeString(data.fullName),
          email: sanitizeEmail(data.email),
          contactNumber: sanitizePhone(data.contactNumber),
          quantity: 1, // Always 1 sample box
          shippingAddress: sanitizeString(data.shippingAddress || ''),
          cardNumber: sanitizeString(data.cardNumber),
          cardholderName: sanitizeString(data.cardholderName),
          expiryMonth: sanitizeString(data.expiryMonth),
          expiryYear: sanitizeString(data.expiryYear),
          securityCode: sanitizeString(data.securityCode),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit order');
      }

      setMessage({ type: 'success', text: 'Order submitted successfully! We\'ll process your sample box order shortly.' });
      reset();
    } catch (error: any) {
      console.error('Sample box order error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to submit order. Please try again.' });
    } finally {
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

        {/* Payment Section */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-panda-green">✓</span>
            We accept all major payment methods
          </p>

          {/* Card Number */}
          <input
            {...register("cardNumber", { required: true })}
            placeholder="Card Number"
            className="form-input mb-4"
            required
          />

          {/* Card Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <select {...register("expiryMonth", { required: true })} className="form-input" required>
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month.toString().padStart(2, '0')}>
                  {month.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <select {...register("expiryYear", { required: true })} className="form-input" required>
              <option value="">YYY</option>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <input
              {...register("securityCode", { required: true })}
              placeholder="Security Code"
              maxLength={4}
              className="form-input"
              required
            />
          </div>

          {/* Cardholder Name */}
          <input
            {...register("cardholderName", { required: true })}
            placeholder="Cardholder Name"
            className="form-input"
            required
          />
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
          {isSubmitting ? 'Processing...' : 'Order Sample Box'}
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
