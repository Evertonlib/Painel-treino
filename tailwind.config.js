/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        grafite: {
          DEFAULT: '#14171b',
          soft: '#1c2025',
          line: '#282d33',
        },
        giz: {
          DEFAULT: '#f3f1ea',
          soft: '#fbfaf6',
          line: '#e4e0d4',
        },
        pista: {
          DEFAULT: '#d6482e',
          soft: '#f0d9d3',
          dark: '#b83a24',
        },
        zona: {
          z1: '#4d7ea8',
          z2: '#3f9e83',
          z3: '#d7a233',
          z4: '#dd7a2c',
          z5: '#c73a2f',
          forca: '#7c5cbf',
          off: '#767d87',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        wideish: '0.02em',
      },
    },
  },
  plugins: [],
}
