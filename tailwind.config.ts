// @ts-ignore
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      background: "rgb(var(--color-background) / <alpha-value>)",
      ...colors,
    },
    extend: {},
  },
  mode: "jit",
  plugins: [],
};

// import { type Config } from "tailwindcss";
//
// export default {
//   content: ["./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// } as Config;
