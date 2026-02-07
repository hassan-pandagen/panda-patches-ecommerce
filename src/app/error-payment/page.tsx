import Link from "next/link";
import { XCircle, RefreshCcw, Mail, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navbar />

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">

          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle size={48} className="text-red-600" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-black text-panda-dark mb-4">
            Payment Failed
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            We couldn't process your payment. Don't worry, you haven't been charged.
          </p>

          {/* Common Issues Box */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 text-left">
            <h2 className="text-2xl font-bold text-panda-dark mb-4 text-center">Common Issues</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Insufficient funds</strong> - Please check your account balance</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Incorrect card details</strong> - Verify your card number, expiry date, and CVV</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Card declined by bank</strong> - Contact your bank to authorize the transaction</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Network timeout</strong> - Try again with a stable internet connection</span>
              </li>
            </ul>
          </div>

          {/* What to Do Box */}
          <div className="bg-[#F9FAF5] rounded-xl p-6 mb-8">
            <h3 className="font-bold text-lg text-panda-dark mb-4">What Should You Do?</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <RefreshCcw size={20} className="text-panda-green mt-1 flex-shrink-0" />
                <p className="text-left">
                  <strong>Try again</strong> - Most payment issues are temporary. Click the button below to retry your order.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-panda-green mt-1 flex-shrink-0" />
                <p className="text-left">
                  <strong>Contact us</strong> - We can help you complete your order manually or suggest alternative payment methods.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
            <h3 className="font-bold text-lg text-panda-dark mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-3">Our team is available 24/7</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Mail size={16} />
                <a href="mailto:admin@pandapatches.com" className="text-blue-600 font-semibold hover:underline">admin@pandapatches.com</a>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Phone size={16} />
                <a href="tel:+13022504340" className="text-blue-600 font-semibold hover:underline">+1 302 250 4340</a>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/custom-patches">
              <button className="bg-black text-panda-yellow px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
                <RefreshCcw size={20} />
                Try Again
              </button>
            </Link>
            <Link href="/">
              <button className="bg-white text-panda-dark border-2 border-gray-300 px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:border-panda-green hover:bg-gray-50 transition-all">
                Back to Home
              </button>
            </Link>
          </div>

          {/* Security Note */}
          <p className="text-sm text-gray-500 mt-8">
            🔒 All payments are secured with 256-bit SSL encryption via Stripe
          </p>

        </div>
      </div>

      <Footer />
    </div>
  );
}
