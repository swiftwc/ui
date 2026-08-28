<!-- #region pre -->

# VKeyboard

###### Required component, used to handle the virtual keyboard on touch devices.

```ts
interface VKeyboardSignature {
  Attributes: {
    'system-font'?: 'Inter' // Prefers the "Inter" font family, if loaded.
  }
}

class VKeyboard extends HTMLElement<VKeyboardSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'v-keyboard': VKeyboard // <v-keyboard></v-keyboard>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
