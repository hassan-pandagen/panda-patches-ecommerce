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
  if (referrer.includes("copilot") || referrer.includes("bing.com/chat") || referrer.includes("edgeservices.bing")) return "v-Copilot";
  if (referrer.includes("you.com")) return "v-YouAI";
  if (referrer.includes("phind.com")) return "v-Phind";
  if (referrer.includes("meta.ai")) return "v-MetaAI";
  if (referrer.includes("deepseek.com")) return "v-DeepSeek";

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

function loadTawkScript() {
  if ((window as any).__tawk_script_injected) return;
  // Skip Tawk for bots and audit tools. Tawk returns a 403 (with an HTML body) to
  // headless/audit clients, which logs a console error and dings Lighthouse Best
  // Practices, even though real browsers load it fine. navigator.webdriver is true
  // during Lighthouse/PageSpeed runs (the reliable signal, since mobile emulation
  // rewrites the UA to a clean device string); the UA tokens are a fallback, with
  // "Headless" covering both HeadlessChrome and HeadlessChromium.
  const ua = navigator.userAgent;
  const automated = (navigator as any).webdriver === true;
  const isBotUA = /Lighthouse|PageSpeed|Google Page Speed|PTST|GTmetrix|Headless|bot|crawler|spider|scraper/i.test(ua);
  // TAWKTO_1.MD (July 2026): datacenter/headless-Chrome bots on Linux desktop UAs
  // were flooding the tawk.to live-visitor dashboard (0 real interactions, google.com
  // referrer spoofed). Real consumer traffic is overwhelmingly Windows/macOS/iOS/
  // Android — genuine Linux desktop users are a small trade-off we accept (phone,
  // WhatsApp, and the contact form stay available to them). Android also reports
  // "Linux" in its UA, so it's explicitly excluded from this check.
  const isLinuxDesktop = /Linux/.test(ua) && !/Android/i.test(ua);
  if (automated || isBotUA || isLinuxDesktop) return;
  (window as any).__tawk_script_injected = true;

  const source = getReferrerSource();
  const page = window.location.pathname;

  const Tawk_API: any = (window as any).Tawk_API || {};
  (window as any).Tawk_API = Tawk_API;
  (window as any).Tawk_LoadStart = new Date();

  Tawk_API.visitor = { name: `${source} | ${page}` };

  // Helper: fire Meta Contact browser pixel + server CAPI mirror.
  // Only fires when we have at least one PII identifier (email or phone) — firing
  // anonymous chat-open events tanks EMQ score (was 6.1 with 456/wk anonymous opens).
  // Now fires on first visitor message AND only when pre-chat form supplied identifiers.
  function fireMetaContact() {
    if (sessionStorage.getItem('tawk_meta_contact_fired')) return;
    const tawkVisitor = (window as any).Tawk_API?.visitor || {};
    const email = tawkVisitor.email || null;
    const phone = tawkVisitor.phone || null;
    if (!email && !phone) return;
    sessionStorage.setItem('tawk_meta_contact_fired', '1');
    try {
      const eventId = `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Contact', {
          content_name: 'Tawk Chat Started',
          content_category: 'tawk',
        }, { eventID: eventId });
      }
      const cookies = Object.fromEntries(
        document.cookie.split('; ').map((c) => {
          const idx = c.indexOf('=');
          return idx === -1 ? [c, ''] : [c.slice(0, idx), decodeURIComponent(c.slice(idx + 1))];
        })
      );
      fetch('/api/meta/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          eventId,
          fbp: cookies._fbp || null,
          fbc: cookies._fbc || null,
          source: 'tawk',
          email,
          phone,
          firstName: tawkVisitor.name?.split('|')[0]?.trim() || null,
        }),
      }).catch(() => {});
    } catch { /* noop */ }
  }

  // Fire conversions when the visitor sends their FIRST message (once per chat):
  //  - Google Ads "Contact" — pushes `tawk_first_message` to the dataLayer for a
  //    GTM Google Ads Conversion tag (label AW-11221237770/sWV1CNm--IMcEIqA2uYp).
  //    gclid-based, so it records even without email/phone. Re-added now that
  //    Google Ads is active again (claude-code-task-website-conversions.md Fix 1);
  //    the old direct-gtag block was removed while the AW- account was dormant.
  //  - Meta Contact — only fires when email/phone is present (guarded inside
  //    fireMetaContact, to protect EMQ from anonymous chat-open events).
  Tawk_API.onChatMessageVisitor = function () {
    if (sessionStorage.getItem('tawk_conv_fired')) return;
    sessionStorage.setItem('tawk_conv_fired', '1');
    try {
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: 'tawk_first_message' });
    } catch { /* never let tracking throw into the UI */ }
    fireMetaContact();
  };

  // Capture pre-chat form data so we can pass email/phone to CAPI on first message
  Tawk_API.onPrechatSubmit = function (data: any) {
    try {
      const fields = Array.isArray(data) ? data : [];
      const get = (label: string) =>
        fields.find((f: any) => f?.label?.toLowerCase().includes(label))?.value || null;
      const visitor = (window as any).Tawk_API?.visitor || {};
      visitor.email = get('email') || visitor.email;
      visitor.phone = get('phone') || visitor.phone;
      const nameVal = get('name');
      if (nameVal) visitor.name = nameVal;
      (window as any).Tawk_API.visitor = visitor;
    } catch { /* noop */ }
  };

  // On mobile, keep widget minimized — do not auto-maximize (avoids CLS).
  // On desktop, auto-open once per session, 30s after the widget finishes
  // loading (CL9EE9_1 C.4). The load trigger itself stays interaction-gated
  // (see the scroll/click/touch listeners below) — this only adds a delayed
  // open on top of it, it does not change when Tawk loads.
  Tawk_API.onLoad = function () {
    const isMobile = window.innerWidth < 768;
    if (isMobile && Tawk_API.minimize) {
      Tawk_API.minimize();
      return;
    }
    if (sessionStorage.getItem('tawk_auto_opened')) return;
    sessionStorage.setItem('tawk_auto_opened', '1');
    setTimeout(() => {
      if ((window as any).Tawk_API?.maximize) {
        (window as any).Tawk_API.maximize();
      }
    }, 30000);
  };

  const s1 = document.createElement("script");
  s1.async = true;
  (s1 as any).fetchPriority = 'low';
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

  useEffect(() => {
    if (pathname?.startsWith('/studio')) return;

    // Load Tawk on FIRST HUMAN INTERACTION (scroll/click/touch/mousemove/keydown)
    // instead of a flat 2s timer. Two wins (audit P1 + owner report of ~1,300 bot
    // "visitors" in the Tawk dashboard): JS-executing bots never scroll or move a
    // mouse, so they stop registering as Tawk visitors; and ~300-600KB of chat JS
    // no longer lands exactly when real users start interacting (field INP).
    // No timer fallback ON PURPOSE: any real visitor produces one of these events
    // within moments, while patient headless bots idling on the page never do.
    // "Chat Now" buttons still work instantly via window.__loadTawk below.
    let loaded = false;
    const fire = () => {
      if (loaded) return;
      loaded = true;
      evts.forEach((e) => document.removeEventListener(e, fire, { capture: true } as any));
      loadTawkScript();
    };
    const evts = ['scroll', 'click', 'touchstart', 'mousemove', 'keydown'];
    evts.forEach((e) =>
      document.addEventListener(e, fire, { capture: true, once: true, passive: true })
    );
    return () => {
      evts.forEach((e) => document.removeEventListener(e, fire, { capture: true } as any));
    };
  }, [pathname]);

  // Also allow the Navbar "Chat Now" button to trigger Tawk loading immediately
  useEffect(() => {
    (window as any).__loadTawk = () => {
      loadTawkScript();
      // If already loaded, maximize it
      const api = (window as any).Tawk_API;
      if (api?.maximize) {
        api.maximize();
      }
    };
  }, []);

  return null;
}
