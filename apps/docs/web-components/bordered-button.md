<!-- #region pre -->

# BorderedButton

###### A control that starts an action. Styled with a standard border, adapting to the button’s surroundings.

```ts
interface BorderedButtonSignature {
  Attributes: {
    role?: 'destructive' | 'confirm' // A value that describes the purpose of a button
    'title-key'?: string
  }

  Slots: {
    overlay: HTMLElement[]
  }
}

class BorderedButton extends HTMLButtonElement<BorderedButtonSignature> {}

declare global {
  interface HTMLButtonElement {
    is: 'bordered-button' // <button is="bordered-button"></button>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Topics

**Creating a bordered button:**

```html
<button is="bordered-button">
  <label-view system-image="hand-tap" title="Tap Me"></label-view>
</button>
```

## Relationships

### Conforms To

`HTMLButtonElement`

<!-- #endregion post -->
