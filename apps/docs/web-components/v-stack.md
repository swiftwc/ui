---
next:
  text: 'Installation'
  link: '/installation/'
---

<!-- #region pre -->

# VStack

###### A view that arranges its children one on top of the other.

`<v-stack></v-stack>`

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

## Reference

### Attributes

<div class="*:w-full *:table-fixed *:table!">

| Name               |                                         Type                                         | Description                      |
| ------------------ | :----------------------------------------------------------------------------------: | -------------------------------- |
| **`distribution`** | `"leading" \| "leading fill" \| "center" \| "trailing" \| "fill" \| "space-between"` | The distribution of cols         |
| **`template`**     |        [`templateSet`](/installation/editor-setup/html-data.json#templateset)        | The main-axis grid template      |
| **`spacing`**      |         [`spacingSet`](/installation/editor-setup/html-data.json#spacingset)         | The gap between the primary axis |
| **`alignment`**    |          [`inlineSet`](/installation/editor-setup/html-data.json#inlineset)          | The cross-axis alignment         |
| **`distribution`** |           [`blockSet`](/installation/editor-setup/html-data.json#blockset)           | The main-axis alignment          |
| **`placement`**    |  [`blockPlacementSet`](/installation/editor-setup/html-data.json#blockplacementset)  | The main-axis alignment          |

</div>

### No Slots

### No Events

### No Properties

### No Methods

<!-- #endregion post -->
