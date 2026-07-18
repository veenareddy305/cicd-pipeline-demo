module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {},
  },
];
