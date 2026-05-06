import html from '@html-eslint/eslint-plugin'
import parser from '@html-eslint/parser'
import allowedHtmlTags from '@swiftwc/eslint-plugin/html'

export default [
  {
    files: ['**/*.html'],
    languageOptions: {
      parser,
    },
    plugins: {
      html,
      'allowed-html-tags': allowedHtmlTags,
    },
    language: 'html/html',
    rules: {
      'allowed-html-tags/allowed-tags': 'error', //['error', { allowed: ['div', 'span', 'my-button', 'my-card'] }],
    },
  },
]
