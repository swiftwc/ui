<!-- #region pre -->

# HFlexStack

###### A view that arranges its children side by side.

```ts
interface HFlexStackSignature {
  Attributes: {
    spacing?: Spacing // The gap between the primary axis
  }
}

class HFlexStack extends HTMLElement<HFlexStackSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'h-flex-stack': HFlexStack // <h-flex-stack></h-flex-stack>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
