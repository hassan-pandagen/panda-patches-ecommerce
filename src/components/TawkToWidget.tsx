"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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

  // Search engines (before social to avoid google.com matching YouTube referrals)
  if (referrer.includes("google.com")) return "v-Google";
  if (referrer.includes("bing.com")) return "v-Bing";
  if (referrer.includes("yahoo.com")) return "v-Yahoo";
  if (referrer.includes("duckduckgo.com")) return "v-DuckDuckGo";

  // Social media
  if (referrer.includes("facebook.com") || referrer.includes("fb.com")) return "v-Facebook";
  if (referrer.includes("instagram.com")) return "v-Instagram";
  if (referrer.includes("twitter.com") || referrer.includes("t.co") || referrer.includes("x.com")) return "v-Twitter";
  if (referrer.includes("linkedin.com")) return "v-LinkedIn";
  if (referrer.includes("youtube.com")) return "v-YouTube";
  if (referrer.includes("tiktok.com")) return "v-TikTok";
  if (referrer.includes("pinterest.com")) return "v-Pinterest";

  // Fallback
  if (referrer) return "v-Referral";
  return "v-Direct";
}

export default function TawkToWidget() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/studio')) return;
    if ((window as any).__tawk_loaded) return;
    (window as any).__tawk_loaded = true;

    // Exactly match the official Tawk.to snippet
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/64b56d7d94cf5d49dc6422c0/1h5ib7cm1";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0.parentNode!.insertBefore(s1, s0);

    // Add customizations after Tawk loads
    const Tawk_API = (window as any).Tawk_API;
    const source = getReferrerSource();
    const page = window.location.pathname;

    Tawk_API.onLoad = function () {
      try {
        // Set visitor name for dashboard
        if (typeof Tawk_API.setAttributes === 'function') {
          Tawk_API.setAttributes({
            name: `${source} | ${page}`,
          }, function (error: any) {
            if (error) console.error("Tawk setAttributes error:", error);
          });
        }

        // Track chat start as Google Ads conversion
        Tawk_API.onChatStarted = function () {
          if (typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', 'conversion', {
              send_to: 'AW-11221237770/sWV1CNm--IMcEIqA2uYp',
              value: 10.0,
              currency: 'USD',
            });
          }
        };

        // Auto-popup once per session
        const alreadyPopped = sessionStorage.getItem('tawk_popped');
        if (!alreadyPopped) {
          setTimeout(() => {
            try {
              if (
                typeof Tawk_API.isChatMinimized === 'function' &&
                Tawk_API.isChatMinimized() &&
                typeof Tawk_API.maximize === 'function'
              ) {
                Tawk_API.maximize();
                sessionStorage.setItem('tawk_popped', '1');
              }
            } catch (e) {
              console.error("Error auto-maximizing Tawk.to:", e);
            }
          }, 10000);
        }
      } catch (e) {
        console.error("Error in Tawk.to onLoad:", e);
      }
    };
  }, [pathname]);

  if (pathname?.startsWith('/studio')) return null;

  return null;
}
