<!-- #region pre -->

# LabeledContent

###### A container view that pairs a label with a value.

```ts
interface LabeledContentSignature {
  Attributes: {
    value?: string
    label?: string
    header?: string
    footer?: string
    'labeled-content-style'?: 'vertical' | 'horizontal' // Use this to force a specific style.
    format?: '<format-type>:<locale?>:<format-options?>' // Use this to format the text inside the value attribute. For example `format="currency::currency=USD" value="1234.5"` produces a value of `$1,234.50`.
  }

  Slots: {
    default: HTMLElement[] // The default slot.
    label: HTMLElement[] // Use the `slot="label"` attribute to place childen in the label block.
    header: HTMLElement[]
    footer: HTMLElement[]
  }

  Parts: {
    'labeled-content-container': never
    'labeled-content-stack': never
    'labeled-content-label-stack': never
    'labeled-content-value-stack': never
  }
}

class LabeledContent extends HTMLElement<LabeledContentSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'labeled-content': LabeledContent // <labeled-content></labeled-content>
  }
}
```

<!-- #endregion pre -->

## Overview

You can assemble labeled content with by providing an `value` attribute and a `label` attribute.

::::: info &nbsp;

{% demo labeled-content/demo-full h-30 %}

:::: details View code {open .mt-0! .rounded-t-none!}

::: code-group

```html [HTML]
<labeled-content label="Age" value="6" format="unit::unit=year&unitDisplay=long"></labeled-content>
```

<<< @/public/examples/labeled-content/demo-full.html#html{18}

:::

::::
:::::

<!-- #region post -->

## Topics

**Creates a standard labeled element, with a view that conveys the value of the element and a label:**

```html
<labeled-content label="Label" value="Content"></labeled-content>
```

**Creates a labeled element from a formatted value:**

```html
<labeled-content label="Height" value="6" format="unit::unit=foot"></labeled-content>
```

**Creates a labeled element that displays a custom label and a custom subtitle to the label:**

```html
<labeled-content value="Content">
  <label-view slot="label" title="Custom Value"></label-view>
  <label-view slot="label" title="Custom Subtitle Value"></label-view>
</labeled-content>
```

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
