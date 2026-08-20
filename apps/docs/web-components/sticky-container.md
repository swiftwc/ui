<!-- #region pre -->

# StickyContainer

######

```ts
interface StickyContainerSignature {
  Declaration: '<sticky-container></sticky-container>'
}

class StickyContainer extends HTMLElement<StickyContainerSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'sticky-container': StickyContainer
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
