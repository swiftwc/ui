# Linting for Typescript Projects

**Run the following command to add SwiftWC to your project:**

:::tabs key:install

== latest

::: code-group

```bash [npm]
npm i -D eslint@latest @eslint/js@latest @swiftwc/eslint-plugin@latest
```

```bash [bun]
bun add --exact eslint@latest @eslint/js@latest @swiftwc/eslint-plugin@latest --dev
```

:::

**Add this to your ESLint configuration file:**

:::: info Modify `eslint.config.js` like this:

::::tabs key:theme

== 🇺🇸

```js [eslint.config.js]
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

::::

::: details `@html-eslint/eslint-plugin` and `@html-eslint/parser` are required for linting HTML files

They are used to understand your code before applying any rules.

```bash [npm]
npm i -D @html-eslint/eslint-plugin @html-eslint/parser
```

```bash [bun]
bun add --exact @html-eslint/eslint-plugin @html-eslint/parser --dev
```

:::
