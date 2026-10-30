<!-- #region pre -->

# ScrollViewProxy

###### A wrapper for {hv}-stacks.

```ts
interface ScrollViewProxySignature {
  Slots: {
    default: HTMLElement[] // The default slot
  }
}

class ScrollViewProxy extends HTMLElement<ScrollViewProxySignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'scroll-view-proxy': ScrollViewProxy // <scroll-view-proxy></scroll-view-proxy>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

<!-- #endregion post -->
