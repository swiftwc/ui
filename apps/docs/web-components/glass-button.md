<!-- #region pre -->

# GlassButton

###### A control that starts an action. Styled with a glass border, adapting to the button’s surroundings.

```ts
interface GlassButtonSignature {
  Attributes: {
    role?: 'destructive' | 'confirm' // A value that describes the purpose of a button
    'title-key'?: string
  }

  Slots: {
    overlay: HTMLElement[]
  }
}

class GlassButton extends HTMLButtonElement<GlassButtonSignature> {}

declare global {
  interface HTMLButtonElement {
    is: 'glass-button' // <button is="glass-button"></button>
  }
}
```

<!-- #endregion pre -->

## Overview

You create a button by providing an action and a label.

::::: info &nbsp;

{% demo glass-button/demo-full h-60 %}

:::: details View code {open .mt-0! .rounded-t-none!}

::: code-group

```html [HTML]
<button is="glass-button" type="button">
  <label-view title="Tap here" system-image="hand-tap"></label-view>
</button>
```

<<< @/public/examples/glass-button/demo-full.html#html{30-32}

:::

::::
:::::

<!-- #region post -->

## Topics

**Use the `is` attribute to style a `button` as a glass button:**

```html
<button is="glass-button">
  <label-view system-image="hand-tap" title="Tap Me"></label-view>
</button>
```

## Relationships

### Conforms To

`HTMLButtonElement`

<!-- #endregion post -->
