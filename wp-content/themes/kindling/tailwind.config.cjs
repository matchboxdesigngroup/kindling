// https://tailwindcss.com/docs/configuration
module.exports = {
  content: ['./index.php', './**/*.html', './**/*.php', './assets/**/*.{php,vue,js}'],
  theme: {
    colors: {
      /* if changes are made - update variables in blocks.scss and theme.json  */
      'grey': '#4d4d4f',
      'light-grey': '#f6f6f6',
      'medium-grey': '#667080',
      'dark-grey': '#333333',
      'blue': '#003da7',
      'dark-blue': '#002668',
      'orange': '#f5873c',
      'green': '#3e6533',
      'dark-green': '#375d2c',

      'black': '#000000',
      'white': '#ffffff',
      'transparent': 'transparent',
      'error': '#ff0000',
    },
    fontFamily: { /* TODO - this needs to match what is in the theme.json if we are using that method for fonts */
      sans: ['greycliff-cf', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif'],
      serif: ['Roboto Slab', 'Times New Roman', 'Times', 'serif'],
    },
    screens: {
      /* min-width */
      '2xs': '320px', /* Small Phone */
      'xs': '375px', /* Phone */
      'sm': '425px', /* Large Phone, Small Tablet */
      'md': '768px', /* Tablet */
      'ml': '960px', /* Small Laptop */
      'lg': '1100px', /* Laptop */
      'xl': '1240px', /* Container size */
      '2xl': '1440px', /* Large Laptop, Desktop */
      '3xl': '1920px', /* 4k Desktop */

      /* max-width - Only if needed to override core styles that use max-width */
      '-2xs': { max: '320px' }, /* Small Phone */
      '-xs': { max: '375px' }, /* Phone */
      '-sm': { max: '425px' }, /* Large Phone, Small Tablet */
      '-md': { max: '768px' }, /* Tablet */
      '-ml': { max: '960px' }, /* Small Laptop */
      '-lg': { max: '1100px' }, /* Laptop */
      '-xl': { max: '1240px' }, /* Container size */
      '-2xl': { max: '1440px' }, /* Large Laptop, Desktop */
      '-3xl': { max: '1920px' }, /* 4k Desktop */
    },
  },
  corePlugins: {
    preflight: false,
  },
};
