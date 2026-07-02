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
