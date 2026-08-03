"use client";

/**
 * Bulk-quote CTA (CEO decision, Aug 2026).
 *
 * Appears at the payment step ONLY when the order is genuinely large:
 * quantity >= 500 OR subtotal >= $1,000. Below that threshold checkout is
 * untouched.
 *
 * Deliberately NOT a general "negotiate" control. Putting a haggle button on
 * every order teaches every customer that the listed price is a starting bid;
 * gating it to real bulk volume keeps standard pricing firm while giving big
 * orders a human path. There is no equivalent control below the threshold.
 */
export const BULK_QTY_THRESHOLD = 500;
export const BULK_SUBTOTAL_THRESHOLD = 1000;

const WHATSAPP_NUMBER = "14157999969";

export function qualifiesForBulkQuote(quantity: number, subtotal: number): boolean {
  return quantity >= BULK_QTY_THRESHOLD || subtotal >= BULK_SUBTOTAL_THRESHOLD;
}

interface BulkQuoteCTAProps {
  quantity: number;
  subtotal: number;
  productName: string;
  width: number;
  height: number;
}

export default function BulkQuoteCTA({
  quantity,
  subtotal,
  productName,
  width,
  height,
}: BulkQuoteCTAProps) {
  if (!qualifiesForBulkQuote(quantity, subtotal)) return null;

  const context = `${quantity} x ${productName} (${width}" x ${height}")`;

  const track = (channel: "whatsapp" | "quote") => {
    try {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "bulk_quote_click",
        channel,
        quantity,
        subtotal: Math.round(subtotal * 100) / 100,
      });
    } catch {
      /* noop */
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I'd like custom bulk pricing for ${context}.`
  )}`;

  const quoteHref = `/contact?bulk=1&qty=${quantity}&product=${encodeURIComponent(
    productName
  )}&size=${encodeURIComponent(`${width}x${height}`)}`;

  return (
    <div className="mt-4 rounded-[14px] border-2 border-panda-green bg-[#F9FAF5] p-5">
      <p className="text-[0.9375rem] font-black text-panda-dark mb-1">
        Big order? Get custom bulk pricing
      </p>
      <p className="text-[0.8125rem] text-gray-600 leading-[1.6] mb-4">
        Orders this size are usually quoted individually. Talk to us and we&rsquo;ll price it
        properly &mdash; you can still check out now if you&rsquo;d rather not wait.
      </p>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp")}
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-black text-[0.875rem] px-5 py-3 rounded-full hover:brightness-95 transition"
        >
          Chat on WhatsApp
        </a>
        <a
          href={quoteHref}
          onClick={() => track("quote")}
          className="inline-flex items-center justify-center gap-2 bg-panda-dark text-white font-black text-[0.875rem] px-5 py-3 rounded-full hover:bg-black transition"
        >
          Request bulk quote
        </a>
      </div>
    </div>
  );
}
