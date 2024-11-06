/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      clipPath: {
        'custom-polygon': 'polygon(0 0, 100% 0, 76% 100%, 0% 100%)',
      },
    },
  },
  plugins: [],
}

