/**
 * Mobile-First Typography System
 * Industry Standard & Google-Friendly Sizes
 *
 * Based on Material Design & WCAG Guidelines
 * Mobile: 16px base, Desktop: 18px base
 */

export const typography = {
  // Main Page Headings (H1)
  h1: "text-[28px] md:text-[36px] lg:text-[48px] xl:text-[56px] leading-[1.2] font-bold",
  h1Upper: "text-[28px] md:text-[36px] lg:text-[48px] xl:text-[56px] leading-[1.2] font-bold uppercase",

  // Section Headings (H2)
  h2: "text-[24px] md:text-[32px] lg:text-[40px] leading-[1.3] font-bold",
  h2Upper: "text-[24px] md:text-[32px] lg:text-[40px] leading-[1.3] font-bold uppercase",

  // Sub-Section Headings (H3)
  h3: "text-[20px] md:text-[24px] lg:text-[32px] leading-[1.4] font-semibold",
  h3Upper: "text-[20px] md:text-[24px] lg:text-[32px] leading-[1.4] font-semibold uppercase",

  // Card/Component Headings (H4)
  h4: "text-[18px] md:text-[20px] lg:text-[24px] leading-[1.4] font-semibold",

  // Small Headings (H5)
  h5: "text-[16px] md:text-[18px] lg:text-[20px] leading-[1.5] font-medium",

  // Body Text
  body: {
    large: "text-[16px] md:text-[18px] lg:text-[20px] leading-[1.7]",
    regular: "text-[15px] md:text-[16px] lg:text-[18px] leading-[1.6]",
    small: "text-[14px] md:text-[15px] lg:text-[16px] leading-[1.6]",
  },

  // UI Elements
  button: {
    large: "text-[16px] md:text-[18px] font-semibold",
    regular: "text-[14px] md:text-[16px] font-medium",
    small: "text-[13px] md:text-[14px] font-medium",
  },

  // Special Elements
  hero: {
    title: "text-[32px] md:text-[48px] lg:text-[64px] xl:text-[72px] leading-[1.1] font-black",
    subtitle: "text-[18px] md:text-[20px] lg:text-[24px] leading-[1.5] font-normal",
  },

  // Labels & Captions
  label: "text-[14px] md:text-[15px] font-medium",
  caption: "text-[12px] md:text-[13px] leading-[1.5]",
};

// Utility function to combine typography classes
export const combineTypography = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};
