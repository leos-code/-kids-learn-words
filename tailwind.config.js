/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f5f5f5',
      },
      fontSize: {
        'character': '10rem',
      },
      fontFamily: {
        'kids': ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 