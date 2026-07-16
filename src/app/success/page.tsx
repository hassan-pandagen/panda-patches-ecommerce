import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PurchaseConversion from "@/components/PurchaseConversion";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Order Confirmed | Panda Patches",
  description: "Your custom patch order has been confirmed. Our team will contact you in 12 to 24 hours with a digital mockup.",
  robots: { index: false, follow: false },
};

// Disable static rendering — this page must verify the payment server-side on every request
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface SuccessSearchParams {
  provider?: string; // 'square'
  ref?: string;      // Square: our square_pending_orders token
  value?: string;    // Pre-formatted amount for analytics
}

/**
 * Verify the payment ACTUALLY COMPLETED before firing conversions (audit P1).
 * The Square webhook stamps `consumed_at` on payment — a token alone only proves
 * a checkout was STARTED, so previously a refresh (or a fabricated value param)
 * re-fired purchase conversions for unpaid checkouts. We poll briefly to absorb
 * webhook lag behind Square's redirect; the amount always comes from the stored
 * order, never the user-editable ?value= param.
 */
async function verifyPayment(
  params: SuccessSearchParams
): Promise<{ verified: boolean; paymentPending?: boolean; amount?: number; orderNumber?: string }> {
  if (!params.ref) return { verified: false };
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data } = await supabase
        .from("square_pending_orders")
        .select("order_data, consumed_at")
        .eq("token", params.ref)
        .maybeSingle();
      if (!data) return { verified: false };
      const stored = (data.order_data as { order_amount?: number })?.order_amount;
      const amt = stored ?? (params.value ? parseFloat(params.value) : undefined);
      if (data.consumed_at) {
        // Webhook processed → the order row exists. Resolve its order_number (the
        // value the PostgreSQL export maps to Transaction ID) so the browser
        // Google Ads Purchase tag can send a matching transaction_id and Google
        // dedupes the tag against the Data Manager import — no double-count
        // (claude-code-task-website-conversions.md Fix 2). The webhook stamps
        // attribution.checkout_token = this token on the order.
        const { data: order } = await supabase
          .from("orders")
          .select("order_number, amount_paid")
          .eq("attribution->>checkout_token", params.ref)
          .maybeSingle();
        return {
          verified: true,
          amount: (order?.amount_paid as number | undefined) ?? amt,
          orderNumber: (order?.order_number as string | undefined) ?? undefined,
        };
      }
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1500));
      } else {
        // Real checkout token, webhook not yet processed — show the page (Square
        // did redirect the buyer) but DON'T fire browser conversions; the webhook
        // fires Meta CAPI + GA4 server-side when it lands.
        return { verified: true, paymentPending: true, amount: amt };
      }
    }
  } catch {
    // fall through to unverified
  }
  return { verified: false };
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<SuccessSearchParams>;
}) {
  const params = await searchParams;
  const { verified, paymentPending, amount, orderNumber } = await verifyPayment(params);

  // Anyone hitting /success without a verified paid order is sent home. Stops
  // random visitors, refreshes, and bookmark visits from showing a fake receipt.
  if (!verified) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      {/* Browser purchase conversions fire ONLY for webhook-confirmed payments;
          if the webhook is still in flight, the server-side CAPI + GA4 events
          cover the conversion when it lands (audit P1). */}
      {!paymentPending && <PurchaseConversion orderNumber={orderNumber} amount={amount} />}

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">

          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-black text-panda-dark mb-4">
            Order Confirmed!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Thank you for your order. We&apos;ve received your payment successfully{amount ? `. Total: $${amount.toFixed(2)}` : ''}.
          </p>

          {/* Info Box */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-panda-dark mb-4">What&apos;s Next?</h2>
            <ul className="text-left space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span>You&apos;ll receive an <strong>order confirmation email</strong> shortly with your order details.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span>Our design team will review your requirements and contact you within <strong>24 hours</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span>We&apos;ll send you a <strong>digital mockup in 12 to 24 hours</strong> for approval before production.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span>Once approved, your custom patches will be produced and shipped within <strong>7-14 business days</strong> (rush orders in about 6-7).</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-[#F9FAF5] rounded-xl p-6 mb-8">
            <h3 className="font-bold text-lg text-panda-dark mb-2">Questions?</h3>
            <p className="text-gray-600 mb-3">Our team is here to help.</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                Email: <a href="mailto:hello@pandapatches.com" className="text-blue-600 font-semibold hover:underline">hello@pandapatches.com</a>
              </p>
              <p className="text-gray-700">
                Phone: <a href="tel:+13027738982" className="text-blue-600 font-semibold hover:underline">+1 302 773 8982</a>
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="bg-black text-panda-yellow px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:scale-105 transition-transform shadow-lg">
                Back to Home
              </button>
            </Link>
            <Link href="/custom-patches">
              <button className="bg-white text-panda-dark border-2 border-gray-300 px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:border-panda-green hover:bg-gray-50 transition-all">
                Order More Patches
              </button>
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
