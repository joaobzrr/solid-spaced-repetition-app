/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./packages/renderer/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))"
      }
    },
  },
  plugins: [require("tailwindcss-animate")]
}
