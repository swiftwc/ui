<!-- #region pre -->

# GlassButton

###### A control that starts an action. Styled with a glass border, adapting to the button’s surroundings.

```ts
interface GlassButtonSignature {
  Declaration: '<button is="glass-button"></button>'

  Attributes: {
    role?: 'destructive' | 'confirm' // A value that describes the purpose of a button
    'title-key'?: string
  }

  Slots: {
    overlay: HTMLElement[]
  }
}

class GlassButton extends HTMLButtonElement<GlassButtonSignature> {}
```

<!-- #endregion pre -->

<!-- #region post -->

## Topics

**Creating a glass button:**

```html
<button is="glass-button">
  <label-view system-image="hand-tap" title="Tap Me"></label-view>
</button>
```

## Relationships

### Conforms To

`HTMLButtonElement`

<!-- #endregion post -->
