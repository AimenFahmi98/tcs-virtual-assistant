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
          "--color-primary": "#f3f4f6", // Default theme colors
          "--color-primary-light": "#f9fafb",
          "--color-primary-dark": "#e5e7eb",
          "--color-primary-darker": "#d1d5db",
          "--color-secondary": "#e9e9e9",
          "--color-background": "#ffffff",
          "--color-accent": "#ffe4e48f",
          "--color-accent-light": "#ffe4e455",
          "--color-accent-secondary": "#fffbeb",
          "--color-text": "#555",
          "--color-text-light": "#55555595",
        },
        '[data-theme="theme1"]': {
          "--color-primary": "#f3f4f6", // Default theme colors
          "--color-primary-light": "#f9fafb",
          "--color-primary-dark": "#e5e7eb",
          "--color-primary-darker": "#d1d5db",
          "--color-secondary": "#e9e9e9",
          "--color-background": "#ffffff",
          "--color-accent": "#ffe4e48f",
          "--color-accent-light": "#ffe4e455",
          "--color-accent-secondary": "#fffbeb",
          "--color-text": "#555",
          "--color-text-light": "#55555595",
        },
        '[data-theme="theme2"]': {
          "--color-primary": "#fbbf24", // Theme 2 colors (yellow)
          "--color-primary-dark": "#e5e7eb",
          "--color-primary-darker": "#d1d5db",
          "--color-secondary": "#78350f",
          "--color-background": "#fffbeb",
          "--color-accent": "#355",
          "--color-text": "#fff4df",
          "--color-text-light": "#fff9df",
        },
        '[data-theme="theme3"]': {
          "--color-primary": "#3b82f6", // Theme 3 colors (blue)
          "--color-primary-dark": "#f3f3f3",
          "--color-primary-darker": "#e9e9e9",
          "--color-secondary": "#1e40af",
          "--color-background": "#eff6ff",
          "--color-accent": "#355",
          "--color-text": "#eee",
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
