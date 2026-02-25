"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

function PayPalSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      setStatus('error');
      setMessage('Invalid payment confirmation');
      return;
    }

    const capturePayment = async () => {
      try {
        const response = await fetch('/api/capture-paypal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Payment successful! Your order has been confirmed.');
          setTimeout(() => {
            router.push('/success');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment capture failed');
        }
      } catch {
        setStatus('error');
        setMessage('An error occurred while processing your payment');
      }
    };

    capturePayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PayPalSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
    }>
      <PayPalSuccessContent />
    </Suspense>
  );
}
