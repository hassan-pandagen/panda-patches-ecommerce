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

export const VELCRO_FEE = 30;
export const METALLIC_FEE = 20;
export const GLOW_FEE = 25;
export const PUFF_FEE = 30;

const RUSH_TIERS = [
  { minQty: 1000, fee: 200 },
  { minQty: 500, fee: 150 },
  { minQty: 100, fee: 75 },
  { minQty: 1, fee: 50 },
];

export function getRushFee(qty: number): number {
  return RUSH_TIERS.find(t => qty >= t.minQty)?.fee ?? 50;
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

export function calculateOfferTotal(
  basePrice: number,
  qty: number,
  backing: string,
  delivery: string,
  upgrades: string[]
): number {
  let total = basePrice;
  if (backing === 'Velcro') total += VELCRO_FEE;
  if (upgrades.includes('Metallic Thread')) total += METALLIC_FEE;
  if (upgrades.includes('Glow in the Dark')) total += GLOW_FEE;
  if (upgrades.includes('3D Puff Embroidery')) total += PUFF_FEE;
  if (delivery === 'economy') total = total * 0.9;
  if (delivery === 'rush') total += getRushFee(qty);
  return Math.round(total * 100) / 100;
}
