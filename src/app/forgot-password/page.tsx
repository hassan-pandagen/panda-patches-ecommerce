import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ForgotPasswordClient from "@/components/auth/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password | Panda Patches",
  description: "Reset your Panda Patches account password.",
  alternates: { canonical: "https://www.pandapatches.com/forgot-password" },
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="w-full pt-10 md:pt-14 pb-10 md:pb-16">
        <div className="container mx-auto px-6 max-w-[480px]">
          <h1 className="text-[32px] md:text-[40px] font-black text-panda-dark leading-[1.1] tracking-tight mb-2 text-center">
            Reset your password
          </h1>
          <p className="text-[15px] text-gray-600 leading-[1.6] mb-8 text-center">
            Enter the email tied to your account and we will send a reset link.
          </p>

          <ForgotPasswordClient />

          <p className="text-[13px] text-gray-500 text-center mt-6">
            Remembered your password?{" "}
            <Link href="/login" className="text-panda-green font-bold hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
