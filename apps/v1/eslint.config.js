import html from '@html-eslint/eslint-plugin'
import parser from '@html-eslint/parser'
import swiftwc from '../../packages/eslint-plugin/generated/html/en.js'

export default [
  {
    files: ['**/*.html'],
    languageOptions: {
      parser,
    },
    plugins: {
      html,
      swiftwc,
    },
    language: 'html/html',
    rules: {
      ...swiftwc.configs.recommended.rules,
      'swiftwc/allowed-tags': 'error', //['error', { allowed: ['div', 'span', 'my-button', 'my-card'] }],
    },
  },
]
