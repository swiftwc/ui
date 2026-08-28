<!-- #region pre -->

# TextField

###### A control that displays an editable text area.

```ts
interface TextFieldSignature {
  Attributes: {
    prompt?: string
    minimum?: string
    maximum?: string
    'min-length'?: string
    'max-length'?: string
    label?: string
    name?: string
    text?: string
    'text-input-autocapitalization'?: string
    'disable-autocorrection'?: boolean
    'keyboard-type'?: 'decimal-pad' | 'number-pad' | 'default'
    required?: boolean
    disabled?: boolean
  }

  Slots: {
    label: HTMLElement[]
    'validity-options': HTMLOptionElement[]
  }
}

class TextField extends HTMLElement<TextFieldSignature> {
  static formAssociated = true

  readonly keyboardType: 'decimal-pad' | 'number-pad' | 'default'
  text: string
  readonly name: string // Form participation property
  readonly value: string
  readonly valueAsNumber: number | ''
  readonly negativeNumbersAllowed: boolean

  setValidity(): void
  setCustomValidity(): void
}

interface GlobalEventMap<Targets = HTMLElementEventMap | DocumentEventMap | WindowEventMap> {
  commit: CustomEvent<{ detail: { text: string } }> // Triggered when user interacts with the input area
}

declare global {
  interface HTMLElementTagNameMap {
    'text-field': TextField // <text-field></text-field>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
