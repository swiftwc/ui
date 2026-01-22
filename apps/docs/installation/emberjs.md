# Install SwiftWC with Ember.js

Setting up Tailwind CSS in an Ember.js project.

## Create your project

```bash
npx ember-cli new my-project --embroider --no-welcome
cd my-project
```

## Install SwiftWC

::: code-group

```bash [ember]
ember install @swiftwc/ui@latest
```

```bash [npm]
npm i -D @swiftwc/ui@latest
```

:::

## Import the CSS file

```ts app.ts
import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'my-project/config/environment';
import '@swiftwc/ui/client';
export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}
loadInitializers(App, config.modulePrefix);
```

## Start your build process

```bash
npm run start
```

## Start using SwiftWC web components in your project

::: code-group

```gts [application.gts]

import { pageTitle } from 'ember-page-title';
import { startViewTransition } '@swiftwc/ui/client';

const handleClick = async (event) => {
  await startViewTransition(event, 'forwards', async () => {
    this.router.transitionTo('about');
  });
}

<template>
  {{pageTitle "MyProject"}}

  <v-keyboard></v-keyboard>
  <navigation-stack>
    <scroll-view>
      <v-stack>
        <button is="borderless-button" type="button" {{on "click" handleClick}}>Hello world</button>
      </v-stack>
    </scroll-view>
    {{outlet}}
  </navigation-stack>
</template>
```

:::

```hbs
{{!-- index.gts --}}

<body-view>
  <scroll-view>
    <v-stack>
      <button is="borderless-button" type="button">Hello world</button>
    </v-stack>
  </scroll-view>
  {{outlet}}
</body-view>
```

