/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
import daisyui from "daisyui";

//eslint-disable-next-line
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "450px", // Extra Small (e.g., iPhone SE)
        sm: "640px", // Small (default Tailwind breakpoint)
        md: "768px", // Medium (default)
        lg: "1024px", // Large (default)
        xl: "1280px", // Extra Large (default)
        "2xl": "1536px", // 2X Large (default)
        "3xl": "1920px", // Custom Large Screens (e.g., 4K)
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        "slide-up": "slideUp 0.5s ease-in-out",
      },
      colors: {
        primary: "var(--color-primary)",
        primary_light: "var(--color-primary-light)",
        primary_dark: "var(--color-primary-dark)",
        primary_darker: "var(--color-primary-darker)",
        secondary: "var(--color-secondary)",
        secondary_light: "var(--color-secondary-light)",
        background: "var(--color-background)",
        background_accent_secondary: "var(--color-background-accent-secondary)",
        accent: "var(--color-accent)",
        accent_light: "var(--color-accent-light)",
        accent_secondary: "var(--color-accent-secondary)",
        accent_secondary_light: "var(--color-accent-secondary-light)",
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
    daisyui, // ✅ Enable DaisyUI
    plugin(function ({ addBase }) {
      addBase({
        '[data-theme="light"]': {
          "--color-primary": "#f3f4f6",
          "--color-primary-light": "#f9fafb",
          "--color-primary-dark": "#e5e7eb",
          "--color-primary-darker": "#d1d5db",
          "--color-background": "#ffffff",
          "--color-background-accent-secondary": "#eff6ff",
          "--color-accent": "#ffe4e48f",
          "--color-accent-light": "#ffe4e455",
          "--color-accent-secondary": "#2563eb",
          "--color-accent-secondary-light": "#2563ebbb",
          "--color-secondary": "#4CAF50",
          "--color-secondary-light": "#4caf50db",
          "--color-text": "#555",
          "--color-text-light": "#6b7280dd",
        },
        '[data-theme="dark"]': {
          "--color-primary": "#292929",
          "--color-primary-light": "#2f2f2fb5",
          "--color-primary-dark": "#323232d9",
          "--color-primary-darker": "#323232d9",
          "--color-background": "#212121",
          "--color-background-accent-secondary": "#2e2e2e",
          "--color-accent": "#44403c",
          "--color-accent-light": "#ffe4e455",
          "--color-accent-secondary": "#fcd34d",
          "--color-secondary": "#009688",
          "--color-secondary-light": "#009688",
          "--color-text": "#dedede",
          "--color-text-light": "rgb(156 163 175)",
        },
        '[data-theme="spring"]': {
          "--color-primary": "#c3e6cb",
          "--color-primary-light": "#eafbea",
          "--color-primary-dark": "#93c48b",
          "--color-primary-darker": "#76a374",
          "--color-background": "#fffaf0",
          "--color-background-accent-secondary": "#eff6ff",
          "--color-accent": "#fcdba2",
          "--color-accent-light": "#fef2d8",
          "--color-accent-secondary": "#2563eb",
          "--color-secondary": "#009688",
          "--color-secondary-light": "#009688",
          "--color-text": "#3a5045",
          "--color-text-light": "rgb(102 120 111)",
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
  daisyui: {
    themes: [
      {
        light: {
          primary: "#f3f4f6",
          "primary-light": "#f9fafb",
          "primary-dark": "#e5e7eb",
          "primary-darker": "#d1d5db",
          background: "#ffffff",
          "background-accent-secondary": "#eff6ff",
          accent: "#ffe4e48f",
          "accent-light": "#ffe4e455",
          "accent-secondary": "#2563eb",
          "accent-secondary-light": "#2563ebbb",
          secondary: "#4CAF50",
          "secondary-light": "#4caf50db",
          text: "#555",
          "text-light": "#6b7280dd",
        },
      },
      {
        dark: {
          primary: "#292929",
          "primary-light": "#2f2f2fb5",
          "primary-dark": "#323232d9",
          "primary-darker": "#323232d9",
          background: "#212121",
          "background-accent-secondary": "#2e2e2e",
          accent: "#44403c",
          "accent-light": "#ffe4e455",
          "accent-secondary": "#fcd34d",
          secondary: "#009688",
          "secondary-light": "#009688",
          text: "#ececec",
          "text-light": "rgb(156 163 175)",
        },
      },
      {
        spring: {
          primary: "#c3e6cb",
          "primary-light": "#eafbea",
          "primary-dark": "#93c48b",
          "primary-darker": "#76a374",
          background: "#fffaf0",
          "background-accent-secondary": "#eff6ff",
          accent: "#fcdba2",
          "accent-light": "#fef2d8",
          "accent-secondary": "#2563eb",
          secondary: "#009688",
          "secondary-light": "#009688",
          text: "#3a5045",
          "text-light": "rgb(102 120 111)",
        },
      },
    ],
  },
};
