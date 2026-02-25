/**
 * Shared checkout configuration used by both Stripe and PayPal routes.
 */

export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://pandapatches.com',
  'https://www.pandapatches.com',
] as const;

/** Economy delivery gives a 10% discount. */
export const ECONOMY_DISCOUNT_RATE = 0.9;

/**
 * Returns the validated base URL from the request origin.
 * Falls back to the production domain if origin is unknown.
 */
export function resolveBaseUrl(origin: string | null | undefined): string {
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
