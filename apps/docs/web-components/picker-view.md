<!-- #region pre -->

# PickerView

###### A control that selects one value from a set of options.

```ts
interface PickerViewSignature {
  Declaration: '<form is="picker-view"></form>'

  Attributes: {
    'picker-style': 'menu' | 'inline' | 'navigation-link' | 'sheet' | 'automatic'
    dictionary: 'DictEntry[]' // Renders all options using this array
    'label-value-placement': 'vertical' | 'horizontal' | 'auto'
  }

  Slots: {
    default: [] // The default slot.
    label: []
    list: []
    'validity-options': []
  }
}

class PickerView extends HTMLFormElement<PickerViewSignature> {
  selection: string
  readonly template: DocumentFragment
  readonly pickerStyle: 'automatic' | 'menu' | 'inline' | 'navigation-link' | 'sheet'
  readonly name: string // Form participation property

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
