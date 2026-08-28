<!-- #region pre -->

# SidebarView

###### A container view that arranges navigation destinations in a single column.

```ts
interface SidebarViewSignature {}

class SidebarView extends HTMLDialogElement<SidebarViewSignature> {}

declare global {
  interface HTMLDialogElement {
    is: 'sidebar-view' // <dialog is="sidebar-view"></dialog>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLDialogElement`

<!-- #endregion post -->
