<!-- #region pre -->

# ListView

###### A container view that arranges rows of data in a single column, optionally letting the user select one or more of them.

```ts
interface ListViewSignature {
  Attributes: {
    'list-style'?: ListStyle
    'navigation-link-indicator-visibility'?: hidden // Hides accessories like right-arrow-chevron on NavigationLink buttons inside
    'preferred-root-disclosure-style'?: sidebar
  }

  Slots: {
    default: HTMLElement[] // The default slot
  }

  CSSProperties: {
    '--list-row-gap'?: length // The gap between rows
    '--list--media-inner-padding-inline-start'?: length // The inline paddint start for each row
  }
}

class ListView extends HTMLElement<ListViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'list-view': ListView // <list-view></list-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

<!-- #endregion post -->
