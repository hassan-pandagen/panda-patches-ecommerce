import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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