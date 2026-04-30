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
  "embroidered": {
    title: "Custom Embroidered Patches from $0.71 | Free Mockup | 4.8★",
    description: "Custom embroidered patches from $0.71/pc. Any size, shape & color. Iron-on, sew-on or velcro backing. Free design mockup in 24hrs. No minimums. Ships in 7-14 days. Get your free quote!",
    ogTitle: "Custom Embroidered Patches from $0.71 | Free Mockup | 4.8★",
    ogDescription: "Embroidered patches from $0.71/pc. Any size, shape & color. Free design mockup in 24hrs. No minimums. Ships in 7-14 days.",
  },
  "pvc": {
    title: "Custom PVC Patches from $1.20 | Free Design | 4.8★",
    description: "Custom PVC patches built to last. Waterproof, flexible & 3D-molded. Perfect for tactical gear, outdoor brands & uniforms. No minimums, free design. Ships in 7-14 days. Order now!",
    ogTitle: "Custom PVC Patches from $1.20 | Free Design | 4.8★",
    ogDescription: "PVC patches built to last. Waterproof, flexible & 3D-molded. Perfect for tactical gear, outdoor brands & uniforms. Free design, ships in 7-14 days.",
  },
  "woven": {
    title: "Custom Woven Patches from $0.65 | No Minimum | 24h Mockup",
    description: "Custom woven patches from $0.65/pc. Ultra-fine detail, thin profile, perfect for small text and complex logos. No minimums. Free design mockup in 24hrs. Ships in 7-14 days.",
    ogTitle: "Custom Woven Patches from $0.65 | No Minimum | 24h Mockup",
    ogDescription: "Woven patches from $0.65/pc. Ultra-fine detail for small text and complex logos. Free mockup, no minimums, ships in 7-14 days.",
  },
  "chenille": {
    title: "Custom Chenille Patches | Varsity & Letterman | Free Design",
    description: "Custom chenille patches for varsity jackets, letterman jackets, and sports teams. Soft raised texture, vibrant colors. Free design mockup in 24hrs. No minimums. Ships in 7-14 days.",
    ogTitle: "Custom Chenille Patches | Varsity & Letterman | Free Design",
    ogDescription: "Chenille patches for varsity and letterman jackets. Soft raised texture, vibrant colors. Free mockup, ships in 7-14 days.",
  },
  "leather": {
    title: "Custom Leather Patches from $1.50 | Free Mockup | 4.8★",
    description: "Custom leather patches from $1.50/pc. Premium real and vegan leather for hats, bags, and apparel. Debossed or laser-engraved. Free design mockup in 24hrs. Ships in 7-14 days.",
    ogTitle: "Custom Leather Patches from $1.50 | Free Mockup | 4.8★",
    ogDescription: "Leather patches from $1.50/pc. Premium real and vegan leather for hats, bags, apparel. Free mockup, ships in 7-14 days.",
  },
};

export default productPageMeta;
