/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

//eslint-disable-next-line
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primary_light: "var(--color-primary-light)",
        primary_dark: "var(--color-primary-dark)",
        primary_darker: "var(--color-primary-darker)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        background_accent_secondary: "var(--color-background-accent-secondary)",
        accent: "var(--color-accent)",
        accent_light: "var(--color-accent-light)",
        accent_secondary: "var(--color-accent-secondary)",
        text: "var(--color-text)",
        text_light: "var(--color-text-light)",
      },
      boxShadow: {
        sm_custom: "0 1px 2px rgba(0, 0, 0, 0.04)",
        md_custom: "0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06)",
        lg_custom: "0 2.4rem 3.2rem rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ":root": {
          "--color-primary": "#292929", // Darker base color
          "--color-primary-light": "#2f2f2fb5", // Lighter variation
          "--color-primary-dark": "#323232d9", // Even darker
          "--color-primary-darker": "#323232d9",
          "--color-secondary": "#374151", // Secondary shade
          "--color-background": "#212121", // Dark background
          "--color-background-accent-secondary": "#2e2e2e",
          "--color-accent": "#44403c",
          "--color-accent-light": "#ffe4e455",
          "--color-accent-secondary": "#fcd34d",
          "--color-text": "#ececec", // Light text
          "--color-text-light": "rgb(156 163 175)", // Muted light text
        },
        '[data-theme="light"]': {
          "--color-primary": "#f3f4f6", // Default theme colors
          "--color-primary-light": "#f9fafb",
          "--color-primary-dark": "#e5e7eb",
          "--color-primary-darker": "#d1d5db",
          "--color-secondary": "#e9e9e9",
          "--color-background": "#ffffff",
          "--color-background-accent-secondary": "#eff6ff",
          "--color-accent": "#ffe4e48f",
          "--color-accent-light": "#ffe4e455",
          "--color-accent-secondary": "#2563eb",
          "--color-text": "#555",
          "--color-text-light": "rgb(115 121 133)",
        },
        '[data-theme="dark"]': {
          "--color-primary": "#292929", // Darker base color
          "--color-primary-light": "#2f2f2fb5", // Lighter variation
          "--color-primary-dark": "#323232d9", // Even darker
          "--color-primary-darker": "#323232d9",
          "--color-secondary": "#374151", // Secondary shade
          "--color-background": "#212121", // Dark background
          "--color-background-accent-secondary": "#2e2e2e",
          "--color-accent": "#44403c",
          "--color-accent-light": "#ffe4e455",
          "--color-accent-secondary": "#fcd34d",
          "--color-text": "#ececec", // Light text
          "--color-text-light": "rgb(156 163 175)", // Muted light text
        },
        '[data-theme="spring"]': {
          "--color-primary": "#c3e6cb", // Soft pastel green (mint-like)
          "--color-primary-light": "#eafbea", // Lighter green with a fresh feel
          "--color-primary-dark": "#93c48b", // Slightly darker mint green
          "--color-primary-darker": "#76a374", // Deepened green for contrast
          "--color-secondary": "#fff4d6", // Gentle pastel yellow-orange
          "--color-background": "#fffaf0", // Very light cream-yellow background
          "--color-background-accent-secondary": "#eff6ff",
          "--color-accent": "#fcdba2", // Muted peachy yellow for accents
          "--color-accent-light": "#fef2d8", // Softer pale yellow for lighter accents
          "--color-accent-secondary": "#2563eb",
          "--color-text": "#3a5045", // Darker forest green for text
          "--color-text-light": "rgb(102 120 111)", // Muted gray-green for lighter text
        },
      });
    }),
    function ({ addUtilities }) {
      addUtilities({
        ".all-unset": {
          all: "unset",
        },
      });
    },
  ],
};
