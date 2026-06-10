import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginClient from "@/components/auth/LoginClient";
import { getCurrentUser } from "@/lib/supabase/guards";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In | Panda Patches",
  description: "Sign in to your Panda Patches account to view orders, track delivery, and reorder.",
  alternates: { canonical: "https://www.pandapatches.com/login" },
  robots: { index: false, follow: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (user) {
    redirect(params.returnTo || "/account");
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="w-full pt-10 md:pt-14 pb-10 md:pb-16">
        <div className="container mx-auto px-6 max-w-[480px]">
          <h1 className="text-[32px] md:text-[40px] font-black text-panda-dark leading-[1.1] tracking-tight mb-2 text-center">
            Welcome back
          </h1>
          <p className="text-[15px] text-gray-600 leading-[1.6] mb-8 text-center">
            Sign in to track your orders, view mockups, and reorder.
          </p>

          <LoginClient returnTo={params.returnTo} reason={params.reason} />

          {/* Outlined-button signup nudge. Brand pill shape, transparent fill,
              dark-green border + label, fills on hover. Strong enough to draw
              first-time visitors without competing with the Sign In CTA. */}
          <div className="text-center mt-6 px-2">
            <p className="text-[13px] text-gray-500 leading-[1.6] mb-3">
              First time here?
            </p>
            <Link
              href={`/signup${params.returnTo ? `?returnTo=${encodeURIComponent(params.returnTo)}` : ""}`}
              className="inline-flex items-center justify-center gap-2 w-full border-2 border-panda-dark text-panda-dark font-black text-[14px] py-3 rounded-[12px] uppercase tracking-[0.08em] hover:bg-panda-dark hover:text-panda-yellow transition-colors"
            >
              Create an account in 30 seconds
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <p className="text-[12px] text-gray-400 mt-3 leading-[1.6]">
              Sign-in here is for existing customers. New customers need to create an account first.
            </p>
          </div>

          <p className="text-[12px] text-gray-400 text-center mt-8 leading-[1.6]">
            Guest checkout still works. You do not need an account to place an order. Sign in only if you want to track delivery and reorder past designs.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
