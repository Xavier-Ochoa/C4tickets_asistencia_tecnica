/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
      },
      colors: {
        ticket: {
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
        },
        zinc: {
          950: '#09090b',
          900: '#0d0d0f',
          800: '#141418',
          700: '#1c1c22',
          600: '#26262e',
          500: '#36363f',
          400: '#6b6b7a',
          300: '#9898a8',
        }
      }
    }
  },
  plugins: []
}
