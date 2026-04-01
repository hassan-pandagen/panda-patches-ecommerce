"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

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

function loadTawkScript(onLoad?: () => void) {
  if ((window as any).__tawk_script_injected) return;
  (window as any).__tawk_script_injected = true;

  const source = getReferrerSource();
  const page = window.location.pathname;

  const Tawk_API: any = (window as any).Tawk_API || {};
  (window as any).Tawk_API = Tawk_API;
  (window as any).Tawk_LoadStart = new Date();

  Tawk_API.visitor = { name: `${source} | ${page}` };

  // Fire conversion only when visitor actually SENDS a message
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

  Tawk_API.onLoad = function () {
    if (onLoad) onLoad();
  };

  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = "https://embed.tawk.to/64b56d7d94cf5d49dc6422c0/1h5ib7cm1";
  const s0 = document.getElementsByTagName("script")[0];
  if (s0 && s0.parentNode) {
    s0.parentNode.insertBefore(s1, s0);
  } else {
    document.head.appendChild(s1);
  }
}

export default function TawkToWidget() {
  const pathname = usePathname();
  const [tawkReady, setTawkReady] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  // Show our custom chat button after a short delay (no CLS since it's position:fixed)
  useEffect(() => {
    if (pathname?.startsWith('/studio')) return;
    const timer = setTimeout(() => setShowButton(true), 3000);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleChatClick = useCallback(() => {
    // If Tawk is already loaded, just maximize it
    const api = (window as any).Tawk_API;
    if (api?.maximize) {
      api.maximize();
      setShowButton(false);
      return;
    }

    // Prevent double-loading
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    // Load Tawk for the first time, then maximize
    loadTawkScript(() => {
      setTawkReady(true);
      setLoading(false);
      setShowButton(false);
      // Tawk needs time to render its widget after onLoad fires
      const tryMaximize = (attempts: number) => {
        const tawk = (window as any).Tawk_API;
        if (tawk?.maximize) {
          tawk.maximize();
        } else if (attempts > 0) {
          setTimeout(() => tryMaximize(attempts - 1), 500);
        }
      };
      tryMaximize(10);
    });
  }, []);

  // Once Tawk takes over, hide our button permanently
  useEffect(() => {
    if (!tawkReady) return;
    setShowButton(false);
  }, [tawkReady]);

  // Also allow the Navbar "Chat Now" button to trigger Tawk loading
  useEffect(() => {
    (window as any).__loadTawk = () => {
      handleChatClick();
    };
  }, [handleChatClick]);

  if (pathname?.startsWith('/studio')) return null;

  // Show lightweight placeholder button until user clicks
  if (!showButton || tawkReady) return null;

  return (
    <>
      <style>{`
        @keyframes chat-slide-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes chat-pulse{0%,100%{box-shadow:0 4px 14px rgba(59,126,0,0.3)}50%{box-shadow:0 4px 24px rgba(59,126,0,0.5)}}
        @keyframes chat-spin{to{transform:rotate(360deg)}}
        .chat-btn-enter{animation:chat-slide-in .4s ease-out forwards}
        .chat-btn-pulse{animation:chat-pulse 2s ease-in-out infinite}
        .chat-spinner{animation:chat-spin .8s linear infinite}
      `}</style>
      <button
        onClick={handleChatClick}
        disabled={loading}
        aria-label="Chat with us"
        className="fixed bottom-5 right-5 z-50 chat-btn-enter chat-btn-pulse flex items-center gap-2.5 bg-[#051C05] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group disabled:opacity-90 disabled:cursor-wait"
      >
        {/* Icon or spinner */}
        <span className="relative flex-shrink-0">
          {loading ? (
            <svg className="chat-spinner text-[#DFFF00]" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : (
            <>
              <MessageCircle size={22} strokeWidth={2.5} className="text-[#DFFF00] group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-[#051C05]" />
            </>
          )}
        </span>
        {/* Text */}
        <span className="text-[14px] font-bold whitespace-nowrap">
          {loading ? 'Connecting...' : 'Chat With Us'}
        </span>
      </button>
    </>
  );
}
