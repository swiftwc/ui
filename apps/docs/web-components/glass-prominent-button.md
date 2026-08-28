<!-- #region pre -->

# GlassProminentButton

###### A control that starts an action. Styled with a prominent glass border, adapting to the button’s surroundings.

```ts
interface GlassProminentButtonSignature {
  Attributes: {
    role?: 'destructive' | 'confirm' // A value that describes the purpose of a button
    'title-key'?: string
  }

  Slots: {
    overlay: HTMLElement[]
  }
}

class GlassProminentButton extends HTMLButtonElement<GlassProminentButtonSignature> {}

declare global {
  interface HTMLButtonElement {
    is: 'glass-prominent-button' // <button is="glass-prominent-button"></button>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Topics

**Creating a prominent glass button:**

```html
<button is="glass-prominent-button">
  <label-view system-image="hand-tap" title="Tap Me"></label-view>
</button>
```

## Relationships

### Conforms To

`HTMLButtonElement`

<!-- #endregion post -->
