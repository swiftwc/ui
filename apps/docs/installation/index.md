---
next:
  text: "App HTML Layout"
  link: "/installation/app-layout"
---

# Installation

Instructions on how to add the SwiftWC Web Components to your app.

> [!IMPORTANT] BEFORE YOU START 👇🏻
> **SwiftWC** is primarily intended for building _standalone web apps_ and _web extensions_. It is NOT meant (and not tested) for websites.

## Quick Start

**Just add two lines into your HTML and you are ready-to-go:**

::: code-group

```html [unpkg]
<!doctype html>
<html>
  <head>
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/css" />
  </head>
  <body>
    <!-- [!code ++] -->
    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
  </body>
</html>
```

```html [jsDelivr]
<!doctype html>
<html>
  <head>
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@swiftwc/ui/css" />
  </head>
  <body>
    <!-- [!code ++] -->
    <script type="module" src="https://cdn.jsdelivr.net/npm/@swiftwc/ui/client"></script>
  </body>
</html>
```

```html [Skypack]
<!doctype html>
<html>
  <head>
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://cdn.skypack.dev/@swiftwc/ui/css" />
  </head>
  <body>
    <!-- [!code ++] -->
    <script type="module" src="https://cdn.skypack.dev/@swiftwc/ui/client"></script>
  </body>
</html>
```

```html [esm.sh]
<!doctype html>
<html>
  <head>
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://esm.sh/@swiftwc/ui/css" />
  </head>
  <body>
    <!-- [!code ++] -->
    <script type="module" src="https://esm.sh/@swiftwc/ui/client"></script>
  </body>
</html>
```

```html [cdnjs]
<!doctype html>
<html>
  <head>
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/@swiftwc/ui/css" />
  </head>
  <body>
    <!-- [!code ++] -->
    <script type="module" src="https://cdnjs.cloudflare.com/@swiftwc/ui/client"></script>
  </body>
</html>
```

:::

## Choose Your Framework

If you are using a package manager or just want extra customization, pick a framework below to get started:

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/yyx990803.png',
    org: 'Vite',
    orgLink: '/installation/frameworks/vite',
  },
  {
    avatar: 'https://www.github.com/yyx990803.png',
    org: 'Ember.js',
    orgLink: '/installation/frameworks/emberjs',
  },
  {
    avatar: 'https://www.github.com/yyx990803.png',
    org: 'Manual',
    orgLink: '/installation/frameworks/manual',
  }
]
</script>

<VPTeamMembers size="small" :members />
