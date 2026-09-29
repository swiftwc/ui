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
  Attributes: {
    readable?: FrameInlineLength // Shortcut for `placement="leading fill" frame:alignment="center" frame:width="infinity" frame:max-width="{length}"`
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
    'v-stack': VStack // <v-stack></v-stack>
  }
}
```

<!-- #endregion pre -->

## Overview

...

::::: info &nbsp;

{% demo v-stack/demo-full h-130 %}

:::: details View code {.mt-0! .rounded-t-none!}

::: code-group

```html [HTML]
<labeled-content label="Age" value="6" format="unit::unit=year&unitDisplay=long"></labeled-content>
```

<<< @/public/examples/v-stack/demo-full.html#html{18}

:::

::::
:::::

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
