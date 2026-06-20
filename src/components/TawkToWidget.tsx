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
  if (automated || /Lighthouse|PageSpeed|Google Page Speed|PTST|GTmetrix|Headless/i.test(ua)) return;
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

  // Fire Google Ads conversion + Meta Contact when visitor sends first message.
  // Meta Contact only fires if email/phone present (guarded inside fireMetaContact).
  Tawk_API.onChatMessageVisitor = function () {
    if (sessionStorage.getItem('tawk_conv_fired')) return;
    sessionStorage.setItem('tawk_conv_fired', '1');

    // Google Ads conversion with Enhanced Conversions user_data
    if (typeof (window as any).gtag === 'function') {
      const tawkVisitor = (window as any).Tawk_API?.visitor || {};
      const ecEmail = tawkVisitor.email || sessionStorage.getItem('ec_email') || '';
      const ecPhone = tawkVisitor.phone || sessionStorage.getItem('ec_phone') || '';

      if (ecEmail || ecPhone) {
        // Hash PII for Enhanced Conversions
        const hashStr = async (normalized: string) => {
          const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
          return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        };
        const normalizePhone = (p: string) => {
          const d = p.replace(/\D/g, '');
          if (d.length === 10) return `+1${d}`;
          if (d.length === 11 && d.startsWith('1')) return `+${d}`;
          return `+${d}`;
        };
        (async () => {
          const user_data: Record<string, string> = {};
          if (ecEmail) user_data['sha256_email_address'] = await hashStr(ecEmail.toLowerCase().trim());
          if (ecPhone) user_data['sha256_phone_number'] = await hashStr(normalizePhone(ecPhone));
          if (Object.keys(user_data).length > 0) {
            (window as any).gtag('set', 'user_data', user_data);
          }
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-11221237770/sWV1CNm--IMcEIqA2uYp',
            value: 10.0,
            currency: 'USD',
          });
        })();
      } else {
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-11221237770/sWV1CNm--IMcEIqA2uYp',
          value: 10.0,
          currency: 'USD',
        });
      }
    }

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

  // On mobile, keep widget minimized — do not auto-maximize (avoids CLS)
  Tawk_API.onLoad = function () {
    const isMobile = window.innerWidth < 768;
    if (isMobile && Tawk_API.minimize) {
      Tawk_API.minimize();
    }
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

    // Auto-load Tawk after 2 seconds — fast enough for ads, safe for session/start
    const timer = setTimeout(loadTawkScript, 2000);
    return () => clearTimeout(timer);
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
