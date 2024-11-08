// External Imports
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  darkMode: ["class"],

  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1536px",
      },
    },

    screens: {
      xs: "356px",
      sm: "400px",
      smd: "532px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },

    extend: {
      fontSize: {
        rs: ["13px", "18px"],
      },

      colors: {
        background: "#0A0A0A",
        foreground: "#F3F3F3",
        brand: {
          // Accessible Text
          100: "#EFF3A3",
          200: "#DEE281",

          // Solid Colors
          300: "#DBDF90",
          400: "#E5E999",

          // Borders and Separators
          500: "#707100",
          600: "#5A5B00",
          700: "#494A00",

          // Interactive Components
          800: "#3C3C00",
          900: "#303100",
          1000: "#262605",

          // Backgrounds
          1100: "#18190D",
          1200: "#111209",
        },
      },

      keyframes: {
        load: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0.15" },
        },
      },

      animation: {
        load: "load 1.2s linear infinite",
      },
    },
  },
  plugins: [
    // tailwindcssAnimate,
    plugin(function ({ addVariant }) {
      addVariant("trigger", [
        "@media (min-width: 976px) { &:hover }",
        "&:active",
      ]);
      addVariant("group-trigger", [
        ":merge(.group):active &",
        "@media (min-width: 976px) { :merge(.group):hover & }",
      ]);
      addVariant("peer-trigger", [
        ":merge(.peer):active ~ &",
        "@media (min-width: 976px) { :merge(.peer):lg:hover ~ & }",
      ]);
    }),
  ],
};

export default config;
