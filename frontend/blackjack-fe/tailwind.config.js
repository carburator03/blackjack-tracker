const { basename } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['lemonade'],
    base: true,
    utils: true,
    logs: true,
    themeRoot: ':root',
  },
};
