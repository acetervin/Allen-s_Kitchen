module.exports = {
  content: [
    "./index.html",
    "./script.js",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        brandBlack: '#000000',
        brandGray: '#121212',
        brandLight: '#1f1f1f',
        brandGold: '#D4AF37',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      animation: {
        swing: 'swing 2.5s ease-in-out infinite',
      },
      keyframes: {
        swing: {
          '0%': { transform: 'rotate(6deg)' },
          '50%': { transform: 'rotate(-6deg)' },
          '100%': { transform: 'rotate(6deg)' },
        }
      }
    }
  },
  plugins: []
  }
