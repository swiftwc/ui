<!-- #region pre -->

# FormView

###### A container view that groups controls together for entering data, like a settings screen.

```ts
interface FormViewSignature {
  Attributes: {
    'navigation-link-indicator-visibility'?: 'hidden' // Hides accessories like right-arrow-chevron on NavigationLink buttons inside.
  }

  Slots: {
    default: HTMLElement[] // The default slot
  }
}

class FormView extends HTMLFormElement<FormViewSignature> {}

declare global {
  interface HTMLFormElement {
    is: 'form-view' // <form is="form-view"></form>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

<!-- #endregion post -->
