import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SignupClient from "@/components/auth/SignupClient";
import { getCurrentUser } from "@/lib/supabase/guards";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Account | Panda Patches",
  description: "Create a Panda Patches account to track orders, view mockups, and reorder past designs.",
  alternates: { canonical: "https://www.pandapatches.com/signup" },
  robots: { index: false, follow: true },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; email?: string }>;
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
            Create an account
          </h1>
          <p className="text-[15px] text-gray-600 leading-[1.6] mb-8 text-center">
            Track orders, view mockups, and reorder past designs in one click.
          </p>

          <SignupClient returnTo={params.returnTo} initialEmail={params.email} />

          <p className="text-[13px] text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link
              href={`/login${params.returnTo ? `?returnTo=${encodeURIComponent(params.returnTo)}` : ""}`}
              className="text-panda-green font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
