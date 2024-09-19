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
        handwriting: ['Caveat', 'cursive'],
      },
      colors: {
        primary: {
          light: '#fef3c7', // amber-100
          DEFAULT: '#d97706', // amber-600
          dark: '#92400e', // amber-800
        },
        secondary: {
          light: '#e0f2fe', // sky-100
          DEFAULT: '#0284c7', // sky-600
          dark: '#075985', // sky-800
        },
        background: {
          light: '#fffbeb', // amber-50
          dark: '#1c1917', // stone-900
        },
        text: {
          light: '#1c1917', // stone-900
          dark: '#fef3c7', // amber-100
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            'blockquote p:first-of-type::before': {
              content: '""',
            },
            'blockquote p:last-of-type::after': {
              content: '""',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}