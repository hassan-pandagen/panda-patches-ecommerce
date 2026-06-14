/**
 * Slug-specific metadata overrides for custom-patches/[slug] product pages.
 * Overrides the generic Sanity-derived title/description when a slug has an entry here.
 * All titles kept ≤60 chars per Task 2.5 SEO brief.
 */

interface ProductPageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

const productPageMeta: Record<string, ProductPageMeta> = {
  // Prices = 2"x2" @ 1,000 pcs, the canonical basis (must equal getFromPrice()).
  // "5pc minimum" lives in the description, never adjacent to the price in the
  // title, to avoid the "5 patches at $X" misread (PAE792).
  "embroidered": {
    title: "Custom Embroidered Patches from $0.91/pc (1k) | 24h Mockup",
    description: "Custom embroidered patches from $0.91/pc for 2x2 inches at 1,000 pieces; smaller orders cost more per piece. Any size, shape & color. Iron-on, sew-on or velcro backing. Digital mockup in 12 to 24 hours. 5-piece minimum. Ships in 7-14 days.",
    ogTitle: "Custom Embroidered Patches from $0.91/pc (1k) | 24h Mockup",
    ogDescription: "Embroidered patches from $0.91/pc (2x2, 1,000 pcs); smaller orders cost more per piece. Any size, shape & color. 12-24h mockup, 5-piece minimum, ships in 7-14 days.",
  },
  "pvc": {
    title: "Custom PVC Patches from $1.54/pc (1k) | 24h Mockup",
    description: "Custom PVC patches from $1.54/pc for 2x2 inches at 1,000 pieces; smaller orders cost more per piece. Waterproof, flexible & 3D-molded for tactical gear, outdoor brands & uniforms. 5-piece minimum, free design. Ships in 7-14 days.",
    ogTitle: "Custom PVC Patches from $1.54/pc (1k) | 24h Mockup",
    ogDescription: "PVC patches from $1.54/pc (2x2, 1,000 pcs); smaller orders cost more per piece. Waterproof, flexible & 3D-molded for tactical gear & uniforms. Free design, ships in 7-14 days.",
  },
  "woven": {
    title: "Custom Woven Patches from $1.54/pc (1k) | 24h Mockup",
    description: "Custom woven patches from $1.54/pc for 2x2 inches at 1,000 pieces; smaller orders cost more per piece. Ultra-fine detail, thin profile, perfect for small text and complex logos. 10-piece minimum. Digital mockup in 12 to 24 hours. Ships in 7-14 days.",
    ogTitle: "Custom Woven Patches from $1.54/pc (1k) | 24h Mockup",
    ogDescription: "Woven patches from $1.54/pc (2x2, 1,000 pcs); smaller orders cost more per piece. Ultra-fine detail for small text and complex logos. 12-24h mockup, ships in 7-14 days.",
  },
  "chenille": {
    title: "Custom Chenille Patches | Varsity & Letterman | Free Design",
    description: "Custom chenille patches for varsity jackets, letterman jackets, and sports teams. Soft raised texture, vibrant colors. Digital mockup in 12 to 24 hours. 5-piece minimum. Ships in 7-14 days.",
    ogTitle: "Custom Chenille Patches | Varsity & Letterman | Free Design",
    ogDescription: "Chenille patches for varsity and letterman jackets. Soft raised texture, vibrant colors. 12-24h mockup, ships in 7-14 days.",
  },
  "leather": {
    title: "Custom Leather Patches from $1.55/pc (1k) | 24h Mockup",
    description: "Custom leather patches from $1.55/pc for 2x2 inches at 1,000 pieces; smaller orders cost more per piece. Premium real and vegan leather for hats, bags, and apparel. Debossed or laser-engraved. Digital mockup in 12 to 24 hours. 5-piece minimum. Ships in 7-14 days.",
    ogTitle: "Custom Leather Patches from $1.55/pc (1k) | 24h Mockup",
    ogDescription: "Leather patches from $1.55/pc (2x2, 1,000 pcs); smaller orders cost more per piece. Premium real and vegan leather for hats, bags, apparel. 12-24h mockup, ships in 7-14 days.",
  },
  "custom-3d-embroidered-transfers": {
    title: "Custom 3D Embroidered Transfers from $1.58/pc (1k)",
    description: "Custom 3D embroidered transfers from $1.58/pc for 2x2 inches at 1,000 pieces; smaller orders cost more per piece. Raised foam-underlay texture, heat-pressed onto apparel with no sewing. Digital mockup in 12 to 24 hours. 5-piece minimum. Ships in 7-14 days.",
    ogTitle: "Custom 3D Embroidered Transfers from $1.58/pc (1k) | 24h Mockup",
    ogDescription: "3D embroidered transfers from $1.58/pc (2x2, 1,000 pcs); smaller orders cost more per piece. Raised foam texture, heat-pressed, no sewing. 12-24h mockup, ships in 7-14 days.",
  },
  "custom-chenille-glitter-patches": {
    title: "Custom Chenille Glitter Patches | 24h Mockup",
    description: "Custom chenille glitter patches with sparkling yarn for varsity jackets, cheer, dance, and fashion. Low 5-piece minimum, digital mockup in 12 to 24 hours.",
    ogTitle: "Custom Chenille Glitter Patches | Low 5-Piece Min | 24h Mockup",
    ogDescription: "Chenille glitter patches with sparkling metallic yarn for varsity jackets, cheer uniforms, and dance teams. Low 5-piece minimum, 12-24h mockup, ships in 7-14 days.",
  },
};

export default productPageMeta;
