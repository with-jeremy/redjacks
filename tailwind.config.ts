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
      blood: 'red',
      silver: 'hsl(var(--silver))'
    }
  },
  },
  plugins: [],
}
