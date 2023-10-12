const defaultPrettierConfig = require('./.prettierrc');

module.exports = {
  // This is our root ESLint config file
  root: true,
  extends: [require.resolve('@wordpress/scripts/config/.eslintrc')],
  rules: {
    'prettier/prettier': ['error', defaultPrettierConfig],
    'prefer-arrow-callback': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
      },
    },
  },
};
