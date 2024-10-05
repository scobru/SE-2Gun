const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
    },
  },

  daisyui: {
    themes: [
      {
        light: {
          primary: "#4A90E2",
          "primary-content": "#FFFFFF",
          secondary: "#34C759",
          "secondary-content": "#FFFFFF",
          accent: "#FF9500",
          "accent-content": "#FFFFFF",
          neutral: "#3A3A3C",
          "neutral-content": "#FFFFFF",
          "base-100": "#F2F2F7",
          "base-200": "#E5E5EA",
          "base-300": "#D1D1D6",
          "base-content": "#1C1C1E",
          info: "#5AC8FA",
          success: "#32D74B",
          warning: "#FFD60A",
          error: "#FF3B30",

          "--rounded-btn": "0.5rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--n))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
          ".btn": {
            textTransform: "uppercase",
            fontWeight: "600",
          },
        },
      },
      {
        dark: {
          primary: "#0A84FF",
          "primary-content": "#FFFFFF",
          secondary: "#30D158",
          "secondary-content": "#FFFFFF",
          accent: "#FF9F0A",
          "accent-content": "#FFFFFF",
          neutral: "#8E8E93",
          "neutral-content": "#1C1C1E",
          "base-100": "#1C1C1E",
          "base-200": "#2C2C2E",
          "base-300": "#3A3A3C",
          "base-content": "#F2F2F7",
          info: "#64D2FF",
          success: "#30D158",
          warning: "#FFD60A",
          error: "#FF453A",

          "--rounded-btn": "0.5rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--n))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
          ".btn": {
            textTransform: "uppercase",
            fontWeight: "600",
          },
        },
      },
    ],
  },

  plugins: [daisyui],
};

module.exports = config;
