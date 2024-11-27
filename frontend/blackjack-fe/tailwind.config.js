const { basename } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        blackjack: {
          primary: '#0369a1',

          'primary-content': '#ffffff',

          secondary: '#0f766e',

          'secondary-content': '#ffffff',

          accent: '#155e75',

          'accent-content': '#ffffff',

          neutral: '#011c30',

          'neutral-content': '#ffffff',

          'base-100': '#ffffff',

          'base-200': '#dedcd9',

          'base-300': '#bebcb9',

          'base-content': '#161615',

          info: '#134e4a',

          'info-content': '#ffffff',

          success: '#16a34a',

          'success-content': '#ffffff',

          warning: '#ca8a04',

          'warning-content': '#ffffff',

          error: '#dc2626',

          'error-content': '#ffffff',
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    themeRoot: ':root',
  },
};
