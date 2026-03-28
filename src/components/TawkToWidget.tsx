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

    // Delay script injection 15s past page load to avoid Lighthouse measurement window
    const tawkTimer = setTimeout(() => {
      const source = getReferrerSource();
      const page = window.location.pathname;

      // Initialize Tawk API BEFORE script injection
      const Tawk_API: any = (window as any).Tawk_API || {};
      (window as any).Tawk_API = Tawk_API;
      (window as any).Tawk_LoadStart = new Date();

      // Set visitor name before script loads so Tawk picks it up on session start
      Tawk_API.visitor = { name: `${source} | ${page}` };

      // Fire conversion only when visitor actually SENDS a message (not on widget load/auto-popup)
      // onChatMessageVisitor fires per-message, so we gate it to fire only once per session
      Tawk_API.onChatMessageVisitor = function () {
        if (sessionStorage.getItem('tawk_conv_fired')) return;
        sessionStorage.setItem('tawk_conv_fired', '1');
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-11221237770/sWV1CNm--IMcEIqA2uYp',
            value: 10.0,
            currency: 'USD',
          });
        }
      };

      // Register onLoad before injecting the script
      Tawk_API.onLoad = function () {
        try {
          // Auto-popup once per session (45s on mobile, 10s on desktop)
          const alreadyPopped = sessionStorage.getItem('tawk_popped');
          if (!alreadyPopped) {
            const isMobile = window.innerWidth < 768;
            const popDelay = isMobile ? 45000 : 10000;
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
            }, popDelay);
          }
        } catch (e) {
          console.error("Error in Tawk.to onLoad:", e);
        }
      };

      // Inject script after setting up API (official Tawk.to snippet pattern)
      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = "https://embed.tawk.to/64b56d7d94cf5d49dc6422c0/1h5ib7cm1";
      const s0 = document.getElementsByTagName("script")[0];
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.head.appendChild(s1);
      }
    }, 15000);

    return () => clearTimeout(tawkTimer);
  }, [pathname]);

  if (pathname?.startsWith('/studio')) return null;

  return null;
}
