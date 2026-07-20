---
prev:
  text: "Installation"
  link: "/installation/"
---

# Install SwiftWC with Vite

How to install dependencies and structure your Vite app.

## 1. Create your project

::: code-group

```bash [npm]
npm create vite@latest my-project
cd my-project
```

```bash [bun]
bun add --exact @swiftwc/ui@latest --dev
cd my-project
```

:::

## 2. Install SwiftWC

::::tabs key:install

== latest {% icon smiley %}

::: code-group

```bash [npm]
npm i -D @swiftwc/ui@latest @phosphor-icons/web inter-ui
```

```bash [bun]
bun add --exact @swiftwc/ui@latest --dev
```

== dev

::: code-group

```bash [npm]
npm i -D @swiftwc/ui@dev @phosphor-icons/web inter-ui
```

```bash [bun]
bun add --exact @swiftwc/ui@dev --dev
```

::::

## 3. Import the stylesheet

**Add an `@import` to your CSS file that imports SwiftWC CSS:**

::::tabs key:lang

== If you are using CSS

::: code-group

```css [app.css]
@import "@swiftwc/ui/css";
```

:::

== If you are using SCSS

::: code-group

```scss [app.scss]
@use "@swiftwc/ui/scss/vars" with (
  $components-layer: web-components
);

@forward "@swiftwc/ui/scss";
```

:::

::::

## 4. Import the Client module

**Add an import to your JavaScript file that imports SwiftWC client module:**

```js [app.js]
import "@swiftwc/ui/client";
```

## 5. Start your build process

```bash
npm run dev
```

## 6. Start using SwiftWC

::::tabs key:lang

== If you are using TypeScript

::: code-group

<<< @/snippets/installation/vite/index.html

<<< @/snippets/installation/vite/app.css

<<< @/snippets/installation/vite/app.ts

:::

== If you are using JavaScript

::: code-group

<<< @/snippets/installation/vite/index.html

<<< @/snippets/installation/vite/app.css

<<< @/snippets/installation/vite/app.js

:::

== If you are using SCSS

::: code-group

<<< @/snippets/installation/vite/index.html

<<< @/snippets/installation/vite/app.scss

<<< @/snippets/installation/vite/app.js

:::

::::
