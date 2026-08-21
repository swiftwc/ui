<!-- #region pre -->

# ListView

###### A container view that arranges rows of data in a single column, optionally letting the user select one or more of them.

```ts
interface ListViewSignature {
  Declaration: '<list-view></list-view>'

  Attributes: {
    'navigation-link-indicator-visibility'?: 'hidden' // Hides accessories like right-arrow-chevron on NavigationLink buttons inside.
  }
}

class ListView extends HTMLElement<ListViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'list-view': ListView
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
