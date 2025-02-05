/* eslint-disable no-undef */
module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
      es6: true,
      node: true,
      browser: false,
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  };
  