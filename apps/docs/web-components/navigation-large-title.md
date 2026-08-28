<!-- #region pre -->

# NavigationLargeTitle

######

```ts
interface NavigationLargeTitleSignature {
  Attributes: {
    'background-style'?: 'grouped'
    padding?: boolean
    'navigation-bar-auto-hide'?: boolean
  }
}

class NavigationLargeTitle extends HTMLElement<NavigationLargeTitleSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'navigation-large-title': NavigationLargeTitle // <navigation-large-title></navigation-large-title>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
