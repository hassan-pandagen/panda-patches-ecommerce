import {
  VELCRO_PER_PIECE_FEE,
  applyEconomyDiscount,
  applyVelcroPricing,
  getRushSurcharge,
} from '@/lib/checkoutConfig';
import { roundMoney } from '@/lib/pricingCalculator';

export interface OfferPack {
  name: string;
  qty: number;
  price: number;
  perPiece: number;
  badge?: string;
}

export interface OfferCategory {
  id: string;
  type: string;
  subtitle: string;
  slug: string; // Sanity productPage slug for image fetch
  href: string; // Link to product page
  packs: OfferPack[];
}

export const OFFER_CATEGORIES: OfferCategory[] = [
  {
    id: 'woven-u4',
    type: 'Woven Patches',
    subtitle: 'Under 4 Inches',
    slug: 'woven',
    href: '/custom-patches/woven',
    packs: [
      { name: 'Starter', qty: 50, price: 220, perPiece: 4.40 },
      { name: 'Team', qty: 100, price: 350, perPiece: 3.50, badge: 'Popular' },
      { name: 'Business', qty: 500, price: 1200, perPiece: 2.40 },
      { name: 'Enterprise', qty: 1000, price: 2000, perPiece: 2.00, badge: 'Best Value' },
    ],
  },
  {
    id: 'embroidered-u4',
    type: 'Embroidered Patches',
    subtitle: 'Under 4 Inches',
    slug: 'embroidered',
    href: '/custom-patches/embroidered',
    packs: [
      { name: 'Starter', qty: 50, price: 180, perPiece: 3.60 },
      { name: 'Team', qty: 100, price: 240, perPiece: 2.40, badge: 'Popular' },
      { name: 'Business', qty: 500, price: 750, perPiece: 1.50 },
      { name: 'Enterprise', qty: 1000, price: 1200, perPiece: 1.20, badge: 'Best Value' },
    ],
  },
  {
    id: 'embroidered-12in',
    type: 'Embroidered Patches',
    subtitle: '12 Inch Across Chest',
    slug: 'embroidered',
    href: '/custom-patches/embroidered',
    packs: [
      { name: 'Small Run', qty: 25, price: 400, perPiece: 16.00 },
      { name: 'Standard', qty: 50, price: 750, perPiece: 15.00, badge: 'Popular' },
      { name: 'Team Order', qty: 100, price: 1100, perPiece: 11.00, badge: 'Best Value' },
    ],
  },
  {
    id: 'pvc-u4',
    type: 'PVC Patches',
    subtitle: 'Under 4 Inches',
    slug: 'pvc',
    href: '/custom-patches/pvc',
    packs: [
      { name: 'Starter', qty: 50, price: 230, perPiece: 4.60 },
      { name: 'Team', qty: 100, price: 340, perPiece: 3.40, badge: 'Popular' },
      { name: 'Business', qty: 500, price: 1400, perPiece: 2.80 },
      { name: 'Enterprise', qty: 1000, price: 2200, perPiece: 2.20, badge: 'Best Value' },
    ],
  },
  {
    id: 'chenille-u4',
    type: 'Chenille Patches',
    subtitle: 'Under 4 Inches',
    slug: 'chenille',
    href: '/custom-patches/chenille',
    packs: [
      { name: 'Starter', qty: 25, price: 175, perPiece: 7.00 },
      { name: 'Team', qty: 50, price: 250, perPiece: 5.00, badge: 'Popular' },
      { name: 'Club', qty: 100, price: 350, perPiece: 3.50, badge: 'Best Value' },
    ],
  },
  {
    id: 'chenille-12in',
    type: 'Chenille Patches',
    subtitle: '12 Inch',
    slug: 'chenille',
    href: '/custom-patches/chenille',
    packs: [
      { name: 'Small Run', qty: 25, price: 500, perPiece: 20.00 },
      { name: 'Standard', qty: 50, price: 850, perPiece: 17.00, badge: 'Popular' },
      { name: 'Team Order', qty: 100, price: 1400, perPiece: 14.00, badge: 'Best Value' },
    ],
  },
  {
    id: 'leather-u4',
    type: 'Leather Patches',
    subtitle: 'Under 4 Inches',
    slug: 'leather',
    href: '/custom-patches/leather',
    packs: [
      { name: 'Starter', qty: 50, price: 220, perPiece: 4.40 },
      { name: 'Team', qty: 100, price: 350, perPiece: 3.50, badge: 'Popular' },
      { name: 'Business', qty: 500, price: 1200, perPiece: 2.40 },
      { name: 'Enterprise', qty: 1000, price: 2000, perPiece: 2.00, badge: 'Best Value' },
    ],
  },
];

// Special-finish add-ons are flat per-order fees and are the same on both paths.
// They are NOT delivery/backing terms, so the Aug 2026 pricing corrections do not
// touch them.
export const METALLIC_FEE = 20;
export const GLOW_FEE = 25;
export const PUFF_FEE = 30;

/**
 * Velcro on a pack order — per piece, from the canon constant.
 *
 * Was a flat $30 per order. That figure predated the Aug 2026 correction to
 * $0.35/piece and was never propagated here, so the two checkout routes charged
 * different amounts for the same backing: $30 on a pack, $350 on a 1,000-piece
 * calculator order. Fixed by importing the constant instead of restating it.
 */
export function getOfferVelcroFee(qty: number): number {
  return roundMoney(VELCRO_PER_PIECE_FEE * qty);
}

/**
 * Pre-rush subtotal for a pack order: base + per-piece velcro + flat upgrades,
 * then the economy discount. Rush is a percentage of THIS figure, matching the
 * order of operations in usePriceCalculation and the reorder route exactly.
 */
export function getOfferSubtotalBeforeRush(
  basePrice: number,
  qty: number,
  backing: string,
  delivery: string,
  upgrades: string[]
): number {
  let total = basePrice;
  if (backing === 'Velcro') total += VELCRO_PER_PIECE_FEE * qty;
  if (upgrades.includes('Metallic Thread')) total += METALLIC_FEE;
  if (upgrades.includes('Glow in the Dark')) total += GLOW_FEE;
  if (upgrades.includes('3D Puff Embroidery')) total += PUFF_FEE;
  if (delivery === 'economy') total = applyEconomyDiscount(total, 'economy');
  return roundMoney(total);
}

/**
 * Rush on a pack order: 25% of the pre-rush subtotal with a $50 floor, from the
 * canon helper. Replaced flat tiers (+$50/$75/$150/$200) that predated the
 * percentage decision. Takes the full order shape rather than just quantity,
 * because a percentage of the subtotal depends on backing and upgrades too.
 */
export function getOfferRushFee(
  basePrice: number,
  qty: number,
  backing: string,
  delivery: string,
  upgrades: string[]
): number {
  return getRushSurcharge(
    getOfferSubtotalBeforeRush(basePrice, qty, backing, delivery, upgrades)
  );
}

export function lookupOfferPrice(
  categoryId: string,
  packName: string
): { basePrice: number; qty: number; categoryType: string } | null {
  const cat = OFFER_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return null;
  const pack = cat.packs.find(p => p.name === packName);
  if (!pack) return null;
  return { basePrice: pack.price, qty: pack.qty, categoryType: cat.type };
}

/**
 * Get the lowest per-piece offer pack price for a given category
 * (matched by id or product-page slug). Used by cluster pages so they can render
 * "starting at $X.XX" without copying numbers out of OFFER_CATEGORIES.
 */
export function getOfferStartingPrice(
  slugOrCategoryId: string
): { perPiece: number; qty: number; categoryType: string } | null {
  const cat = OFFER_CATEGORIES.find(c => c.id === slugOrCategoryId || c.slug === slugOrCategoryId);
  if (!cat) return null;
  const lowest = cat.packs.reduce((min, p) => (p.perPiece < min.perPiece ? p : min), cat.packs[0]);
  return { perPiece: lowest.perPiece, qty: lowest.qty, categoryType: cat.type };
}

export function calculateOfferTotal(
  basePrice: number,
  qty: number,
  backing: string,
  delivery: string,
  upgrades: string[]
): number {
  const subtotal = getOfferSubtotalBeforeRush(basePrice, qty, backing, delivery, upgrades);
  const rush = delivery === 'rush' ? getRushSurcharge(subtotal) : 0;
  return roundMoney(subtotal + rush);
}

/**
 * BUILD-TIME PARITY GUARD — do not remove.
 *
 * The pack path and the calculator path must charge identical velcro, economy and
 * rush. They diverged three times because each system restated the numbers
 * instead of sharing them; the values above are now imported, which makes a copy
 * the only way to break parity again. This runs at module load, so `next build`
 * fails rather than shipping two disagreeing price lists.
 *
 * If this throws: something reintroduced a literal fee or rate. Fix the literal,
 * do not relax the assertion.
 */
(function assertPackCalculatorParity() {
  const qty = 100;
  const base = 500;

  const packVelcro = roundMoney(
    calculateOfferTotal(base, qty, 'Velcro', 'standard', []) -
      calculateOfferTotal(base, qty, 'Iron-On', 'standard', [])
  );
  const calcVelcro = roundMoney(applyVelcroPricing(base, 'velcro', qty) - base);
  if (packVelcro !== calcVelcro) {
    throw new Error(
      `[offerPackages] velcro parity broken: packs charge ${packVelcro}, calculator charges ${calcVelcro}`
    );
  }

  const packEconomy = calculateOfferTotal(base, qty, 'Iron-On', 'economy', []);
  const calcEconomy = applyEconomyDiscount(base, 'economy');
  if (packEconomy !== calcEconomy) {
    throw new Error(
      `[offerPackages] economy parity broken: packs charge ${packEconomy}, calculator charges ${calcEconomy}`
    );
  }

  const packRush = roundMoney(calculateOfferTotal(base, qty, 'Iron-On', 'rush', []) - base);
  const calcRush = getRushSurcharge(base);
  if (packRush !== calcRush) {
    throw new Error(
      `[offerPackages] rush parity broken: packs charge ${packRush}, calculator charges ${calcRush}`
    );
  }
})();
