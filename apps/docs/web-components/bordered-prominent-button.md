<!-- #region pre -->

# BorderedProminentButton

###### A control that starts an action. Styled with a prominent border, adapting to the button’s surroundings.

```ts
interface BorderedProminentButtonSignature {
  Declaration: '<button is="bordered-prominent-button"></button>'

  Attributes: {
    role: 'destructive' | 'confirm' // A value that describes the purpose of a button
    'title-key': string
  }

  Slots: {
    overlay: []
  }
}

class BorderedProminentButton extends HTMLButtonElement<BorderedProminentButtonSignature> {}
```

<!-- #endregion pre -->

<!-- #region post -->

## Topics

**Creating a prominent bordered button:**

```html
<button is="bordered-prominent-button">
  <label-view system-image="hand-tap" title="Tap Me"></label-view>
</button>
```

## Relationships

### Conforms To

`HTMLButtonElement`

<!-- #endregion post -->
