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

## Create your project

```bash
npx ng new about-me
cd about-me
```

## Install SwiftWC

:::tabs key:channel

== latest

::: code-group

```bash [angular CLI]
ng add @swiftwc/ui@latest @phosphor-icons/web @fontsource/inter
```

```bash [npm]
npm i @swiftwc/ui@latest @phosphor-icons/web @fontsource/inter
```

```bash [bun]
bun add --exact @swiftwc/ui@latest --dev
```

:::

## 3. Import the stylesheet

::::tabs key:stylesheet

== If you are using CSS

**Add an `@import` to your CSS file for SwiftWC:**

::: code-group

```css [app.css]
@import '@swiftwc/ui/css';
```

:::

== If you are using SCSS

**Add a `@forward` to your SCSS file for SwiftWC:**

::: code-group

```scss [app.scss]
@use '@swiftwc/ui/scss/vars' with (
  $components-layer: web-components
);

@forward '@swiftwc/ui/scss';
```

:::

::::

### Prioritize CSS layers

Add all sw-\* layers after other base rules. For example, [Tailwind CSS](https://tailwindcss.com/docs/adding-custom-styles#using-custom-css) applies global margin, padding, and border resets accross the page using a `base` `@layer`.

To properly install SwiftWC, add a `@layer` rule at the begining of your stylesheet and move all other base layers at the begining, then follow with all the SwiftWC layers, and finally add any other layers you need, for example Tailwind requires 3 more layers.

**Your styles file should look like this:**

```ts [app.css]
/* Ember supports plain CSS out of the box. More info: https://cli.emberjs.com/release/advanced-use/stylesheets/ */
@import 'tailwindcss';

// [!code ++]
@layer base, sw-base, sw-components, sw-list-components, sw-nav-components, sw-tab-components, sw-utils, sw-colors, sw-ui, sw-transitions, sw-final, components, utilities, theme;
```

## 4. Import the Client module

**Add an import to your JavaScript file that imports SwiftWC client module:**

::::tabs key:script

== If you are using TypeScript

::: code-group

```ts [app.ts]
import '@swiftwc/ui/client'
```

:::

== If you are using JavaScript

::: code-group

```js [app.js]
import '@swiftwc/ui/client'
```

:::

::::

## 5. Start your build process

```bash
npm start
```

## Start using SwiftWC web components in your project

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
  selector: 'body-view',
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
