<!-- #region pre -->

# NavigationStack

###### A container view that shows a main screen and lets the user open other screens on top of it.

```ts
interface NavigationStackSignature {
  Declaration: '<navigation-stack></navigation-stack>'
}

class NavigationStack extends HTMLElement<NavigationStackSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'navigation-stack': NavigationStack
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
