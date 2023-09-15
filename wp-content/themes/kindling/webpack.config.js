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
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              pngquant: {
                enabled: false,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  entry: {
    ...defaultConfig.entry,
    front: path.resolve(process.cwd(), `${entryPath}/scripts`, 'front.js'),
    editor: path.resolve(process.cwd(), `${entryPath}/scripts`, 'editor.js'),
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
