'use client';

import { useEffect } from 'react';

const PIXEL_ID = '1515101469424765';

/**
 * Meta pixel manual advanced matching (CL4DE6 §2.2).
 *
 * PageView match quality sits at 6.2/10 ("update recommended") because the
 * pixel fires with no identifying signal on most page loads. Where we already
 * know who the visitor is — signed into the account area, or on the
 * post-purchase page — passing a hashed email lifts match quality for those
 * PageViews.
 *
 * RULES:
 *  - ONLY render this where the visitor has already given us the email
 *    (authenticated session, or an order they just completed). Never scrape a
 *    form field pre-submit.
 *  - The email is SHA-256 hashed here, in the browser, before it is handed to
 *    fbq. Meta's pixel would hash a raw value itself, but hashing first means
 *    the plaintext address never enters the fbq call or its queue.
 *  - Re-calling fbq('init', ...) with user data is Meta's documented way to
 *    attach advanced matching after the initial init (which runs in layout.tsx
 *    before we know the user). It does not create a second pixel.
 *
 * Scope note: this only affects PageViews on authenticated/post-purchase pages,
 * which are a small slice of the 43.7K/28d total. The large lever for PageView
 * EMQ is the Automatic Advanced Matching toggle in Events Manager (§2.1), which
 * is a dashboard setting, not code.
 */
async function sha256Hex(value: string): Promise<string | null> {
  try {
    const data = new TextEncoder().encode(value);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // crypto.subtle is unavailable on insecure origins — skip rather than
    // fall back to sending plaintext.
    return null;
  }
}

export default function PixelIdentify({ email }: { email?: string | null }) {
  useEffect(() => {
    const raw = email?.trim().toLowerCase();
    if (!raw || !raw.includes('@')) return;

    let cancelled = false;

    (async () => {
      const em = await sha256Hex(raw);
      if (!em || cancelled) return;

      // The pixel is loaded by a deferred/interaction-gated loader, so fbq may
      // not exist yet. Poll briefly, matching PurchaseConversion's approach.
      let attempts = 0;
      const attach = () => {
        if (cancelled) return;
        const fbq = (window as any).fbq;
        if (fbq) {
          try {
            fbq('init', PIXEL_ID, { em });
          } catch {
            /* never let analytics break the page */
          }
          return;
        }
        if (attempts < 50) {
          attempts++;
          setTimeout(attach, 300);
        }
      };
      attach();
    })();

    return () => {
      cancelled = true;
    };
  }, [email]);

  return null;
}
