'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service here if needed
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">

        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={40} className="text-yellow-600" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8">
          We hit an unexpected error. Please try again — or contact us if the problem persists.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-black text-yellow-400 px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:border-gray-400 transition-colors"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          Need help?{' '}
          <a href="mailto:admin@pandapatches.com" className="text-blue-500 hover:underline">
            admin@pandapatches.com
          </a>
        </p>

      </div>
    </div>
  );
}
