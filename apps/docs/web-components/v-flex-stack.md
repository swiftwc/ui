<!-- #region pre -->

# VFlexStack

###### A view that arranges its children one on top of the other.

```ts
interface VFlexStackSignature {
  Attributes: {
    template?: Template // The main-axis grid template
  }
}

class VFlexStack extends HTMLElement<VFlexStackSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'v-flex-stack': VFlexStack // <v-flex-stack></v-flex-stack>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
