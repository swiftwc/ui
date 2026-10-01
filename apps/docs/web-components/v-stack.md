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

## Try It

::::: tabs key:v-stack

== Demo

{% demo v-stack/index.html h-130 %}

== Test fixed block size

{% demo v-stack/index.html?case=h h-130 %}

== Test fixed inline size

{% demo v-stack/index.html?case=w h-130 %}

:::::

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
