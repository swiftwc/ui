<!-- #region pre -->

# ContentView

###### A container view that wraps a scroll view, marking it as a screen your app can navigate to.

```ts
interface ContentViewSignature {}

class ContentView extends HTMLElement<ContentViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'content-view': ContentView // <content-view></content-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
