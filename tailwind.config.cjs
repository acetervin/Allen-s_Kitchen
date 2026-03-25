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
      }
    }
  },
  plugins: []
}
