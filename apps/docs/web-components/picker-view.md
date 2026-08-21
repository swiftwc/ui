<!-- #region pre -->

# PickerView

###### A control that selects one value from a set of options.

```ts
interface PickerViewSignature {
  Declaration: '<picker-view></picker-view>'

  Attributes: {
    'picker-style'?: 'menu' | 'inline' | 'navigation-link' | 'sheet' | 'automatic'
    dictionary?: 'DictEntry[]' // Renders all options using this array
    'label-value-placement'?: 'vertical' | 'horizontal' | 'auto'
  }

  Slots: {
    default: HTMLElement[] // The default slot.
    label: HTMLElement[]
    list: HTMLElement[]
    'validity-options': HTMLElement[]
  }
}

class PickerView extends HTMLElement<PickerViewSignature> {
  static formAssociated = true

  selection: string
  readonly template: DocumentFragment
  readonly pickerStyle: 'automatic' | 'menu' | 'inline' | 'navigation-link' | 'sheet'
  readonly name: string // Form participation property

  setValidity(): void
  setCustomValidity(): void
}

declare global {
  interface HTMLElementTagNameMap {
    'picker-view': PickerView
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
