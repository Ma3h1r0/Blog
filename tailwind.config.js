/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        handwriting: ['Caveat', 'cursive'], // 添加这一行
      },
    },
  },
  plugins: [],
}