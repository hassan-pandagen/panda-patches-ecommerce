import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { requireUser } from "@/lib/supabase/guards";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "My Orders | Panda Patches",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 20;

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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { supabase } = await requireUser("/account/orders");

  const { data: orders, count } = await supabase
    .from("orders")
    .select("id, created_at, status, payment_status, amount_paid, patches_type, patches_quantity, design_size, design_backing", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows = orders || [];

  return (
    <main className="min-h-screen bg-[#F9FAF5]">
      <Navbar />
      <section className="w-full pt-10 md:pt-14 pb-10 md:pb-16">
        <div className="container mx-auto px-6 max-w-[1000px]">

          <Link href="/account" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-panda-dark mb-4 transition-colors">
            <ChevronLeft size={14} /> Back to account
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-2">My Account &middot; Orders</p>
              <h1 className="text-[32px] md:text-[42px] font-black text-panda-dark leading-[1.1] tracking-tight">
                My Orders
              </h1>
              <p className="text-[14px] text-gray-500 mt-2">{total} order{total === 1 ? "" : "s"} total</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
            {rows.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <p className="text-[15px] text-gray-500 mb-4">You have not placed an order yet.</p>
                <Link href="/custom-patches" className="inline-block bg-panda-dark text-panda-yellow font-black text-[14px] px-6 py-3 rounded-full uppercase tracking-wider hover:scale-105 transition-transform">
                  Browse Patches
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {rows.map((o: any) => (
                  <Link
                    key={o.id}
                    href={`/account/orders/${o.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-5 hover:bg-[#F9FAF5] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-panda-dark truncate">
                        {o.patches_type || "Custom Patch Order"}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        {formatDate(o.created_at)} &middot; {o.patches_quantity || 0} pcs &middot; {o.design_size || "-"} &middot; {o.design_backing || "-"}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1 font-mono">#{String(o.id).slice(0, 8)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {statusBadge(o.status, o.payment_status)}
                      <span className="text-[15px] font-black text-panda-dark">
                        ${(o.amount_paid || 0).toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={`/account/orders?page=${page - 1}`}
                  className="px-6 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-colors text-sm"
                >
                  Previous
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/account/orders?page=${page + 1}`}
                  className="px-6 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-colors text-sm"
                >
                  Next
                </Link>
              )}
            </div>
          )}

        </div>
      </section>
      <Footer />
    </main>
  );
}
