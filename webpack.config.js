const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: '../../../.env' });

const isProduction = process.env.NODE_ENV === 'production';
//const siteUrl = process.env.WP_SITEURL;

const entryPath = 'assets';
const outputPath = 'build';

module.exports = {
  ...defaultConfig,
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
    ],
  },
  entry: {
    ...defaultConfig.entry,
    front: path.resolve(process.cwd(), `${entryPath}/scripts`, 'front.js'),
    editor: path.resolve(process.cwd(), `${entryPath}/scripts`, 'editor.js'),
    blockVariations: path.resolve(process.cwd(), `${entryPath}/scripts`, 'blockVariations.js')
  },
  output: {
    ...defaultConfig.output,
    // [name] is an alias for the entry point
    filename: '[name].js',
    path: path.resolve(process.cwd(), outputPath),
  },
  resolve: {
    ...defaultConfig.resolve,
    extensions: ['.js', '.scss'],
  },
  stats: {
    all: false, // Disable all stats output
    errors: true, // Show errors only
    errorDetails: true, // Display error details
  },
  plugins: [
    ...defaultConfig.plugins,
    // Replace LiveReload with BrowserSync in order to watch the PHP files
    !isProduction &&
      new BrowserSyncPlugin(
        {
          files: [
            '**/*.php',
            `${outputPath}/**/*.js`,
            `${outputPath}/**/*.css`,
          ],
          open: true,
          proxy: 'https://kindling.ddev.site/',
        },
        // Prevent BrowserSync from reloading the page and let Webpack take care of this
        {
          reload: true,
        },
      ),
  ].filter(Boolean),
};
