/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'tileforms': {
          50:  '#fef3f2',
          100: '#fee3e1',
          200: '#fdcbc7',
          300: '#faa8a1',
          400: '#f57b70',
          500: '#eb5046',
          600: '#d83027',
          700: '#b5231b',
          800: '#96201a',
          900: '#7d211c',
          950: '#440d0a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
