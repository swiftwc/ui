<!-- #region pre -->

# BodyView

###### A container view that wraps a scroll view, marking it as a screen your app can navigate to.

```ts
interface BodyViewSignature {
  Declaration: '<body-view></body-view>'
}

class BodyView extends HTMLElement<BodyViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'body-view': BodyView
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
