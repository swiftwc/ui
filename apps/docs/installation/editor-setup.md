# Editor Setup

Tooling to improve the developer experience when working with SwictWC.

## IntelliSense for VS Code

:::: info Modify `settings.json` of your VSCode like this:

::: code-group

```json [🇺🇸]
{
  // [!code ++]
  "html.customData": ["./packages/ui/web-components.html-data/en.json"]
}
```

:::

::::

## Linting

Highlighting errors and potential bugs in your HTML markup.

::: code-group

```sh{4} [npm]
npm i -D @swiftwc/eslint-plugin@latest
```

:::

**Add this to your eslit configuration:**

::: code-group

```js{4} [esling.config.js]
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
      'swiftwc': allowedHtmlTags,
    },
    language: 'html/html',
    rules: {
      'swiftwc/allowed-tags': 'error',
    },
  },
]
```

:::
