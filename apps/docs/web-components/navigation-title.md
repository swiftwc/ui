<!-- #region pre -->

# NavigationTitle

###### A container view.

```ts
interface NavigationTitleSignature {
  Declaration: '<navigation-title></navigation-title>'

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
    'navigation-title': NavigationTitle
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
