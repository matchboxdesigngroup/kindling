module.exports = {
  extends: [
    require.resolve('@wordpress/scripts/config/.stylelintrc'),
    'stylelint-config-prettier',
  ],
  rules: {
    indentation: 2,
    'function-url-quotes': 'always',
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['inside-block'],
      },
    ],
    'scss/at-extend-no-missing-placeholder': null,
    'string-quotes': 'single',
  },
};
