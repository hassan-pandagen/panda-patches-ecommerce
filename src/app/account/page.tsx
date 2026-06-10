import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { requireUser } from "@/lib/supabase/guards";
import { Package, User, ShoppingBag, LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: "My Account | Panda Patches",
  robots: { index: false, follow: false },
};

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "-";
  }
}

function statusBadge(status?: string | null, paymentStatus?: string | null) {
  const s = (status || "").toUpperCase();
  const p = (paymentStatus || "").toLowerCase();
  let label = s || (p ? p.charAt(0).toUpperCase() + p.slice(1) : "Pending");
  let cls = "bg-gray-100 text-gray-700";
  if (p === "paid" || s === "PAID" || s === "CONFIRMED") {
    label = "Paid";
    cls = "bg-green-100 text-green-800";
  } else if (s === "SHIPPED") {
    label = "Shipped";
    cls = "bg-blue-100 text-blue-800";
  } else if (s === "DELIVERED") {
    label = "Delivered";
    cls = "bg-emerald-100 text-emerald-800";
  } else if (s === "IN_PRODUCTION") {
    label = "In Production";
    cls = "bg-amber-100 text-amber-800";
  } else if (s === "MOCKUP_SENT" || s === "PENDING") {
    label = s === "MOCKUP_SENT" ? "Mockup Sent" : "Pending";
    cls = "bg-yellow-100 text-yellow-800";
  }
  return <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${cls}`}>{label}</span>;
}

export default async function AccountDashboardPage() {
  const { user, supabase } = await requireUser("/account");

  // Profile (may be null if signup trigger hasn't fired yet for this user)
  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  // Recent orders (RLS keeps this user-scoped)
  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, status, payment_status, amount_paid, patches_type, patches_quantity")
    .order("created_at", { ascending: false })
    .limit(5);

  // Greet with the first token of full_name (cleaner than full name).
  // Fall back to email prefix if profile or full_name is empty.
  const displayName =
    (profile?.full_name || "").trim().split(/\s+/)[0] ||
    user.email?.split("@")[0] ||
    "there";
  const recentOrders = orders || [];

  return (
    <main className="min-h-screen bg-[#F9FAF5]">
      <Navbar />
      <section className="w-full pt-10 md:pt-14 pb-10 md:pb-16">
        <div className="container mx-auto px-6 max-w-[1000px]">

          {/* Greeting */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-2">My Account</p>
              <h1 className="text-[32px] md:text-[42px] font-black text-panda-dark leading-[1.1] tracking-tight">
                Welcome back, {displayName}
              </h1>
              <p className="text-[14px] text-gray-500 mt-2">Signed in as {user.email}</p>
            </div>
            <form action="/auth/signout" method="post">
              <button type="submit" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-panda-dark transition-colors">
                <LogOut size={14} /> Sign Out
              </button>
            </form>
          </div>

          {/* Quick tiles */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <Link href="/account/orders" className="group block bg-white border border-gray-200 rounded-[16px] p-6 hover:shadow-lg transition-shadow">
              <Package className="text-panda-green mb-3" size={28} strokeWidth={2.5} />
              <h2 className="text-[16px] font-black text-panda-dark mb-1">My Orders</h2>
              <p className="text-[13px] text-gray-500 leading-[1.6]">View order history, track delivery, and reorder.</p>
            </Link>
            <Link href="/account/profile" className="group block bg-white border border-gray-200 rounded-[16px] p-6 hover:shadow-lg transition-shadow">
              <User className="text-panda-green mb-3" size={28} strokeWidth={2.5} />
              <h2 className="text-[16px] font-black text-panda-dark mb-1">My Profile</h2>
              <p className="text-[13px] text-gray-500 leading-[1.6]">Update your name, phone, and default shipping address.</p>
            </Link>
            {/* Lands the customer directly on the embroidered product page
                where the live calculator + checkout form are above the fold,
                instead of the catalog browse page where they would have to
                click through to a product first. Embroidered is the most-
                ordered type and matches the tile's "live calculator" copy. */}
            <Link href="/custom-patches/embroidered" className="group block bg-white border border-gray-200 rounded-[16px] p-6 hover:shadow-lg transition-shadow">
              <ShoppingBag className="text-panda-green mb-3" size={28} strokeWidth={2.5} />
              <h2 className="text-[16px] font-black text-panda-dark mb-1">Place a New Order</h2>
              <p className="text-[13px] text-gray-500 leading-[1.6]">Start a new patch order with our live calculator.</p>
            </Link>
          </div>

          {/* Recent orders */}
          <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-[18px] font-black text-panda-dark">Recent Orders</h2>
              <Link href="/account/orders" className="text-[13px] font-bold text-panda-green hover:underline">
                View all &rarr;
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-[15px] text-gray-500 mb-4">You have not placed an order yet.</p>
                <Link href="/custom-patches" className="inline-block bg-panda-dark text-panda-yellow font-black text-[14px] px-6 py-3 rounded-full uppercase tracking-wider hover:scale-105 transition-transform">
                  Browse Patches
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((o: any) => (
                  <Link
                    key={o.id}
                    href={`/account/orders/${o.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#F9FAF5] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-panda-dark truncate">
                        {o.patches_type || "Custom Patch Order"}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        {formatDate(o.created_at)} &middot; {o.patches_quantity || 0} pcs &middot; #{String(o.id).slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                      {statusBadge(o.status, o.payment_status)}
                      <span className="text-[14px] font-black text-panda-dark hidden sm:inline">
                        ${(o.amount_paid || 0).toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
      <Footer />
    </main>
  );
}
