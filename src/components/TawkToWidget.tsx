"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

function getReferrerSource(): string {
  const referrer = document.referrer.toLowerCase();

  // AI assistants
  if (referrer.includes("chat.openai.com") || referrer.includes("chatgpt.com")) return "v-ChatGPT";
  if (referrer.includes("claude.ai")) return "v-Claude";
  if (referrer.includes("perplexity.ai")) return "v-Perplexity";
  if (referrer.includes("bard.google.com") || referrer.includes("gemini.google.com")) return "v-Gemini";
  if (referrer.includes("bing.com/chat") || referrer.includes("copilot.microsoft.com")) return "v-Copilot";
  if (referrer.includes("you.com")) return "v-YouAI";
  if (referrer.includes("phind.com")) return "v-Phind";

  // Social media
  if (referrer.includes("facebook.com") || referrer.includes("fb.com")) return "v-Facebook";
  if (referrer.includes("instagram.com")) return "v-Instagram";
  if (referrer.includes("twitter.com") || referrer.includes("t.co") || referrer.includes("x.com")) return "v-Twitter";
  if (referrer.includes("linkedin.com")) return "v-LinkedIn";
  if (referrer.includes("youtube.com")) return "v-YouTube";
  if (referrer.includes("tiktok.com")) return "v-TikTok";
  if (referrer.includes("pinterest.com")) return "v-Pinterest";

  // Search engines (after AI checks so bing.com/chat is caught first)
  if (referrer.includes("google.com")) return "v-Google";
  if (referrer.includes("bing.com")) return "v-Bing";
  if (referrer.includes("yahoo.com")) return "v-Yahoo";
  if (referrer.includes("duckduckgo.com")) return "v-DuckDuckGo";

  // Fallback
  if (referrer) return "v-Referral";
  return "v-Direct";
}

export default function TawkToWidget() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/studio')) return;

    const Tawk_API = (window as any).Tawk_API;

    // Update page attribute on every route change (if Tawk is already loaded)
    if (Tawk_API && typeof Tawk_API.setAttributes === 'function') {
      Tawk_API.setAttributes({
        page: window.location.pathname + window.location.search,
      }, function(error: any) {
        if (error) console.error("Tawk setAttributes error:", error);
      });
    }

    const setupTawk = () => {
      const api = (window as any).Tawk_API;
      if (!api) return;

      // Set referrer as visitor name so it shows in Tawk dashboard
      const source = getReferrerSource();
      api.visitor = api.visitor || {};
      api.visitor.name = source;

      // Set custom attributes for filtering in Tawk
      if (typeof api.setAttributes === 'function') {
        api.setAttributes({
          source: source,
          page: window.location.pathname + window.location.search,
        }, function(error: any) {
          if (error) console.error("Tawk setAttributes error:", error);
        });
      }

      // Track chat start as Google Ads conversion
      api.onChatStarted = function() {
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-11221237770/sWV1CNm--IMcEIqA2uYp',
            value: 10.0,
            currency: 'USD',
          });
        }
      };
    };

    // Poll until Tawk_API is available (script loads via lazyOnload)
    const timer = setTimeout(() => {
      const check = setInterval(() => {
        if ((window as any).Tawk_API?.setAttributes) {
          setupTawk();
          clearInterval(check);
        }
      }, 500);
      // Stop polling after 15 seconds
      setTimeout(() => clearInterval(check), 15000);
    }, 1000);

    // Auto-popup chat after 10 seconds (only once per session)
    const popupTimer = setTimeout(() => {
      const alreadyPopped = sessionStorage.getItem('tawk_popped');
      if (alreadyPopped) return;
      const check = setInterval(() => {
        if ((window as any).Tawk_API?.maximize) {
          (window as any).Tawk_API.maximize();
          sessionStorage.setItem('tawk_popped', '1');
          clearInterval(check);
        }
      }, 500);
      setTimeout(() => clearInterval(check), 10000);
    }, 10000);

    return () => { clearTimeout(timer); clearTimeout(popupTimer); };
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
