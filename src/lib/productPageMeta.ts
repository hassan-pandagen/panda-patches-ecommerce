/**
 * Slug-specific metadata overrides for custom-patches/[slug] product pages.
 * Overrides the generic Sanity-derived title/description when a slug has an entry here.
 */

interface ProductPageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

const productPageMeta: Record<string, ProductPageMeta> = {
  "embroidered": {
    title: "Custom Embroidered Patches | No Minimum | Free Design | Panda Patches",
    description: "Custom embroidered patches from $0.71/pc. Any size, shape & color. Iron-on, sew-on or velcro backing. Free design mockup in 24hrs. No minimums. Ships in 7-14 days. Get your free quote!",
    ogTitle: "Custom Embroidered Patches | No Minimum | Free Design | Panda Patches",
    ogDescription: "Embroidered patches from $0.71/pc. Any size, shape & color. Free design mockup in 24hrs. No minimums. Ships in 7-14 days.",
  },
  "pvc": {
    title: "Custom PVC Patches | Waterproof & Durable | No Minimum | Panda Patches",
    description: "Custom PVC patches built to last. Waterproof, flexible & 3D-molded. Perfect for tactical gear, outdoor brands & uniforms. No minimums, free design. Ships in 7-14 days. Order now!",
    ogTitle: "Custom PVC Patches | Waterproof & Durable | Panda Patches",
    ogDescription: "PVC patches built to last. Waterproof, flexible & 3D-molded. Perfect for tactical gear, outdoor brands & uniforms. Free design, ships in 7-14 days.",
  },
};

export default productPageMeta;
