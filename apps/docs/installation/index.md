---
next:
  text: "Editor Setup"
  link: "/installation/editor-setup"
---

# Installation

Instructions on how to add the SwiftWC Web Components to your app.

> [!IMPORTANT] BEFORE YOU START 👇🏻
> **SwiftWC** is primarily intended for building _standalone web apps_ and _web extensions_. It is NOT meant (and not tested) for websites.

## Quick Start

**Just add a few lines into your HTML and you are ready-to-go:**

::::tabs key:channel

== latest

::: code-group

```html [UNPKG]
<!doctype html>
<html>
  <head>
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/css" />
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
  </head>
</html>
```

```html [jsDelivr]
<!doctype html>
<html>
  <head>
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@swiftwc/ui@0.0.0-dev.8/generated/css/index.css" />
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <script type="module" src="https://cdn.jsdelivr.net/npm/@swiftwc/ui@latest/generated/client/index.js"></script>
  </head>
</html>
```

```html [Skypack]
<!doctype html>
<html>
  <head>
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://cdn.skypack.dev/@swiftwc/ui/css" />
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <script type="module" src="https://cdn.skypack.dev/@swiftwc/ui/client"></script>
  </head>
</html>
```

```html [esm.sh]
<!doctype html>
<html>
  <head>
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://esm.sh/@swiftwc/ui/css" />
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <script type="module" src="https://esm.sh/@swiftwc/ui/client"></script>
  </head>
</html>
```

<!--
```html [cloudflare]
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/@swiftwc/ui/css" />

    <script type="module" src="https://cdnjs.cloudflare.com/@swiftwc/ui/client"></script>
```
-->

== dev

::: code-group

```html [UNPKG]
<!doctype html>
<html>
  <head>
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui@dev/css" />
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <script type="module" src="https://unpkg.com/@swiftwc/ui@dev/client"></script>
  </head>
</html>
```

:::

::::

## Choose Your Framework

If you are using a build tool or just want extra customization, pick a framework below to get started:

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: '/vite.svg',
    org: 'Vite',
    orgLink: '/installation/frameworks/vite',
  },
  // {
  //   avatar: '/ember.svg',
  //   org: 'Ember.js',
  //   orgLink: '/installation/frameworks/emberjs',
  // },
  // {
  //   avatar: '/manual.svg',
  //   org: 'Manual',
  //   orgLink: '/installation/frameworks/manual',
  // }
]
</script>

<VPTeamMembers size="small" :members />
