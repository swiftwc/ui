<!-- #region pre -->

# HStack

###### A view that arranges its children side by side.

```ts
interface HStackSignature {
  Declaration: '<h-stack></h-stack>'

  Attributes: {
    template: Template // The main-axis grid template
    spacing: Spacing // The gap between the primary axis
    alignment: blockSet // The cross-axis alignment
    distribution: inlineSet // The main-axis alignment
    placement: inlinePlacementSet // The main-axis alignment
  }
}

class HStack extends HTMLElement<HStackSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'h-stack': HStack
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
