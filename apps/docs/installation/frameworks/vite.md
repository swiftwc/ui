---
prev:
  text: 'Installation'
  link: '/installation/'
next:
  text: 'Editor Setup'
  link: '/installation/editor-setup'
---

# Install SwiftWC with Vite

How to install dependencies and structure your Vite app.

## 1. Create your project

::: code-group

```bash [npm]
npm create vite@latest vite-app
cd vite-app
```

```bash [bun]
bun create vite vite-app
cd vite-app
```

:::

## 2. Install SwiftWC

**Install SwiftWC and it’s dependencies:**

::::tabs key:channel

== latest

::: code-group

```bash [npm]
npm i -D @swiftwc/ui@latest @phosphor-icons/web @fontsource-variable/inter
```

```bash [bun]
bun add --exact @swiftwc/ui@latest --dev
```

:::

== canary

::: code-group

```bash [npm]
npm i -D @swiftwc/ui@canary @phosphor-icons/web @fontsource-variable/inter
```

```bash [bun]
bun add --exact @swiftwc/ui@canary --dev
```

:::

::::

## 3. Import the stylesheet

::::tabs key:stylesheet

== If you are using CSS

**Add an `@import` to your CSS file for SwiftWC:**

::: code-group

```css [src/style.css]
/* [!code ++] */
@import '@swiftwc/ui/css';
```

:::

== If you are using SCSS

**Add a `@forward` to your SCSS file for SwiftWC:**

::: code-group

```scss [src/style.scss]
// [!code ++]
@forward '@swiftwc/ui/scss';
```

:::

::::

<!--@include: ../../parts/prioritize-css-layers.md-->

<div class="[&_[role=tablist]]:hidden">

::::tabs key:stylesheet

== If you are using CSS

**Add a `@layer` rule at the beginning of your CSS file:**

::: code-group

```css [src/style.css]
/* [!code ++] */
@layer base, sw, components, utilities, theme;

@import 'tailwindcss';
@import '@swiftwc/ui/css';
```

:::

== If you are using SCSS

**Add a `style` tag at the beginning of your HTML file:**

::: code-group

```html [index.html]
<head>
  <!-- [!code ++] -->
  <style>
    /* [!code ++] */
    @layer base, sw, components, utilities, theme;
    /* [!code ++] */
  </style>
  <!-- 👇🏻 stylesheets go after -->
  <link href="/src/tailwind.css" rel="stylesheet" />
  <link href="/src/style.scss" rel="stylesheet" />
</head>
```

:::

::::

</div>

## 4. Import the Client module

**Add an import to your JavaScript file that imports SwiftWC client module:**

::::tabs key:script variant:code

== If you are using TypeScript

::: code-group

```ts [src/main.ts]
// [!code ++]
import '@swiftwc/ui/client'
```

:::

== If you are using JavaScript

::: code-group

```js [src/main.js]
// [!code ++]
import '@swiftwc/ui/client'
```

:::

::::

## 5. Start your build process

```bash
npm run dev
```

## 6. Start using SwiftWC

<div class="[&_[role=tablist]]:hidden">

:::::tabs key:script variant:code

=== If you are using TypeScript

::::tabs key:stylesheet

== If you are using CSS

::: code-group

<<< @/snippets/installation/vite/tscss/index.html

<<< @/snippets/installation/vite/main.ts

:::

== If you are using SCSS

::: code-group

<<< @/snippets/installation/vite/tsscss/index.html

<<< @/snippets/installation/vite/main.ts

:::

::::

=== If you are using JavaScript

::::tabs key:stylesheet

== If you are using CSS

::: code-group

<<< @/snippets/installation/vite/jscss/index.html

<<< @/snippets/installation/vite/main.js

:::

== If you are using SCSS

::: code-group

<<< @/snippets/installation/vite/jsscss/index.html

<<< @/snippets/installation/vite/main.js

:::

::::

:::::

</div>

## See also

<dl class="ps-10">

[Inspect template files](https://github.com/swiftwc/ui/tree/canary/templates/vite-app)

<dd class="-mt-5">See the entire code for this template on GitHub</dd>

</dl>
