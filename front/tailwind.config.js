/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nexon: ['NEXON Lv2 Gothic', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        brandP: '#7D17FF',
        brandPhover: '#630dd3',
        brandY: '#FFD600',
        brandText: '#4b4b4b',
      },
      boxShadow: {
        custom: '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
        customhover: '0 2px 10px 0 rgba(0, 0, 0, 0.3)',
      },
      aspectRatio: {
        '7.25/10': '7.25 / 10',
        '1/1': '1/1',
        '9/16': '9/16',
      },
    },
  },
  plugins: [],
};
