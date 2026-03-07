"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function TawkToWidget() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/studio')) return;

    // Track chat start as Google Ads conversion
    const setupTawkCallback = () => {
      if ((window as any).Tawk_API) {
        (window as any).Tawk_API.onChatStarted = function() {
          if (typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', 'conversion', {
              send_to: 'AW-11221237770/sWV1CNm--IMcEIqA2uYp',
              value: 10.0,
              currency: 'USD',
            });
          }
        };
      }
    };

    // Set up callback when Tawk loads
    const timer = setTimeout(setupTawkCallback, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (pathname?.startsWith('/studio')) return null;

  return (
    <Script
      id="tawk-script"
      src="https://embed.tawk.to/64b56d7d94cf5d49dc6422c0/1h5ib7cm1"
      strategy="lazyOnload"
      async
      defer
    />
  );
}
