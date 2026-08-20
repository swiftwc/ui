<!-- #region pre -->

# TextField

###### A control that displays an editable text area.

```ts
interface TextFieldSignature {
  Declaration: '<form is="text-field"></form>'

  Attributes: {
    prompt: string
    minimum: string
    maximum: string
    'min-length': string
    'max-length': string
    label: string
    name: string
    text: string
    'text-input-autocapitalization': string
    'disable-autocorrection': boolean
    'keyboard-type': 'decimal-pad' | 'number-pad' | 'default'
    required: boolean
    disabled: boolean
  }

  Slots: {
    label: []
    'validity-options': []
  }
}

class TextField extends HTMLFormElement<TextFieldSignature> {
  readonly keyboardType: 'decimal-pad' | 'number-pad' | 'default'
  text: string
  readonly name: string // Form participation property
  readonly value: string
  readonly valueAsNumber: number | ''
  readonly negativeNumbersAllowed: boolean

  setValidity(): void
  setCustomValidity(): void
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLFormElement`

<!-- #endregion post -->
