<!-- #region pre -->

# DatePicker

###### A control that selects an absolute date.

```ts
interface DatePickerSignature {
  Declaration: '<date-picker></date-picker>'

  Attributes: {
    'date-picker-style'?: 'graphical' | 'field' | 'automatic' // The style of this element
    required?: boolean
    prompt?: string
    label?: string
    name?: string
    selection?: string
    disabled?: boolean
    minimum?: string
    maximum?: string
  }
}

class DatePicker extends HTMLElement<DatePickerSignature> {
  static formAssociated = true

  readonly template: DocumentFragment
  readonly datePickerStyle: 'graphical' | 'field' | 'automatic'
  readonly name: string // Form participation property
  readonly value: { year: string; month: string; day: string }
  readonly valueAsDate: Date | null // Returns the value as a Date object.
  readonly minimum: { year: string; month: string; day: string } | null
  readonly maximum: { year: string; month: string; day: string } | null

  setValidity(): void
  setCustomValidity(): void
}

declare global {
  interface HTMLElementTagNameMap {
    'date-picker': DatePicker
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
