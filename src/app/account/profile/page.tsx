import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { requireUser } from "@/lib/supabase/guards";
import { ChevronLeft } from "lucide-react";
import ProfileFormClient from "@/components/auth/ProfileFormClient";

export const metadata: Metadata = {
  title: "My Profile | Panda Patches",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const { user, supabase } = await requireUser("/account/profile");

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("full_name, phone, company_name, default_shipping_address")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-[#F9FAF5]">
      <Navbar />
      <section className="w-full pt-10 md:pt-14 pb-10 md:pb-16">
        <div className="container mx-auto px-6 max-w-[680px]">

          <Link href="/account" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-panda-dark mb-4 transition-colors">
            <ChevronLeft size={14} /> Back to account
          </Link>

          <div className="mb-8">
            <p className="text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-2">My Account &middot; Profile</p>
            <h1 className="text-[32px] md:text-[42px] font-black text-panda-dark leading-[1.1] tracking-tight">
              My Profile
            </h1>
            <p className="text-[14px] text-gray-500 mt-2">Signed in as {user.email}</p>
          </div>

          <ProfileFormClient
            initial={{
              full_name: profile?.full_name || "",
              phone: profile?.phone || "",
              company_name: profile?.company_name || "",
              default_shipping_address: profile?.default_shipping_address || "",
            }}
          />

        </div>
      </section>
      <Footer />
    </main>
  );
}
