"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  // useRef so the supabase singleton does not flip identity between renders
  // and re-trigger the recovery-session effect below.
  const supabaseRef = useRef(supabase);

  // Recovery links from Supabase admin.generateLink land here with the
  // access_token and refresh_token in the URL hash fragment (implicit flow).
  // The hash is CLIENT-ONLY (never sent to the server), so we have to read
  // it here, hydrate the Supabase session, and only then enable the form.
  // Without this step updateUser() throws "Auth session missing!".
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) {
      // No hash means either the user landed here directly (no recovery
      // link) or the link already consumed (session present from elsewhere).
      // Check the session anyway so an already-authenticated user can still
      // change their password from /reset-password.
      supabaseRef.current.auth.getSession().then(({ data }) => {
        if (data.session) setSessionReady(true);
        else
          setMessage({
            type: "error",
            text: "This reset link is missing or expired. Request a new one from the forgot password page.",
          });
      });
      return;
    }

    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const type = params.get("type");

    if (!access_token || !refresh_token) {
      setMessage({
        type: "error",
        text: "This reset link is missing required tokens. Request a new one from the forgot password page.",
      });
      return;
    }
    if (type && type !== "recovery") {
      setMessage({
        type: "error",
        text: "This link is not a password reset link.",
      });
      return;
    }

    supabaseRef.current.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) {
          setMessage({
            type: "error",
            text: "This reset link has expired. Request a new one from the forgot password page.",
          });
          return;
        }
        // Clean the tokens out of the URL so they do not stick around in
        // browser history or any referer headers sent from this page.
        window.history.replaceState(null, "", window.location.pathname);
        setSessionReady(true);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      setSubmitting(false);
      return;
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    setSubmitting(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    await supabase.auth.signOut();
    router.push("/login?reason=reset");
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
          <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">New password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full px-4 py-3 border border-gray-200 rounded-[10px] focus:border-panda-green focus:ring-2 focus:ring-panda-green/10 outline-none text-[14px]"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Confirm new password</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type it again"
            className="w-full px-4 py-3 border border-gray-200 rounded-[10px] focus:border-panda-green focus:ring-2 focus:ring-panda-green/10 outline-none text-[14px]"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !sessionReady}
          className="w-full bg-panda-dark text-panda-yellow font-black text-[15px] py-3.5 rounded-[12px] hover:bg-black hover:scale-[1.01] transition-all uppercase tracking-[0.1em] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Updating..."
            : sessionReady
              ? "Update Password"
              : "Verifying link..."}
        </button>
      </form>
    </div>
  );
}
