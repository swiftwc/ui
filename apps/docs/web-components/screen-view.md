<!-- #region pre -->

# ScreenView

######

```ts
interface ScreenViewSignature {}

class ScreenView extends HTMLDialogElement<ScreenViewSignature> {}

declare global {
  interface HTMLDialogElement {
    is: 'screen-view' // <dialog is="screen-view"></dialog>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLDialogElement`

<!-- #endregion post -->
