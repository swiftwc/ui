---
prev:
  text: 'Installation'
  link: '/installation/'
next:
  text: 'Editor Setup'
  link: '/installation/editor-setup'
---

# Install SwiftWC in an Angular project

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

```scss [app.scss]
// [!code ++]
@use '@swiftwc/ui/scss/vars' with (
  // [!code ++]
  $components-layer: web-components
); // [!code ++]

@forward '@swiftwc/ui/scss'; // [!code ++]
```

:::

::::

<!--@include: ../../parts/prioritize-css-layers.md-->

```ts [src/styles.css]
/* Ember supports plain CSS out of the box. More info: https://cli.emberjs.com/release/advanced-use/stylesheets/ */
@import 'tailwindcss';

// [!code ++]
@layer base, sw, components, utilities, theme;
```

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

```html{2,5-7} [src/app/app.html]
<v-keyboard system-font="Inter"></v-keyboard>

<navigation-stack>
  <scroll-view>
    <v-stack>
      <button is="borderless-button" type="button">
        <label-view title="Hello world" system-image="hand-waving" (click)="handleClick($event)"></label-view>
      </button>
    </v-stack>
  </scroll-view>
  <router-outlet />
</navigation-stack>
```

```ts [src/app/app.routes.ts]
import { Routes } from '@angular/router'
import { AboutComponent } from './about.component'

export const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
  },
]
```

```ts [src/app/app.ts]
import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { startViewTransition } from '@swiftwc/ui/client'
import { Router } from '@angular/router'

@Component({
  imports: [RouterOutlet],
  selector: 'body',
  styleUrl: './app.css',
  templateUrl: './app.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  protected readonly title = signal('about-me')

  constructor(private router: Router) {}

  async handleClick(event: Event) {
    await startViewTransition(event.target as HTMLElement, 'forwards', async () => {
      await this.router.navigate(['/about'])
    })
  }
}
```

```ts [src/app/about.component.ts]
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core'
import { Router } from '@angular/router'
import { startViewTransition } from '@swiftwc/ui/client'

@Component({
  selector: 'content-view',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <scroll-view>
      <v-stack>
        <button is="borderless-button" type="button">Back</button>
      </v-stack>
    </scroll-view>
    <tool-bar>
      <tool-bar-item slot="top-bar-leading">
        <button type="button" tabindex="0" (click)="handleClick($event)">
          <label-view system-image="caret-left"></label-view>
        </button>
      </tool-bar-item>
    </tool-bar>
  `,
})
export class AboutComponent {
  constructor(private router: Router) {}

  async handleClick(event: Event) {
    await startViewTransition(event.target as HTMLElement, 'backwards', async () => {
      await this.router.navigate(['/'])
    })
  }
}
```

:::
