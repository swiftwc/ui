<!-- #region pre -->

# ConfirmationDialog

###### A dialog that asks the user to confirm an action. Use it from the client module like `await confirmationDialog(trigger, 'Permanently erase the items in the Trash?')`.

```ts
interface ConfirmationDialogSignature {
  Attributes: {
    anchor?: string
  }
}

class ConfirmationDialog extends HTMLDialogElement<ConfirmationDialogSignature> {}

declare global {
  interface HTMLDialogElement {
    is: 'confirmation-dialog' // <dialog is="confirmation-dialog"></dialog>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLDialogElement`

<!-- #endregion post -->
