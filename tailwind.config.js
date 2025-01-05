/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Incluye todos los componentes Angular
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e88e5',
        secondary: '#90caf9',
      },
      borderRadius: {
        custom: '12px',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};