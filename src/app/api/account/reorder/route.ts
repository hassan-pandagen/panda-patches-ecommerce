import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculatePatchPrice } from "@/lib/pricingCalculator";
import { applyEconomyDiscount, applyVelcroPricing, getRushSurcharge, resolveBaseUrl } from "@/lib/checkoutConfig";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

/**
 * POST /api/account/reorder
 *
 * Body: form-encoded { orderId: string }
 * Behavior: signed-in customer clicks "Reorder & Pay Now" on the order detail
 * page. We read the original order via RLS (so the customer can't reorder
 * someone else's), re-price using the live calculator (in case prices have
 * changed since the original purchase), create a new Stripe Checkout session,
 * and 303-redirect the browser to Stripe.
 *
 * The new order is tagged with the same user_id so it appears in their portal
 * automatically once paid.
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

  // Parse size from whatever the original row stored. Real-world shapes
  // we've seen in production:
  //   - Website checkout:        `3" x 3"` or `3 x 3`
  //   - CRM hand-entered:        `12 inches`, `12in`, `12"`, `12.5 inch`
  //   - Legacy quote-form:       `3" round` or `3 inch round`
  // The width-x-height regex runs first. If no `x` is found, we fall back to
  // parsing the leading number and use it for both width and height (square
  // assumption, which matches how most single-dimension entries describe a
  // round or square patch). If we cannot parse anything, we default to 3x3
  // which is the most common embroidered patch size and the safest fallback.
  const sizeStr = (original.design_size || "").toString();
  const dimsMatch = sizeStr.match(/([\d.]+)\s*"?\s*x\s*([\d.]+)/i);
  const singleMatch = sizeStr.match(/([\d.]+)/);
  const width = dimsMatch
    ? parseFloat(dimsMatch[1])
    : singleMatch
      ? parseFloat(singleMatch[1])
      : 3;
  const height = dimsMatch
    ? parseFloat(dimsMatch[2])
    : singleMatch
      ? parseFloat(singleMatch[1])
      : 3;
  const quantity = Math.max(5, parseInt(original.patches_quantity || "5", 10));
  const productName = original.patches_type || "Custom Embroidered Patches";
  const backing = original.design_backing || "Iron-On";
  const deliveryOption = original.delivery_option || "standard";

  // Re-price using the current calculator. This is the BASELINE price we'd
  // charge a brand-new order with the same specs today.
  const priceResult = calculatePatchPrice(productName, width, height, quantity);
  if (priceResult.error) {
    return NextResponse.redirect(
      new URL(`/account/orders/${orderId}?reason=pricing`, req.url),
      { status: 303 }
    );
  }

  const velcroAdjusted = applyVelcroPricing(priceResult.totalPrice, backing, quantity);
  const patchSubtotalNow = applyEconomyDiscount(velcroAdjusted, deliveryOption);
  const rushSurchargeNow = deliveryOption === "rush" ? getRushSurcharge(quantity) : 0;
  const finalPriceNow = Math.round((patchSubtotalNow + rushSurchargeNow) * 100) / 100;

  // Loyalty price-lock policy:
  //   * Reorders within 365 days of the original order honor the original
  //     unit price so repeat customers never see sticker shock.
  //   * Reorders older than 365 days re-price at current rates so we do not
  //     eat losses on outdated material costs.
  //   * If current price is LOWER than original, ALWAYS use current so we
  //     never overcharge a loyal customer relative to today's catalog.
  // The original price is derived from the historical amount_paid (the row
  // is the source of truth for what they were actually charged, including
  // any one-off adjustments). When amount_paid is missing or junk, we
  // gracefully fall through to current pricing.
  const originalAmountPaid = Number(original.amount_paid) || 0;
  const originalPaidAt = original.paid_at ? new Date(original.paid_at) : null;
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const isWithinYear =
    originalPaidAt && Date.now() - originalPaidAt.getTime() < oneYearMs;
  const honorOldPrice =
    isWithinYear &&
    originalAmountPaid > 0 &&
    originalAmountPaid < finalPriceNow;

  // patchSubtotal is the patch line (qty * unit). rushSurcharge is added as
  // a separate Stripe line item. If we honor the old price, we proportionally
  // back out the old rush surcharge so the unit price reflects what the
  // customer remembers, then re-apply current rush logic. In practice rush
  // pricing is rarely the same on reorder anyway, but this keeps the line
  // breakdown honest in Stripe and on the receipt.
  const patchSubtotal = honorOldPrice
    ? Math.max(0, originalAmountPaid - rushSurchargeNow)
    : patchSubtotalNow;
  const rushSurcharge = rushSurchargeNow;
  const finalPrice = Math.round((patchSubtotal + rushSurcharge) * 100) / 100;

  const baseUrl = resolveBaseUrl(req.headers.get("origin"));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `${productName} (${width}" x ${height}") — Reorder`,
          description: `${backing ? `Backing: ${backing} | ` : ""}Qty: ${quantity}`,
        },
        unit_amount: Math.round((patchSubtotal / quantity) * 100),
      },
      quantity,
    },
  ];

  if (rushSurcharge > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Rush Production" },
        unit_amount: Math.round(rushSurcharge * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: user.email,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&value=${finalPrice}`,
    cancel_url: `${baseUrl}/account/orders/${orderId}`,
    metadata: {
      customer_name: original.customer_name || user.email || "Customer",
      customer_email: user.email || original.customer_email || "",
      customer_phone: original.customer_phone || "",
      shipping_address: (original.shipping_address || "").substring(0, 500),
      product_name: productName,
      quantity: String(quantity),
      backing: backing || "",
      design_size: `${width}" x ${height}"`,
      artwork_url: Array.isArray(original.customer_attachment_urls) && original.customer_attachment_urls[0]
        ? String(original.customer_attachment_urls[0])
        : "",
      instructions: (original.instructions || "").substring(0, 500),
      delivery_option: deliveryOption,
      website_addons: Array.isArray(original.website_addons) ? original.website_addons.join(", ") : "",
      order_amount: String(finalPrice),
      user_id: user.id,
      reorder_of: String(orderId),
      // Audit trail for the loyalty price-lock policy. If you ever need to
      // refund the difference, recompute pricing, or just see how many
      // reorders honored the old price, these three fields make it queryable
      // straight from the Stripe dashboard.
      reorder_price_honored: honorOldPrice ? "loyalty" : "current",
      reorder_original_amount: String(originalAmountPaid.toFixed(2)),
      reorder_current_amount: String(finalPriceNow.toFixed(2)),
    },
  });

  if (!session.url) {
    return NextResponse.redirect(
      new URL(`/account/orders/${orderId}?reason=stripe-fail`, req.url),
      { status: 303 }
    );
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
