const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000', // very dark green, almost black
        foreground: '#FCF', // bright silvery
        blood: '#C00', // dark red    
      },
      fontFamily: {
        dancing: ['"Dancing Script"', ...fontFamily.sans],
        abel: ['"Abel"', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}