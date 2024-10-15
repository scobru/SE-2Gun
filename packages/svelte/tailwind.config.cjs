const typography = require("@tailwindcss/typography");
const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Futura Cyrillic Book",
          "AvenirLTStd-Book",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        "ableton-blue": "#0000ff",
        "ableton-light-blue": "#cdbefd",
        "ableton-yellow": "#fbffa7",
        "ableton-green": "#b6ffc0",
        "ableton-orange": "#ff764d",
        "ableton-beige": "#ebf0dc",
      },
    },
  },

  daisyui: {
    themes: [
      {
        abletonLight: {
          primary: "#0000ff",
          "primary-content": "#FFFFFF",
          secondary: "#000000",
          "secondary-content": "#FFFFFF",
          accent: "#fbffa7",
          "accent-content": "#000000",
          neutral: "#000000",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F5F5F5",
          "base-300": "#E0E0E0",
          "base-content": "#000000",
          info: "#0000ff",
          success: "#b6ffc0",
          warning: "#fbffa7",
          error: "#ff764d",

          "--rounded-btn": "0",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",

          ".tooltip": {
            "--tooltip-tail": "0",
            "--tooltip-color": "#000000",
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
            borderRadius: "0",
          },
        },
        abletonDark: {
          primary: "#FF00FF", // Cambiato il colore primario a magenta
          "primary-content": "#FFFFFF",
          secondary: "#FFFFFF",
          "secondary-content": "#000000",
          accent: "#fbffa7",
          "accent-content": "#000000",
          neutral: "#FFFFFF",
          "neutral-content": "#000000",
          "base-100": "#000000",
          "base-200": "#1A1A1A",
          "base-300": "#2A2A2A",
          "base-content": "#FFFFFF",
          info: "#FF00FF", // Aggiornato per corrispondere al nuovo colore primario
          success: "#b6ffc0",
          warning: "#fbffa7",
          error: "#ff764d",

          "--rounded-btn": "0",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",

          ".tooltip": {
            "--tooltip-tail": "0",
            "--tooltip-color": "#FFFFFF",
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
            borderRadius: "0",
          },
        },
      },
    ],
  },

  plugins: [typography, daisyui],
};

module.exports = config;
