---
next:
  text: "App HTML Layout"
  link: "/installation/app-layout"
---

> [!IMPORTANT]
> **SwiftWC** is intended for _standalone web apps_ and _web extensions_. It is NOT meant (and not tested) for websites.

# Installation

How to install dependencies and structure your app.

## Quick Start

**Run the following command to create a new project with swiftwc/ui:**

::: code-group

```sh{4} [npm]
npm i -D @swiftwc/ui@latest
```

```html [browser-ready from CDNs]
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

:::

## Pick Your Framework

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/yyx990803.png',
    org: 'Vite',
    orgLink: '/installation/vite',
  },
  {
    avatar: 'https://www.github.com/yyx990803.png',
    org: 'Ember.js',
    orgLink: '/installation/emberjs',
  },
  {
    avatar: 'https://www.github.com/yyx990803.png',
    org: 'Manual',
    orgLink: '/installation/manual',
  }
]
</script>

<VPTeamMembers size="small" :members />
