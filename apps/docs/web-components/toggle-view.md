<!-- #region pre -->

# ToggleView

###### A control that switches between on and off states.

```ts
interface ToggleViewSignature {
  Attributes: {
    label?: string
    name?: string
    value?: string
    'is-on'?: boolean
    'keyboard-type'?: string
    required?: boolean
    disabled?: boolean
  }

  Slots: {
    label: HTMLElement[]
    'validity-options': HTMLOptionElement[]
  }
}

class ToggleView extends HTMLElement<ToggleViewSignature> {
  static formAssociated = true

  readonly toggleStyle: 'button' | 'switch'
  isOn: boolean
  readonly name: string // Form participation property
  value: string | null

  setValidity(): void
  setCustomValidity(): void
}

interface GlobalEventMap<Targets = HTMLElementEventMap | DocumentEventMap | WindowEventMap> {
  'toggle:change': CustomEvent // User toggled the control
}

declare global {
  interface HTMLElementTagNameMap {
    'toggle-view': ToggleView // <toggle-view></toggle-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
