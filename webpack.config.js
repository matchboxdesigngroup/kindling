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
    front: path.resolve(process.cwd(), `${entryPath}/scripts/front.js`),
    editor: path.resolve(process.cwd(), `${entryPath}/scripts/editor.js`),
    blockVariations: path.resolve(process.cwd(), `${entryPath}/scripts/blockVariations.js`),
  },
  output: {
    ...defaultConfig.output,
    // Dynamically set the filename and path based on the entry name
    filename: (pathData) => {
      const name = pathData.chunk.name;

      // Send files to the block-extensions folder if they start with 'block-extensions/'
      if (name.startsWith('block-extensions/')) {
        return `${name}.js`;
      }

      // Default to placing in the scripts directory
      return `scripts/${name}.js`;
    },
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
