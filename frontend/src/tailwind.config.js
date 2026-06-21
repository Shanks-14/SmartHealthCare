/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Figtree', 'sans-serif'],
      },
      colors: {
        teal: {
          50: '#e6f5f3',
          100: '#b3e0db',
          400: '#2aada0',
          500: '#0a7c72',
          600: '#0d6b61',
        },
      },
    },
  },
  plugins: [],
};
