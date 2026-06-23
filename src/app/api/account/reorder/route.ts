import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculatePatchPrice } from "@/lib/pricingCalculator";
import { applyEconomyDiscount, applyVelcroPricing, getRushSurcharge, resolveBaseUrl } from "@/lib/checkoutConfig";
import { createSquarePaymentLink } from "@/lib/square";

export const runtime = "nodejs";

// Service-role client for the square_pending_orders insert (RLS-protected, server-only).
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * POST /api/account/reorder
 *
 * Body: form-encoded or JSON { orderId: string }
 * Behavior: signed-in customer clicks "Reorder & Pay Now" on the order detail
 * page. We read the original order via RLS (so the customer can't reorder
 * someone else's), re-price using the live calculator (loyalty price-lock for
 * reorders within a year), park the order in square_pending_orders, create a
 * Square Payment Link, and 303-redirect the browser to Square. The Square
 * webhook creates the paid order tagged with the same user_id so it appears in
 * their portal automatically.
 */
export async function POST(req: Request) {
  let orderId: string | null = null;
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    orderId = body.orderId || null;
  } else {
    const form = await req.formData();
    orderId = (form.get("orderId") as string) || null;
  }

  if (!orderId) {
    return NextResponse.redirect(new URL("/account/orders?reason=missing-id", req.url), { status: 303 });
  }

  // Read the original order — RLS enforces ownership.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(`/login?returnTo=${encodeURIComponent("/account/orders")}`, req.url),
      { status: 303 }
    );
  }

  const { data: original, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !original) {
    return NextResponse.redirect(new URL("/account/orders?reason=not-found", req.url), { status: 303 });
  }

  // Parse size from whatever the original row stored. Width-x-height first, then
  // a single leading number (square assumption), else default 3x3.
  const sizeStr = (original.design_size || "").toString();
  const dimsMatch = sizeStr.match(/([\d.]+)\s*"?\s*x\s*([\d.]+)/i);
  const singleMatch = sizeStr.match(/([\d.]+)/);
  const width = dimsMatch ? parseFloat(dimsMatch[1]) : singleMatch ? parseFloat(singleMatch[1]) : 3;
  const height = dimsMatch ? parseFloat(dimsMatch[2]) : singleMatch ? parseFloat(singleMatch[1]) : 3;
  const quantity = Math.max(5, parseInt(original.patches_quantity || "5", 10));
  const productName = original.patches_type || "Custom Embroidered Patches";
  const backing = original.design_backing || "Iron-On";
  const deliveryOption = original.delivery_option || "standard";

  // Re-price using the current calculator — baseline for a brand-new order today.
  const priceResult = calculatePatchPrice(productName, width, height, quantity);
  if (priceResult.error) {
    return NextResponse.redirect(new URL(`/account/orders/${orderId}?reason=pricing`, req.url), { status: 303 });
  }

  const velcroAdjusted = applyVelcroPricing(priceResult.totalPrice, backing, quantity);
  const patchSubtotalNow = applyEconomyDiscount(velcroAdjusted, deliveryOption);
  const rushSurchargeNow = deliveryOption === "rush" ? getRushSurcharge(quantity) : 0;
  const finalPriceNow = Math.round((patchSubtotalNow + rushSurchargeNow) * 100) / 100;

  // Loyalty price-lock: reorders within 365 days honor the original unit price
  // (never above today's catalog). Older reorders re-price at current rates.
  const originalAmountPaid = Number(original.amount_paid) || 0;
  const originalPaidAt = original.paid_at ? new Date(original.paid_at) : null;
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const isWithinYear = originalPaidAt && Date.now() - originalPaidAt.getTime() < oneYearMs;
  const honorOldPrice = isWithinYear && originalAmountPaid > 0 && originalAmountPaid < finalPriceNow;

  const patchSubtotal = honorOldPrice ? Math.max(0, originalAmountPaid - rushSurchargeNow) : patchSubtotalNow;
  const finalPrice = Math.round((patchSubtotal + rushSurchargeNow) * 100) / 100;

  const baseUrl = resolveBaseUrl(req.headers.get("origin"));
  const originalRef = original.order_number || `#${orderId}`;

  // Park the full order payload; the Square webhook reads it back on payment.
  const token = randomUUID();
  const orderData = {
    customer_name: original.customer_name || user.email || "Customer",
    customer_email: user.email || original.customer_email || "",
    customer_phone: original.customer_phone || "",
    shipping_address: (original.shipping_address || "").substring(0, 500),
    product_name: productName,
    quantity,
    backing: backing || "",
    design_size: `${width}" x ${height}"`,
    artwork_url:
      Array.isArray(original.customer_attachment_urls) && original.customer_attachment_urls[0]
        ? String(original.customer_attachment_urls[0])
        : "",
    instructions: [`Reorder of ${originalRef}`, original.instructions].filter(Boolean).join(" | ").substring(0, 500),
    delivery_option: deliveryOption,
    rush_date: "",
    website_addons: Array.isArray(original.website_addons) ? original.website_addons : null,
    order_amount: finalPrice,
    attribution: {
      source: "reorder",
      reorder_of: String(orderId),
      reorder_price_honored: honorOldPrice ? "loyalty" : "current",
      reorder_original_amount: originalAmountPaid.toFixed(2),
      reorder_current_amount: finalPriceNow.toFixed(2),
    },
    user_id: user.id,
  };

  const { error: pendingErr } = await admin.from("square_pending_orders").insert({ token, order_data: orderData });
  if (pendingErr) {
    console.error("[reorder] square_pending_orders insert failed:", pendingErr);
    return NextResponse.redirect(new URL(`/account/orders/${orderId}?reason=checkout`, req.url), { status: 303 });
  }

  try {
    const { url } = await createSquarePaymentLink({
      token,
      itemName: `${productName} (${width}" x ${height}") - Reorder`.substring(0, 255),
      amount: finalPrice,
      buyerEmail: user.email || undefined,
      redirectUrl: `${baseUrl}/success?provider=square&ref=${token}&value=${finalPrice}`,
      metadata: { reorder_of: String(orderId).substring(0, 40) },
    });
    return NextResponse.redirect(url, { status: 303 });
  } catch (e) {
    console.error("[reorder] Square payment link failed:", e);
    return NextResponse.redirect(new URL(`/account/orders/${orderId}?reason=checkout`, req.url), { status: 303 });
  }
}
