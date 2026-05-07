# @swiftwc/eslint-plugin

Rules enforcing best practices while using [SwiftWC](https://github.com/swiftwc/ui/blob/main/README.md).

## Installation

### 1. Install ESLint and SwiftWC packages:

```bash
npm i -D eslint@latest @eslint/js@latest @swiftwc/eslint-plugin@latest
```

### 2. Set up the configuration file at `eslint.config.js`:

```js
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
```
