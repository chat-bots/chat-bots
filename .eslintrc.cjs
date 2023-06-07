// @ts-check

const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:import/recommended'],
  plugins: ['prettier', 'unicorn'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'unicorn/filename-case': [
      'error',
      {
        case: 'snakeCase',
        ignore: ['\\.cjs$', '\\.js$', '\\.d.ts$'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.mts', '*.tsx', '*.mtsx'],
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      plugins: ['@typescript-eslint', 'tsdoc'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
})
