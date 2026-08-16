/**
 * The one customer-facing order reference.
 *
 * Orders carry TWO identifiers and they are not interchangeable:
 *
 *   order.id           bigint primary key, e.g. 1203. Internal. URLs and joins.
 *   order.order_number text, e.g. "PP-11276". What the CRM, the confirmation
 *                      email, the success page, packing slips and every support
 *                      conversation actually use.
 *
 * The account pages used to print `#${String(order.id).slice(0, 8)}`, so a
 * customer saw "#1203" for the order everyone else called "PP-11276". Both look
 * like plausible order numbers and the ranges overlap, so a support agent given
 * "#1199" could search PP-11199 and land on a different customer's order.
 *
 * Use this helper anywhere an order is shown TO a customer. Keep using
 * `order.id` for routing and lookups.
 *
 * The `PP-` + 5-digit fallback mirrors the Square webhook, which has always
 * derived a reference this way when order_number was not yet set. As of
 * 2026-08-16 order_number is non-null on all 1,047 live orders, including all
 * 46 web-checkout orders, so the fallback should never fire — it exists so a
 * brand-new row in the gap before numbering can never render a bare integer
 * that reads like a different order.
 */
export function customerOrderRef(order: {
  order_number?: string | null;
  id: number | string;
}): string {
  const n = order.order_number?.trim();
  if (n) return n;
  return `PP-${String(order.id).padStart(5, "0")}`;
}
