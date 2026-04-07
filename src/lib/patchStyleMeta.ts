/**
 * Custom metadata for patch style pages (patchStyle documents in Sanity).
 * Overrides the generic template when a slug has a specific entry here.
 * Same pattern as cityPageMeta.ts for location pages.
 */

interface PatchStyleMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

const patchStyleMeta: Record<string, PatchStyleMeta> = {
  "patches-for-hats": {
    title: "Custom Patches for Hats | Embroidered, Leather & PVC | Panda Patches",
    description: "Custom hat patches for snapbacks, truckers, fitted caps & beanies. Embroidered, woven & leather options. Free mockup in 24hrs, ships in 7-14 days. Starting at $0.71/pc. Get a free quote!",
    ogTitle: "Custom Hat Patches | Embroidered & Leather for Caps, Snapbacks & More",
    ogDescription: "Hat patches for snapbacks, trucker hats, fitted caps & beanies. Embroidered, woven & leather. Free mockup in 24 hours.",
  },
  "custom-jacket-patches": {
    title: "Custom Jacket Patches | Biker, Varsity & Denim | Panda Patches",
    description: "Custom patches for jackets: biker vests, varsity letterman, denim & work jackets. Embroidered, chenille & PVC. Iron-on or sew-on. Free design, ships in 7-14 days. Get a free quote!",
    ogTitle: "Custom Jacket Patches | Biker, Varsity & Denim | Panda Patches",
    ogDescription: "Patches for biker vests, varsity letterman, denim & work jackets. Embroidered, chenille & PVC. Free design, ships in 7-14 days.",
  },
  "motorcycle-patches": {
    title: "Custom Motorcycle Patches | MC Club & Biker Vest Patches | Panda Patches",
    description: "Custom motorcycle club patches & biker vest patches. Top & bottom rockers, center patches, MC logos. Embroidered or PVC. No minimums, free design. Ships in 7-14 days!",
    ogTitle: "Custom Motorcycle Patches | MC Club & Biker Vest Patches | Panda Patches",
    ogDescription: "Motorcycle club patches and biker vest patches. Top & bottom rockers, center patches, MC logos. Embroidered or PVC. Free design.",
  },
};

export default patchStyleMeta;
