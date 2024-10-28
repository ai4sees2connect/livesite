/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'], // Replace 'Roboto' with your chosen font
      },
      keyframes: {
        growWidth_lg: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }, // Change to your desired final width
        },
      },
      animation: {
        'grow-width-lg': 'growWidth_lg 1.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
