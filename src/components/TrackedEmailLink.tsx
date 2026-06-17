"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getStoredAttribution } from "@/lib/clientAttribution";
import { deriveLeadSource, deriveTrafficSource } from "@/lib/leadSource";

interface Props {
  email?: string;
  subject?: string;
  className?: string;
  children: ReactNode;
}

/**
 * hello@ email link that prefills the customer's draft with the page they came
 * from plus the traffic channel, so quotes people email directly (instead of
 * using the form) still carry the same Source / Traffic we get from the form.
 *
 * Best-effort by design: this only helps when the customer CLICKS the link on
 * the site and leaves the prefilled footer in place. Copy-pasting the address
 * or emailing from a saved contact carries nothing — and that's fine, the form
 * stays the fully-tracked path. Renders a plain mailto on the server and
 * upgrades to the tracked one after mount (attribution is client-side only).
 */
export default function TrackedEmailLink({
  email = "hello@pandapatches.com",
  subject = "Custom Patch Quote Request",
  className,
  children,
}: Props) {
  const [href, setHref] = useState(`mailto:${email}`);

  useEffect(() => {
    try {
      const attr = getStoredAttribution();
      const pageUrl = attr.page_url || window.location.href;
      const source = deriveLeadSource(pageUrl, false, false);
      const traffic = deriveTrafficSource(attr as Record<string, unknown>);

      const lines = [
        "Hi Panda Patches, I'd like a quote for:",
        "",
        "",
        "—",
        `Source: ${source}`,
        `Traffic: ${traffic}`,
      ];
      if (attr.utm_campaign) lines.push(`Campaign: ${attr.utm_campaign}`);
      lines.push("(Sent via the website email link)");

      const body = lines.join("\n");
      setHref(
        `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      );
    } catch {
      setHref(`mailto:${email}`);
    }
  }, [email, subject]);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
