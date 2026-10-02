/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mary: {
          maroon: '#850B0C',
          darkmaroon: '#5A0506',
          lightmaroon: '#A61B1D',
          gold: '#D4AF37',
          brightgold: '#F59E0B',
          lightgold: '#FEF3C7',
          navy: '#0F1E36',
          cream: '#FFFDF9',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.4)',
        'maroon-glow': '0 0 25px -5px rgba(133, 11, 12, 0.4)',
      }
    },
  },
  plugins: [],
}
