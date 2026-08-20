---
prev:
  text: 'Web Components'
  link: '/web-components/'
---

<!-- #region pre -->

# AlertDialog

###### A dialog that shows a message. Use it from the client module like `void alert('Save failed.')`.

```ts
interface AlertDialogSignature {
  Declaration: '<dialog is="alert-dialog"></dialog>'
}

class AlertDialog extends HTMLDialogElement<AlertDialogSignature> {}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLDialogElement`

<!-- #endregion post -->
