import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ocean: {
          DEFAULT: "#1a3a5c",
          dark: "#0f2440",
          light: "#2a5a8c",
        },
        gold: {
          DEFAULT: "#d4a017",
          light: "#f0c040",
          dark: "#a07810",
        },
      },
    },
  },
  plugins: [],
};
export default config;
