module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-underscore-dangle': 0,
    'prefer-destructuring': 0,
    'no-use-before-define': [
      'error',
      {
        functions: false,
      },
    ],
    'no-await-in-loop': 0,
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'arrow-parens': [
      2,
      'as-needed',
    ],
    'max-len': [
      'error',
      {
        code: 200,
      },
    ],
  },
};
