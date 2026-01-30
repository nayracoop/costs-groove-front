/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './app.{vue,js,ts}',
    '../nyr-module/runtime/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {}
  },
  safelist: [
    'text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm',
    'font-bold', 'font-semibold', 'leading-relaxed',
    'text-[color:var(--nyr-fg)]'
  ],
  plugins: []
}
  theme: {
    extend: {
      colors: {
        olive: '#6e634a',
        cream: '#f4ecdd',
        charcoal: '#21241e',
        sage: '#b1bca2',
        stone: '#9d9ea2',
        cocoa: '#402210'
      }
    }
  },
