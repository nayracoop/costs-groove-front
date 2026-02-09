/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './app.{vue,js,ts}',
    '../nyr-module/runtime/components/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        stone: '#9d9ea2',
        cream: '#f4ecdd',
        sage: '#b1bca2'
      }
    }
  },
  plugins: []
}