import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { requireUser } from "@/lib/supabase/guards";
import { ChevronLeft, CheckCircle, Circle, Clock, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Details | Panda Patches",
  robots: { index: false, follow: false },
};

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "-";
  }
}

interface TimelineStep {
  label: string;
  date?: string | null;
  done: boolean;
  current?: boolean;
}

function buildTimeline(order: any): TimelineStep[] {
  const s = (order.status || "").toUpperCase();
  const p = (order.payment_status || "").toLowerCase();
  // CRM-side statuses we recognize: NEW_ORDER, PAID, CONFIRMED, MOCKUP_SENT,
  // IN_PRODUCTION, PRODUCTION_COMPLETE, SHIPPED, DELIVERED. We treat
  // PRODUCTION_COMPLETE the same as IN_PRODUCTION for the timeline (the next
  // visible step is still "Shipped" until tracking goes out). NEW_ORDER on
  // its own does not advance the timeline beyond "Order placed".
  const paid =
    p === "paid" ||
    s === "PAID" ||
    s === "CONFIRMED" ||
    s === "MOCKUP_SENT" ||
    s === "IN_PRODUCTION" ||
    s === "PRODUCTION_COMPLETE" ||
    s === "SHIPPED" ||
    s === "DELIVERED";
  const mockupSent =
    s === "MOCKUP_SENT" ||
    s === "IN_PRODUCTION" ||
    s === "PRODUCTION_COMPLETE" ||
    s === "SHIPPED" ||
    s === "DELIVERED";
  const inProduction =
    s === "IN_PRODUCTION" ||
    s === "PRODUCTION_COMPLETE" ||
    s === "SHIPPED" ||
    s === "DELIVERED";
  const shipped = s === "SHIPPED" || s === "DELIVERED";
  const delivered = s === "DELIVERED";

  return [
    { label: "Order placed", date: order.created_at, done: true },
    { label: "Payment received", date: order.paid_at, done: paid, current: paid && !mockupSent },
    { label: "Mockup sent for approval", done: mockupSent, current: mockupSent && !inProduction },
    { label: "In production", done: inProduction, current: inProduction && !shipped },
    { label: "Shipped", done: shipped, current: shipped && !delivered },
    { label: "Delivered", done: delivered, current: delivered },
  ];
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireUser(`/account/orders/${id}`);

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !order) {
    notFound();
  }

  const timeline = buildTimeline(order);
  const artworkUrls: string[] = Array.isArray(order.customer_attachment_urls) ? order.customer_attachment_urls.filter(Boolean) : [];

  const reorderQuery = new URLSearchParams({
    type: order.patches_type || "",
    size: order.design_size || "",
    qty: String(order.patches_quantity || ""),
    backing: order.design_backing || "",
  }).toString();

  // Loyalty price-lock window. Mirrors the rule in /api/account/reorder so
  // the customer copy matches what they will actually be charged. Orders
  // paid within the last 365 days reorder at the original unit price.
  const paidAtMs = order.paid_at ? new Date(order.paid_at).getTime() : 0;
  const isWithinLoyaltyWindow =
    paidAtMs > 0 && Date.now() - paidAtMs < 365 * 24 * 60 * 60 * 1000;

  return (
    <main className="min-h-screen bg-[#F9FAF5]">
      <Navbar />
      <section className="w-full pt-10 md:pt-14 pb-10 md:pb-16">
        <div className="container mx-auto px-6 max-w-[1000px]">

          <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-panda-dark mb-4 transition-colors">
            <ChevronLeft size={14} /> Back to orders
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[2px] text-panda-green mb-2">Order Details</p>
              <h1 className="text-[28px] md:text-[36px] font-black text-panda-dark leading-[1.1] tracking-tight">
                {order.patches_type || "Custom Patch Order"}
              </h1>
              <p className="text-[13px] text-gray-500 mt-2 font-mono">
                Order #{String(order.id).slice(0, 8)} &middot; placed {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT: Timeline + Summary */}
            <div className="lg:col-span-2 space-y-6">

              {/* Status timeline */}
              <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-7">
                <h2 className="text-[16px] font-black text-panda-dark uppercase tracking-wider mb-5">Order Status</h2>
                <ol className="space-y-4">
                  {timeline.map((step, i) => {
                    const Icon = step.done ? CheckCircle : step.current ? Clock : Circle;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <Icon
                          className={`flex-shrink-0 mt-0.5 ${
                            step.done ? "text-panda-green" : step.current ? "text-amber-500" : "text-gray-300"
                          }`}
                          size={20}
                          strokeWidth={2.5}
                        />
                        <div className="flex-1">
                          <p className={`text-[14px] font-bold ${step.done || step.current ? "text-panda-dark" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          {step.date && (
                            <p className="text-[12px] text-gray-500 mt-0.5">{formatDate(step.date)}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Order summary */}
              <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-7">
                <h2 className="text-[16px] font-black text-panda-dark uppercase tracking-wider mb-5">Order Summary</h2>
                <dl className="grid grid-cols-3 gap-y-3 text-[14px]">
                  {order.design_name && (
                    <>
                      <dt className="col-span-1 text-gray-500">Design name</dt>
                      <dd className="col-span-2 font-semibold text-panda-dark break-words">{order.design_name}</dd>
                    </>
                  )}
                  <dt className="col-span-1 text-gray-500">Patch type</dt>
                  <dd className="col-span-2 font-semibold text-panda-dark">{order.patches_type || "-"}</dd>
                  <dt className="col-span-1 text-gray-500">Size</dt>
                  <dd className="col-span-2 font-semibold text-panda-dark">{order.design_size || "-"}</dd>
                  <dt className="col-span-1 text-gray-500">Quantity</dt>
                  <dd className="col-span-2 font-semibold text-panda-dark">{order.patches_quantity || 0} pcs</dd>
                  <dt className="col-span-1 text-gray-500">Backing</dt>
                  <dd className="col-span-2 font-semibold text-panda-dark">{order.design_backing || "-"}</dd>
                  {order.instructions && (
                    <>
                      <dt className="col-span-1 text-gray-500">Notes</dt>
                      <dd className="col-span-2 text-panda-dark whitespace-pre-wrap break-words">{order.instructions}</dd>
                    </>
                  )}
                  {artworkUrls.length > 0 && (
                    <>
                      <dt className="col-span-1 text-gray-500">Artwork</dt>
                      <dd className="col-span-2">
                        {/* Render each artwork as a clickable thumbnail. We
                            cannot trust Sanity's image pipeline here because
                            uploads land on Supabase Storage from the website
                            and on cdn.pandapatches.com from the CRM. A plain
                            <img> tag handles both. Files that the browser
                            cannot render (PDF, AI, EPS, SVG of unknown
                            origin) fall through to a labeled chip via the
                            onError handler so the customer sees something
                            useful instead of a broken-image icon. */}
                        <div className="flex flex-wrap gap-3">
                          {artworkUrls.map((url, i) => {
                            const lower = String(url).toLowerCase();
                            const isImage =
                              /\.(png|jpe?g|gif|webp|avif|bmp|svg)(\?|$)/i.test(lower);
                            return (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open original artwork"
                                className="group inline-flex flex-col items-center gap-1.5"
                              >
                                {isImage ? (
                                  <span className="block w-[88px] h-[88px] rounded-[10px] overflow-hidden border border-gray-200 bg-gray-50 group-hover:border-panda-green transition-colors">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={url}
                                      alt={`Artwork file ${i + 1}`}
                                      width={88}
                                      height={88}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  </span>
                                ) : (
                                  <span className="flex w-[88px] h-[88px] items-center justify-center rounded-[10px] border border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider group-hover:border-panda-green group-hover:text-panda-dark transition-colors">
                                    {(lower.match(/\.([a-z0-9]{2,4})(\?|$)/) || [, "file"])[1]}
                                  </span>
                                )}
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-panda-green group-hover:underline">
                                  File {i + 1} <ExternalLink size={10} />
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </dd>
                    </>
                  )}
                </dl>
              </div>

            </div>

            {/* RIGHT: Total + Actions */}
            <div className="space-y-6">

              <div className="bg-panda-dark text-white rounded-[20px] p-6 md:p-7">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Paid</p>
                <p className="text-[36px] font-black text-panda-yellow leading-none">
                  ${(order.amount_paid || 0).toFixed(2)}
                </p>
                {order.paid_at && (
                  <p className="text-[12px] text-gray-400 mt-3">Paid {formatDate(order.paid_at)}</p>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-7 space-y-3">
                <h2 className="text-[14px] font-black text-panda-dark uppercase tracking-wider mb-2">Order Again</h2>

                <form action="/api/account/reorder" method="post">
                  <input type="hidden" name="orderId" value={order.id} />
                  <button
                    type="submit"
                    className="w-full bg-panda-dark text-panda-yellow font-black text-[14px] py-3 rounded-full uppercase tracking-wider hover:scale-[1.02] transition-transform"
                  >
                    Reorder &amp; Pay Now
                  </button>
                </form>

                <Link
                  href={`/contact?${reorderQuery}`}
                  className="block w-full text-center bg-white border-2 border-panda-dark text-panda-dark font-black text-[14px] py-3 rounded-full uppercase tracking-wider hover:bg-panda-dark hover:text-panda-yellow transition-colors"
                >
                  Get a New Quote
                </Link>

                {isWithinLoyaltyWindow && (
                  <div className="bg-panda-green/10 border border-panda-green/30 rounded-[10px] px-3 py-2.5 text-center">
                    <p className="text-[11px] font-bold text-panda-dark leading-[1.5]">
                      🛡 Loyalty price-lock applies. You will be charged the
                      same price you paid last time.
                    </p>
                  </div>
                )}

                <p className="text-[11px] text-gray-400 text-center leading-[1.6] pt-2">
                  &quot;Reorder &amp; Pay&quot; takes you straight to checkout with the same specs.
                  &quot;Get a New Quote&quot; opens the quote form so you can tweak details first.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-7">
                <h2 className="text-[14px] font-black text-panda-dark uppercase tracking-wider mb-3">Need Help?</h2>
                <p className="text-[13px] text-gray-500 leading-[1.7] mb-3">
                  Email <a href="mailto:lance@pandapatches.com" className="text-panda-green font-bold hover:underline">lance@pandapatches.com</a> with your order number for support.
                </p>
                <p className="text-[13px] text-gray-500 leading-[1.7]">
                  Or call <a href="tel:+13022504340" className="text-panda-green font-bold hover:underline">(302) 250-4340</a>.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>
      <Footer />
    </main>
  );
}
