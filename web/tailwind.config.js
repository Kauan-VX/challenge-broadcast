/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  important: '#root',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FFDE06',
          50: '#FFFCE0',
          100: '#FFF8B5',
          400: '#FFE74D',
          500: '#FFDE06',
          600: '#E6C700',
          900: '#8A7A00',
        },
        ink: {
          950: '#0A0A0A',
          900: '#101010',
          800: '#161616',
          700: '#1C1C1C',
          600: '#232323',
          500: '#2A2A2A',
          400: '#3A3A3A',
        },
      },
    },
  },
  plugins: [],
};
