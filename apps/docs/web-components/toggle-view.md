<!-- #region pre -->

# ToggleView

###### A control that switches between on and off states.

```ts
interface ToggleViewSignature {
  Declaration: '<form is="toggle-view"></form>'

  Attributes: {
    label: string
    name: string
    value: string
    'is-on': boolean
    'keyboard-type': string
    required: boolean
    disabled: boolean
  }

  Slots: {
    label: []
    'validity-options': []
  }

  Events: {
    'toggle:change': CustomEvent<{ value: string }> // User toggled the control
  }
}

class ToggleView extends HTMLFormElement<ToggleViewSignature> {
  readonly toggleStyle: 'button' | 'switch'
  isOn: boolean
  readonly name: string // Form participation property
  value: string | null

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
