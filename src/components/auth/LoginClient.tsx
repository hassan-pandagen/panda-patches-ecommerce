"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface LoginClientProps {
  returnTo?: string;
  reason?: string;
}

export default function LoginClient({ returnTo, reason }: LoginClientProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<
    { type: "error" | "success"; text: string } | null
  >(
    reason === "confirmed"
      ? { type: "success", text: "Email confirmed. Please sign in." }
      : reason === "reset"
        ? { type: "success", text: "Password updated. Please sign in with your new password." }
        : null
  );
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      // Don't leak whether the email exists vs the password is wrong.
      setMessage({ type: "error", text: "Email or password is incorrect." });
      return;
    }
    router.push(returnTo || "/account");
    router.refresh();
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
          <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
            Email
          </label>
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
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">
              Password
            </label>
            <Link href="/forgot-password" className="text-[11px] text-panda-green hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-200 rounded-[10px] focus:border-panda-green focus:ring-2 focus:ring-panda-green/10 outline-none text-[14px]"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-panda-dark text-panda-yellow font-black text-[15px] py-3.5 rounded-[12px] hover:bg-black hover:scale-[1.01] transition-all uppercase tracking-[0.1em] shadow-lg disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
