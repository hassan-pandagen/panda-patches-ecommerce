import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // The bare `container` class derives its max-width from the screens list.
    // Without this block it would inherit the new 3xl/4xl (1920/2560) below and
    // go full-bleed on large monitors. Pin it to the default ladder that STOPS
    // at 2xl (1536px) so any bare container (e.g. the homepage hero, which has
    // no explicit max-w-[...]) is hard-capped at 1536px and never full-bleed.
    // Values <=1535px match Tailwind's defaults exactly, so nothing changes there.
    container: {
      center: true,
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      // Large-screen scaling steps (brief §3). Below 1536px nothing changes —
      // Tailwind's built-in 2xl (1536px) plus these two drive the stepped
      // container widths (on explicit max-w-[1200px] wrappers) and the root
      // font-size media queries in globals.css. They do NOT widen the bare
      // container, which is pinned above.
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
      },
      colors: {
        panda: {
          green: "#3B7E00",
          yellow: "#E3FF15",
          dark: "#001400",
          border: "#676767",
          light: "#F9FAF5",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
};
export default config;
