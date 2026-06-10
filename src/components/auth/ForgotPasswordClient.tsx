"use client";

import { useState } from "react";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        }),
      });

      const json: { ok: boolean; error?: string } = await res.json().catch(() => ({ ok: false }));

      setSubmitting(false);

      if (!res.ok || !json.ok) {
        setMessage({
          type: "error",
          text: json.error || "Could not send reset link. Please try again.",
        });
        return;
      }

      // Always show success — account-enumeration mitigation.
      setMessage({
        type: "success",
        text: "If an account exists for that email, a password reset link is on its way. Check your inbox.",
      });
    } catch (err) {
      setSubmitting(false);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="bg-white rounded-[20px] border-[3px] border-gray-200 p-7 md:p-8 shadow-2xl">
      {message && (
        <div
          className={`p-3 mb-4 rounded-[10px] text-[13px] font-semibold ${
            message.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-[10px] focus:border-panda-green focus:ring-2 focus:ring-panda-green/10 outline-none text-[14px]"
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-panda-dark text-panda-yellow font-black text-[15px] py-3.5 rounded-[12px] hover:bg-black hover:scale-[1.01] transition-all uppercase tracking-[0.1em] shadow-lg disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
