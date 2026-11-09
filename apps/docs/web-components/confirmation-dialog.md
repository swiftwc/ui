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

## Overview

You can present a confirmation dialog by calling the `confirmation` function of the Client module.

::::: info &nbsp;

{% example confirmation-dialog/demo-full h-60 %}

:::: details View code {open .mt-0! .rounded-t-none!}

::: code-group

```js [JavaScript]
await confirmationDialog(trigger, 'Permanently erase the items in the Trash?')
```

<<< @/public/examples/confirmation-dialog/demo-full.html{19 html:line-numbers}

:::

::::
:::::

<!-- #region post -->

<!-- #endregion post -->
