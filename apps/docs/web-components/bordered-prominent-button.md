<!-- #region pre -->

# BorderedProminentButton

###### A control that starts an action. Styled with a prominent border, adapting to the button’s surroundings.

```ts
interface BorderedProminentButtonSignature {
  Attributes: {
    role?: 'destructive' | 'confirm' // A value that describes the purpose of a button
    'title-key'?: string
  }

  Slots: {
    overlay: HTMLElement[]
  }
}

class BorderedProminentButton extends HTMLButtonElement<BorderedProminentButtonSignature> {}

declare global {
  interface HTMLButtonElement {
    is: 'bordered-prominent-button' // <button is="bordered-prominent-button"></button>
  }
}
```

<!-- #endregion pre -->

## Overview

You create a button by providing an action and a label.

::::: info &nbsp;

{% example bordered-prominent-button/demo-full h-60 %}

:::: details View code {open .mt-0! .rounded-t-none!}

::: code-group

```html [HTML]
<button is="bordered-prominent-button" type="button">
  <label-view title="Tap here" system-image="hand-tap"></label-view>
</button>
```

<<< @/public/examples/bordered-prominent-button/demo-full.html#html{30-32}

:::

::::
:::::

<!-- #region post -->

## Topics

**Use the `is` attribute to style a `button` as a bordered prominent button:**

```html
<button is="bordered-prominent-button">
  <label-view system-image="hand-tap" title="Tap Me"></label-view>
</button>
```

## Relationships

### Conforms To

`HTMLButtonElement`

<!-- #endregion post -->
