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
  // CL4FD2 §2 — the structural gap: competitors merchandise letters as a
  // category and we had no page for them. Sizes are stated as varsity
  // CONVENTION, never as our measured data (CEO ruling 2026-09-02: our own
  // chenille orders are 61% at 12in+, i.e. back pieces, not letter sets).
  "chenille-letters": {
    title: "Custom Chenille Letters | Full A-Z Set $150, Numbers $120",
    description: "Complete chenille alphabet, 26 letters for $150, or the 0-9 number set for $120, in your size and yarn colour. Single letters and names from 5 pieces. 2 in minimum, 3 in+ recommended. Free worldwide shipping, no setup fees.",
    ogTitle: "Custom Chenille Letters | Full A-Z Alphabet Set $150, 0-9 Numbers $120",
    ogDescription: "Single letters, names, full A-Z sets and year numerals. One batch means one dye lot. Free digital mockup in 12 to 24 hours.",
  },
  "patches-for-hats": {
    title: "Custom Patches for Hats | Embroidered, Leather & PVC | Panda Patches",
    description: "Custom hat patches for snapbacks, truckers, fitted caps & beanies. Embroidered, woven & leather options. Mockup in 12-24 hours, ships in 7-14 days. From $0.91/pc (2x2, 1,000 pcs). Get a free quote!",
    ogTitle: "Custom Hat Patches | Embroidered & Leather for Caps, Snapbacks & More",
    ogDescription: "Hat patches for snapbacks, trucker hats, fitted caps & beanies. Embroidered, woven & leather. Mockup in 12-24 hours.",
  },
  "custom-jacket-patches": {
    title: "Custom Jacket Patches | Biker, Varsity & Denim | Panda Patches",
    description: "Custom patches for jackets: biker vests, varsity letterman, denim & work jackets. Embroidered, chenille & PVC. Iron-on or sew-on. Free design, ships in 7-14 days. Get a free quote!",
    ogTitle: "Custom Jacket Patches | Biker, Varsity & Denim | Panda Patches",
    ogDescription: "Patches for biker vests, varsity letterman, denim & work jackets. Embroidered, chenille & PVC. Free design, ships in 7-14 days.",
  },
  "motorcycle-patches": {
    title: "Custom Motorcycle Patches | MC Club & Biker Vest Patches | Panda Patches",
    description: "Custom motorcycle club patches & biker vest patches. Top & bottom rockers, center patches, MC logos. Embroidered or PVC. Low 5-piece minimum, free design. Ships in 7-14 days!",
    ogTitle: "Custom Motorcycle Patches | MC Club & Biker Vest Patches | Panda Patches",
    ogDescription: "Motorcycle club patches and biker vest patches. Top & bottom rockers, center patches, MC logos. Embroidered or PVC. Free design.",
  },
  // Added June 2026 (WEBSIT_1.MD T22). Scout earned highest-priority status
  // because the OCP + boy scout placement guides drive ~30K monthly
  // impressions with no commercial page to capture intent.
  "custom-scout-patches": {
    title: "Custom Scout Patches | BSA, GSA, Cub, Webelos, Eagle | Panda Patches",
    description: "Custom scout patches for Cub Scouts, Webelos, Boy Scouts, Girl Scouts, Venturing Crew, and Eagle Scout courts of honor. BSA Insignia Guide compliant, low 5-piece minimum, mockup in 12-24 hours.",
    ogTitle: "Custom Scout Patches: Cub, Webelos, Eagle, Girl Scouts, Venturing",
    ogDescription: "Patrol patches, troop numerals, council strips, custom merit badges, segments, and event patches. BSA Insignia Guide compliant. 5-piece minimum, free worldwide shipping.",
  },
  "custom-tactical-patches": {
    title: "Custom Tactical Patches | Velcro, IR, Subdued | Panda Patches",
    description: "Custom tactical patches with hook and loop, IR-reflective thread, and subdued colorways. Built for plate carriers, range bags, and operator gear. 5-piece minimum, free worldwide shipping.",
    ogTitle: "Custom Tactical Patches: Velcro Backing, IR Thread, Subdued Colors",
    ogDescription: "Tactical patches for plate carriers, range bags, and operator gear. Hook and loop, IR-reflective options, subdued colorways. Low 5-piece minimum.",
  },
  "custom-morale-patches": {
    title: "Custom Morale Patches | PVC, Embroidered, Velcro | Panda Patches",
    description: "Custom morale patches for units, teams, and crews. PVC for waterproof field use or embroidered with metallic and glow-in-the-dark options. Hook and loop backing standard. 5-piece minimum.",
    ogTitle: "Custom Morale Patches: PVC, Embroidered, Hook and Loop Backing",
    ogDescription: "Morale patches for units, teams, and crews. PVC waterproof or embroidered with metallic and glow options. Hook and loop backing. 5-piece minimum.",
  },
};

export default patchStyleMeta;
