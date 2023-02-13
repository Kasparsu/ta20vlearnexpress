/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.njk", "./assets/js/**/*.svelte"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}
