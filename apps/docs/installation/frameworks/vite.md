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

**Install SwiftWC and it's dependencies:**

:::::tabs key:channel

== latest

::::tabs key:script

=== If you are using TypeScript

::: code-group

```bash [npm]
npm i -D @swiftwc/ui@latest @phosphor-icons/web inter-ui typescript
```

```bash [bun]
bun add --exact @swiftwc/ui@latest --dev
```

:::

=== If you are using JavaScript

::: code-group

```bash [npm]
npm i -D @swiftwc/ui@latest @phosphor-icons/web inter-ui
```

```bash [bun]
bun add --exact @swiftwc/ui@latest --dev
```

:::

::::

== dev

::::tabs key:script

=== If you are using TypeScript

::: code-group

```bash [npm]
npm i -D @swiftwc/ui@dev @phosphor-icons/web inter-ui typescript
```

```bash [bun]
bun add --exact @swiftwc/ui@dev --dev
```

:::

=== If you are using JavaScript

::: code-group

```bash [npm]
npm i -D @swiftwc/ui@dev @phosphor-icons/web inter-ui
```

```bash [bun]
bun add --exact @swiftwc/ui@dev --dev
```

:::

::::

:::::

## 3. Import the stylesheet

::::tabs key:stylesheet

== If you are using CSS

**Add an `@import` to your CSS file for SwiftWC:**

::: code-group

```css [app.css]
@import "@swiftwc/ui/css";
```

:::

== If you are using SCSS

**Add a `@forward` to your SCSS file for SwiftWC:**

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

::::tabs key:script

== If you are using TypeScript

::: code-group

```ts [app.ts]
import "@swiftwc/ui/client";
```

:::

== If you are using JavaScript

::: code-group

```js [app.js]
import "@swiftwc/ui/client";
```

:::

::::

## 5. Start your build process

```bash
npm run dev
```

## 6. Start using SwiftWC

:::::tabs key:script

=== If you are using TypeScript

::::tabs key:stylesheet

== If you are using CSS

::: code-group

<<< @/snippets/installation/vite/tscss/index.html

<<< @/snippets/installation/vite/app.css

<<< @/snippets/installation/vite/app.ts

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

```ts [types/phosphor-icons.d.ts]
declare module "@phosphor-icons/web/*";
```

:::

== If you are using SCSS

::: code-group

<<< @/snippets/installation/vite/tsscss/index.html

<<< @/snippets/installation/vite/app.scss

<<< @/snippets/installation/vite/app.ts

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

```ts [types/phosphor-icons.d.ts]
declare module "@phosphor-icons/web/*";
```

:::

::::

=== If you are using JavaScript

::::tabs key:stylesheet

== If you are using CSS

::: code-group

<<< @/snippets/installation/vite/jscss/index.html

<<< @/snippets/installation/vite/app.css

<<< @/snippets/installation/vite/app.js

:::

== If you are using SCSS

::: code-group

<<< @/snippets/installation/vite/jsscss/index.html

<<< @/snippets/installation/vite/app.scss

<<< @/snippets/installation/vite/app.js

:::

::::

:::::
