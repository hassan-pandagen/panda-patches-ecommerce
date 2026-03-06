"use client";

import { useEffect } from 'react';

export default function TawkToWidget() {
  useEffect(() => {
    const injectTawkTo = () => {
      const tawkApi = (window as any).Tawk_API || {};
      (window as any).Tawk_API  = tawkApi;
      (window as any).Tawk_LoadTime = new Date();

      // Track chat start as Google Ads conversion
      (window as any).Tawk_API.onChatStarted = function() {
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-11221237770/sWV1CNm--IMcEIqA2uYp',
            value: 10.0,
            currency: 'USD',
          });
        }
      };

      const s1 = document.createElement('script');
      const s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/64b56d7d94cf5d49dc6422c0/1h5ib7cm1';
      s1.charset = 'UTF-8';
      s0.parentNode?.insertBefore(s1, s0);
    };

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      injectTawkTo();
    };

    window.addEventListener('scroll', load, { passive: true, once: true });
    const timer = setTimeout(load, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', load);
    };
  }, []);

  return null;
}
