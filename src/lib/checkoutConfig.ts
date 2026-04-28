/**
 * Shared checkout configuration used by both Stripe and PayPal routes.
 */

/** Canonical customer-facing URL. All checkout redirects must land here. */
export const CANONICAL_BASE_URL = 'https://www.pandapatches.com';

/** Origins allowed for CORS on checkout API routes. Includes preview URLs
 *  so internal testing on Vercel branches still works without breaking CORS. */
export const ALLOWED_ORIGINS = [
  'https://www.pandapatches.com',
  'https://pandapatches.com',
  'https://panda-patches-ecommerce.vercel.app',
  'https://panda-patches-ecommerce-7w28lefz.vercel.app',
] as const;

/** Economy delivery gives a 5% discount. */
export const ECONOMY_DISCOUNT_RATE = 0.95;

/** Velcro backing: +$0.25 per piece. */
export const VELCRO_PER_PIECE_FEE = 0.25;

/** Rush surcharge bands (mirrored from usePriceCalculation hook). */
export function getRushSurcharge(quantity: number): number {
  if (quantity <= 50) return 100;
  if (quantity <= 250) return 150;
  if (quantity <= 1000) return 200;
  return 300;
}

/**
 * Returns the base URL for Stripe/PayPal success and cancel redirects.
 *
 * Customers must always land on pandapatches.com after checkout, even if
 * they started the flow from a Vercel preview URL. This prevents the leak
 * that sent users to https://panda-patches-ecommerce.vercel.app/error-payment
 * when a branch deploy was accidentally surfaced.
 *
 * In non-production environments (dev/preview), APP_URL can override for
 * local testing; otherwise we fall through to the canonical domain.
 */
export function resolveBaseUrl(_origin?: string | null): string {
  if (process.env.NODE_ENV === 'production') {
    return CANONICAL_BASE_URL;
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  return CANONICAL_BASE_URL;
}

/**
 * Applies the economy delivery discount if applicable.
 */
export function applyEconomyDiscount(price: number, deliveryOption: string): number {
  if (deliveryOption === 'economy') {
    return Math.round(price * ECONOMY_DISCOUNT_RATE * 100) / 100;
  }
  return price;
}

/**
 * Applies velcro backing pricing: adds a per-piece fee on top of the
 * base patch price. No-op for any other backing.
 */
export function applyVelcroPricing(price: number, backing: string | undefined, quantity: number): number {
  if (backing !== 'velcro' || price <= 0 || quantity <= 0) return price;
  const adjusted = price + VELCRO_PER_PIECE_FEE * quantity;
  return Math.round(adjusted * 100) / 100;
}
