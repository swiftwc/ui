---
prev:
  text: 'Installation'
  link: '/installation/'
next:
  text: 'Editor Setup'
  link: '/installation/editor-setup'
---

# Install SwiftWC with Ember.js

How to install dependencies and structure your Ember.js app.

## 1. Create your project

```bash
npx ember-cli new ember-app --typescript --no-welcome
cd ember-app
```

## 2. Install SwiftWC

:::tabs key:channel

== latest

::: code-group

```bash [ember CLI]
ember install @swiftwc/ui@latest @phosphor-icons/web @fontsource-variable/inter
```

```bash [npm]
npm i -D @swiftwc/ui@latest @phosphor-icons/web @fontsource-variable/inter
```

```bash [bun]
bun add --exact @swiftwc/ui@latest @phosphor-icons/web @fontsource-variable/inter --dev
```

== canary

::: code-group

```bash [ember CLI]
ember install @swiftwc/ui@canary @phosphor-icons/web @fontsource-variable/inter
```

```bash [npm]
npm i -D @swiftwc/ui@canary @phosphor-icons/web @fontsource-variable/inter
```

```bash [bun]
bun add --exact @swiftwc/ui@canary @phosphor-icons/web @fontsource-variable/inter --dev
```

:::

## 3. Import the stylesheet

::::tabs key:stylesheet

== If you are using CSS

**Add an `@import` to your CSS file for SwiftWC:**

::: code-group

```css{5-6} [styles/app.css]
/* [!code ++] */
@import "@swiftwc/ui/css";
```

:::

== If you are using SCSS

**Add a `@forward` to your SCSS file for SwiftWC:**

::: code-group

```scss [styles/app.scss]
// [!code ++]
@forward '@swiftwc/ui/scss';
```

:::

::::

<!--@include: ../../parts/prioritize-css-layers.md-->

```ts [app.css]
/* Ember supports plain CSS out of the box. More info: https://cli.emberjs.com/release/advanced-use/stylesheets/ */
// [!code ++]
@layer base, sw, components, utilities, theme;

@import 'tailwindcss';
@import "@swiftwc/ui/css";
```

## 4. Import the Client module

::::tabs key:script variant:code

== If you are using TypeScript

::: code-group

<<< @/snippets/installation/emberjs/app.ts

:::

== If you are using JavaScript

::: code-group

<<< @/snippets/installation/emberjs/app.js

:::

::::

## 5. Start your build process

```bash
npm start
```

## 6. Start using SwiftWC

<div class="[&_[role=tablist]]:hidden">

::::tabs key:script variant:code

== If you are using TypeScript

::: code-group

```glimmer-ts [application.gts]
import type { TOC } from '@ember/component/template-only';
// [!code ++]
import { alert } from '@swiftwc/ui/client';
import { pageTitle } from 'ember-page-title';

interface S {
  Args: Record<string, never>;
}

const handleClick = async (evt: Event) => {
  if (!(evt.target instanceof HTMLElement)) return;

  if (!evt.target.closest('button')) return;

  await self.customElements.whenDefined('borderless-button');

  // [!code ++]
  void alert('hello', 'world');
};

<template>
  {{pageTitle "EmberApp"}}

  <body>
    <!-- [!code ++] -->
    <v-keyboard system-font="Inter"></v-keyboard>

    <!-- [!code ++] -->
    <navigation-stack>
      <!-- [!code ++] -->
      <scroll-view>
        <!-- [!code ++] -->
        <v-stack>
          <!-- [!code ++] -->
          <button is="borderless-button" type="button" tabindex="0">
            <!-- [!code ++] -->
            <label-view title="Say hello" system-image="hand-waving" {{on "click" handleClick}}></label-view>
            <!-- [!code ++] -->
          </button>
          <!-- [!code ++] -->
        </v-stack>
        <!-- [!code ++] -->
      </scroll-view>
      <!-- [!code ++] -->
    </navigation-stack>
  </body>
</template> satisfies TOC<S>;
```

:::

== If you are using JavaScript

::: code-group

```glimmer-js [application.gjs]
// [!code ++]
import { alert } from '@swiftwc/ui/client';
import { pageTitle } from 'ember-page-title';

const handleClick = async (evt) => {
  if (!(evt.target instanceof HTMLElement)) return;

  if (!evt.target.closest('button')) return;

  await self.customElements.whenDefined('borderless-button');

  // [!code ++]
  void alert('hello', 'world');
};

<template>
  {{pageTitle "EmberApp"}}

  <body>
    <!-- [!code ++] -->
    <v-keyboard system-font="Inter"></v-keyboard>

    <!-- [!code ++] -->
    <navigation-stack>
      <!-- [!code ++] -->
      <scroll-view>
        <!-- [!code ++] -->
        <v-stack>
          <!-- [!code ++] -->
          <button is="borderless-button" type="button" tabindex="0">
            <!-- [!code ++] -->
            <label-view title="Say hello" system-image="hand-waving" {{on "click" handleClick}}></label-view>
            <!-- [!code ++] -->
          </button>
          <!-- [!code ++] -->
        </v-stack>
        <!-- [!code ++] -->
      </scroll-view>
      <!-- [!code ++] -->
    </navigation-stack>
  </body>
</template>;
```

:::

::::

</div>

## See also

<dl class="ps-10">

[Inspect template files](https://github.com/swiftwc/ui/tree/canary/templates/ember-app)

<dd class="-mt-5">See the entire code for this template on GitHub</dd>

</dl>
