# Install SwiftWC with Ember.js

How to install dependencies and structure your Ember.js app.

## Create your project

```bash
npx ember-cli new my-project --embroider --no-welcome
cd my-project
```

## Install SwiftWC

:::tabs key:install

== latest

::: code-group

```bash [ember CLI]
ember install @swiftwc/ui@latest
```

```bash [npm]
npm i -D @swiftwc/ui@latest
```

```bash [bun]
bun add --exact @swiftwc/ui@latest --dev
```

:::

## Import the CSS file

```ts{5-6} [app.ts]
import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'my-project/config/environment';
import '@swiftwc/ui/styles.css'; // [!code ++]
import '@swiftwc/ui/client'; // [!code ++]
export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}
loadInitializers(App, config.modulePrefix);
```

## Start your build process

```bash
npm start
```

## Start using SwiftWC web components in your project

::: code-group

```glimmer-ts [application.gts]
import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "MyProject"}}

  <v-keyboard></v-keyboard> <!-- [!code focus] -->

  {{outlet}}
</template>
```

```ts [app/router.ts]
import EmberRouter from "@embroider/router";
import config from "my-project/config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route("about"); // [!code focus]
});
```

```gts{2,5-7} [index.gts]
import { pageTitle } from 'ember-page-title';
import { startViewTransition } '@swiftwc/ui/client';

const handleClick = async (event) => {
  await startViewTransition(event.target, 'forwards', async () => {
    this.router.transitionTo('about');
  });
}

<template>
  <navigation-stack>
    <scroll-view>
      <v-stack>
        <button is="borderless-button" type="button" {{on "click" handleClick}}>About</button>
      </v-stack>
    </scroll-view>
    {{outlet}}
  </navigation-stack>
</template>
```

```glimmer-ts [about.gts]
import { pageTitle } from 'ember-page-title';
import { startViewTransition } '@swiftwc/ui/client'; // [!code focus]

const handleClick = async (event) => {
  await startViewTransition(event.target, 'backwards', async () => {
    this.router.transitionTo('index');
  });
}

<template>
  <body-view>
    <scroll-view>
      <v-stack>
        <button is="borderless-button" type="button" {{on "click" handleClick}}>Back</button>
      </v-stack>
    </scroll-view>
    {{outlet}}
  </body-view>
</template>
```

:::
