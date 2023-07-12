// @ts-ignore
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...colors,
      accent: "#64CCC5",
      neutral: "#DAFFFB",
      background: "#001C30",
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
