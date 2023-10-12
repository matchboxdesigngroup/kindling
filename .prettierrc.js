const defaultConfig = require('@wordpress/scripts/config/.prettierrc');

module.exports = {
  ...defaultConfig,
  parenSpacing: false,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'all',
  overrides: [
    ...(defaultConfig.overrides ?? []),
    {
      files: '*.{css,sass,scss}',
      options: {
        singleQuote: true,
      },
    },
  ],
};
