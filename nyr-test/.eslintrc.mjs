import eslintConfig from '../config/eslint.js'

export default [
  {
    ignores: ['node_modules/**', '.nuxt/**', '.output/**', 'dist/**']
  },
  {
    files: ['**/*.{js,mjs,vue}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      }
    },
    rules: eslintConfig.rules
  }
]
