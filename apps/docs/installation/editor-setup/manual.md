# Linting for Typescript Projects

**Run the following command to add SwiftWC to your project:**

::: code-group

```sh{4} [npm]
npm i -D eslint@latest @eslint/js@latest @swiftwc/eslint-plugin@latest
```

:::

**Add this to your ESLint configuration file:**

:::: info Modify `eslint.config.js` like this:

::: code-group

```js [🇺🇸]
import html from "@html-eslint/eslint-plugin";
import parser from "@html-eslint/parser";
// [!code ++]
import swiftwc from "@swiftwc/eslint-plugin/html/en";

export default [
  {
    files: ["**/*.html"],
    languageOptions: {
      parser,
    },
    plugins: {
      html,
      // [!code ++]
      swiftwc,
    },
    language: "html/html",
    rules: {
      // [!code ++]
      ...swiftwc.configs.recommended.rules,
      // 👇🏻 customize above rules here
    },
  },
];
```

:::

::::

::: details `@html-eslint/eslint-plugin` and `@html-eslint/parser` are required for linting HTML files

They are used to understand your code before applying any rules.

```sh{4} [npm]
npm i -D @html-eslint/eslint-plugin @html-eslint/parser
```

:::
