/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./dist/**/*.html",
  ],
  darkMode: 'class',
  theme: { extend: {}, },
  plugins: [],
  safelist: [
    {
      pattern: /./,
    },
  ],
}; 