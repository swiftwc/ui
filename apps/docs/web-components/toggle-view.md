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

## Overview

You create a toggle by providing an `is-on` attribute and a `label` attribute.

::::: info &nbsp;

{% demo toggle-view/demo-full h-30 %}

:::: details View code {open .mt-0! .rounded-t-none!}

::: code-group

```html [HTML]
<toggle-view is-on>
  <label-view slot="label" title="Vibrate on Ring" system-image="vibrate"></label-view>
  <label-view slot="label" title="Enable vibration when the phone rings"></label-view>
</toggle-view>
```

<<< @/public/examples/toggle-view/demo-full.html#html{17-20}

:::

::::
:::::

<!-- #region post -->

## Topics

**Creates a toggle that displays a custom label:**

```html
<toggle-view label="Custom Label"></toggle-view>
```

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
