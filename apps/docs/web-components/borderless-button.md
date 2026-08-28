<!-- #region pre -->

# BorderlessButton

###### A control that starts an action. Styled without any borders.

```ts
interface BorderlessButtonSignature {
  Attributes: {
    role?: 'destructive' | 'confirm' // A value that describes the purpose of a button
    'title-key'?: string
  }

  Slots: {
    overlay: HTMLElement[]
  }
}

class BorderlessButton extends HTMLButtonElement<BorderlessButtonSignature> {}

declare global {
  interface HTMLButtonElement {
    is: 'borderless-button' // <button is="borderless-button"></button>
  }
}
```

<!-- #endregion pre -->

## Overview

You create a button by providing an action and a label.

::::: info &nbsp;

{% demo borderless-button/demo-full h-60 %}

:::: details View code {open .mt-0! .rounded-t-none!}

::: code-group

```html [HTML]
<button is="borderless-button" type="button">
  <label-view title="Hello world!" system-image="hand-waving"></label-view>
</button>
```

<<< @/public/examples/borderless-button/demo-full.html#html{30-32}

:::

::::
:::::

<!-- #region post -->

## Topics

**Use the `is` attribute to style a `button` as a `borderless-button`:**

```html
<button is="borderless-button">
  <label-view system-image="hand-tap" title="Tap Me"></label-view>
</button>
```

## Relationships

### Conforms To

`HTMLButtonElement`

<!-- #endregion post -->
