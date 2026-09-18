/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-[#059669]',
    'bg-[#dc2626]',
    'bg-[#d97706]',
    'border-[#34d399]/70',
    'border-[#f87171]/70',
    'border-[#fbbf24]/70',
    'bg-emerald-600',
    'bg-red-600',
    'bg-amber-600',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        background: '#020c1b',
        surface: 'rgba(10, 25, 47, 0.85)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
