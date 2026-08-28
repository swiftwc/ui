<!-- #region pre -->

# NavigationTitle

###### A container view.

```ts
interface NavigationTitleSignature {
  Attributes: {
    padding?: boolean
    value?: string
    subtitle?: string
    'system-image'?: string
    'system-image-weight'?: string
  }
}

class NavigationTitle extends HTMLElement<NavigationTitleSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'navigation-title': NavigationTitle // <navigation-title></navigation-title>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
