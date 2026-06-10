"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AuthCallbackClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const finish = async () => {
      const supabase = createSupabaseBrowserClient();
      const next = searchParams.get("next") || "/account";

      // After setSession finishes, the supabase-js browser cookies are set in
      // document.cookie but the Next.js router cache still holds the
      // pre-auth response for /account. router.replace + router.refresh can
      // race the cookie write and end up rendering /account against the old
      // (signed-out) cookie state, which redirects back here. A full-page
      // navigation forces the browser to send a brand-new request with the
      // freshly-written auth cookie, guaranteeing the next render is signed-in.
      const navigate = (to: string) => {
        if (typeof window !== "undefined") {
          window.location.replace(to);
        }
      };

      // --- 1. Fragment-based delivery (implicit flow, from generateLink) ---
      // Supabase puts the tokens in the URL fragment: #access_token=...&refresh_token=...
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash && hash.length > 1) {
        const params = new URLSearchParams(hash.slice(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        // Supabase may also put an error message in the hash (e.g. expired link)
        const hashError = params.get("error_description") || params.get("error");

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error("[auth/callback] setSession error:", error);
            setErrorMessage(error.message);
            setStatus("error");
            return;
          }

          // Clear the fragment from the URL before navigating away so it
          // doesn't leak to the next page's analytics / referrer headers.
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", window.location.pathname);
          }

          navigate(next);
          return;
        }

        if (hashError) {
          setErrorMessage(hashError);
          setStatus("error");
          return;
        }
      }

      // --- 2. Query-based delivery (PKCE flow, ?code=...) ---
      // Browser-side exchange so the session cookies get set in this origin.
      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("[auth/callback] exchangeCodeForSession error:", error);
          setErrorMessage(error.message);
          setStatus("error");
          return;
        }
        navigate(next);
        return;
      }

      // --- 3. Neither — invalid request ---
      setErrorMessage("This sign-in link is missing or already used.");
      setStatus("error");
    };

    void finish();
  }, [searchParams]);

  if (status === "error") {
    return (
      <div className="max-w-[420px] text-center px-6">
        <h1 className="text-2xl font-black text-panda-dark mb-3">
          Sign-in link could not be used
        </h1>
        <p className="text-sm text-gray-600 leading-[1.7] mb-6">
          {errorMessage ||
            "The link may have expired or already been used. Please request a new sign-in link."}
        </p>
        <a
          href="/login"
          className="inline-block bg-panda-dark text-panda-yellow font-bold px-6 py-3 rounded-full text-sm uppercase tracking-wider hover:scale-105 transition-transform"
        >
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="text-gray-500 text-sm flex items-center gap-3">
      <span className="inline-block h-4 w-4 rounded-full border-2 border-panda-green border-t-transparent animate-spin" />
      Signing you in…
    </div>
  );
}
