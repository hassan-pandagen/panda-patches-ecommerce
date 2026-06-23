"use client";

import { useState } from "react";

interface SignupClientProps {
  returnTo?: string;
  initialEmail?: string;
}

export default function SignupClient({ returnTo, initialEmail }: SignupClientProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(initialEmail || "");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — must stay empty for humans
  const [loadedAt] = useState(() => Date.now()); // time-to-submit bot trap
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phone,
          returnTo,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
          website, // honeypot (hidden field)
          elapsedMs: Date.now() - loadedAt,
        }),
      });

      const json: { ok: boolean; error?: string } = await res.json().catch(() => ({ ok: false }));

      setSubmitting(false);

      if (!res.ok || !json.ok) {
        setMessage({
          type: "error",
          text: json.error || "Could not create your account. Please try again.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Account created. Check your email for a confirmation link to finish signing up.",
      });
    } catch (err) {
      setSubmitting(false);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Network error. Please try again.",
      });
    }
  };

  const labelCls =
    "block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider";
  const fieldCls =
    "w-full px-4 py-3 border border-gray-200 rounded-[10px] focus:border-panda-green focus:ring-2 focus:ring-panda-green/10 outline-none text-[14px]";

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
        {/* Honeypot: positioned off-screen so humans never see or tab to it, but
            form-filling bots auto-populate it. A non-empty value makes the server
            silently drop the signup. Do not remove. */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 1, height: 1, overflow: "hidden" }}
        >
          <label htmlFor="website-hp">Website</label>
          <input
            id="website-hp"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        {/* First + Last on one row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className={fieldCls}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className={fieldCls}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={fieldCls}
            autoComplete="email"
          />
        </div>

        <div>
          <label className={labelCls}>
            Phone <span className="text-gray-400 normal-case font-normal tracking-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={fieldCls}
            autoComplete="tel"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Helps us reach you fast if there is a question about your order.
          </p>
        </div>

        <div>
          <label className={labelCls}>Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={fieldCls}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-panda-dark text-panda-yellow font-black text-[15px] py-3.5 rounded-[12px] hover:bg-black hover:scale-[1.01] transition-all uppercase tracking-[0.1em] shadow-lg disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-[11px] text-gray-400 text-center leading-[1.6] mt-2">
          By creating an account you agree to our{" "}
          <a href="/terms-of-service" className="text-gray-500 underline hover:text-panda-green">terms</a> and{" "}
          <a href="/privacy-policy" className="text-gray-500 underline hover:text-panda-green">privacy policy</a>.
        </p>
      </form>
    </div>
  );
}
