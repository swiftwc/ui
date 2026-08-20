<!-- #region pre -->

# SearchView

######

```ts
interface SearchViewSignature {
  Declaration: '<search-view></search-view>'
}

class SearchView extends HTMLInputElement<SearchViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'search-view': SearchView
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLInputElement`

<!-- #endregion post -->
