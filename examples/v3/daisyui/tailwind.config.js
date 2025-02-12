/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{client,server}/**/*.{gren,html,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
}
