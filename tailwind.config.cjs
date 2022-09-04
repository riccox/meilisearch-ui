const theme = require('./src/style/theme.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,css,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: theme.colors
        },
    }
}
