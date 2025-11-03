/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#608BC1',
        secondary: '#FEFEFE',
        background: '#003161',
      },
    },
  },
  plugins: [],
};
