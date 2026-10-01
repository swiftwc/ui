<!-- #region pre -->

# HStack

###### A view that arranges its children side by side.

```ts
interface HStackSignature {
  Attributes: {
    template?: Template // The main-axis grid template
    spacing?: Spacing // The gap between the primary axis
    alignment?: blockSet // The cross-axis alignment
    distribution?: inlineSet // The main-axis alignment
    placement?: inlinePlacementSet // The main-axis alignment
  }
}

class HStack extends HTMLElement<HStackSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'h-stack': HStack // <h-stack></h-stack>
  }
}
```

<!-- #endregion pre -->

## Try It

::::: tabs key:h-stack

== Demo

{% demo h-stack/index.html h-130 %}

== Test fixed inline size

{% demo h-stack/index.html?case=w h-130 %}

== Test fixed block size

{% demo h-stack/index.html?case=h h-130 %}

:::::

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
