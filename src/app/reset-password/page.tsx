import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ResetPasswordClient from "@/components/auth/ResetPasswordClient";

export const metadata: Metadata = {
  title: "Set New Password | Panda Patches",
  description: "Set a new password for your Panda Patches account.",
  alternates: { canonical: "https://www.pandapatches.com/reset-password" },
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="w-full pt-10 md:pt-14 pb-10 md:pb-16">
        <div className="container mx-auto px-6 max-w-[480px]">
          <h1 className="text-[32px] md:text-[40px] font-black text-panda-dark leading-[1.1] tracking-tight mb-2 text-center">
            Set a new password
          </h1>
          <p className="text-[15px] text-gray-600 leading-[1.6] mb-8 text-center">
            Choose a strong password. At least 8 characters.
          </p>

          <ResetPasswordClient />
        </div>
      </section>
      <Footer />
    </main>
  );
}
