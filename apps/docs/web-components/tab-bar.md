<!-- #region pre -->

# TabBar

###### A container view that groups tab-items together along the top or bottom of the screen.

```ts
interface TabBarSignature {}

class TabBar extends HTMLDialogElement<TabBarSignature> {}

declare global {
  interface HTMLDialogElement {
    is: 'tab-bar' // <dialog is="tab-bar"></dialog>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLDialogElement`

<!-- #endregion post -->
