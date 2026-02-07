import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function SuccessContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

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
            Thank you for your order. We've received your payment successfully.
          </p>

          {/* Info Box */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-panda-dark mb-4">What's Next?</h2>
            <ul className="text-left space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span>You'll receive an <strong>order confirmation email</strong> shortly with your order details.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span>Our design team will review your requirements and contact you within <strong>24 hours</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span>We'll send you a <strong>free digital mockup</strong> for approval before production.</span>
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
            <p className="text-gray-600 mb-3">Our team is here to help!</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                Email: <a href="mailto:admin@pandapatches.com" className="text-blue-600 font-semibold hover:underline">admin@pandapatches.com</a>
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-panda-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
