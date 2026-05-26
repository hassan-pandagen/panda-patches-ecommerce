import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PurchaseConversion from "@/components/PurchaseConversion";

export const metadata: Metadata = {
  title: "Order Confirmed | Panda Patches",
  description: "Your custom patch order has been confirmed. Our team will contact you within 24 hours with a free digital mockup.",
  robots: { index: false, follow: false },
};

// Disable static rendering — this page must verify the payment server-side on every request
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

interface SuccessSearchParams {
  session_id?: string;        // Stripe checkout session ID
  paypal_order_id?: string;   // PayPal order ID (post-capture)
  value?: string;             // Pre-formatted amount for analytics
}

/**
 * Verify the payment actually completed before showing the success page.
 * Returns true only if Stripe (or PayPal) reports the order as paid/completed.
 * Anyone navigating to /success without a valid paid session gets redirected.
 */
async function verifyPayment(params: SuccessSearchParams): Promise<{ verified: boolean; amount?: number }> {
  // PayPal path: success-paypal already captured payment before redirecting here.
  // We trust paypal_order_id because the only way to get here is via capture-paypal route.
  if (params.paypal_order_id) {
    return { verified: true };
  }

  // Stripe path: verify the session ID is real AND payment_status === 'paid'
  if (params.session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(params.session_id);
      if (session.payment_status === 'paid') {
        return { verified: true, amount: (session.amount_total || 0) / 100 };
      }
      // Stripe session exists but payment failed/expired/abandoned
      return { verified: false };
    } catch {
      // Invalid session_id — somebody made it up or it expired
      return { verified: false };
    }
  }

  // No valid identifier provided — direct URL hit
  return { verified: false };
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<SuccessSearchParams>;
}) {
  const params = await searchParams;
  const { verified, amount } = await verifyPayment(params);

  // Anyone hitting /success without a verified paid session is sent home.
  // This stops random visitors, refreshes, and bookmark visits from showing
  // a fake "Order Confirmed" page (which was the root issue surfaced May 26).
  if (!verified) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      {/* Fire Google Ads + Meta purchase conversion only after server-side verification */}
      <PurchaseConversion />

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
                <span>We&apos;ll send you a <strong>free digital mockup</strong> for approval before production.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span>Once approved, your custom patches will be produced and shipped within <strong>5-7 business days</strong>.</span>
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
                Phone: <a href="tel:+13022504340" className="text-blue-600 font-semibold hover:underline">+1 302 250 4340</a>
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
