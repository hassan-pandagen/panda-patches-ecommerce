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

import { isVelcroBacking } from '@/lib/factConstants';

/** Economy delivery gives a 5% discount. */
export const ECONOMY_DISCOUNT_RATE = 0.95;

/** Velcro backing: +$0.35 per piece, every quantity. No flat fee, no minimum. */
export const VELCRO_PER_PIECE_FEE = 0.35;

/**
 * Rush surcharge: 25% of the order subtotal, with a $50 floor and no cap
 * (CEO decision, Aug 2026). Replaces the old flat quantity bands.
 *
 * THIS IS THE ONLY DEFINITION. Every surface — checkout, reorder, the price
 * hook, and the calculator UI — calls this function. Do not re-implement the
 * rule locally: the calculator UI previously carried its own copy of the bands,
 * which is precisely the drift that let four different rush figures go live.
 *
 * Why the shape: rush demand skews small and urgent (median order 24 pieces), so
 * a percentage floor makes rush an easy yes where the volume actually is, while
 * large rush jobs — the ones that strain production and trigger split-ship
 * coordination — now carry their real cost instead of a flat $200.
 *
 * If large-rush orders start balking, the pre-agreed lever is a cap: add
 * RUSH_MAX here and clamp. One value, no refactor.
 */
export const RUSH_SURCHARGE_RATE = 0.25;
export const RUSH_MIN = 50;

/** @param subtotal Order subtotal BEFORE rush is added (after velcro/economy). */
export function getRushSurcharge(subtotal: number): number {
  if (!(subtotal > 0)) return RUSH_MIN;
  return Math.round(Math.max(subtotal * RUSH_SURCHARGE_RATE, RUSH_MIN) * 100) / 100;
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
 *
 * Matches via isVelcroBacking rather than `backing === 'velcro'`. The old exact
 * check only worked because the calculator happened to pass the lowercase id;
 * anything passing the display label ("Velcro", "Velcro (Hook & Loop)") got
 * velcro for free. A copy edit should not be able to zero a fee.
 */
export function applyVelcroPricing(price: number, backing: string | undefined, quantity: number): number {
  if (!isVelcroBacking(backing) || price <= 0 || quantity <= 0) return price;
  const adjusted = price + VELCRO_PER_PIECE_FEE * quantity;
  return Math.round(adjusted * 100) / 100;
}
