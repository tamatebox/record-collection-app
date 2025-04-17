module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
    browser: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'warn',
    complexity: ['warn', 15],
    'max-lines-per-function': ['warn', 50],
  },
};
