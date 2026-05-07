import html from '@html-eslint/eslint-plugin'
import parser from '@html-eslint/parser'
import swiftwcHtml from '@swiftwc/eslint-plugin/html/en'

export default [
  {
    files: ['**/*.html'],
    languageOptions: {
      parser,
    },
    plugins: {
      html,
      swiftwc: swiftwcHtml,
    },
    language: 'html/html',
    rules: {
      ...swiftwcHtml.configs.recommended.rules,
      'swiftwc/allowed-tags': 'error', //['error', { allowed: ['div', 'span', 'my-button', 'my-card'] }],
    },
  },
]
