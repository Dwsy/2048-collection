/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tile-2': '#eee4da',
        'tile-4': '#ede0c8',
        'tile-8': '#f2b179',
        'tile-16': '#f59563',
        'tile-32': '#f67c5f',
        'tile-64': '#f65e3b',
        'tile-128': '#edcf72',
        'tile-256': '#edcc61',
        'tile-512': '#edc850',
        'tile-1024': '#edc53f',
        'tile-2048': '#edc22e',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'merge': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'pop-in': 'pop-in 0.2s ease-in-out forwards',
        'merge': 'merge 0.2s ease-in-out'
      }
    },
  },
  plugins: [],
}
