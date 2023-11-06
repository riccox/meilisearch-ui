const theme = require('./src/style/theme.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,css,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: {
        sans: ['Lexend Deca', 'Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@sira-ui/tailwind')({
      themes: [
        {
          name: 'light',
          colorScheme: 'light',
          colors: {
            primary: '#f9377d',
            secondary: '#21004b',
          },
        },
      ],
    }),
  ],
};
