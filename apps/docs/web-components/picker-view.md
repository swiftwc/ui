<!-- #region pre -->

# PickerView

###### A control that selects one value from a set of options.

```ts
interface PickerViewSignature {
  Attributes: {
    'label-value-placement'?: 'vertical' | 'horizontal' | 'auto'
    'horizontal-radio-group-layout'?: boolean
    prompt?: string
    'prompt-icon'?: string
    label?: string
    name?: string
    'picker-style'?: 'menu' | 'inline' | 'navigation-link' | 'sheet' | 'automatic'
    selection?: string
    searchable?: boolean
    'current-value-label'?: string
    'current-value-icon'?: string
    help?: string // Adds a help tooltip to the trigger of the picker, if style supports one
    dictionary?: Array<DictEntry> // Renders all options using this array
    required?: boolean
  }

  Slots: {
    default: HTMLElement[] // The default slot.
    label: HTMLElement[]
    list: HTMLElement[]
    'validity-options': HTMLOptionElement[]
  }
}

class PickerView extends HTMLElement<PickerViewSignature> {
  static formAssociated = true

  selection: string
  readonly template: DocumentFragment
  readonly pickerStyle: 'automatic' | 'menu' | 'inline' | 'navigation-link' | 'sheet' | 'radio-group'
  readonly name: string // Form participation property

  setValidity(): void
  setCustomValidity(): void
}

declare global {
  interface HTMLElementTagNameMap {
    'picker-view': PickerView // <picker-view></picker-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
