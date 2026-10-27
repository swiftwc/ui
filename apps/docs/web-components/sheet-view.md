<!-- #region pre -->

# SheetView

###### A dialog that slides up over the current screen.

```ts
interface SheetViewSignature {
  Slots: {
    default: HTMLElement[] // The default slot
  }
}

class SheetView extends HTMLDialogElement<SheetViewSignature> {}

declare global {
  interface HTMLDialogElement {
    is: 'sheet-view' // <dialog is="sheet-view"></dialog>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLDialogElement`

<!-- #endregion post -->
