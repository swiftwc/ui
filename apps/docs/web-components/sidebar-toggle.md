<!-- #region pre -->

# SidebarToggle

###### A control that shows or hides the sidebar view.

```ts
interface SidebarToggleSignature {
  Slots: {
    default: HTMLElement[] // The default slot
  }
}

class SidebarToggle extends HTMLElement<SidebarToggleSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'sidebar-toggle': SidebarToggle // <sidebar-toggle></sidebar-toggle>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

<!-- #endregion post -->
