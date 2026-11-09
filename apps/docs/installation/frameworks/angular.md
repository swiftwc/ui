---
prev:
  text: 'Installation'
  link: '/installation/'
next:
  text: 'Editor Setup'
  link: '/installation/editor-setup'
---

# Install SwiftWC with Angular

How to install dependencies and structure your Angular app.

## 1. Create your project

```bash
npx ng new about-me
cd about-me
```

## 2. Install SwiftWC

:::tabs key:channel

== latest

::: code-group

```bash [npm]
npm i @swiftwc/ui@latest @phosphor-icons/web @fontsource-variable/inter
```

```bash [bun]
bun add --exact @swiftwc/ui@latest
```

== canary

::: code-group

```bash [npm]
npm i @swiftwc/ui@canary @phosphor-icons/web @fontsource-variable/inter
```

```bash [bun]
bun add --exact @swiftwc/ui@canary
```

:::

## 3. Import the stylesheet

::::tabs key:stylesheet

== If you are using CSS

**Add an `@import` to your CSS file for SwiftWC:**

::: code-group

```css [src/styles.css]
/* [!code ++] */
@import '@swiftwc/ui/css';
```

:::

== If you are using SCSS

**Add a `@forward` to your SCSS file for SwiftWC:**

::: code-group

```scss [src/styles.scss]
@forward '@swiftwc/ui/scss'; // [!code ++]
```

:::

::::

<!--@include: ../../parts/prioritize-css-layers.md-->

<div class="[&_[role=tablist]]:hidden">

::::tabs key:stylesheet

== If you are using CSS

**Add a `@layer` rule at the beginning of your CSS file:**

::: code-group

```css [src/styles.css]
// [!code ++]
@layer base, sw, components, utilities, theme;

@import 'tailwindcss';
@import '@swiftwc/ui/css';
```

:::

== If you are using SCSS

**Add a `style` tag at the beginning of your HTML file:**

::: code-group

```html [src/index.html]
<head>
  <!-- [!code ++] -->
  <style>
    /* [!code ++] */
    @layer base, sw, components, utilities, theme;
    /* [!code ++] */
  </style>
  <!-- 👇🏻 stylesheets go after -->
</head>
```

:::

::::

</div>

## 4. Import the Client module

**Add an import to your JavaScript file that imports SwiftWC client module:**

::: code-group

```ts [src/main.ts]
// [!code ++]
import '@swiftwc/ui/client'
```

:::

## 5. Start your build process

```bash
npm start
```

## 6. Start using SwiftWC

::: code-group

```html [src/app/app.html]
<!-- [!code ++] -->
<v-keyboard system-font="Inter"></v-keyboard>

<!-- [!code ++] -->
<navigation-stack>
  <!-- [!code ++] -->
  <scroll-view>
    <!-- [!code ++] -->
    <v-stack>
      <!-- [!code ++] -->
      <button is="borderless-button" type="button" (click)="handleClick($event)">
        <!-- [!code ++] -->
        <label-view title="Say hello" system-image="hand-waving"></label-view>
        <!-- [!code ++] -->
      </button>
      <!-- [!code ++] -->
    </v-stack>
    <!-- [!code ++] -->
  </scroll-view>

  <router-outlet />
  <!-- [!code ++] -->
</navigation-stack>
```

```ts [src/app/app.ts]
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core'
// [!code ++]
import { alert } from '@swiftwc/ui/client'

@Component({
  selector: 'body',
  styleUrl: './app.css',
  templateUrl: './app.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  async handleClick(event: Event) {
    if (!(event.target instanceof HTMLElement)) return

    await self.customElements.whenDefined('borderless-button')

    // [!code ++]
    void alert('hello', 'world')
  }
}
```

:::

## See also

<dl class="ps-10">

[Inspect template files](https://github.com/swiftwc/ui/tree/canary/templates/angular-app)

<dd class="-mt-5">See the entire code for this template on GitHub</dd>

</dl>
