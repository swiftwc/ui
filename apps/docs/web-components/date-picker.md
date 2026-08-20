<!-- #region pre -->

# DatePicker

###### A control that selects an absolute date.

```ts
interface DatePickerSignature {
  Declaration: '<form is="date-picker"></form>'

  Attributes: {
    'date-picker-style': 'graphical' | 'field' | 'automatic' // The style of this element
    required: boolean
    prompt: string
    label: string
    name: string
    selection: string
    disabled: boolean
    minimum: string
    maximum: string
  }
}

class DatePicker extends HTMLFormElement<DatePickerSignature> {
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
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLFormElement`

<!-- #endregion post -->
