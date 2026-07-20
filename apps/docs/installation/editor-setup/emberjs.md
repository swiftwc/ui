# Linting for Ember.js Projects

**Run the following command to add SwiftWC to your project:**

:::tabs key:channel

== latest

::: code-group

```bash [ember CLI]
ember install @swiftwc/eslint-plugin@latest
```

```bash [npm]
npm i -D @swiftwc/eslint-plugin@latest
```

```bash [bun]
bun add --exact @swiftwc/eslint-plugin@latest --dev
```

:::

**Add this to your ESLint configuration file:**

:::: info Modify `eslint.config.js` like this:

::::tabs key:theme

== 🇺🇸

```js [eslint.config.js]
import globals from "globals";
import js from "@eslint/js";

import ts from "typescript-eslint";

import ember from "eslint-plugin-ember/recommended";

import eslintConfigPrettier from "eslint-config-prettier";
import qunit from "eslint-plugin-qunit";
import n from "eslint-plugin-n";

import babelParser from "@babel/eslint-parser";

// [!code ++]
import swiftwc from "@swiftwc/eslint-plugin/emberjs/en";

export default [
  // 👇🏻 add this block at the bottom of the array
  // [!code ++]
  {
    // [!code ++]
    files: ["**/*.{gjs,gts}"],
    // [!code ++]
    languageOptions: {
      // [!code ++]
      parser: ember.parser,
      // [!code ++]
    },
    // [!code ++]
    plugins: {
      // [!code ++]
      swiftwc,
      // [!code ++]
    },
    // [!code ++]
    extends: [...swiftwc.configs.recommended],
    // [!code ++]
  },
];
```

::::

<!-- rules: { ...swiftwc.configs.recommended[0].rules } -->
