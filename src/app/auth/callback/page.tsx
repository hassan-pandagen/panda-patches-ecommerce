import { Suspense } from "react";
import AuthCallbackClient from "@/components/auth/AuthCallbackClient";

/**
 * Auth callback landing page.
 *
 * Supabase delivers the session to us in TWO different ways depending on the
 * flow that issued the link:
 *
 *  - PKCE flow (e.g. signInWithOAuth, signInWithOtp from browser):
 *      lands here as `?code=...` query string, server-side exchange.
 *  - Implicit flow (auth.admin.generateLink server-side, which we use for our
 *    branded emails): lands here as `#access_token=...&refresh_token=...`
 *    URL fragment. Browser-only.
 *
 * Because URL fragments never reach the server, this route is a client
 * component. It reads window.location.hash OR window.location.search and
 * sets the Supabase session accordingly, then forwards to /account (or
 * the ?next= path).
 */
export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <Suspense fallback={<div className="text-gray-500 text-sm">Signing you in…</div>}>
        <AuthCallbackClient />
      </Suspense>
    </main>
  );
}
