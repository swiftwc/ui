---
next:
  text: 'Installation'
  link: '/installation/'
---

<!-- #region pre -->

# VStack

###### A view that arranges its children one on top of the other.

```ts
interface VStackSignature {
  Declaration: '<v-stack></v-stack>'

  Attributes: {
    distribution?: 'leading' | 'leading fill' | 'center' | 'trailing' | 'fill' | 'space-between' // The distribution of cols
    template?: Template // The main-axis grid template
    spacing?: Spacing // The gap between the primary axis
    alignment?: inlineSet // The cross-axis alignment
    distribution?: blockSet // The main-axis alignment
    placement?: blockPlacementSet // The main-axis alignment
  }
}

class VStack extends HTMLElement<VStackSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'v-stack': VStack
  }
}
```

<!-- #endregion pre -->

## Overview

A view that arranges its subviews in a vertical line.

## Default styling reference

**Here's a complete list of the default colors and their values for reference:**

```css{2}
@layer components {
  :where(v-stack) {
    grid-template-columns: minmax(0, 1fr);

    place-items: safe center;
    place-content: safe center;

    gap: 1rem;
  }
}
```

## Topics

### Building layouts with stack views

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
