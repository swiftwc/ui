---
prev:
  text: 'Web Components'
  link: '/web-components/'
---

<!-- #region pre -->

# AlertDialog

###### A dialog that shows a message. Use it from the client module like `void alert('Save failed.')`.

```ts
interface AlertDialogSignature {}

class AlertDialog extends HTMLDialogElement<AlertDialogSignature> {}

declare global {
  interface HTMLDialogElement {
    is: 'alert-dialog' // <dialog is="alert-dialog"></dialog>
  }
}
```

<!-- #endregion pre -->

## Overview

You can present an alert dialog by calling the `alert` function of the Client module.

::::: info &nbsp;

{% example alert-dialog/demo-full h-60 %}

:::: details View code {open .mt-0! .rounded-t-none!}

::: code-group

```js [JavaScript]
void alert('Save failed.')
```

<<< @/public/examples/alert-dialog/demo-full.html{19 html:line-numbers}

:::

::::
:::::

<!-- #region post -->

<!-- #endregion post -->
