/**
 * Shared checkout configuration used by both Stripe and PayPal routes.
 */

export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://pandapatches.com',
  'https://www.pandapatches.com',
  'https://panda-patches-ecommerce.vercel.app',
  'https://panda-patches-ecommerce-7w28lefz.vercel.app',
] as const;

/** Economy delivery gives a 10% discount. */
export const ECONOMY_DISCOUNT_RATE = 0.9;

/**
 * Returns the base URL to use for Stripe/PayPal success and cancel redirects.
 *
 * Priority:
 *  1. APP_URL env var — set this in Vercel to your Next.js deployment URL
 *     e.g. https://panda-patches-ecommerce.vercel.app  or  https://app.pandapatches.com
 *  2. Validated request origin (must be in ALLOWED_ORIGINS)
 *  3. Fallback: pandapatches.com (WordPress site — avoid relying on this)
 */
export function resolveBaseUrl(origin: string | null | undefined): string {
  // Always prefer the explicitly configured app URL so redirects land on
  // the Next.js app, not the WordPress site at pandapatches.com.
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, ''); // strip trailing slash
  }
  return (
    ALLOWED_ORIGINS.find((allowed) => origin?.startsWith(allowed)) ??
    'https://www.pandapatches.com'
  );
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
